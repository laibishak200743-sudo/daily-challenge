import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Globe,
  Shield,
  Loader2
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export function ItineraryGenerator() {
  const { theme } = useTheme();
  const { t, language } = useLanguage();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: t('ai.welcome'),
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();

    if (!loading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages, loading]);

  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1) {
        return [
          {
            ...prev[0],
            text: t('ai.welcome')
          }
        ];
      }

      return prev;
    });
  }, [language, t]);

  const quickPrompts = [
    t('ai.prompt1'),
    t('ai.prompt2'),
    t('ai.prompt3'),
    t('ai.prompt4')
  ];

  const getGeminiErrorMessage = (
    error: any
  ): string => {
    const status =
      error?.status ??
      error?.statusCode ??
      error?.response?.status;

    const message =
      error?.message ??
      error?.error?.message ??
      error?.response?.data?.error?.message ??
      '';

    const normalizedMessage =
      String(message).toLowerCase();

    console.error('Gemini API Error:', {
      status,
      message,
      error
    });

    if (
      status === 401 ||
      status === 403 ||
      normalizedMessage.includes('api key') ||
      normalizedMessage.includes('apikey') ||
      normalizedMessage.includes('api_key') ||
      normalizedMessage.includes('authentication') ||
      normalizedMessage.includes('unauthenticated')
    ) {
      return `Gemini API Key Error

${
  message ||
  'The Gemini API key is invalid, missing, or not authorized.'
}`;
    }

    if (
      status === 429 ||
      normalizedMessage.includes('quota') ||
      normalizedMessage.includes('rate limit') ||
      normalizedMessage.includes('resource exhausted')
    ) {
      return `Gemini API Limit Error

${
  message ||
  'The Gemini API request limit has been reached.'
}`;
    }

    if (
      status === 500 ||
      status === 502 ||
      status === 503 ||
      status === 504 ||
      normalizedMessage.includes('503') ||
      normalizedMessage.includes('service unavailable') ||
      normalizedMessage.includes('temporarily unavailable') ||
      normalizedMessage.includes('high demand')
    ) {
      return `Gemini Server Error (${status || 'temporary'})

${
  message ||
  'Gemini is temporarily unavailable. Please try again.'
}`;
    }

    if (
      status === 404 ||
      normalizedMessage.includes('not found') ||
      normalizedMessage.includes('model')
    ) {
      return `Gemini Model Error

${
  message ||
  'The selected Gemini model is unavailable.'
}`;
    }

    return `Gemini API Error${
      status ? ` (${status})` : ''
    }

${message || 'An unknown error occurred while contacting Gemini.'}`;
  };

  const callGeminiAI = async (
    query: string,
    retries = 2,
    delay = 2000
  ): Promise<string> => {
    try {
      const prompt = `
You are WanderWise Pro's professional travel AI assistant.

${t('ai.langInstruction')}

Your job is to help users with:
- Travel planning
- Destinations
- Itineraries
- Hotels
- Transportation
- Attractions
- Restaurants
- Travel tips
- Budget planning
- Packing suggestions
- General travel questions

Give accurate, useful, organized and friendly answers.

Use emojis when appropriate.
Use clear headings and bullet points when useful.
Do not invent specific current prices, opening hours, availability, or other time-sensitive facts if you cannot verify them.

User question:

${query}
      `.trim();

      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt
        })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const error: any = new Error(
          data?.error ||
            `Gemini API request failed with status ${response.status}.`
        );

        error.status = response.status;
        error.response = {
          data
        };

        throw error;
      }

      const responseText = data?.text;

      if (
        responseText &&
        typeof responseText === 'string' &&
        responseText.trim()
      ) {
        return responseText.trim();
      }

      console.error(
        'Gemini returned an empty response:',
        data
      );

      return t('ai.errorGeneric');
    } catch (error: any) {
      const status =
        error?.status ??
        error?.statusCode ??
        error?.response?.status;

      const message = String(
        error?.message ??
          error?.error?.message ??
          error?.response?.data?.error?.message ??
          ''
      );

      const normalizedMessage =
        message.toLowerCase();

      console.error(
        `Gemini request error - retries left: ${retries}`,
        {
          status,
          message,
          error
        }
      );

      const isTemporaryError =
        status === 429 ||
        status === 500 ||
        status === 502 ||
        status === 503 ||
        status === 504 ||
        normalizedMessage.includes('503') ||
        normalizedMessage.includes('high demand') ||
        normalizedMessage.includes(
          'temporarily unavailable'
        ) ||
        normalizedMessage.includes(
          'service unavailable'
        ) ||
        normalizedMessage.includes(
          'resource exhausted'
        ) ||
        normalizedMessage.includes(
          'rate limit'
        );

      if (retries > 0 && isTemporaryError) {
        console.log(
          `Retrying Gemini request in ${delay}ms...`
        );

        await new Promise((resolve) =>
          setTimeout(resolve, delay)
        );

        return callGeminiAI(
          query,
          retries - 1,
          delay * 2
        );
      }

      return getGeminiErrorMessage(error);
    }
  };

  const handleSendMessage = async (
    textToSend?: string
  ) => {
    const query = (
      textToSend !== undefined
        ? textToSend
        : inputQuery
    ).trim();

    if (!query || loading) {
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    setMessages((prev) => [
      ...prev,
      userMessage
    ]);

    if (textToSend === undefined) {
      setInputQuery('');
    }

    setLoading(true);

    try {
      const aiResponseText =
        await callGeminiAI(query);

      const aiMessage: Message = {
        id: `${Date.now()}-ai`,
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      setMessages((prev) => [
        ...prev,
        aiMessage
      ]);
    } catch (error) {
      console.error(
        'Unexpected ItineraryGenerator error:',
        error
      );

      const aiMessage: Message = {
        id: `${Date.now()}-ai-error`,
        sender: 'ai',
        text: getGeminiErrorMessage(error),
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      setMessages((prev) => [
        ...prev,
        aiMessage
      ]);
    } finally {
      setLoading(false);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const isLight = theme === 'light';
  const isRTL = language === 'ar';

  return (
    <div
      className={`min-h-screen pt-24 pb-12 transition-colors duration-300 ${
        isLight
          ? 'bg-slate-50'
          : 'bg-slate-950'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="max-w-4xl mx-auto px-4">

        <div className="text-center mb-8">
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-3 border shadow-sm ${
              isLight
                ? 'bg-cyan-50 text-cyan-600 border-cyan-200'
                : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
            }`}
          >
            <Sparkles className="w-4 h-4 animate-pulse" />

            <span>
              {t('ai.badge')}
            </span>
          </div>

          <h1
            className={`text-3xl font-extrabold tracking-tight mb-2 ${
              isLight
                ? 'text-slate-900'
                : 'text-white'
            }`}
          >
            {t('ai.title')}
          </h1>

          <p
            className={`text-sm max-w-lg mx-auto ${
              isLight
                ? 'text-slate-600'
                : 'text-slate-400'
            }`}
          >
            {t('ai.subtitle')}
          </p>
        </div>

        <div
          className={`border rounded-3xl shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col h-[550px] transition-colors duration-300 ${
            isLight
              ? 'bg-white border-slate-200 shadow-slate-200/50'
              : 'bg-slate-900 border-slate-800'
          }`}
        >

          <div
            className={`px-6 py-4 border-b flex items-center justify-between transition-colors duration-300 ${
              isLight
                ? 'bg-slate-50 border-slate-200'
                : 'bg-slate-950 border-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md">
                  <Bot className="w-5 h-5" />
                </div>

                <span
                  className={`absolute bottom-0 left-0 w-3 h-3 bg-emerald-500 border-2 rounded-full ${
                    isLight
                      ? 'border-slate-50'
                      : 'border-slate-950'
                  }`}
                />
              </div>

              <div>
                <h3
                  className={`text-sm font-bold ${
                    isLight
                      ? 'text-slate-900'
                      : 'text-white'
                  }`}
                >
                  WanderWise AI Expert
                </h3>

                <p className="text-[11px] text-cyan-500 font-medium">
                  {t('ai.connected')}
                </p>
              </div>
            </div>

            <div
              className={`hidden sm:flex items-center gap-3 text-xs ${
                isLight
                  ? 'text-slate-600'
                  : 'text-slate-400'
              }`}
            >
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-cyan-500" />
                {t('ai.flexibility')}
              </span>

              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                {t('ai.dynamicAnswers')}
              </span>
            </div>
          </div>

          <div
            ref={chatContainerRef}
            className={`flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 transition-colors duration-300 ${
              isLight
                ? 'bg-white'
                : 'bg-slate-900'
            }`}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${
                  msg.sender === 'user'
                    ? 'flex-row-reverse'
                    : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md'
                      : isLight
                        ? 'bg-cyan-50 text-cyan-600 border border-cyan-200'
                        : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  }`}
                >
                  {msg.sender === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>

                <div
                  className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-cyan-600 text-white rounded-tl-none'
                      : isLight
                        ? 'bg-slate-100 text-slate-800 border border-slate-200 rounded-tr-none'
                        : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tr-none'
                  }`}
                >
                  {msg.text}

                  <div
                    className={`text-[10px] mt-1.5 text-right opacity-60 ${
                      msg.sender === 'user'
                        ? 'text-cyan-100'
                        : isLight
                          ? 'text-slate-500'
                          : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    isLight
                      ? 'bg-cyan-50 text-cyan-600 border border-cyan-200'
                      : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  }`}
                >
                  <Bot className="w-4 h-4" />
                </div>

                <div
                  className={`border rounded-2xl px-4 py-3 text-sm flex items-center gap-2 ${
                    isLight
                      ? 'bg-slate-100 border-slate-200 text-slate-700'
                      : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-500" />

                  <span>
                    {t('ai.thinking')}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div
            className={`px-4 py-2.5 border-t flex items-center gap-2 overflow-x-auto no-scrollbar transition-colors duration-300 ${
              isLight
                ? 'bg-slate-50 border-slate-200'
                : 'bg-slate-950 border-slate-800'
            }`}
          >
            <span
              className={`text-xs shrink-0 font-medium ${
                isLight
                  ? 'text-slate-600'
                  : 'text-slate-400'
              }`}
            >
              {t('ai.quickPrompts')}
            </span>

            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() =>
                  handleSendMessage(prompt)
                }
                disabled={loading}
                className={`text-xs px-3 py-1.5 rounded-xl border transition-all shrink-0 whitespace-nowrap disabled:opacity-50 ${
                  isLight
                    ? 'bg-white hover:bg-cyan-50 text-slate-700 hover:text-cyan-600 border-slate-200 shadow-sm'
                    : 'bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border-slate-700'
                }`}
              >
                {prompt}
              </button>
            ))}
          </div>

          <div
            className={`p-4 border-t transition-colors duration-300 ${
              isLight
                ? 'bg-white border-slate-200'
                : 'bg-slate-950 border-slate-800'
            }`}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputQuery}
                onChange={(e) =>
                  setInputQuery(e.target.value)
                }
                disabled={loading}
                placeholder={t('ai.placeholder')}
                className={`flex-1 border rounded-2xl px-4 py-3 text-sm focus:outline-none transition-all shadow-inner disabled:opacity-60 ${
                  isLight
                    ? 'bg-slate-100 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-500'
                    : 'bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500'
                }`}
              />

              <button
                type="submit"
                disabled={
                  loading ||
                  !inputQuery.trim()
                }
                className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white rounded-2xl font-semibold shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 shrink-0"
              >
                <Send className="w-4 h-4 rotate-180" />

                <span className="hidden sm:inline">
                  {t('ai.send')}
                </span>
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ItineraryGenerator;