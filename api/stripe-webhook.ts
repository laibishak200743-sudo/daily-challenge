import Stripe from 'stripe';

import {
  deleteApp,
  initializeApp,
  type Credential,
} from 'firebase-admin/app';

import { getFirestore } from 'firebase-admin/firestore';

import {
  IdentityPoolClient,
  type ExternalAccountSupplierContext,
  type SubjectTokenSupplier,
} from 'google-auth-library';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const firebaseProjectId =
  process.env.FIREBASE_PROJECT_ID ||
  process.env.GOOGLE_CLOUD_PROJECT ||
  'wanderwisepro';

if (!stripeSecretKey) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable.');
}

if (!stripeWebhookSecret) {
  throw new Error('Missing STRIPE_WEBHOOK_SECRET environment variable.');
}

const stripe = new Stripe(stripeSecretKey);

const WORKLOAD_IDENTITY_AUDIENCE =
  '//iam.googleapis.com/projects/1024865443465/locations/global/workloadIdentityPools/vercel/providers/vercel';

const FIREBASE_SERVICE_ACCOUNT_EMAIL =
  'firebase-adminsdk-fbsvc@wanderwisepro.iam.gserviceaccount.com';

const SERVICE_ACCOUNT_IMPERSONATION_URL =
  `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${encodeURIComponent(
    FIREBASE_SERVICE_ACCOUNT_EMAIL
  )}:generateAccessToken`;

type PremiumPlan =
  | 'monthly'
  | 'annual'
  | 'lifetime';

function getPlanFromClientReferenceId(
  clientReferenceId: string | null
): PremiumPlan | null {
  if (!clientReferenceId) {
    return null;
  }

  const separatorIndex =
    clientReferenceId.lastIndexOf('_');

  if (separatorIndex <= 0) {
    return null;
  }

  const possiblePlan =
    clientReferenceId.slice(separatorIndex + 1);

  if (
    possiblePlan === 'monthly' ||
    possiblePlan === 'annual' ||
    possiblePlan === 'lifetime'
  ) {
    return possiblePlan;
  }

  return null;
}

function getUserIdFromClientReferenceId(
  clientReferenceId: string | null
): string | null {
  if (!clientReferenceId) {
    return null;
  }

  const separatorIndex =
    clientReferenceId.lastIndexOf('_');

  if (separatorIndex <= 0) {
    return null;
  }

  const userId =
    clientReferenceId.slice(0, separatorIndex);

  return userId || null;
}

class VercelOidcSubjectTokenSupplier
  implements SubjectTokenSupplier
{
  private readonly token: string;

  constructor(token: string) {
    this.token = token;
  }

  async getSubjectToken(
    _context: ExternalAccountSupplierContext
  ): Promise<string> {
    return this.token;
  }
}

function createFirebaseCredential(
  vercelOidcToken: string
): Credential {
  const identityPoolClient =
    new IdentityPoolClient({
      audience: WORKLOAD_IDENTITY_AUDIENCE,
      subject_token_type:
        'urn:ietf:params:oauth:token-type:id_token',
      subject_token_supplier:
        new VercelOidcSubjectTokenSupplier(
          vercelOidcToken
        ),
      service_account_impersonation_url:
        SERVICE_ACCOUNT_IMPERSONATION_URL,
    });

  identityPoolClient.scopes = [
    'https://www.googleapis.com/auth/cloud-platform',
  ];

  const credential: Credential = {
    async getAccessToken() {
      const result =
        await identityPoolClient.getAccessToken();

      if (!result.token) {
        throw new Error(
          'Google Workload Identity Federation did not return an access token.'
        );
      }

      const expiryDate =
        identityPoolClient.credentials
          ?.expiry_date;

      const expiresIn =
        typeof expiryDate === 'number'
          ? Math.max(
              1,
              Math.floor(
                (expiryDate - Date.now()) / 1000
              )
            )
          : 3600;

      return {
        access_token: result.token,
        expires_in: expiresIn,
      };
    },
  };

  return credential;
}

async function createFirebaseApp() {
  /*
   * IMPORTANT:
   * The Stripe webhook request does NOT contain a Vercel OIDC token.
   *
   * Vercel provides the OIDC token to the running Vercel function
   * through the VERCEL_OIDC_TOKEN environment variable.
   */
  const vercelOidcToken =
    process.env.VERCEL_OIDC_TOKEN;

  if (!vercelOidcToken) {
    throw new Error(
      'Missing VERCEL_OIDC_TOKEN environment variable. Make sure Vercel OIDC Federation is enabled for this project.'
    );
  }

  const credential =
    createFirebaseCredential(
      vercelOidcToken
    );

  const appName =
    `stripe-webhook-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}`;

  return initializeApp(
    {
      credential,
      projectId: firebaseProjectId,
    },
    appName
  );
}

export async function POST(
  request: Request
) {
  const signature =
    request.headers.get('stripe-signature');

  if (!signature) {
    return Response.json(
      {
        error: 'Missing Stripe signature.',
      },
      {
        status: 400,
      }
    );
  }

  let event: Stripe.Event;

  try {
    const rawBody =
      await request.text();

    event =
      stripe.webhooks.constructEvent(
        rawBody,
        signature,
        stripeWebhookSecret
      );
  } catch (error) {
    console.error(
      'Stripe webhook signature verification failed:',
      error
    );

    return Response.json(
      {
        error:
          'Invalid Stripe webhook signature.',
      },
      {
        status: 400,
      }
    );
  }

  let firebaseApp:
    | ReturnType<typeof initializeApp>
    | null = null;

  try {
    if (
      event.type ===
      'checkout.session.completed'
    ) {
      const session =
        event.data.object as Stripe.Checkout.Session;

      console.log(
        'Stripe checkout.session.completed:',
        {
          sessionId: session.id,
          paymentStatus:
            session.payment_status,
          clientReferenceId:
            session.client_reference_id,
        }
      );

      if (
        session.payment_status !== 'paid'
      ) {
        console.log(
          'Payment is not marked as paid. No plan update.'
        );

        return Response.json({
          received: true,
          updated: false,
          reason:
            'Payment not completed.',
        });
      }

      const clientReferenceId =
        session.client_reference_id;

      const userId =
        getUserIdFromClientReferenceId(
          clientReferenceId
        );

      const plan =
        getPlanFromClientReferenceId(
          clientReferenceId
        );

      if (!userId || !plan) {
        console.error(
          'Invalid client_reference_id:',
          clientReferenceId
        );

        return Response.json(
          {
            error:
              'Invalid client_reference_id.',
          },
          {
            status: 400,
          }
        );
      }

      firebaseApp =
        await createFirebaseApp();

      const db =
        getFirestore(firebaseApp);

      const userRef = db
        .collection('users')
        .doc(userId);

      /*
       * Do not require the user document to already exist.
       * If it does not exist, Firestore will create it.
       */
      await userRef.set(
        {
          plan,
          updatedAt: new Date(),
          stripeCustomerId:
            typeof session.customer ===
            'string'
              ? session.customer
              : null,
          stripeCheckoutSessionId:
            session.id,
        },
        {
          merge: true,
        }
      );

      console.log(
        'Premium plan activated:',
        {
          userId,
          plan,
          sessionId: session.id,
        }
      );

      return Response.json({
        received: true,
        updated: true,
        userId,
        plan,
      });
    }

    return Response.json({
      received: true,
      ignored: true,
      eventType: event.type,
    });
  } catch (error) {
    console.error(
      'Stripe webhook processing error:',
      error
    );

    return Response.json(
      {
        error:
          'Webhook processing failed.',
      },
      {
        status: 500,
      }
    );
  } finally {
    if (firebaseApp) {
      try {
        await deleteApp(
          firebaseApp
        );
      } catch (error) {
        console.error(
          'Firebase app cleanup error:',
          error
        );
      }
    }
  }
}

export async function GET() {
  return Response.json({
    ok: true,
    service:
      'WanderWise Pro Stripe Webhook',
  });
}