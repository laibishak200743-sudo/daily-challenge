declare const process: {
  env: Record<string, string | undefined>;
};

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  zh: 'Chinese',
  hi: 'Hindi',
  es: 'Spanish',
  fr: 'French',
  ar: 'Arabic',
  bn: 'Bengali',
  pt: 'Portuguese',
  ru: 'Russian',
  ur: 'Urdu',
};

const CATEGORY_NAMES: Record<string, string> = {
  trivia: 'general knowledge',
  word: 'word puzzle',
};

const DIFFICULTY_NAMES: Record<string, string> = {
  easy: 'easy',
  medium: 'medium',
  hard: 'hard',
};

type RequestBody = {
  language?: string;
  category?: string;
  difficulty?: string;
  excluded?: string[];
};

const sendJson = (
  response: any,
  body: unknown,
  status = 200
) => {
  response.status(status);
  response.setHeader(
    'Content-Type',
    'application/json; charset=utf-8'
  );
  response.setHeader(
    'Cache-Control',
    'no-store, max-age=0'
  );
  return response.json(body);
};

const getApiKey = () => {
  /*
   * GOOGLE_API_KEY is preferred because the current
   * Gemini documentation supports it and gives it
   * priority when both variables exist.
   *
   * GEMINI_API_KEY is kept as a fallback so the
   * existing Vercel setup can continue to work.
   */
  const googleKey =
    typeof process.env.GOOGLE_API_KEY === 'string'
      ? process.env.GOOGLE_API_KEY.trim()
      : '';

  if (googleKey) {
    return googleKey;
  }

  const geminiKey =
    typeof process.env.GEMINI_API_KEY === 'string'
      ? process.env.GEMINI_API_KEY.trim()
      : '';

  return geminiKey;
};

export default async function handler(
  request: any,
  response: any
) {
  /*
   * Health check:
   * Open /api/generate-challenge in a browser.
   *
   * This never returns the API key itself.
   */
  if (request.method === 'GET') {
    const apiKey = getApiKey();

    return sendJson(response, {
      ok: true,
      apiKeyConfigured: Boolean(apiKey),
      vercelEnv:
        process.env.VERCEL_ENV ?? 'unknown',
      vercelRegion:
        process.env.VERCEL_REGION ?? 'unknown',
      nodeEnv:
        process.env.NODE_ENV ?? 'unknown',
    });
  }

  if (request.method !== 'POST') {
    return sendJson(
      response,
      {
        error: 'Method not allowed',
      },
      405
    );
  }

  const apiKey = getApiKey();

  if (!apiKey) {
    return sendJson(
      response,
      {
        error:
          'No Gemini API key is available to the Vercel Function.',
        message:
          'Add GOOGLE_API_KEY to Production Environment Variables and redeploy.',
      },
      503
    );
  }

  const body =
    (request.body ?? {}) as RequestBody;

  const language =
    typeof body.language === 'string'
      ? body.language
      : 'en';

  const category =
    typeof body.category === 'string'
      ? body.category
      : 'trivia';

  const difficulty =
    typeof body.difficulty === 'string'
      ? body.difficulty
      : 'medium';

  if (
    !LANGUAGE_NAMES[language] ||
    !CATEGORY_NAMES[category] ||
    !DIFFICULTY_NAMES[difficulty]
  ) {
    return sendJson(
      response,
      {
        error:
          'Invalid challenge parameters.',
      },
      400
    );
  }

  const excluded = Array.isArray(
    body.excluded
  )
    ? body.excluded
        .filter(
          (item): item is string =>
            typeof item === 'string'
        )
        .slice(-120)
    : [];

  const languageName =
    LANGUAGE_NAMES[language];

  const categoryName =
    CATEGORY_NAMES[category];

  const difficultyName =
    DIFFICULTY_NAMES[difficulty];

  const excludedText =
    excluded.length > 0
      ? excluded
          .map(
            (item) => `- ${item}`
          )
          .join('\n')
      : '- none';

  const categoryRules =
    category === 'trivia'
      ? `
Create a factual general-knowledge
multiple-choice question.

There must be exactly:
- one objectively correct answer
- three plausible incorrect answers

Avoid:
- politics
- current events
- medical diagnosis
- ambiguous facts
`
      : `
Create a word puzzle for a general
audience.

The clue, target word and every answer
choice must be natural in ${languageName}.

Do not make the puzzle depend on an
English-only word unless the target
language is English.
`;

  const prompt = `
You create one fresh daily challenge
for a multilingual game.

TARGET LANGUAGE: ${languageName}
CATEGORY: ${categoryName}
DIFFICULTY: ${difficultyName}

LANGUAGE REQUIREMENT — VERY IMPORTANT:

Every human-readable field MUST be
written naturally in ${languageName}.

This includes:
- question
- option 1
- option 2
- option 3
- option 4
- explanation

Do NOT write the answer choices in
English when the target language is
not English.

Do NOT write the question in the
target language while leaving the
answer choices in English.

For Arabic: use Arabic text.
For Chinese: use Chinese text.
For Hindi: use Hindi text.
For Spanish: use Spanish text.
For French: use French text.
For Bengali: use Bengali text.
For Portuguese: use Portuguese text.
For Russian: use Russian text.
For Urdu: use Urdu text.

Numbers and proper names can remain
unchanged when that is natural.

The challenge must be fresh and must
not repeat any excluded question.

${categoryRules}

Return ONLY valid JSON in exactly
this shape:

{
  "question": "...",
  "options": [
    "...",
    "...",
    "...",
    "..."
  ],
  "answer": 0,
  "explanation": "..."
}

Rules:
- exactly four options
- answer is an integer from 0 to 3
- options[answer] is the correct answer
- all four options are different
- no markdown
- no commentary outside the JSON

Previously used question keys:
${excludedText}
`;

  try {
    /*
     * Gemini currently recommends passing API keys
     * in the x-goog-api-key header.
     *
     * We use Gemini 3.5 Flash-Lite here because it
     * is a current stable, cost-efficient model for
     * high-throughput generation.
     */
    const aiResponse =
      await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
            'x-goog-api-key': apiKey,
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.95,
              responseMimeType:
                'application/json',
              maxOutputTokens: 700,
            },
          }),
        }
      );

    const rawText =
      await aiResponse.text();

    if (!aiResponse.ok) {
      let providerDetails =
        rawText.slice(0, 1500);

      try {
        const errorJson =
          JSON.parse(rawText);

        if (
          errorJson?.error?.message
        ) {
          providerDetails =
            String(
              errorJson.error.message
            );
        }
      } catch {
        // Keep the raw response text.
      }

      return sendJson(
        response,
        {
          error:
            'Gemini API request failed.',
          status:
            aiResponse.status,
          details:
            providerDetails,
        },
        502
      );
    }

    let result: any;

    try {
      result =
        JSON.parse(rawText);
    } catch {
      return sendJson(
        response,
        {
          error:
            'Gemini returned an invalid HTTP JSON response.',
        },
        502
      );
    }

    const text =
      result?.candidates?.[0]
        ?.content?.parts?.[0]?.text;

    if (
      typeof text !== 'string' ||
      !text.trim()
    ) {
      return sendJson(
        response,
        {
          error:
            'Gemini returned no challenge text.',
        },
        502
      );
    }

    let generated: any;

    try {
      generated = JSON.parse(text);
    } catch {
      const cleaned =
        text
          .replace(
            /^```json\s*/i,
            ''
          )
          .replace(
            /\s*```$/i,
            ''
          )
          .trim();

      try {
        generated =
          JSON.parse(cleaned);
      } catch {
        return sendJson(
          response,
          {
            error:
              'Gemini returned malformed challenge JSON.',
            details:
              text.slice(0, 1000),
          },
          502
        );
      }
    }

    const question =
      typeof generated?.question ===
      'string'
        ? generated.question.trim()
        : '';

    const options =
      Array.isArray(
        generated?.options
      )
        ? generated.options.map(
            (option: unknown) =>
              typeof option ===
              'string'
                ? option.trim()
                : ''
          )
        : [];

    const answer =
      generated?.answer;

    const explanation =
      typeof generated?.explanation ===
      'string'
        ? generated.explanation.trim()
        : '';

    if (
      !question ||
      options.length !== 4 ||
      options.some(
        (option: string) =>
          !option
      ) ||
      typeof answer !== 'number' ||
      !Number.isInteger(answer) ||
      answer < 0 ||
      answer > 3 ||
      !explanation
    ) {
      return sendJson(
        response,
        {
          error:
            'Gemini returned an invalid challenge structure.',
        },
        502
      );
    }

    if (
      new Set(options).size !==
      options.length
    ) {
      return sendJson(
        response,
        {
          error:
            'Gemini returned duplicate answer choices.',
        },
        502
      );
    }

    return sendJson(response, {
      id:
        `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}`,
      question,
      options,
      answer,
      explanation,
    });
  } catch (error) {
    return sendJson(
      response,
      {
        error:
          'Unexpected server error.',
        details:
          error instanceof Error
            ? error.message
            : String(error),
      },
      500
    );
  }
}
