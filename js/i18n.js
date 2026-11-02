/*
 * BOUCHRA — languages (English, French, Arabic).
 * Loaded in <head> so <html lang/dir> is set before the page paints.
 *
 * Language choice: ?lang= in the URL, then the visitor's saved choice,
 * then the browser language, then English.
 */
(function () {
  'use strict';

  var LANGS = [
    { code: 'en', label: 'EN', name: 'English', dir: 'ltr' },
    { code: 'fr', label: 'FR', name: 'Français', dir: 'ltr' },
    { code: 'ar', label: 'عربي', name: 'العربية', dir: 'rtl' }
  ];
  var CODES = LANGS.map(function (l) { return l.code; });
  var KEY = 'bouchra_lang';

  function stored() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function store(v) { try { localStorage.setItem(KEY, v); } catch (e) { /* ignore */ } }

  var param = new URLSearchParams(window.location.search).get('lang');
  var browser = (navigator.language || 'en').slice(0, 2).toLowerCase();
  var lang = CODES.indexOf(param) > -1 ? param
    : CODES.indexOf(stored()) > -1 ? stored()
    : CODES.indexOf(browser) > -1 ? browser
    : 'en';
  if (param === lang) store(lang);

  var meta = LANGS.filter(function (l) { return l.code === lang; })[0];
  var html = document.documentElement;
  html.lang = lang;
  html.dir = meta.dir;

  // Playfair Display and Montserrat have no Arabic glyphs.
  if (lang === 'ar') {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;500;600&family=Tajawal:wght@300;400;500;700&display=swap';
    document.head.appendChild(link);
  }

  var STRINGS = {
    en: {
      'meta.homeTitle': 'BOUCHRA — Modest Fashion | Abayas & Modest Dresses',
      'meta.homeDesc': 'BOUCHRA is a contemporary Moroccan modest-fashion brand: abayas, Islamic dresses, everyday modest wear and occasion dresses. Order directly on WhatsApp.',
      'meta.collectionDesc': 'Browse BOUCHRA abayas, Islamic dresses, everyday modest wear and occasion dresses. Order directly on WhatsApp.',
      'meta.suffix': 'BOUCHRA Modest Fashion',

      'lang.label': 'Language',
      'nav.collections': 'Collections',
      'nav.new': 'New Arrivals',
      'nav.best': 'Best Sellers',
      'nav.sizeGuide': 'Size Guide',
      'nav.story': 'Our Story',
      'nav.main': 'Main',
      'a11y.openMenu': 'Open menu',
      'a11y.home': 'BOUCHRA home',
      'a11y.chat': 'Chat with us on WhatsApp',
      'a11y.openSelection': 'Open My Selection',
      'preview.text': 'Previewing unpublished changes from the admin.',
      'preview.exit': 'Exit preview',

      'avail.in-stock': 'In stock',
      'avail.low-stock': 'Only a few left',
      'avail.made-to-order': 'Made to order',
      'avail.out-of-stock': 'Sold out',
      'badge.new': 'New',
      'badge.best': 'Best seller',
      'badge.soldOut': 'Sold out',
      'price.onRequest': 'Price on request',

      'msg.productIntro': 'Hello {brand}! I would like to request the following product:',
      'msg.productsIntro': 'Hello {brand}! I would like to request the following products:',
      'msg.outro': 'Could you please confirm availability and delivery details?',
      'msg.product': 'Product',
      'msg.reference': 'Reference',
      'msg.price': 'Price',
      'msg.size': 'Size',
      'msg.colour': 'Colour',
      'msg.quantity': 'Quantity',
      'msg.url': 'Product URL',
      'msg.onRequest': 'On request',
      'msg.toConfirm': 'To be confirmed',
      'msg.total': 'Estimated total (excluding delivery)',
      'msg.question': 'Hello {brand}! I have a question about this product:',
      'msg.sizing': 'Hello {brand}! Could you help me choose the right size?',

      'float.tip': 'Chat with us',
      'float.label': 'Chat with BOUCHRA on WhatsApp',

      'sg.title': 'Size Guide',
      'sg.close': 'Close size guide',
      'sg.ask': 'Ask for sizing advice',

      'sel.title': 'My Selection',
      'sel.close': 'Close My Selection',
      'sel.empty': 'Your selection is empty.',
      'sel.emptyText': 'Add your favourite pieces, then send them all to us in one WhatsApp message.',
      'sel.explore': 'Explore the collection',
      'sel.ref': 'Ref.',
      'sel.remove': 'Remove {name}',
      'sel.size': 'Size',
      'sel.colour': 'Colour',
      'sel.qty': 'Quantity',
      'sel.dec': 'Decrease quantity',
      'sel.inc': 'Increase quantity',
      'sel.total': 'Estimated total',
      'sel.note': 'Delivery costs, availability and payment are confirmed with you on WhatsApp. No online payment.',
      'sel.send': 'Send my selection on WhatsApp',
      'sel.clear': 'Clear selection',

      'footer.tagline': 'Contemporary Moroccan modest fashion, designed in Agadir.',
      'footer.collections': 'Collections',
      'footer.howTo': 'How to order',
      'footer.step1': 'Choose your size, colour and quantity',
      'footer.step2': 'Send your request on WhatsApp',
      'footer.step3': 'We confirm availability, delivery and payment',
      'footer.contact': 'Contact',
      'footer.chat': 'Chat on WhatsApp',
      'footer.noPayment': 'No online payment. Every order is confirmed personally with our team.',
      'footer.motto': 'Modern Modesty · Moroccan Soul',

      'home.explore': 'Explore our collection',
      'home.orderWa': 'Order directly on WhatsApp',
      'home.heroNote': 'No online payment — every order is confirmed personally on WhatsApp.',
      'home.heroAlt': 'Woman wearing a sand-coloured BOUCHRA abaya with embroidered sleeves',
      'home.collectionsTitle': 'Our Collections',
      'home.collectionsText': 'From contemporary abayas to luxury occasion dresses, each piece blends timeless modesty with modern femininity.',
      'home.discover': 'Discover',
      'home.newEyebrow': 'Just arrived',
      'home.newTitle': 'New Arrivals',
      'home.viewAll': 'View all',
      'home.promoEyebrow': 'WhatsApp concierge',
      'home.perk1': 'Personal sizing advice',
      'home.perk2': 'Real-time availability',
      'home.perk3': 'Delivery and payment confirmed with you',
      'home.howEyebrow': 'Simple & personal',
      'home.howTitle': 'How to order',
      'home.howText': 'No checkout, no online payment. Just a conversation with our team.',
      'home.step1Title': 'Browse',
      'home.step1Text': 'Explore our collections and open the pieces you love.',
      'home.step2Title': 'Choose',
      'home.step2Text': 'Select your size, colour and quantity, or add several pieces to My Selection.',
      'home.step3Title': 'Message us',
      'home.step3Text': 'Tap “Order via WhatsApp”. Your request is written for you; just press send.',
      'home.step4Title': 'We confirm',
      'home.step4Text': 'Our team confirms availability, delivery costs and payment directly with you.',
      'home.bestEyebrow': 'Most loved',
      'home.bestTitle': 'Best Sellers',
      'home.storyEyebrow': 'Our story',
      'home.storyTitle': 'Modern modesty, Moroccan soul',
      'home.storyText': 'BOUCHRA is a contemporary Moroccan modest-fashion brand inspired by the beauty of our heritage and the strength of modern women. From Agadir, we create elegant abayas and Islamic dresses that combine timeless modesty with modern femininity.',
      'home.storyScript': 'Elegance in every detail.',
      'home.value1': 'Elegance', 'home.value1Text': 'Modern and refined designs',
      'home.value2': 'Authenticity', 'home.value2Text': 'Inspired by Moroccan heritage',
      'home.value3': 'Femininity', 'home.value3Text': 'Designed for today’s woman',
      'home.value4': 'Quality', 'home.value4Text': 'Carefully crafted details',

      'col.title': 'The Collection',
      'col.docTitle': 'Collections',
      'col.intro': 'Choose your favourite pieces and order directly on WhatsApp. Our team confirms availability, sizing and delivery with you.',
      'col.filter': 'Filter by collection',
      'col.all': 'All',
      'col.sortLabel': 'Sort by',
      'col.sortFeatured': 'Featured',
      'col.sortNew': 'Newest first',
      'col.sortAsc': 'Price: low to high',
      'col.sortDesc': 'Price: high to low',
      'col.piece': '{n} piece',
      'col.pieces': '{n} pieces',
      'col.empty': 'No pieces match this selection yet.',
      'col.seeAll': 'See the full collection',

      'pdp.notFound': 'This piece could not be found',
      'pdp.notFoundText': 'It may have been removed from the collection.',
      'pdp.home': 'Home',
      'pdp.breadcrumb': 'Breadcrumb',
      'pdp.images': 'Product images',
      'pdp.viewImage': 'View image {n}',
      'pdp.prev': 'Previous image',
      'pdp.next': 'Next image',
      'pdp.ref': 'Ref.',
      'pdp.colour': 'Colour',
      'pdp.size': 'Size',
      'pdp.sizeGuide': 'Size guide',
      'pdp.sizeError': 'Please select your size.',
      'pdp.qty': 'Quantity',
      'pdp.soldOutNote': 'This piece is currently sold out. Send us a request on WhatsApp and we will let you know when it is back, or suggest a similar piece.',
      'pdp.madeNote': 'This piece is made to order in your size. Our team will confirm the making time with you on WhatsApp.',
      'pdp.order': 'Order via WhatsApp',
      'pdp.orderShort': 'Order',
      'pdp.add': 'Add to My Selection',
      'pdp.ask': 'Have a question? Chat with us on WhatsApp.',
      'pdp.how': 'No online payment. We confirm availability, delivery costs and payment with you on WhatsApp.',
      'pdp.fabric': 'Fabric & materials',
      'pdp.fabricFallback': 'Ask us on WhatsApp for fabric details.',
      'pdp.fit': 'Size & fit',
      'pdp.sizes': 'Available sizes: {list}.',
      'pdp.oneSize': 'One size',
      'pdp.openGuide': 'Open the size guide',
      'pdp.delivery': 'Delivery information',
      'pdp.care': 'Care',
      'pdp.added': 'Added to My Selection',
      'pdp.view': 'View',
      'pdp.relatedEyebrow': 'Complete the look',
      'pdp.relatedTitle': 'You may also love'
    },

    fr: {
      'meta.homeTitle': 'BOUCHRA — Mode pudique | Abayas & robes modestes',
      'meta.homeDesc': 'BOUCHRA est une marque marocaine de mode pudique contemporaine : abayas, robes islamiques, tenues du quotidien et robes de cérémonie. Commandez directement sur WhatsApp.',
      'meta.collectionDesc': 'Découvrez les abayas, robes islamiques, tenues du quotidien et robes de cérémonie BOUCHRA. Commandez directement sur WhatsApp.',
      'meta.suffix': 'BOUCHRA Mode Pudique',

      'lang.label': 'Langue',
      'nav.collections': 'Collections',
      'nav.new': 'Nouveautés',
      'nav.best': 'Best-sellers',
      'nav.sizeGuide': 'Guide des tailles',
      'nav.story': 'Notre histoire',
      'nav.main': 'Principal',
      'a11y.openMenu': 'Ouvrir le menu',
      'a11y.home': 'Accueil BOUCHRA',
      'a11y.chat': 'Discutez avec nous sur WhatsApp',
      'a11y.openSelection': 'Ouvrir Ma Sélection',
      'preview.text': 'Aperçu des modifications non publiées de l’administration.',
      'preview.exit': 'Quitter l’aperçu',

      'avail.in-stock': 'En stock',
      'avail.low-stock': 'Plus que quelques pièces',
      'avail.made-to-order': 'Sur commande',
      'avail.out-of-stock': 'Épuisé',
      'badge.new': 'Nouveau',
      'badge.best': 'Best-seller',
      'badge.soldOut': 'Épuisé',
      'price.onRequest': 'Prix sur demande',

      'msg.productIntro': 'Bonjour {brand} ! Je souhaite commander l’article suivant :',
      'msg.productsIntro': 'Bonjour {brand} ! Je souhaite commander les articles suivants :',
      'msg.outro': 'Pourriez-vous me confirmer la disponibilité et les modalités de livraison ?',
      'msg.product': 'Article',
      'msg.reference': 'Référence',
      'msg.price': 'Prix',
      'msg.size': 'Taille',
      'msg.colour': 'Couleur',
      'msg.quantity': 'Quantité',
      'msg.url': 'Lien du produit',
      'msg.onRequest': 'Sur demande',
      'msg.toConfirm': 'À confirmer',
      'msg.total': 'Total estimé (hors livraison)',
      'msg.question': 'Bonjour {brand} ! J’ai une question sur cet article :',
      'msg.sizing': 'Bonjour {brand} ! Pourriez-vous m’aider à choisir la bonne taille ?',

      'float.tip': 'Discutons',
      'float.label': 'Discuter avec BOUCHRA sur WhatsApp',

      'sg.title': 'Guide des tailles',
      'sg.close': 'Fermer le guide des tailles',
      'sg.ask': 'Demander un conseil taille',

      'sel.title': 'Ma Sélection',
      'sel.close': 'Fermer Ma Sélection',
      'sel.empty': 'Votre sélection est vide.',
      'sel.emptyText': 'Ajoutez vos pièces préférées, puis envoyez-les-nous en un seul message WhatsApp.',
      'sel.explore': 'Découvrir la collection',
      'sel.ref': 'Réf.',
      'sel.remove': 'Retirer {name}',
      'sel.size': 'Taille',
      'sel.colour': 'Couleur',
      'sel.qty': 'Quantité',
      'sel.dec': 'Diminuer la quantité',
      'sel.inc': 'Augmenter la quantité',
      'sel.total': 'Total estimé',
      'sel.note': 'Les frais de livraison, la disponibilité et le paiement sont confirmés avec vous sur WhatsApp. Aucun paiement en ligne.',
      'sel.send': 'Envoyer ma sélection sur WhatsApp',
      'sel.clear': 'Vider la sélection',

      'footer.tagline': 'Mode pudique marocaine contemporaine, imaginée à Agadir.',
      'footer.collections': 'Collections',
      'footer.howTo': 'Comment commander',
      'footer.step1': 'Choisissez taille, couleur et quantité',
      'footer.step2': 'Envoyez votre demande sur WhatsApp',
      'footer.step3': 'Nous confirmons disponibilité, livraison et paiement',
      'footer.contact': 'Contact',
      'footer.chat': 'Discuter sur WhatsApp',
      'footer.noPayment': 'Aucun paiement en ligne. Chaque commande est confirmée personnellement par notre équipe.',
      'footer.motto': 'Pudeur moderne · Âme marocaine',

      'home.explore': 'Découvrir la collection',
      'home.orderWa': 'Commander sur WhatsApp',
      'home.heroNote': 'Aucun paiement en ligne — chaque commande est confirmée personnellement sur WhatsApp.',
      'home.heroAlt': 'Femme portant une abaya BOUCHRA couleur sable aux manches brodées',
      'home.collectionsTitle': 'Nos Collections',
      'home.collectionsText': 'Des abayas contemporaines aux robes de cérémonie, chaque pièce allie pudeur intemporelle et féminité moderne.',
      'home.discover': 'Découvrir',
      'home.newEyebrow': 'Tout juste arrivées',
      'home.newTitle': 'Nouveautés',
      'home.viewAll': 'Tout voir',
      'home.promoEyebrow': 'Conciergerie WhatsApp',
      'home.perk1': 'Conseils taille personnalisés',
      'home.perk2': 'Disponibilité en temps réel',
      'home.perk3': 'Livraison et paiement confirmés avec vous',
      'home.howEyebrow': 'Simple & personnel',
      'home.howTitle': 'Comment commander',
      'home.howText': 'Ni panier, ni paiement en ligne. Simplement une conversation avec notre équipe.',
      'home.step1Title': 'Explorez',
      'home.step1Text': 'Parcourez nos collections et ouvrez les pièces qui vous plaisent.',
      'home.step2Title': 'Choisissez',
      'home.step2Text': 'Sélectionnez taille, couleur et quantité, ou ajoutez plusieurs pièces à Ma Sélection.',
      'home.step3Title': 'Écrivez-nous',
      'home.step3Text': 'Touchez « Commander via WhatsApp ». Votre message est déjà rédigé : il suffit de l’envoyer.',
      'home.step4Title': 'Nous confirmons',
      'home.step4Text': 'Notre équipe confirme avec vous la disponibilité, les frais de livraison et le paiement.',
      'home.bestEyebrow': 'Les plus aimées',
      'home.bestTitle': 'Best-sellers',
      'home.storyEyebrow': 'Notre histoire',
      'home.storyTitle': 'Pudeur moderne, âme marocaine',
      'home.storyText': 'BOUCHRA est une marque marocaine de mode pudique contemporaine, inspirée par la beauté de notre héritage et la force des femmes d’aujourd’hui. Depuis Agadir, nous créons des abayas et des robes islamiques élégantes qui allient pudeur intemporelle et féminité moderne.',
      'home.storyScript': 'L’élégance dans chaque détail.',
      'home.value1': 'Élégance', 'home.value1Text': 'Des créations modernes et raffinées',
      'home.value2': 'Authenticité', 'home.value2Text': 'Inspirée du patrimoine marocain',
      'home.value3': 'Féminité', 'home.value3Text': 'Pensée pour la femme d’aujourd’hui',
      'home.value4': 'Qualité', 'home.value4Text': 'Des finitions soignées',

      'col.title': 'La Collection',
      'col.docTitle': 'Collections',
      'col.intro': 'Choisissez vos pièces préférées et commandez directement sur WhatsApp. Notre équipe confirme avec vous la disponibilité, la taille et la livraison.',
      'col.filter': 'Filtrer par collection',
      'col.all': 'Tout',
      'col.sortLabel': 'Trier par',
      'col.sortFeatured': 'Sélection',
      'col.sortNew': 'Nouveautés d’abord',
      'col.sortAsc': 'Prix croissant',
      'col.sortDesc': 'Prix décroissant',
      'col.piece': '{n} pièce',
      'col.pieces': '{n} pièces',
      'col.empty': 'Aucune pièce ne correspond à cette sélection pour le moment.',
      'col.seeAll': 'Voir toute la collection',

      'pdp.notFound': 'Cette pièce est introuvable',
      'pdp.notFoundText': 'Elle a peut-être été retirée de la collection.',
      'pdp.home': 'Accueil',
      'pdp.breadcrumb': 'Fil d’Ariane',
      'pdp.images': 'Photos du produit',
      'pdp.viewImage': 'Voir la photo {n}',
      'pdp.prev': 'Photo précédente',
      'pdp.next': 'Photo suivante',
      'pdp.ref': 'Réf.',
      'pdp.colour': 'Couleur',
      'pdp.size': 'Taille',
      'pdp.sizeGuide': 'Guide des tailles',
      'pdp.sizeError': 'Veuillez choisir votre taille.',
      'pdp.qty': 'Quantité',
      'pdp.soldOutNote': 'Cette pièce est actuellement épuisée. Envoyez-nous une demande sur WhatsApp : nous vous préviendrons de son retour ou vous proposerons une pièce similaire.',
      'pdp.madeNote': 'Cette pièce est confectionnée sur commande à votre taille. Notre équipe vous confirmera le délai de confection sur WhatsApp.',
      'pdp.order': 'Commander via WhatsApp',
      'pdp.orderShort': 'Commander',
      'pdp.add': 'Ajouter à Ma Sélection',
      'pdp.ask': 'Une question ? Écrivez-nous sur WhatsApp.',
      'pdp.how': 'Aucun paiement en ligne. Nous confirmons avec vous la disponibilité, les frais de livraison et le paiement sur WhatsApp.',
      'pdp.fabric': 'Tissu & matières',
      'pdp.fabricFallback': 'Demandez-nous les détails du tissu sur WhatsApp.',
      'pdp.fit': 'Taille & coupe',
      'pdp.sizes': 'Tailles disponibles : {list}.',
      'pdp.oneSize': 'Taille unique',
      'pdp.openGuide': 'Ouvrir le guide des tailles',
      'pdp.delivery': 'Informations de livraison',
      'pdp.care': 'Entretien',
      'pdp.added': 'Ajouté à Ma Sélection',
      'pdp.view': 'Voir',
      'pdp.relatedEyebrow': 'Complétez le look',
      'pdp.relatedTitle': 'Vous aimerez aussi'
    },

    ar: {
      'meta.homeTitle': 'BOUCHRA — أزياء محتشمة | عبايات وفساتين محتشمة',
      'meta.homeDesc': 'BOUCHRA علامة مغربية للأزياء المحتشمة العصرية: عبايات، فساتين إسلامية، ملابس يومية وفساتين للمناسبات. اطلبي مباشرة عبر واتساب.',
      'meta.collectionDesc': 'اكتشفي عبايات BOUCHRA والفساتين الإسلامية والملابس اليومية وفساتين المناسبات. اطلبي مباشرة عبر واتساب.',
      'meta.suffix': 'BOUCHRA للأزياء المحتشمة',

      'lang.label': 'اللغة',
      'nav.collections': 'المجموعات',
      'nav.new': 'وصل حديثًا',
      'nav.best': 'الأكثر مبيعًا',
      'nav.sizeGuide': 'دليل المقاسات',
      'nav.story': 'قصتنا',
      'nav.main': 'الرئيسية',
      'a11y.openMenu': 'فتح القائمة',
      'a11y.home': 'الصفحة الرئيسية لـ BOUCHRA',
      'a11y.chat': 'تواصلي معنا عبر واتساب',
      'a11y.openSelection': 'فتح اختياراتي',
      'preview.text': 'معاينة تعديلات غير منشورة من لوحة الإدارة.',
      'preview.exit': 'إنهاء المعاينة',

      'avail.in-stock': 'متوفر',
      'avail.low-stock': 'قطع قليلة متبقية',
      'avail.made-to-order': 'حسب الطلب',
      'avail.out-of-stock': 'نفدت الكمية',
      'badge.new': 'جديد',
      'badge.best': 'الأكثر مبيعًا',
      'badge.soldOut': 'نفدت الكمية',
      'price.onRequest': 'السعر عند الطلب',

      'msg.productIntro': 'مرحبًا {brand}! أود طلب المنتج التالي:',
      'msg.productsIntro': 'مرحبًا {brand}! أود طلب المنتجات التالية:',
      'msg.outro': 'هل يمكنكم تأكيد التوفر وتفاصيل التوصيل؟',
      'msg.product': 'المنتج',
      'msg.reference': 'المرجع',
      'msg.price': 'السعر',
      'msg.size': 'المقاس',
      'msg.colour': 'اللون',
      'msg.quantity': 'الكمية',
      'msg.url': 'رابط المنتج',
      'msg.onRequest': 'عند الطلب',
      'msg.toConfirm': 'سيتم تأكيده',
      'msg.total': 'المجموع التقديري (بدون التوصيل)',
      'msg.question': 'مرحبًا {brand}! لدي سؤال حول هذا المنتج:',
      'msg.sizing': 'مرحبًا {brand}! هل يمكنكم مساعدتي في اختيار المقاس المناسب؟',

      'float.tip': 'تواصلي معنا',
      'float.label': 'تواصلي مع BOUCHRA عبر واتساب',

      'sg.title': 'دليل المقاسات',
      'sg.close': 'إغلاق دليل المقاسات',
      'sg.ask': 'اطلبي نصيحة حول المقاس',

      'sel.title': 'اختياراتي',
      'sel.close': 'إغلاق اختياراتي',
      'sel.empty': 'قائمة اختياراتك فارغة.',
      'sel.emptyText': 'أضيفي قطعك المفضلة، ثم أرسليها لنا كلها في رسالة واتساب واحدة.',
      'sel.explore': 'اكتشفي المجموعة',
      'sel.ref': 'المرجع',
      'sel.remove': 'إزالة {name}',
      'sel.size': 'المقاس',
      'sel.colour': 'اللون',
      'sel.qty': 'الكمية',
      'sel.dec': 'إنقاص الكمية',
      'sel.inc': 'زيادة الكمية',
      'sel.total': 'المجموع التقديري',
      'sel.note': 'نؤكد معك تكاليف التوصيل والتوفر وطريقة الدفع عبر واتساب. لا يوجد دفع عبر الإنترنت.',
      'sel.send': 'أرسلي اختياراتي عبر واتساب',
      'sel.clear': 'إفراغ القائمة',

      'footer.tagline': 'أزياء مغربية محتشمة وعصرية، مصممة في أكادير.',
      'footer.collections': 'المجموعات',
      'footer.howTo': 'طريقة الطلب',
      'footer.step1': 'اختاري المقاس واللون والكمية',
      'footer.step2': 'أرسلي طلبك عبر واتساب',
      'footer.step3': 'نؤكد التوفر والتوصيل والدفع',
      'footer.contact': 'تواصل',
      'footer.chat': 'تواصلي عبر واتساب',
      'footer.noPayment': 'لا يوجد دفع عبر الإنترنت. يتم تأكيد كل طلب شخصيًا مع فريقنا.',
      'footer.motto': 'احتشام عصري · روح مغربية',

      'home.explore': 'اكتشفي مجموعتنا',
      'home.orderWa': 'اطلبي مباشرة عبر واتساب',
      'home.heroNote': 'لا يوجد دفع عبر الإنترنت — يتم تأكيد كل طلب شخصيًا عبر واتساب.',
      'home.heroAlt': 'امرأة ترتدي عباية BOUCHRA بلون رملي وأكمام مطرزة',
      'home.collectionsTitle': 'مجموعاتنا',
      'home.collectionsText': 'من العبايات العصرية إلى فساتين المناسبات الفاخرة، تجمع كل قطعة بين الاحتشام الخالد والأنوثة العصرية.',
      'home.discover': 'اكتشفي',
      'home.newEyebrow': 'وصل للتو',
      'home.newTitle': 'وصل حديثًا',
      'home.viewAll': 'عرض الكل',
      'home.promoEyebrow': 'خدمة واتساب',
      'home.perk1': 'نصائح شخصية حول المقاس',
      'home.perk2': 'معرفة التوفر مباشرة',
      'home.perk3': 'تأكيد التوصيل والدفع معك',
      'home.howEyebrow': 'بسيط وشخصي',
      'home.howTitle': 'طريقة الطلب',
      'home.howText': 'بدون سلة شراء وبدون دفع عبر الإنترنت. مجرد محادثة مع فريقنا.',
      'home.step1Title': 'تصفحي',
      'home.step1Text': 'اكتشفي مجموعاتنا وافتحي القطع التي تعجبك.',
      'home.step2Title': 'اختاري',
      'home.step2Text': 'حددي المقاس واللون والكمية، أو أضيفي عدة قطع إلى اختياراتي.',
      'home.step3Title': 'راسلينا',
      'home.step3Text': 'اضغطي على «اطلبي عبر واتساب». رسالتك جاهزة، ما عليك سوى إرسالها.',
      'home.step4Title': 'نؤكد طلبك',
      'home.step4Text': 'يؤكد فريقنا معك التوفر وتكاليف التوصيل وطريقة الدفع.',
      'home.bestEyebrow': 'الأكثر حبًا',
      'home.bestTitle': 'الأكثر مبيعًا',
      'home.storyEyebrow': 'قصتنا',
      'home.storyTitle': 'احتشام عصري، روح مغربية',
      'home.storyText': 'BOUCHRA علامة مغربية للأزياء المحتشمة العصرية، مستوحاة من جمال تراثنا وقوة المرأة العصرية. من أكادير، نصمم عبايات وفساتين إسلامية أنيقة تجمع بين الاحتشام الخالد والأنوثة العصرية.',
      'home.storyScript': 'الأناقة في كل التفاصيل.',
      'home.value1': 'الأناقة', 'home.value1Text': 'تصاميم عصرية وراقية',
      'home.value2': 'الأصالة', 'home.value2Text': 'مستوحاة من التراث المغربي',
      'home.value3': 'الأنوثة', 'home.value3Text': 'مصممة لامرأة اليوم',
      'home.value4': 'الجودة', 'home.value4Text': 'تفاصيل مصنوعة بعناية',

      'col.title': 'المجموعة',
      'col.docTitle': 'المجموعات',
      'col.intro': 'اختاري قطعك المفضلة واطلبيها مباشرة عبر واتساب. يؤكد فريقنا معك التوفر والمقاس والتوصيل.',
      'col.filter': 'تصفية حسب المجموعة',
      'col.all': 'الكل',
      'col.sortLabel': 'ترتيب حسب',
      'col.sortFeatured': 'مختارات',
      'col.sortNew': 'الأحدث أولًا',
      'col.sortAsc': 'السعر: من الأقل إلى الأعلى',
      'col.sortDesc': 'السعر: من الأعلى إلى الأقل',
      'col.piece': '{n} قطعة',
      'col.pieces': '{n} قطع',
      'col.empty': 'لا توجد قطع مطابقة لهذا الاختيار حاليًا.',
      'col.seeAll': 'عرض المجموعة كاملة',

      'pdp.notFound': 'تعذر العثور على هذه القطعة',
      'pdp.notFoundText': 'ربما تمت إزالتها من المجموعة.',
      'pdp.home': 'الرئيسية',
      'pdp.breadcrumb': 'مسار التنقل',
      'pdp.images': 'صور المنتج',
      'pdp.viewImage': 'عرض الصورة {n}',
      'pdp.prev': 'الصورة السابقة',
      'pdp.next': 'الصورة التالية',
      'pdp.ref': 'المرجع',
      'pdp.colour': 'اللون',
      'pdp.size': 'المقاس',
      'pdp.sizeGuide': 'دليل المقاسات',
      'pdp.sizeError': 'يرجى اختيار المقاس.',
      'pdp.qty': 'الكمية',
      'pdp.soldOutNote': 'هذه القطعة نفدت حاليًا. أرسلي لنا طلبًا عبر واتساب وسنخبرك عند توفرها أو نقترح عليك قطعة مشابهة.',
      'pdp.madeNote': 'تُخاط هذه القطعة حسب الطلب بمقاسك. سيؤكد فريقنا معك مدة التحضير عبر واتساب.',
      'pdp.order': 'اطلبي عبر واتساب',
      'pdp.orderShort': 'اطلبي',
      'pdp.add': 'أضيفي إلى اختياراتي',
      'pdp.ask': 'لديك سؤال؟ تواصلي معنا عبر واتساب.',
      'pdp.how': 'لا يوجد دفع عبر الإنترنت. نؤكد معك التوفر وتكاليف التوصيل وطريقة الدفع عبر واتساب.',
      'pdp.fabric': 'القماش والخامات',
      'pdp.fabricFallback': 'اسألينا عبر واتساب عن تفاصيل القماش.',
      'pdp.fit': 'المقاس والقصّة',
      'pdp.sizes': 'المقاسات المتوفرة: {list}.',
      'pdp.oneSize': 'مقاس واحد',
      'pdp.openGuide': 'فتح دليل المقاسات',
      'pdp.delivery': 'معلومات التوصيل',
      'pdp.care': 'العناية',
      'pdp.added': 'تمت الإضافة إلى اختياراتي',
      'pdp.view': 'عرض',
      'pdp.relatedEyebrow': 'أكملي إطلالتك',
      'pdp.relatedTitle': 'قد يعجبك أيضًا'
    }
  };

  function t(key, vars) {
    var s = STRINGS[lang][key];
    if (s === undefined) s = STRINGS.en[key];
    if (s === undefined) return key;
    if (vars) {
      Object.keys(vars).forEach(function (k) { s = s.split('{' + k + '}').join(vars[k]); });
    }
    return s;
  }

  // Catalogue text can be a plain string or { en, fr, ar }; missing
  // translations fall back to English.
  function tr(value) {
    if (value == null) return '';
    if (typeof value !== 'object') return String(value);
    return value[lang] || value.en || value.fr || value.ar || '';
  }

  // Replace text of [data-i18n] elements; [data-i18n-attr="attr:key;attr:key"].
  function applyStatic(root) {
    (root || document).querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    (root || document).querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var parts = pair.split(':');
        el.setAttribute(parts[0].trim(), t(parts[1].trim()));
      });
    });
  }

  function setLang(code) {
    if (CODES.indexOf(code) === -1 || code === lang) return;
    store(code);
    var url = new URL(window.location.href);
    url.searchParams.delete('lang');
    window.location.href = url.href;
  }

  window.BouchraI18n = {
    lang: lang,
    dir: meta.dir,
    isRtl: meta.dir === 'rtl',
    languages: LANGS,
    t: t,
    tr: tr,
    applyStatic: applyStatic,
    setLang: setLang
  };
})();
