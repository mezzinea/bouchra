/*
 * BOUCHRA — central catalogue & site configuration.
 *
 * Every page reads products and settings from this one file.
 * Edit it with admin.html (recommended) and replace this file with the
 * exported version, or edit it by hand.
 *
 * Translatable text is written as { "en": …, "fr": …, "ar": … }.
 * A missing translation falls back to English. Colours are identified by
 * their English name, so keep it stable once products are live. A colour
 * can list its own "images", shown when a customer selects it.
 *
 * NOTE: the products, prices and size measurements below are SAMPLE data
 * for layout purposes. Replace them with the real collection.
 */
window.BOUCHRA_CATALOG = {
  "settings": {
    "brandName": "BOUCHRA",
    "whatsappNumber": "",
    "siteUrl": "",
    "currency": {
      "en": "MAD",
      "fr": "MAD",
      "ar": "درهم"
    },
    "generalMessage": {
      "en": "Hello BOUCHRA! I would like to know more about your collections.",
      "fr": "Bonjour BOUCHRA ! J’aimerais en savoir plus sur vos collections.",
      "ar": "مرحبًا BOUCHRA! أود معرفة المزيد عن مجموعاتكم."
    },
    "deliveryInfo": {
      "en": "We deliver across Morocco. Delivery costs and timing depend on your city and are confirmed with you on WhatsApp before your order is finalised. Payment method and order details are also agreed directly with our team.",
      "fr": "Nous livrons partout au Maroc. Les frais et délais de livraison dépendent de votre ville et vous sont confirmés sur WhatsApp avant la validation de votre commande. Le mode de paiement et les détails de la commande sont également convenus directement avec notre équipe.",
      "ar": "نوصل إلى جميع أنحاء المغرب. تختلف تكاليف ومدة التوصيل حسب مدينتك، ونؤكدها معك عبر واتساب قبل تأكيد الطلب. كما يتم الاتفاق على طريقة الدفع وتفاصيل الطلب مباشرة مع فريقنا."
    },
    "homepage": {
      "announcement": {
        "en": "Order directly on WhatsApp · Delivery across Morocco",
        "fr": "Commandez sur WhatsApp · Livraison partout au Maroc",
        "ar": "اطلبي مباشرة عبر واتساب · توصيل إلى جميع أنحاء المغرب"
      },
      "heroEyebrow": {
        "en": "Modern Modesty · Moroccan Soul",
        "fr": "Pudeur moderne · Âme marocaine",
        "ar": "احتشام عصري · روح مغربية"
      },
      "heroTitle": {
        "en": "Elegance in Every Detail",
        "fr": "L’élégance dans chaque détail",
        "ar": "الأناقة في كل التفاصيل"
      },
      "heroText": {
        "en": "Contemporary abayas and modest dresses designed in Agadir, inspired by the beauty of our heritage and the strength of modern women.",
        "fr": "Des abayas et robes pudiques contemporaines imaginées à Agadir, inspirées par la beauté de notre héritage et la force des femmes d’aujourd’hui.",
        "ar": "عبايات وفساتين محتشمة عصرية مصممة في أكادير، مستوحاة من جمال تراثنا وقوة المرأة العصرية."
      },
      "promoTitle": {
        "en": "Personalised assistance, just a message away.",
        "fr": "Un accompagnement personnalisé, à un message près.",
        "ar": "مساعدة شخصية، على بعد رسالة واحدة."
      },
      "promoText": {
        "en": "Discover your favourite pieces and contact our team directly on WhatsApp for availability, sizing and ordering assistance.",
        "fr": "Découvrez vos pièces préférées et contactez notre équipe directement sur WhatsApp pour la disponibilité, les tailles et l’aide à la commande.",
        "ar": "اكتشفي قطعك المفضلة وتواصلي مع فريقنا مباشرة عبر واتساب لمعرفة التوفر والمقاسات والمساعدة في الطلب."
      }
    }
  },
  "categories": [
    {
      "id": "abayas",
      "name": {
        "en": "Contemporary Abayas",
        "fr": "Abayas contemporaines",
        "ar": "عبايات عصرية"
      },
      "image": "img/products/brown-abaya-1.jpg"
    },
    {
      "id": "islamic-dresses",
      "name": {
        "en": "Islamic Dresses",
        "fr": "Robes islamiques",
        "ar": "فساتين إسلامية"
      },
      "image": "img/products/ivory-dress-1.jpg"
    },
    {
      "id": "everyday",
      "name": {
        "en": "Everyday Modest",
        "fr": "Tenues du quotidien",
        "ar": "أزياء يومية محتشمة"
      },
      "image": "img/products/beige-abaya-2.jpg"
    },
    {
      "id": "occasion",
      "name": {
        "en": "Occasion Dresses",
        "fr": "Robes de cérémonie",
        "ar": "فساتين المناسبات"
      },
      "image": "img/products/beige-abaya-1.jpg"
    }
  ],
  "sizeGuide": {
    "note": {
      "en": "Measurements in centimetres. Our team is happy to advise on sizing via WhatsApp.",
      "fr": "Mesures en centimètres. Notre équipe vous conseille volontiers sur les tailles via WhatsApp.",
      "ar": "القياسات بالسنتيمتر. يسعد فريقنا تقديم النصيحة حول المقاس عبر واتساب."
    },
    "columns": [
      {
        "en": "Size",
        "fr": "Taille",
        "ar": "المقاس"
      },
      {
        "en": "Bust",
        "fr": "Poitrine",
        "ar": "الصدر"
      },
      {
        "en": "Hips",
        "fr": "Hanches",
        "ar": "الأرداف"
      },
      {
        "en": "Length",
        "fr": "Longueur",
        "ar": "الطول"
      },
      {
        "en": "Sleeve",
        "fr": "Manche",
        "ar": "الكم"
      }
    ],
    "rows": [
      [
        "S",
        "88–92",
        "94–98",
        "140",
        "58"
      ],
      [
        "M",
        "92–96",
        "98–102",
        "143",
        "59"
      ],
      [
        "L",
        "96–102",
        "102–108",
        "146",
        "60"
      ],
      [
        "XL",
        "102–108",
        "108–114",
        "148",
        "61"
      ],
      [
        "XXL",
        "108–116",
        "114–122",
        "150",
        "62"
      ]
    ]
  },
  "products": [
    {
      "id": "sahara-pleated-abaya",
      "sku": "BCH-AB-001",
      "name": {
        "en": "Sahara Pleated Abaya",
        "fr": "Abaya plissée Sahara",
        "ar": "عباية صحراء بطيّات"
      },
      "category": "abayas",
      "price": 1290,
      "description": {
        "en": "A flowing abaya with a softly pleated front and a fabric belt that gently defines the waist. Wide sleeves are finished with our signature Amazigh-inspired embroidery.",
        "fr": "Une abaya fluide au devant délicatement plissé, avec une ceinture en tissu qui marque légèrement la taille. Les manches amples sont ornées de notre broderie signature d’inspiration amazighe.",
        "ar": "عباية انسيابية بطيّات رقيقة في الأمام وحزام من القماش يحدد الخصر بلطف. أكمامها الواسعة مزينة بتطريزنا المميز المستوحى من الفن الأمازيغي."
      },
      "fabric": {
        "en": "Premium crêpe (95% polyester, 5% elastane). Opaque, lightweight and breathable.",
        "fr": "Crêpe premium (95 % polyester, 5 % élasthanne). Opaque, léger et respirant.",
        "ar": "كريب فاخر (95٪ بوليستر، 5٪ إيلاستين). غير شفاف، خفيف ويسمح بالتهوية."
      },
      "care": {
        "en": "Gentle hand wash in cold water. Iron on low heat on the reverse side.",
        "fr": "Lavage à la main délicat à l’eau froide. Repassage doux sur l’envers.",
        "ar": "غسيل يدوي لطيف بالماء البارد. كيّ على حرارة منخفضة من الجهة الداخلية."
      },
      "sizes": [
        "S",
        "M",
        "L",
        "XL"
      ],
      "colours": [
        {
          "name": {
            "en": "Sand",
            "fr": "Sable",
            "ar": "رملي"
          },
          "hex": "#D4B89C",
          "images": [
            "img/products/beige-abaya-1.jpg",
            "img/products/beige-abaya-2.jpg"
          ]
        },
        {
          "name": {
            "en": "Black",
            "fr": "Noir",
            "ar": "أسود"
          },
          "hex": "#1D1B1E",
          "images": [
            "img/products/black-abaya-1.jpg",
            "img/products/black-abaya-2.jpg"
          ]
        },
        {
          "name": {
            "en": "Navy",
            "fr": "Bleu marine",
            "ar": "كحلي"
          },
          "hex": "#1E2A47",
          "images": [
            "img/products/navy-abaya-1.jpg",
            "img/products/navy-abaya-2.jpg"
          ]
        },
        {
          "name": {
            "en": "Dusty Rose",
            "fr": "Vieux rose",
            "ar": "وردي عتيق"
          },
          "hex": "#C79C9C",
          "images": [
            "img/products/dusty-rose-abaya-1.jpg",
            "img/products/dusty-rose-abaya-2.jpg"
          ]
        },
        {
          "name": {
            "en": "Emerald",
            "fr": "Émeraude",
            "ar": "زمردي"
          },
          "hex": "#24584B",
          "images": [
            "img/products/emerald-abaya-1.jpg",
            "img/products/emerald-abaya-2.jpg"
          ]
        },
        {
          "name": {
            "en": "Lilac",
            "fr": "Lilas",
            "ar": "ليلكي"
          },
          "hex": "#A08FB0",
          "images": [
            "img/products/lilac-abaya-1.jpg",
            "img/products/lilac-abaya-2.jpg"
          ]
        }
      ],
      "images": [
        "img/products/beige-abaya-1.jpg",
        "img/products/beige-abaya-2.jpg"
      ],
      "availability": "in-stock",
      "newArrival": true,
      "bestSeller": true
    },
    {
      "id": "amazigh-embroidered-abaya",
      "sku": "BCH-AB-002",
      "name": {
        "en": "Amazigh Embroidered Abaya",
        "fr": "Abaya brodée Amazigh",
        "ar": "عباية أمازيغية مطرزة"
      },
      "category": "abayas",
      "price": 1490,
      "description": {
        "en": "A rich cocoa abaya with geometric embroidery running along the sleeves, a tribute to Amazigh craftsmanship. Relaxed and elegant from day to evening.",
        "fr": "Une abaya couleur cacao ornée d’une broderie géométrique le long des manches, en hommage à l’artisanat amazigh. Ample et élégante du jour au soir.",
        "ar": "عباية بلون الكاكاو الغني مع تطريز هندسي على طول الأكمام، تحية للحرف الأمازيغية. مريحة وأنيقة من النهار إلى المساء."
      },
      "fabric": {
        "en": "Medina silk blend with tone-on-tone cotton embroidery.",
        "fr": "Mélange de soie Médina avec broderie en coton ton sur ton.",
        "ar": "مزيج حرير المدينة مع تطريز قطني بنفس اللون."
      },
      "care": {
        "en": "Dry clean recommended.",
        "fr": "Nettoyage à sec recommandé.",
        "ar": "يُنصح بالتنظيف الجاف."
      },
      "sizes": [
        "S",
        "M",
        "L",
        "XL",
        "XXL"
      ],
      "colours": [
        {
          "name": {
            "en": "Cocoa",
            "fr": "Cacao",
            "ar": "كاكاو"
          },
          "hex": "#5B4334"
        },
        {
          "name": {
            "en": "Sand",
            "fr": "Sable",
            "ar": "رملي"
          },
          "hex": "#D4B89C"
        }
      ],
      "images": [
        "img/products/brown-abaya-1.jpg",
        "img/products/beige-abaya-2.jpg"
      ],
      "availability": "low-stock",
      "newArrival": false,
      "bestSeller": true
    },
    {
      "id": "agadir-everyday-dress",
      "sku": "BCH-EV-001",
      "name": {
        "en": "Agadir Everyday Dress",
        "fr": "Robe du quotidien Agadir",
        "ar": "فستان أكادير اليومي"
      },
      "category": "everyday",
      "price": 690,
      "description": {
        "en": "An easy, graceful maxi dress for every day. A relaxed silhouette, long sleeves and side pockets, finished with a delicate embroidered cuff.",
        "fr": "Une robe longue facile et gracieuse pour tous les jours. Silhouette ample, manches longues et poches latérales, avec un délicat poignet brodé.",
        "ar": "فستان طويل سهل وأنيق لكل يوم. قصة مريحة وأكمام طويلة وجيوب جانبية، مع أساور مطرزة برقة."
      },
      "fabric": {
        "en": "Soft viscose jersey. Opaque and comfortable.",
        "fr": "Jersey de viscose doux. Opaque et confortable.",
        "ar": "جيرسي فيسكوز ناعم. غير شفاف ومريح."
      },
      "care": {
        "en": "Machine wash at 30°C on a gentle cycle.",
        "fr": "Lavage en machine à 30 °C, cycle délicat.",
        "ar": "غسيل في الغسالة على 30 درجة بدورة لطيفة."
      },
      "sizes": [
        "S",
        "M",
        "L",
        "XL"
      ],
      "colours": [
        {
          "name": {
            "en": "Ivory",
            "fr": "Ivoire",
            "ar": "عاجي"
          },
          "hex": "#F3EEE6"
        },
        {
          "name": {
            "en": "Sand",
            "fr": "Sable",
            "ar": "رملي"
          },
          "hex": "#D4B89C"
        },
        {
          "name": {
            "en": "Olive",
            "fr": "Olive",
            "ar": "زيتوني"
          },
          "hex": "#7A7A5A"
        }
      ],
      "images": [
        "img/products/ivory-dress-1.jpg",
        "img/products/beige-abaya-2.jpg"
      ],
      "availability": "in-stock",
      "newArrival": true,
      "bestSeller": false
    },
    {
      "id": "atlas-linen-dress",
      "sku": "BCH-DR-001",
      "name": {
        "en": "Atlas Linen Dress",
        "fr": "Robe en lin Atlas",
        "ar": "فستان أطلس من الكتان"
      },
      "category": "islamic-dresses",
      "price": 890,
      "description": {
        "en": "A modest linen-blend dress with a gentle A-line cut, covered buttons and a softly gathered waist. Light and airy for warm days.",
        "fr": "Une robe pudique en lin mélangé, coupe légèrement évasée, boutons recouverts et taille délicatement froncée. Légère et aérienne pour les beaux jours.",
        "ar": "فستان محتشم من مزيج الكتان بقصة واسعة من الأسفل وأزرار مغطاة وخصر مجعد بنعومة. خفيف ومنعش للأيام الدافئة."
      },
      "fabric": {
        "en": "Linen and viscose blend (55% linen, 45% viscose).",
        "fr": "Mélange lin et viscose (55 % lin, 45 % viscose).",
        "ar": "مزيج كتان وفيسكوز (55٪ كتان، 45٪ فيسكوز)."
      },
      "care": {
        "en": "Machine wash at 30°C. Iron while slightly damp.",
        "fr": "Lavage en machine à 30 °C. Repasser légèrement humide.",
        "ar": "غسيل في الغسالة على 30 درجة. يُكوى وهو رطب قليلًا."
      },
      "sizes": [
        "S",
        "M",
        "L",
        "XL"
      ],
      "colours": [
        {
          "name": {
            "en": "Ivory",
            "fr": "Ivoire",
            "ar": "عاجي"
          },
          "hex": "#F3EEE6"
        },
        {
          "name": {
            "en": "Terracotta",
            "fr": "Terracotta",
            "ar": "تيراكوتا"
          },
          "hex": "#B78B6A"
        }
      ],
      "images": [
        "img/products/ivory-dress-1.jpg",
        "img/products/beige-abaya-1.jpg"
      ],
      "availability": "in-stock",
      "newArrival": false,
      "bestSeller": true
    },
    {
      "id": "medina-satin-gown",
      "sku": "BCH-OC-001",
      "name": {
        "en": "Medina Satin Gown",
        "fr": "Robe de cérémonie Médina en satin",
        "ar": "فستان المدينة الساتان"
      },
      "category": "occasion",
      "price": null,
      "description": {
        "en": "A luxurious satin gown for weddings and celebrations, with a draped bodice, full sleeves and a sweeping hem. Made to order in your size.",
        "fr": "Une robe en satin luxueuse pour les mariages et les fêtes, au buste drapé, aux manches amples et à l’ourlet ample. Confectionnée sur commande à votre taille.",
        "ar": "فستان ساتان فاخر للأعراس والاحتفالات، بصدر منسدل وأكمام واسعة وذيل منساب. يُخاط حسب الطلب بمقاسك."
      },
      "fabric": {
        "en": "Heavy duchess satin, fully lined.",
        "fr": "Satin duchesse épais, entièrement doublé.",
        "ar": "ساتان دوشيس سميك، مبطن بالكامل."
      },
      "care": {
        "en": "Dry clean only.",
        "fr": "Nettoyage à sec uniquement.",
        "ar": "تنظيف جاف فقط."
      },
      "sizes": [
        "S",
        "M",
        "L",
        "XL",
        "XXL"
      ],
      "colours": [
        {
          "name": {
            "en": "Champagne",
            "fr": "Champagne",
            "ar": "شامبانيا"
          },
          "hex": "#E3CFAE",
          "images": [
            "img/products/beige-abaya-1.jpg",
            "img/products/beige-abaya-2.jpg"
          ]
        },
        {
          "name": {
            "en": "Rose Nude",
            "fr": "Rose nude",
            "ar": "وردي فاتح"
          },
          "hex": "#D9B8B0",
          "images": [
            "img/products/dusty-rose-abaya-1.jpg",
            "img/products/dusty-rose-abaya-2.jpg"
          ]
        },
        {
          "name": {
            "en": "Burgundy",
            "fr": "Bordeaux",
            "ar": "عنابي"
          },
          "hex": "#6E2639",
          "images": [
            "img/products/burgundy-abaya-1.jpg",
            "img/products/burgundy-abaya-2.jpg"
          ]
        },
        {
          "name": {
            "en": "Emerald",
            "fr": "Émeraude",
            "ar": "زمردي"
          },
          "hex": "#24584B",
          "images": [
            "img/products/emerald-abaya-1.jpg",
            "img/products/emerald-abaya-2.jpg"
          ]
        }
      ],
      "images": [
        "img/products/beige-abaya-1.jpg",
        "img/products/beige-abaya-2.jpg"
      ],
      "availability": "made-to-order",
      "newArrival": true,
      "bestSeller": false
    },
    {
      "id": "nour-belted-abaya",
      "sku": "BCH-AB-003",
      "name": {
        "en": "Nour Belted Abaya",
        "fr": "Abaya ceinturée Nour",
        "ar": "عباية نور بحزام"
      },
      "category": "abayas",
      "price": 1190,
      "description": {
        "en": "A clean, contemporary abaya with a removable tie belt and gently flared sleeves. A timeless wardrobe essential.",
        "fr": "Une abaya épurée et contemporaine avec ceinture amovible et manches légèrement évasées. Un essentiel intemporel.",
        "ar": "عباية عصرية بخطوط بسيطة مع حزام قابل للإزالة وأكمام واسعة قليلًا. قطعة أساسية لا يبطل موضتها."
      },
      "fabric": {
        "en": "Nidha fabric, fluid and wrinkle-resistant.",
        "fr": "Tissu nidha, fluide et infroissable.",
        "ar": "قماش ندى، انسيابي ومقاوم للتجعد."
      },
      "care": {
        "en": "Gentle hand wash in cold water.",
        "fr": "Lavage à la main délicat à l’eau froide.",
        "ar": "غسيل يدوي لطيف بالماء البارد."
      },
      "sizes": [
        "S",
        "M",
        "L",
        "XL"
      ],
      "colours": [
        {
          "name": {
            "en": "Sand",
            "fr": "Sable",
            "ar": "رملي"
          },
          "hex": "#D4B89C",
          "images": [
            "img/products/beige-abaya-1.jpg",
            "img/products/beige-abaya-2.jpg"
          ]
        },
        {
          "name": {
            "en": "Black",
            "fr": "Noir",
            "ar": "أسود"
          },
          "hex": "#1D1B1E",
          "images": [
            "img/products/black-abaya-1.jpg",
            "img/products/black-abaya-2.jpg"
          ]
        },
        {
          "name": {
            "en": "Burgundy",
            "fr": "Bordeaux",
            "ar": "عنابي"
          },
          "hex": "#6E2639",
          "images": [
            "img/products/burgundy-abaya-1.jpg",
            "img/products/burgundy-abaya-2.jpg"
          ]
        },
        {
          "name": {
            "en": "Dusty Blue",
            "fr": "Bleu poudré",
            "ar": "أزرق فاتح"
          },
          "hex": "#7E95B2",
          "images": [
            "img/products/dusty-blue-abaya-1.jpg",
            "img/products/dusty-blue-abaya-2.jpg"
          ]
        }
      ],
      "images": [
        "img/products/beige-abaya-1.jpg",
        "img/products/beige-abaya-2.jpg"
      ],
      "availability": "in-stock",
      "newArrival": false,
      "bestSeller": false
    },
    {
      "id": "souss-wrap-dress",
      "sku": "BCH-EV-002",
      "name": {
        "en": "Souss Wrap Dress",
        "fr": "Robe portefeuille Souss",
        "ar": "فستان سوس الملفوف"
      },
      "category": "everyday",
      "price": 590,
      "description": {
        "en": "A wrap-style modest dress with a secure inner fastening and long cuffed sleeves. Effortless and flattering.",
        "fr": "Une robe pudique façon portefeuille avec attache intérieure sécurisée et manches longues à poignets. Facile à porter et flatteuse.",
        "ar": "فستان محتشم بقصة ملفوفة مع رباط داخلي آمن وأكمام طويلة بأساور. سهل الارتداء ويُبرز الإطلالة."
      },
      "fabric": {
        "en": "Crepe de chine, lightly textured.",
        "fr": "Crêpe de Chine, légèrement texturé.",
        "ar": "كريب دي شين بملمس خفيف."
      },
      "care": {
        "en": "Machine wash at 30°C on a gentle cycle.",
        "fr": "Lavage en machine à 30 °C, cycle délicat.",
        "ar": "غسيل في الغسالة على 30 درجة بدورة لطيفة."
      },
      "sizes": [
        "S",
        "M",
        "L"
      ],
      "colours": [
        {
          "name": {
            "en": "Olive",
            "fr": "Olive",
            "ar": "زيتوني"
          },
          "hex": "#7A7A5A"
        },
        {
          "name": {
            "en": "Sand",
            "fr": "Sable",
            "ar": "رملي"
          },
          "hex": "#D4B89C"
        }
      ],
      "images": [
        "img/products/ivory-dress-1.jpg"
      ],
      "availability": "out-of-stock",
      "newArrival": false,
      "bestSeller": false
    },
    {
      "id": "rose-nude-occasion-abaya",
      "sku": "BCH-OC-002",
      "name": {
        "en": "Rose Nude Occasion Abaya",
        "fr": "Abaya de cérémonie Rose nude",
        "ar": "عباية المناسبات الوردية"
      },
      "category": "occasion",
      "price": 1890,
      "description": {
        "en": "An occasion abaya in rose nude chiffon over a satin slip, finished with hand-placed embroidery at the cuffs.",
        "fr": "Une abaya de cérémonie en mousseline rose nude sur fond de satin, rehaussée de broderies posées à la main aux poignets.",
        "ar": "عباية للمناسبات من الشيفون الوردي الفاتح فوق بطانة ساتان، مزينة بتطريز يدوي عند الأساور."
      },
      "fabric": {
        "en": "Silk chiffon outer layer with satin lining.",
        "fr": "Mousseline de soie avec doublure en satin.",
        "ar": "طبقة خارجية من شيفون الحرير مع بطانة ساتان."
      },
      "care": {
        "en": "Dry clean only.",
        "fr": "Nettoyage à sec uniquement.",
        "ar": "تنظيف جاف فقط."
      },
      "sizes": [
        "S",
        "M",
        "L",
        "XL"
      ],
      "colours": [
        {
          "name": {
            "en": "Rose Nude",
            "fr": "Rose nude",
            "ar": "وردي فاتح"
          },
          "hex": "#D9B8B0",
          "images": [
            "img/products/dusty-rose-abaya-1.jpg",
            "img/products/dusty-rose-abaya-2.jpg"
          ]
        },
        {
          "name": {
            "en": "Champagne",
            "fr": "Champagne",
            "ar": "شامبانيا"
          },
          "hex": "#E3CFAE",
          "images": [
            "img/products/beige-abaya-1.jpg",
            "img/products/beige-abaya-2.jpg"
          ]
        },
        {
          "name": {
            "en": "Lilac",
            "fr": "Lilas",
            "ar": "ليلكي"
          },
          "hex": "#A08FB0",
          "images": [
            "img/products/lilac-abaya-1.jpg",
            "img/products/lilac-abaya-2.jpg"
          ]
        }
      ],
      "images": [
        "img/products/dusty-rose-abaya-1.jpg",
        "img/products/dusty-rose-abaya-2.jpg"
      ],
      "availability": "in-stock",
      "newArrival": true,
      "bestSeller": true
    }
  ]
};
