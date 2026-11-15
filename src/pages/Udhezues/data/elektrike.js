// To add a guide: add one object here. Optional fields: published, updated
// (ISO dates like "2026-11-15"). They feed JSON-LD and the sitemap.

export const ELEKTRIKE_GUIDES = [
  {
    slug: "si-te-nderrosh-nje-llambe",
    category: "elektrike",
    title: "Si ta ndërrosh një llambë",
    summary:
      "Nga zgjedhja e fileto-s së duhur deri te vendosja e llambës së re, pa gabime dhe pa goditje.",
    time: "5 minuta",
    level: "E lehtë",
    figure: "bulbs",
    tools: [
      "Llambë e re me të njëjtën fileto",
      "Shkallë e qëndrueshme",
      "Leckë e thatë",
    ],
    warning:
      "Fike çelësin dhe prit disa minuta që llamba e vjetër të ftohet. Mos e prek llambën me duar të lagura.",
    steps: [
      [
        "Fike dritën",
        "Fike çelësin e dritës. Për punë mbi tavan është më mirë të fikësh edhe siguresën e atij qarku.",
      ],
      [
        "Prit që të ftohet",
        "Llambat halogjene dhe inkandeshente nxehen shumë. Prit disa minuta para se t’i prekësh.",
      ],
      [
        "Hiqe llambën e vjetër",
        "Mbaje me një leckë të thatë dhe ktheje kundër akrepave të orës derisa të lirohet.",
      ],
      [
        "Zgjidh llambën e re",
        "Lexo shënimin te baza e llambës së vjetër: E27, E14 ose GU10. Kontrollo edhe fuqinë maksimale (në vat) që lejon llambadari.",
      ],
      [
        "Vendose dhe ktheje butësisht",
        "Vendose drejt dhe ktheje sipas akrepave të orës derisa të ndalet. Mos e shtrëngo me forcë, se thyhet baza.",
      ],
      [
        "Ndize dhe provo",
        "Kthe siguresën, ndize dritën dhe provo. Nëse nuk ndizet, shih udhëzuesin «Drita nuk ndizet».",
      ],
    ],
    tips: [
      "Llambat LED harxhojnë shumë më pak energji dhe zgjasin shumë më gjatë se ato inkandeshente.",
      "Ngjyra e dritës matet në kelvin: rreth 2700K është e ngrohtë (dhomë ndenjeje), rreth 4000K është neutrale (kuzhinë, banjo), rreth 6500K është e ftohtë.",
      "Nëse drita ka rregullator intensiteti (dimmer), blej llamba LED të shënuara «dimmable».",
    ],
    pro: "Nëse llamba digjet shpesh, ose fileto-ja është e nxirë apo e shkrirë, thirr elektricist. Mund të ketë lidhje të dobët ose tension të lartë.",
  },
  {
    slug: "drita-nuk-ndizet",
    category: "elektrike",
    title: "Drita nuk ndizet: gjej shkakun hap pas hapi",
    summary:
      "Tre kontrolle të thjeshta që zgjidhin shumicën e rasteve, dhe shenjat kur duhet të ndalosh.",
    time: "10 deri 15 minuta",
    level: "E lehtë",
    figure: "flow",
    tools: ["Llambë rezervë", "Fener", "Provues tensioni (opsional)"],
    warning:
      "Mos hap kurrë kutinë e çelësit ose llambadarin pa fikur siguresën e atij qarku.",
    steps: [
      [
        "Provo llambën",
        "Ndërroje me një llambë që e di se punon. Shumica e rasteve zgjidhen këtu.",
      ],
      [
        "Kontrollo çelësin",
        "A bën «klik» normal? Nëse ndihet i lirë, i ngrohtë ose nuk bën zë, çelësi mund të jetë i prishur.",
      ],
      [
        "Provo dritat dhe prizat e tjera",
        "Nëse edhe dritat e tjera në dhomë nuk punojnë, problemi është te qarku, jo te llamba.",
      ],
      [
        "Shko te pulti i siguresave",
        "Një siguresë automatike e rënë qëndron në pozicion të mesëm ose poshtë. Shih udhëzuesin «Siguresa bie».",
      ],
      [
        "Vër re shenjat paralajmëruese",
        "Erë djegieje, zhurmë zukatëse, shenja të zeza rreth çelësit ose prizës: ndalo dhe thirr elektricist.",
      ],
    ],
    tips: [
      "Nëse siguresa bie sërish menjëherë, mos e ngre vazhdimisht. Ka lidhje të shkurtër ose mbingarkesë.",
      "Llambat LED që pulsojnë shpesh kanë problem me dimmer-in ose me drajverin e llambës.",
    ],
    pro: "Erë djegieje, shkëndija, çelës që nxehet ose siguresë që bie vazhdimisht janë arsye për të thirrur elektricist menjëherë.",
  },
  {
    slug: "si-te-nderrosh-celesin-e-drites",
    category: "elektrike",
    title: "Si ta ndërrosh një çelës drite",
    summary:
      "Si funksionon lidhja çelës–llambë dhe si ta ndërrosh një çelës të prishur në mënyrë të sigurt.",
    time: "20 deri 30 minuta",
    level: "E mesme",
    figure: "wiring",
    tools: [
      "Kaçavidë e sheshtë dhe kryq",
      "Provues tensioni pa kontakt",
      "Çelës i ri i të njëjtit lloj",
      "Shirit izolues",
    ],
    warning:
      "Fike siguresën e qarkut dhe verifiko me provues tensioni që nuk ka rrymë. Nëse nuk ke përvojë, kjo punë është për elektricist.",
    steps: [
      [
        "Fike siguresën dhe verifiko",
        "Fike siguresën përkatëse dhe provo telat me provues tensioni para se t’i prekësh.",
      ],
      [
        "Hiq kapakun dhe çelësin",
        "Zakonisht mbahen me dy vida. Hiqi me kujdes pa tërhequr telat.",
      ],
      [
        "Fotografo lidhjet",
        "Bëj një foto të qartë para se të zgjidhësh asnjë tel.",
      ],
      [
        "Zgjidh telat",
        "Çelësi ndërpret fazën (kafe ose e zezë). Zeroja (blu) në shumicën e rasteve kalon drejt llambës.",
      ],
      [
        "Lidh çelësin e ri",
        "Vendosi telat në të njëjtat terminale dhe shtrëngoji mirë. Asnjë tel i zhveshur nuk duhet të dalë jashtë terminalit.",
      ],
      [
        "Montoje dhe provo",
        "Vendose çelësin në mur, kthe siguresën dhe provo dritën disa herë.",
      ],
    ],
    tips: [
      "Zhvishe izolimin vetëm 8 deri 10 mm. Më shumë lë tel të zbuluar.",
      "Çelësi duhet të ndërpresë fazën, jo zeron. Kështu llambadari nuk ka tension kur drita është e fikur.",
    ],
    pro: "Nëse telat janë shumë të vjetër, të thyer, prej alumini ose nuk e kupton cili është cili, ndalo dhe thirr elektricist.",
  },
  {
    slug: "siguresa-bie",
    category: "elektrike",
    title: "Siguresa bie: si ta rivendosësh pa rrezik",
    summary:
      "Pse bie siguresa, si ta gjesh pajisjen fajtore dhe kur të mos e ngresh më.",
    time: "5 minuta",
    level: "E lehtë",
    figure: "panel",
    tools: ["Fener", "Duar të thata"],
    warning:
      "Qëndro në dysheme të thatë. Nëse pulti është i lagur, ka erë djegieje ose sheh shkëndija, mos e prek dhe thirr elektricist.",
    steps: [
      [
        "Mendo çfarë ishte ndezur",
        "Bojleri, furra, ngrohësi ose disa pajisje të fuqishme bashkë shpesh e mbingarkojnë qarkun.",
      ],
      ["Shkëput pajisjet", "Hiq nga priza pajisjet e qarkut që ra."],
      [
        "Gjej siguresën e rënë",
        "Në pult, ndërprerësi i rënë qëndron në mes ose poshtë, ndryshe nga të tjerët.",
      ],
      [
        "Ktheje poshtë dhe pastaj lart",
        "Së pari shtyje plotësisht poshtë (fikur), pastaj lart (ndezur).",
      ],
      ["Lidh pajisjet një nga një", "Kështu e gjen cila e shkakton rënien."],
    ],
    tips: [
      "Shumë pajisje të fuqishme në të njëjtin qark (ngrohës, kuzhinë) e mbingarkojnë atë.",
      "Siguresa diferenciale ka zakonisht një buton TEST. Shtype atë disa herë në vit për të kontrolluar që punon.",
    ],
    pro: "Nëse e njëjta siguresë bie më shumë se dy herë dhe nuk e lidh dot me një pajisje të caktuar, thirr elektricist për të kontrolluar instalimin.",
  },
];
