
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { MODEL_NAME } from "../constants";
import { CentroEducativo, PlanEstrategicoMejora, AsebetetzeMailaEmaitza, PalankenEmaitza, EmaitzaAkademikoa, DocumentData, AmiaAnalisis, HelburuZehaztua, AkademikoaUrtea } from "../types";

// Generates suggestions for the Plan Estratégico de Mejora (PEM).
export const generatePEMSuggestions = async (
  centro: CentroEducativo,
  satisfaction: AsebetetzeMailaEmaitza
): Promise<{ process: string; objective_target: number }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Jardun ezazu ERALDATZEN programako hezkuntza-aholkulari gisa.
    
    Ikastetxea: ${centro.nombre}
    Mota: ${centro.eskola_mota}
    
    Zeregina:
    Idatzi Hobekuntza Planaren (HP) 'Prestatze Prozesuaren' deskribapena euskaraz.
    Era berean, proposatu 'Helburua 1' (Helburuaren Emaitza) errealista bat.
    
    Erantzun JSON formatuan:
    { "process": string, "objective_target": number }
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            process: { type: Type.STRING },
            objective_target: { type: Type.NUMBER },
          },
          required: ["process", "objective_target"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Error:", error);
    return { process: "Errorea iradokizunak sortzean.", objective_target: 0 };
  }
};

/**
 * Analyzes academic Excel files and extracts averages for historical records.
 */
export const extractAcademicDataFromExcel = async (
  base64Data: string,
  mimeType: string,
  stage: 'LH' | 'DBH'
): Promise<Partial<AkademikoaUrtea> | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Aztertu erantsitako Excel fitxategia (ikastetxeko Barne Emaitzak).
    Ikastetxearen etapa: ${stage}.
    
    Zure lana datu hauetatik bataz besteko (media) orokorrak ateratzea da:
    1. Ez-promozionatuak (tasa ehunekotan, 0-100).
    2. Hizkuntza Konpetentzia (0-10 eskala).
    3. Matematika Konpetentzia (0-10 eskala).
    4. Zientzia Konpetentzia (0-10 eskala).
    5. Bizikidetza / Elkarbizitza Indizea (0-10 eskala).

    Garrantzitsua: Bilatu lerro edo zutabeetan "Guztira", "Batazbestekoa", "Media" edo antzeko gako-hitzak.
    Daturik aurkitzen ez baduzu, itzuli null.
    
    Erantzun JSON formatuan:
    {
      "ikasturtea": "string (adib: 2023-2024)",
      "prom": number,
      "hk": number,
      "matematika": number,
      "zientzia": number,
      "bizikidetza": number
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType: mimeType } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ikasturtea: { type: Type.STRING },
            prom: { type: Type.NUMBER, description: "Ez-promozionatuen tasa (%)" },
            hk: { type: Type.NUMBER, description: "Hizkuntza konpetentzia" },
            matematika: { type: Type.NUMBER, description: "Matematika konpetentzia" },
            zientzia: { type: Type.NUMBER, description: "Zientzia konpetentzia" },
            bizikidetza: { type: Type.NUMBER, description: "Bizikidetza indizea" }
          },
          required: ["ikasturtea"]
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    
    return {
      ikasturtea: data.ikasturtea,
      [`prom_${stage.toLowerCase()}`]: data.prom || 0,
      [`hk_${stage.toLowerCase()}`]: data.hk || 0,
      [`matematika_${stage.toLowerCase()}`]: data.matematika || 0,
      [`zientzia_${stage.toLowerCase()}`]: data.zientzia || 0,
      [`bizikidetza_${stage.toLowerCase()}`]: data.bizikidetza || 0
    };
  } catch (error) {
    console.error("Excel Extraction Error:", error);
    return null;
  }
};

// Analyzes the overall school status based on multiple metrics.
export const analyzeSchoolStatus = async (
  centro: CentroEducativo,
  pem: PlanEstrategicoMejora,
  satisfaction: AsebetetzeMailaEmaitza,
  palancas: PalankenEmaitza,
  academic: EmaitzaAkademikoa,
  amia: AmiaAnalisis,
  objectives: HelburuZehaztua[],
  documents?: DocumentData
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Jardun ezazu ERALDATZEN programako hezkuntza-aholkulari aditu gisa.
    Aztertu ikastetxearen egoera datu hauetan oinarrituta eta eman erantzuna EUSKARAZ.
    
    Ikastetxea: ${centro.nombre} (${centro.codigo_centro})
    Garapen Orokorra: ${centro.garapen_orokorra}
    
    Eman laburpen exekutibo bat Markdown formatuan, indarguneak, ahuleziak eta gomendio estrategikoak biltzen dituena.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    return response.text || "Ez da analisirik sortu.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Errorea analisia sortzean.";
  }
};
