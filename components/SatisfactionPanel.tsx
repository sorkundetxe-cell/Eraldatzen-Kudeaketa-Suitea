
import React, { useState } from 'react';
import { AsebetetzeMailaEmaitza } from '../types';
import { Users, UserCheck, Home, Save, Copy, Upload, FileCheck, ExternalLink, FileSpreadsheet } from 'lucide-react';

interface SatisfactionPanelProps {
  data: AsebetetzeMailaEmaitza;
  onUpdate: (data: AsebetetzeMailaEmaitza) => void;
}

const SatisfactionPanel: React.FC<SatisfactionPanelProps> = ({ data, onUpdate }) => {
  const [localData, setLocalData] = useState<AsebetetzeMailaEmaitza>(data);
  
  const handleChange = (field: keyof AsebetetzeMailaEmaitza, value: string) => {
    const val = value === '' ? null : parseFloat(value);
    const newData = { ...localData, [field]: val };
    setLocalData(newData);
    onUpdate(newData); // Push to parent
  };

  const handleFileChange = (field: keyof AsebetetzeMailaEmaitza, fileName: string) => {
    const newData = { ...localData, [field]: fileName };
    setLocalData(newData);
    onUpdate(newData); // Push to parent
  };

  const handleSave = () => {
    onUpdate(localData);
  };

  const renderInputs = (fieldPrefix: 'ik' | 'ir' | 'fa') => (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Diagnostikoa</label>
        <input type="number" step="0.1" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={localData[`${fieldPrefix}_0` as keyof AsebetetzeMailaEmaitza] ?? ''} onChange={e => handleChange(`${fieldPrefix}_0` as keyof AsebetetzeMailaEmaitza, e.target.value)} />
      </div>
      <div>
        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">1. Urtea</label>
        <input type="number" step="0.1" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={localData[`${fieldPrefix}_1` as keyof AsebetetzeMailaEmaitza] ?? ''} onChange={e => handleChange(`${fieldPrefix}_1` as keyof AsebetetzeMailaEmaitza, e.target.value)} />
      </div>
      <div>
        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">2. Urtea</label>
        <input type="number" step="0.1" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={localData[`${fieldPrefix}_2` as keyof AsebetetzeMailaEmaitza] ?? ''} onChange={e => handleChange(`${fieldPrefix}_2` as keyof AsebetetzeMailaEmaitza, e.target.value)} />
      </div>
      <div>
        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">3. Urtea</label>
        <input type="number" step="0.1" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={localData[`${fieldPrefix}_3` as keyof AsebetetzeMailaEmaitza] ?? ''} onChange={e => handleChange(`${fieldPrefix}_3` as keyof AsebetetzeMailaEmaitza, e.target.value)} />
      </div>
    </div>
  );

  const ResourceLink = ({ title, url, icon: Icon }: { title: string, url: string, icon: any }) => (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="flex items-center p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md hover:border-blue-300 transition-all group"
    >
      <div className="p-3 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors mr-4">
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <h4 className="text-xs font-black text-slate-700 uppercase leading-tight">{title}</h4>
        <p className="text-[10px] text-slate-400 mt-1 font-bold">Sakatu kopia egiteko</p>
      </div>
      <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-blue-500" />
    </a>
  );

  const EvidenceSection = ({ title, icon: Icon, color, evidenceField, fieldPrefix }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className={`font-black uppercase text-sm flex items-center ${color}`}>
            <Icon className="w-5 h-5 mr-2"/> 
            {title}
        </h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase border-b border-slate-50 pb-2">
            <FileSpreadsheet className="w-3 h-3" />
            <span>Puntuazioen Laburpena</span>
        </div>
        {renderInputs(fieldPrefix)}
      </div>

      <div className="pt-4 border-t border-slate-100">
        <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Igo emaitzen ebidentzia (PDF/Excel):</p>
        <div className="flex items-center space-x-2">
          <label className="flex-1 flex items-center justify-center space-x-2 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl cursor-pointer transition-colors border border-dashed border-slate-300">
            <Upload className="w-4 h-4" />
            <span className="text-xs font-bold">{localData[evidenceField as keyof AsebetetzeMailaEmaitza] ? 'Fitxategia aldatu' : 'Hautatu fitxategia'}</span>
            <input type="file" className="hidden" onChange={(e) => handleFileChange(evidenceField, e.target.files?.[0]?.name || '')} />
          </label>
        </div>
        {localData[evidenceField as keyof AsebetetzeMailaEmaitza] && (
          <div className="mt-3 flex items-center text-[10px] text-emerald-600 font-bold bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">
            <FileCheck className="w-4 h-4 mr-2" />
            <span className="truncate">{localData[evidenceField as keyof AsebetetzeMailaEmaitza]}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header & Global Score */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-600 rounded-2xl text-white">
                <Users className="w-8 h-8" />
            </div>
            <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Asebetetze Maila</h2>
                <p className="text-sm text-slate-500 font-medium">Hezkuntza-komunitatearen pertzepzioaren jarraipena.</p>
            </div>
         </div>
         <div className="bg-slate-50 px-8 py-4 rounded-2xl border border-slate-100 text-center md:text-right shadow-inner">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Batazbesteko Orokorra</p>
            <p className="text-4xl font-black text-blue-600 tracking-tighter">
                {localData.satisfaccion_general_final?.toFixed(2) || '0.00'}
            </p>
         </div>
      </div>

      {/* Resources / Forms Section */}
      <div className="bg-blue-600/5 border border-blue-200 p-8 rounded-3xl space-y-6">
          <div className="flex items-center space-x-2">
              <Copy className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-black text-blue-900 uppercase tracking-widest">Baliabideak: Galdetegien Formularioak</h3>
          </div>
          <p className="text-sm text-blue-800/70 font-medium">
              Ikastetxeak bere Drive-n kopia ditzan prestaturiko formularioak. Erabili esteka hauek inkestak pasatzeko:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ResourceLink 
                title="Ikaslearen Ikasteko Asebetetze-maila" 
                url="https://docs.google.com/forms/d/1-v7O7V8cFFIxm90Y9N6HQ0MB1Q82Tlmb6jr0vcm5oCo/copy" 
                icon={Users}
              />
              <ResourceLink 
                title="Irakasleen Irakasteko Asebetetze-maila" 
                url="https://docs.google.com/forms/d/1_zR6gYKE2sHy6m1EtOLhAefkpbqp7Bj3p4iKiFPP07o/copy" 
                icon={UserCheck}
              />
              <ResourceLink 
                title="Familien Asebetetze-maila" 
                url="https://docs.google.com/forms/d/1z5niT6QMhoZf58zfODaki6QZe7P6tM5A0_40Z4ohXvA/copy" 
                icon={Home}
              />
          </div>
      </div>

      {/* Main Input Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <EvidenceSection 
          title="Ikasleak" 
          icon={Users} 
          color="text-blue-600" 
          fieldPrefix="ik"
          evidenceField="ikasle_ebidentzia_file"
        />
        <EvidenceSection 
          title="Irakasleak" 
          icon={UserCheck} 
          color="text-indigo-600" 
          fieldPrefix="ir"
          evidenceField="irakasle_ebidentzia_file"
        />
        <EvidenceSection 
          title="Familiak" 
          icon={Home} 
          color="text-emerald-600" 
          fieldPrefix="fa"
          evidenceField="familia_ebidentzia_file"
        />
      </div>

      {/* Global Average Input */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="max-w-xs">
            <label className="block text-sm font-black text-slate-700 uppercase mb-2">Batazbesteko Global Finkatua (0-10)</label>
            <input 
                type="number" 
                step="0.01" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-black text-blue-600 text-xl outline-none focus:ring-4 focus:ring-blue-100 transition-all" 
                value={localData.satisfaccion_general_final ?? ''} 
                onChange={e => handleChange('satisfaccion_general_final', e.target.value)} 
            />
          </div>
      </div>

      <div className="flex justify-end pt-4">
        <button 
            onClick={handleSave}
            className="flex items-center space-x-3 px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl transition-all active:scale-95 group"
        >
            <Save className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            <span>Gorde Datu Guztiak</span>
        </button>
      </div>
    </div>
  );
};

export default SatisfactionPanel;
