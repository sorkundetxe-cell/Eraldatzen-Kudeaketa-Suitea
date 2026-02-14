
export interface StreamlitEntry {
  data: string;
  ikastetxea: string;
  erronka: string;
  deskribapena: string;
}

// ... existing interfaces (CentroEducativo, etc.)
export interface CentroEducativo {
  id: number;
  nombre: string;
  codigo_centro: string;
  lurraldea: string; 
  eskola_mota: string; 
  eredua?: string; 
  aholkularia: string; 
  garapen_orokorra: number | null; 
  erronka_nagusia?: string; 
}

export interface TaldeEragileaKidea {
  id: string;
  izena: string;
  kargua: string;
}

export interface PlanEstrategicoMejora {
  centroId: number;
  fecha_inicio: string; 
  descripcion_proceso: string;
  helburua_1: number | null; 
  talde_eragilea?: TaldeEragileaKidea[]; 
}

export interface AsebetetzeMailaEmaitza {
  centroId: number;
  satisfaccion_general_final: number | null;
  ik_0: number | null; ik_1: number | null; ik_2: number | null; ik_3: number | null;
  ikasle_ebidentzia_file?: string; 
  ir_0: number | null; ir_1: number | null; ir_2: number | null; ir_3: number | null;
  irakasle_ebidentzia_file?: string; 
  fa_0: number | null; fa_1: number | null; fa_2: number | null; fa_3: number | null;
  familia_ebidentzia_file?: string; 
}

export type MomentuMota = 'A' | 'B' | 'C';

export interface PalankaMomentuDatuak {
  id: string; 
  palanka: 1 | 2 | 3; 
  momentua: MomentuMota; 
  batezbestekoa_global: number | null; 
  aplikazio_maila: number | null; 
  gauzatze_maila: number | null; 
  inpaktu_maila: number | null; 
  justifikazioa: string; 
  hobekuntza_proposamenak?: string; 
}

export interface PalankenEmaitza {
  centroId: number;
  palanken_batezbestekoa_final: number | null;
  p1_a1_aplikazio: number | null; p1_a1_gauzatze: number | null; p1_a1_inpaktu: number | null;
  p1_ebidentzia_file?: string;
  p1_alcance_alumnado: number | null; p1_alcance_profesorado: number | null; p1_alcance_familias: number | null;
  p2_a1_aplikazio: number | null; p2_a1_gauzatze: number | null; p2_a1_inpaktu: number | null;
  p2_ebidentzia_file?: string;
  p2_alcance_alumnado: number | null; p2_alcance_profesorado: number | null; p2_alcance_familias: number | null;
  p3_a1_aplikazio: number | null; p3_a1_gauzatze: number | null; p3_a1_inpaktu: number | null;
  p3_ebidentzia_file?: string;
  p3_alcance_alumnado: number | null; p3_alcance_profesorado: number | null; p3_alcance_familias: number | null;
  ebaluazio_xehetasunak?: PalankaMomentuDatuak[];
}

export interface AkademikoaUrtea {
  id: string;
  ikasturtea: string; 
  ebidentzia_file?: string;
  prom_lh: number | null; prom_dbh: number | null;
  hk_lh: number | null; hk_dbh: number | null;
  matematika_lh: number | null; matematika_dbh: number | null;
  zientzia_lh: number | null; zientzia_dbh: number | null;
  bizikidetza_lh: number | null; bizikidetza_dbh: number | null;
}

export interface EmaitzaAkademikoa {
  centroId: number;
  prom_final_lh: number | null; prom_final_dbh: number | null;
  hk_a1_lh: number | null; hk_a1_dbh: number | null;
  matematika_a1_lh: number | null; matematika_a1_dbh: number | null;
  zientzia_a1_lh: number | null; zientzia_a1_dbh: number | null;
  bizikidetza_a1_lh: number | null; bizikidetza_a1_dbh: number | null;
  akademikoa_ebidentzia_file?: string;
  erregistro_historikoa: AkademikoaUrtea[];
}

export interface AmiaAnalisis {
  diagnostikoa?: string; 
  indarguneak: string; 
  ahuleziak: string;   
  aukerak: string;     
  mehatxuak: string;   
}

export interface Adierazlea {
  id: string; kodea: string; testua: string; lorpen_maila: number | null; pisua: number | null; oharrak: string;
}

export interface HelburuZehaztua {
  id: string; testua: string; epea: string; adierazleak: Adierazlea[];
}

export interface PalankaDoc {
  id: string; izena: string; url?: string; fitxategia?: string;
}

export interface DocumentData {
  pemText: string; palancasText: string; pemUrl?: string; pemFile?: string; palankakDocs: PalankaDoc[];
}

export type ViewState = 'dashboard' | 'school' | 'satisfaction' | 'palancas' | 'academic' | 'amia' | 'objectives' | 'documents' | 'ai-assistant' | 'help';

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
  aiAnalysis?: string;
}
