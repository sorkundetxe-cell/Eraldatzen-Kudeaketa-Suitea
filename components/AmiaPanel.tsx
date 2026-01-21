
import React, { useState } from 'react';
import { AmiaAnalisis } from '../types';
import { ThumbsUp, ThumbsDown, Zap, ShieldAlert, ArrowUpRight, Save } from 'lucide-react';

interface AmiaPanelProps {
  data: AmiaAnalisis;
  onUpdate: (data: AmiaAnalisis) => void;
}

const AmiaPanel: React.FC<AmiaPanelProps> = ({ data, onUpdate }) => {
  const [localData, setLocalData] = useState<AmiaAnalisis>(data);
  
  const handleChange = (field: keyof AmiaAnalisis, value: string) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    onUpdate(newData); // Push to parent for auto-save
  };

  const handleSave = () => {
    onUpdate(localData);
  };

  const AnalysisBox = ({ title, field, icon: Icon, bgColor, borderColor, textColor, placeholder }: any) => (
    <div className={`p-6 rounded-xl border ${bgColor} ${borderColor} shadow-sm flex flex-col h-full`}>
      <div className="flex items-center space-x-2 mb-3">
        <Icon className={`w-5 h-5 ${textColor}`} />
        <h3 className={`font-bold text-lg ${textColor}`}>{title}</h3>
      </div>
      <textarea
        className="w-full h-full min-h-[150px] bg-white border border-slate-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm text-slate-700"
        placeholder={placeholder}
        value={localData[field]}
        onChange={(e) => handleChange(field, e.target.value)}
      />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-600"><ArrowUpRight className="w-6 h-6" /></div>
            <div>
                <h2 className="text-xl font-bold text-slate-800">Ikastetxeko Diagnostikoa</h2>
                <p className="text-sm text-slate-500">Ikastetxearen egoeraren diagnostiko estrategikoa (AMIA/DAFO).</p>
            </div>
        </div>
        <div className="mt-4">
            <textarea
                className="w-full h-80 p-6 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none text-base text-slate-700 bg-slate-50 leading-relaxed shadow-inner"
                placeholder="Idatzi hemen ikastetxearen diagnostiko sakon eta orokorra..."
                value={localData.diagnostikoa || ''}
                onChange={(e) => handleChange('diagnostikoa', e.target.value)}
            />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnalysisBox title="INDARGUNEAK" field="indarguneak" icon={ThumbsUp} bgColor="bg-green-50" borderColor="border-green-200" textColor="text-green-800" placeholder="Zer egiten dugu ondo?..." />
        <AnalysisBox title="AHULEZIAK" field="ahuleziak" icon={ThumbsDown} bgColor="bg-red-50" borderColor="border-red-200" textColor="text-red-800" placeholder="Zer hobetu behar dugu?..." />
        <AnalysisBox title="AUKERAK" field="aukerak" icon={Zap} bgColor="bg-blue-50" borderColor="border-blue-200" textColor="text-blue-800" placeholder="Kanpoko zein joeraz baliatu gaitezke?..." />
        <AnalysisBox title="MEHATXUAK" field="mehatxuak" icon={ShieldAlert} bgColor="bg-orange-50" borderColor="border-orange-200" textColor="text-orange-800" placeholder="Zein oztopo ditugu kanpoan?..." />
      </div>

      <div className="flex justify-end pt-4 pb-12">
        <button 
            onClick={handleSave}
            className="flex items-center space-x-2 px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl transition-all active:scale-95"
        >
            <Save className="w-6 h-6" />
            <span>Gorde Diagnostikoa</span>
        </button>
      </div>
    </div>
  );
};

export default AmiaPanel;
