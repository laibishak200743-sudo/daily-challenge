import Stripe from "stripe";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const firebaseApp =
  getApps()[0] ||
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    }),
  });

const db = getFirestore(firebaseApp);

function getPlan(reference: string) {
  const i = reference.lastIndexOf("_");
  return reference.slice(i + 1);
}

function getUserId(reference: string) {
  const i = reference.lastIndexOf("_");
  return reference.slice(0, i);
}

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      service: "WanderWise Pro Stripe Webhook",
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const signature = req.headers["stripe-signature"];

  if (!signature) {
    return res.status(400).json({ error: "Missing Stripe signature." });
  }

  let event: Stripe.Event;

  try {
    const body =
      typeof req.body === "string"
        ? req.body
        : JSON.stringify(req.body);

    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return res.status(400).json({ error: "Invalid Stripe webhook signature." });
  }

  try {
    if (event.type !== "checkout.session.completed") {
      return res.status(200).json({ received: true, ignored: true });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (session.payment_status !== "paid") {
      return res.status(200).json({ received: true, updated: false });
    }

    const reference = session.client_reference_id;

    if (!reference) {
      return res.status(400).json({ error: "Missing client_reference_id." });
    }

    const userId = getUserId(reference);
    const plan = getPlan(reference);

    if (!userId || !["monthly", "annual", "lifetime"].includes(plan)) {
      return res.status(400).json({ error: "Invalid client_reference_id." });
    }

    await db.collection("users").doc(userId).set(
      {
        plan,
        updatedAt: new Date(),
        stripeCustomerId:
          typeof session.customer === "string"
            ? session.customer
            : null,
        stripeCheckoutSessionId: session.id,
      },
      { merge: true }
    );

    return res.status(200).json({
      received: true,
      updated: true,
      userId,
      plan,
    });
  } catch {
    return res.status(500).json({ error: "Webhook processing failed." });
  }
}