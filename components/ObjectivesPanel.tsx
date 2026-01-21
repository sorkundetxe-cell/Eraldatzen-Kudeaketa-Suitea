
import React, { useState } from 'react';
import { HelburuZehaztua, Adierazlea } from '../types';
import { Target, Plus, Trash2, Save, ClipboardList, AlertCircle, Scale, CheckCircle2, Clock, Trash } from 'lucide-react';

interface ObjectivesPanelProps {
  objectives: HelburuZehaztua[];
  onUpdate: (data: HelburuZehaztua[]) => void;
}

const ObjectivesPanel: React.FC<ObjectivesPanelProps> = ({ objectives, onUpdate }) => {
  const initializeObjectives = (objs: HelburuZehaztua[]) => {
    if (objs && objs.length > 0) return objs;
    const defaultObjs: HelburuZehaztua[] = [];
    for (let i = 1; i <= 4; i++) {
        defaultObjs.push({
            id: Date.now().toString() + i,
            testua: `Helburua ${i}: `,
            epea: "",
            adierazleak: []
        });
    }
    return defaultObjs;
  };

  const [localObjectives, setLocalObjectives] = useState<HelburuZehaztua[]>(initializeObjectives(objectives));

  const handleSave = () => {
    onUpdate(localObjectives);
  };

  const pushUpdate = (newObjs: HelburuZehaztua[]) => {
    setLocalObjectives(newObjs);
    onUpdate(newObjs); // Real-time sync to parent
  };

  const handleAddObjective = () => {
    const newId = Date.now().toString();
    const newObj: HelburuZehaztua = {
        id: newId,
        testua: `Helburua ${localObjectives.length + 1}: `,
        epea: "",
        adierazleak: []
    };
    pushUpdate([...localObjectives, newObj]);
  };

  const handleRemoveObjective = (id: string) => {
    if (window.confirm("Ziur zaude helburu hau eta bere adierazle guztiak ezabatu nahi dituzula?")) {
        pushUpdate(localObjectives.filter(o => o.id !== id));
    }
  };

  const handleObjectiveChange = (id: string, field: keyof HelburuZehaztua, value: string) => {
    pushUpdate(localObjectives.map(o => o.id === id ? { ...o, [field]: value } : o));
  };

  const handleAddIndicator = (objId: string) => {
    const newObjs = localObjectives.map(o => {
        if (o.id === objId) {
            const nextCode = `${o.adierazleak?.length + 1}`;
            const newIndicator: Adierazlea = {
                id: Date.now().toString(),
                kodea: nextCode,
                testua: "",
                lorpen_maila: null,
                pisua: 0,
                oharrak: ""
            };
            return { ...o, adierazleak: [...(o.adierazleak || []), newIndicator] };
        }
        return o;
    });
    pushUpdate(newObjs);
  };

  const handleUpdateIndicator = (objId: string, indId: string, field: keyof Adierazlea, value: any) => {
    const newObjs = localObjectives.map(o => {
        if (o.id === objId) {
            return {
                ...o,
                adierazleak: o.adierazleak.map(ind => ind.id === indId ? { ...ind, [field]: value } : ind)
            };
        }
        return o;
    });
    pushUpdate(newObjs);
  };

  const handleRemoveIndicator = (objId: string, indId: string) => {
    const newObjs = localObjectives.map(o => {
        if (o.id === objId) {
            return { ...o, adierazleak: o.adierazleak.filter(ind => ind.id !== indId) };
        }
        return o;
    });
    pushUpdate(newObjs);
  };

  const calculateWeightedAchievement = (indicators: Adierazlea[]) => {
    if (!indicators || indicators.length === 0) return 0;
    let totalWeight = indicators.reduce((acc, curr) => acc + (curr.pisua || 0), 0);
    if (totalWeight === 0) return 0;
    let weightedSum = indicators.reduce((acc, curr) => {
        return acc + ((curr.lorpen_maila || 0) * (curr.pisua || 0));
    }, 0);
    return weightedSum / totalWeight;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-32">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-3">
            <div className="p-2 bg-rose-100 rounded-lg text-rose-600"><Target className="w-6 h-6" /></div>
            <div>
                <h2 className="text-xl font-bold text-slate-800">Helburu Espezifikoak (RdC3)</h2>
                <p className="text-sm text-slate-500">Haztatu adierazleak eta jarraitu lorpen-maila globala.</p>
            </div>
        </div>
        <div className="flex items-center space-x-4">
            <button 
                onClick={handleAddObjective}
                className="flex items-center space-x-2 px-6 py-2.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl text-sm font-black transition-all border border-rose-200 shadow-sm"
            >
                <Plus className="w-4 h-4" />
                <span>Helburu Berria</span>
            </button>
            <div className="text-right flex flex-col items-end border-l border-slate-100 pl-4 hidden md:flex">
                <div className="text-[10px] font-black text-slate-400 uppercase">Ponderazio Sistema</div>
                <div className="flex items-center space-x-2 text-rose-600 font-black text-sm">
                    <Scale className="w-4 h-4" />
                    <span>Lorpen Haztatua</span>
                </div>
            </div>
        </div>
      </div>

      <div className="space-y-8">
        {localObjectives.map((obj, index) => {
          const achievement = calculateWeightedAchievement(obj.adierazleak);
          const totalWeight = obj.adierazleak?.reduce((acc, curr) => acc + (curr.pisua || 0), 0) || 0;
          
          return (
            <div key={obj.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:border-rose-200 group/card">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center space-x-4 flex-1 min-w-[300px]">
                      <span className="w-10 h-10 bg-rose-600 text-white font-black rounded-xl flex items-center justify-center shadow-lg group-hover/card:scale-110 transition-transform">H{index + 1}</span>
                      <input 
                          type="text"
                          className="bg-transparent border-none font-bold text-slate-800 text-lg w-full focus:ring-0 outline-none placeholder:text-slate-300"
                          placeholder={`Helburua deskribatu...`}
                          value={obj.testua}
                          onChange={(e) => handleObjectiveChange(obj.id, 'testua', e.target.value)}
                      />
                  </div>
                  
                  <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <input 
                              type="text"
                              placeholder="Epea: 2025-06"
                              className="bg-transparent border-none text-xs font-bold w-24 outline-none"
                              value={obj.epea}
                              onChange={(e) => handleObjectiveChange(obj.id, 'epea', e.target.value)}
                          />
                      </div>
                      <div className="flex flex-col items-end min-w-[80px]">
                          <span className="text-[9px] font-black text-slate-400 uppercase">Lorpen Maila</span>
                          <span className={`text-xl font-black ${achievement >= 100 ? 'text-green-600' : achievement >= 50 ? 'text-rose-600' : 'text-slate-400'}`}>
                            {achievement.toFixed(1)}%
                          </span>
                      </div>
                      <button 
                        onClick={() => handleRemoveObjective(obj.id)}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all ml-2"
                        title="Ezabatu Helburua"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                  </div>
              </div>
              
              <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                      <span className="flex items-center"><ClipboardList className="w-3 h-3 mr-1"/> Lorpen-Adierazleak eta Ponderazioa</span>
                      <button 
                          onClick={() => handleAddIndicator(obj.id)}
                          className="flex items-center space-x-1 text-rose-600 hover:text-rose-700 transition-colors bg-rose-50 px-3 py-1 rounded-full text-[10px]"
                      >
                          <Plus className="w-3 h-3" />
                          <span>Adierazle Berria</span>
                      </button>
                  </div>

                  <div className="space-y-4">
                      {obj.adierazleak && obj.adierazleak.length > 0 ? (
                          <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                  <thead>
                                      <tr className="text-left text-slate-400 border-b border-slate-50">
                                          <th className="pb-3 font-black text-[10px] w-20 uppercase">Kod.</th>
                                          <th className="pb-3 font-black text-[10px] uppercase">Deskribapena</th>
                                          <th className="pb-3 font-black text-[10px] w-24 uppercase text-center">Pisua (%)</th>
                                          <th className="pb-3 font-black text-[10px] w-28 uppercase text-center">Lorpena (%)</th>
                                          <th className="pb-3 font-black text-[10px] uppercase">Oharrak</th>
                                          <th className="pb-3 w-10"></th>
                                      </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-50">
                                      {obj.adierazleak.map((ind) => (
                                          <tr key={ind.id} className="group/row hover:bg-slate-50/50 transition-colors">
                                              <td className="py-4 pr-4">
                                                  <input 
                                                      type="text" 
                                                      className="w-full bg-slate-100/50 border-none rounded-lg px-2 py-1 text-xs font-mono font-bold text-slate-500"
                                                      value={ind.kodea}
                                                      onChange={(e) => handleUpdateIndicator(obj.id, ind.id, 'kodea', e.target.value)}
                                                  />
                                              </td>
                                              <td className="py-4 pr-4">
                                                  <input 
                                                      type="text" 
                                                      placeholder="Idatzi adierazlea..."
                                                      className="w-full bg-transparent border-none rounded p-1 text-xs text-slate-700 focus:ring-1 focus:ring-rose-200 outline-none"
                                                      value={ind.testua}
                                                      onChange={(e) => handleUpdateIndicator(obj.id, ind.id, 'testua', e.target.value)}
                                                  />
                                              </td>
                                              <td className="py-4 pr-4 text-center">
                                                  <div className="relative inline-block">
                                                      <input 
                                                          type="number" 
                                                          className="w-20 bg-blue-50/50 border-none rounded-lg px-2 py-1.5 text-xs font-black text-blue-700 text-center focus:ring-2 focus:ring-blue-200 outline-none"
                                                          value={ind.pisua ?? ''}
                                                          onChange={(e) => handleUpdateIndicator(obj.id, ind.id, 'pisua', e.target.value === '' ? null : parseFloat(e.target.value))}
                                                      />
                                                  </div>
                                              </td>
                                              <td className="py-4 pr-4 text-center">
                                                  <div className="relative inline-block">
                                                      <input 
                                                          type="number" 
                                                          className="w-20 bg-rose-50/50 border-none rounded-lg px-2 py-1.5 text-xs font-black text-rose-700 text-center focus:ring-2 focus:ring-rose-200 outline-none"
                                                          value={ind.lorpen_maila ?? ''}
                                                          onChange={(e) => handleUpdateIndicator(obj.id, ind.id, 'lorpen_maila', e.target.value === '' ? null : parseFloat(e.target.value))}
                                                      />
                                                  </div>
                                              </td>
                                              <td className="py-4 pr-4">
                                                  <input 
                                                      type="text" 
                                                      placeholder="Behaketak..."
                                                      className="w-full bg-transparent border-none rounded p-1 text-xs text-slate-400 italic outline-none"
                                                      value={ind.oharrak}
                                                      onChange={(e) => handleUpdateIndicator(obj.id, ind.id, 'oharrak', e.target.value)}
                                                  />
                                              </td>
                                              <td className="py-4 text-right">
                                                  <button 
                                                      onClick={() => handleRemoveIndicator(obj.id, ind.id)}
                                                      className="text-slate-300 hover:text-red-500 opacity-0 group-hover/row:opacity-100 transition-all p-1"
                                                  >
                                                      <Trash className="w-4 h-4" />
                                                  </button>
                                              </td>
                                          </tr>
                                      ))}
                                      <tr className="bg-slate-50/30">
                                          <td colSpan={2} className="py-3 px-4 text-[10px] font-black text-slate-400 uppercase text-right">Guztira (Ponderazioa):</td>
                                          <td className="py-3 px-4 text-center">
                                              <span className={`text-xs font-black ${totalWeight === 100 ? 'text-green-600' : 'text-amber-500'}`}>
                                                  {totalWeight}%
                                              </span>
                                          </td>
                                          <td colSpan={3}>
                                              {totalWeight !== 100 && totalWeight > 0 && (
                                                  <span className="text-[9px] font-bold text-amber-500 italic ml-2">* Gomendioa: %100era doitzea.</span>
                                              )}
                                              {totalWeight === 100 && (
                                                  <div className="flex items-center ml-2 text-green-600 text-[9px] font-bold">
                                                      <CheckCircle2 className="w-3 h-3 mr-1" /> Ponderazioa zuzena da.
                                                  </div>
                                              )}
                                          </td>
                                      </tr>
                                  </tbody>
                              </table>
                          </div>
                      ) : (
                          <div className="flex flex-col items-center justify-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                              <AlertCircle className="w-8 h-8 text-slate-300 mb-2" />
                              <p className="text-sm text-slate-400 italic">Ez dago adierazlerik helburu honentzat.</p>
                              <button 
                                  onClick={() => handleAddIndicator(obj.id)}
                                  className="mt-3 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold shadow-lg hover:bg-rose-700 transition-all active:scale-95"
                              >
                                  Gehitu lehen adierazlea
                              </button>
                          </div>
                      )}
                  </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="fixed bottom-8 right-8 z-50 flex space-x-4">
        <button 
            onClick={handleSave}
            className="flex items-center space-x-3 px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl transition-all active:scale-95"
        >
            <Save className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            <span>Gorde Helburu Guztiak</span>
        </button>
      </div>
    </div>
  );
};

export default ObjectivesPanel;
