
// Derived from core_app/models.py

export interface CentroEducativo {
  id: number;
  nombre: string;
  codigo_centro: string;
  lurraldea: string; // Territorio
  eskola_mota: string; // Tipo de Centro
  eredua?: string; // Modelo Linguistico (A, B, D)
  aholkularia: string; // Asesor/a
  garapen_orokorra: number | null; // Desarrollo General (Decimal)
}

export interface TaldeEragileaKidea {
  id: string;
  izena: string;
  kargua: string;
}

export interface PlanEstrategicoMejora {
  centroId: number;
  fecha_inicio: string; // YYYY-MM-DD
  descripcion_proceso: string;
  helburua_1: number | null; // Helburua 1 Emaitza
  talde_eragilea?: TaldeEragileaKidea[]; // New field for Driving Group
}

export interface AsebetetzeMailaEmaitza {
  centroId: number;
  satisfaccion_general_final: number | null;
  
  // Alumnado
  ik_0: number | null; // Diagnostikoa
  ik_1: number | null; // 1. Urtea
  ik_2: number | null; // 2. Urtea
  ik_3: number | null; // 3. Urtea
  ikasle_ebidentzia_file?: string; 
  
  // Profesorado
  ir_0: number | null; // Diagnostikoa
  ir_1: number | null; // 1. Urtea
  ir_2: number | null; // 2. Urtea
  ir_3: number | null; // 3. Urtea
  irakasle_ebidentzia_file?: string; 
  
  // Familias
  fa_0: number | null; // Diagnostikoa
  fa_1: number | null; // 1. Urtea
  fa_2: number | null; // 2. Urtea
  fa_3: number | null; // 3. Urtea
  familia_ebidentzia_file?: string; 
}

export type MomentuMota = 'A' | 'B' | 'C';

export interface PalankaMomentuDatuak {
  id: string; // unique identifier
  palanka: 1 | 2 | 3; // Palanca number
  momentua: MomentuMota; // 'A' (RdC1A), 'B' (RdC1B), 'C' (RdC1C)
  
  batezbestekoa_global: number | null; // Media Global (0-1)
  aplikazio_maila: number | null; // Nivel de Aplicación (0-1)
  gauzatze_maila: number | null; // Nivel de Ejecución (0-1)
  inpaktu_maila: number | null; // Nivel de Impacto (0-1)
  
  justifikazioa: string; // Justificación / Comentarios
  hobekuntza_proposamenak?: string; // Propuestas de mejora for next course
}

export interface PalankenEmaitza {
  centroId: number;
  palanken_batezbestekoa_final: number | null;
  
  // Palanca 1 - Año 1
  p1_a1_aplikazio: number | null;
  p1_a1_gauzatze: number | null;
  p1_a1_inpaktu: number | null;
  p1_ebidentzia_file?: string;
  // Alcance P1
  p1_alcance_alumnado: number | null;
  p1_alcance_profesorado: number | null;
  p1_alcance_familias: number | null;

  // Palanca 2 - Año 1
  p2_a1_aplikazio: number | null;
  p2_a1_gauzatze: number | null;
  p2_a1_inpaktu: number | null;
  p2_ebidentzia_file?: string;
  // Alcance P2
  p2_alcance_alumnado: number | null;
  p2_alcance_profesorado: number | null;
  p2_alcance_familias: number | null;

  // Palanca 3 - Año 1
  p3_a1_aplikazio: number | null;
  p3_a1_gauzatze: number | null;
  p3_a1_inpaktu: number | null;
  p3_ebidentzia_file?: string;
  // Alcance P3
  p3_alcance_alumnado: number | null;
  p3_alcance_profesorado: number | null;
  p3_alcance_familias: number | null;

  // Detailed Evaluations (RdC1A, B, C)
  ebaluazio_xehetasunak?: PalankaMomentuDatuak[];
}

export interface AkademikoaUrtea {
  id: string;
  ikasturtea: string; // "2023-2024"
  ebidentzia_file?: string;
  
  prom_lh: number | null;
  prom_dbh: number | null;
  
  hk_lh: number | null;
  hk_dbh: number | null;
  
  matematika_lh: number | null;
  matematika_dbh: number | null;
  
  zientzia_lh: number | null;
  zientzia_dbh: number | null;
  
  bizikidetza_lh: number | null;
  bizikidetza_dbh: number | null;
}

export interface EmaitzaAkademikoa {
  centroId: number;
  // Current / Latest Data (kept for Dashboard summary)
  prom_final_lh: number | null;
  prom_final_dbh: number | null;
  hk_a1_lh: number | null;
  hk_a1_dbh: number | null;
  matematika_a1_lh: number | null;
  matematika_a1_dbh: number | null;
  zientzia_a1_lh: number | null;
  zientzia_a1_dbh: number | null;
  bizikidetza_a1_lh: number | null;
  bizikidetza_a1_dbh: number | null;
  akademikoa_ebidentzia_file?: string;

  // History for graphs
  erregistro_historikoa: AkademikoaUrtea[];
}

export interface AmiaAnalisis {
  diagnostikoa?: string; // Diagnóstico general
  indarguneak: string; // Fortalezas
  ahuleziak: string;   // Debilidades
  aukerak: string;     // Oportunidades
  mehatxuak: string;   // Amenazas
}

export interface Adierazlea {
  id: string;
  kodea: string; // Identifier code (e.g., "1.1")
  testua: string; // Indicador description
  lorpen_maila: number | null; // Achievement % (0-100)
  pisua: number | null; // Weight/Ponderation (0-100 or relative)
  oharrak: string; // Notes/Observations
}

export interface HelburuZehaztua {
  id: string;
  testua: string; // Objective description
  epea: string;
  adierazleak: Adierazlea[]; // List of indicators
}

export interface PalankaDoc {
  id: string;
  izena: string;
  url?: string;
  fitxategia?: string;
}

export interface DocumentData {
  // Raw text for AI context (optional copy/paste)
  pemText: string;
  palancasText: string;

  // New structured fields
  pemUrl?: string; // Drive link for PEM
  pemFile?: string; // Filename for uploaded PEM (.doc/.docx)
  
  palankakDocs: PalankaDoc[]; // List of documents for Palancas
}

export type ViewState = 'dashboard' | 'school' | 'satisfaction' | 'palancas' | 'academic' | 'amia' | 'objectives' | 'documents' | 'ai-assistant' | 'help';

export interface AnalysisResult {
  summary: string;
  recommendations: string[];
}

export interface SchoolData {
  centro: CentroEducativo;
  pem: PlanEstrategicoMejora;
  satisfaction: AsebetetzeMailaEmaitza;
  palancas: PalankenEmaitza;
  academic: EmaitzaAkademikoa;
  amia: AmiaAnalisis;
  objectives: HelburuZehaztua[];
  documents: DocumentData;
  lastUpdated: string;
  password?: string;
  aiAnalysis?: string; // New field to store AI analysis
}
