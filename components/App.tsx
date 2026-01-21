
import React, { useState, useEffect } from 'react';
import { ViewState, CentroEducativo, PlanEstrategicoMejora, AsebetetzeMailaEmaitza, PalankenEmaitza, EmaitzaAkademikoa, DocumentData, AmiaAnalisis, HelburuZehaztua, SchoolData } from '../types';
import { 
  DEFAULT_CENTRO, DEFAULT_PEM, DEFAULT_SATISFACTION, DEFAULT_PALANCAS, DEFAULT_ACADEMIC, DEFAULT_AMIA, DEFAULT_DOCUMENTS 
} from '../constants';
import { getSchoolData, saveSchoolData, pullFromCloud } from '../services/storageService';
import { generateWordReport } from '../services/reportService';

import Dashboard from './Dashboard';
import SchoolForm from './SchoolForm';
import SatisfactionPanel from './SatisfactionPanel';
import PalancasPanel from './PalancasPanel';
import AcademicPanel from './AcademicPanel';
import AmiaPanel from './AmiaPanel';
import ObjectivesPanel from './ObjectivesPanel';
import DocumentUpload from './DocumentUpload';
import GeminiAssistant from './GeminiAssistant';
import Login from './Login';
import AdminDashboard from './AdminDashboard';
import HelpManual from './HelpManual';
import { LayoutDashboard, School, Heart, Sparkles, Menu, Layers, GraduationCap, FileText, LogOut, ArrowUpRight, Target, ShieldCheck, FileDown, HelpCircle, Save, Cloud, CloudOff } from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentSchoolCode, setCurrentSchoolCode] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [cloudStatus, setCloudStatus] = useState<'synced' | 'syncing' | 'error'>('synced');

  const [view, setView] = useState<ViewState | 'admin'>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Core State
  const [centro, setCentro] = useState<CentroEducativo>(DEFAULT_CENTRO);
  const [pem, setPem] = useState<PlanEstrategicoMejora>(DEFAULT_PEM);
  const [satisfaction, setSatisfaction] = useState<AsebetetzeMailaEmaitza>(DEFAULT_SATISFACTION);
  const [palancas, setPalancas] = useState<PalankenEmaitza>(DEFAULT_PALANCAS);
  const [academic, setAcademic] = useState<EmaitzaAkademikoa>(DEFAULT_ACADEMIC);
  const [amia, setAmia] = useState<AmiaAnalisis>(DEFAULT_AMIA);
  const [objectives, setObjectives] = useState<HelburuZehaztua[]>([]);
  const [documents, setDocuments] = useState<DocumentData>(DEFAULT_DOCUMENTS);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');

  // Initial Cloud Pull on Load
  useEffect(() => {
    const initCloud = async () => {
      setCloudStatus('syncing');
      await pullFromCloud();
      setCloudStatus('synced');
    };
    initCloud();
  }, []);

  // Load School Data on Login
  useEffect(() => {
    if (isAuthenticated && currentSchoolCode && !isAdmin) {
      const data = getSchoolData(currentSchoolCode);
      setCentro(data.centro);
      setPem(data.pem);
      setSatisfaction(data.satisfaction);
      setPalancas(data.palancas);
      setAcademic(data.academic);
      setAmia(data.amia);
      setObjectives(data.objectives || []);
      setDocuments(data.documents);
      setAiAnalysis(data.aiAnalysis || '');
    }
  }, [isAuthenticated, currentSchoolCode, isAdmin]);

  // CLOUD AUTO-SAVE: Debounced
  useEffect(() => {
    if (isAuthenticated && currentSchoolCode && !isAdmin && currentSchoolCode !== '000000') {
      const timer = setTimeout(async () => {
        setIsSaving(true);
        setCloudStatus('syncing');
        const dataToSave: SchoolData = {
          centro, pem, satisfaction, palancas, academic, amia, objectives, documents, aiAnalysis,
          lastUpdated: new Date().toISOString()
        };
        try {
          await saveSchoolData(currentSchoolCode, dataToSave);
          setCloudStatus('synced');
        } catch (e) {
          setCloudStatus('error');
        }
        setIsSaving(false);
      }, 2000); 
      return () => clearTimeout(timer);
    }
  }, [centro, pem, satisfaction, palancas, academic, amia, objectives, documents, aiAnalysis, isAuthenticated, currentSchoolCode, isAdmin]);

  const handleLogin = (code: string) => {
    if (code === 'ADMIN') {
      setIsAdmin(true);
      setIsAuthenticated(true);
      setView('admin');
      localStorage.setItem('ERALDATZEN_IS_ADMIN_SESSION', 'true');
    } else {
      setIsAdmin(false);
      setCurrentSchoolCode(code);
      setIsAuthenticated(true);
      setView('dashboard');
      localStorage.removeItem('ERALDATZEN_IS_ADMIN_SESSION');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    setCurrentSchoolCode('');
    setCentro(DEFAULT_CENTRO);
    setView('dashboard');
    localStorage.removeItem('ERALDATZEN_IS_ADMIN_SESSION');
  };

  const handleAdminViewSchool = (code: string) => {
    setIsAdmin(false);
    setCurrentSchoolCode(code);
    setView('dashboard');
  };

  const NavItem = ({ id, label, icon: Icon }: { id: ViewState | 'admin', label: string, icon: any }) => (
    <button
      onClick={() => { setView(id); setSidebarOpen(false); }}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${view === id ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 scale-[1.02]' : 'text-slate-600 hover:bg-slate-100'}`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-bold text-sm tracking-tight">{label}</span>
    </button>
  );

  if (!isAuthenticated) return <Login onLogin={handleLogin} />;

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      {isSidebarOpen && <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-full flex flex-col">
          <div className={`p-8 border-b border-slate-100 ${isAdmin ? 'bg-slate-900 text-white' : ''}`}>
            <h1 className="text-3xl font-black text-blue-700 font-mono tracking-tighter">ERALDATZEN</h1>
            <div className="flex items-center mt-2 space-x-2">
                <div className={`w-2 h-2 rounded-full ${cloudStatus === 'synced' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {cloudStatus === 'synced' ? 'Cloud Sinkronizatuta' : 'Hodeiarekin konektatzen...'}
                </p>
            </div>
          </div>
          
          <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
            {isAdmin ? <NavItem id="admin" label="Administrazio Panela" icon={ShieldCheck} /> : (
              <>
                <NavItem id="dashboard" label="Aginte-panela" icon={LayoutDashboard} />
                <NavItem id="school" label="Ikastetxea & HP" icon={School} />
                <NavItem id="amia" label="AMIA (DAFO)" icon={ArrowUpRight} />
                <NavItem id="objectives" label="Helburuak" icon={Target} />
                <NavItem id="satisfaction" label="Asebetetzea" icon={Heart} />
                <NavItem id="palancas" label="Palankak" icon={Layers} />
                <NavItem id="academic" label="Emaitzak" icon={GraduationCap} />
                <NavItem id="documents" label="Dokumentuak" icon={FileText} />
                <NavItem id="ai-assistant" label="IA Analisia" icon={Sparkles} />
                <div className="pt-6 mt-6 border-t border-slate-100">
                  <NavItem id="help" label="Eskuliburua" icon={HelpCircle} />
                </div>
              </>
            )}
          </nav>
          
          <div className="p-6 border-t border-slate-100 space-y-4">
            {!isAdmin && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xs">
                      {centro.nombre.substring(0,2).toUpperCase()}
                    </div>
                    <p className="text-xs font-black text-slate-800 truncate uppercase">{centro.nombre}</p>
                </div>
                <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>Status:</span>
                  <span className={cloudStatus === 'synced' ? 'text-emerald-500' : 'text-amber-500'}>
                    {cloudStatus === 'synced' ? 'Gordeta' : 'Gordetzen...'}
                  </span>
                </div>
              </div>
            )}
            <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all"><LogOut className="w-4 h-4" /><span>Saioa itxi</span></button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50/50">
        <header className="lg:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between">
            <h1 className="font-black text-xl text-blue-700 tracking-tighter">ERALDATZEN</h1>
            <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-600"><Menu className="w-6 h-6" /></button>
        </header>
        
        <div className="flex-1 overflow-auto p-6 lg:p-10">
          <div className="max-w-7xl mx-auto">
            {isAdmin && view === 'admin' ? <AdminDashboard onViewSchool={handleAdminViewSchool} /> : (
              <>
                {view === 'dashboard' && <Dashboard centro={centro} pem={pem} satisfaction={satisfaction} palancas={palancas} academic={academic} objectives={objectives} />}
                {view === 'school' && <SchoolForm centro={centro} pem={pem} satisfaction={satisfaction} onUpdate={(c, p) => { setCentro(c); setPem(p); }} />}
                {view === 'amia' && <AmiaPanel data={amia} onUpdate={setAmia} />}
                {view === 'objectives' && <ObjectivesPanel objectives={objectives} onUpdate={setObjectives} />}
                {view === 'satisfaction' && <SatisfactionPanel data={satisfaction} onUpdate={setSatisfaction} />}
                {view === 'palancas' && <PalancasPanel data={palancas} onUpdate={setPalancas} />}
                {view === 'academic' && <AcademicPanel data={academic} onUpdate={setAcademic} />}
                {view === 'documents' && <DocumentUpload data={documents} onUpdate={setDocuments} />}
                {view === 'ai-assistant' && <GeminiAssistant centro={centro} pem={pem} satisfaction={satisfaction} palancas={palancas} academic={academic} amia={amia} objectives={objectives} documents={documents} aiAnalysis={aiAnalysis} onAnalysisUpdate={setAiAnalysis} />}
                {view === 'help' && <HelpManual />}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
