
import React, { useState } from 'react';
import { CentroEducativo, PlanEstrategicoMejora, TaldeEragileaKidea, AsebetetzeMailaEmaitza } from '../types';
import { Save, Calendar, Users, Trash2, UserPlus, School, Zap } from 'lucide-react';

interface SchoolFormProps {
  centro: CentroEducativo;
  pem: PlanEstrategicoMejora;
  satisfaction: AsebetetzeMailaEmaitza;
  onUpdate: (c: CentroEducativo, p: PlanEstrategicoMejora) => void;
}

const SchoolForm: React.FC<SchoolFormProps> = ({ centro, pem, satisfaction, onUpdate }) => {
  const [localCentro, setLocalCentro] = useState(centro);
  const [localPEM, setLocalPEM] = useState(pem);

  const syncUpdate = (c: CentroEducativo, p: PlanEstrategicoMejora) => {
    onUpdate(c, p);
  };

  const handleCentroChange = (field: keyof CentroEducativo, value: any) => {
    const updated = { ...localCentro, [field]: value };
    setLocalCentro(updated);
    syncUpdate(updated, localPEM);
  };

  const handlePEMChange = (field: keyof PlanEstrategicoMejora, value: any) => {
    const updated = { ...localPEM, [field]: value };
    setLocalPEM(updated);
    syncUpdate(localCentro, updated);
  };

  const handleSave = () => {
    onUpdate(localCentro, localPEM);
  };

  const handleAddMember = () => {
    const newMember: TaldeEragileaKidea = {
      id: Date.now().toString(),
      izena: '',
      kargua: ''
    };
    const updatedPEM = {
      ...localPEM,
      talde_eragilea: [...(localPEM.talde_eragilea || []), newMember]
    };
    setLocalPEM(updatedPEM);
    syncUpdate(localCentro, updatedPEM);
  };

  const handleUpdateMember = (id: string, field: keyof TaldeEragileaKidea, value: string) => {
    const updatedMembers = (localPEM.talde_eragilea || []).map(m => 
      m.id === id ? { ...m, [field]: value } : m
    );
    const updatedPEM = { ...localPEM, talde_eragilea: updatedMembers };
    setLocalPEM(updatedPEM);
    syncUpdate(localCentro, updatedPEM);
  };

  const handleRemoveMember = (id: string) => {
    const updatedMembers = (localPEM.talde_eragilea || []).filter(m => m.id !== id);
    const updatedPEM = { ...localPEM, talde_eragilea: updatedMembers };
    setLocalPEM(updatedPEM);
    syncUpdate(localCentro, updatedPEM);
  };

  const advisors = ["Sorkunde Etxebarria", "Javier Borrego", "Ana Azkona", "Marije Torre", "Marisol Antolín", "Ainhoa Moiua"];
  const territories = ["Araba", "Bizkaia", "Gipuzkoa"];
  const schoolTypes = ["Publikoa", "Itunpekoa"];
  const models = ["A", "B", "D"];
  const challenges = ["Digitalizazioa", "Inklusioa", "Bizikidetza", "Berrikuntza", "Metodologia"];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100 flex items-center">
            <School className="w-5 h-5 mr-2 text-blue-600" />
            Ikastetxearen Datuak
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Izena</label>
            <input 
              type="text" 
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={localCentro.nombre}
              onChange={e => handleCentroChange('nombre', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center">
               <Zap className="w-4 h-4 mr-1 text-amber-500" /> Erronka Nagusia
            </label>
            <select 
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all bg-white font-bold text-slate-700"
              value={localCentro.erronka_nagusia || ''}
              onChange={e => handleCentroChange('erronka_nagusia', e.target.value)}
            >
              <option value="">Aukeratu erronka...</option>
              {challenges.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Lurraldea</label>
            <select 
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
              value={localCentro.lurraldea}
              onChange={e => handleCentroChange('lurraldea', e.target.value)}
            >
              <option value="">Aukeratu lurraldea...</option>
              {territories.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Ikastetxe Mota</label>
            <select 
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
              value={localCentro.eskola_mota}
              onChange={e => handleCentroChange('eskola_mota', e.target.value)}
            >
              <option value="">Aukeratu mota...</option>
              {schoolTypes.map(st => <option key={st} value={st}>{st}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Eredua</label>
            <select 
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
              value={localCentro.eredua || ''}
              onChange={e => handleCentroChange('eredua', e.target.value)}
            >
              <option value="">Aukeratu eredua...</option>
              {models.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Aholkularia</label>
            <select 
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
              value={localCentro.aholkularia}
              onChange={e => handleCentroChange('aholkularia', e.target.value)}
            >
              <option value="">Aukeratu aholkularia...</option>
              {advisors.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Garapen Orokorra (0-10)</label>
            <input 
              type="number" 
              step="0.01"
              min="0"
              max="10"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={localCentro.garapen_orokorra || ''}
              onChange={e => handleCentroChange('garapen_orokorra', e.target.value === '' ? null : parseFloat(e.target.value))}
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
            Hobekuntza Plana (HP)
        </h2>
        <div className="space-y-6">
          <div className="max-w-xs">
              <label className="flex items-center text-sm font-semibold text-slate-700 mb-1">Hasiera Data</label>
              <input 
                type="date" 
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={localPEM.fecha_inicio}
                onChange={e => handlePEMChange('fecha_inicio', e.target.value)}
              />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Prozesuaren Deskribapena</label>
            <textarea 
              rows={4}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl resize-none focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="Nola diseinatu eta adostu da plana?..."
              value={localPEM.descripcion_proceso}
              onChange={e => handlePEMChange('descripcion_proceso', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 flex items-center"><Users className="w-5 h-5 mr-2 text-emerald-600" />Talde Eragilea</h2>
            <button 
                onClick={handleAddMember}
                className="flex items-center space-x-2 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-sm font-bold transition-all border border-emerald-100 shadow-sm"
            >
                <UserPlus className="w-4 h-4" /><span>Kide Berria</span>
            </button>
        </div>
        <div className="space-y-4">
            {(localPEM.talde_eragilea || []).length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                <th className="pb-3 px-2">Izena eta Abizenak</th>
                                <th className="pb-3 px-2">Kargua / Funtzioa</th>
                                <th className="pb-3 px-2 w-16 text-center">Ekintza</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {(localPEM.talde_eragilea || []).map((member) => (
                                <tr key={member.id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="py-3 px-2">
                                        <input 
                                            type="text"
                                            className="w-full bg-transparent border-none p-1 text-sm text-slate-700 font-medium focus:ring-1 focus:ring-emerald-200 rounded outline-none"
                                            placeholder="Adib: Miren Agirre..."
                                            value={member.izena}
                                            onChange={(e) => handleUpdateMember(member.id, 'izena', e.target.value)}
                                        />
                                    </td>
                                    <td className="py-3 px-2">
                                        <input 
                                            type="text"
                                            className="w-full bg-transparent border-none p-1 text-sm text-slate-500 italic focus:ring-1 focus:ring-emerald-200 rounded outline-none"
                                            placeholder="Adib: Ikasketa Burua..."
                                            value={member.kargua}
                                            onChange={(e) => handleUpdateMember(member.id, 'kargua', e.target.value)}
                                        />
                                    </td>
                                    <td className="py-3 px-2 text-center">
                                        <button onClick={() => handleRemoveMember(member.id)} className="text-slate-300 hover:text-red-500 transition-colors p-1"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <Users className="w-10 h-10 text-slate-300 mb-2" /><p className="text-sm text-slate-500 italic">Ez da Talde Eragileko kiderik zehaztu oraindik.</p>
                </div>
            )}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button onClick={handleSave} className="flex items-center space-x-3 px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl transition-all active:scale-95 group"><Save className="w-6 h-6 group-hover:rotate-12 transition-transform" /><span>Gorde Datu Guztiak</span></button>
      </div>
    </div>
  );
};

export default SchoolForm;
