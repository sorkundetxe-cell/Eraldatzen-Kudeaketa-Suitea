
import React, { useState, useRef } from 'react';
import { EmaitzaAkademikoa, AkademikoaUrtea } from '../types';
import { GraduationCap, Save, TrendingUp, History, Plus, Trash2, FileText, Upload, FileSpreadsheet, Loader2, CheckCircle, Sparkles } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { extractAcademicDataFromExcel } from '../services/geminiService';

interface AcademicPanelProps {
  data: EmaitzaAkademikoa;
  onUpdate: (data: EmaitzaAkademikoa) => void;
}

const AcademicPanel: React.FC<AcademicPanelProps> = ({ data, onUpdate }) => {
  const [localData, setLocalData] = useState<EmaitzaAkademikoa>(data);
  const [activeMetric, setActiveMetric] = useState<string>('prom');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState('');
  
  const excelLHRef = useRef<HTMLInputElement>(null);
  const excelDBHRef = useRef<HTMLInputElement>(null);

  const syncUpdate = (newData: EmaitzaAkademikoa) => {
    setLocalData(newData);
    onUpdate(newData);
  };

  const handleChange = (field: keyof EmaitzaAkademikoa, value: string) => {
    const val = value === '' ? null : parseFloat(value);
    syncUpdate({ ...localData, [field]: val });
  };

  const handleAddYear = (newYearData?: Partial<AkademikoaUrtea>) => {
    const newYear: AkademikoaUrtea = {
      id: Date.now().toString(),
      ikasturtea: newYearData?.ikasturtea || "2024-2025",
      prom_lh: newYearData?.prom_lh ?? 0, 
      prom_dbh: newYearData?.prom_dbh ?? 0,
      hk_lh: newYearData?.hk_lh ?? 0, 
      hk_dbh: newYearData?.hk_dbh ?? 0,
      matematika_lh: newYearData?.matematika_lh ?? 0, 
      matematika_dbh: newYearData?.matematika_dbh ?? 0,
      zientzia_lh: newYearData?.zientzia_lh ?? 0, 
      zientzia_dbh: newYearData?.zientzia_dbh ?? 0,
      bizikidetza_lh: newYearData?.bizikidetza_lh ?? 0, 
      bizikidetza_dbh: newYearData?.bizikidetza_dbh ?? 0,
      ...newYearData
    };
    syncUpdate({ 
      ...localData, 
      erregistro_historikoa: [...localData.erregistro_historikoa, newYear] 
    });
  };

  const handleDeleteYear = (id: string) => {
    if(window.confirm("Ziur zaude urte hau ezabatu nahi duzula?")) {
        syncUpdate({ ...localData, erregistro_historikoa: localData.erregistro_historikoa.filter(y => y.id !== id) });
    }
  };

  const updateYear = (id: string, updates: Partial<AkademikoaUrtea>) => {
    syncUpdate({
      ...localData,
      erregistro_historikoa: localData.erregistro_historikoa.map(y => y.id === id ? { ...y, ...updates } : y)
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, stage: 'LH' | 'DBH') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setAnalysisProgress(`${stage} Excel fitxategia analizatzen...`);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result?.toString().split(',')[1];
      if (base64) {
        const result = await extractAcademicDataFromExcel(base64, file.type, stage);
        if (result) {
          const existingYear = localData.erregistro_historikoa.find(y => y.ikasturtea === result.ikasturtea);
          if (existingYear) {
            updateYear(existingYear.id, result);
          } else {
            handleAddYear(result);
          }
          setAnalysisProgress(`Datuak ondo kargatu dira: ${result.ikasturtea}`);
          setTimeout(() => {
            setIsAnalyzing(false);
            setAnalysisProgress('');
          }, 2000);
        } else {
          setAnalysisProgress('Ezin izan dira datuak atera. Ziurtatu Excel-a zuzena dela.');
          setTimeout(() => setIsAnalyzing(false), 3000);
        }
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const chartData = localData.erregistro_historikoa.map(y => ({
    name: y.ikasturtea,
    LH: activeMetric === 'prom' ? y.prom_lh : 
        activeMetric === 'hk' ? y.hk_lh : 
        activeMetric === 'mat' ? y.matematika_lh : 
        activeMetric === 'zie' ? y.zientzia_lh : y.bizikidetza_lh,
    DBH: activeMetric === 'prom' ? y.prom_dbh : 
         activeMetric === 'hk' ? y.hk_dbh : 
         activeMetric === 'mat' ? y.matematika_dbh : 
         activeMetric === 'zie' ? y.zientzia_dbh : y.bizikidetza_dbh,
  })).sort((a, b) => a.name.localeCompare(b.name));

  const MetricBtn = ({ id, label }: { id: string, label: string }) => (
    <button onClick={() => setActiveMetric(id)} className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${activeMetric === id ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>{label}</button>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 flex-1">
            <h2 className="text-3xl font-black tracking-tight flex items-center"><Sparkles className="w-8 h-8 mr-3 text-blue-200" />Datu Akademikoak Excel bidez</h2>
            <p className="text-blue-100 text-lg max-w-xl leading-relaxed">Igo ikastetxeako Barne Emaitzen Excel fitxategia IA bidez aztertzeko.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <input type="file" className="hidden" ref={excelLHRef} accept=".xlsx,.xls,.csv" onChange={(e) => handleFileUpload(e, 'LH')} />
            <input type="file" className="hidden" ref={excelDBHRef} accept=".xlsx,.xls,.csv" onChange={(e) => handleFileUpload(e, 'DBH')} />
            <button onClick={() => excelLHRef.current?.click()} className="flex items-center justify-center space-x-3 px-6 py-4 bg-white text-blue-700 font-black rounded-2xl hover:bg-blue-50 shadow-lg transition-all">LH Excel Kargatu</button>
            <button onClick={() => excelDBHRef.current?.click()} className="flex items-center justify-center space-x-3 px-6 py-4 bg-indigo-500 text-white font-black rounded-2xl hover:bg-indigo-400 shadow-lg transition-all border border-white/20">DBH Excel Kargatu</button>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div className="flex items-center space-x-4"><div className="p-3 bg-indigo-100 rounded-2xl text-indigo-600 shadow-sm"><TrendingUp className="w-6 h-6" /></div><div><h3 className="text-xl font-black text-slate-800">Eboluzio Historikoa</h3></div></div>
          <div className="flex flex-wrap gap-2 p-1.5 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
            <MetricBtn id="prom" label="Ez-promozionatuak" /><MetricBtn id="hk" label="Hizkuntza" /><MetricBtn id="mat" label="Matematika" /><MetricBtn id="zie" label="Zientzia" /><MetricBtn id="biz" label="Bizikidetza" />
          </div>
        </div>
        <div className="h-[400px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="LH" stroke="#4f46e5" strokeWidth={4} />
              <Line type="monotone" dataKey="DBH" stroke="#ec4899" strokeWidth={4} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-8">Uneko Emaitzak</h2>
            <div className="space-y-6">
              <CurrentMetricInput label="Ez-promozionatuak (%)" valLH={localData.prom_final_lh} valDBH={localData.prom_final_dbh} onChangeLH={v => handleChange('prom_final_lh', v)} onChangeDBH={v => handleChange('prom_final_dbh', v)} />
              <CurrentMetricInput label="Hizkuntza Konpetentzia" valLH={localData.hk_a1_lh} valDBH={localData.hk_a1_dbh} onChangeLH={v => handleChange('hk_a1_lh', v)} onChangeDBH={v => handleChange('hk_a1_dbh', v)} color="indigo" />
              <CurrentMetricInput label="Matematika Konpetentzia" valLH={localData.matematika_a1_lh} valDBH={localData.matematika_a1_dbh} onChangeLH={v => handleChange('matematika_a1_lh', v)} onChangeDBH={v => handleChange('matematika_a1_dbh', v)} color="emerald" />
              <div className="pt-6 border-t border-slate-100">
                <input type="file" className="hidden" id="main-acad-file" onChange={(e) => syncUpdate({...localData, akademikoa_ebidentzia_file: e.target.files?.[0]?.name || ''})} />
                <label htmlFor="main-acad-file" className="w-full flex items-center justify-center space-x-3 py-3 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-100 transition-all font-bold text-sm text-slate-600">
                  <Upload className="w-5 h-5" /><span>{localData.akademikoa_ebidentzia_file || 'Ebidentzia Igo'}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between"><h3 className="text-xl font-black text-slate-800">Erregistro Historikoa</h3><button onClick={() => handleAddYear()} className="flex items-center space-x-2 px-6 py-2.5 bg-indigo-600 text-white rounded-2xl text-sm font-black shadow-lg">Ikasturtea Gehitu</button></div>
          <div className="space-y-6">
            {localData.erregistro_historikoa.slice().reverse().map((y) => (
              <div key={y.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="bg-slate-50 px-8 py-4 flex justify-between items-center border-b border-slate-100">
                  <input className="bg-transparent font-black text-slate-800 outline-none" value={y.ikasturtea} onChange={e => updateYear(y.id, { ikasturtea: e.target.value })} />
                  <button onClick={() => handleDeleteYear(y.id)} className="text-slate-300 hover:text-red-500 transition-all"><Trash2 className="w-5 h-5" /></button>
                </div>
                <div className="p-8 grid grid-cols-2 md:grid-cols-5 gap-6">
                  <HistoryInput label="Ez-prom." valLH={y.prom_lh} valDBH={y.prom_dbh} onChangeLH={v => updateYear(y.id, { prom_lh: v })} onChangeDBH={v => updateYear(y.id, { prom_dbh: v })} />
                  <HistoryInput label="Hizkuntza" valLH={y.hk_lh} valDBH={y.hk_dbh} onChangeLH={v => updateYear(y.id, { hk_lh: v })} onChangeDBH={v => updateYear(y.id, { hk_dbh: v })} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="fixed bottom-8 right-8 z-50"><button onClick={() => onUpdate(localData)} className="flex items-center space-x-3 px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-2xl transition-all active:scale-95 group"><Save className="w-6 h-6 group-hover:rotate-12 transition-transform" /><span className="text-lg">Datuak Gorde</span></button></div>
    </div>
  );
};

const CurrentMetricInput = ({ label, valLH, valDBH, onChangeLH, onChangeDBH, color = "slate" }: any) => {
    return (
        <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl">
            <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-3">{label}</h4>
            <div className="grid grid-cols-2 gap-4">
                <input type="number" step="0.1" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold" value={valLH ?? ''} onChange={e => onChangeLH(e.target.value)} placeholder="LH" />
                <input type="number" step="0.1" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold" value={valDBH ?? ''} onChange={e => onChangeDBH(e.target.value)} placeholder="DBH" />
            </div>
        </div>
    );
};

const HistoryInput = ({ label, valLH, valDBH, onChangeLH, onChangeDBH }: any) => (
  <div className="space-y-3">
    <p className="text-[10px] font-black text-slate-400 uppercase text-center">{label}</p>
    <div className="flex flex-col space-y-2">
      <input type="number" step="0.1" className="w-full p-2 text-xs font-bold border rounded-xl bg-slate-50 text-center" value={valLH ?? ''} onChange={e => onChangeLH(e.target.value === '' ? null : parseFloat(e.target.value))} placeholder="LH" />
      <input type="number" step="0.1" className="w-full p-2 text-xs font-bold border rounded-xl bg-slate-50 text-center" value={valDBH ?? ''} onChange={e => onChangeDBH(e.target.value === '' ? null : parseFloat(e.target.value))} placeholder="DBH" />
    </div>
  </div>
);

export default AcademicPanel;
