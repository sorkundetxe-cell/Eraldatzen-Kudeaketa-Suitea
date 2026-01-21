
import React, { useEffect, useState, useRef } from 'react';
import { getAllSchools, exportToCSV, exportCredentials, backupDatabase, pullFromCloud, addManualSchool } from '../services/storageService';
import { generateWordReport } from '../services/reportService';
import { SchoolData, HelburuZehaztua } from '../types';
import { 
  Download, Search, Eye, KeyRound, FileDown, Plus, X,
  BarChart3, Target, Heart, Layers, GraduationCap, Activity, Database, Upload, RefreshCw, CheckCircle2, AlertCircle, CloudDownload
} from 'lucide-react';

interface AdminDashboardProps {
  onViewSchool: (code: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onViewSchool }) => {
  const [schools, setSchools] = useState<SchoolData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSchool, setNewSchool] = useState({ code: '', name: '' });

  const refreshData = async () => {
    setIsSyncing(true);
    await pullFromCloud(); // Force pull latest from shared cloud
    const allData = getAllSchools();
    setSchools(allData);
    setIsSyncing(false);
  };

  useEffect(() => {
    refreshData();
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
          <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">
            Sarearen Kontrola
          </h1>
          <p className="text-slate-400 mt-4 font-bold uppercase text-xs tracking-widest opacity-80">
            Cloud Sinkronizazio Geruza Aktibatuta • {schools.length} Ikastetxe
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={refreshData}
            disabled={isSyncing}
            className="flex items-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-black rounded-2xl transition-all border border-white/10 shadow-lg active:scale-95 disabled:opacity-50"
          >
            <CloudDownload className={`w-4 h-4 ${isSyncing ? 'animate-bounce' : ''}`} />
            <span>{isSyncing ? 'SINKRONIZATZEN...' : 'HODEITIK EGUNERATU'}</span>
          </button>
          <button onClick={() => setShowAddModal(true)} className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all shadow-lg active:scale-95">
            <Plus className="w-4 h-4" />
            <span>IKASTETXEA GEHITU</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-4">
              <div className="flex items-center space-x-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <Search className="w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Bilatu ikastetxea izena edo kodea..." 
                  className="flex-1 outline-none text-slate-700 bg-transparent font-black uppercase text-sm tracking-tight" 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                />
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
                          <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">Azken karga: {s.lastUpdated ? new Date(s.lastUpdated).toLocaleString() : '-'}</div>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg font-black">{s.centro.garapen_orokorra || '-'}</span>
                        </td>
                        <td className="px-8 py-6 text-center font-black text-rose-600">
                          {calculateSchoolObjectivesAvg(s.objectives).toFixed(1)}%
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex justify-end space-x-2">
                            <button onClick={() => onViewSchool(s.centro.codigo_centro)} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><Eye className="w-5 h-5" /></button>
                            <button onClick={() => generateWordReport(s)} className="p-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-900 hover:text-white transition-all"><FileDown className="w-5 h-5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          </div>

          <div className="space-y-6">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
                  <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs">Administrazio Tresnak</h3>
                  <button onClick={exportCredentials} className="w-full flex items-center justify-between p-4 bg-amber-50 text-amber-800 rounded-2xl hover:bg-amber-100 transition-all font-black text-xs uppercase tracking-widest">
                    <span>PIN Kodeen Zerrenda</span>
                    <KeyRound className="w-4 h-4" />
                  </button>
                  <button onClick={exportToCSV} className="w-full flex items-center justify-between p-4 bg-indigo-50 text-indigo-800 rounded-2xl hover:bg-indigo-100 transition-all font-black text-xs uppercase tracking-widest">
                    <span>Izara Globala (CSV)</span>
                    <Download className="w-4 h-4" />
                  </button>
                  <button onClick={backupDatabase} className="w-full flex items-center justify-between p-4 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all font-black text-xs uppercase tracking-widest">
                    <span>Cloud Backup Osoa</span>
                    <Database className="w-4 h-4" />
                  </button>
              </div>
          </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden p-10 space-y-8 animate-in zoom-in-95">
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Ikastetxe Berria</h3>
                <p className="text-slate-400 text-sm font-medium">Sartu kodea eta izen ofiziala sarean gehitzeko.</p>
              </div>
              <form onSubmit={handleAddSchool} className="space-y-6">
                <input type="text" required placeholder="KODEA (Adib: 010203)" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-black outline-none focus:ring-4 focus:ring-blue-100" value={newSchool.code} onChange={(e) => setNewSchool({...newSchool, code: e.target.value})} />
                <input type="text" required placeholder="IKASTETXEAREN IZENA" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-black outline-none focus:ring-4 focus:ring-blue-100 uppercase" value={newSchool.name} onChange={(e) => setNewSchool({...newSchool, name: e.target.value})} />
                <div className="flex gap-4">
                    <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl uppercase tracking-widest text-xs">Utzi</button>
                    <button type="submit" className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl uppercase tracking-widest text-xs shadow-lg shadow-blue-100">Sortu</button>
                </div>
              </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
