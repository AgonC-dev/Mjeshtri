import styles from "../../Udhëzues/Udhezues.module.css"
import { cx } from "../lib/helpers.js";

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

export default function Figure({ id }) {
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
