import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

const MODEL = 'gemini-3.6-flash';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed'
    });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || !apiKey.trim()) {
      console.error('GEMINI_API_KEY is missing.');

      return res.status(500).json({
        error:
          'GEMINI_API_KEY is missing from Vercel Environment Variables.'
      });
    }

    const { prompt } = req.body ?? {};

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({
        error: 'A valid prompt is required.'
      });
    }

    const ai = new GoogleGenAI({
      apiKey
    });

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt
    });

    const text = response.text?.trim();

    if (!text) {
      console.error('Gemini returned an empty response.');

      return res.status(502).json({
        error: 'Gemini returned an empty response.'
      });
    }

    return res.status(200).json({
      text
    });
  } catch (error: any) {
    console.error('Gemini API error:', error);

    const status =
      error?.status ??
      error?.statusCode ??
      500;

    const message =
      error?.message ||
      error?.error?.message ||
      'Unknown Gemini API error.';

    return res.status(
      status >= 400 && status < 600 ? status : 500
    ).json({
      error: message
    });
  }
}