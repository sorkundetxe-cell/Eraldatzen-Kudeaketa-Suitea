
import React, { useEffect, useState } from 'react';
import { getAllSchools, exportToCSV, exportCredentials, backupDatabase, pullFromCloud, addManualSchool, getStreamlitEntries } from '../services/storageService';
import { generateWordReport } from '../services/reportService';
import { SchoolData, HelburuZehaztua, StreamlitEntry } from '../types';
import { 
  Download, Search, Eye, KeyRound, FileDown, Plus, X,
  BarChart3, Target, Heart, Layers, GraduationCap, Activity, Database, RefreshCw, Clock, MessageSquare, ExternalLink
} from 'lucide-react';

interface AdminDashboardProps {
  onViewSchool: (code: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onViewSchool }) => {
  const [schools, setSchools] = useState<SchoolData[]>([]);
  const [streamlitEntries, setStreamlitEntries] = useState<StreamlitEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSchool, setNewSchool] = useState({ code: '', name: '' });
  const [activeTab, setActiveTab] = useState<'network' | 'leads'>('network');

  const refreshData = async (silent = false) => {
    if (!silent) setIsSyncing(true);
    await pullFromCloud(); 
    const allData = await getAllSchools();
    const entries = getStreamlitEntries();
    setSchools(allData);
    setStreamlitEntries(entries);
    setLastSyncTime(new Date());
    if (!silent) setIsSyncing(false);
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(() => { refreshData(true); }, 30000); 
    return () => clearInterval(interval);
  }, []);

  const filteredSchools = schools.filter(s => 
    s.centro.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.centro.codigo_centro.includes(searchTerm)
  );

  const handleAddSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchool.code || !newSchool.name) return;
    const success = await addManualSchool(newSchool.code, newSchool.name);
    if (success) {
      setShowAddModal(false);
      refreshData();
    }
  };

  const calculateSchoolObjectivesAvg = (objectives: HelburuZehaztua[]) => {
    if (!objectives || objectives.length === 0) return 0;
    let totalSum = 0; let count = 0;
    objectives.forEach(obj => {
      if (obj.adierazleak && obj.adierazleak.length > 0) {
        const indAvg = obj.adierazleak.reduce((acc, curr) => acc + (curr.lorpen_maila || 0), 0) / obj.adierazleak.length;
        totalSum += indAvg; count++;
      }
    });
    return count > 0 ? totalSum / count : 0;
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="bg-slate-900 text-white p-10 rounded-[2rem] shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8 border-b-[12px] border-blue-600">
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">Sarearen Kontrola</h1>
          <div className="flex items-center mt-4 space-x-3">
            <div className={`w-3 h-3 rounded-full ${isSyncing ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`}></div>
            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest opacity-80">
                Cloud Auto-Sync Aktibatuta • {schools.length} Ikastetxe • {streamlitEntries.length} Sarrera Berri
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => refreshData()} disabled={isSyncing} className="flex items-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-black rounded-2xl transition-all border border-white/10 shadow-lg active:scale-95">
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>SINKRONIZATU</span>
          </button>
          <button onClick={() => setShowAddModal(true)} className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all shadow-lg active:scale-95">
            <Plus className="w-4 h-4" />
            <span>IKASTETXEA GEHITU</span>
          </button>
        </div>
      </div>

      <div className="flex bg-white p-2 rounded-2xl shadow-sm border border-slate-200 w-fit">
          <button onClick={() => setActiveTab('network')} className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === 'network' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>IKASTETXEEN SAREA</button>
          <button onClick={() => setActiveTab('leads')} className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all flex items-center space-x-2 ${activeTab === 'leads' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>
            <span>SARRERA BERRIAK (STREAMLIT)</span>
            {streamlitEntries.length > 0 && <span className="bg-white text-blue-600 px-2 py-0.5 rounded-full text-[10px]">{streamlitEntries.length}</span>}
          </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-4">
              {activeTab === 'network' ? (
                <>
                  <div className="flex items-center space-x-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <Search className="w-5 h-5 text-slate-400" />
                    <input type="text" placeholder="Bilatu ikastetxea..." className="flex-1 outline-none text-slate-700 bg-transparent font-black uppercase text-sm tracking-tight" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  </div>
                  <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 border-b border-slate-100">
                        <tr>
                          <th className="px-8 py-6">Kodea</th>
                          <th className="px-8 py-6">Ikastetxea</th>
                          <th className="px-8 py-6 text-center">Garapena</th>
                          <th className="px-8 py-6 text-center">Helburuak</th>
                          <th className="px-8 py-6 text-right">Ekintzak</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filteredSchools.map((s) => (
                          <tr key={s.centro.codigo_centro} className="hover:bg-slate-50/80 transition-all group">
                            <td className="px-8 py-6 font-mono font-black text-slate-400">{s.centro.codigo_centro}</td>
                            <td className="px-8 py-6">
                              <div className="font-black text-slate-800 uppercase tracking-tight">{s.centro.nombre}</div>
                              <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1 flex items-center"><Clock className="w-3 h-3 mr-1" />Azken karga: {s.lastUpdated ? new Date(s.lastUpdated).toLocaleString() : '-'}</div>
                            </td>
                            <td className="px-8 py-6 text-center"><span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg font-black">{s.centro.garapen_orokorra || '-'}</span></td>
                            <td className="px-8 py-6 text-center font-black text-rose-600">{calculateSchoolObjectivesAvg(s.objectives).toFixed(1)}%</td>
                            <td className="px-8 py-6 text-right"><div className="flex justify-end space-x-2"><button onClick={() => onViewSchool(s.centro.codigo_centro)} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"><Eye className="w-5 h-5" /></button><button onClick={() => generateWordReport(s)} className="p-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"><FileDown className="w-5 h-5" /></button></div></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                    {streamlitEntries.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {streamlitEntries.slice().reverse().map((entry, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:border-blue-300 transition-all group">
                                    <div className="flex justify-between items-start">
                                        <div className="bg-blue-50 text-blue-600 p-2 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors"><MessageSquare className="w-5 h-5" /></div>
                                        <span className="text-[10px] font-black text-slate-300 uppercase">{new Date(entry.data).toLocaleDateString()}</span>
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-800 uppercase text-lg leading-none">{entry.ikastetxea}</h4>
                                        <span className="inline-block mt-2 px-2 py-1 bg-amber-50 text-amber-600 text-[9px] font-black rounded uppercase">{entry.erronka}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 line-clamp-3">{entry.deskribapena}</p>
                                    <div className="pt-4 border-t border-slate-50 flex justify-end">
                                        <button className="flex items-center space-x-1 text-[10px] font-black text-blue-600 uppercase hover:underline">
                                            <span>Erregistratu sarean</span>
                                            <ExternalLink className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white p-20 rounded-3xl border-2 border-dashed border-slate-200 text-center space-y-4">
                            <MessageSquare className="w-12 h-12 text-slate-200 mx-auto" />
                            <p className="text-slate-400 font-bold italic">Ez da sarrera berririk aurkitu Streamlit inprimakian.</p>
                        </div>
                    )}
                </div>
              )}
          </div>

          <div className="space-y-6">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
                  <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs">Tresnak</h3>
                  <button onClick={exportCredentials} className="w-full flex items-center justify-between p-4 bg-amber-50 text-amber-800 rounded-2xl font-black text-xs uppercase"><span>PIN Zerrenda</span><KeyRound className="w-4 h-4" /></button>
                  <button onClick={exportToCSV} className="w-full flex items-center justify-between p-4 bg-indigo-50 text-indigo-800 rounded-2xl font-black text-xs uppercase"><span>Globala (CSV)</span><Download className="w-4 h-4" /></button>
                  <button onClick={backupDatabase} className="w-full flex items-center justify-between p-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase"><span>Backup Osoa</span><Database className="w-4 h-4" /></button>
              </div>
          </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-10 space-y-8">
              <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Ikastetxe Berria</h3>
              <form onSubmit={handleAddSchool} className="space-y-6">
                <div className="space-y-4">
                    <input type="text" required placeholder="KODEA (Adib: 010203)" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-black outline-none" value={newSchool.code} onChange={(e) => setNewSchool({...newSchool, code: e.target.value})} />
                    <input type="text" required placeholder="IKASTETXEAREN IZENA" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-black outline-none uppercase" value={newSchool.name} onChange={(e) => setNewSchool({...newSchool, name: e.target.value})} />
                </div>
                <div className="flex gap-4">
                    <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl uppercase text-xs">Utzi</button>
                    <button type="submit" className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl uppercase text-xs shadow-lg shadow-blue-100">Sortu</button>
                </div>
              </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
