
import React, { useState, useEffect } from 'react';
import { CentroEducativo, PlanEstrategicoMejora, AsebetetzeMailaEmaitza, PalankenEmaitza, EmaitzaAkademikoa, DocumentData, AmiaAnalisis, HelburuZehaztua, SchoolData } from '../types';
import { analyzeSchoolStatus } from '../services/geminiService';
import { generateAIReport, generateWordReport } from '../services/reportService';
import { Bot, Loader2, Sparkles, FileText, FileDown, Save, BarChart4 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface GeminiAssistantProps {
  centro: CentroEducativo;
  pem: PlanEstrategicoMejora;
  satisfaction: AsebetetzeMailaEmaitza;
  palancas: PalankenEmaitza;
  academic: EmaitzaAkademikoa;
  amia: AmiaAnalisis;
  objectives: HelburuZehaztua[];
  documents: DocumentData;
  aiAnalysis: string;
  onAnalysisUpdate: (analysis: string) => void;
}

const GeminiAssistant: React.FC<GeminiAssistantProps> = (props) => {
  const { centro, pem, satisfaction, palancas, academic, amia, objectives, documents, aiAnalysis, onAnalysisUpdate } = props;
  const [loading, setLoading] = useState(false);
  const [localAnalysis, setLocalAnalysis] = useState(aiAnalysis);

  const runAnalysis = async () => {
    setLoading(true);
    const result = await analyzeSchoolStatus(centro, pem, satisfaction, palancas, academic, amia, objectives, documents);
    setLocalAnalysis(result);
    onAnalysisUpdate(result);
    setLoading(false);
  };

  const handleSave = () => {
    onAnalysisUpdate(localAnalysis);
    alert("Analisia ondo gorde da.");
  };

  const handleDownloadFullReport = () => {
    const fullData: SchoolData = {
        centro, pem, satisfaction, palancas, academic, amia, objectives, documents, aiAnalysis: localAnalysis,
        lastUpdated: new Date().toISOString()
    };
    generateWordReport(fullData);
  };

  const handleDownloadAIOnly = () => {
    generateAIReport(centro, localAnalysis);
  };

  useEffect(() => {
    if (!aiAnalysis) {
        runAnalysis();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* AI Hero Section */}
      <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
            <Bot className="w-64 h-64 rotate-12" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex-1 space-y-4">
                <div className="flex items-center space-x-3">
                    <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                        <Bot className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-black tracking-tight">IA Kudeaketa Laguntzailea</h2>
                </div>
                <p className="text-indigo-100 text-lg max-w-xl leading-relaxed">
                    Datu guztiak gurutzatu ditut (AMIA, RdC jarraipena, emaitzak eta asebetetzea) zuretzako diagnostiko estrategiko pertsonalizatu bat osatzeko.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                    <button 
                        onClick={runAnalysis}
                        disabled={loading}
                        className="flex items-center space-x-2 px-6 py-3 bg-white text-indigo-700 font-bold rounded-2xl hover:bg-indigo-50 transition-all shadow-xl disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                        <span>{loading ? 'Aztertzen...' : 'Analisia Eguneratu'}</span>
                    </button>
                </div>
            </div>

            {/* Action Panel for Reports */}
            <div className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 space-y-4 w-full md:w-80 shadow-inner">
                <h3 className="text-sm font-black uppercase tracking-widest text-indigo-200 border-b border-white/10 pb-2">Deskargatu Txostenak</h3>
                
                <button 
                    onClick={handleDownloadFullReport}
                    className="w-full flex items-center justify-between p-4 bg-indigo-500/30 hover:bg-indigo-500/50 rounded-2xl transition-all border border-white/20 group"
                >
                    <div className="flex items-center space-x-3 text-left">
                        <div className="p-2 bg-indigo-400 rounded-xl group-hover:scale-110 transition-transform"><BarChart4 className="w-5 h-5" /></div>
                        <div>
                            <p className="font-bold text-sm">Txosten Osoa</p>
                            <p className="text-[10px] text-indigo-200 uppercase">Datu + IA Analisia</p>
                        </div>
                    </div>
                    <FileDown className="w-5 h-5 opacity-50" />
                </button>

                <button 
                    onClick={handleDownloadAIOnly}
                    disabled={!localAnalysis}
                    className="w-full flex items-center justify-between p-4 bg-purple-500/30 hover:bg-purple-500/50 rounded-2xl transition-all border border-white/20 group disabled:opacity-30"
                >
                    <div className="flex items-center space-x-3 text-left">
                        <div className="p-2 bg-purple-400 rounded-xl group-hover:scale-110 transition-transform"><FileText className="w-5 h-5" /></div>
                        <div>
                            <p className="font-bold text-sm">IA Gomendioak</p>
                            <p className="text-[10px] text-purple-200 uppercase">Analisia Bakarrik</p>
                        </div>
                    </div>
                    <FileDown className="w-5 h-5 opacity-50" />
                </button>
            </div>
        </div>
      </div>

      {/* Analysis Result Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 min-h-[500px] overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/50 px-8 py-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-700 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-amber-500" />
                Azterketa Estrategikoa
            </h3>
            {!loading && localAnalysis && (
                <button 
                    onClick={handleSave}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-bold text-sm transition-colors"
                >
                    <Save className="w-4 h-4" />
                    <span>Gorde analisian</span>
                </button>
            )}
        </div>
        
        <div className="p-8">
            {loading ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-indigo-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                        <Loader2 className="w-16 h-16 animate-spin text-indigo-600 relative z-10" />
                    </div>
                    <div className="text-center space-y-2">
                        <p className="font-black text-slate-800 text-xl">Datuak gurutzatzen...</p>
                        <p className="text-slate-400 max-w-xs mx-auto">Gemini ikastetxearen egoera interpretatzen ari da, gomendio hoberenak emateko.</p>
                    </div>
                </div>
            ) : localAnalysis ? (
                <div className="prose prose-slate prose-indigo max-w-none prose-headings:font-black prose-headings:text-slate-800 prose-p:text-slate-600 prose-strong:text-indigo-700">
                    <ReactMarkdown>{localAnalysis}</ReactMarkdown>
                </div>
            ) : (
                <div className="py-20 text-center text-slate-400 italic">
                    Sakatu "Analisia Eguneratu" ikastetxearen diagnostikoa jasotzeko.
                </div>
            )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start space-x-3">
          <Bot className="w-5 h-5 text-amber-600 mt-0.5" />
          <p className="text-xs text-amber-700 leading-relaxed">
            <strong>Oharra:</strong> Txosten hau Adimen Artifizialak sortu du ikastetxeak emandako datuetan oinarrituta. 
            Emaitzak orientagarriak dira eta hezkuntza-aholkulari baten gainbegiratuarekin balioztatu behar dira.
          </p>
      </div>
    </div>
  );
};

export default GeminiAssistant;
