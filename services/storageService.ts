
import { 
  CentroEducativo, PlanEstrategicoMejora, AsebetetzeMailaEmaitza, 
  PalankenEmaitza, EmaitzaAkademikoa, AmiaAnalisis, HelburuZehaztua, DocumentData, SchoolData, StreamlitEntry 
} from '../types';
import { 
  MOCK_CENTRO, MOCK_PEM, MOCK_SATISFACTION, MOCK_PALANCAS, MOCK_ACADEMIC, MOCK_AMIA, MOCK_OBJECTIVES,
  DEFAULT_CENTRO, DEFAULT_PEM, DEFAULT_SATISFACTION, DEFAULT_PALANCAS, DEFAULT_ACADEMIC, DEFAULT_AMIA, DEFAULT_DOCUMENTS 
} from '../constants';

const BACKEND_URL = 'https://script.google.com/macros/s/AKfycbxi6wuWF7m1KDZKn8Hd5dwEwYtw_cWs-HADAxG4lNLwOViA1nkUew2PjdS_5ld_dRhQMw/exec';
const DB_KEY = 'ERALDATZEN_DB_V4';

const INITIAL_SCHOOLS_LIST = [
  { code: "000000", name: "ERALDATZEN Eredu Ikastetxea", pin: "0000" },
  { code: "10185", name: "CEIP Abetxuko Ikastola HLHI", pin: "1018" },
  { code: "10514", name: "IES Salburua BHI", pin: "1051" },
  { code: "10342", name: "CEIP Ángel Ganivet-Santa Lucía HLHI", pin: "1034" },
  { code: "10343", name: "CEIP Aranbizkarra ikas komunitatea", pin: "1034" },
  { code: "10080", name: "CEIP Padre Orbiso HLHI", pin: "1008" },
  { code: "10339", name: "CEIP Luis Elejalde-Rogelia de Alvaro HLHI", pin: "1033" },
  { code: "10338", name: "CEIP Lamuza HLHI", pin: "1033" },
  { code: "10076", name: "CEIP Miguel de Cervantes HLHI", pin: "1007" },
  { code: "10020", name: "CEIP Elciego HLHI", pin: "1002" },
  { code: "10041", name: "CEIP Ramiro De Maeztu HLHI", pin: "1004" },
  { code: "10105", name: "CEIP Sta. María De Vitoria HLHI", pin: "1010" },
  { code: "10572", name: "CPI Sansomendi IPI", pin: "1057" },
  { code: "10003", name: "CEIP Zabaleko HLHI", pin: "1000" },
  { code: "10054", name: "CEIP Landazuri Ikastola HLHI", pin: "1005" },
  { code: "12115", name: "CEIP Olamendi HLHI", pin: "1211" },
  { code: "12050", name: "CEIP Urkizu Eskola HLHI", pin: "1205" },
  { code: "12051", name: "CEIP Arrateko Andra Mari HLHI", pin: "1205" },
  { code: "12225", name: "IES Bideberri BHI", pin: "1222" },
  { code: "13522", name: "CEIP Bizarain Ikastola HLHI", pin: "1352" },
  { code: "12188", name: "CEIP Herrera HLHI", pin: "1218" },
  { code: "12150", name: "CPI Karmengo Ama IPI", pin: "1215" },
  { code: "12977", name: "CEIP Leka Enea-Anaka HLHI", pin: "1297" },
  { code: "12777", name: "CEIP Elgoibar HLHI", pin: "1277" },
  { code: "13002", name: "CEIP Belaskoenea HLHI", pin: "1300" },
  { code: "12779", name: "CEIP Ondarreta Herri Eskola HLHI", pin: "1277" },
  { code: "12966", name: "IES Toki Alai BHI", pin: "1296" },
  { code: "12967", name: "IES Hirubide BHI", pin: "1296" },
  { code: "12279", name: "CEIP Fray Andres Urdaneta HLHI", pin: "1227" },
  { code: "12137", name: "CPI Juan Zaragueta Herri Eskola IPI", pin: "1213" },
  { code: "12970", name: "CEIP Plaentxi HLHI", pin: "1297" },
  { code: "12046", name: "CEIP Amaña HLHI", pin: "1204" },
  { code: "12277", name: "CEIP Fleming Herri Eskola HLHI", pin: "1227" },
  { code: "14119", name: "CEIP Gabriel Aresti HLHI", pin: "1411" },
  { code: "14923", name: "CEIP Bermeo San Francisco HLHI", pin: "1492" },
  { code: "15683", name: "CPI Antonio Trueba IPI", pin: "1568" },
  { code: "14087", name: "IES Uribarri BHI", pin: "1408" },
  { code: "14153", name: "CEIP Uribarri HLHI", pin: "1415" },
  { code: "14432", name: "CEIP Kueto HLHI", pin: "1443" },
  { code: "14924", name: "CEIP San Inazio HLHI", pin: "1492" },
  { code: "14471", name: "CEIP Ignacio Aldekoa HLHI", pin: "1447" },
  { code: "15093", name: "IES Ortuella BHI", pin: "1509" },
  { code: "15078", name: "IES Zorroza BHI", pin: "1507" },
  { code: "15074", name: "IES Ibaizabal BHI", pin: "1507" },
  { code: "15724", name: "IES Ellacuria-Zurbaran BHI", pin: "1572" },
  { code: "14426", name: "CEIP Otxartaga HLHI", pin: "1442" },
  { code: "14111", name: "CEIP Cervantes Eskola HLHI", pin: "1411" },
  { code: "14051", name: "CEIP Munoa HLHI", pin: "1405" },
  { code: "14151", name: "CEIP Txurdinaga HLHI", pin: "1415" },
  { code: "14437", name: "CEIP Vista Alegre HLHI", pin: "1443" },
  { code: "14926", name: "CEIP Maestra Emilia Zuza Brun HLHI", pin: "1492" },
  { code: "14191", name: "IES Errekaldeberri BHI", pin: "1419" },
  { code: "15083", name: "IES Astra", pin: "1508" }
];

const getCache = (): Record<string, SchoolData> => {
  try {
    const data = localStorage.getItem(DB_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) { return {}; }
};

const saveToCache = (code: string, data: SchoolData) => {
  const cache = getCache();
  cache[code] = data;
  localStorage.setItem(DB_KEY, JSON.stringify(cache));
};

const generateDefaultSchoolData = (code: string): SchoolData => {
  if (code === "000000") {
    return {
      centro: MOCK_CENTRO, pem: MOCK_PEM, satisfaction: MOCK_SATISFACTION, palancas: MOCK_PALANCAS,
      academic: MOCK_ACADEMIC, amia: MOCK_AMIA, objectives: MOCK_OBJECTIVES, documents: DEFAULT_DOCUMENTS,
      lastUpdated: new Date().toISOString()
    };
  }
  const schoolInfo = INITIAL_SCHOOLS_LIST.find(s => s.code === code);
  return {
    centro: { ...DEFAULT_CENTRO, nombre: schoolInfo?.name || "Ikastetxe Berria", codigo_centro: code },
    pem: DEFAULT_PEM, satisfaction: DEFAULT_SATISFACTION, palancas: DEFAULT_PALANCAS,
    academic: DEFAULT_ACADEMIC, amia: DEFAULT_AMIA, objectives: [], documents: DEFAULT_DOCUMENTS,
    lastUpdated: new Date().toISOString(), password: schoolInfo?.pin || code.slice(-4)
  };
};

async function cloudFetch(params: string) {
  const url = `${BACKEND_URL}?${params}&t=${Date.now()}`;
  try {
    const response = await fetch(url, { method: 'GET', mode: 'cors', cache: 'no-store', redirect: 'follow' }); 
    if (!response.ok) throw new Error(`Status: ${response.status}`);
    const text = await response.text();
    return JSON.parse(text);
  } catch (err) { throw err; }
}

export const getSchoolData = async (code: string): Promise<SchoolData> => {
  if (BACKEND_URL) {
    try {
      const result = await cloudFetch(`action=getAll`);
      if (result.status === 'success' && result.records && result.records[code]) {
        saveToCache(code, result.records[code]);
        return result.records[code];
      }
    } catch (e) {}
  }
  const cache = getCache();
  return cache[code] || generateDefaultSchoolData(code);
};

export const saveSchoolData = async (code: string, data: SchoolData): Promise<void> => {
  saveToCache(code, data);
  if (code === '000000' || !BACKEND_URL) return;
  try {
    await fetch(BACKEND_URL, {
      method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action: 'save', code, data })
    });
  } catch (e) {}
};

export const verifyCredentials = (code: string, pin: string): boolean => {
  const school = INITIAL_SCHOOLS_LIST.find(s => s.code === code);
  if (school && (school.pin === pin || code === pin)) return true;
  const cache = getCache();
  if (cache[code]) {
    const sd = cache[code];
    if (sd.password === pin || sd.centro.codigo_centro === pin) return true;
  }
  return false;
};

// Streamlit Entry-ak jasotzeko balio duen aldagai globala
let lastStreamlitEntries: StreamlitEntry[] = [];

export const getStreamlitEntries = (): StreamlitEntry[] => lastStreamlitEntries;

export const getAllSchools = async (): Promise<SchoolData[]> => {
  const schoolsMap: Record<string, SchoolData> = {};
  INITIAL_SCHOOLS_LIST.forEach(s => { schoolsMap[s.code] = generateDefaultSchoolData(s.code); });
  const cache = getCache();
  Object.keys(cache).forEach(code => { schoolsMap[code] = cache[code]; });

  if (BACKEND_URL) {
    try {
      const result = await cloudFetch(`action=getAll`);
      if (result.status === 'success') {
        if (result.records) {
          Object.keys(result.records).forEach(code => { schoolsMap[code] = result.records[code]; });
          localStorage.setItem(DB_KEY, JSON.stringify(schoolsMap));
        }
        if (result.streamlitEntries) {
          lastStreamlitEntries = result.streamlitEntries;
        }
      }
    } catch (e) {}
  }
  return Object.values(schoolsMap).sort((a, b) => a.centro.nombre.localeCompare(b.centro.nombre));
};

export const pullFromCloud = async (): Promise<void> => { await getAllSchools(); };

export const addManualSchool = async (code: string, name: string): Promise<boolean> => {
  const newData = generateDefaultSchoolData(code);
  newData.centro.nombre = name;
  newData.password = code.slice(-4);
  await saveSchoolData(code, newData);
  return true;
};

export const exportToCSV = async () => {
  const schools = await getAllSchools();
  let csv = "\uFEFFKodea,Izena,Garapen Orokorra,Asebetetzea,Palankak\n";
  schools.forEach(s => {
    csv += `${s.centro.codigo_centro},"${s.centro.nombre}",${s.centro.garapen_orokorra || 0},${s.satisfaction.satisfaccion_general_final || 0},${s.palancas.palanken_batezbestekoa_final || 0}\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `eraldatzen_red.csv`; a.click();
};

export const exportCredentials = () => {
  let text = "IKASTETXEA | KODEA | PIN\n";
  INITIAL_SCHOOLS_LIST.forEach(s => { text += `${s.name} | ${s.code} | ${s.pin}\n`; });
  const blob = new Blob([text], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'credenciales.txt'; a.click();
};

export const backupDatabase = async () => {
  const schools = await getAllSchools();
  const blob = new Blob([JSON.stringify(schools, null, 2)], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `backup_db.json`; a.click();
};
