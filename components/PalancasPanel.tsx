
import React, { useState, useRef } from 'react';
import { PalankenEmaitza, PalankaMomentuDatuak, MomentuMota } from '../types';
import { Save, Layers, LineChart, FileText, ChevronRight, CheckCircle2, Info, ArrowRight, ClipboardCheck, Sparkles, Upload, FileCheck } from 'lucide-react';
import { PALANKA_RUBRICS } from '../constants';

interface PalancasPanelProps {
  data: PalankenEmaitza;
  onUpdate: (data: PalankenEmaitza) => void;
}

const PalancasPanel: React.FC<PalancasPanelProps> = ({ data, onUpdate }) => {
  const [localData, setLocalData] = useState<PalankenEmaitza>(data);
  const [activeTab, setActiveTab] = useState<number>(1); 
  const [activeMoment, setActiveMoment] = useState<MomentuMota>('A');
  const [activeView, setActiveView] = useState<'annual' | 'rdc'>('rdc');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const syncUpdate = (newData: PalankenEmaitza) => {
    setLocalData(newData);
    onUpdate(newData);
  };

  const handleSave = () => {
    onUpdate(localData);
    alert("Palanken datuak ondo gorde dira.");
  };

  const handleAnnualChange = (field: keyof PalankenEmaitza, value: string) => {
    const val = value === '' ? null : parseFloat(value);
    syncUpdate({ ...localData, [field]: val });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const field = `p${activeTab}_ebidentzia_file` as keyof PalankenEmaitza;
    syncUpdate({ ...localData, [field]: file.name });
  };

  const updateMomentData = (moment: MomentuMota, field: keyof PalankaMomentuDatuak, value: any) => {
    const details = [...(localData.ebaluazio_xehetasunak || [])];
    const index = details.findIndex(d => d.palanka === activeTab && d.momentua === moment);
    
    let updatedDetail: PalankaMomentuDatuak;
    if (index > -1) {
      updatedDetail = { ...details[index], [field]: value };
      const avg = ((updatedDetail.aplikazio_maila || 0) + (updatedDetail.gauzatze_maila || 0) + (updatedDetail.inpaktu_maila || 0)) / 3;
      updatedDetail.batezbestekoa_global = parseFloat(avg.toFixed(3));
      details[index] = updatedDetail;
    } else {
      updatedDetail = {
        id: `${activeTab}-${moment}-${Date.now()}`,
        palanka: activeTab as 1 | 2 | 3,
        momentua: moment,
        batezbestekoa_global: null,
        aplikazio_maila: null,
        gauzatze_maila: null,
        inpaktu_maila: null,
        justifikazioa: '',
        hobekuntza_proposamenak: '',
        ...{ [field]: value }
      };
      const avg = ((updatedDetail.aplikazio_maila || 0) + (updatedDetail.gauzatze_maila || 0) + (updatedDetail.inpaktu_maila || 0)) / 3;
      updatedDetail.batezbestekoa_global = parseFloat(avg.toFixed(3));
      details.push(updatedDetail);
    }
    syncUpdate({ ...localData, ebaluazio_xehetasunak: details });
  };

  const getMomentData = (palanka: number, moment: MomentuMota) => {
    return localData.ebaluazio_xehetasunak?.find(d => d.palanka === palanka && d.momentua === moment);
  };

  const currentMomentData = getMomentData(activeTab, activeMoment);
  const rubricsForPalanka = (PALANKA_RUBRICS as any)[`P${activeTab}`];
  const currentEvidenceFile = localData[`p${activeTab}_ebidentzia_file` as keyof PalankenEmaitza] as string;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
         <div className="flex items-center space-x-4">
            <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg">
                <Layers className="w-8 h-8" />
            </div>
            <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Eraldaketa Palankak</h2>
                <p className="text-sm text-slate-500">RdC1 Jarraipena eta Urteko Ebaluazioa</p>
            </div>
         </div>
         <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button 
                onClick={() => setActiveView('rdc')} 
                className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeView === 'rdc' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500'}`}
            >
                <ClipboardCheck className="w-4 h-4" />
                <span>MONITOREOA (RdC1)</span>
            </button>
            <button 
                onClick={() => setActiveView('annual')} 
                className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeView === 'annual' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500'}`}
            >
                <LineChart className="w-4 h-4" />
                <span>URTEKOA (1-4)</span>
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[ { id: 1, title: 'Kultura Eraldaketa', color: 'indigo' }, { id: 2, title: 'Irakaskuntza-Ikaskuntza', color: 'emerald' }, { id: 3, title: 'Espazioak eta Baliabideak', color: 'amber' } ].map((p) => (
            <button 
                key={p.id} 
                onClick={() => setActiveTab(p.id)} 
                className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-start space-y-3 relative overflow-hidden group ${ activeTab === p.id ? `bg-white border-${p.color}-600 ring-4 ring-${p.color}-50` : 'bg-white border-slate-100' }`}
            >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${ activeTab === p.id ? `bg-${p.color}-600 text-white` : 'bg-slate-100 text-slate-400' }`}>P{p.id}</div>
                <div><h3 className={`font-black text-sm uppercase ${activeTab === p.id ? `text-${p.color}-600` : 'text-slate-500'}`}>{p.title}</h3></div>
            </button>
        ))}
      </div>

      {activeView === 'rdc' ? (
        <div className="space-y-6">
           <div className="flex flex-col lg:flex-row items-center justify-between gap-6 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex space-x-1">
                {['A', 'B', 'C'].map((m) => (
                    <button 
                        key={m} 
                        onClick={() => setActiveMoment(m as MomentuMota)} 
                        className={`px-6 py-2 rounded-xl text-xs font-black transition-all border ${ activeMoment === m ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400' }`}
                    >
                        RdC1{m}
                    </button>
                ))}
              </div>
              <div className="flex items-center space-x-3">
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                <button 
                    onClick={() => fileInputRef.current?.click()} 
                    className="flex items-center space-x-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl transition-all hover:bg-slate-100"
                >
                    <Upload className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold text-slate-600 uppercase">Ebidentzia Fitxategia igo</span>
                </button>
                {currentEvidenceFile && (
                    <div className="flex items-center bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                        <FileCheck className="w-3 h-3 text-emerald-600 mr-2" />
                        <span className="text-[10px] font-black text-emerald-700 truncate max-w-[150px]">{currentEvidenceFile}</span>
                    </div>
                )}
              </div>
           </div>
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 space-y-6">
                  <RubricSection title="Aplikazio Maila" value={currentMomentData?.aplikazio_maila} options={rubricsForPalanka.aplikazioa} onChange={(v: any) => updateMomentData(activeMoment, 'aplikazio_maila', v)} />
                  <RubricSection title="Gauzatze Maila" value={currentMomentData?.gauzatze_maila} options={rubricsForPalanka.gauzatzea} onChange={(v: any) => updateMomentData(activeMoment, 'gauzatze_maila', v)} />
                  <RubricSection title="Inpaktu Maila" value={currentMomentData?.inpaktu_maila} options={rubricsForPalanka.inpaktua} onChange={(v: any) => updateMomentData(activeMoment, 'inpaktu_maila', v)} />
              </div>
              <div className="lg:col-span-4 space-y-6">
                  <div className="bg-indigo-600 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
                      <Sparkles className="absolute -right-2 -bottom-2 w-20 h-20 opacity-10" />
                      <p className="text-xs font-black text-indigo-200 uppercase mb-1">Batazbesteko Globala</p>
                      <h4 className="text-5xl font-black">{(currentMomentData?.batezbestekoa_global || 0).toFixed(2)}</h4>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                      <h4 className="text-sm font-black text-slate-800 flex items-center">
                          <FileText className="w-4 h-4 mr-2 text-indigo-600" />
                          Justifikazioa (RdC1{activeMoment})
                      </h4>
                      <textarea 
                        className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-100" 
                        placeholder="Azaldu puntuazioaren arrazoia..."
                        value={currentMomentData?.justifikazioa || ''} 
                        onChange={(e) => updateMomentData(activeMoment, 'justifikazioa', e.target.value)} 
                      />
                  </div>
              </div>
           </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 animate-in fade-in">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
                <h3 className="text-lg font-black text-slate-800">Urteko Ebaluazio Finkatua</h3>
                <div className="flex items-center space-x-3">
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                    <button 
                        onClick={() => fileInputRef.current?.click()} 
                        className="flex items-center space-x-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-black border border-indigo-100 hover:bg-indigo-100 transition-all"
                    >
                        <Upload className="w-4 h-4" />
                        <span>EBIDENTZIA FITXATEGIA IGO</span>
                    </button>
                </div>
            </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <AnnualMetricBox label="Aplikazioa" value={localData[`p${activeTab}_a1_aplikazio` as keyof PalankenEmaitza] as number} onChange={(v: any) => handleAnnualChange(`p${activeTab}_a1_aplikazio` as keyof PalankenEmaitza, v)} />
              <AnnualMetricBox label="Gauzatzea" value={localData[`p${activeTab}_a1_gauzatze` as keyof PalankenEmaitza] as number} onChange={(v: any) => handleAnnualChange(`p${activeTab}_a1_gauzatze` as keyof PalankenEmaitza, v)} />
              <AnnualMetricBox label="Inpaktua" value={localData[`p${activeTab}_a1_inpaktu` as keyof PalankenEmaitza] as number} onChange={(v: any) => handleAnnualChange(`p${activeTab}_a1_inpaktu` as keyof PalankenEmaitza, v)} />
           </div>
        </div>
      )}
      <div className="fixed bottom-8 right-8 z-50">
        <button 
            onClick={handleSave} 
            className="flex items-center space-x-3 px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-2xl transition-all active:scale-95 group"
        >
            <Save className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            <span className="text-lg">Datuak Gorde</span>
        </button>
      </div>
    </div>
  );
};

const RubricSection = ({ title, value, options, onChange }: any) => (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-6 shadow-sm">
        <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {options.map((opt: any) => (
                <button 
                    key={opt.value} 
                    onClick={() => onChange(opt.value)} 
                    className={`p-5 rounded-2xl border-2 text-left transition-all ${value === opt.value ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg scale-105' : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-200'}`}
                >
                    <span className={`text-[10px] font-black uppercase mb-2 block ${value === opt.value ? 'text-indigo-200' : 'text-slate-400'}`}>{opt.label}</span>
                    <p className={`text-[11px] leading-relaxed mb-3 font-medium ${value === opt.value ? 'text-indigo-50' : 'text-slate-500'}`}>{opt.desc}</p>
                    <span className="text-sm font-black">{opt.value}</span>
                </button>
            ))}
        </div>
    </div>
);

const AnnualMetricBox = ({ label, value, onChange }: any) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">{label}</label>
        <span className="text-xl font-black text-indigo-600">{value || '1.0'}</span>
    </div>
    <input 
        type="range" 
        step="0.1" 
        max="4" 
        min="1" 
        className="w-full accent-indigo-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer" 
        value={value || 1} 
        onChange={(e) => onChange(e.target.value)} 
    />
  </div>
);

export default PalancasPanel;
