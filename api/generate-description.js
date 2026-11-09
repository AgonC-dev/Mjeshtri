import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

if (!getApps().length) {
  initializeApp({
    credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
  });
}

const cities = [
  "Prishtinë",
  "Prizren",
  "Gjakovë",
  "Mitrovicë",
  "Pejë",
  "Ferizaj",
  "Gjilan",

  // Additional municipalities
  "Deçan",
  "Dragash",
  "Drenas",
  "Fushë Kosovë",
  "Istog",
  "Kaçanik",
  "Kamenicë",
  "Klinë",
  "Leposaviq",
  "Lipjan",
  "Malishevë",
  "Novobërdë",
  "Obiliq",
  "Podujevë",
  "Rahovec",
  "Skënderaj",
  "Shtime",
  "Shtërpcë",
  "Suharekë",
  "Viti",
  "Vushtrri",
  "Hani i Elezit",
  "Junik",
  "Mamushë",
  "Graçanicë",
  "Ranillug",
  "Partesh",
  "Kllokot",
  "Zubin Potok",
  "Zveçan",
  "Mitrovicë e Veriut",
];


const categories = [
  'Të gjitha',
  'Instalues',
  'Elektricist',
  'Hidraulik',
  'Hidro',
  'Klima/AC',
  'Plastifikim',
  'Pastrim',
  'Kopshtar',
  'Mekanik',
  'Moler',
  'Murator',
  'Ndërtimtari',
  'Pllakaxhi',
  'Zdrukthëtar',
  'Kulme dhe Tjegulla',
  'Fasada dhe Izolim',
  'Parket dhe Laminat',
  'Dyer dhe Dritare',
  'Auto Ngjyrosje',
  'Saldator',
  'Gips dhe Tavane',
  'Vullkanizer',
  'IT',
  "Tjetër"
];

async function checkAuth(req) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return { error: "UNAUTHORIZED" };
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    return { uid: decodedToken.uid };
  } catch (error) {
    return { error: "INVALID_TOKEN" };
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  const { uid, error } = await checkAuth(req);

  if (!uid) {
    return res.status(401).json({
      success: false,
      message: error === "INVALID_TOKEN" ? "Invalid token" : "Unauthenticated",
    });
  }

  const { name, city, category, yearsExperience, price } = req.body ?? {};

  if (!name || !city || !category) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  // Continue with validation and AI generation
}