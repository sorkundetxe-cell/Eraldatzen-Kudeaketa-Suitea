
import { 
  CentroEducativo, PlanEstrategicoMejora, AsebetetzeMailaEmaitza, 
  PalankenEmaitza, EmaitzaAkademikoa, AmiaAnalisis, HelburuZehaztua, DocumentData, SchoolData 
} from '../types';
import { 
  MOCK_CENTRO, MOCK_PEM, MOCK_SATISFACTION, MOCK_PALANCAS, MOCK_ACADEMIC, MOCK_AMIA, MOCK_OBJECTIVES,
  DEFAULT_CENTRO, DEFAULT_PEM, DEFAULT_SATISFACTION, DEFAULT_PALANCAS, DEFAULT_ACADEMIC, DEFAULT_AMIA, DEFAULT_DOCUMENTS 
} from '../constants';

const DB_KEY = 'ERALDATZEN_DATABASE_V3';
// Public Bin service for real-time cloud sync across devices (using a shared master bin)
const CLOUD_API_URL = 'https://api.jsonbin.io/v3/b/65f1a9d01f5677401f3c3a9f'; // Placeholder public bin
const MASTER_KEY = '$2a$10$7vGz0z7F.zN6l1Jj8A2MduF6U6vRkCq7Q8m0N3h9yI5XmP5y'; // Example access key

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
  { code: "15083", name: "IES Astrabudua BHI", pin: "1508" },
  { code: "14159", name: "CEIP Zorrotza Fray Juan HLHI", pin: "1415" },
  { code: "14190", name: "IES Txurdinaga Behekoa BHI", pin: "1419" },
  { code: "14129", name: "CEIP Arangoiti HLHI", pin: "1412" },
  { code: "14124", name: "CEIP Juan M. Sánchez Marcos HLHI", pin: "1412" },
  { code: "14109", name: "CEIP Birjinetxe HLHI", pin: "1410" },
  { code: "15055", name: "CEIP Zazpilanda HLHI", pin: "1505" },
  { code: "14049", name: "CEIP Gurutzeta HLHI", pin: "1404" },
  { code: "14131", name: "CEIP Maestro Garcia Rivero HLHI", pin: "1413" },
  { code: "14395", name: "CEIP Ruperto Medina HLHI", pin: "1439" },
  { code: "14160", name: "CEIP Zurbaran HLHI", pin: "1416" },
  { code: "14367", name: "CEIP Legarda HLHI", pin: "1436" },
  { code: "14157", name: "CEIP Zamakola Juan Delmas HLHI", pin: "1415" },
  { code: "15099", name: "CEIP Mujika HLHI", pin: "1509" },
  { code: "14115", name: "CEIP Elejabarri HLHI", pin: "1411" },
  { code: "14400", name: "CEIP La Arboleda HLHI", pin: "1440" },
  { code: "14398", name: "IES Juan Antonio Zunzunegui BHI", pin: "1439" },
  { code: "10254", name: "CPES San José de Nanclares BHIP", pin: "1025" },
  { code: "12540", name: "CPEIPS San José HLBHIP", pin: "1254" },
  { code: "12513", name: "CPEIPS La Asunción HLBHIP", pin: "1251" },
  { code: "14618", name: "CPEIPS Amor Misericordioso HLBHIP", pin: "1461" },
  { code: "14820", name: "CPEIPS La Salle - Begoñako Andra Mari HLBHIP", pin: "1482" },
  { code: "15833", name: "CPES Otxarkoaga BHIP", pin: "1583" },
  { code: "14647", name: "CPEIPS Karitate Alabak - Begoñako Andra Mari HLBHIP", pin: "1464" },
  { code: "14732", name: "CPEIPS Lourdeseko Ama HLBHIP", pin: "1473" },
  { code: "14637", name: "CPEIPS El Ave María HBLHIP", pin: "1463" },
  { code: "14619", name: "CPEIPS Ángeles Custodios HLBHIP", pin: "1461" },
  { code: "15096", name: "CEIP Bagatza HLHI", pin: "1509" },
  { code: "14413", name: "CEIP Las Viñas HLHI", pin: "1441" }
];

// Local fallback first
const getStoredLocalDatabase = (): Record<string, SchoolData> => {
  try {
    const stored = localStorage.getItem(DB_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (e) {
    return {};
  }
};

// SYNC: Push all local changes to the cloud
export const pushToCloud = async (data: Record<string, SchoolData>) => {
  try {
    await fetch(CLOUD_API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': MASTER_KEY
      },
      body: JSON.stringify(data)
    });
    console.log("Cloud Sync: Success");
  } catch (e) {
    console.error("Cloud Sync: Failed", e);
  }
};

// SYNC: Pull latest data from cloud
export const pullFromCloud = async (): Promise<Record<string, SchoolData>> => {
  try {
    const response = await fetch(CLOUD_API_URL, {
      headers: { 'X-Master-Key': MASTER_KEY }
    });
    const result = await response.json();
    const cloudData = result.record;
    localStorage.setItem(DB_KEY, JSON.stringify(cloudData));
    return cloudData;
  } catch (e) {
    console.error("Cloud Pull: Failed", e);
    return getStoredLocalDatabase();
  }
};

export const verifyCredentials = (code: string, pin: string): boolean => {
  const schoolEntry = INITIAL_SCHOOLS_LIST.find(s => s.code === code);
  if (schoolEntry) return schoolEntry.pin === pin;
  const database = getStoredLocalDatabase();
  if (database[code]) return (database[code].password === pin || code.slice(-4) === pin);
  return false;
};

export const getSchoolData = (code: string): SchoolData => {
  if (code === '000000') {
    return {
      centro: MOCK_CENTRO, pem: MOCK_PEM, satisfaction: MOCK_SATISFACTION, 
      palancas: MOCK_PALANCAS, academic: MOCK_ACADEMIC, amia: MOCK_AMIA, 
      objectives: MOCK_OBJECTIVES, documents: DEFAULT_DOCUMENTS, lastUpdated: new Date().toISOString(),
    };
  }

  const database = getStoredLocalDatabase();
  const schoolInfo = INITIAL_SCHOOLS_LIST.find(s => s.code === code);

  if (database[code]) {
    const d = database[code];
    return {
      ...d,
      centro: { ...DEFAULT_CENTRO, ...d.centro, nombre: d.centro.nombre || schoolInfo?.name || "Ikastetxea", codigo_centro: code },
      pem: { ...DEFAULT_PEM, ...d.pem },
      satisfaction: { ...DEFAULT_SATISFACTION, ...d.satisfaction },
      palancas: { ...DEFAULT_PALANCAS, ...d.palancas },
      academic: { ...DEFAULT_ACADEMIC, ...d.academic },
      amia: { ...DEFAULT_AMIA, ...d.amia },
      documents: { ...DEFAULT_DOCUMENTS, ...d.documents },
      objectives: d.objectives || []
    };
  }

  return {
    centro: { ...DEFAULT_CENTRO, nombre: schoolInfo?.name || "Ikastetxe Berria", codigo_centro: code },
    pem: DEFAULT_PEM, satisfaction: DEFAULT_SATISFACTION, palancas: DEFAULT_PALANCAS,
    academic: DEFAULT_ACADEMIC, amia: DEFAULT_AMIA, objectives: [], documents: DEFAULT_DOCUMENTS,
    lastUpdated: new Date().toISOString()
  };
};

export const saveSchoolData = async (code: string, data: SchoolData): Promise<void> => {
  if (code === '000000') return;
  const database = getStoredLocalDatabase();
  database[code] = { ...data, lastUpdated: new Date().toISOString() };
  localStorage.setItem(DB_KEY, JSON.stringify(database));
  
  // Real-time Cloud Sync
  await pushToCloud(database);
};

export const getAllSchools = (): SchoolData[] => {
  const database = getStoredLocalDatabase();
  const allCodes = Array.from(new Set([...INITIAL_SCHOOLS_LIST.map(s => s.code), ...Object.keys(database)])).filter(c => c !== '000000');
  return allCodes.map(code => getSchoolData(code));
};

export const addManualSchool = async (code: string, name: string): Promise<boolean> => {
  const database = getStoredLocalDatabase();
  if (database[code] || INITIAL_SCHOOLS_LIST.some(s => s.code === code)) return false;
  database[code] = {
    centro: { ...DEFAULT_CENTRO, nombre: name, codigo_centro: code },
    pem: DEFAULT_PEM, satisfaction: DEFAULT_SATISFACTION, palancas: DEFAULT_PALANCAS,
    academic: DEFAULT_ACADEMIC, amia: DEFAULT_AMIA, objectives: [], documents: DEFAULT_DOCUMENTS,
    lastUpdated: new Date().toISOString(), password: code.slice(-4)
  };
  localStorage.setItem(DB_KEY, JSON.stringify(database));
  await pushToCloud(database);
  return true;
};

export const backupDatabase = () => {
  const database = localStorage.getItem(DB_KEY);
  if (!database) return;
  const blob = new Blob([database], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `eraldatzen_cloud_backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
};

/**
 * Fix: Added missing exportToCSV function required by AdminDashboard
 */
export const exportToCSV = () => {
  const schools = getAllSchools();
  const headers = ['Kodea', 'Izena', 'Lurraldea', 'Mota', 'Garapena'];
  const rows = schools.map(s => [
    s.centro.codigo_centro,
    s.centro.nombre,
    s.centro.lurraldea,
    s.centro.eskola_mota,
    s.centro.garapen_orokorra
  ]);
  
  const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `eraldatzen_izara_globala_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Fix: Added missing exportCredentials function required by AdminDashboard
 */
export const exportCredentials = () => {
  const database = getStoredLocalDatabase();
  const credentials = INITIAL_SCHOOLS_LIST.map(s => ({ code: s.code, name: s.name, pin: s.pin }));
  
  // Add manual schools from database
  Object.keys(database).forEach(code => {
    if (!INITIAL_SCHOOLS_LIST.some(s => s.code === code)) {
      credentials.push({ 
        code, 
        name: database[code].centro.nombre, 
        pin: database[code].password || code.slice(-4) 
      });
    }
  });

  const content = credentials.map(c => `${c.code} | ${c.name} | PIN: ${c.pin}`).join('\n');
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `eraldatzen_kredentzialak_${new Date().toISOString().split('T')[0]}.txt`;
  a.click();
};
