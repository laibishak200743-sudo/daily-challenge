const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  zh: 'Chinese (Simplified)',
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
  response.setHeader('Content-Type', 'application/json');
  response.setHeader('Cache-Control', 'no-store');
  response.json(body);
};

export default async function handler(
  request: any,
  response: any
) {
  if (request.method !== 'POST') {
    return sendJson(
      response,
      { error: 'Method not allowed' },
      405
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return sendJson(
      response,
      { error: 'GEMINI_API_KEY is not configured' },
      503
    );
  }

  const body = (request.body ?? {}) as RequestBody;
  const language = body.language ?? 'en';
  const category = body.category ?? 'trivia';
  const difficulty = body.difficulty ?? 'medium';

  if (
    !LANGUAGE_NAMES[language] ||
    !CATEGORY_NAMES[category] ||
    !DIFFICULTY_NAMES[difficulty]
  ) {
    return sendJson(
      response,
      { error: 'Invalid challenge parameters' },
      400
    );
  }

  const excluded = Array.isArray(body.excluded)
    ? body.excluded
        .filter(
          (item): item is string =>
            typeof item === 'string'
        )
        .slice(-120)
    : [];

  const languageName = LANGUAGE_NAMES[language];
  const categoryName = CATEGORY_NAMES[category];
  const difficultyName = DIFFICULTY_NAMES[difficulty];

  const excludedText = excluded.length
    ? excluded.map((item) => `- ${item}`).join('\n')
    : '- none';

  const categoryRules =
    category === 'trivia'
      ? `Create a factual general-knowledge multiple-choice question. It must have one objectively correct answer and three plausible but incorrect answers. Avoid politics, current events, medical diagnosis, and ambiguous facts.`
      : `Create a word puzzle suitable for a general audience. It must have one objectively correct answer and three plausible incorrect answers. The word, clue, and all answer choices must be natural in ${languageName}. Do not simply ask for the number of letters in a fixed English word.`;

  const localizationRules =
    language === 'en'
      ? `Use natural English throughout.`
      : `EVERY human-readable part of the challenge MUST be written in ${languageName}.
- Translate/localize answer choices, not only the question.
- Translate country names, city names, geographic names, and other proper names into the standard form normally used in ${languageName} whenever such a localized form exists.
- Examples for Arabic: Egypt = مصر, Mexico = المكسيك, Greece = اليونان, Peru = بيرو.
- Do not leave English country names such as "Mexico" or "Greece" in a non-English challenge when a standard localized name exists.
- Do not mix English answer choices into a ${languageName} question.
- Numbers, mathematical symbols, and universally recognized abbreviations may remain in their conventional form when appropriate.
- If a proper name truly has no standard localized form, the original name may be retained.`;

  const prompt = `
You generate ONE fresh question for a daily challenge game.

Target language: ${languageName}
Category: ${categoryName}
Difficulty: ${difficultyName}

STRICT LANGUAGE REQUIREMENTS:
${localizationRules}

GENERAL REQUIREMENTS:
- Write the question entirely in ${languageName}.
- Write ALL FOUR answer choices entirely in ${languageName}.
- Write the explanation entirely in ${languageName}.
- There must be exactly 4 answer choices.
- The answer field is a zero-based integer from 0 to 3.
- The correct answer MUST exactly match options[answer].
- Make the question genuinely different from the excluded questions below.
- Do not mention that you are an AI.
- Do not use markdown.
- Return ONLY valid JSON matching exactly this shape:
{
  "question": "...",
  "options": ["...", "...", "...", "..."],
  "answer": 0,
  "explanation": "..."
}

Before returning the JSON, silently check that:
1. The question is in ${languageName}.
2. Every option is in ${languageName}.
3. The explanation is in ${languageName}.
4. No option is accidentally left in English when a localized ${languageName} form exists.
5. The correct option matches the answer index exactly.

CATEGORY-SPECIFIC RULE:
${categoryRules}

Previously used question keys. DO NOT repeat them:
${excludedText}
`;

  try {
    const aiResponse = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' +
        encodeURIComponent(apiKey),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.95,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!aiResponse.ok) {
      return sendJson(
        response,
        { error: 'AI generation failed' },
        502
      );
    }

    const result = await aiResponse.json();
    const text =
      result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (typeof text !== 'string') {
      return sendJson(
        response,
        { error: 'AI returned no content' },
        502
      );
    }

    let generated: unknown;

    try {
      generated = JSON.parse(text);
    } catch {
      const cleaned = text
        .replace(/^```json\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();
      generated = JSON.parse(cleaned);
    }

    const item = generated as {
      question?: unknown;
      options?: unknown;
      answer?: unknown;
      explanation?: unknown;
    };

    if (
      typeof item.question !== 'string' ||
      !Array.isArray(item.options) ||
      item.options.length !== 4 ||
      !item.options.every(
        (option) => typeof option === 'string'
      ) ||
      typeof item.answer !== 'number' ||
      !Number.isInteger(item.answer) ||
      item.answer < 0 ||
      item.answer > 3 ||
      typeof item.explanation !== 'string' ||
      item.options[item.answer] === undefined
    ) {
      return sendJson(
        response,
        { error: 'AI returned invalid challenge data' },
        502
      );
    }

    return sendJson(response, {
      id: `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}`,
      question: item.question,
      options: item.options,
      answer: item.answer,
      explanation: item.explanation,
    });
  } catch {
    return sendJson(
      response,
      { error: 'AI request failed' },
      502
    );
  }
}
