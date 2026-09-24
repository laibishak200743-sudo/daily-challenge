import { useEffect, useMemo, useState } from 'react';

type Language =
  | 'en'
  | 'zh'
  | 'hi'
  | 'es'
  | 'fr'
  | 'ar'
  | 'bn'
  | 'pt'
  | 'ru'
  | 'ur';

type Category =
  | 'math'
  | 'logic'
  | 'trivia'
  | 'memory'
  | 'patterns'
  | 'word';

type Difficulty = 'easy' | 'medium' | 'hard';

type DifficultyMode = 'automatic' | Difficulty;
type CategoryMode = 'automatic' | Category;

type ThemeMode = 'light' | 'dark';

type Challenge = {
  id: string;
  category: Category;
  difficulty: Difficulty;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

type Translation = {
  appName: string;
  subtitle: string;
  todayChallenge: string;
  startChallenge: string;
  newChallenge: string;
  question: string;
  correct: string;
  accuracy: string;
  score: string;
  xp: string;
  streak: string;
  level: string;
  home: string;
  challenge: string;
  result: string;
  congratulations: string;
  completed: string;
  backHome: string;
  exit: string;
  exitTitle: string;
  exitText: string;
  cancel: string;
  yesExit: string;
  automatic: string;
  chooseDifficulty: string;
  difficultyAutoDescription: string;
  difficultyEasyDescription: string;
  difficultyMediumDescription: string;
  difficultyHardDescription: string;
  easy: string;
  medium: string;
  hard: string;
  math: string;
  logic: string;
  trivia: string;
  memory: string;
  patterns: string;
  word: string;
  time: string;
  correctAnswer: string;
  explanation: string;
  next: string;
  loading: string;
  dailyGoal: string;
  challenges: string;
  correctAnswers: string;
  bestStreak: string;
  levelProgress: string;
  ready: string;
};

const translations: Record<Language, Translation> = {
  en: {
    appName: 'Daily Challenge',
    subtitle: 'Think. Play. Improve. Every day.',
    todayChallenge: "Today's Challenge",
    startChallenge: 'Start Challenge',
    newChallenge: 'New Challenge',
    question: 'Question',
    correct: 'Correct',
    accuracy: 'Accuracy',
    score: 'Score',
    xp: 'XP',
    streak: 'Streak',
    level: 'Level',
    home: 'Home',
    challenge: 'Challenge',
    result: 'Result',
    congratulations: 'Congratulations!',
    completed: 'You completed today’s challenge.',
    backHome: 'Back to Home',
    exit: 'Exit',
    exitTitle: 'Leave challenge?',
    exitText: 'Your current progress will be lost.',
    cancel: 'Cancel',
    yesExit: 'Exit',
    automatic: 'Automatic',
    chooseDifficulty: 'Choose difficulty',
    difficultyAutoDescription:
      'Every question can have a different difficulty.',
    difficultyEasyDescription:
      'Relaxed questions for a smooth start.',
    difficultyMediumDescription:
      'A balanced challenge for your brain.',
    difficultyHardDescription:
      'Tough questions for experienced players.',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    math: 'Math',
    logic: 'Logic',
    trivia: 'Trivia',
    memory: 'Memory',
    patterns: 'Patterns',
    word: 'Words',
    time: 'Time',
    correctAnswer: 'Correct answer',
    explanation: 'Explanation',
    next: 'Next',
    loading: 'Generating...',
    dailyGoal: 'Daily Goal',
    challenges: 'Challenges',
    correctAnswers: 'Correct Answers',
    bestStreak: 'Best Streak',
    levelProgress: 'Level Progress',
    ready: 'Ready for today?',
  },

  zh: {
    appName: '每日挑战',
    subtitle: '思考、挑战、进步，每一天。',
    todayChallenge: '今日挑战',
    startChallenge: '开始挑战',
    newChallenge: '新挑战',
    question: '问题',
    correct: '正确',
    accuracy: '准确率',
    score: '分数',
    xp: '经验值',
    streak: '连续天数',
    level: '等级',
    home: '首页',
    challenge: '挑战',
    result: '结果',
    congratulations: '恭喜！',
    completed: '你完成了今天的挑战。',
    backHome: '返回首页',
    exit: '退出',
    exitTitle: '离开挑战？',
    exitText: '当前进度将会丢失。',
    cancel: '取消',
    yesExit: '退出',
    automatic: '自动',
    chooseDifficulty: '选择难度',
    difficultyAutoDescription:
      '每道题都可以拥有不同的难度。',
    difficultyEasyDescription:
      '轻松的问题，适合热身。',
    difficultyMediumDescription:
      '平衡的大脑挑战。',
    difficultyHardDescription:
      '为高手准备的高难度问题。',
    easy: '简单',
    medium: '中等',
    hard: '困难',
    math: '数学',
    logic: '逻辑',
    trivia: '知识',
    memory: '记忆',
    patterns: '规律',
    word: '单词',
    time: '时间',
    correctAnswer: '正确答案',
    explanation: '解释',
    next: '下一题',
    loading: '生成中...',
    dailyGoal: '每日目标',
    challenges: '挑战数',
    correctAnswers: '答对数',
    bestStreak: '最佳连续',
    levelProgress: '等级进度',
    ready: '准备好了吗？',
  },

  hi: {
    appName: 'डेली चैलेंज',
    subtitle: 'सोचो। खेलो। हर दिन बेहतर बनो।',
    todayChallenge: 'आज की चुनौती',
    startChallenge: 'चुनौती शुरू करें',
    newChallenge: 'नई चुनौती',
    question: 'प्रश्न',
    correct: 'सही',
    accuracy: 'सटीकता',
    score: 'स्कोर',
    xp: 'XP',
    streak: 'स्ट्रीक',
    level: 'लेवल',
    home: 'होम',
    challenge: 'चैलेंज',
    result: 'परिणाम',
    congratulations: 'बधाई!',
    completed: 'आपने आज की चुनौती पूरी कर ली।',
    backHome: 'होम पर वापस',
    exit: 'बाहर निकलें',
    exitTitle: 'चैलेंज छोड़ें?',
    exitText: 'आपकी वर्तमान प्रगति खो जाएगी।',
    cancel: 'रद्द करें',
    yesExit: 'बाहर निकलें',
    automatic: 'स्वचालित',
    chooseDifficulty: 'कठिनाई चुनें',
    difficultyAutoDescription:
      'हर प्रश्न की कठिनाई अलग हो सकती है।',
    difficultyEasyDescription:
      'आरामदायक प्रश्नों के साथ शुरुआत करें।',
    difficultyMediumDescription:
      'दिमाग के लिए संतुलित चुनौती।',
    difficultyHardDescription:
      'अनुभवी खिलाड़ियों के लिए कठिन प्रश्न।',
    easy: 'आसान',
    medium: 'मध्यम',
    hard: 'कठिन',
    math: 'गणित',
    logic: 'तर्क',
    trivia: 'ज्ञान',
    memory: 'याददाश्त',
    patterns: 'पैटर्न',
    word: 'शब्द',
    time: 'समय',
    correctAnswer: 'सही उत्तर',
    explanation: 'व्याख्या',
    next: 'अगला',
    loading: 'बनाया जा रहा है...',
    dailyGoal: 'दैनिक लक्ष्य',
    challenges: 'चुनौतियाँ',
    correctAnswers: 'सही उत्तर',
    bestStreak: 'सर्वश्रेष्ठ स्ट्रीक',
    levelProgress: 'लेवल प्रगति',
    ready: 'आज के लिए तैयार?',
  },

  es: {
    appName: 'Desafío Diario',
    subtitle: 'Piensa. Juega. Mejora. Cada día.',
    todayChallenge: 'Desafío de Hoy',
    startChallenge: 'Comenzar',
    newChallenge: 'Nuevo Desafío',
    question: 'Pregunta',
    correct: 'Correctas',
    accuracy: 'Precisión',
    score: 'Puntuación',
    xp: 'XP',
    streak: 'Racha',
    level: 'Nivel',
    home: 'Inicio',
    challenge: 'Desafío',
    result: 'Resultado',
    congratulations: '¡Felicidades!',
    completed: 'Has completado el desafío de hoy.',
    backHome: 'Volver al inicio',
    exit: 'Salir',
    exitTitle: '¿Salir del desafío?',
    exitText: 'Perderás tu progreso actual.',
    cancel: 'Cancelar',
    yesExit: 'Salir',
    automatic: 'Automático',
    chooseDifficulty: 'Elegir dificultad',
    difficultyAutoDescription:
      'Cada pregunta puede tener una dificultad diferente.',
    difficultyEasyDescription:
      'Preguntas relajadas para empezar.',
    difficultyMediumDescription:
      'Un desafío equilibrado para tu mente.',
    difficultyHardDescription:
      'Preguntas difíciles para jugadores expertos.',
    easy: 'Fácil',
    medium: 'Medio',
    hard: 'Difícil',
    math: 'Matemáticas',
    logic: 'Lógica',
    trivia: 'Trivia',
    memory: 'Memoria',
    patterns: 'Patrones',
    word: 'Palabras',
    time: 'Tiempo',
    correctAnswer: 'Respuesta correcta',
    explanation: 'Explicación',
    next: 'Siguiente',
    loading: 'Generando...',
    dailyGoal: 'Objetivo diario',
    challenges: 'Desafíos',
    correctAnswers: 'Respuestas correctas',
    bestStreak: 'Mejor racha',
    levelProgress: 'Progreso del nivel',
    ready: '¿Listo para hoy?',
  },

  fr: {
    appName: 'Défi Quotidien',
    subtitle: 'Réfléchis. Joue. Progresse. Chaque jour.',
    todayChallenge: "Défi d'aujourd'hui",
    startChallenge: 'Commencer',
    newChallenge: 'Nouveau défi',
    question: 'Question',
    correct: 'Correctes',
    accuracy: 'Précision',
    score: 'Score',
    xp: 'XP',
    streak: 'Série',
    level: 'Niveau',
    home: 'Accueil',
    challenge: 'Défi',
    result: 'Résultat',
    congratulations: 'Félicitations !',
    completed: "Tu as terminé le défi d'aujourd'hui.",
    backHome: "Retour à l'accueil",
    exit: 'Quitter',
    exitTitle: 'Quitter le défi ?',
    exitText: 'Ta progression actuelle sera perdue.',
    cancel: 'Annuler',
    yesExit: 'Quitter',
    automatic: 'Automatique',
    chooseDifficulty: 'Choisir la difficulté',
    difficultyAutoDescription:
      'Chaque question peut avoir une difficulté différente.',
    difficultyEasyDescription:
      'Des questions simples pour commencer.',
    difficultyMediumDescription:
      'Un défi équilibré pour ton cerveau.',
    difficultyHardDescription:
      'Des questions difficiles pour les joueurs expérimentés.',
    easy: 'Facile',
    medium: 'Moyen',
    hard: 'Difficile',
    math: 'Maths',
    logic: 'Logique',
    trivia: 'Culture',
    memory: 'Mémoire',
    patterns: 'Motifs',
    word: 'Mots',
    time: 'Temps',
    correctAnswer: 'Bonne réponse',
    explanation: 'Explication',
    next: 'Suivant',
    loading: 'Génération...',
    dailyGoal: 'Objectif quotidien',
    challenges: 'Défis',
    correctAnswers: 'Bonnes réponses',
    bestStreak: 'Meilleure série',
    levelProgress: 'Progression du niveau',
    ready: "Prêt pour aujourd'hui ?",
  },

  ar: {
    appName: 'تحدي اليوم',
    subtitle: 'فكّر. العب. تطوّر. كل يوم.',
    todayChallenge: 'تحدي اليوم',
    startChallenge: 'ابدأ التحدي',
    newChallenge: 'تحدي جديد',
    question: 'السؤال',
    correct: 'الصحيح',
    accuracy: 'الدقة',
    score: 'النقاط',
    xp: 'XP',
    streak: 'التتابع',
    level: 'المستوى',
    home: 'الرئيسية',
    challenge: 'التحدي',
    result: 'النتيجة',
    congratulations: 'أحسنت!',
    completed: 'لقد أكملت تحدي اليوم.',
    backHome: 'العودة للرئيسية',
    exit: 'خروج',
    exitTitle: 'هل تريد الخروج؟',
    exitText: 'سيتم فقدان تقدمك الحالي.',
    cancel: 'إلغاء',
    yesExit: 'خروج',
    automatic: 'تلقائي',
    chooseDifficulty: 'اختر مستوى الصعوبة',
    difficultyAutoDescription:
      'كل سؤال يمكن أن تكون له صعوبة مختلفة.',
    difficultyEasyDescription:
      'أسئلة مريحة لبداية سهلة.',
    difficultyMediumDescription:
      'تحدٍ متوازن لعقلك.',
    difficultyHardDescription:
      'أسئلة صعبة للاعبين ذوي الخبرة.',
    easy: 'سهل',
    medium: 'متوسط',
    hard: 'صعب',
    math: 'رياضيات',
    logic: 'منطق',
    trivia: 'معلومات',
    memory: 'ذاكرة',
    patterns: 'أنماط',
    word: 'كلمات',
    time: 'الوقت',
    correctAnswer: 'الإجابة الصحيحة',
    explanation: 'الشرح',
    next: 'التالي',
    loading: 'جاري التوليد...',
    dailyGoal: 'هدف اليوم',
    challenges: 'التحديات',
    correctAnswers: 'الإجابات الصحيحة',
    bestStreak: 'أفضل تتابع',
    levelProgress: 'تقدم المستوى',
    ready: 'هل أنت مستعد لتحدي اليوم؟',
  },

  bn: {
    appName: 'ডেইলি চ্যালেঞ্জ',
    subtitle: 'ভাবুন। খেলুন। প্রতিদিন উন্নতি করুন।',
    todayChallenge: 'আজকের চ্যালেঞ্জ',
    startChallenge: 'চ্যালেঞ্জ শুরু করুন',
    newChallenge: 'নতুন চ্যালেঞ্জ',
    question: 'প্রশ্ন',
    correct: 'সঠিক',
    accuracy: 'নির্ভুলতা',
    score: 'স্কোর',
    xp: 'XP',
    streak: 'স্ট্রিক',
    level: 'লেভেল',
    home: 'হোম',
    challenge: 'চ্যালেঞ্জ',
    result: 'ফলাফল',
    congratulations: 'অভিনন্দন!',
    completed: 'আপনি আজকের চ্যালেঞ্জ শেষ করেছেন।',
    backHome: 'হোমে ফিরে যান',
    exit: 'বের হন',
    exitTitle: 'চ্যালেঞ্জ ছাড়বেন?',
    exitText: 'বর্তমান অগ্রগতি হারিয়ে যাবে।',
    cancel: 'বাতিল',
    yesExit: 'বের হন',
    automatic: 'স্বয়ংক্রিয়',
    chooseDifficulty: 'কঠিনতা নির্বাচন করুন',
    difficultyAutoDescription:
      'প্রতিটি প্রশ্নের কঠিনতা আলাদা হতে পারে।',
    difficultyEasyDescription:
      'সহজ প্রশ্ন দিয়ে শুরু করুন।',
    difficultyMediumDescription:
      'মস্তিষ্কের জন্য ভারসাম্যপূর্ণ চ্যালেঞ্জ।',
    difficultyHardDescription:
      'অভিজ্ঞ খেলোয়াড়দের জন্য কঠিন প্রশ্ন।',
    easy: 'সহজ',
    medium: 'মাঝারি',
    hard: 'কঠিন',
    math: 'গণিত',
    logic: 'যুক্তি',
    trivia: 'জ্ঞান',
    memory: 'স্মৃতি',
    patterns: 'প্যাটার্ন',
    word: 'শব্দ',
    time: 'সময়',
    correctAnswer: 'সঠিক উত্তর',
    explanation: 'ব্যাখ্যা',
    next: 'পরবর্তী',
    loading: 'তৈরি হচ্ছে...',
    dailyGoal: 'দৈনিক লক্ষ্য',
    challenges: 'চ্যালেঞ্জ',
    correctAnswers: 'সঠিক উত্তর',
    bestStreak: 'সেরা স্ট্রিক',
    levelProgress: 'লেভেল অগ্রগতি',
    ready: 'আজকের জন্য প্রস্তুত?',
  },

  pt: {
    appName: 'Desafio Diário',
    subtitle: 'Pense. Jogue. Melhore. Todos os dias.',
    todayChallenge: 'Desafio de Hoje',
    startChallenge: 'Começar',
    newChallenge: 'Novo Desafio',
    question: 'Pergunta',
    correct: 'Certas',
    accuracy: 'Precisão',
    score: 'Pontuação',
    xp: 'XP',
    streak: 'Sequência',
    level: 'Nível',
    home: 'Início',
    challenge: 'Desafio',
    result: 'Resultado',
    congratulations: 'Parabéns!',
    completed: 'Você concluiu o desafio de hoje.',
    backHome: 'Voltar ao início',
    exit: 'Sair',
    exitTitle: 'Sair do desafio?',
    exitText: 'Seu progresso atual será perdido.',
    cancel: 'Cancelar',
    yesExit: 'Sair',
    automatic: 'Automático',
    chooseDifficulty: 'Escolher dificuldade',
    difficultyAutoDescription:
      'Cada pergunta pode ter uma dificuldade diferente.',
    difficultyEasyDescription:
      'Perguntas tranquilas para começar.',
    difficultyMediumDescription:
      'Um desafio equilibrado para sua mente.',
    difficultyHardDescription:
      'Perguntas difíceis para jogadores experientes.',
    easy: 'Fácil',
    medium: 'Médio',
    hard: 'Difícil',
    math: 'Matemática',
    logic: 'Lógica',
    trivia: 'Conhecimento',
    memory: 'Memória',
    patterns: 'Padrões',
    word: 'Palavras',
    time: 'Tempo',
    correctAnswer: 'Resposta correta',
    explanation: 'Explicação',
    next: 'Próxima',
    loading: 'Gerando...',
    dailyGoal: 'Meta diária',
    challenges: 'Desafios',
    correctAnswers: 'Respostas certas',
    bestStreak: 'Melhor sequência',
    levelProgress: 'Progresso do nível',
    ready: 'Pronto para hoje?',
  },

  ru: {
    appName: 'Ежедневный вызов',
    subtitle: 'Думай. Играй. Развивайся. Каждый день.',
    todayChallenge: 'Испытание дня',
    startChallenge: 'Начать',
    newChallenge: 'Новое испытание',
    question: 'Вопрос',
    correct: 'Верно',
    accuracy: 'Точность',
    score: 'Счёт',
    xp: 'XP',
    streak: 'Серия',
    level: 'Уровень',
    home: 'Главная',
    challenge: 'Испытание',
    result: 'Результат',
    congratulations: 'Поздравляем!',
    completed: 'Вы завершили сегодняшнее испытание.',
    backHome: 'На главную',
    exit: 'Выйти',
    exitTitle: 'Выйти из испытания?',
    exitText: 'Ваш текущий прогресс будет потерян.',
    cancel: 'Отмена',
    yesExit: 'Выйти',
    automatic: 'Автоматически',
    chooseDifficulty: 'Выберите сложность',
    difficultyAutoDescription:
      'Каждый вопрос может иметь разную сложность.',
    difficultyEasyDescription:
      'Простые вопросы для начала.',
    difficultyMediumDescription:
      'Сбалансированное испытание для мозга.',
    difficultyHardDescription:
      'Сложные вопросы для опытных игроков.',
    easy: 'Легко',
    medium: 'Средне',
    hard: 'Сложно',
    math: 'Математика',
    logic: 'Логика',
    trivia: 'Знания',
    memory: 'Память',
    patterns: 'Шаблоны',
    word: 'Слова',
    time: 'Время',
    correctAnswer: 'Правильный ответ',
    explanation: 'Объяснение',
    next: 'Далее',
    loading: 'Создание...',
    dailyGoal: 'Дневная цель',
    challenges: 'Испытания',
    correctAnswers: 'Правильные ответы',
    bestStreak: 'Лучшая серия',
    levelProgress: 'Прогресс уровня',
    ready: 'Готовы к сегодняшнему испытанию?',
  },

  ur: {
    appName: 'روزانہ چیلنج',
    subtitle: 'سوچیں۔ کھیلیں۔ ہر روز بہتر بنیں۔',
    todayChallenge: 'آج کا چیلنج',
    startChallenge: 'چیلنج شروع کریں',
    newChallenge: 'نیا چیلنج',
    question: 'سوال',
    correct: 'درست',
    accuracy: 'درستگی',
    score: 'اسکور',
    xp: 'XP',
    streak: 'اسٹریک',
    level: 'لیول',
    home: 'ہوم',
    challenge: 'چیلنج',
    result: 'نتیجہ',
    congratulations: 'مبارک ہو!',
    completed: 'آپ نے آج کا چیلنج مکمل کر لیا۔',
    backHome: 'ہوم پر واپس',
    exit: 'خارج',
    exitTitle: 'چیلنج چھوڑیں؟',
    exitText: 'آپ کی موجودہ پیش رفت ضائع ہو جائے گی۔',
    cancel: 'منسوخ',
    yesExit: 'خارج',
    automatic: 'خودکار',
    chooseDifficulty: 'مشکل کا انتخاب کریں',
    difficultyAutoDescription:
      'ہر سوال کی مشکل مختلف ہو سکتی ہے۔',
    difficultyEasyDescription:
      'آسان سوالات کے ساتھ شروع کریں۔',
    difficultyMediumDescription:
      'دماغ کے لیے متوازن چیلنج۔',
    difficultyHardDescription:
      'تجربہ کار کھلاڑیوں کے لیے مشکل سوالات۔',
    easy: 'آسان',
    medium: 'درمیانہ',
    hard: 'مشکل',
    math: 'ریاضی',
    logic: 'منطق',
    trivia: 'معلومات',
    memory: 'یادداشت',
    patterns: 'پیٹرنز',
    word: 'الفاظ',
    time: 'وقت',
    correctAnswer: 'درست جواب',
    explanation: 'وضاحت',
    next: 'اگلا',
    loading: 'تیار ہو رہا ہے...',
    dailyGoal: 'روزانہ ہدف',
    challenges: 'چیلنجز',
    correctAnswers: 'درست جوابات',
    bestStreak: 'بہترین اسٹریک',
    levelProgress: 'لیول کی پیش رفت',
    ready: 'آج کے لیے تیار ہیں؟',
  },
};

const LANGUAGE_NAMES: Record<Language, string> = {
  en: 'English',
  zh: '中文',
  hi: 'हिन्दी',
  es: 'Español',
  fr: 'Français',
  ar: 'العربية',
  bn: 'বাংলা',
  pt: 'Português',
  ru: 'Русский',
  ur: 'اردو',
};

const STORAGE = {
  language: 'daily-challenge-language',
  difficulty: 'daily-challenge-difficulty',
  category: 'daily-challenge-category',
  theme: 'daily-challenge-theme',
  xp: 'daily-challenge-xp',
  streak: 'daily-challenge-streak',
  bestStreak: 'daily-challenge-best-streak',
  lastPlayed: 'daily-challenge-last-played',
  totalChallenges: 'daily-challenge-total',
  totalCorrect: 'daily-challenge-correct',
  usedQuestions: 'daily-challenge-used-questions',
};

const random = (max: number) =>
  Math.floor(Math.random() * max);

const randomBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const shuffle = <T,>(items: T[]): T[] => {
  const copy = [...items];

  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = random(i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
};

const makeId = () =>
  `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}-${Math.random()
    .toString(36)
    .slice(2)}`;

const today = () => {
  const d = new Date();

  return `${d.getFullYear()}-${String(
    d.getMonth() + 1
  ).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;
};

const yesterday = () => {
  const d = new Date();

  d.setDate(d.getDate() - 1);

  return `${d.getFullYear()}-${String(
    d.getMonth() + 1
  ).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;
};

const readNumber = (
  key: string,
  fallback = 0
) => {
  const value = Number(localStorage.getItem(key));

  return Number.isFinite(value)
    ? value
    : fallback;
};

const readLanguage = (): Language => {
  const saved = localStorage.getItem(
    STORAGE.language
  );

  const languages: Language[] = [
    'en',
    'zh',
    'hi',
    'es',
    'fr',
    'ar',
    'bn',
    'pt',
    'ru',
    'ur',
  ];

  return languages.includes(saved as Language)
    ? (saved as Language)
    : 'en';
};

const readDifficultyMode = (): DifficultyMode => {
  const saved = localStorage.getItem(
    STORAGE.difficulty
  );

  if (
    saved === 'automatic' ||
    saved === 'easy' ||
    saved === 'medium' ||
    saved === 'hard'
  ) {
    return saved;
  }

  return 'automatic';
};

const readCategoryMode = (): CategoryMode => {
  const saved = localStorage.getItem(
    STORAGE.category
  );

  if (
    saved === 'automatic' ||
    saved === 'math' ||
    saved === 'logic' ||
    saved === 'trivia' ||
    saved === 'memory' ||
    saved === 'patterns' ||
    saved === 'word'
  ) {
    return saved;
  }

  return 'automatic';
};

const readThemeMode = (): ThemeMode => {
  const saved = localStorage.getItem(
    STORAGE.theme
  );

  if (saved === 'light' || saved === 'dark') {
    return saved;
  }

  return 'dark';
};

const getUsedQuestions = (): string[] => {
  try {
    const saved = localStorage.getItem(
      STORAGE.usedQuestions
    );

    if (!saved) return [];

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed)
      ? parsed.filter(
          (item): item is string =>
            typeof item === 'string'
        )
      : [];
  } catch {
    return [];
  }
};

const saveUsedQuestions = (questions: string[]) => {
  localStorage.setItem(
    STORAGE.usedQuestions,
    JSON.stringify(questions.slice(-500))
  );
};

const getQuestionKey = (challenge: Challenge) =>
  `${challenge.category}|${challenge.question}`;

const rememberChallenge = (challenge: Challenge) => {
  const used = getUsedQuestions();
  const key = getQuestionKey(challenge);

  if (!used.includes(key)) {
    used.push(key);
    saveUsedQuestions(used);
  }
};

const difficultyName = (
  difficulty: Difficulty,
  t: Translation
) => t[difficulty];

const categoryName = (
  category: Category,
  t: Translation
) => t[category];

/* =========================
   MATH
========================= */

const createMathChallenge = (
  language: Language,
  difficulty: Difficulty
): Challenge => {
  let a = 0;
  let b = 0;
  let answer = 0;
  let operator = '+';

  if (difficulty === 'easy') {
    a = randomBetween(5, 40);
    b = randomBetween(2, 20);
    operator = random(2) === 0 ? '+' : '-';
  } else if (difficulty === 'medium') {
    a = randomBetween(10, 80);
    b = randomBetween(2, 20);
    operator = ['+', '-', '×'][random(3)];
  } else {
    a = randomBetween(8, 30);
    b = randomBetween(3, 12);
    operator = random(2) === 0 ? '×' : '÷';
  }

  if (operator === '+') answer = a + b;
  if (operator === '-') answer = a - b;
  if (operator === '×') answer = a * b;

  if (operator === '÷') {
    b = randomBetween(2, 12);
    answer = randomBetween(2, 12);
    a = b * answer;
  }

  const wrongs = new Set<number>();

  while (wrongs.size < 3) {
    const offset = randomBetween(
      1,
      Math.max(3, Math.abs(answer) + 4)
    );

    const wrong =
      random(2) === 0
        ? answer + offset
        : answer - offset;

    if (wrong !== answer) {
      wrongs.add(wrong);
    }
  }

  const answerText = String(answer);

  const options = shuffle([
    answerText,
    ...Array.from(wrongs).map(String),
  ]);

  const question =
    language === 'ar'
      ? `احسب: ${a} ${operator} ${b} = ؟`
      : language === 'zh'
      ? `计算：${a} ${operator} ${b} = ？`
      : language === 'hi'
      ? `हल करें: ${a} ${operator} ${b} = ?`
      : language === 'es'
      ? `Calcula: ${a} ${operator} ${b} = ?`
      : language === 'fr'
      ? `Calcule : ${a} ${operator} ${b} = ?`
      : language === 'pt'
      ? `Calcule: ${a} ${operator} ${b} = ?`
      : language === 'ru'
      ? `Вычислите: ${a} ${operator} ${b} = ?`
      : language === 'ur'
      ? `حل کریں: ${a} ${operator} ${b} = ؟`
      : language === 'bn'
      ? `হিসাব করুন: ${a} ${operator} ${b} = ?`
      : `Calculate: ${a} ${operator} ${b} = ?`;

  const explanation =
    language === 'ar'
      ? `الناتج الصحيح هو ${answer}.`
      : language === 'zh'
      ? `正确答案是 ${answer}。`
      : language === 'es'
      ? `La respuesta correcta es ${answer}.`
      : language === 'fr'
      ? `La bonne réponse est ${answer}.`
      : language === 'pt'
      ? `A resposta correta é ${answer}.`
      : language === 'ru'
      ? `Правильный ответ: ${answer}.`
      : language === 'hi'
      ? `सही उत्तर ${answer} है।`
      : language === 'bn'
      ? `সঠিক উত্তর হলো ${answer}।`
      : language === 'ur'
      ? `درست جواب ${answer} ہے۔`
      : `The correct answer is ${answer}.`;

  return {
    id: makeId(),
    category: 'math',
    difficulty,
    question,
    options,
    answer: options.indexOf(answerText),
    explanation,
  };
};

/* =========================
   LOGIC
========================= */

const createLogicChallenge = (
  language: Language,
  difficulty: Difficulty
): Challenge => {
  let answer = 0;
  let question = '';
  let explanation = '';

  if (difficulty === 'hard') {
    const a = randomBetween(4, 15);
    const b = randomBetween(2, 8);
    const c = randomBetween(2, 5);

    answer = a * b + c;

    question =
      language === 'ar'
        ? `إذا كان لديك ${a} مجموعات، في كل مجموعة ${b} عناصر، ثم أضفت ${c} عناصر، فما المجموع؟`
        : `If there are ${a} groups of ${b} items and you add ${c} more, what is the total?`;

    explanation =
      language === 'ar'
        ? `${a} × ${b} + ${c} = ${answer}.`
        : `${a} × ${b} + ${c} = ${answer}.`;
  } else if (difficulty === 'medium') {
    const start = randomBetween(3, 20);
    const step = randomBetween(2, 9);

    const values = [
      start,
      start + step,
      start + step * 2,
      start + step * 3,
    ];

    answer = start + step * 4;

    question =
      language === 'ar'
        ? `ما العدد التالي؟ ${values.join('، ')}، ؟`
        : `What comes next? ${values.join(', ')}, ?`;

    explanation =
      language === 'ar'
        ? `نضيف ${step} في كل مرة.`
        : `The sequence increases by ${step}.`;
  } else {
    const people = randomBetween(3, 10);

    answer = people - 1;

    question =
      language === 'ar'
        ? `يوجد ${people} أشخاص في الغرفة وغادر شخص واحد. كم بقي؟`
        : `There are ${people} people in a room. One leaves. How many remain?`;

    explanation =
      language === 'ar'
        ? `${people} - 1 = ${answer}.`
        : `${people} - 1 = ${answer}.`;
  }

  const wrongSet = new Set<number>();

  while (wrongSet.size < 3) {
    const offset = randomBetween(
      1,
      Math.max(3, Math.abs(answer) + 3)
    );

    const wrong =
      random(2) === 0
        ? answer + offset
        : answer - offset;

    if (wrong !== answer) {
      wrongSet.add(wrong);
    }
  }

  const answerText = String(answer);

  const options = shuffle([
    answerText,
    ...Array.from(wrongSet).map(String),
  ]);

  return {
    id: makeId(),
    category: 'logic',
    difficulty,
    question,
    options,
    answer: options.indexOf(answerText),
    explanation,
  };
};

/* =========================
   TRIVIA
========================= */

type TriviaItem = {
  q: string;
  a: string;
  w: string[];
  ar: string;
  aa: string;
};

const triviaBank: Record<Difficulty, TriviaItem[]> = {
  easy: [
    {
      q: 'What is the largest planet in our solar system?',
      a: 'Jupiter',
      w: ['Mars', 'Earth', 'Venus'],
      ar: 'ما هو أكبر كوكب في نظامنا الشمسي؟',
      aa: 'المشتري',
    },
    {
      q: 'How many continents are there?',
      a: '7',
      w: ['5', '6', '8'],
      ar: 'كم عدد القارات؟',
      aa: '7',
    },
    {
      q: 'What is the capital of France?',
      a: 'Paris',
      w: ['Rome', 'Madrid', 'Berlin'],
      ar: 'ما عاصمة فرنسا؟',
      aa: 'باريس',
    },
    {
      q: 'How many days are in a week?',
      a: '7',
      w: ['5', '6', '8'],
      ar: 'كم يومًا في الأسبوع؟',
      aa: '7',
    },
    {
      q: 'Which animal is known as the king of the jungle?',
      a: 'Lion',
      w: ['Tiger', 'Elephant', 'Wolf'],
      ar: 'أي حيوان يُعرف بملك الغابة؟',
      aa: 'الأسد',
    },
    {
      q: 'How many legs does a spider have?',
      a: '8',
      w: ['6', '10', '12'],
      ar: 'كم رجلًا للعنكبوت؟',
      aa: '8',
    },
    {
      q: 'Which planet do we live on?',
      a: 'Earth',
      w: ['Mars', 'Venus', 'Jupiter'],
      ar: 'على أي كوكب نعيش؟',
      aa: 'الأرض',
    },
    {
      q: 'How many months are in a year?',
      a: '12',
      w: ['10', '11', '13'],
      ar: 'كم شهرًا في السنة؟',
      aa: '12',
    },
  ],

  medium: [
    {
      q: 'Which metal has the chemical symbol Au?',
      a: 'Gold',
      w: ['Silver', 'Iron', 'Copper'],
      ar: 'أي معدن رمزه الكيميائي Au؟',
      aa: 'الذهب',
    },
    {
      q: 'How many sides does a hexagon have?',
      a: '6',
      w: ['5', '7', '8'],
      ar: 'كم ضلعًا للشكل السداسي؟',
      aa: '6',
    },
    {
      q: 'Which ocean is the deepest?',
      a: 'Pacific Ocean',
      w: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean'],
      ar: 'أي محيط هو الأعمق؟',
      aa: 'المحيط الهادئ',
    },
    {
      q: 'Which planet is known for its rings?',
      a: 'Saturn',
      w: ['Mars', 'Mercury', 'Venus'],
      ar: 'أي كوكب يشتهر بحلقاته؟',
      aa: 'زحل',
    },
    {
      q: 'What is the chemical symbol for oxygen?',
      a: 'O',
      w: ['Ox', 'C', 'N'],
      ar: 'ما الرمز الكيميائي للأكسجين؟',
      aa: 'O',
    },
    {
      q: 'How many bones are in the adult human body?',
      a: '206',
      w: ['186', '216', '256'],
      ar: 'كم عظمة في جسم الإنسان البالغ؟',
      aa: '206',
    },
    {
      q: 'Which country is famous for the pyramids of Giza?',
      a: 'Egypt',
      w: ['Greece', 'Mexico', 'Peru'],
      ar: 'أي دولة تشتهر بأهرامات الجيزة؟',
      aa: 'مصر',
    },
    {
      q: 'What is the largest mammal?',
      a: 'Blue whale',
      w: ['Elephant', 'Giraffe', 'Shark'],
      ar: 'ما أكبر حيوان ثديي؟',
      aa: 'الحوت الأزرق',
    },
  ],

  hard: [
    {
      q: 'Which planet has the shortest day?',
      a: 'Jupiter',
      w: ['Earth', 'Mars', 'Saturn'],
      ar: 'أي كوكب لديه أقصر يوم؟',
      aa: 'المشتري',
    },
    {
      q: 'What is the smallest prime number?',
      a: '2',
      w: ['1', '3', '0'],
      ar: 'ما أصغر عدد أولي؟',
      aa: '2',
    },
    {
      q: 'Which gas is most abundant in Earth’s atmosphere?',
      a: 'Nitrogen',
      w: ['Oxygen', 'Carbon dioxide', 'Hydrogen'],
      ar: 'ما أكثر غاز موجود في الغلاف الجوي للأرض؟',
      aa: 'النيتروجين',
    },
    {
      q: 'What is the hardest natural substance?',
      a: 'Diamond',
      w: ['Iron', 'Quartz', 'Gold'],
      ar: 'ما أقسى مادة طبيعية؟',
      aa: 'الألماس',
    },
    {
      q: 'Which planet is closest to the Sun?',
      a: 'Mercury',
      w: ['Venus', 'Earth', 'Mars'],
      ar: 'أي كوكب هو الأقرب إلى الشمس؟',
      aa: 'عطارد',
    },
    {
      q: 'What is the approximate speed of light?',
      a: '300,000 km/s',
      w: [
        '30,000 km/s',
        '3,000 km/s',
        '3,000,000 km/s',
      ],
      ar: 'ما السرعة التقريبية للضوء؟',
      aa: '300,000 km/s',
    },
    {
      q: 'Which organ pumps blood through the human body?',
      a: 'Heart',
      w: ['Liver', 'Lung', 'Kidney'],
      ar: 'أي عضو يضخ الدم في جسم الإنسان؟',
      aa: 'القلب',
    },
    {
      q: 'What is the largest internal organ in the human body?',
      a: 'Liver',
      w: ['Heart', 'Brain', 'Lung'],
      ar: 'ما أكبر عضو داخلي في جسم الإنسان؟',
      aa: 'الكبد',
    },
  ],
};

const createTriviaChallenge = (
  language: Language,
  difficulty: Difficulty
): Challenge => {
  const bank = triviaBank[difficulty];
  const item = bank[random(bank.length)];

  const answer =
    language === 'ar'
      ? item.aa
      : item.a;

  const options = shuffle([
    answer,
    ...item.w,
  ]);

  return {
    id: makeId(),
    category: 'trivia',
    difficulty,
    question:
      language === 'ar'
        ? item.ar
        : item.q,
    options,
    answer: options.indexOf(answer),
    explanation:
      language === 'ar'
        ? `الإجابة الصحيحة هي ${answer}.`
        : `The correct answer is ${item.a}.`,
  };
};

/* =========================
   PATTERNS
========================= */

const createPatternChallenge = (
  language: Language,
  difficulty: Difficulty
): Challenge => {
  let values: number[] = [];
  let answer = 0;
  let rule = '';
  let ruleAr = '';

  if (difficulty === 'hard') {
    const start = randomBetween(2, 8);

    values = [
      start,
      start + 2,
      start + 6,
      start + 12,
    ];

    answer = start + 20;

    rule =
      'The differences increase by 2 each time.';
    ruleAr =
      'الفروقات تزداد بمقدار 2 في كل مرة.';
  } else if (difficulty === 'medium') {
    const start = randomBetween(2, 10);
    const step = randomBetween(2, 7);

    values = [
      start,
      start + step,
      start + step * 2,
      start + step * 3,
    ];

    answer = start + step * 4;

    rule = `Add ${step} each time.`;
    ruleAr = `أضف ${step} في كل مرة.`;
  } else {
    const start = randomBetween(1, 10);

    values = [
      start,
      start + 2,
      start + 4,
      start + 6,
    ];

    answer = start + 8;

    rule = 'Add 2 each time.';
    ruleAr = 'أضف 2 في كل مرة.';
  }

  const wrongSet = new Set<number>();

  while (wrongSet.size < 3) {
    const wrong =
      answer +
      randomBetween(-8, 8);

    if (
      wrong !== answer &&
      wrong >= 0
    ) {
      wrongSet.add(wrong);
    }
  }

  const answerText = String(answer);

  const options = shuffle([
    answerText,
    ...Array.from(wrongSet).map(String),
  ]);

  return {
    id: makeId(),
    category: 'patterns',
    difficulty,
    question:
      language === 'ar'
        ? `ما العدد التالي؟ ${values.join(
            '، '
          )}، ؟`
        : `What comes next? ${values.join(
            ', '
          )}, ?`,
    options,
    answer: options.indexOf(
      answerText
    ),
    explanation:
      language === 'ar'
        ? ruleAr
        : rule,
  };
};

/* =========================
   MEMORY
========================= */

const createMemoryChallenge = (
  language: Language,
  difficulty: Difficulty
): Challenge => {
  const length =
    difficulty === 'easy'
      ? 4
      : difficulty === 'medium'
      ? 5
      : 6;

  const pool = [
    '🍎',
    '🚀',
    '🌙',
    '⭐',
    '🎯',
    '🔥',
    '🐱',
    '⚡',
    '🌈',
    '🍀',
    '🎵',
    '🧩',
    '🌻',
    '🐶',
    '🍉',
    '🎲',
    '🦋',
    '☀️',
    '🌊',
    '🍕',
  ];

  const sequence = shuffle(
    pool
  ).slice(
    0,
    length
  );

  const target =
    sequence[random(sequence.length)];

  const wrongs = shuffle(
    pool.filter(
      (item) => item !== target
    )
  ).slice(0, 3);

  const options = shuffle([
    target,
    ...wrongs,
  ]);

  return {
    id: makeId(),
    category: 'memory',
    difficulty,
    question:
      language === 'ar'
        ? `أي رمز ظهر في تسلسل الذاكرة؟ ${sequence.join(
            ' '
          )}`
        : language === 'zh'
        ? `哪个符号出现在记忆序列中？ ${sequence.join(
            ' '
          )}`
        : language === 'hi'
        ? `स्मृति क्रम में कौन सा चिन्ह दिखाई दिया? ${sequence.join(
            ' '
          )}`
        : language === 'es'
        ? `¿Qué símbolo apareció en la secuencia? ${sequence.join(
            ' '
          )}`
        : language === 'fr'
        ? `Quel symbole est apparu dans la séquence ? ${sequence.join(
            ' '
          )}`
        : language === 'pt'
        ? `Qual símbolo apareceu na sequência? ${sequence.join(
            ' '
          )}`
        : language === 'ru'
        ? `Какой символ был в последовательности? ${sequence.join(
            ' '
          )}`
        : language === 'ur'
        ? `یادداشت کی ترتیب میں کون سا نشان تھا؟ ${sequence.join(
            ' '
          )}`
        : `Which symbol appeared in the memory sequence? ${sequence.join(
            ' '
          )}`,
    options,
    answer: options.indexOf(target),
    explanation:
      language === 'ar'
        ? `الرمز ${target} كان موجودًا في التسلسل.`
        : `${target} was present in the sequence.`,
  };
};

/* =========================
   WORD
========================= */

type WordItem = {
  word: string;
  answer: number;
};

const wordBank: Record<Language, WordItem[]> = {
  en: [
    { word: 'APPLE', answer: 5 },
    { word: 'PLANET', answer: 6 },
    { word: 'PUZZLE', answer: 6 },
    { word: 'ORANGE', answer: 6 },
    { word: 'COMPUTER', answer: 8 },
    { word: 'TRAVEL', answer: 6 },
    { word: 'CHALLENGE', answer: 9 },
    { word: 'MOUNTAIN', answer: 8 },
    { word: 'SUN', answer: 3 },
    { word: 'OCEAN', answer: 5 },
  ],

  zh: [
    { word: 'APPLE', answer: 5 },
    { word: 'PLANET', answer: 6 },
    { word: 'PUZZLE', answer: 6 },
    { word: 'COMPUTER', answer: 8 },
    { word: 'TRAVEL', answer: 6 },
  ],

  hi: [
    { word: 'APPLE', answer: 5 },
    { word: 'PLANET', answer: 6 },
    { word: 'PUZZLE', answer: 6 },
    { word: 'COMPUTER', answer: 8 },
    { word: 'TRAVEL', answer: 6 },
  ],

  es: [
    { word: 'APPLE', answer: 5 },
    { word: 'PLANET', answer: 6 },
    { word: 'PUZZLE', answer: 6 },
    { word: 'ORANGE', answer: 6 },
    { word: 'TRAVEL', answer: 6 },
  ],

  fr: [
    { word: 'APPLE', answer: 5 },
    { word: 'PLANET', answer: 6 },
    { word: 'PUZZLE', answer: 6 },
    { word: 'ORANGE', answer: 6 },
    { word: 'TRAVEL', answer: 6 },
  ],

  ar: [
    { word: 'كتاب', answer: 4 },
    { word: 'مدرسة', answer: 5 },
    { word: 'سيارة', answer: 5 },
    { word: 'حديقة', answer: 5 },
    { word: 'حاسوب', answer: 5 },
    { word: 'طائرة', answer: 5 },
    { word: 'شمس', answer: 3 },
    { word: 'قمر', answer: 3 },
    { word: 'بحر', answer: 3 },
    { word: 'جبل', answer: 3 },
  ],

  bn: [
    { word: 'APPLE', answer: 5 },
    { word: 'PLANET', answer: 6 },
    { word: 'PUZZLE', answer: 6 },
    { word: 'COMPUTER', answer: 8 },
    { word: 'TRAVEL', answer: 6 },
  ],

  pt: [
    { word: 'APPLE', answer: 5 },
    { word: 'PLANET', answer: 6 },
    { word: 'PUZZLE', answer: 6 },
    { word: 'ORANGE', answer: 6 },
    { word: 'TRAVEL', answer: 6 },
  ],

  ru: [
    { word: 'APPLE', answer: 5 },
    { word: 'PLANET', answer: 6 },
    { word: 'PUZZLE', answer: 6 },
    { word: 'COMPUTER', answer: 8 },
    { word: 'TRAVEL', answer: 6 },
  ],

  ur: [
    { word: 'کتاب', answer: 4 },
    { word: 'مدرسہ', answer: 5 },
    { word: 'گاڑی', answer: 4 },
    { word: 'شہر', answer: 4 },
    { word: 'پانی', answer: 4 },
    { word: 'سورج', answer: 4 },
    { word: 'چاند', answer: 4 },
    { word: 'دوست', answer: 4 },
  ],
};

const createWordChallenge = (
  language: Language,
  difficulty: Difficulty
): Challenge => {
  const items = wordBank[language];

  const item =
    items[random(items.length)];

  const wrongs = new Set<number>();

  while (wrongs.size < 3) {
    const wrong =
      item.answer +
      randomBetween(-2, 3);

    if (
      wrong > 0 &&
      wrong !== item.answer
    ) {
      wrongs.add(wrong);
    }
  }

  const answerText =
    String(item.answer);

  const options = shuffle([
    answerText,
    ...Array.from(wrongs).map(String),
  ]);

  const question =
    language === 'ar'
      ? `كم حرفًا في الكلمة: ${item.word}؟`
      : language === 'ur'
      ? `اس لفظ میں کتنے حروف ہیں: ${item.word}؟`
      : `How many letters are in the word: ${item.word}?`;

  return {
    id: makeId(),
    category: 'word',
    difficulty,
    question,
    options,
    answer: options.indexOf(
      answerText
    ),
    explanation:
      language === 'ar'
        ? `الكلمة ${item.word} تحتوي على ${item.answer} أحرف.`
        : language === 'ur'
        ? `${item.word} میں ${item.answer} حروف ہیں۔`
        : `${item.word} contains ${item.answer} letters.`,
  };
};

/* =========================
   MAIN GENERATOR
========================= */

const createChallenge = (
  language: Language,
  category: Category,
  difficulty: Difficulty
): Challenge => {
  switch (category) {
    case 'math':
      return createMathChallenge(
        language,
        difficulty
      );

    case 'logic':
      return createLogicChallenge(
        language,
        difficulty
      );

    case 'trivia':
      return createTriviaChallenge(
        language,
        difficulty
      );

    case 'patterns':
      return createPatternChallenge(
        language,
        difficulty
      );

    case 'memory':
      return createMemoryChallenge(
        language,
        difficulty
      );

    case 'word':
      return createWordChallenge(
        language,
        difficulty
      );
  }
};

const generateLocalUniqueChallenge = (
  language: Language,
  category: Category,
  difficulty: Difficulty,
  currentKeys: Set<string>
): Challenge => {
  const used = getUsedQuestions();

  for (let attempt = 0; attempt < 200; attempt += 1) {
    const challenge = createChallenge(
      language,
      category,
      difficulty
    );

    const key = getQuestionKey(challenge);

    if (
      !used.includes(key) &&
      !currentKeys.has(key)
    ) {
      return challenge;
    }
  }

  // Local generators are procedural for math, logic, memory and patterns.
  // This final fallback is only used when the local generator cannot find
  // a fresh value after many attempts.
  return createChallenge(
    language,
    category,
    difficulty
  );
};

const generateAiChallenge = async (
  language: Language,
  category: Category,
  difficulty: Difficulty,
  currentKeys: Set<string>
): Promise<Challenge | null> => {
  if (
    category !== 'trivia' &&
    category !== 'word'
  ) {
    return null;
  }

  const used = getUsedQuestions();
  const excluded = [
    ...used,
    ...Array.from(currentKeys),
  ].slice(-120);

  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const response = await fetch(
        '/api/generate-challenge',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            language,
            category,
            difficulty,
            excluded,
          }),
        }
      );

      if (!response.ok) {
        return null;
      }

      const data = await response.json();

      if (
        !data ||
        typeof data.question !== 'string' ||
        !Array.isArray(data.options) ||
        data.options.length !== 4 ||
        typeof data.answer !== 'number' ||
        data.answer < 0 ||
        data.answer > 3 ||
        typeof data.explanation !== 'string'
      ) {
        continue;
      }

      const challenge: Challenge = {
        id:
          typeof data.id === 'string'
            ? data.id
            : makeId(),
        category,
        difficulty,
        question: data.question,
        options: data.options.map(String),
        answer: data.answer,
        explanation: data.explanation,
      };

      const key = getQuestionKey(challenge);

      if (
        !used.includes(key) &&
        !currentKeys.has(key)
      ) {
        return challenge;
      }
    } catch {
      return null;
    }
  }

  return null;
};

const generateChallengeSet = async (
  language: Language,
  difficultyMode: DifficultyMode,
  categoryMode: CategoryMode
): Promise<Challenge[]> => {
  const allCategories: Category[] = [
    'math',
    'logic',
    'trivia',
    'memory',
    'patterns',
    'word',
  ];

  const selectedCategories =
    categoryMode === 'automatic'
      ? shuffle<Category>(allCategories).slice(0, 5)
      : Array.from(
          { length: 5 },
          () => categoryMode
        );

  const currentKeys = new Set<string>();

  const difficulties: Difficulty[] = [
    'easy',
    'medium',
    'hard',
  ];

  const generated: Challenge[] = [];

  for (const category of selectedCategories) {
    const difficulty =
      difficultyMode === 'automatic'
        ? difficulties[random(difficulties.length)]
        : difficultyMode;

    const aiChallenge =
      await generateAiChallenge(
        language,
        category,
        difficulty,
        currentKeys
      );

    const challenge =
      aiChallenge ??
      generateLocalUniqueChallenge(
        language,
        category,
        difficulty,
        currentKeys
      );

    currentKeys.add(getQuestionKey(challenge));
    rememberChallenge(challenge);
    generated.push(challenge);
  }

  return generated;
};

const getTimeLimit = (
  difficulty: Difficulty
) => {
  if (difficulty === 'easy') {
    return 30;
  }

  if (difficulty === 'medium') {
    return 20;
  }

  return 10;
};

const calculateLevel = (
  xp: number
) => {
  let level = 1;
  let required = 100;
  let remaining = xp;

  while (
    remaining >= required &&
    level < 100
  ) {
    remaining -= required;
    level += 1;
    required =
      100 + (level - 1) * 50;
  }

  return {
    level,
    progress: Math.min(
      100,
      Math.round(
        (remaining / required) * 100
      )
    ),
    remaining,
    required,
  };
};

function App() {
  const [language, setLanguage] =
    useState<Language>(() =>
      readLanguage()
    );

  const [
    difficultyMode,
    setDifficultyMode,
  ] = useState<DifficultyMode>(() =>
    readDifficultyMode()
  );

  const [
    categoryMode,
    setCategoryMode,
  ] = useState<CategoryMode>(() =>
    readCategoryMode()
  );

  const [theme, setTheme] =
    useState<ThemeMode>(() =>
      readThemeMode()
    );

  const [started, setStarted] =
    useState(false);

  const [isGenerating, setIsGenerating] =
    useState(false);

  const [finished, setFinished] =
    useState(false);

  const [showExit, setShowExit] =
    useState(false);

  const [challenges, setChallenges] =
    useState<Challenge[]>([]);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [selected, setSelected] =
    useState<number | null>(null);

  const [score, setScore] =
    useState(0);

  const [correct, setCorrect] =
    useState(0);

  const [timeLeft, setTimeLeft] =
    useState(30);

  const [xp, setXp] = useState(() =>
    readNumber(
      STORAGE.xp,
      0
    )
  );

  const [streak, setStreak] =
    useState(() =>
      readNumber(
        STORAGE.streak,
        0
      )
    );

  const [
    bestStreak,
    setBestStreak,
  ] = useState(() =>
    readNumber(
      STORAGE.bestStreak,
      0
    )
  );

  const [
    totalChallenges,
    setTotalChallenges,
  ] = useState(() =>
    readNumber(
      STORAGE.totalChallenges,
      0
    )
  );

  const [
    totalCorrect,
    setTotalCorrect,
  ] = useState(() =>
    readNumber(
      STORAGE.totalCorrect,
      0
    )
  );

  const t =
    translations[language];

  const isRtl =
    language === 'ar' ||
    language === 'ur';

  const levelData =
    useMemo(
      () => calculateLevel(xp),
      [xp]
    );

  const currentChallenge =
    challenges[
      currentIndex
    ] ?? null;

  useEffect(() => {
    localStorage.setItem(
      STORAGE.language,
      language
    );

    document.documentElement.lang =
      language;

    document.documentElement.dir =
      isRtl ? 'rtl' : 'ltr';
  }, [
    language,
    isRtl,
  ]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE.difficulty,
      difficultyMode
    );
  }, [
    difficultyMode,
  ]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE.category,
      categoryMode
    );
  }, [
    categoryMode,
  ]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE.theme,
      theme
    );

    document.documentElement.style.colorScheme =
      theme;
  }, [theme]);

  const updateStreak = () => {
    const currentDate =
      today();

    const lastPlayed =
      localStorage.getItem(
        STORAGE.lastPlayed
      );

    const storedStreak =
      readNumber(
        STORAGE.streak,
        0
      );

    let nextStreak =
      storedStreak;

    if (
      lastPlayed ===
      currentDate
    ) {
      nextStreak =
        storedStreak || 1;
    } else if (
      lastPlayed ===
      yesterday()
    ) {
      nextStreak =
        Math.max(
          1,
          storedStreak + 1
        );
    } else {
      nextStreak = 1;
    }

    const storedBest =
      readNumber(
        STORAGE.bestStreak,
        0
      );

    const nextBest =
      Math.max(
        storedBest,
        nextStreak
      );

    setStreak(
      nextStreak
    );

    setBestStreak(
      nextBest
    );

    localStorage.setItem(
      STORAGE.streak,
      String(
        nextStreak
      )
    );

    localStorage.setItem(
      STORAGE.bestStreak,
      String(
        nextBest
      )
    );

    localStorage.setItem(
      STORAGE.lastPlayed,
      currentDate
    );
  };

  const startGame = async () => {
    if (isGenerating) {
      return;
    }

    setIsGenerating(true);

    try {
      const newChallenges =
        await generateChallengeSet(
          language,
          difficultyMode,
          categoryMode
        );

      setChallenges(newChallenges);
      setCurrentIndex(0);
      setSelected(null);
      setScore(0);
      setCorrect(0);
      setTimeLeft(
        getTimeLimit(
          newChallenges[0]?.difficulty ?? 'easy'
        )
      );
      setFinished(false);
      setStarted(true);
      setShowExit(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const finishGame = (
    finalScore: number,
    finalCorrect: number
  ) => {
    const earnedXp =
      20 +
      finalCorrect * 10 +
      Math.round(
        finalScore / 10
      );

    const nextXp =
      xp + earnedXp;

    const nextTotalChallenges =
      totalChallenges +
      challenges.length;

    const nextTotalCorrect =
      totalCorrect +
      finalCorrect;

    setXp(nextXp);

    setTotalChallenges(
      nextTotalChallenges
    );

    setTotalCorrect(
      nextTotalCorrect
    );

    setFinished(true);
    setStarted(false);

    updateStreak();

    localStorage.setItem(
      STORAGE.xp,
      String(nextXp)
    );

    localStorage.setItem(
      STORAGE.totalChallenges,
      String(
        nextTotalChallenges
      )
    );

    localStorage.setItem(
      STORAGE.totalCorrect,
      String(
        nextTotalCorrect
      )
    );
  };

  const answerQuestion = (
    answerIndex: number | null
  ) => {
    if (
      !currentChallenge ||
      selected !== null
    ) {
      return;
    }

    const isTimedOut =
      answerIndex === null;

    const isCorrect =
      !isTimedOut &&
      answerIndex ===
        currentChallenge.answer;

    const nextCorrect =
      correct +
      (isCorrect
        ? 1
        : 0);

    const difficultyMultiplier =
      currentChallenge.difficulty ===
      'hard'
        ? 1.5
        : currentChallenge.difficulty ===
          'medium'
        ? 1.2
        : 1;

    const pointsForQuestion =
      isCorrect
        ? Math.round(
            Math.max(
              50,
              100 -
                currentIndex * 10
            ) *
              difficultyMultiplier
          )
        : 0;

    const nextScore =
      score +
      pointsForQuestion;

    const isLastQuestion =
      currentIndex ===
      challenges.length - 1;

    setSelected(
      isTimedOut
        ? -1
        : answerIndex
    );

    setScore(
      nextScore
    );

    setCorrect(
      nextCorrect
    );

    window.setTimeout(
      () => {
        if (
          isLastQuestion
        ) {
          finishGame(
            nextScore,
            nextCorrect
          );

          return;
        }

        setCurrentIndex(
          (index) =>
            index + 1
        );

        setSelected(null);
      },
      650
    );
  };

  useEffect(() => {
    if (
      !started ||
      finished ||
      !currentChallenge ||
      selected !== null
    ) {
      return;
    }

    const limit =
      getTimeLimit(
        currentChallenge.difficulty
      );

    setTimeLeft(limit);

    const timer =
      window.setInterval(() => {
        setTimeLeft((value) => {
          if (value <= 1) {
            window.clearInterval(timer);
            answerQuestion(null);
            return 0;
          }

          return value - 1;
        });
      }, 1000);

    return () =>
      window.clearInterval(timer);
  }, [
    started,
    finished,
    currentIndex,
    currentChallenge,
    selected,
  ]);

  const handleExit = () => {
    setStarted(false);
    setFinished(false);
    setShowExit(false);
    setChallenges([]);
    setCurrentIndex(0);
    setSelected(null);
    setScore(0);
    setCorrect(0);
    setTimeLeft(30);
  };

  const categoryIcon = (
    category: Category
  ) => {
    const icons: Record<
      Category,
      string
    > = {
      math: '➗',
      logic: '🧠',
      trivia: '🌍',
      memory: '🧩',
      patterns: '🔢',
      word: '🔤',
    };

    return icons[
      category
    ];
  };

  const difficultyIcon = (
    mode: DifficultyMode
  ) => {
    if (
      mode ===
      'automatic'
    ) {
      return '⚡';
    }

    if (
      mode === 'easy'
    ) {
      return '🟢';
    }

    if (
      mode === 'medium'
    ) {
      return '🟡';
    }

    return '🔴';
  };

  const difficultyTitle = (
    mode: DifficultyMode
  ) => {
    if (
      mode ===
      'automatic'
    ) {
      return t.automatic;
    }

    return t[mode];
  };

  const difficultyDescription = (
    mode: DifficultyMode
  ) => {
    if (
      mode ===
      'automatic'
    ) {
      return t.difficultyAutoDescription;
    }

    if (
      mode === 'easy'
    ) {
      return t.difficultyEasyDescription;
    }

    if (
      mode === 'medium'
    ) {
      return t.difficultyMediumDescription;
    }

    return t.difficultyHardDescription;
  };

  const shellClass =
    `app-shell ${theme} ${isRtl ? 'rtl' : ''}`;

  /* =========================
     RESULT
  ========================= */

  if (finished) {
    const finalAccuracy =
      challenges.length > 0
        ? Math.round(
            (correct /
              challenges.length) *
              100
          )
        : 0;

    const earnedXp =
      20 +
      correct * 10 +
      Math.round(
        score / 10
      );

    const resultLevel =
      calculateLevel(
        xp + earnedXp
      );

    return (
      <main
        className={
          shellClass
        }
      >
        <div className="mobile-screen">
          <section className="result-page">
            <button
              className="top-icon-button"
              onClick={handleExit}
              aria-label={t.backHome}
            >
              ‹
            </button>

            <div className="result-hero">
              <div className="result-orb">
                🏆
              </div>

              <span className="result-overline">
                {t.result}
              </span>

              <h1>
                {t.congratulations}
              </h1>

              <p>
                {t.completed}
              </p>

              <div className="result-mode">
                {difficultyIcon(
                  difficultyMode
                )}
                <span>
                  {difficultyTitle(
                    difficultyMode
                  )}
                </span>
              </div>
            </div>

            <div className="result-score-card">
              <span>
                {t.score}
              </span>

              <strong>
                {score}
              </strong>

              <div className="score-line">
                <span />
              </div>

              <div className="mini-result-row">
                <div>
                  <strong>
                    {correct}/
                    {challenges.length}
                  </strong>

                  <span>
                    {t.correct}
                  </span>
                </div>

                <div>
                  <strong>
                    {finalAccuracy}%
                  </strong>

                  <span>
                    {t.accuracy}
                  </span>
                </div>
              </div>
            </div>

            <div className="result-stat-grid">
              <div className="result-stat">
                <span className="result-stat-icon purple">
                  ✨
                </span>
                <strong>
                  +{earnedXp}
                </strong>
                <span>{t.xp}</span>
              </div>

              <div className="result-stat">
                <span className="result-stat-icon orange">
                  🔥
                </span>
                <strong>
                  {streak}
                </strong>
                <span>{t.streak}</span>
              </div>

              <div className="result-stat">
                <span className="result-stat-icon blue">
                  ⭐
                </span>
                <strong>
                  {resultLevel.level}
                </strong>
                <span>{t.level}</span>
              </div>

              <div className="result-stat">
                <span className="result-stat-icon green">
                  🎯
                </span>
                <strong>
                  {totalCorrect}
                </strong>
                <span>
                  {t.correctAnswers}
                </span>
              </div>
            </div>

            <div className="level-card">
              <div className="level-card-top">
                <span>
                  ⭐ {t.level}{' '}
                  {resultLevel.level}
                </span>

                <strong>
                  {resultLevel.progress}%
                </strong>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${resultLevel.progress}%`,
                  }}
                />
              </div>
            </div>

            <div className="result-actions">
              <button
                className="primary-button"
                onClick={startGame}
              >
                🚀{' '}
                {t.newChallenge}
              </button>

              <button
                className="secondary-button"
                onClick={handleExit}
              >
                {t.backHome}
              </button>
            </div>
          </section>
        </div>

        <style>
          {styles}
        </style>
      </main>
    );
  }

  /* =========================
     GAME
  ========================= */

  if (
    started &&
    currentChallenge
  ) {
    const progress =
      ((currentIndex + 1) /
        challenges.length) *
      100;

    return (
      <main
        className={
          shellClass
        }
      >
        <div className="mobile-screen">
          <section className="game-page">
            <header className="game-header">
              <button
                className="top-icon-button"
                onClick={() =>
                  setShowExit(
                    true
                  )
                }
              >
                ‹
              </button>

              <div className="game-progress-info">
                <span>
                  {t.question}{' '}
                  {currentIndex +
                    1}
                  /
                  {
                    challenges.length
                  }
                </span>

                <strong>
                  {Math.round(
                    progress
                  )}
                  %
                </strong>
              </div>

              <div
                className={`timer-pill ${
                  timeLeft <= 5
                    ? 'timer-danger'
                    : timeLeft <= 10
                    ? 'timer-warning'
                    : ''
                }`}
              >
                ⏱ {timeLeft}s
              </div>
            </header>

            <div className="progress-track large">
              <div
                className="progress-fill"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

            <div className="question-info">
              <span className="info-pill category-pill">
                {categoryIcon(
                  currentChallenge.category
                )}
                {categoryName(
                  currentChallenge.category,
                  t
                )}
              </span>

              <span className="info-pill difficulty-pill">
                {currentChallenge.difficulty ===
                'easy'
                  ? '🟢'
                  : currentChallenge.difficulty ===
                    'medium'
                  ? '🟡'
                  : '🔴'}
                {difficultyName(
                  currentChallenge.difficulty,
                  t
                )}
              </span>
            </div>

            <section className="question-card">
              <span className="question-label">
                {t.question}{' '}
                {currentIndex +
                  1}
              </span>

              <h1
                className={
                  currentChallenge.category ===
                  'math'
                    ? 'question-text math-question'
                    : 'question-text'
                }
              >
                {
                  currentChallenge.question
                }
              </h1>
            </section>

            <div className="answers">
              {currentChallenge.options.map(
                (
                  option,
                  index
                ) => {
                  const isSelected =
                    selected ===
                    index;

                  const isCorrect =
                    selected !== null &&
                    index ===
                      currentChallenge.answer;

                  const isWrong =
                    selected !== null &&
                    isSelected &&
                    !isCorrect;

                  return (
                    <button
                      key={`${currentChallenge.id}-${index}`}
                      className={`answer-button ${
                        isCorrect
                          ? 'correct'
                          : isWrong
                          ? 'wrong'
                          : ''
                      }`}
                      onClick={() =>
                        answerQuestion(
                          index
                        )
                      }
                      disabled={
                        selected !== null
                      }
                    >
                      <span className="answer-letter">
                        {String.fromCharCode(
                          65 +
                            index
                        )}
                      </span>

                      <span className="answer-text">
                        {option}
                      </span>

                      {isCorrect &&
                        selected !==
                          null && (
                          <span className="answer-check">
                            ✓
                          </span>
                        )}

                      {isWrong && (
                        <span className="answer-check">
                          ×
                        </span>
                      )}
                    </button>
                  );
                }
              )}
            </div>

            {selected !== null && (
              <div
                className={`feedback-card ${
                  selected ===
                  currentChallenge.answer
                    ? 'success'
                    : 'error'
                }`}
              >
                <div className="feedback-icon">
                  {selected ===
                  currentChallenge.answer
                    ? '✅'
                    : '❌'}
                </div>

                <div>
                  <strong>
                    {selected ===
                    currentChallenge.answer
                      ? t.correct
                      : `${t.correctAnswer}: ${
                          currentChallenge
                            .options[
                            currentChallenge
                              .answer
                          ]
                        }`}
                  </strong>

                  <span>
                    {
                      currentChallenge.explanation
                    }
                  </span>
                </div>
              </div>
            )}
          </section>
        </div>

        {showExit && (
          <div className="modal-backdrop">
            <div
              className="confirm-modal"
              dir={
                isRtl
                  ? 'rtl'
                  : 'ltr'
              }
            >
              <div className="modal-icon">
                ⚠️
              </div>

              <h2>
                {t.exitTitle}
              </h2>

              <p>
                {t.exitText}
              </p>

              <div className="modal-actions">
                <button
                  className="secondary-button"
                  onClick={() =>
                    setShowExit(
                      false
                    )
                  }
                >
                  {t.cancel}
                </button>

                <button
                  className="danger-button"
                  onClick={
                    handleExit
                  }
                >
                  {t.yesExit}
                </button>
              </div>
            </div>
          </div>
        )}

        <style>
          {styles}
        </style>
      </main>
    );
  }

  /* =========================
     HOME
  ========================= */

  return (
    <main
      className={
        shellClass
      }
    >
      <div className="mobile-screen">
        <header className="mobile-header">
          <div className="brand">
            <div className="brand-icon">
              ⚡
            </div>

            <div>
              <div className="brand-name">
                {t.appName}
              </div>

              <div className="brand-subtitle">
                {t.subtitle}
              </div>
            </div>
          </div>

          <div className="header-actions">
            <button
              className="theme-button"
              onClick={() =>
                setTheme(
                  (current) =>
                    current ===
                    'dark'
                      ? 'light'
                      : 'dark'
                )
              }
              aria-label="Toggle theme"
            >
              {theme ===
              'dark'
                ? '☀️'
                : '🌙'}
            </button>

            <select
              className="language-select"
              value={language}
              onChange={(
                event
              ) =>
                setLanguage(
                  event.target
                    .value as Language
                )
              }
            >
              {(
                Object.keys(
                  LANGUAGE_NAMES
                ) as Language[]
              ).map(
                (code) => (
                  <option
                    key={
                      code
                    }
                    value={
                      code
                    }
                  >
                    {
                      LANGUAGE_NAMES[
                        code
                      ]
                    }
                  </option>
                )
              )}
            </select>
          </div>
        </header>

        <section className="home-hero">
          <div className="streak-badge">
            <span>🔥</span>

            <div>
              <strong>
                {streak}
              </strong>

              <small>
                {t.streak}
              </small>
            </div>
          </div>

          <h1>
            {t.todayChallenge}
          </h1>

          <p>
            {t.ready}
          </p>
        </section>

        <section className="profile-strip">
          <div className="profile-avatar">
            ⚡
          </div>

          <div className="profile-content">
            <strong>
              {t.level}{' '}
              {levelData.level}
            </strong>

            <span>
              {xp} {t.xp}
            </span>

            <div className="mini-progress">
              <span
                style={{
                  width: `${levelData.progress}%`,
                }}
              />
            </div>
          </div>

          <div className="profile-value">
            <strong>
              {totalCorrect}
            </strong>

            <span>
              {t.correct}
            </span>
          </div>
        </section>

        <section className="challenge-card">
          <div className="challenge-card-header">
            <div className="daily-icon">
              🎯
            </div>

            <div>
              <span>
                {t.dailyGoal}
              </span>

              <h2>
                5 {t.challenges}
              </h2>
            </div>

            <div className="challenge-mode-mini">
              {categoryMode === 'automatic'
                ? '⚡'
                : categoryMode === 'math'
                ? '🧮'
                : categoryMode === 'logic'
                ? '🧠'
                : categoryMode === 'trivia'
                ? '🌍'
                : categoryMode === 'memory'
                ? '🧩'
                : categoryMode === 'patterns'
                ? '🔷'
                : '🔤'}
            </div>
          </div>

          <div className="challenge-divider" />

          <div className="difficulty-header">
            <div>
              <strong>
                {t.challenge}
              </strong>

              <span>
                {categoryMode === 'automatic'
                  ? t.difficultyAutoDescription
                  : categoryName(categoryMode, t)}
              </span>
            </div>

            <b>
              {categoryMode === 'automatic'
                ? t.automatic
                : categoryName(categoryMode, t)}
            </b>
          </div>

          <div className="difficulty-list">
            <button
              className={`difficulty-option ${
                categoryMode === 'automatic'
                  ? 'active automatic'
                  : ''
              }`}
              onClick={() => setCategoryMode('automatic')}
            >
              <span className="difficulty-option-icon">
                ⚡
              </span>
              <span className="difficulty-option-content">
                <strong>{t.automatic}</strong>
                <small>{t.difficultyAutoDescription}</small>
              </span>
              {categoryMode === 'automatic' && (
                <span className="selected-dot">✓</span>
              )}
            </button>

            {([
              ['math', '🧮'],
              ['logic', '🧠'],
              ['trivia', '🌍'],
              ['memory', '🧩'],
              ['patterns', '🔷'],
              ['word', '🔤'],
            ] as [Category, string][]).map(([category, icon]) => (
              <button
                key={category}
                className={`difficulty-option ${
                  categoryMode === category
                    ? 'active automatic'
                    : ''
                }`}
                onClick={() => setCategoryMode(category)}
              >
                <span className="difficulty-option-icon">
                  {icon}
                </span>
                <span className="difficulty-option-content">
                  <strong>{categoryName(category, t)}</strong>
                  <small>{t.challenge}</small>
                </span>
                {categoryMode === category && (
                  <span className="selected-dot">✓</span>
                )}
              </button>
            ))}
          </div>

          <div className="challenge-divider" />

          <div className="difficulty-header">
            <div>
              <strong>
                {t.chooseDifficulty}
              </strong>

              <span>
                {
                  difficultyDescription(
                    difficultyMode
                  )
                }
              </span>
            </div>

            <b>
              {
                difficultyTitle(
                  difficultyMode
                )
              }
            </b>
          </div>

          <div className="difficulty-list">
            <button
              className={`difficulty-option ${
                difficultyMode ===
                'automatic'
                  ? 'active automatic'
                  : ''
              }`}
              onClick={() =>
                setDifficultyMode(
                  'automatic'
                )
              }
            >
              <span className="difficulty-option-icon">
                ⚡
              </span>

              <span className="difficulty-option-content">
                <strong>
                  {t.automatic}
                </strong>

                <small>
                  {t.difficultyAutoDescription}
                </small>
              </span>

              {difficultyMode ===
                'automatic' && (
                <span className="selected-dot">
                  ✓
                </span>
              )}
            </button>

            <button
              className={`difficulty-option ${
                difficultyMode ===
                'easy'
                  ? 'active easy'
                  : ''
              }`}
              onClick={() =>
                setDifficultyMode(
                  'easy'
                )
              }
            >
              <span className="difficulty-option-icon">
                🟢
              </span>

              <span className="difficulty-option-content">
                <strong>
                  {t.easy}
                </strong>

                <small>
                  {t.difficultyEasyDescription}
                </small>
              </span>

              {difficultyMode ===
                'easy' && (
                <span className="selected-dot">
                  ✓
                </span>
              )}
            </button>

            <button
              className={`difficulty-option ${
                difficultyMode ===
                'medium'
                  ? 'active medium'
                  : ''
              }`}
              onClick={() =>
                setDifficultyMode(
                  'medium'
                )
              }
            >
              <span className="difficulty-option-icon">
                🟡
              </span>

              <span className="difficulty-option-content">
                <strong>
                  {t.medium}
                </strong>

                <small>
                  {t.difficultyMediumDescription}
                </small>
              </span>

              {difficultyMode ===
                'medium' && (
                <span className="selected-dot">
                  ✓
                </span>
              )}
            </button>

            <button
              className={`difficulty-option ${
                difficultyMode ===
                'hard'
                  ? 'active hard'
                  : ''
              }`}
              onClick={() =>
                setDifficultyMode(
                  'hard'
                )
              }
            >
              <span className="difficulty-option-icon">
                🔴
              </span>

              <span className="difficulty-option-content">
                <strong>
                  {t.hard}
                </strong>

                <small>
                  {t.difficultyHardDescription}
                </small>
              </span>

              {difficultyMode ===
                'hard' && (
                <span className="selected-dot">
                  ✓
                </span>
              )}
            </button>
          </div>

          <button
            className="primary-button start-button"
            onClick={startGame}
            disabled={isGenerating}
          >
            <span>
              {isGenerating ? '⏳' : '🚀'}
            </span>

            <span>
              {isGenerating ? t.loading : t.startChallenge}
            </span>

            <span className="button-arrow">
              {isGenerating ? '…' : '→'}
            </span>
          </button>
        </section>

        <section className="quick-stats">
          <div className="quick-stat">
            <span className="quick-stat-icon purple">
              ✨
            </span>

            <strong>
              {xp}
            </strong>

            <small>
              {t.xp}
            </small>
          </div>

          <div className="quick-stat">
            <span className="quick-stat-icon yellow">
              ⭐
            </span>

            <strong>
              {levelData.level}
            </strong>

            <small>
              {t.level}
            </small>
          </div>

          <div className="quick-stat">
            <span className="quick-stat-icon blue">
              🎮
            </span>

            <strong>
              {totalChallenges}
            </strong>

            <small>
              {t.challenges}
            </small>
          </div>

          <div className="quick-stat">
            <span className="quick-stat-icon orange">
              🔥
            </span>

            <strong>
              {bestStreak}
            </strong>

            <small>
              {t.bestStreak}
            </small>
          </div>
        </section>

        <section className="categories-section">
          <div className="section-title-row">
            <div>
              <span>
                🎮
              </span>

              <h2>
                {t.challenge}
              </h2>
            </div>

            <small>
              6
            </small>
          </div>

          <div className="category-grid">
            {(
              [
                'math',
                'logic',
                'trivia',
                'memory',
                'patterns',
                'word',
              ] as Category[]
            ).map(
              (
                category
              ) => (
                <div
                  key={
                    category
                  }
                  className="category-tile"
                >
                  <span>
                    {categoryIcon(
                      category
                    )}
                  </span>

                  <strong>
                    {categoryName(
                      category,
                      t
                    )}
                  </strong>
                </div>
              )
            )}
          </div>
        </section>

        <div className="mobile-bottom-space" />
      </div>

      <style>
        {styles}
      </style>
    </main>
  );
}

const styles = `
:root {
  color-scheme: dark;
}

* {
  box-sizing: border-box;
}

html,
body,
#root {
  margin: 0;
  width: 100%;
  min-height: 100%;
}

html {
  background: #070b14;
}

body {
  min-height: 100dvh;
  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
  background: #070b14;
}

button,
select {
  font: inherit;
}

button {
  -webkit-tap-highlight-color: transparent;
}

.app-shell {
  --bg: #070b14;
  --surface: #101624;
  --surface-2: #151c2d;
  --surface-3: #1a2336;
  --text: #f8fafc;
  --muted: #8d99ad;
  --muted-2: #64748b;
  --border: rgba(148, 163, 184, 0.12);
  --primary: #6d5dfc;
  --primary-2: #8a72ff;
  --primary-soft: rgba(109, 93, 252, 0.13);
  --green: #35d07f;
  --orange: #ff9d3d;
  --yellow: #f7c948;
  --blue: #4aa8ff;
  --red: #ff5d73;
  --shadow: rgba(0, 0, 0, 0.34);

  min-height: 100dvh;
  width: 100%;
  color: var(--text);
  background: var(--bg);
  overflow-x: hidden;
}

.app-shell.light {
  --bg: #f4f7fb;
  --surface: #ffffff;
  --surface-2: #f7f9fd;
  --surface-3: #eef2f8;
  --text: #111827;
  --muted: #68758a;
  --muted-2: #8a96a8;
  --border: rgba(15, 23, 42, 0.09);
  --primary: #6457eb;
  --primary-2: #7a68f8;
  --primary-soft: rgba(100, 87, 235, 0.09);
  --green: #1faf69;
  --orange: #ed8a2b;
  --yellow: #d5a500;
  --blue: #3187d8;
  --red: #e74860;
  --shadow: rgba(15, 23, 42, 0.1);
}

.mobile-screen {
  width: 100%;
  max-width: 480px;
  min-height: 100dvh;
  margin: 0 auto;
  padding:
    max(16px, env(safe-area-inset-top))
    16px
    max(28px, env(safe-area-inset-bottom));
}

.mobile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 4px 0 18px;
}

.brand {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-icon {
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  font-size: 20px;
  color: #fff;
  background:
    linear-gradient(
      145deg,
      #6558eb,
      #927cff
    );
  box-shadow:
    0 8px 25px rgba(109, 93, 252, 0.28);
}

.brand-name {
  font-size: 15px;
  font-weight: 900;
  letter-spacing: -0.3px;
  white-space: nowrap;
}

.brand-subtitle {
  margin-top: 2px;
  color: var(--muted);
  font-size: 9px;
  white-space: nowrap;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 7px;
}

.theme-button {
  width: 39px;
  height: 39px;
  border: 1px solid var(--border);
  border-radius: 13px;
  display: grid;
  place-items: center;
  color: var(--text);
  background: var(--surface);
  cursor: pointer;
  box-shadow:
    0 5px 15px var(--shadow);
}

.language-select {
  max-width: 100px;
  min-width: 82px;
  height: 39px;
  padding: 0 10px;
  border: 1px solid var(--border);
  border-radius: 13px;
  outline: none;
  color: var(--text);
  background: var(--surface);
  font-size: 11px;
  cursor: pointer;
}

.language-select option {
  color: #111827;
  background: #fff;
}

.home-hero {
  padding: 8px 2px 19px;
}

.streak-badge {
  width: fit-content;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 11px;
  border-radius: 14px;
  background: rgba(255, 157, 61, 0.1);
  border: 1px solid rgba(255, 157, 61, 0.16);
}

.streak-badge > span {
  font-size: 18px;
}

.streak-badge div {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.streak-badge strong {
  color: var(--orange);
  font-size: 15px;
}

.streak-badge small {
  color: var(--muted);
  font-size: 9px;
  font-weight: 700;
}

.home-hero h1 {
  margin: 17px 0 5px;
  font-size: 34px;
  line-height: 1.05;
  letter-spacing: -1.8px;
}

.home-hero p {
  margin: 0;
  color: var(--muted);
  font-size: 12px;
}

.profile-strip {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 12px;
  margin-bottom: 14px;
  border-radius: 18px;
  border: 1px solid var(--border);
  background: var(--surface);
  box-shadow: 0 8px 25px var(--shadow);
}

.profile-avatar {
  width: 43px;
  height: 43px;
  flex: 0 0 43px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  font-size: 19px;
  color: white;
  background:
    linear-gradient(
      145deg,
      #6558eb,
      #927cff
    );
}

.profile-content {
  min-width: 0;
  flex: 1;
}

.profile-content strong,
.profile-content span {
  display: block;
}

.profile-content strong {
  font-size: 12px;
}

.profile-content span {
  margin-top: 2px;
  color: var(--muted);
  font-size: 9px;
}

.mini-progress {
  width: 100%;
  height: 4px;
  margin-top: 7px;
  overflow: hidden;
  border-radius: 100px;
  background: var(--surface-3);
}

.mini-progress span {
  display: block;
  height: 100%;
  margin: 0;
  border-radius: inherit;
  background:
    linear-gradient(
      90deg,
      var(--primary),
      var(--primary-2)
    );
}

.profile-value {
  text-align: center;
  padding-left: 8px;
  border-left: 1px solid var(--border);
}

.rtl .profile-value {
  padding-left: 0;
  padding-right: 8px;
  border-left: 0;
  border-right: 1px solid var(--border);
}

.profile-value strong,
.profile-value span {
  display: block;
}

.profile-value strong {
  font-size: 15px;
}

.profile-value span {
  margin-top: 2px;
  color: var(--muted);
  font-size: 8px;
}

.challenge-card {
  padding: 16px;
  border-radius: 22px;
  background:
    linear-gradient(
      145deg,
      var(--surface),
      var(--surface-2)
    );
  border: 1px solid var(--border);
  box-shadow:
    0 18px 40px var(--shadow);
}

.challenge-card-header {
  display: flex;
  align-items: center;
  gap: 11px;
}

.daily-icon {
  width: 49px;
  height: 49px;
  flex: 0 0 49px;
  display: grid;
  place-items: center;
  border-radius: 16px;
  font-size: 23px;
  background: var(--primary-soft);
}

.challenge-card-header > div:nth-child(2) {
  flex: 1;
  min-width: 0;
}

.challenge-card-header > div:nth-child(2) > span {
  display: block;
  color: var(--muted);
  font-size: 9px;
}

.challenge-card-header h2 {
  margin: 3px 0 0;
  font-size: 18px;
  letter-spacing: -0.4px;
}

.challenge-mode-mini {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 11px;
  background: var(--surface-3);
  font-size: 18px;
}

.challenge-divider {
  height: 1px;
  margin: 15px 0;
  background: var(--border);
}

.difficulty-header {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}

.difficulty-header > div {
  min-width: 0;
}

.difficulty-header strong,
.difficulty-header span {
  display: block;
}

.difficulty-header strong {
  font-size: 12px;
}

.difficulty-header span {
  margin-top: 3px;
  color: var(--muted);
  font-size: 9px;
  line-height: 1.35;
}

.difficulty-header b {
  flex: 0 0 auto;
  color: var(--primary-2);
  font-size: 10px;
  white-space: nowrap;
}

.difficulty-list {
  display: grid;
  gap: 7px;
}

.difficulty-option {
  width: 100%;
  min-height: 57px;
  padding: 9px;
  display: flex;
  align-items: center;
  gap: 9px;
  border: 1px solid var(--border);
  border-radius: 15px;
  background: var(--surface-2);
  color: var(--text);
  text-align: start;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    border-color 0.15s ease,
    background 0.15s ease;
}

.difficulty-option:active {
  transform: scale(0.985);
}

.difficulty-option.active {
  background: var(--primary-soft);
  border-color: rgba(109, 93, 252, 0.45);
}

.difficulty-option.active.easy {
  border-color: rgba(53, 208, 127, 0.45);
  background: rgba(53, 208, 127, 0.08);
}

.difficulty-option.active.medium {
  border-color: rgba(247, 201, 72, 0.45);
  background: rgba(247, 201, 72, 0.08);
}

.difficulty-option.active.hard {
  border-color: rgba(255, 93, 115, 0.45);
  background: rgba(255, 93, 115, 0.08);
}

.difficulty-option-icon {
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  display: grid;
  place-items: center;
  border-radius: 11px;
  background: var(--surface-3);
  font-size: 16px;
}

.difficulty-option-content {
  flex: 1;
  min-width: 0;
}

.difficulty-option-content strong {
  display: block;
  font-size: 11px;
}

.difficulty-option-content small {
  display: block;
  margin-top: 2px;
  color: var(--muted);
  font-size: 8px;
  line-height: 1.3;
}

.selected-dot {
  width: 22px;
  height: 22px;
  flex: 0 0 22px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: white;
  background: var(--primary);
  font-size: 11px;
  font-weight: 900;
}

.primary-button,
.secondary-button,
.danger-button {
  min-height: 50px;
  border: 0;
  border-radius: 15px;
  padding: 0 16px;
  font-weight: 900;
  cursor: pointer;
}

.primary-button {
  color: white;
  background:
    linear-gradient(
      135deg,
      var(--primary),
      var(--primary-2)
    );
  box-shadow:
    0 12px 25px rgba(109, 93, 252, 0.25);
}

.secondary-button {
  color: var(--text);
  background: var(--surface-3);
  border: 1px solid var(--border);
}

.danger-button {
  color: #fff;
  background: #dc354f;
}

.start-button {
  width: 100%;
  height: 55px;
  margin-top: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  font-size: 14px;
}

.button-arrow {
  margin-left: auto;
  font-size: 18px;
  opacity: 0.75;
}

.quick-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 7px;
  margin-top: 11px;
}

.quick-stat {
  min-width: 0;
  padding: 10px 6px;
  border-radius: 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  text-align: center;
}

.quick-stat-icon {
  width: 26px;
  height: 26px;
  margin: 0 auto 5px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  font-size: 12px;
}

.quick-stat-icon.purple {
  background: rgba(109, 93, 252, 0.12);
}

.quick-stat-icon.yellow {
  background: rgba(247, 201, 72, 0.13);
}

.quick-stat-icon.blue {
  background: rgba(74, 168, 255, 0.12);
}

.quick-stat-icon.orange {
  background: rgba(255, 157, 61, 0.13);
}

.quick-stat strong,
.quick-stat small {
  display: block;
}

.quick-stat strong {
  font-size: 13px;
}

.quick-stat small {
  margin-top: 2px;
  color: var(--muted);
  font-size: 8px;
}

.categories-section {
  margin-top: 20px;
}

.section-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.section-title-row > div {
  display: flex;
  align-items: center;
  gap: 7px;
}

.section-title-row h2 {
  margin: 0;
  font-size: 14px;
}

.section-title-row small {
  color: var(--muted);
  font-size: 9px;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 7px;
}

.category-tile {
  min-height: 83px;
  padding: 11px 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border: 1px solid var(--border);
  border-radius: 17px;
  background: var(--surface);
}

.category-tile span {
  font-size: 23px;
}

.category-tile strong {
  font-size: 9px;
  text-align: center;
}

.mobile-bottom-space {
  height: 20px;
}

/* GAME */

.game-page {
  min-height: calc(100dvh - 45px);
  padding-bottom: 25px;
}

.game-header {
  display: grid;
  grid-template-columns: 38px 1fr auto;
  align-items: center;
  gap: 9px;
  padding-bottom: 12px;
}

.top-icon-button {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border: 1px solid var(--border);
  border-radius: 13px;
  color: var(--text);
  background: var(--surface);
  font-size: 27px;
  line-height: 1;
  cursor: pointer;
}

.game-progress-info {
  text-align: center;
}

.game-progress-info span,
.game-progress-info strong {
  display: block;
}

.game-progress-info span {
  color: var(--muted);
  font-size: 9px;
}

.game-progress-info strong {
  margin-top: 2px;
  color: var(--text);
  font-size: 12px;
}

.timer-pill {
  padding: 8px 9px;
  border-radius: 11px;
  color: var(--primary-2);
  background: var(--primary-soft);
  font-size: 10px;
  font-weight: 900;
}

.progress-track {
  width: 100%;
  height: 6px;
  overflow: hidden;
  border-radius: 999px;
  background: var(--surface-3);
}

.progress-track.large {
  height: 7px;
}

.progress-fill {
  height: 100%;
  border-radius: inherit;
  background:
    linear-gradient(
      90deg,
      var(--primary),
      var(--primary-2),
      #53c8ff
    );
  box-shadow:
    0 0 15px rgba(109, 93, 252, 0.35);
  transition:
    width 0.3s ease;
}

.question-info {
  display: flex;
  gap: 7px;
  margin-top: 15px;
}

.info-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 9px;
  border-radius: 999px;
  font-size: 8px;
  font-weight: 900;
}

.category-pill {
  color: var(--primary-2);
  background: var(--primary-soft);
}

.difficulty-pill {
  color: var(--orange);
  background: rgba(255, 157, 61, 0.1);
}

.question-card {
  margin-top: 10px;
  padding: 21px 17px;
  border-radius: 21px;
  border: 1px solid var(--border);
  background: var(--surface);
  box-shadow:
    0 12px 28px var(--shadow);
}

.question-label {
  color: var(--muted);
  font-size: 9px;
  font-weight: 800;
}

.question-text {
  margin: 10px 0 0;
  font-size: 24px;
  line-height: 1.2;
  letter-spacing: -0.8px;
  word-break: break-word;
}

.math-question {
  font-variant-numeric: tabular-nums;
}

.answers {
  display: grid;
  gap: 8px;
  margin-top: 11px;
}

.answer-button {
  width: 100%;
  min-height: 59px;
  padding: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid var(--border);
  border-radius: 16px;
  color: var(--text);
  background: var(--surface);
  text-align: start;
  cursor: pointer;
  transition:
    transform 0.12s ease,
    border-color 0.12s ease,
    background 0.12s ease;
}

.answer-button:active {
  transform: scale(0.987);
}

.answer-button:disabled {
  cursor: default;
}

.answer-letter {
  width: 37px;
  height: 37px;
  flex: 0 0 37px;
  display: grid;
  place-items: center;
  border-radius: 11px;
  color: var(--primary-2);
  background: var(--surface-3);
  font-size: 12px;
  font-weight: 900;
}

.answer-text {
  flex: 1;
  font-size: 12px;
  line-height: 1.35;
  font-weight: 800;
}

.answer-check {
  width: 24px;
  height: 24px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  font-size: 13px;
  font-weight: 900;
}

.answer-button.correct {
  border-color: rgba(53, 208, 127, 0.5);
  background: rgba(53, 208, 127, 0.08);
}

.answer-button.correct .answer-letter {
  color: #fff;
  background: var(--green);
}

.answer-button.correct .answer-check {
  color: #fff;
  background: var(--green);
}

.answer-button.wrong {
  border-color: rgba(255, 93, 115, 0.5);
  background: rgba(255, 93, 115, 0.08);
}

.answer-button.wrong .answer-letter {
  color: #fff;
  background: var(--red);
}

.answer-button.wrong .answer-check {
  color: #fff;
  background: var(--red);
}

.feedback-card {
  display: flex;
  gap: 9px;
  margin-top: 10px;
  padding: 12px;
  border-radius: 15px;
  border: 1px solid var(--border);
  background: var(--surface);
}

.feedback-card.success {
  border-color: rgba(53, 208, 127, 0.22);
}

.feedback-card.error {
  border-color: rgba(255, 93, 115, 0.22);
}

.feedback-icon {
  font-size: 18px;
}

.feedback-card strong,
.feedback-card span {
  display: block;
}

.feedback-card strong {
  font-size: 10px;
}

.feedback-card span {
  margin-top: 3px;
  color: var(--muted);
  font-size: 9px;
  line-height: 1.45;
}

/* RESULT */

.result-page {
  padding-bottom: 25px;
}

.result-page > .top-icon-button {
  margin-bottom: 8px;
}

.result-hero {
  text-align: center;
  padding: 3px 0 12px;
}

.result-orb {
  width: 68px;
  height: 68px;
  margin: 0 auto 10px;
  display: grid;
  place-items: center;
  border-radius: 22px;
  font-size: 34px;
  background:
    linear-gradient(
      145deg,
      rgba(109, 93, 252, 0.18),
      rgba(138, 114, 255, 0.08)
    );
  border: 1px solid rgba(109, 93, 252, 0.18);
}

.result-overline {
  color: var(--primary-2);
  font-size: 9px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.result-hero h1 {
  margin: 7px 0 4px;
  font-size: 28px;
  letter-spacing: -1px;
}

.result-hero p {
  margin: 0 auto;
  max-width: 300px;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.4;
}

.result-mode {
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 10px;
  padding: 6px 10px;
  border-radius: 999px;
  background: var(--primary-soft);
  color: var(--primary-2);
  font-size: 9px;
  font-weight: 900;
}

.result-score-card {
  margin-top: 8px;
  padding: 19px 16px;
  border-radius: 21px;
  color: #fff;
  background:
    linear-gradient(
      145deg,
      #6658ef,
      #8370f5
    );
  box-shadow:
    0 16px 35px rgba(109, 93, 252, 0.24);
  text-align: center;
}

.result-score-card > span {
  display: block;
  font-size: 9px;
  opacity: 0.8;
}

.result-score-card > strong {
  display: block;
  margin-top: 3px;
  font-size: 41px;
  line-height: 1;
}

.score-line {
  width: 58%;
  height: 4px;
  margin: 12px auto 13px;
  border-radius: 999px;
  background: rgba(255,255,255,0.17);
}

.score-line span {
  display: block;
  width: 66%;
  height: 100%;
  border-radius: inherit;
  background: rgba(255,255,255,0.9);
}

.mini-result-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-top: 1px solid rgba(255,255,255,0.14);
  padding-top: 11px;
}

.mini-result-row div:first-child {
  border-right: 1px solid rgba(255,255,255,0.14);
}

.rtl .mini-result-row div:first-child {
  border-right: 0;
  border-left: 1px solid rgba(255,255,255,0.14);
}

.mini-result-row strong,
.mini-result-row span {
  display: block;
}

.mini-result-row strong {
  font-size: 14px;
}

.mini-result-row span {
  margin-top: 2px;
  font-size: 8px;
  opacity: 0.7;
}

.result-stat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 7px;
  margin-top: 10px;
}

.result-stat {
  min-width: 0;
  padding: 11px 5px;
  border-radius: 15px;
  border: 1px solid var(--border);
  background: var(--surface);
  text-align: center;
}

.result-stat-icon {
  width: 25px;
  height: 25px;
  margin: 0 auto 5px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  font-size: 12px;
}

.result-stat-icon.purple {
  background: rgba(109, 93, 252, 0.12);
}

.result-stat-icon.orange {
  background: rgba(255, 157, 61, 0.12);
}

.result-stat-icon.blue {
  background: rgba(74, 168, 255, 0.12);
}

.result-stat-icon.green {
  background: rgba(53, 208, 127, 0.12);
}

.result-stat strong,
.result-stat span:last-child {
  display: block;
}

.result-stat strong {
  font-size: 12px;
}

.result-stat span:last-child {
  margin-top: 2px;
  color: var(--muted);
  font-size: 7px;
}

.level-card {
  margin-top: 10px;
  padding: 13px;
  border-radius: 16px;
  border: 1px solid var(--border);
  background: var(--surface);
}

.level-card-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 7px;
  color: var(--muted);
  font-size: 9px;
  font-weight: 800;
}

.level-card-top strong {
  color: var(--primary-2);
}

.result-actions {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  margin-top: 12px;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: 18px;
  background: rgba(0, 0, 0, 0.58);
  backdrop-filter: blur(8px);
}

.confirm-modal {
  width: min(100%, 360px);
  padding: 22px;
  border-radius: 23px;
  border: 1px solid var(--border);
  background: var(--surface);
  box-shadow:
    0 30px 70px rgba(0,0,0,0.28);
  text-align: center;
}

.modal-icon {
  font-size: 36px;
}

.confirm-modal h2 {
  margin: 10px 0 5px;
  font-size: 20px;
}

.confirm-modal p {
  margin: 0;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.5;
}

.modal-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 18px;
}

@media (min-width: 700px) {
  .app-shell {
    display: flex;
    justify-content: center;
    background:
      radial-gradient(
        circle at 50% 0%,
        rgba(109, 93, 252, 0.12),
        transparent 450px
      ),
      var(--bg);
  }

  .mobile-screen {
    box-shadow:
      0 0 80px rgba(0, 0, 0, 0.08);
  }
}

@media (max-width: 360px) {
  .mobile-screen {
    padding-left: 12px;
    padding-right: 12px;
  }

  .brand-subtitle {
    max-width: 135px;
  }

  .home-hero h1 {
    font-size: 30px;
  }

  .quick-stats {
    gap: 5px;
  }

  .quick-stat {
    padding-left: 3px;
    padding-right: 3px;
  }

  .question-text {
    font-size: 22px;
  }

  .result-stat-grid {
    gap: 5px;
  }
}
`;

export default App;