/* =====================================================================
   İÇERİK DOSYASI  —  Sitedeki bütün yazılar ve bilgiler burada.
   Yeni bir şey eklemek için: ilgili listede bir { ... } bloğunu kopyalayıp
   yapıştırın ve içindeki yazıları değiştirin. Başka dosyaya dokunmanız gerekmez.

   • Çok dilli yazı şu biçimdedir:  { tr:"...", en:"...", es:"...", de:"...", ar:"..." }
   • Bir dili boş bırakırsanız İngilizce (yoksa Türkçe) gösterilir; site bozulmaz.
   • Tek dilli (özel isim vb.) yazı için sadece "tırnak içinde metin" yazın.
   • Virgülleri ve tırnakları silmemeye dikkat edin.
   • "Güvenlik Laboratuvarı Bulgularım" bölümü buradan DEĞİL, veritabanından
     (guvenlik_bulgulari tablosu) gelir. O kayıtları /admin panelinden yönetin.
   ===================================================================== */

window.SITE = {

  /* ---------- Diller (yeni dil eklemek için bir satır ekleyin) ---------- */
  languages: [
    { code: "tr", label: "TR", name: "Türkçe",   dir: "ltr" },
    { code: "en", label: "EN", name: "English",  dir: "ltr" },
    { code: "es", label: "ES", name: "Español",  dir: "ltr" },
    { code: "de", label: "DE", name: "Deutsch",  dir: "ltr" },
    { code: "ar", label: "AR", name: "العربية",  dir: "rtl" }
  ],
  defaultLanguage: "tr",

  /* ---------- Genel bilgiler ---------- */
  brand: "ADT",
  name: ["Ayşe Dudu", "Tursun"],          // iki satırda gösterilir
  location: "Manisa",
  year: 2026,

  photo: {
    src: "/profil.jpg",         // fotoğrafı değiştirmek için: public/profil.jpg dosyasını değiştirin
    initials: "AD",                        // fotoğraf yüklenemezse görünür
    alt: {
      tr: "Ayşe Dudu Tursun'un portresi",
      en: "Portrait of Ayşe Dudu Tursun",
      es: "Retrato de Ayşe Dudu Tursun",
      de: "Porträt von Ayşe Dudu Tursun",
      ar: "صورة شخصية لـ Ayşe Dudu Tursun"
    }
  },

  /* ---------- Bölümlerin sırası (satırları yer değiştirerek sıralayın) ----------
     Kullanılabilir: about, skills, projects, lab, experience, community, sports, references, contact
     (lab = veritabanından gelen Güvenlik Laboratuvarı Bulgularım bölümü) */
  sections: ["about", "skills", "projects", "lab", "experience", "community", "sports", "references", "contact"],

  /* ---------- Arayüz yazıları ---------- */
  ui: {
    nav: {
      about:      { tr: "Hakkımda",    en: "About",       es: "Sobre mí",     de: "Über mich",   ar: "نبذة عني" },
      skills:     { tr: "Yetkinlikler", en: "Skills",     es: "Competencias", de: "Kompetenzen", ar: "المهارات" },
      projects:   { tr: "Projeler",    en: "Projects",    es: "Proyectos",    de: "Projekte",    ar: "المشاريع" },
      lab:        { tr: "Güvenlik Lab", en: "Security Lab", es: "Lab. de seguridad", de: "Security-Lab", ar: "مختبر الأمن" },
      experience: { tr: "Deneyim",     en: "Experience",  es: "Experiencia",  de: "Erfahrung",   ar: "الخبرة" },
      community:  { tr: "Topluluk",    en: "Community",   es: "Comunidad",    de: "Engagement",  ar: "المجتمعات" },
      sports:     { tr: "Spor",        en: "Sport",       es: "Deporte",      de: "Sport",       ar: "الرياضة" },
      references: { tr: "Referanslar", en: "References",  es: "Referencias",  de: "Referenzen",  ar: "المراجع" },
      contact:    { tr: "İletişim",    en: "Contact",     es: "Contacto",     de: "Kontakt",     ar: "التواصل" }
    },
    projectsBtn: { tr: "Projelerim", en: "My projects", es: "Mis proyectos", de: "Meine Projekte", ar: "مشاريعي" },
    // Menüdekinden uzun bölüm başlıkları (yoksa menüdeki ad kullanılır)
    headings: {
      lab: { tr: "Güvenlik Laboratuvarı Bulgularım", en: "My Security Lab Findings", es: "Mis hallazgos del laboratorio de seguridad", de: "Meine Security-Lab-Befunde", ar: "نتائجي في مختبر الأمن" }
    },
    lab: {
      intro: { tr: "Yalnızca kendi kurduğum eğitim laboratuvarlarında (DVWA, OWASP Juice Shop vb.) yaptığım testlerin bulguları. Kayıtlar veritabanından canlı olarak gelir.",
               en: "Findings from tests I ran only in training labs I set up myself (DVWA, OWASP Juice Shop, etc.). Records are loaded live from the database.",
               es: "Hallazgos de pruebas realizadas solo en laboratorios de formación que monté yo misma (DVWA, OWASP Juice Shop, etc.). Los datos vienen de la base de datos.",
               de: "Befunde aus Tests ausschließlich in selbst aufgebauten Übungslaboren (DVWA, OWASP Juice Shop usw.). Die Daten kommen live aus der Datenbank.",
               ar: "نتائج اختبارات أجريتُها فقط في مختبرات تدريبية أنشأتُها بنفسي (DVWA وOWASP Juice Shop وغيرها). تُحمَّل السجلات مباشرة من قاعدة البيانات." },
      featured: { tr: "Öne çıkanlar (en yüksek CVSS)", en: "Highlights (highest CVSS)", es: "Destacados (CVSS más alto)", de: "Highlights (höchster CVSS)", ar: "الأبرز (أعلى CVSS)" },
      all:      { tr: "Tüm bulgular", en: "All findings", es: "Todos los hallazgos", de: "Alle Befunde", ar: "جميع النتائج" },
      open:     { tr: "açık", en: "open", es: "abierto", de: "offen", ar: "مفتوحة" },
      closed:   { tr: "kapatıldı", en: "closed", es: "cerrado", de: "geschlossen", ar: "مغلقة" },
      empty:    { tr: "Henüz yayında bulgu yok.", en: "No published findings yet.", es: "Aún no hay hallazgos publicados.", de: "Noch keine veröffentlichten Befunde.", ar: "لا توجد نتائج منشورة بعد." },
      offline:  { tr: "Bulgular şu anda yüklenemedi.", en: "Findings could not be loaded right now.", es: "No se pudieron cargar los hallazgos.", de: "Befunde konnten nicht geladen werden.", ar: "تعذّر تحميل النتائج حاليًا." }
    },
    messageBtn: { tr: "Bana mesaj gönder", en: "Send me a message", es: "Envíame un mensaje", de: "Nachricht senden", ar: "أرسل لي رسالة" },
    contactBtn:  { tr: "İletişim", en: "Get in touch", es: "Contactar", de: "Kontakt aufnehmen", ar: "تواصل معي" },
    searchPlaceholder: {
      tr: "Ara: Python, veri tabanı, yoga, Kızılay…",
      en: "Search: Python, database, yoga, Red Crescent…",
      es: "Buscar: Python, base de datos, yoga…",
      de: "Suchen: Python, Datenbank, Yoga…",
      ar: "ابحث: Python، قاعدة بيانات، يوغا، الهلال الأحمر…"
    },
    vizActual:   { tr: "gerçek veri", en: "actual data", es: "datos reales", de: "Ist-Daten", ar: "بيانات فعلية" },
    vizForecast: { tr: "ML tahmini", en: "ML forecast", es: "previsión ML", de: "ML-Prognose", ar: "توقع التعلّم الآلي" },
    search: { tr: "Ara", en: "Search", es: "Buscar", de: "Suchen", ar: "بحث" },
    close:  { tr: "Kapat", en: "Close", es: "Cerrar", de: "Schließen", ar: "إغلاق" },
    results: { tr: "sonuç", en: "results", es: "resultados", de: "Treffer", ar: "نتيجة" },
    themeToggle: { tr: "Açık / koyu temayı değiştir", en: "Switch light / dark theme", es: "Cambiar tema claro / oscuro", de: "Hell-/Dunkelmodus wechseln", ar: "تبديل المظهر الفاتح / الداكن" },
    skip: { tr: "İçeriğe geç", en: "Skip to content", es: "Ir al contenido", de: "Zum Inhalt springen", ar: "انتقل إلى المحتوى" },
    languageLabel: { tr: "Dil", en: "Language", es: "Idioma", de: "Sprache", ar: "اللغة" },
    noJs: "Bu sayfanın görüntülenmesi için JavaScript gerekir. / This page requires JavaScript."
  },

  /* ---------- Ana sayfa (hero) ---------- */
  hero: {
    // Yazı makinesi efektiyle sırayla yazılan unvanlar
    roles: [
      { tr: "Büyük Veri Analistliği öğrencisi", en: "Big Data Analytics student", es: "Estudiante de Big Data", de: "Big-Data-Studentin", ar: "طالبة تحليل البيانات الضخمة" },
      { tr: "Veri analisti ve web düzenleyicisi", en: "Data analyst & web editor", es: "Analista de datos y editora web", de: "Datenanalystin & Webredakteurin", ar: "محللة بيانات ومحررة ويب" },
      { tr: "Atletizm, fitness ve yoga", en: "Athletics, fitness and yoga", es: "Atletismo, fitness y yoga", de: "Leichtathletik, Fitness und Yoga", ar: "ألعاب القوى واللياقة واليوغا" }
    ],
    // Ana sayfada, unvanın altında görünen yetkinlik etiketleri (tıklanınca Yetkinlikler bölümüne gider)
    chips: ["Python", "SQL", "Power BI", "Excel", "Machine Learning", "Hadoop"],
    subtitle: {
      tr: "Manisa Celal Bayar Üniversitesi Büyük Veri Analistliği 2. sınıf öğrencisi. Açık verilerle makine öğrenmesi projeleri geliştiriyor, pistte de hız kesmiyorum.",
      en: "Second-year Big Data Analytics student at Manisa Celal Bayar University. I build machine learning projects with open data and I keep my pace on the track too.",
      es: "Estudiante de 2.º de Análisis de Big Data en la Universidad Manisa Celal Bayar. Desarrollo proyectos de aprendizaje automático con datos abiertos y también corro en la pista.",
      de: "Studentin im 2. Jahr Big-Data-Analyse an der Manisa Celal Bayar Universität. Ich entwickle ML-Projekte mit offenen Daten und laufe auch auf der Bahn.",
      ar: "طالبة في السنة الثانية بتخصص تحليل البيانات الضخمة في جامعة مانيسا جلال بايار. أطوّر مشاريع تعلّم آلي باستخدام البيانات المفتوحة، ولا أُبطئ وتيرتي على المضمار أيضًا."
    }
  },

  /* ---------- Hakkımda ---------- */
  about: {
    text: {
      tr: "Açık veri kaynaklarından (TÜİK, Kaggle, GitHub) elde ettiğim verilerle makine öğrenmesi ve yapay zekâ projeleri geliştiriyorum. Üniversitenin dijital platformlarında web düzenleme deneyimi kazandım. Veri odaklı departmanlarda staj arıyorum.",
      en: "I develop machine learning and AI projects using open data (TÜİK, Kaggle, GitHub). I gained hands-on experience editing the university's digital platforms. I am looking for an internship in a data-driven department.",
      es: "Desarrollo proyectos de aprendizaje automático e IA con datos abiertos (TÜİK, Kaggle, GitHub). He adquirido experiencia gestionando las plataformas digitales de la universidad. Busco unas prácticas en un departamento orientado a datos.",
      de: "Ich entwickle ML- und KI-Projekte mit offenen Daten (TÜİK, Kaggle, GitHub) und habe Erfahrung in der Pflege der digitalen Plattformen der Universität. Ich suche ein Praktikum in einer datengetriebenen Abteilung.",
      ar: "أطوّر مشاريع تعلّم آلي وذكاء اصطناعي باستخدام بيانات مفتوحة المصدر (TÜİK وKaggle وGitHub). اكتسبتُ خبرة عملية في تحرير المنصات الرقمية للجامعة. أبحث عن تدريب في قسم يعتمد على البيانات."
    },
    /* Sayılar: value = sabit sayı, auto = otomatik sayım ("projects" veya "communities") */
    stats: [
      { value: 2,  label: { tr: "sınıf", en: "year of study", es: "curso", de: "Studienjahr", ar: "سنة دراسية" } },
      { value: 5,  label: { tr: "sertifika", en: "certificates", es: "certificados", de: "Zertifikate", ar: "شهادات" } },
      { auto: "projects",    label: { tr: "veri projesi", en: "data projects", es: "proyectos de datos", de: "Datenprojekte", ar: "مشاريع بيانات" } },
      { auto: "communities", label: { tr: "topluluk", en: "communities", es: "comunidades", de: "Gemeinschaften", ar: "مجتمعات" } }
    ]
  },

  /* ---------- Yetkinlikler ---------- */
  skills: [
    {
      title: { tr: "Veri analizi ve görselleştirme", en: "Data analysis & visualization", es: "Análisis y visualización de datos", de: "Datenanalyse & Visualisierung", ar: "تحليل البيانات وتصويرها" },
      text:  { tr: "Uygulamalı veri analizi, veri görselleştirme ve sosyal ağ analizi.", en: "Applied data analysis, visualization and social network analysis.", es: "Análisis aplicado, visualización y análisis de redes sociales.", de: "Angewandte Datenanalyse, Visualisierung und Netzwerkanalyse.", ar: "تحليل بيانات تطبيقي، وتصوير البيانات، وتحليل الشبكات الاجتماعية." },
      tags: ["Python", "Excel", "Power BI"]
    },
    {
      title: { tr: "Büyük veri sistemleri", en: "Big data systems", es: "Sistemas de big data", de: "Big-Data-Systeme", ar: "أنظمة البيانات الضخمة" },
      text:  { tr: "Büyük veri mimarileri, Hadoop, bulut bilişim ve Ar-Ge.", en: "Big data architectures, Hadoop, cloud computing and R&D.", es: "Arquitecturas big data, Hadoop, computación en la nube e I+D.", de: "Big-Data-Architekturen, Hadoop, Cloud Computing und F&E.", ar: "بنى البيانات الضخمة وHadoop والحوسبة السحابية والبحث والتطوير." },
      tags: ["Hadoop", "Cloud"]
    },
    {
      title: { tr: "Veri tabanı yönetimi", en: "Database management", es: "Gestión de bases de datos", de: "Datenbankverwaltung", ar: "إدارة قواعد البيانات" },
      text:  { tr: "Veri tabanı tasarımı ve yönetimi; Turkcell sertifikalı.", en: "Database design and administration; Turkcell certified.", es: "Diseño y administración de bases de datos; certificada por Turkcell.", de: "Datenbankdesign und -verwaltung; Turkcell-zertifiziert.", ar: "تصميم قواعد البيانات وإدارتها؛ حاصلة على شهادة من Turkcell." },
      tags: ["SQL"]
    },
    {
      title: { tr: "Makine öğrenmesi", en: "Machine learning", es: "Aprendizaje automático", de: "Maschinelles Lernen", ar: "التعلّم الآلي" },
      text:  { tr: "Regresyon modelleri kurma, karşılaştırma ve tahmin.", en: "Building, comparing and forecasting with regression models.", es: "Modelos de regresión: creación, comparación y predicción.", de: "Regressionsmodelle erstellen, vergleichen und Prognosen erstellen.", ar: "بناء نماذج الانحدار ومقارنتها والتنبؤ بها." },
      tags: ["Jupyter", "ML"]
    },
    {
      title: { tr: "Web ve arayüz", en: "Web & UI", es: "Web e interfaz", de: "Web & UI", ar: "الويب وواجهات المستخدم" },
      text:  { tr: "Kullanıcı arayüzü tasarımı; CMS ile üniversite sayfaları.", en: "User interface design; university pages via CMS.", es: "Diseño de interfaces; páginas universitarias con CMS.", de: "UI-Design; Uni-Webseiten per CMS.", ar: "تصميم واجهات المستخدم؛ وصفحات الجامعة عبر نظام إدارة المحتوى." },
      tags: ["HTML/CSS", "CMS"]
    },
    {
      title: { tr: "Güvenlik, hukuk, İSG", en: "Security, law, OHS", es: "Seguridad, derecho, PRL", de: "Sicherheit, Recht, Arbeitsschutz", ar: "الأمن والقانون والصحة المهنية" },
      text:  { tr: "Siber güvenlik, bilişim hukuku ve iş sağlığı ve güvenliği.", en: "Cybersecurity, IT law and occupational health and safety.", es: "Ciberseguridad, derecho informático y prevención de riesgos laborales.", de: "Cybersicherheit, IT-Recht sowie Arbeits- und Gesundheitsschutz.", ar: "الأمن السيبراني وقانون المعلوماتية والصحة والسلامة المهنية." },
      tags: ["Network Security", "OHS", "Git"]
    }
  ],

  /* ---------- Projeler ---------- */
  projects: [
    {
      title: { tr: "Ev Fiyatı Tahmini", en: "House Price Prediction", es: "Predicción de precios de vivienda", de: "Immobilienpreis-Prognose", ar: "التنبؤ بأسعار المنازل" },
      text:  { tr: "Kaggle verisiyle birden fazla regresyon modelini karşılaştırıp en iyisini seçtim.", en: "Compared several regression models on Kaggle data and picked the best one.", es: "Comparé varios modelos de regresión con datos de Kaggle y elegí el mejor.", de: "Mehrere Regressionsmodelle auf Kaggle-Daten verglichen und das beste gewählt.", ar: "قارنتُ عدة نماذج انحدار على بيانات Kaggle واخترتُ أفضلها." },
      tags: ["Python", "Jupyter"]
      // repo: "depo-adı",   ← bu projenin GitHub depo adını yazarsanız aşağıdaki otomatik listede tekrar çıkmaz
      // link: "https://github.com/aysedudutursun/..."   ← proje bağlantısı eklemek isterseniz başındaki // işaretini kaldırın
    },
    {
      title: { tr: "Türkiye Turizm Analizi ve Gelir Tahmini", en: "Turkey Tourism Analysis & Revenue Forecast", es: "Análisis del turismo en Turquía y previsión de ingresos", de: "Tourismusanalyse Türkei & Umsatzprognose", ar: "تحليل السياحة في تركيا والتنبؤ بالإيرادات" },
      text:  { tr: "TÜİK'in 5 veri setiyle 2012–2026 gelirlerini görselleştirdim, ML ile tahmin ürettim.", en: "Visualized 2012–2026 revenue from 5 TÜİK datasets and forecast with ML.", es: "Visualicé los ingresos 2012–2026 con 5 conjuntos de TÜİK y proyecté con ML.", de: "Umsätze 2012–2026 aus 5 TÜİK-Datensätzen visualisiert und mit ML prognostiziert.", ar: "صوّرتُ إيرادات 2012–2026 باستخدام 5 مجموعات بيانات من TÜİK وأنتجتُ توقعات بالتعلّم الآلي." },
      tags: ["Python", "TÜİK"]
    }
  ],

  /* ---------- GitHub'dan otomatik proje çekme ----------
     Açıksa, GitHub'daki herkese açık depolarınız "Projeler" bölümünde otomatik görünür.
     • Yeni depo yüklediğinizde siteyi elle güncellemenize gerek kalmaz.
     • Başlık/açıklama GitHub'daki depo açıklamasından gelir (çevrilmez). Depo açıklamasını
       GitHub'da doldurursanız kartta görünür.
     • Yukarıdaki elle yazdığınız projelerle aynı depo iki kez çıkmasın diye, elle yazdığınız
       projeye  repo: "depo-adı"  satırını ekleyin. */
  githubProjects: {
    enabled: true,
    username: "aysedudutursun",
    max: 12,                 // en fazla kaç depo gösterilsin
    hideForks: true,         // başkasından kopyalanan (fork) depoları gizle
    exclude: ["aysedudutursun.github.io"],   // gösterilmesini istemediğiniz depo adları (portfolyonun kendisi gizli)
    title: { tr: "GitHub'daki diğer projelerim", en: "More projects on GitHub", es: "Más proyectos en GitHub", de: "Weitere Projekte auf GitHub", ar: "مشاريع أخرى على GitHub" }
  },

  /* ---------- Deneyim / Eğitim (en yeni en üstte) ---------- */
  experience: [
    {
      date: "03.2026 –",
      title: { tr: "Web Düzenleme (kısmi zamanlı), MCBÜ", en: "Web Editor (part-time), MCBÜ", es: "Editora web (media jornada), MCBÜ", de: "Webredakteurin (Teilzeit), MCBÜ", ar: "محررة ويب (دوام جزئي)، MCBÜ" },
      text:  { tr: "Üniversite sayfalarını CMS ile ekip hâlinde güncelledim; içerik ve arayüz iyileştirdim.", en: "Updated university pages with a team via CMS; improved content and layout.", es: "Actualicé páginas universitarias en equipo con CMS; mejoré contenido e interfaz.", de: "Uni-Seiten im Team per CMS gepflegt; Inhalt und Oberfläche verbessert.", ar: "حدّثتُ صفحات الجامعة ضمن فريق عبر نظام إدارة المحتوى، وحسّنتُ المحتوى والواجهة." }
    },
    {
      date: "2025 – 2026",
      title: { tr: "Teknik Servis, MCBÜ", en: "Technical Support, MCBÜ", es: "Servicio técnico, MCBÜ", de: "Technischer Service, MCBÜ", ar: "الدعم الفني، MCBÜ" },
      text:  { tr: "Bilgisayar bakımı ve kullanıcı desteği.", en: "Computer maintenance and user support.", es: "Mantenimiento informático y soporte al usuario.", de: "Computerwartung und Nutzersupport.", ar: "صيانة الحاسوب ودعم المستخدمين." }
    },
    {
      date: "2025 –",
      title: { tr: "Büyük Veri Analistliği, Manisa Celal Bayar Üniversitesi", en: "Big Data Analytics, Manisa Celal Bayar University", es: "Análisis de Big Data, Universidad Manisa Celal Bayar", de: "Big-Data-Analyse, Manisa Celal Bayar Universität", ar: "تحليل البيانات الضخمة، جامعة مانيسا جلال بايار" }
    },
    {
      date: "2021 – 2025",
      title: "Osmangazi Anadolu Lisesi"
    }
  ],

  /* ---------- Topluluklar ----------
     count: 2  → bu kart "topluluk" sayacında 2 sayılır (varsayılan 1) */
  communities: [
    {
      title: "TÜME Topluluğu",
      text: {
        tr: "Etkinlik ve organizasyon çalışmalarında yer aldım.",
        en: "Took part in the community's event and organization work.",
        es: "Participé en la organización de eventos y actividades de la comunidad.",
        de: "Mitwirkung an Veranstaltungen und Organisation der Gemeinschaft.",
        ar: "شاركتُ في تنظيم فعاليات المجتمع وأنشطته."
      },
      tags: [
        { tr: "Etkinlik",     en: "Events",       es: "Eventos",      de: "Veranstaltungen", ar: "فعاليات" },
        { tr: "Organizasyon", en: "Organization", es: "Organización", de: "Organisation",    ar: "تنظيم" }
      ]
    },
    { title: "MCBÜ Veri Topluluğu" },
    { title: "MCBÜ Teknofest" },
    { title: "LÖSEV" },
    { title: "Kızılay" },
    {
      title: { tr: "Sosyoloji ve Sanat Tarihi kulüpleri", en: "Sociology & Art History clubs", es: "Clubes de Sociología e Historia del Arte", de: "Soziologie- & Kunstgeschichte-Clubs", ar: "نوادي علم الاجتماع وتاريخ الفن" },
      count: 2
    },
    { title: "Optimum Sosyal Medya" }
  ],

  /* ---------- Spor ---------- */
  sports: [
    { icon: "🏃‍♀️", title: { tr: "Atletizm", en: "Athletics", es: "Atletismo", de: "Leichtathletik", ar: "ألعاب القوى" },
      text: { tr: "Koşu benim reset tuşum.", en: "Running is my reset button.", es: "Correr es mi botón de reinicio.", de: "Laufen ist mein Reset-Knopf.", ar: "الجري هو زر إعادة الضبط لديّ." } },
    { icon: "🏋️‍♀️", title: { tr: "Fitness", en: "Fitness", es: "Fitness", de: "Fitness", ar: "اللياقة البدنية" },
      text: { tr: "Disiplin ve dayanıklılık.", en: "Discipline and endurance.", es: "Disciplina y resistencia.", de: "Disziplin und Ausdauer.", ar: "الانضباط والتحمّل." } },
    { icon: "🧘‍♀️", title: { tr: "Yoga", en: "Yoga", es: "Yoga", de: "Yoga", ar: "اليوغا" },
      text: { tr: "Nefes, denge, odak.", en: "Breath, balance, focus.", es: "Respiración, equilibrio, enfoque.", de: "Atem, Balance, Fokus.", ar: "التنفس والتوازن والتركيز." } }
  ],

  /* ---------- Referanslar ---------- */
  references: {
    org: { tr: "Manisa Celal Bayar Üniversitesi", en: "Manisa Celal Bayar University", es: "Universidad Manisa Celal Bayar", de: "Manisa Celal Bayar Universität", ar: "جامعة مانيسا جلال بايار" },
    note: { tr: "İletişim bilgileri talep üzerine paylaşılır.", en: "Contact details are available on request.", es: "Los datos de contacto se facilitan bajo petición.", de: "Kontaktdaten auf Anfrage.", ar: "تتوفر بيانات التواصل عند الطلب." },
    people: [
      { name: "Dr. Orkun Teke", initials: "OT",
        role: { tr: "Öğretim Görevlisi Dr.", en: "Lecturer, PhD", es: "Docente, Dr.", de: "Dozent, Dr.", ar: "مدرّس، د." },
        links: [{ label: "LinkedIn", href: "https://www.linkedin.com/in/orkun-teke" }] },
      { name: "Nur Erdem", initials: "NE",
        role: { tr: "Öğretim Görevlisi", en: "Lecturer", es: "Docente", de: "Dozentin", ar: "مدرّسة" },
        links: [{ label: "LinkedIn", href: "https://www.linkedin.com/in/nur-erdem" }] },
      { name: "Mahmut Okuyucu", initials: "MO",
        role: { tr: "Bilgisayar İşletmeni", en: "Computer Operator", es: "Operador informático", de: "IT-Sachbearbeiter", ar: "مشغّل حاسوب" } },
      { name: "Osman Can Çetlenbik", initials: "OÇ",
        role: { tr: "Öğretim Görevlisi", en: "Lecturer", es: "Docente", de: "Dozent", ar: "مدرّس" },
        links: [
          { label: "LinkedIn", href: "https://linkedin.com/in/osmancancetlenbik" },
          { label: { tr: "Web sitesi", en: "Website", es: "Sitio web", de: "Webseite", ar: "الموقع" }, href: "https://osmancancetlenbik.com/" }
        ] }
    ]
  },

  /* ---------- İletişim ---------- */
  contact: [
    { label: { tr: "E-posta", en: "Email", es: "Correo", de: "E-Mail", ar: "البريد الإلكتروني" }, value: "aysedudutursun@gmail.com", href: "mailto:aysedudutursun@gmail.com" },
    { label: { tr: "Telefon", en: "Phone", es: "Teléfono", de: "Telefon", ar: "الهاتف" }, value: "0(541) 567 36 02", href: "tel:+905415673602" },
    { label: "LinkedIn", value: "/in/aysedudutursun", href: "https://www.linkedin.com/in/aysedudutursun/", external: true },
    { label: "GitHub", value: "aysedudutursun", href: "https://github.com/aysedudutursun", external: true }
  ],

  github: "https://github.com/aysedudutursun"
};

