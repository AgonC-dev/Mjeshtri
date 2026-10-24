import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Logo from "../../assets/Logo2.png";
import styles from "./Udhezues.module.css";

/* ------------------------------------------------------------------ */
/*  Konfigurim                                                        */
/* ------------------------------------------------------------------ */

const SITE = "https://gjejnjerin.com";
const BASE = "/udhëzues";
const ROUTES = { electricians: "/electricians", plumbers: "/plumbers" };

const CATEGORIES = [
  {
    id: "elektrike",
    label: "Elektrike",
    blurb:
      "Llamba, çelësa dhe siguresa: punët e vogla që mund t’i bësh vetë dhe shenjat që kërkojnë elektricist.",
    cta: { label: "Gjej elektricistë", to: ROUTES.electricians },
  },
  {
    id: "hidraulike",
    label: "Hidraulikë",
    blurb:
      "Rubineta që pikojnë, lavamanë të bllokuar dhe WC që rrjedh: rregullimet më të shpeshta hap pas hapi.",
    cta: { label: "Gjej hidraulikë", to: ROUTES.plumbers },
  },
  {
    id: "fakte",
    label: "Fakte interesante",
    blurb: "Gjëra të vogla për rrymën dhe ujin që ndoshta nuk i dije.",
    cta: null,
  },
];

/* ------------------------------------------------------------------ */
/*  Përmbajtja: udhëzuesit                                             */
/* ------------------------------------------------------------------ */

const GUIDES = [
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
  {
    slug: "rubineti-pikon",
    category: "hidraulike",
    title: "Si ta ndalosh rubinetin që pikon",
    summary:
      "Shumicën e herëve shkaku është një unazë gome ose një kartuçë e konsumuar. Ja si e ndërron.",
    time: "30 minuta",
    level: "E mesme",
    figure: "tap",
    tools: [
      "Çelës i rregullueshëm",
      "Kaçavidë",
      "Kartuçë ose unaza gome të reja",
      "Leckë",
      "Vazelinë silikoni",
    ],
    warning:
      "Mbyll ujin te çezma nën lavaman (ose te çelësi kryesor) para se të fillosh. Hap rubinetin për të liruar presionin e mbetur.",
    steps: [
      [
        "Mbyll ujin",
        "Mbyll çezmat e vogla nën lavaman dhe hap rubinetin që të dalë uji i mbetur.",
      ],
      [
        "Mbro lavamanin",
        "Vendos një leckë ose tapë në vrimë, që të mos të të bjerë ndonjë vidë brenda.",
      ],
      [
        "Hiq dorezën",
        "Ngrije kapakun e vogël, zgjidhe vidën që ka poshtë dhe tërhiqe dorezën.",
      ],
      [
        "Hiq dadon dhe kartuçën",
        "Me çelës të rregullueshëm zgjidhe dadon, pastaj tërhiqe kartuçën drejt lart.",
      ],
      [
        "Kontrollo dhe ndërro",
        "Unazat e çara ose kartuça me gëlqere janë shkaku më i shpeshtë. Merr kartuçën me vete në dyqan për të blerë të njëjtën.",
      ],
      [
        "Montoje në rend të kundërt",
        "Lyej unazat me pak vazelinë silikoni, montoje, hap ujin ngadalë dhe provo.",
      ],
    ],
    tips: [
      "Gëlqerja zbutet nëse pjesët i lë në uthull për rreth 30 minuta.",
      "Mos e shtrëngo shumë dadon. Mjafton sa të mos rrjedhë.",
    ],
    pro: "Nëse uji pikon nga trupi i rubinetit ose nga tubat nën lavaman, ose rubineti është shumë i vjetër, më mirë ndërroje krejt me hidraulik.",
  },
  {
    slug: "lavamani-i-bllokuar",
    category: "hidraulike",
    title: "Si ta zhbllokosh lavamanin",
    summary:
      "Nga ventuza deri te pastrimi i sifonit: mënyra e sigurt për të hapur një lavaman që zbrazet ngadalë.",
    time: "20 minuta",
    level: "E lehtë",
    figure: "trap",
    tools: ["Kovë", "Doreza", "Ventuzë", "Furçë e vjetër ose tel i hollë"],
    warning:
      "Mos i përzie kurrë produkte kimike zbllokuese me njëri-tjetrin. Mund të lëshojnë gaze të rrezikshme dhe dëmtojnë tubat.",
    steps: [
      [
        "Provo me ventuzë",
        "Lër pak ujë në lavaman dhe pompo 10 deri 15 herë me ventuzë.",
      ],
      [
        "Vendos kovën poshtë sifonit",
        "Në sifon ka ujë dhe papastërti. Kova e mban pastër dyshemenë.",
      ],
      [
        "Zgjidh sifonin",
        "Kthe dadot me dorë (ose me çelës nëse janë të shtrënguara) dhe zbrite sifonin.",
      ],
      ["Pastro", "Hiq flokët dhe yndyrën dhe shpëlaje me ujë të ngrohtë."],
      [
        "Vendose përsëri",
        "Kontrollo që unazat të jenë në vend dhe shtrëngoi dadot me dorë.",
      ],
      ["Provo për rrjedhje", "Hap ujin dhe kontrollo lidhjet për pika."],
    ],
    tips: [
      "Një filtër i vogël në vrimë ndalon flokët.",
      "Çdo javë hidh ujë të ngrohtë (jo të valë) që yndyra të mos grumbullohet. Uji që vlon mund t’i dëmtojë tubat plastikë.",
    ],
    pro: "Nëse të gjithë lavamanët ose WC janë të ngadaltë, bllokimi është në tubin kryesor. Thirr hidraulik.",
  },
  {
    slug: "wc-rrjedh",
    category: "hidraulike",
    title: "WC rrjedh vazhdimisht: si ta rregullosh",
    summary:
      "Plutuesi, kapaku i poshtëm dhe tubi i tejmbushjes: tre pjesët që shkaktojnë shumicën e rrjedhjeve.",
    time: "15 deri 20 minuta",
    level: "E lehtë",
    figure: "cistern",
    tools: [
      "Çelës i rregullueshëm",
      "Kapak i ri i poshtëm ose valvul e re",
      "Leckë",
      "Ngjyrues ushqimor (për provë)",
    ],
    warning: "Mbyll çezmën e vogël pas WC-së para se t’i ndërhysh te mekanizmi.",
    steps: [
      [
        "Hap kapakun e cisternës",
        "Ngrije me kujdes dhe vendose mënjanë në vend të sigurt.",
      ],
      [
        "Shiko ku rrjedh uji",
        "Nëse uji del nga tubi i tejmbushjes, niveli është shumë i lartë. Ule plutuesin.",
      ],
      [
        "Provo kapakun e poshtëm",
        "Vër pak ngjyrues ushqimor në cisternë dhe prit 15 minuta pa shkarkuar. Nëse ngjyra shfaqet në tas, kapaku nuk mbyllet mirë.",
      ],
      [
        "Pastro ose ndërro kapakun",
        "Fshije skajin me leckë. Nëse është i fortë ose i deformuar, ndërroje.",
      ],
      [
        "Rregullo zinxhirin",
        "Duhet të ketë pak lirësi. Nëse është shumë i shtrënguar, nuk e lë kapakun të mbyllet.",
      ],
      [
        "Hap ujin dhe provo",
        "Hap çezmën, prit të mbushet dhe shkarko disa herë.",
      ],
    ],
    tips: [
      "Një WC që rrjedh mund të humbasë shumë ujë pa e vënë re.",
      "Niveli i ujit duhet të jetë rreth 2 cm nën majën e tubit të tejmbushjes.",
    ],
    pro: "Nëse ka plasaritje në porcelan ose uji rrjedh nga lidhjet në mur, thirr hidraulik.",
  },
];

/* ------------------------------------------------------------------ */
/*  Fakte interesante                                                 */
/* ------------------------------------------------------------------ */

const FACTS = [
  {
    tag: "elektrike",
    stat: "15.000+ orë",
    title: "Jetëgjatësia e LED-it",
    text: "Një llambë LED e mirë mund të punojë me mijëra orë, ndërsa një llambë inkandeshente zakonisht zgjat rreth 1.000 orë.",
  },
  {
    tag: "elektrike",
    stat: "Kafe, blu, jeshile-verdhë",
    title: "Ngjyrat e kabllove",
    text: "Në standardin evropian faza është zakonisht kafe ose e zezë, zeroja është blu, kurse toka jeshile-verdhë.",
  },
  {
    tag: "elektrike",
    stat: "1879",
    title: "Edison dhe llamba",
    text: "Thomas Edison nuk e shpiku idenë e llambës elektrike, por në 1879 e bëri praktike me një filament që zgjaste sa për përdorim real.",
  },
  {
    tag: "elektrike",
    stat: "Më shumë nxehtësi",
    title: "Llamba që ngroh më shumë se ndriçon",
    text: "Një llambë inkandeshente shndërron pjesën më të madhe të energjisë në nxehtësi, jo në dritë. Prandaj nxehet kaq shumë.",
  },
  {
    tag: "elektrike",
    stat: "Uji + rryma",
    title: "Pse banjot kanë mbrojtje të veçantë",
    text: "Uji shumë i pastër përçon dobët, por uji i zakonshëm ka minerale të tretura dhe përçon mjaftueshëm për të qenë i rrezikshëm.",
  },
  {
    tag: "hidraulike",
    stat: "Rreth 10.000 litra",
    title: "Një rubinet që pikon",
    text: "Sipas vlerësimeve të zakonshme, një pikë në sekondë humbet afërsisht 10.000 litra ujë në vit. Ndërrimi i një unaze gome kushton pak.",
  },
  {
    tag: "hidraulike",
    stat: "100 deri 150 litra",
    title: "Ujë në ditë për person",
    text: "Në shumë vende evropiane përdorimi shtëpiak është afërsisht 100 deri 150 litra në ditë për person.",
  },
  {
    tag: "hidraulike",
    stat: "U",
    title: "Pse sifoni ka formë U",
    text: "Kthesa në formë U mban një sasi uji që vepron si «tapë» dhe e ndalon erën e kanalizimit të hyjë në shtëpi.",
  },
  {
    tag: "hidraulike",
    stat: "Gëlqerja",
    title: "Uji i fortë",
    text: "Uji me shumë minerale lë gëlqere në rubineta dhe dushe. Uthulla e holluar i zbut shumicën e shtresave të lehta.",
  },
];

/* ------------------------------------------------------------------ */
/*  Ndihmëse                                                          */
/* ------------------------------------------------------------------ */

const cx = (...a) => a.filter(Boolean).join(" ");

const normalize = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const guidePath = (g) => `${BASE}/${g.category}/${g.slug}`;

function setTag(selector, tag, attrs, valueAttr, value) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    document.head.appendChild(el);
  }
  el.setAttribute(valueAttr, value);
}

function usePageMeta({ title, description, path, jsonLd, noindex }) {
  const ld = jsonLd ? JSON.stringify(jsonLd) : "";
  useEffect(() => {
    document.title = title;
    setTag('meta[name="description"]', "meta", { name: "description" }, "content", description);
    setTag('link[rel="canonical"]', "link", { rel: "canonical" }, "href", SITE + path);
    setTag('meta[name="robots"]', "meta", { name: "robots" }, "content", noindex ? "noindex" : "index,follow");

    document.getElementById("udhezues-jsonld")?.remove();
    if (ld) {
      const s = document.createElement("script");
      s.type = "application/ld+json";
      s.id = "udhezues-jsonld";
      s.textContent = ld;
      document.head.appendChild(s);
    }
    return () => document.getElementById("udhezues-jsonld")?.remove();
  }, [title, description, path, ld, noindex]);
}

/* ------------------------------------------------------------------ */
/*  Figurat (SVG)                                                     */
/* ------------------------------------------------------------------ */

const Dot = ({ x, y, n }) => (
  <g>
    <circle cx={x} cy={y} r="11" className={styles.dot} />
    <text x={x} y={y + 4} className={styles.dotTxt}>{n}</text>
  </g>
);

function BulbsSvg() {
  return (
    <svg viewBox="0 0 480 230" role="img" aria-label="Tre llojet e zakonshme të bazës së llambës" className={styles.svg}>
      <g transform="translate(80 0)">
        <circle cx="0" cy="62" r="40" className={styles.glass} />
        <path d="M-16 96 L-16 112 H16 L16 96" className={styles.glass} />
        <rect x="-20" y="112" width="40" height="46" rx="5" className={styles.accentFill} />
        <path d="M-20 126 H20 M-20 140 H20" className={styles.ln} />
        <Dot x={-50} y={30} n={1} />
        <text x="0" y="184" className={cx(styles.txtB, styles.mid)}>E27</text>
        <text x="0" y="202" className={cx(styles.txtS, styles.mid)}>fileto e madhe</text>
      </g>
      <g transform="translate(240 0)">
        <circle cx="0" cy="70" r="30" className={styles.glass} />
        <path d="M-12 98 L-12 110 H12 L12 98" className={styles.glass} />
        <rect x="-14" y="110" width="28" height="38" rx="4" className={styles.accentFill} />
        <path d="M-14 122 H14 M-14 134 H14" className={styles.ln} />
        <Dot x={-44} y={40} n={2} />
        <text x="0" y="184" className={cx(styles.txtB, styles.mid)}>E14</text>
        <text x="0" y="202" className={cx(styles.txtS, styles.mid)}>fileto e vogël</text>
      </g>
      <g transform="translate(400 0)">
        <path d="M-34 40 H34 L26 120 H-26 Z" className={styles.glass} />
        <ellipse cx="0" cy="40" rx="34" ry="8" className={styles.soft} />
        <rect x="-26" y="120" width="52" height="22" rx="4" className={styles.accentFill} />
        <path d="M-12 142 V156 M12 142 V156" className={styles.ln} strokeWidth="3" />
        <circle cx="-12" cy="158" r="4" className={styles.glass} />
        <circle cx="12" cy="158" r="4" className={styles.glass} />
        <Dot x={-50} y={30} n={3} />
        <text x="0" y="184" className={cx(styles.txtB, styles.mid)}>GU10</text>
        <text x="0" y="202" className={cx(styles.txtS, styles.mid)}>dy kunja (spot)</text>
      </g>
    </svg>
  );
}

function FlowSvg() {
  const boxes = [
    { x: 10, n: 1, t: "Llamba", a: "Provo një llambë", b: "që e di se punon" },
    { x: 170, n: 2, t: "Çelësi dhe prizat", a: "A punojnë dritat", b: "e tjera në dhomë?" },
    { x: 330, n: 3, t: "Siguresa", a: "Kontrollo nëse ka", b: "rënë në pult" },
  ];
  return (
    <svg viewBox="0 0 480 290" role="img" aria-label="Diagramë" className={styles.svg}>
      <rect x="150" y="8" width="180" height="40" rx="8" className={styles.accentFill} />
      <text x="240" y="33" className={cx(styles.txtB, styles.mid)}>Drita nuk ndizet</text>
      <path d="M240 48 V70 M80 70 H400 M80 70 V92 M240 70 V92 M400 70 V92" className={styles.ln} />
      {boxes.map((b) => (
        <g key={b.n}>
          <rect x={b.x} y="92" width="140" height="84" rx="8" className={styles.glass} />
          <Dot x={b.x + 14} y={92} n={b.n} />
          <text x={b.x + 70} y="124" className={cx(styles.txtB, styles.mid)}>{b.t}</text>
          <text x={b.x + 70} y="146" className={cx(styles.txtS, styles.mid)}>{b.a}</text>
          <text x={b.x + 70} y="162" className={cx(styles.txtS, styles.mid)}>{b.b}</text>
        </g>
      ))}
      <path d="M80 176 V200 M240 176 V200 M400 176 V200 M80 200 H400 M240 200 V222" className={styles.ln} />
      <rect x="110" y="222" width="260" height="52" rx="8" className={styles.soft} />
      <text x="240" y="244" className={cx(styles.txtB, styles.mid)}>Ende asgjë? Mos hap kutinë.</text>
      <text x="240" y="263" className={cx(styles.txtS, styles.mid)}>Thirr elektricist.</text>
    </svg>
  );
}

function WiringSvg() {
  return (
    <svg viewBox="0 0 480 250" role="img" aria-label="Skemë" className={styles.svg}>
      <path d="M30 70 H168" className={styles.wBrown} />
      <path d="M232 70 H420 V86" className={styles.wBrown} />
      <path d="M30 170 H420 V134" className={styles.wBlue} />
      <circle cx="168" cy="70" r="5" className={styles.dotFill} />
      <circle cx="232" cy="70" r="5" className={styles.dotFill} />
      <path d="M168 70 L222 44" className={styles.ln} strokeWidth="3" />
      <circle cx="420" cy="110" r="24" className={styles.glass} />
      <path d="M403 93 L437 127 M437 93 L403 127" className={styles.ln} />
      <text x="36" y="56" className={styles.txt}>Faza (L)</text>
      <text x="36" y="156" className={styles.txt}>Zero (N)</text>
      <text x="200" y="98" className={cx(styles.txt, styles.mid)}>Çelësi</text>
      <text x="382" y="115" className={cx(styles.txt, styles.end)}>Llamba</text>
      <Dot x={100} y={70} n={1} />
      <Dot x={200} y={36} n={2} />
      <Dot x={300} y={170} n={3} />
      <Dot x={462} y={110} n={4} />
      <rect x="20" y="214" width="22" height="9" rx="2" fill="#8A5A2B" />
      <text x="48" y="223" className={styles.txtS}>Faza: kafe ose e zezë</text>
      <rect x="196" y="214" width="22" height="9" rx="2" fill="#2F6FDE" />
      <text x="224" y="223" className={styles.txtS}>Zero: blu</text>
      <rect x="318" y="214" width="22" height="9" rx="2" fill="#2E9B4F" />
      <rect x="318" y="217" width="22" height="3" fill="#F2D000" />
      <text x="346" y="223" className={styles.txtS}>Toka: jeshile-verdhë</text>
    </svg>
  );
}

function PanelSvg() {
  const names = ["Drita", "Priza", "Kuzhina", "Bojleri", "Furra", "Ngrohja"];
  const state = ["on", "trip", "on", "on", "off", "on"];
  const toggleY = { on: 46, off: 98, trip: 72 };
  const toggleClass = { on: styles.soft, off: styles.glass, trip: styles.accentFill };

  return (
    <svg viewBox="0 0 480 200" role="img" aria-label="Pult siguresash" className={styles.svg}>
      <rect x="30" y="14" width="420" height="172" rx="10" className={styles.glass} />
      <rect x="52" y="40" width="64" height="100" rx="6" className={styles.glass} />
      <rect x="68" y="52" width="32" height="40" rx="4" className={styles.soft} />
      <text x="84" y="162" className={cx(styles.txtS, styles.mid)}>Kryesorja</text>
      <Dot x={84} y={30} n={1} />
      {names.map((name, i) => {
        const x = 140 + i * 50;
        return (
          <g key={name}>
            <rect x={x} y="40" width="40" height="100" rx="5" className={styles.glass} />
            <rect x={x + 8} y={toggleY[state[i]]} width="24" height="36" rx="4" className={toggleClass[state[i]]} />
            <text x={x + 20} y="162" className={cx(styles.txtS, styles.mid)}>{name}</text>
          </g>
        );
      })}
      <Dot x={210} y={30} n={2} />
    </svg>
  );
}

function TapSvg() {
  const parts = [
    { n: 1, y: 37, x: 200, label: "Doreza", lx: 296 },
    { n: 2, y: 80, x: 214, label: "Kapaku i vidës", lx: 282 },
    { n: 3, y: 116, x: 204, label: "Dadoja", lx: 292 },
    { n: 4, y: 180, x: 220, label: "Kartuça", lx: 272 },
    { n: 5, y: 214, x: 216, label: "Unaza (O-ring)", lx: 272 },
    { n: 6, y: 264, x: 186, label: "Trupi i rubinetit", lx: 372 },
  ];
  return (
    <svg viewBox="0 0 480 290" role="img" aria-label="Rubinet" className={styles.svg}>
      <path d="M240 6 V282" className={styles.dash} />
      <path d="M196 16 H284 L272 58 H208 Z" className={styles.accentFill} />
      <rect x="214" y="72" width="52" height="16" rx="4" className={styles.glass} />
      <rect x="204" y="104" width="72" height="24" rx="4" className={styles.glass} />
      <rect x="232" y="138" width="16" height="12" className={styles.glass} />
      <rect x="220" y="150" width="40" height="60" rx="4" className={styles.soft} />
      <path d="M220 168 H260 M220 186 H260" className={styles.ln} />
      <ellipse cx="240" cy="214" rx="24" ry="5" className={styles.oring} />
      <path d="M186 232 H294 V246 H340 Q360 246 360 268 V282 H186 Z" className={styles.glass} />
      {parts.map((p) => (
        <g key={p.n}>
          <path d={`M176 ${p.y} H${p.x - 6}`} className={styles.dash} />
          <Dot x={165} y={p.y} n={p.n} />
          <text x={p.lx} y={p.y + 4} className={styles.txt}>{p.label}</text>
        </g>
      ))}
    </svg>
  );
}

function TrapSvg() {
  const pipe = "M135 34 V140 Q135 206 190 206 Q245 206 245 140 V110 H360";
  return (
    <svg viewBox="0 0 480 260" role="img" aria-label="Sifoni" className={styles.svg}>
      <rect x="60" y="14" width="150" height="20" rx="6" className={styles.glass} />
      <rect x="360" y="70" width="24" height="80" className={styles.glass} />
      <path d={pipe} className={styles.pipeOuter} />
      <path d={pipe} className={styles.pipeInner} />
      <path d="M135 140 Q135 206 190 206 Q245 206 245 140" className={styles.pipeWater} />
      <path d="M170 206 q6 -9 12 0 t12 0 t12 0" className={styles.ln} />
      <rect x="178" y="226" width="24" height="14" rx="3" className={styles.accentFill} />
      <Dot x={225} y={24} n={1} />
      <Dot x={170} y={80} n={2} />
      <Dot x={285} y={180} n={3} />
      <Dot x={225} y={233} n={4} />
      <Dot x={300} y={84} n={5} />
    </svg>
  );
}

function CisternSvg() {
  return (
    <svg viewBox="0 0 480 270" role="img" aria-label="Cisterna" className={styles.svg}>
      <rect x="90" y="30" width="300" height="200" rx="10" className={styles.glass} />
      <rect x="92" y="92" width="296" height="136" className={styles.water} />
      <path d="M92 92 q18 -8 37 0 t37 0 t37 0 t37 0 t37 0 t37 0 t37 0 t37 0" className={styles.waveLn} />
      <text x="252" y="112" className={styles.txtS}>Niveli i ujit</text>
      <rect x="200" y="8" width="80" height="14" rx="5" className={styles.glass} />
      <path d="M240 30 V204" className={styles.dash} />
      <rect x="320" y="80" width="16" height="142" rx="3" className={styles.glass} />
      <rect x="120" y="70" width="16" height="152" rx="3" className={styles.glass} />
      <path d="M136 78 L176 90" className={styles.ln} strokeWidth="3" />
      <circle cx="190" cy="92" r="14" className={styles.accentFill} />
      <ellipse cx="240" cy="218" rx="30" ry="8" className={styles.accentFill} />
      <rect x="208" y="224" width="64" height="6" className={styles.glass} />
      <Dot x={190} y={62} n={1} />
      <Dot x={128} y={54} n={2} />
      <Dot x={240} y={252} n={3} />
      <Dot x={362} y={100} n={4} />
      <Dot x={262} y={60} n={5} />
    </svg>
  );
}

const FIGURES = {
  bulbs: { Svg: BulbsSvg, title: "Llojet e bazës së llambës", caption: "Para se të blesh llambë të re, krahaso bazën me atë të vjetrën.", legend: ["E27: fileto e madhe", "E14: fileto e vogël", "GU10: dy kunja"] },
  flow: { Svg: FlowSvg, title: "Ku të kërkosh shkakun", caption: "Ndiq kutitë nga e majta në të djathtë.", legend: ["Llamba", "Çelësi dhe prizat", "Siguresa"] },
  wiring: { Svg: WiringSvg, title: "Lidhja çelës dhe llambë", caption: "Skema më e thjeshtë.", legend: ["Faza (L)", "Çelësi", "Zeroja (N)", "Llamba"] },
  panel: { Svg: PanelSvg, title: "Pulti i siguresave", caption: "Ndërprerësi lart është i ndezur.", legend: ["Siguresa kryesore", "Siguresa e rënë"] },
  tap: { Svg: TapSvg, title: "Pamje e shpërndarë", caption: "Pjesët renditen sipas rendit që i heq.", legend: ["Doreza", "Kapaku", "Dadoja", "Kartuça", "Unazat", "Trupi"] },
  trap: { Svg: TrapSvg, title: "Brenda sifonit", caption: "Prerje anësore.", legend: ["Lavamani", "Tubi", "Sifoni", "Tapa", "Kanalizimi"] },
  cistern: { Svg: CisternSvg, title: "Brenda cisternës", caption: "Pesë pjesë të vogla.", legend: ["Plutuesi", "Valvula", "Kapaku", "Tubi", "Zinxhiri"] },
};

function Figure({ id }) {
  const f = FIGURES[id];
  if (!f) return null;
  const { Svg } = f;
  return (
    <figure className={styles.figure}>
      <Svg />
      <figcaption className={styles.figCaption}>
        <strong>{f.title}</strong>
        <p>{f.caption}</p>
        <ul className={styles.legend}>
          {f.legend.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/*  Komponentët e Faqes                                               */
/* ------------------------------------------------------------------ */

function GuideCard({ g }) {
  return (
    <Link to={guidePath(g)} className={styles.card}>
      <h3 className={styles.cardTitle}>{g.title}</h3>
      <p className={styles.cardText}>{g.summary}</p>
      <ul className={styles.meta}>
        <li className={styles.chip}>{g.time}</li>
        <li className={styles.chip}>{g.level}</li>
      </ul>
    </Link>
  );
}

function Article({ guide, siblings }) {
  const [done, setDone] = useState(() => new Set());
  const total = guide.steps.length;
  const pct = Math.round((done.size / total) * 100);
  const cat = CATEGORIES.find((c) => c.id === guide.category);
  const idx = siblings.findIndex((g) => g.slug === guide.slug);
  const prev = siblings[idx - 1];
  const next = siblings[idx + 1];

  const toggle = (i) =>
    setDone((s) => {
      const n = new Set(s);
      n.has(i) ? n.delete(i) : n.add(i);
      return n;
    });

  return (
    <article className={styles.article}>
      <nav aria-label="Rruga" className={styles.crumbs}>
        <Link to={BASE}>Udhëzues</Link>
        <Link to={`${BASE}/${cat.id}`}>{cat.label}</Link>
      </nav>

      <h1 className={styles.articleTitle}>{guide.title}</h1>
      <p className={styles.lede}>{guide.summary}</p>

      <ul className={styles.meta} style={{ marginBottom: "28px" }}>
        <li className={styles.chip}>{guide.time}</li>
        <li className={styles.chip}>{guide.level}</li>
        <li className={styles.chip}>{total} hapa</li>
      </ul>

      <div className={styles.warning} role="note">
        <div>
          <strong className={styles.warningTitle}>Siguria para së gjithash</strong>
          <p>{guide.warning}</p>
        </div>
      </div>

      <section className={styles.block}>
        <h2 className={styles.blockTitle}>Çfarë të duhet</h2>
        <ul className={styles.tools}>
          {guide.tools.map((t) => (
            <li key={t} className={styles.tool}>{t}</li>
          ))}
        </ul>
      </section>

      <Figure id={guide.figure} />

      <section className={styles.block}>
        <h2 className={styles.blockTitle}>Hapat</h2>
        <div className={styles.progress} role="progressbar" aria-label="Hapat e kryer" aria-valuemin={0} aria-valuemax={total} aria-valuenow={done.size}>
          <span className={styles.progressBar} style={{ width: `${pct}%` }} />
        </div>
        <p className={styles.progressText}>{done.size} nga {total} hapa të kryer</p>

        <ol className={styles.steps}>
          {guide.steps.map(([t, d], i) => {
            const id = `${guide.slug}-${i}`;
            return (
              <li key={id} className={cx(styles.step, done.has(i) && styles.stepDone)}>
                <span className={styles.stepNum} aria-hidden="true">{i + 1}</span>
                <div>
                  <h3 className={styles.stepTitle}>{t}</h3>
                  <p>{d}</p>
                  <label className={styles.check} htmlFor={id}>
                    <input id={id} type="checkbox" checked={done.has(i)} onChange={() => toggle(i)} />
                    E kam bërë
                  </label>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section className={styles.block}>
        <h2 className={styles.blockTitle}>Këshilla</h2>
        <ul className={styles.tips}>
          {guide.tips.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>

      <aside className={styles.pro}>
        <h2 className={styles.proTitle}>Kur duhet të thërrasësh specialist</h2>
        <p>{guide.pro}</p>
        {cat.cta && (
          <Link to={cat.cta.to} className={cx(styles.btn, styles.btnAccent)}>
            {cat.cta.label}
          </Link>
        )}
      </aside>

      <nav className={styles.pager} aria-label="Udhëzues të tjerë">
        {prev ? (
          <Link to={guidePath(prev)} className={styles.pagerLink}>
            <span>Më parë</span>
            {prev.title}
          </Link>
        ) : <span />}
        {next && (
          <Link to={guidePath(next)} className={cx(styles.pagerLink, styles.pagerNext)}>
            <span>Më pas</span>
            {next.title}
          </Link>
        )}
      </nav>
    </article>
  );
}

function FactsGrid() {
  return (
    <section>
      <h2 className={styles.sectionTitle}>Fakte interesante</h2>
      <div className={styles.factGrid}>
        {FACTS.map((f) => (
          <div key={f.title} className={styles.fact} data-cat={f.tag}>
            <p className={styles.factStat}>{f.stat}</p>
            <h3 className={styles.cardTitle}>{f.title}</h3>
            <p className={styles.cardText}>{f.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Hub() {
  return (
    <section>
      <h2 className={styles.sectionTitle}>Zgjidh një temë</h2>
      <div className={styles.catGrid}>
        {CATEGORIES.map((c) => {
          const count = c.id === "fakte" ? FACTS.length : GUIDES.filter((g) => g.category === c.id).length;
          return (
            <Link key={c.id} to={`${BASE}/${c.id}`} className={styles.catCard} data-cat={c.id}>
              <h3 className={styles.cardTitle}>{c.label}</h3>
              <p className={styles.cardText}>{c.blurb}</p>
              <ul className={styles.meta}>
                <li className={styles.chip}>{count} {c.id === "fakte" ? "fakte" : "udhëzues"}</li>
              </ul>
            </Link>
          );
        })}
      </div>
      <h2 className={styles.sectionTitle}>Të gjithë udhëzuesit</h2>
      <div className={styles.cards}>
        {GUIDES.map((g) => (
          <GuideCard key={g.slug} g={g} />
        ))}
      </div>
    </section>
  );
}

function CategoryIndex({ cat, guides }) {
  return (
    <section>
      <h1 className={styles.articleTitle}>{cat.label}</h1>
      <p className={styles.lede}>{cat.blurb}</p>
      <div className={styles.cards}>
        {guides.map((g) => (
          <GuideCard key={g.slug} g={g} />
        ))}
      </div>
    </section>
  );
}

function NotFound() {
  return (
    <section className={styles.notFound}>
      <h1 className={styles.articleTitle}>Kjo faqe nuk u gjet</h1>
      <p className={styles.lede}>Udhëzuesi që kërkon mund të jetë zhvendosur ose nuk ekziston më.</p>
      <Link to={BASE} className={styles.btn}>Shiko të gjithë udhëzuesit</Link>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Faqja kryesore e rrugës /udhezues                                 */
/* ------------------------------------------------------------------ */

export default function Udhezues() {
  const { category, slug } = useParams();
  const [q, setQ] = useState("");

  const cat = CATEGORIES.find((c) => c.id === category);
  const guide = slug ? GUIDES.find((g) => g.slug === slug && g.category === category) : null;
  const invalid = Boolean((category && !cat) || (slug && !guide));
  const catGuides = cat ? GUIDES.filter((g) => g.category === cat.id) : [];

  const results = useMemo(() => {
    const n = normalize(q.trim());
    if (!n) return null;
    return GUIDES.filter((g) => normalize(`${g.title} ${g.summary}`).includes(n));
  }, [q]);

  let meta;
  if (invalid) {
    meta = { title: "Faqja nuk u gjet | Gjejnjerin", description: "Kjo faqe nuk ekziston.", path: BASE, noindex: true };
  } else if (guide) {
    meta = {
      title: `${guide.title} | Gjejnjerin`,
      description: guide.summary,
      path: guidePath(guide),
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: guide.title,
        description: guide.summary,
        inLanguage: "sq",
        mainEntityOfPage: SITE + guidePath(guide),
        publisher: { "@type": "Organization", name: "Gjejnjerin", url: SITE },
      },
    };
  } else if (cat) {
    meta = { title: `${cat.label}: udhëzues praktikë | Gjejnjerin`, description: cat.blurb, path: `${BASE}/${cat.id}` };
  } else {
    meta = {
      title: "Udhëzues për shtëpinë: elektrike dhe hidraulikë | Gjejnjerin",
      description: "Udhëzues hap pas hapi për punë të vogla në shtëpi.",
      path: BASE,
    };
  }

  usePageMeta(meta);

  // Show sidebar whenever we are in a valid category or article view (except 'fakte' or active search)
  const showSidebar = Boolean(cat && cat.id !== "fakte" && !q.trim() && !invalid);

  let content;
  if (results) {
    content = (
      <section>
        <h2 className={styles.sectionTitle}>Rezultatet për «{q.trim()}»</h2>
        {results.length ? (
          <div className={styles.cards}>
            {results.map((g) => (
              <GuideCard key={g.slug} g={g} />
            ))}
          </div>
        ) : (
          <p className={styles.lede}>Nuk gjetëm asnjë udhëzues. Provo një fjalë tjetër.</p>
        )}
      </section>
    );
  } else if (invalid) {
    content = <NotFound />;
  } else if (guide) {
    content = <Article key={guide.slug} guide={guide} siblings={catGuides} />;
  } else if (cat && cat.id === "fakte") {
    content = <FactsGrid />;
  } else if (cat) {
    content = <CategoryIndex cat={cat} guides={catGuides} />;
  } else {
    content = <Hub />;
  }

  return (
    <div className={styles.page} data-cat={cat ? cat.id : "elektrike"}>
      <div className={styles.tape} aria-hidden="true" />
      <header className={styles.hero}>
        <Link to="/">
          <img src={Logo} alt="Logo" />
        </Link>
        <h1 className={styles.title}>Udhëzues për shtëpinë</h1>
        <p className={styles.heroLede}>
          Hap pas hapi, me skema të qarta: si ta rregullosh vetë punën e vogël dhe kur ia vlen të thërrasësh specialist.
        </p>
        <div className={styles.search} role="search">
          <label htmlFor="udhezues-search" className={styles.srOnly}>Kërko udhëzues</label>
          <input
            id="udhezues-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Kërko, për shembull «llambë» ose «rubinet»"
          />
        </div>
      </header>

      <nav className={styles.tabs} aria-label="Kategoritë">
        <Link to={BASE} className={cx(styles.tab, !cat && styles.tabActive)} aria-current={!cat ? "page" : undefined}>
          Të gjitha
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c.id}
            to={`${BASE}/${c.id}`}
            className={cx(styles.tab, cat && cat.id === c.id && styles.tabActive)}
            aria-current={cat && cat.id === c.id ? "page" : undefined}
            data-cat={c.id}
          >
            {c.label}
          </Link>
        ))}
      </nav>

      {/* Main Wide Layout with Persistent Sidebar */}
      <div className={cx(styles.layout, showSidebar && styles.layoutSide)}>
        {showSidebar && (
          <aside className={styles.sidebar} aria-label={`Udhëzues ${cat.label}`}>
            <p className={styles.sideTitle}>{cat.label}</p>
            <ul className={styles.sideList}>
              {catGuides.map((g) => (
                <li key={g.slug}>
                  <Link
                    to={guidePath(g)}
                    className={cx(
                      styles.sideLink,
                      guide && guide.slug === g.slug && styles.sideLinkActive
                    )}
                    aria-current={guide && guide.slug === g.slug ? "page" : undefined}
                  >
                    <span>{g.title}</span>
                    <span className={styles.sideTime}>{g.time}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        )}
        <main className={styles.main}>{content}</main>
      </div>

      <section className={styles.band}>
        <div>
          <h2 className={styles.bandTitle}>Nuk e bën dot vetë?</h2>
          <p>Gjej një profesionist në qytetin tënd dhe krahaso përvojën e tyre.</p>
        </div>
        <div className={styles.bandBtns}>
          <Link to={ROUTES.electricians} className={cx(styles.btn, styles.btnAmber)}>
            Gjej elektricistë
          </Link>
          <Link to={ROUTES.plumbers} className={cx(styles.btn, styles.btnTeal)}>
            Gjej hidraulikë
          </Link>
        </div>
      </section>
    </div>
  );
}