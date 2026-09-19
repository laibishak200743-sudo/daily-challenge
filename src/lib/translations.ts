export type TranslationDict = Record<string, string>;
export type Language = 'en' | 'ar' | 'fr' | 'es';

export const translations: Record<Language, TranslationDict> = {
  en: {
    'app.name': 'WanderWise Pro',
    'app.tagline': 'Your AI-powered travel companion',
    'nav.discover': 'Discover',
    'nav.map': 'Map',
    'nav.itinerary': 'Itinerary',
    'nav.vault': 'Trip Vault',
    'nav.premium': 'Go Premium',

    'hero.titleA': 'Plan smarter.',
    'hero.titleB': 'Travel wiser.',
    'hero.subtitle':
      'AI-powered itineraries, interactive maps, and a personal trip vault — all in one sleek app.',
    'hero.cta': 'Start Planning Free',
    'hero.cta2': 'View Demo Map',
    'hero.stat.destinations': 'Destinations',
    'hero.stat.itineraries': 'Itineraries',
    'hero.stat.rating': 'User Rating',

    'ai.badge': 'Expert AI travel assistant (powered by real AI)',
    'ai.title': 'Ask the travel expert about any destination',
    'ai.subtitle':
      'Ask about any city, request itineraries, or explore landmarks freely.',
    'ai.welcome':
      'Welcome! 🌍 I\'m your smart travel expert for WanderWise Pro. Ask me about any city in the world, its highlights, travel plans, costs, or anything on your mind, and I\'ll answer with full intelligence!',
    'ai.connected': 'Connected to real AI system',
    'ai.flexibility': 'Full flexibility',
    'ai.dynamicAnswers': 'Dynamic answers',
    'ai.quickPrompts': 'Quick prompts:',
    'ai.prompt1': 'What are the best attractions in Tokyo?',
    'ai.prompt2':
      'Give me a 3-day Paris itinerary focused on food',
    'ai.prompt3':
      'What is the cost of living and travel in Istanbul for a week?',
    'ai.prompt4':
      'Where is Constantine and what are its main landmarks?',
    'ai.placeholder':
      'Ask about any city in the world and I\'ll answer intelligently...',
    'ai.send': 'Send',
    'ai.thinking':
      'AI is analyzing your request and writing a reply...',
    'ai.errorGeneric':
      'Sorry, the AI could not generate an answer.',
    'ai.errorBusy':
      'Sorry, the server is temporarily busy. Please try again shortly.',
    'ai.langInstruction': 'Answer in English',

    'badge.vault': 'YOUR COLLECTION',
    'section.vault.title': 'Trip Vault',
    'section.vault.subtitle':
      'Save your bookings, tickets, notes, and favorite places in one place.',
    'vault.all': 'All',
    'vault.booking': 'Booking',
    'vault.ticket': 'Ticket',
    'vault.note': 'Note',
    'vault.place': 'Place',
    'vault.add': 'Add',
    'vault.empty':
      'Your vault is empty. Start saving places and bookings!',
    'vault.bookingRef': 'Booking Ref',
    'vault.name': 'Name',
    'vault.placeholder': 'e.g. Hilton Hotel Paris',
    'vault.category': 'Category',
    'vault.address': 'Address',
    'vault.notes': 'Notes',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
  },

  ar: {
    'app.name': 'واندر وايز برو',
    'app.tagline': 'رفيق السفر المدعوم بالذكاء الاصطناعي',
    'nav.discover': 'اكتشف',
    'nav.map': 'الخريطة',
    'nav.itinerary': 'خط الرحلة',
    'nav.vault': 'خزنة الرحلات',
    'nav.premium': 'النسخة المميزة',

    'hero.titleA': 'خطط بذكاء.',
    'hero.titleB': 'سافر بحكمة.',
    'hero.subtitle':
      'خطط رحلات بالذكاء الاصطناعي، وخرائط تفاعلية، وخزنة شخصية للرحلات — كل ذلك في تطبيق أنيق واحد.',
    'hero.cta': 'ابدأ التخطيط مجاناً',
    'hero.cta2': 'عرض الخريطة التجريبية',
    'hero.stat.destinations': 'وجهة',
    'hero.stat.itineraries': 'خطط رحلة',
    'hero.stat.rating': 'تقييم المستخدمين',

    'ai.badge':
      'مساعد السفر الذكي الخبير (متكامل بالذكاء الاصطناعي الحقيقي)',
    'ai.title': 'اسأل خبير السفر عن أي وجهة في العالم',
    'ai.subtitle':
      'استفسر عن أي مدينة، اطلب خطط رحلات، أو استفسر عن المعالم بحرية تامة.',
    'ai.welcome':
      'أهلاً بك يا صديقي في المساعد الذكي لـ WanderWise Pro! 🌍 أنا خبير السفر الذكي الخاص بك. يمكنك سؤالي عن أي مدينة في العالم، مميزاتها، خطط السفر، التكاليف، أو أي استفسار يخطر ببالك وسأجيبك بذكاء كامل!',
    'ai.connected': 'متصل بنظام الذكاء الاصطناعي الحقيقي',
    'ai.flexibility': 'مرونة كاملة',
    'ai.dynamicAnswers': 'إجابات ديناميكية',
    'ai.quickPrompts': 'اقتراحات سريعة:',
    'ai.prompt1': 'ما هي أفضل الأماكن السياحية في طوكيو؟',
    'ai.prompt2':
      'اعطني جدول رحلة لمدة 3 أيام إلى باريس مع التركيز على الطعام',
    'ai.prompt3':
      'ما هي تكلفة السفر والمعيشة في اسطنبول لمدة أسبوع؟',
    'ai.prompt4':
      'أين تقع قسنطينة وما هي أبرز معالمها؟',
    'ai.placeholder':
      'اسأل عن أي مدينة في العالم وسأجيبك بذكاء...',
    'ai.send': 'إرسال',
    'ai.thinking':
      'الذكاء الاصطناعي يحلل طلبك ويكتب الرد...',
    'ai.errorGeneric':
      'عذراً، لم يتمكن الذكاء الاصطناعي من توليد إجابة.',
    'ai.errorBusy':
      'عذراً، الخادم يشهد ضغطاً مؤقتاً حالياً. يرجى المحاولة بعد قليل.',
    'ai.langInstruction': 'أجب باللغة العربية',

    'badge.vault': 'مجموعتك',
    'section.vault.title': 'خزنة الرحلات',
    'section.vault.subtitle':
      'احفظ حجوزاتك وتذاكرك وملاحظاتك وأماكنك المفضلة في مكان واحد.',
    'vault.all': 'الكل',
    'vault.booking': 'حجز',
    'vault.ticket': 'تذكرة',
    'vault.note': 'ملاحظة',
    'vault.place': 'مكان',
    'vault.add': 'إضافة',
    'vault.empty':
      'خزنتك فارغة. ابدأ بحفظ الأماكن والحجوزات!',
    'vault.bookingRef': 'رقم الحجز',
    'vault.name': 'الاسم',
    'vault.placeholder': 'مثال: فندق هيلتون باريس',
    'vault.category': 'الفئة',
    'vault.address': 'العنوان',
    'vault.notes': 'ملاحظات',
    'common.cancel': 'إلغاء',
    'common.save': 'حفظ',
  },

  fr: {
    'app.name': 'WanderWise Pro',
    'app.tagline':
      'Votre compagnon de voyage propulsé par l\'IA',
    'nav.discover': 'Découvrir',
    'nav.map': 'Carte',
    'nav.itinerary': 'Itinéraire',
    'nav.vault': 'Coffre de voyage',
    'nav.premium': 'Passer Premium',

    'hero.titleA': 'Planifiez plus intelligemment.',
    'hero.titleB': 'Voyagez plus sagement.',
    'hero.subtitle':
      'Itinéraires générés par IA, cartes interactives et un coffre de voyage personnel — le tout dans une seule application élégante.',
    'hero.cta': 'Commencer gratuitement',
    'hero.cta2': 'Voir la carte de démo',
    'hero.stat.destinations': 'Destinations',
    'hero.stat.itineraries': 'Itinéraires',
    'hero.stat.rating': 'Note des utilisateurs',

    'ai.badge':
      'Assistant de voyage expert (propulsé par une IA réelle)',
    'ai.title':
      'Demandez à l\'expert voyage sur n\'importe quelle destination',
    'ai.subtitle':
      'Posez des questions sur une ville, demandez des itinéraires ou explorez librement les sites.',
    'ai.welcome':
      'Bienvenue ! 🌍 Je suis votre expert voyage intelligent pour WanderWise Pro. Posez-moi des questions sur n\'importe quelle ville, ses attraits, vos plans de voyage, les coûts, ou tout ce qui vous passe par la tête, et je répondrai avec une intelligence complète !',
    'ai.connected': 'Connecté à un système d\'IA réel',
    'ai.flexibility': 'Flexibilité totale',
    'ai.dynamicAnswers': 'Réponses dynamiques',
    'ai.quickPrompts': 'Suggestions rapides :',
    'ai.prompt1':
      'Quelles sont les meilleures attractions de Tokyo ?',
    'ai.prompt2':
      'Donnez-moi un itinéraire de 3 jours à Paris axé sur la gastronomie',
    'ai.prompt3':
      'Quel est le coût de la vie et du voyage à Istanbul pour une semaine ?',
    'ai.prompt4':
      'Où se trouve Constantine et quels sont ses principaux sites ?',
    'ai.placeholder':
      'Demandez-moi n\'importe quelle ville dans le monde...',
    'ai.send': 'Envoyer',
    'ai.thinking':
      'L\'IA analyse votre demande et rédige une réponse...',
    'ai.errorGeneric':
      'Désolé, l\'IA n\'a pas pu générer de réponse.',
    'ai.errorBusy':
      'Désolé, le serveur est temporairement occupé. Veuillez réessayer bientôt.',
    'ai.langInstruction': 'Répondez en français',

    'badge.vault': 'VOTRE COLLECTION',
    'section.vault.title': 'Coffre de voyage',
    'section.vault.subtitle':
      'Enregistrez vos réservations, billets, notes et lieux favoris au même endroit.',
    'vault.all': 'Tout',
    'vault.booking': 'Réservation',
    'vault.ticket': 'Billet',
    'vault.note': 'Note',
    'vault.place': 'Lieu',
    'vault.add': 'Ajouter',
    'vault.empty':
      'Votre coffre est vide. Commencez à enregistrer des lieux et réservations !',
    'vault.bookingRef': 'Réf. de réservation',
    'vault.name': 'Nom',
    'vault.placeholder': 'ex. Hôtel Hilton Paris',
    'vault.category': 'Catégorie',
    'vault.address': 'Adresse',
    'vault.notes': 'Notes',
    'common.cancel': 'Annuler',
    'common.save': 'Enregistrer',
  },

  es: {
    'app.name': 'WanderWise Pro',
    'app.tagline': 'Tu compañero de viaje potenciado por IA',
    'nav.discover': 'Descubrir',
    'nav.map': 'Mapa',
    'nav.itinerary': 'Itinerario',
    'nav.vault': 'Bóveda de viajes',
    'nav.premium': 'Hazte Premium',

    'hero.titleA': 'Planifica más inteligente.',
    'hero.titleB': 'Viaja más sabio.',
    'hero.subtitle':
      'Itinerarios con IA, mapas interactivos y una bóveda de viaje personal, todo en una sola aplicación elegante.',
    'hero.cta': 'Empieza a planificar gratis',
    'hero.cta2': 'Ver mapa de demostración',
    'hero.stat.destinations': 'Destinos',
    'hero.stat.itineraries': 'Itinerarios',
    'hero.stat.rating': 'Valoración de usuarios',

    'ai.badge':
      'Asistente de viaje experto (impulsado por IA real)',
    'ai.title':
      'Pregunta al experto en viajes sobre cualquier destino',
    'ai.subtitle':
      'Pregunta sobre cualquier ciudad, pide itinerarios o explora lugares con total libertad.',
    'ai.welcome':
      '¡Bienvenido! 🌍 Soy tu experto en viajes inteligente de WanderWise Pro. Pregúntame sobre cualquier ciudad del mundo, sus atractivos, planes de viaje, costos, o lo que se te ocurra, ¡y responderé con total inteligencia!',
    'ai.connected': 'Conectado a un sistema de IA real',
    'ai.flexibility': 'Flexibilidad total',
    'ai.dynamicAnswers': 'Respuestas dinámicas',
    'ai.quickPrompts': 'Sugerencias rápidas:',
    'ai.prompt1':
      '¿Cuáles son las mejores atracciones de Tokio?',
    'ai.prompt2':
      'Dame un itinerario de 3 días en París centrado en la comida',
    'ai.prompt3':
      '¿Cuál es el costo de vida y viaje en Estambul por una semana?',
    'ai.prompt4':
      '¿Dónde está Constantina y cuáles son sus principales monumentos?',
    'ai.placeholder':
      'Pregunta sobre cualquier ciudad del mundo...',
    'ai.send': 'Enviar',
    'ai.thinking':
      'La IA está analizando tu solicitud y escribiendo una respuesta...',
    'ai.errorGeneric':
      'Lo siento, la IA no pudo generar una respuesta.',
    'ai.errorBusy':
      'Lo siento, el servidor está temporalmente ocupado. Inténtalo de nuevo pronto.',
    'ai.langInstruction': 'Responde en español',

    'badge.vault': 'TU COLECCIÓN',
    'section.vault.title': 'Bóveda de viajes',
    'section.vault.subtitle':
      'Guarda tus reservas, billetes, notas y lugares favoritos en un solo lugar.',
    'vault.all': 'Todo',
    'vault.booking': 'Reserva',
    'vault.ticket': 'Billete',
    'vault.note': 'Nota',
    'vault.place': 'Lugar',
    'vault.add': 'Añadir',
    'vault.empty':
      '¡Tu bóveda está vacía. Empieza a guardar lugares y reservas!',
    'vault.bookingRef': 'Ref. de reserva',
    'vault.name': 'Nombre',
    'vault.placeholder': 'ej. Hotel Hilton París',
    'vault.category': 'Categoría',
    'vault.address': 'Dirección',
    'vault.notes': 'Notas',
    'common.cancel': 'Cancelar',
    'common.save': 'Guardar',
  },
};