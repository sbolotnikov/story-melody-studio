import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "nav.packages": "Packages",
      "nav.occasions": "Occasions",
      "nav.gallery": "Gallery",
      "nav.about": "About",
      "gallery.desc": "Explore our portfolio of unique personalized creations.",
      "gallery.tabs.image": "Images",
      "gallery.tabs.video": "Videos",
      "gallery.tabs.song": "Songs",
      "gallery.loading": "Loading...",
      "gallery.empty": "No items to display yet.",
      "action.start": "Start Questionnaire",
      "action.explore": "Explore Packages",
      "action.portfolio": "Watch Portfolio",
      "action.learn_more": "Learn More",
      "action.best_seller": "Best Seller",
      "action.view_gallery": "View Gallery",
      "action.build_package": "Build Package",
      "action.share": "Share",
      "action.copied": "Copied",
      
      "hero.badge": "Personalized Stories",
      "hero.title1": "Turn Your Story Into",
      "hero.title2": "a Song, Video & Portrait",
      "hero.subtitle": "Personalized songs, cinematic music videos, and custom portraits for birthdays, weddings, anniversaries, competitions, and unforgettable life moments.",
      "hero.stats": "Over 500+ stories turned into art",
      
      "products.title_small": "Choose Your Experience",
      "products.title": "Crafted with Heart",
      "products.subtitle": "We don't just use standard templates. Every project is carefully directed, combining your memories with cutting-edge AI production and human artistry.",
      
      "products.song.title": "Personalized Songs",
      "products.song.desc": "A studio-quality track written specifically about your life, in any genre from cinematic pop to classic waltz.",
      "products.song.link": "View Examples",
      
      "products.video.title": "Music Videos",
      "products.video.desc": "Turn your custom song into a visual masterpiece using your photos, animated lyrics, or AI-generated cinematic scenes.",
      "products.video.link": "Watch Films",
      
      "products.portrait.title": "Custom Portraits",
      "products.portrait.desc": "Beautiful digital paintings that capture personality, perfect as an album cover or a standalone gift.",
      "products.portrait.link": "See Gallery",

      "pricing.title_small": "Pricing",
      "pricing.title": "Designed for Every Moment",
      "pricing.view_all": "View All Packages",
      
      "pricing.pack1.type": "Song Only",
      "pricing.pack1.title": "Memory Verse",
      "pricing.pack1.desc": "Perfect for a heartfelt birthday greeting or a short customized message.",
      
      "pricing.pack2.type": "Song + Video",
      "pricing.pack2.title": "Cinematic Symphony",
      "pricing.pack2.desc": "A deeply personal track paired with stunning, dreamlike visuals.",
      
      "pricing.pack3.type": "Complete Event",
      "pricing.pack3.title": "Legacy Film",
      "pricing.pack3.desc": "A cinematic documentary style experience for major milestones.",

      "cta.title": "Ready to create something unforgettable?",
      "cta.desc": "Start the questionnaire today. You don't need to be a writer—just tell us what you love about them, and we'll handle the rest.",

      "occasions.main_desc": "No matter what you're celebrating, we have the perfect musical accompaniment. Explore our most popular occasions.",
      "occasions.back": "\u2190 Back to all occasions",
      "occasions.explore": "Explore \u2192",
      
      "occasions.birthdays.title": "Birthdays",
      "occasions.birthdays.desc": "Celebrate another trip around the sun with a custom song that captures the unique personality, inside jokes, and cherished memories of the birthday person. A truly unforgettable gift.",
      
      "occasions.weddings.title": "Weddings",
      "occasions.weddings.desc": "Your love story is one of a kind. Tell it through a custom song created just for your first dance, walking down the aisle, or as a timeless gift for your partner.",
      
      "occasions.anniversaries.title": "Anniversaries",
      "occasions.anniversaries.desc": "Relive the magic of your journey together. A custom song is the perfect way to express your enduring love, celebrating milestones big and small.",
      
      "occasions.dance.title": "Dance Competitions",
      "occasions.dance.desc": "Stand out on stage with an original track tailored to your routine. We create dynamic, beat-driven pieces designed to highlight your choreography.",
      
      "occasions.retirements.title": "Retirements",
      "occasions.retirements.desc": "Honor a lifelong career and toast to the future with a personalized musical tribute. Perfect for celebrating an incredible legacy with colleagues and loved ones."
    }
  },
  ru: {
    translation: {
      "nav.packages": "Пакеты",
      "nav.occasions": "Поводы",
      "nav.gallery": "Галерея",
      "nav.about": "О нас",
      "gallery.desc": "Изучите наше портфолио уникальных персональных работ.",
      "gallery.tabs.image": "Изображения",
      "gallery.tabs.video": "Клипы",
      "gallery.tabs.song": "Песни",
      "gallery.loading": "Загрузка...",
      "gallery.empty": "Пока нет элементов для отображения.",
      "action.start": "Начать Анкету",
      "action.explore": "Смотреть Пакеты",
      "action.portfolio": "Портфолио",
      "action.learn_more": "Узнать больше",
      "action.best_seller": "Хит продаж",
      "action.view_gallery": "В галерею",
      "action.build_package": "Собрать пакет",
      "action.share": "Поделиться",
      "action.copied": "Скопировано",
      
      "hero.badge": "Персональные Истории",
      "hero.title1": "Превратим Вашу Историю",
      "hero.title2": "в Песню, Клип & Портрет",
      "hero.subtitle": "Персональные песни, клипы и цифровые портреты для дней рождения, свадеб, юбилеев, конкурсов и незабываемых событий.",
      "hero.stats": "Более 500+ историй стали искусством",
      
      "products.title_small": "Выберите Ваш Формат",
      "products.title": "Создано с Душой",
      "products.subtitle": "Мы не используем скучные шаблоны. Каждый проект тщательно режиссируется, объединяя ваши воспоминания с AI продакшеном и искусством человека.",

      "products.song.title": "Персональные Песни",
      "products.song.desc": "Студийный трек, написанный о вашей жизни в любом жанре: от кинематографичного попа до классического вальса.",
      "products.song.link": "Смотреть Примеры",

      "products.video.title": "Музыкальные Клипы",
      "products.video.desc": "Превратите песню в визуальный шедевр: из ваших фото, анимированного текста и сгенерированных сцен.",
      "products.video.link": "Смотреть Клипы",

      "products.portrait.title": "Цифровые Портреты",
      "products.portrait.desc": "Красивые цифровые картины, которые передают характер. Идеально для обложки альбома или отдельного подарка.",
      "products.portrait.link": "В Галерею",

      "pricing.title_small": "Цены",
      "pricing.title": "Создано для Любого Повода",
      "pricing.view_all": "Все Пакеты",

      "pricing.pack1.type": "Только Песня",
      "pricing.pack1.title": "Мелодия Воспоминаний",
      "pricing.pack1.desc": "Идеально для душевного поздравления с днем рождения или короткого сообщения.",
      
      "pricing.pack2.type": "Песня + Клип",
      "pricing.pack2.title": "Кинематографичная Симфония",
      "pricing.pack2.desc": "Глубокий личный трек в сочетании с потрясающим, сказочным визуалом.",
      
      "pricing.pack3.type": "Полный Пакет",
      "pricing.pack3.title": "Фильм-Наследие",
      "pricing.pack3.desc": "Масштабный документальный и кинематографичный формат для главных событий.",

      "cta.title": "Готовы создать нечто незабываемое?",
      "cta.desc": "Начните заполнять анкету уже сегодня. Вам не нужно быть писателем — просто расскажите, за что вы их любите, а мы сделаем все остальное.",

      "occasions.main_desc": "Что бы вы ни праздновали, у нас есть идеальное музыкальное сопровождение. Изучите наши самые популярные поводы.",
      "occasions.back": "\u2190 Назад ко всем поводам",
      "occasions.explore": "Подробнее \u2192",
      
      "occasions.birthdays.title": "Дни Рождения",
      "occasions.birthdays.desc": "Отпразднуйте еще один год жизни с персонализированной песней, которая передаст уникальный характер, локальные шутки и теплые воспоминания об имениннике.",
      
      "occasions.weddings.title": "Свадьбы",
      "occasions.weddings.desc": "Ваша история любви уникальна. Расскажите ее с помощью песни, созданной для вашего первого танца, выхода невесты или как подарок партнеру.",
      
      "occasions.anniversaries.title": "Юбилеи",
      "occasions.anniversaries.desc": "Вновь переживите волшебство вашего пути вместе. Песня на заказ — идеальный способ выразить вашу любовь и отметить важные вехи.",
      
      "occasions.dance.title": "Танцевальные Конкурсы",
      "occasions.dance.desc": "Выделитесь на сцене с оригинальным треком для вашего номера. Мы создаем динамичные композиции, подчеркивающие вашу хореографию.",
      
      "occasions.retirements.title": "Выход на Пенсию",
      "occasions.retirements.desc": "Отдайте дань уважения карьере и поднимите тост за будущее с помощью музыкального трибьюта. Идеально для празднования с коллегами и близкими."
    }
  },
  it: {
    translation: {
      "nav.packages": "Pacchetti",
      "nav.occasions": "Occasioni",
      "nav.gallery": "Galleria",
      "nav.about": "Chi Siamo",
      "gallery.desc": "Esplora il nostro portfolio di creazioni personalizzate.",
      "gallery.tabs.image": "Immagini",
      "gallery.tabs.video": "Video",
      "gallery.tabs.song": "Canzoni",
      "gallery.loading": "Caricamento...",
      "gallery.empty": "Nessun elemento da visualizzare per ora.",
      "action.start": "Inizia il Questionario",
      "action.explore": "Esplora i Pacchetti",
      "action.portfolio": "Guarda il Portfolio",
      "action.learn_more": "Scopri di più",
      "action.best_seller": "I più venduti",
      "action.view_gallery": "Guarda la Galleria",
      "action.build_package": "Crea il Pacchetto",
      "action.share": "Condividi",
      "action.copied": "Copiato",

      "hero.badge": "Storie Personalizzate",
      "hero.title1": "Trasforma la Tua Storia",
      "hero.title2": "in una Canzone, Video o Ritratto",
      "hero.subtitle": "Canzoni personalizzate, video musicali cinematografici e ritratti su misura per compleanni, matrimoni, anniversari e momenti indimenticabili.",
      "hero.stats": "Oltre 500+ storie trasformate in arte",

      "products.title_small": "Scegli la tua esperienza",
      "products.title": "Creato col Cuore",
      "products.subtitle": "Non usiamo modelli standard. Ogni progetto è diretto con cura, combinando i tuoi ricordi con la produzione AI e l'abilità artistica.",

      "products.song.title": "Canzoni Personalizzate",
      "products.song.desc": "Una traccia di qualità da studio scritta appositamente sulla tua vita, in qualsiasi genere.",
      "products.song.link": "Vedi Esempi",

      "products.video.title": "Video Musicali",
      "products.video.desc": "Trasforma la tua canzone personalizzata in un capolavoro visivo usando le tue foto, testi animati o scene generate dall'IA.",
      "products.video.link": "Guarda i Video",

      "products.portrait.title": "Ritratti Personalizzati",
      "products.portrait.desc": "Splendidi dipinti digitali che catturano la personalità, perfetti come copertina per album o regalo.",
      "products.portrait.link": "Vedi la Galleria",

      "pricing.title_small": "Prezzi",
      "pricing.title": "Pensati per Ogni Momento",
      "pricing.view_all": "Vedi tutti i pacchetti",

      "pricing.pack1.type": "Solo Canzone",
      "pricing.pack1.title": "Verso dei Ricordi",
      "pricing.pack1.desc": "Perfetto per un augurio di compleanno sincero o un breve messaggio personalizzato.",

      "pricing.pack2.type": "Canzone + Video",
      "pricing.pack2.title": "Sinfonia Cinematografica",
      "pricing.pack2.desc": "Un brano profondamente personale abbinato a immagini straordinarie.",

      "pricing.pack3.type": "Evento Completo",
      "pricing.pack3.title": "Film Eredità",
      "pricing.pack3.desc": "Un'esperienza in stile documentario cinematografico per i grandi traguardi.",

      "cta.title": "Pronto a creare qualcosa di indimenticabile?",
      "cta.desc": "Inizia oggi stesso a compilare il questionario. Non è necessario essere scrittori, raccontaci semplicemente cosa ami di loro e al resto pensiamo noi.",

      "occasions.main_desc": "Qualunque cosa tu stia festeggiando, abbiamo l'accompagnamento musicale perfetto. Esplora le nostre occasioni più popolari.",
      "occasions.back": "\u2190 Torna a tutte le occasioni",
      "occasions.explore": "Esplora \u2192",
      
      "occasions.birthdays.title": "Compleanni",
      "occasions.birthdays.desc": "Festeggia un altro traguardo con una canzone personalizzata che cattura la personalità unica, le battute e i ricordi più cari. Un regalo indimenticabile.",
      
      "occasions.weddings.title": "Matrimoni",
      "occasions.weddings.desc": "La vostra storia d'amore è unica. Raccontala attraverso una canzone creata appositamente per il vostro primo ballo o come dono per il tuo partner.",
      
      "occasions.anniversaries.title": "Anniversari",
      "occasions.anniversaries.desc": "Rivivi la magia del vostro viaggio insieme. Una canzone personalizzata è il modo perfetto per esprimere il tuo amore.",
      
      "occasions.dance.title": "Gare di Ballo",
      "occasions.dance.desc": "Distinguiti sul palco con un brano originale su misura per la tua coreografia. Creiamo pezzi dinamici per esaltare i tuoi movimenti.",
      
      "occasions.retirements.title": "Pensionamenti",
      "occasions.retirements.desc": "Onora una carriera e brinda al futuro con un tributo musicale personalizzato. Perfetto per celebrare con colleghi e persone care."
    }
  },
  pl: {
    translation: {
      "nav.packages": "Pakiety",
      "nav.occasions": "Okazje",
      "nav.gallery": "Galeria",
      "nav.about": "O nas",
      "gallery.desc": "Odkryj nasze portfolio unikalnych, spersonalizowanych kreacji.",
      "gallery.tabs.image": "Obrazy",
      "gallery.tabs.video": "Wideo",
      "gallery.tabs.song": "Piosenki",
      "gallery.loading": "Ładowanie...",
      "gallery.empty": "Brak elementów do wyświetlenia.",
      "action.start": "Rozpocznij Ankietę",
      "action.explore": "Zobacz Pakiety",
      "action.portfolio": "Obejrzyj Portfolio",
      "action.learn_more": "Dowiedz się więcej",
      "action.best_seller": "Najpopularniejsze",
      "action.view_gallery": "Obejrzyj Galerię",
      "action.build_package": "Stwórz Pakiet",
      "action.share": "Udostępnij",
      "action.copied": "Skopiowano",

      "hero.badge": "Spersonalizowane Historie",
      "hero.title1": "Zmień Swoją Historię",
      "hero.title2": "w Piosenkę, Teledysk i Portret",
      "hero.subtitle": "Spersonalizowane piosenki, filmowe teledyski i cyfrowe portrety na urodziny, wesela, rocznice i niezapomniane chwile.",
      "hero.stats": "Ponad 500+ historii zamienionych w sztukę",

      "products.title_small": "Wybierz Format",
      "products.title": "Stworzone z Sercem",
      "products.subtitle": "Nie korzystamy ze standardowych szablonów. Każdy projekt jest starannie reżyserowany, łącząc Twoje wspomnienia z produkcją AI i ludzkim artyzmem.",

      "products.song.title": "Spersonalizowane Piosenki",
      "products.song.desc": "Studyjnej jakości utwór napisany specjalnie o Twoim życiu, w dowolnym gatunku muzycznym.",
      "products.song.link": "Zobacz Przykłady",

      "products.video.title": "Teledyski",
      "products.video.desc": "Zamień swoją piosenkę w wizualne arcydzieło dzięki swoim zdjęciom, animowanym tekstom i scenom AI.",
      "products.video.link": "Obejrzyj Filmy",

      "products.portrait.title": "Cyfrowe Portrety",
      "products.portrait.desc": "Piękne cyfrowe obrazy uchwycające osobowość, idealne jako okładka albumu lub prezent.",
      "products.portrait.link": "Zobacz Galerię",

      "pricing.title_small": "Cennik",
      "pricing.title": "Na Każdą Okazję",
      "pricing.view_all": "Zobacz Wszystkie Pakiety",

      "pricing.pack1.type": "Tylko Piosenka",
      "pricing.pack1.title": "Melodia Wspomnień",
      "pricing.pack1.desc": "Idealne na serdeczne życzenia urodzinowe lub krótką dedykację.",

      "pricing.pack2.type": "Piosenka + Teledysk",
      "pricing.pack2.title": "Filmowa Symfonia",
      "pricing.pack2.desc": "Głęboko osobisty utwór w połączeniu z oszałamiającą warstwą wizualną.",

      "pricing.pack3.type": "Pełen Pakiet",
      "pricing.pack3.title": "Film Dziedzictwa",
      "pricing.pack3.desc": "Kinowe, dokumentalne doświadczenie dla najważniejszych wydarzeń.",

      "cta.title": "Gotowy, by stworzyć coś niezapomnianego?",
      "cta.desc": "Zacznij wypełniać ankietę już dziś. Nie musisz być pisarzem – po prostu opowiedz nam, za co ich kochasz, a my zajmiemy się resztą.",

      "occasions.main_desc": "Niezależnie od okazji, mamy idealną muzyczną oprawę. Odkryj nasze najpopularniejsze okazje.",
      "occasions.back": "\u2190 Powrót do wszystkich okazji",
      "occasions.explore": "Zobacz \u2192",
      
      "occasions.birthdays.title": "Urodziny",
      "occasions.birthdays.desc": "Świętuj kolejny rok z wyjątkową piosenką, która uchwyci charakterystyczne cechy, żarty i cenne wspomnienia. Naprawdę niezapomniany prezent.",
      
      "occasions.weddings.title": "Wesela",
      "occasions.weddings.desc": "Wasza historia miłosna jest jedyna w swoim rodzaju. Opowiedzcie ją poprzez piosenkę stworzoną na pierwszy taniec lub jako prezent dla partnera.",
      
      "occasions.anniversaries.title": "Rocznice",
      "occasions.anniversaries.desc": "Przeżyjcie ponownie magię waszej drogi. Spersonalizowany utwór to idealny sposób na wyrażenie wiecznej miłości i świętowanie milowych kroków.",
      
      "occasions.dance.title": "Turnieje Taneczne",
      "occasions.dance.desc": "Wyróżnij się na scenie dzięki oryginalnemu układowi dopasowanemu do Twojego występu. Tworzymy dynamiczne utwory idealne do Twojej choreografii.",
      
      "occasions.retirements.title": "Emerytury",
      "occasions.retirements.desc": "Uhonoruj karierę i wnieś toast za przyszłość spersonalizowanym muzycznym akcentem. Idealne na uroczystości ze współpracownikami z pracy."
    }
  },
    fr: {
    translation: {
      "nav.packages": "Des Prix",
      "nav.occasions": "Occasions",
      "nav.gallery": "Galerie",
      "nav.about": "À propos",
      "gallery.desc": "Explorez notre portfolio de créations personnalisées uniques.",
      "gallery.tabs.image": "Images",
      "gallery.tabs.video": "Vidéos",
      "gallery.tabs.song": "Chansons",
      "gallery.loading": "Chargement...",
      "gallery.empty": "Aucun élément à afficher pour le moment.",
      "action.start": "Démarrer le Questionnaire",
      "action.explore": "Explorer les Forfaits",
      "action.portfolio": "Regarder le Portfolio",
      "action.learn_more": "En savoir plus",
      "action.best_seller": "Meilleures ventes",
      "action.view_gallery": "Voir la Galerie",
      "action.build_package": "Construire un Forfait",
      "action.share": "Partager",
      "action.copied": "Copié",
      
      "hero.badge": "Histoires Personnalisées",
      "hero.title1": "Transformez Votre Histoire en",
      "hero.title2": "Chanson, Vidéo et Portrait",
      "hero.subtitle": "Des chansons personnalisées, des clips cinématographiques et des portraits sur mesure pour les anniversaires, les mariages et moments inoubliables.",
      "hero.stats": "Plus de 500+ histoires transformées en art",
      
      "products.title_small": "Choisissez Votre Expérience",
      "products.title": "Fabriqué avec le Cœur",
      "products.subtitle": "Nous n'utilisons pas de modèles standards. Chaque projet est soigneusement réalisé, combinant l'IA avec le côté artistique humain.",
      
      "products.song.title": "Chansons Personnalisées",
      "products.song.desc": "Un titre de qualité studio écrit spécialement pour votre vie, dans n'importe quel genre.",
      "products.song.link": "Voir des Exemples",
      
      "products.video.title": "Clips Vidéos",
      "products.video.desc": "Transformez votre chanson en un chef-d'œuvre visuel avec vos photos et les paroles animées.",
      "products.video.link": "Regarder des Films",
      
      "products.portrait.title": "Portraits Sur Mesure",
      "products.portrait.desc": "De belles peintures numériques qui capturent la personnalité. Parfait en couverture d'album ou en cadeau.",
      "products.portrait.link": "Voir la Galerie",

      "pricing.title_small": "Tarifs",
      "pricing.title": "Conçu pour Chaque Moment",
      "pricing.view_all": "Voir Tous les Forfaits",
      
      "pricing.pack1.type": "Chanson Uniquement",
      "pricing.pack1.title": "Vers des Souvenirs",
      "pricing.pack1.desc": "Parfait pour un salut chaleureux ou un court message personnalisé.",
      
      "pricing.pack2.type": "Chanson + Vidéo",
      "pricing.pack2.title": "Symphonie Cinématographique",
      "pricing.pack2.desc": "Une piste profondément personnelle accompagnée de visuels de rêve impressionnants.",
      
      "pricing.pack3.type": "Événement Complet",
      "pricing.pack3.title": "Film Héritage",
      "pricing.pack3.desc": "Une expérience de style documentaire pour les grands événements.",

      "cta.title": "Prêt à créer quelque chose d'inoubliable?",
      "cta.desc": "Commencez le questionnaire dès aujourd'hui. Dites-nous ce que vous aimez et nous nous occupons du reste.",

      "occasions.main_desc": "Peu importe ce que vous célébrez, nous avons l'accompagnement parfait. Explorez nos occasions les plus populaires.",
      "occasions.back": "← Retour à toutes les occasions",
      "occasions.explore": "Explorer →",
      
      "occasions.birthdays.title": "Anniversaires",
      "occasions.birthdays.desc": "Célébrez une nouvelle année avec une chanson personnalisée qui capture la personnalité unique. Un cadeau inoubliable.",
      
      "occasions.weddings.title": "Mariages",
      "occasions.weddings.desc": "Votre histoire d'amour est unique. Racontez-la à travers une chanson créée spécialement pour votre amour.",
      
      "occasions.anniversaries.title": "Anniversaries de Mariage",
      "occasions.anniversaries.desc": "Revivez la magie de votre voyage ensemble. Une chanson personnalisée est idéale pour exprimer votre amour.",
      
      "occasions.dance.title": "Compétitions de Danse",
      "occasions.dance.desc": "Démarquez-vous avec une musique originale adaptée à votre chorégraphie.",
      
      "occasions.retirements.title": "Départs à la Retraite",
      "occasions.retirements.desc": "Honorez une carrière et trinquez à l'avenir avec un hommage musical personnalisé."
    }
  },
  es: {
    translation: {
      "nav.packages": "Paquetes",
      "nav.occasions": "Ocasiones",
      "nav.gallery": "Galería",
      "nav.about": "Nosotros",
      "gallery.desc": "Explora nuestro portafolio de creaciones personalizadas únicas.",
      "gallery.tabs.image": "Imágenes",
      "gallery.tabs.video": "Videos",
      "gallery.tabs.song": "Canciones",
      "gallery.loading": "Cargando...",
      "gallery.empty": "No hay elementos para mostrar aún.",
      "action.start": "Empezar Cuestionario",
      "action.explore": "Explorar Paquetes",
      "action.portfolio": "Ver Portafolio",
      "action.learn_more": "Más Información",
      "action.best_seller": "Más Vendidos",
      "action.view_gallery": "Ver Galería",
      "action.build_package": "Construir Paquete",
      "action.share": "Compartir",
      "action.copied": "Copiado",
      
      "hero.badge": "Historias Personalizadas",
      "hero.title1": "Convierte Tu Historia en",
      "hero.title2": "una Canción, Video y Retrato",
      "hero.subtitle": "Canciones personalizadas, videos musicales y retratos para cumpleaños, bodas, y momentos inolvidables.",
      "hero.stats": "Más de 500 historias convertidas en arte",
      
      "products.title_small": "Elige Tu Experiencia",
      "products.title": "Hecho con el Corazón",
      "products.subtitle": "No usamos plantillas. Cada proyecto es único, combinando tus recuerdos con IA y arte humano.",
      
      "products.song.title": "Canciones Personalizadas",
      "products.song.desc": "Una pista de calidad de estudio escrita sobre tu vida, en cualquier género.",
      "products.song.link": "Ver Ejemplos",
      
      "products.video.title": "Videos Musicales",
      "products.video.desc": "Convierte tu canción en una obra maestra visual con tus fotos, letras animadas y más.",
      "products.video.link": "Ver Películas",
      
      "products.portrait.title": "Retratos Personalizados",
      "products.portrait.desc": "Hermosas pinturas digitales que captan la personalidad, perfectas como regalo.",
      "products.portrait.link": "Ver Galería",

      "pricing.title_small": "Precios",
      "pricing.title": "Diseñado para Cada Momento",
      "pricing.view_all": "Ver Todos los Paquetes",
      
      "pricing.pack1.type": "Solo Canción",
      "pricing.pack1.title": "Verso de Recuerdos",
      "pricing.pack1.desc": "Perfecto para un saludo de cumpleaños conmovedor o un mensaje corto.",
      
      "pricing.pack2.type": "Canción + Video",
      "pricing.pack2.title": "Sinfonía Cinematográfica",
      "pricing.pack2.desc": "Una pista profunda con visuales asombros y de ensueño.",
      
      "pricing.pack3.type": "Evento Completo",
      "pricing.pack3.title": "Película Heredada",
      "pricing.pack3.desc": "Experiencia documental para momentos importantes de tu vida.",

      "cta.title": "¿Listo para crear algo inolvidable?",
      "cta.desc": "Empieza hoy. Solo dinos lo que sientes, nosotros haremos el resto.",

      "occasions.main_desc": "Sin importar lo que celebres, tenemos el acompañamiento ideal. Explora nuestras ocasiones.",
      "occasions.back": "← Volver a ocasiones",
      "occasions.explore": "Explorar →",
      
      "occasions.birthdays.title": "Cumpleaños",
      "occasions.birthdays.desc": "Celebra un año más con una canción personalizada que capture la esencia de esa persona.",
      
      "occasions.weddings.title": "Bodas",
      "occasions.weddings.desc": "Tu historia de amor es única. Cuéntala con una canción creada para su primer baile.",
      
      "occasions.anniversaries.title": "Aniversarios",
      "occasions.anniversaries.desc": "Revive la magia de su viaje. Una canción personalizada es la manera perfecta de celebrar.",
      
      "occasions.dance.title": "Concursos de Baile",
      "occasions.dance.desc": "Destaca en el escenario con una pista original diseñada para tu coreografía.",
      
      "occasions.retirements.title": "Jubilaciones",
      "occasions.retirements.desc": "Honra una carrera y brinda por el futuro con un homenaje musical personalizado."
    }
  },
  de: {
    translation: {
      "nav.packages": "Pakete",
      "nav.occasions": "Anlässe",
      "nav.gallery": "Galerie",
      "nav.about": "Über uns",
      "gallery.desc": "Entdecken Sie unser Portfolio einzigartiger personalisierter Kreationen.",
      "gallery.tabs.image": "Bilder",
      "gallery.tabs.video": "Videos",
      "gallery.tabs.song": "Lieder",
      "gallery.loading": "Laden...",
      "gallery.empty": "Noch keine Elemente zum Anzeigen vorhanden.",
      "action.start": "Frühbogen starten",
      "action.explore": "Pakete erkunden",
      "action.portfolio": "Portfolio ansehen",
      "action.learn_more": "Mehr erfahren",
      "action.best_seller": "Bestseller",
      "action.view_gallery": "Galerie ansehen",
      "action.build_package": "Paket zusammenstellen",
      "action.share": "Teilen",
      "action.copied": "Kopiert",

      "hero.badge": "Personalisierte Geschichten",
      "hero.title1": "Verwandeln Sie Ihre Geschichte",
      "hero.title2": "in Ein Lied, Video & Porträt",
      "hero.subtitle": "Personalisierte Lieder, filmische Musikvideos und individuelle Porträts für Geburtstage, Hochzeiten, Jubiläen und unvergessliche Momente.",
      "hero.stats": "Über 500+ Geschichten in Kunst verwandelt",

      "products.title_small": "Wählen Sie Ihr Erlebnis",
      "products.title": "Mit Herz Gemacht",
      "products.subtitle": "Wir verwenden keine Standardvorlagen. Jedes Projekt wird sorgfältig umgesetzt, um Ihre Erinnerungen mit AI-Produktion und menschlicher Kunst zu verbinden.",

      "products.song.title": "Personalisierte Lieder",
      "products.song.desc": "Ein Song in Studioqualität, speziell über Ihr Leben geschrieben, in jedem Genre von Pop bis klassischem Walzer.",
      "products.song.link": "Beispiele ansehen",

      "products.video.title": "Musikvideos",
      "products.video.desc": "Verwandeln Sie Ihren Song in ein visuelles Meisterwerk mit Ihren Fotos, animiertem Text und kinoreifen AI-Szenen.",
      "products.video.link": "Filme ansehen",

      "products.portrait.title": "Digitale Porträts",
      "products.portrait.desc": "Wunderschöne digitale Gemälde, die Persönlichkeit einfangen - perfekt als Albumcover oder Geschenk.",
      "products.portrait.link": "Zur Galerie",

      "pricing.title_small": "Preise",
      "pricing.title": "Gemacht für Jeden Moment",
      "pricing.view_all": "Alle Pakete ansehen",

      "pricing.pack1.type": "Nur Lied",
      "pricing.pack1.title": "Erinnerungsmelodie",
      "pricing.pack1.desc": "Perfekt für einen herzlichen Geburtstagsgruß oder eine kurze Nachricht.",

      "pricing.pack2.type": "Lied + Video",
      "pricing.pack2.title": "Filmische Sinfonie",
      "pricing.pack2.desc": "Ein tief persönlicher Track gepaart mit atemberaubender Optik.",

      "pricing.pack3.type": "Komplettes Event",
      "pricing.pack3.title": "Vermächtnis-Film",
      "pricing.pack3.desc": "Ein dokumentarisches Filmerlebnis für die wichtigsten Meilensteine.",

      "cta.title": "Bereit, etwas Unvergessliches zu schaffen?",
      "cta.desc": "Beginnen Sie noch heute mit dem Fragebogen. Sie müssen kein Schriftsteller sein – sagen Sie uns einfach, was Sie an ihnen lieben, und wir erledigen den Rest.",

      "occasions.main_desc": "Egal was Sie feiern, wir haben die perfekte musikalische Begleitung. Entdecken Sie unsere beliebtesten Anlässe.",
      "occasions.back": "\u2190 Zurück zu allen Anlässen",
      "occasions.explore": "Entdecken \u2192",
      
      "occasions.birthdays.title": "Geburtstage",
      "occasions.birthdays.desc": "Feiern Sie ein weiteres Jahr mit einem individuellen Lied, das die einzigartige Persönlichkeit, Insider-Witze und geschätzte Erinnerungen einfängt. Ein wirklich unvergessliches Geschenk.",
      
      "occasions.weddings.title": "Hochzeiten",
      "occasions.weddings.desc": "Ihre Liebesgeschichte ist einzigartig. Erzählen Sie sie durch ein Lied, das speziell für Ihren ersten Tanz oder als Geschenk für Ihren Partner komponiert wurde.",
      
      "occasions.anniversaries.title": "Jubiläen",
      "occasions.anniversaries.desc": "Erleben Sie die Magie Ihrer gemeinsamen Reise neu. Ein maßgeschneideter Song ist der perfekte Weg, um Ihre Liebe auszudrücken.",
      
      "occasions.dance.title": "Tanzwettbewerbe",
      "occasions.dance.desc": "Heben Sie sich auf der Bühne mit einem auf Ihre Choreografie zugeschnittenen Original-Track ab.",
      
      "occasions.retirements.title": "Ruhestand",
      "occasions.retirements.desc": "Einklang in den Ruhestand mit einem personalisierten musikalischen Tribut. Perfekt, um ein unglaubliches Vermächtnis mit Kollegen zu feiern."
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
