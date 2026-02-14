
import { CentroEducativo, PlanEstrategicoMejora, AsebetetzeMailaEmaitza, PalankenEmaitza, EmaitzaAkademikoa, DocumentData, AmiaAnalisis, HelburuZehaztua } from './types';

// RUBRIC DEFINITIONS FOR PALANCAS (0-1 Scale)
export const PALANKA_RUBRICS = {
  P1: { // Kultura Eraldaketa
    aplikazioa: [
      { value: 0, label: "Hasiera", desc: "Ez dago lidergo talderik ezta eraldaketa planik definituta." },
      { value: 0.33, label: "Diseinua", desc: "Talde Eragilea eratuta dago eta lehen helburu estrategikoak idatzita daude." },
      { value: 0.66, label: "Ezarpena", desc: "Planifikazioa partekatua da eta klaustroaren gehiengoak ezagutzen du." },
      { value: 1.0, label: "Finkatua", desc: "Eraldaketa kultura ikastetxearen identitatearen parte da, egonkorra eta sistematizatua." }
    ],
    gauzatzea: [
      { value: 0, label: "Inexistente", desc: "Ez da ekintza zehatzik burutu kultura aldatzeko." },
      { value: 0.33, label: "Pilotua", desc: "Ekintza isolatuak talde txikietan edo gela bakarretan (boluntarioak)." },
      { value: 0.66, label: "Hedapena", desc: "Egitura berriak (mintegiak, bilerak) etapa guztietan martxan daude." },
      { value: 1.0, label: "Orokorra", desc: "Ikastetxe osoan modu koordinatuan eta erritmo berean gauzatzen da." }
    ],
    inpaktua: [
      { value: 0, label: "Nulu", desc: "Ez da aldaketarik nabari eguneroko harremanetan edo erabakietan." },
      { value: 0.33, label: "Subjektiboa", desc: "Pertzepzio positiboak daude baina datu objektiborik gabe." },
      { value: 0.66, label: "Objektiboa", desc: "Ebidentzia argiak daude (aktak, inkestak) hobekuntza erakusten dutenak." },
      { value: 1.0, label: "Eraldatzailea", desc: "Ikastetxearen funtzionamendua erabat aldatu da, arrakasta frogatua duena." }
    ]
  },
  P2: { // Irakaskuntza-Ikaskuntza
    aplikazioa: [
      { value: 0, label: "Hasiera", desc: "Metodologia tradizionalak soilik erabiltzen dira." },
      { value: 0.33, label: "Diseinua", desc: "Metodologia aktiboen gida orokorra edo dokumentazioa prestatzen hasi da." },
      { value: 0.66, label: "Ezarpena", desc: "Programazioak metodologi berrietara egokitu dira etapa gehienetan." },
      { value: 1.0, label: "Finkatua", desc: "Ebaluazio formatiboa eta metodologia aktiboak erabat txertatuta daude." }
    ],
    gauzatzea: [
      { value: 0, label: "Inexistente", desc: "Gela barruko praktikak ez dira aldatu." },
      { value: 0.33, label: "Pilotua", desc: "Irakasle gutxi batzuk proiektuekin edo kooperatiboarekin hasi gara." },
      { value: 0.66, label: "Hedapena", desc: "Ikastetxearen erdian baino gehiagotan metodologi berriak ohikoak dira." },
      { value: 1.0, label: "Orokorra", desc: "Praktika pedagogikoa koherentea da gela eta irakasle guztien artean." }
    ],
    inpaktua: [
      { value: 0, label: "Nulu", desc: "Ikasleen lorpen mailan edo motibazioan ez dago aldaketarik." },
      { value: 0.33, label: "Hasierakoa", desc: "Ikasleen parte-hartze handiagoa somatzen da gela barruan." },
      { value: 0.66, label: "Nabaria", description: "Emaitza akademikoak eta konpetentzien lorpena hobetu dira." },
      { value: 1.0, label: "Bikaina", desc: "Ikasle guztien inklusioa eta arrakasta nabarmen igo da ebidentziekin." }
    ]
  },
  P3: { // Baliabideak eta Espazioak
    aplikazioa: [
      { value: 0, label: "Hasiera", desc: "Espazioak eta ordutegiak era tradizionalean antolatuta daude." },
      { value: 0.33, label: "Diseinua", desc: "Espazioak berrantolatzeko edo ordutegi malguak egiteko plana dago." },
      { value: 0.66, label: "Ezarpena", desc: "Gela batzuk eraldatu dira eta teknologia txertatu da." },
      { value: 1.0, label: "Finkatua", desc: "Baliabideak (digitalak, fisikoak) pedagogia berrien zerbitzura daude." }
    ],
    gauzatzea: [
      { value: 0, label: "Inexistente", desc: "Ez da aldaketarik egin azpiegituretan." },
      { value: 0.33, label: "Pilotua", desc: "Gela bakarra ('AULA 21') edo txoko bat eraldatu da." },
      { value: 0.66, label: "Hedapena", desc: "Ikastetxeko gune komunak eta gelak erabilera anitzeko bihurtu dira." },
      { value: 1.0, label: "Orokorra", desc: "Baliabide guztiak optimizatuta daude eta era autonomoan erabiltzen dira." }
    ],
    inpaktua: [
      { value: 0, label: "Nulu", desc: "Espazio aldaketak ez du eraginik ikaskuntzan." },
      { value: 0.33, label: "Hasierakoa", desc: "Irakasle eta ikasleek erosotasun handiagoa adierazten dute." },
      { value: 0.66, label: "Nabaria", desc: "Espazioen erabilerak lankidetza eta autonomia bultzatzen duela ikusten da." },
      { value: 1.0, label: "Bikaina", desc: "Inguruneak berak ikaskuntza errazten du eta komunitatean eragin ona du." }
    ]
  }
};

// DEMO SCHOOL DATA (CODE 000000)
export const MOCK_CENTRO: CentroEducativo = {
  id: 1,
  nombre: "ERALDATZEN Eredu Ikastetxea",
  codigo_centro: "000000",
  lurraldea: "Bizkaia",
  eskola_mota: "Publikoa",
  eredua: "D",
  aholkularia: "Sorkunde Etxebarria",
  garapen_orokorra: 8.45,
  erronka_nagusia: "Digitalizazioa"
};

export const MOCK_PEM: PlanEstrategicoMejora = {
  centroId: 1,
  fecha_inicio: "2024-09-02",
  descripcion_proceso: "Ikastetke HP-a Talde Eragileak (Zuzendaritza eta etapa-koordinatzaileak) gidatutako prozesu baten bidez onartu zen. Diagnostikoa klaustro osoko saioetan eta OOG-ren ekarpenekin osatu da, metodologia aktiboen eta inklusibitatearen ardatzean.",
  helburua_1: 8.50,
  talde_eragilea: [
    { id: '1', izena: 'Ainhoa Lasa', kargua: 'Zuzendaria' },
    { id: '2', izena: 'Mikel Goitia', kargua: 'Ikasketa Burua' },
    { id: '3', izena: 'Sonia Arrate', kargua: 'Pedagogi Zuzendaria' }
  ]
};

export const MOCK_SATISFACTION: AsebetetzeMailaEmaitza = {
  centroId: 1,
  satisfaccion_general_final: 8.12,
  ik_0: 6.5, ik_1: 7.2, ik_2: 7.8, ik_3: 8.1,
  ir_0: 7.0, ir_1: 7.5, ir_2: 7.9, ir_3: 8.2,
  fa_0: 7.5, fa_1: 7.8, fa_2: 8.0, fa_3: 8.4
};

export const MOCK_PALANCAS: PalankenEmaitza = {
  centroId: 1,
  palanken_batezbestekoa_final: 3.42,
  p1_a1_aplikazio: 3.8, p1_a1_gauzatze: 3.5, p1_a1_inpaktu: 3.2, p1_ebidentzia_file: "P1_Ebidentzia_A1.pdf",
  p1_alcance_alumnado: 420, p1_alcance_profesorado: 52, p1_alcance_familias: 180,
  p2_a1_aplikazio: 3.2, p2_a1_gauzatze: 3.0, p2_a1_inpaktu: 2.8, p2_ebidentzia_file: "P2_Irakaskuntza_Proiektua.docx",
  p2_alcance_alumnado: 250, p2_alcance_profesorado: 30, p2_alcance_familias: 0,
  p3_a1_aplikazio: 3.9, p3_a1_gauzatze: 3.8, p3_a1_inpaktu: 3.5, p3_ebidentzia_file: "P3_Espazioen_Eraldaketa.xlsx",
  p3_alcance_alumnado: 420, p3_alcance_profesorado: 52, p3_alcance_familias: 400,
  ebaluazio_xehetasunak: [
    {
      id: "P1-A", palanka: 1, momentua: 'A', batezbestekoa_global: 0.77, aplikazio_maila: 1.0, gauzatze_maila: 0.66, inpaktu_maila: 0.66,
      justifikazioa: "Plana diseinatuta dago eta klaustroan aurkeztu da. RdC1A-n irakasleen %70ak formakuntza jaso du dagoeneko.",
      hobekuntza_proposamenak: "Irakasle berrien harrera plana hobetu kultura hau azkarrago ezagutu dezaten."
    },
    {
      id: "P1-B", palanka: 1, momentua: 'B', batezbestekoa_global: 0.88, aplikazio_maila: 1.0, gauzatze_maila: 1.0, inpaktu_maila: 0.66,
      justifikazioa: "Kulturaren hedapena erabatekoa da gela guztietan. Inpaktua neurtzeko tresna berriak aplikatzen starts gara.",
      hobekuntza_proposamenak: "Emaitza kuantitatiboen analisia sakondu hurrengo momenturako."
    },
    {
      id: "P2-A", palanka: 2, momentua: 'A', batezbestekoa_global: 0.55, aplikazio_maila: 0.66, gauzatze_maila: 0.66, inpaktu_maila: 0.33,
      justifikazioa: "PBL metodologiarekin hasi gara LHko 4., 5. eta 6. mailetan. Oraindik lehen pausoak dira.",
      hobekuntza_proposamenak: "DBHrako trantsizioan metodologi hau nola txertatu aztertu behar dugu."
    }
  ]
};

export const MOCK_ACADEMIC: EmaitzaAkademikoa = {
  centroId: 1,
  prom_final_lh: 2.1, prom_final_dbh: 7.8,
  hk_a1_lh: 8.5, hk_a1_dbh: 7.2,
  matematika_a1_lh: 7.9, matematika_a1_dbh: 6.8,
  zientzia_a1_lh: 8.2, zientzia_a1_dbh: 7.1,
  bizikidetza_a1_lh: 9.1, bizikidetza_a1_dbh: 8.4,
  erregistro_historikoa: [
    {
        id: "h1", ikasturtea: "2021-2022", prom_lh: 3.5, prom_dbh: 12.0, hk_lh: 7.8, hk_dbh: 6.5, matematika_lh: 7.2, matematika_dbh: 6.0, zientzia_lh: 7.0, zientzia_dbh: 6.1, bizikidetza_lh: 8.2, bizikidetza_dbh: 7.5
    },
    {
        id: "h2", ikasturtea: "2022-2023", prom_lh: 2.8, prom_dbh: 9.5, hk_lh: 8.1, hk_dbh: 6.9, matematika_lh: 7.5, matematika_dbh: 6.4, zientzia_lh: 7.6, zientzia_dbh: 6.5, bizikidetza_lh: 8.6, bizikidetza_dbh: 7.9
    }
  ]
};

export const MOCK_AMIA: AmiaAnalisis = {
  diagnostikoa: "Ikastetxeak ibilbide solids sendoa du inklusibitatean eta elkarbizitzan, baina erronka nabarmena du DBHko emaitza akademikoak hobetzeko, batez ere STEM arloetan. Komunitatearen asebetetzea gora doa sistematikoki.",
  indarguneak: "- Klaustro egonkorra eta formazioan inplikatua.\n- Elkarbizitza plana eredugarria eta bizikidetza indize altuak.\n- Gela eta espazio berrien erabilera pedagogiko ona (Baliabideen Palanka).",
  ahuleziak: "- DBHko matematikako emaitzak batezbestekotik behera.\n- Familien parte-hartzea zuzendaritza-erabakietan mugatua da.\n- Digitalizazioaren erabilera pedagogikoa ez da homogeneoa irakasle guztien artean.",
  aukerak: "- ERALDATZEN programa eta aholkularitza pertsonalizatua.\n- Eskualdeko enpresekin STEM proiektuak garatzeko aukera.\n- Udalaren diru-laguntzak patioak eraldatzeko.",
  mehatxuak: "- Jaiotze-tasaren beherakada nabarmena inguruan.\n- Ikasleen arteko arrakala digitala etxeetan."
};

export const MOCK_OBJECTIVES: HelburuZehaztua[] = [
  { 
    id: '1', 
    testua: "Metodologia aktiboak (PBL) sistematizatzea LHko eta DBHko ikasgai guztietan.", 
    epea: "2026-06", 
    adierazleak: [
      { id: '1-1', kodea: '1.1', testua: "Proiektuen bidezko programazioak etapa guztietan txertatuta.", lorpen_maila: 85, pisua: 50, oharrak: "LHn %100, DBHn lanean ari gara." },
      { id: '1-2', kodea: '1.2', testua: "Irakasleen %90ak metodologi aktiboetan formakuntza jaso du.", lorpen_maila: 75, pisua: 30, oharrak: "Ikasturte amaierarako lortuko da." },
      { id: '1-3', kodea: '1.3', testua: "Ikasleen asebetetzea metodologi berriekin (8.0tik gora).", lorpen_maila: 90, pisua: 20, oharrak: "Inkestek oso harrera ona erakusten dute." }
    ] 
  },
  { 
    id: '2', 
    testua: "Emaitza akademikoak STEM arloetan %15 hobetzea DBHn.", 
    epea: "2026-06", 
    adierazleak: [
      { id: '2-1', kodea: '2.1', testua: "Matematikako batezbesteko nota 7.0ra igotzea DBHn.", lorpen_maila: 45, pisua: 60, oharrak: "Zailtasun gehien duen puntua da." },
      { id: '2-2', kodea: '2.2', testua: "Zientzia proiektuetan parte hartzen duten ikasle kopurua handitzea.", lorpen_maila: 100, pisua: 40, oharrak: "Zientzia Astea arrakastatsua izan da." }
    ] 
  },
  { 
    id: '3', 
    testua: "Ahozko komunikazioa euskaraz indartzea gune ez-formaletan.", 
    epea: "2025-06", 
    adierazleak: [
      { id: '3-1', kodea: '3.1', testua: "Patioan euskararen erabilera %20 igotzea.", lorpen_maila: 60, pisua: 70, oharrak: "Behaketa bidez neurtuta." },
      { id: '3-2', kodea: '3.2', testua: "Euskararen Eguneko ekintzen partaidetza gune ez-formaletan.", lorpen_maila: 100, pisua: 30, oharrak: "Helburua erabat lortuta." }
    ] 
  },
  { 
    id: '4', 
    testua: "Ikastetxeako espazioak ebaluazio formatibora eta lankidetzara egokitzea.", 
    epea: "2025-06", 
    adierazleak: [
      { id: '4-1', kodea: '4.1', testua: "Gela eraldatuen kopurua (Espazio malguak).", lorpen_maila: 70, pisua: 50, oharrak: "Solairu bat osatuta." },
      { id: '4-2', kodea: '4.2', testua: "Espazio berrien erabilera ordu kopurua astean.", lorpen_maila: 85, pisua: 50, oharrak: "Ordutegiak ondo egokitu dira." }
    ] 
  }
];

export const MOCK_AI_ANALYSIS = `
# ERALDATZEN Diagnostiko Estrategikoa: 000000

Ikastetxearen egoera oso sendoa da, batez ere **Garapen Orokorreko (8.45)** eta **Palanken (3.42)** adierazleak kontuan hartuta. Hobekuntza-planaren eboluzioa positiboa da, asebetetze mailak goranzko joera argia erakusten baitu komunitateko hiru estamentuetan.

## **Puntu Nabarmentzekoak**
- **Baliabideak eta Espazioak (P3)**: Puntuaziorik altuena duen palanka da (3.9 aplikazioan). Espazioen eraldaketa pedagogikoa arrakastatsua izan da.
- **Elkarbizitza**: 9.1eko indizea LHn eta 8.4koa DBHn oso altuak dira, ikastetxearen segurtasun eta inklusio giroa berresten dutenak.
- **Digitalizazioa**: Dokumentazioan aipatzen denez, IKTak erabat integratuta daude kudeaketan.

## **Arreta Eremuak**
- **STEM Arrakala**: DBHko matematikako emaitzak (6.8) ahulezia garrantzitsu bat dira, AMIAk ondo detektatu duena. P2 (Irakaskuntza) palankak hemen eragin behar du gehiago.
- **Ponderazioa eta Helburuak**: Helburua 2 (STEM hobetzea) lorpen-maila baxuena duena da (%45), eta arreta berezia behar du RdC1C momentuan.

## **Ekintza Estrategikoak**
1. **STEM Metodologiak**: PBL metodologia (H1) bereziki matematika eta zientzia arloetara bideratu DBHn (H2), emaitza akademikoak igotzeko.
2. **Familien Partaidetza**: AMIAk dioen bezala partaidetza txikia bada, baliatu patioen eraldaketa (H4) gurasoen auzolan saioak antolatzeko eta komunitatea sendotzeko.
3. **Ebaluazio Formatiboa**: P2 palankaren jarraipenean (RdC1B) agertzen denez, ebaluazio formatiborako tresnak digitalizatzea (H1.3) gomendatzen da arrakala digitalari aurre egiteko.
`;

export const DEFAULT_CENTRO: CentroEducativo = { id: 0, nombre: "Ikastetxe Berria", codigo_centro: "", lurraldea: "", eskola_mota: "", eredua: "", aholkularia: "", garapen_orokorra: 0, erronka_nagusia: "" };
export const DEFAULT_PEM: PlanEstrategicoMejora = { centroId: 0, fecha_inicio: new Date().toISOString().split('T')[0], descripcion_proceso: "", helburua_1: 0, talde_eragilea: [] };
export const DEFAULT_SATISFACTION: AsebetetzeMailaEmaitza = { centroId: 0, satisfaccion_general_final: 0, ik_0: 0, ik_1: 0, ik_2: 0, ik_3: 0, ikasle_ebidentzia_file: "", ir_0: 0, ir_1: 0, ir_2: 0, ir_3: 0, irakasle_ebidentzia_file: "", fa_0: 0, fa_1: 0, fa_2: 0, fa_3: 0, familia_ebidentzia_file: "" };
export const DEFAULT_PALANCAS: PalankenEmaitza = { centroId: 0, palanken_batezbestekoa_final: 0, p1_a1_aplikazio: 0, p1_a1_gauzatze: 0, p1_a1_inpaktu: 0, p1_ebidentzia_file: "", p1_alcance_alumnado: 0, p1_alcance_profesorado: 0, p1_alcance_familias: 0, p2_a1_aplikazio: 0, p2_a1_gauzatze: 0, p2_a1_inpaktu: 0, p2_ebidentzia_file: "", p2_alcance_alumnado: 0, p2_alcance_profesorado: 0, p2_alcance_familias: 0, p3_a1_aplikazio: 0, p3_a1_gauzatze: 0, p3_a1_inpaktu: 0, p3_ebidentzia_file: "", p3_alcance_alumnado: 0, p3_alcance_profesorado: 0, p3_alcance_familias: 0, ebaluazio_xehetasunak: [] };
export const DEFAULT_ACADEMIC: EmaitzaAkademikoa = { centroId: 0, prom_final_lh: 0, prom_final_dbh: 0, hk_a1_lh: 0, hk_a1_dbh: 0, matematika_a1_lh: 0, matematika_a1_dbh: 0, zientzia_a1_lh: 0, zientzia_a1_dbh: 0, bizikidetza_a1_lh: 0, bizikidetza_a1_dbh: 0, akademikoa_ebidentzia_file: "", erregistro_historikoa: [] };
export const DEFAULT_AMIA: AmiaAnalisis = { diagnostikoa: "", indarguneak: "", ahuleziak: "", aukerak: "", mehatxuak: "" };
export const DEFAULT_DOCUMENTS: DocumentData = { pemText: '', palancasText: '', pemUrl: '', pemFile: '', palankakDocs: [] };

export const MODEL_NAME = 'gemini-3-flash-preview';
