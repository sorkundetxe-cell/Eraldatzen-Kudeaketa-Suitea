
import React, { useState, useEffect } from 'react';
import { ViewState, CentroEducativo, PlanEstrategicoMejora, AsebetetzeMailaEmaitza, PalankenEmaitza, EmaitzaAkademikoa, DocumentData, AmiaAnalisis, HelburuZehaztua, SchoolData } from './types';
import { 
  DEFAULT_CENTRO, DEFAULT_PEM, DEFAULT_SATISFACTION, DEFAULT_PALANCAS, DEFAULT_ACADEMIC, DEFAULT_AMIA, DEFAULT_DOCUMENTS 
} from './constants';
import { getSchoolData, saveSchoolData } from './services/storageService';
import { generateWordReport } from './services/reportService';

import Dashboard from './components/Dashboard';
import SchoolForm from './components/SchoolForm';
import SatisfactionPanel from './components/SatisfactionPanel';
import PalancasPanel from './components/PalancasPanel';
import AcademicPanel from './components/AcademicPanel';
import AmiaPanel from './components/AmiaPanel';
import ObjectivesPanel from './components/ObjectivesPanel';
import DocumentUpload from './components/DocumentUpload';
import GeminiAssistant from './components/GeminiAssistant';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import HelpManual from './components/HelpManual';
import { LayoutDashboard, School, Heart, Sparkles, Menu, Layers, GraduationCap, FileText, LogOut, ArrowUpRight, Target, ShieldCheck, FileDown, HelpCircle, Save, Database } from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentSchoolCode, setCurrentSchoolCode] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

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

  // Load Data on Login
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

  // AUTO-SAVE MECHANISM: Debounced to ensure data integrity and performance
  useEffect(() => {
    if (isAuthenticated && currentSchoolCode && !isAdmin && currentSchoolCode !== '000000') {
      const timer = setTimeout(() => {
        setIsSaving(true);
        const dataToSave: SchoolData = {
          centro, pem, satisfaction, palancas, academic, amia, objectives, documents, aiAnalysis,
          lastUpdated: new Date().toISOString()
        };
        saveSchoolData(currentSchoolCode, dataToSave);
        
        // Visual indicator timeout
        setTimeout(() => setIsSaving(false), 800);
      }, 500); // 500ms delay after typing
      
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
    setAiAnalysis('');
    setView('dashboard');
    localStorage.removeItem('ERALDATZEN_IS_ADMIN_SESSION');
  };

  const handleAdminViewSchool = (code: string) => {
    setIsAdmin(false);
    setCurrentSchoolCode(code);
    setView('dashboard');
  };

  const handleDownloadReport = () => {
    const currentData: SchoolData = { centro, pem, satisfaction, palancas, academic, amia, objectives, documents, aiAnalysis, lastUpdated: new Date().toISOString() };
    generateWordReport(currentData);
  };

  const NavItem = ({ id, label, icon: Icon }: { id: ViewState | 'admin', label: string, icon: any }) => (
    <button
      onClick={() => { setView(id); setSidebarOpen(false); }}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${view === id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium text-sm">{label}</span>
    </button>
  );

  if (!isAuthenticated) return <Login onLogin={handleLogin} />;

  return (
    <div className="min-h-screen flex bg-slate-50">
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out print:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-full flex flex-col">
          <div className={`p-6 border-b border-slate-100 ${isAdmin ? 'bg-slate-900 text-white' : ''}`}>
            <h1 className="text-2xl font-bold text-blue-700 font-mono tracking-tighter uppercase">ERALDATZEN</h1>
            <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest">{isAdmin ? 'ADMINISTRAZIOA' : 'Hezkuntza Kudeaketa'}</p>
          </div>
          
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {isAdmin ? <NavItem id="admin" label="Administrazio Panela" icon={ShieldCheck} /> : (
              <>
                <NavItem id="dashboard" label="Aginte-panela" icon={LayoutDashboard} />
                <NavItem id="school" label="Ikastetxea & HP" icon={School} />
                <NavItem id="amia" label="AMIA (DAFO)" icon={ArrowUpRight} />
                <NavItem id="objectives" label="Helburuak" icon={Target} />
                <NavItem id="satisfaction" label="Asebetetzea" icon={Heart} />
                <NavItem id="palancas" label="Palankak" icon={Layers} />
                <NavItem id="academic" label="Emaitza Akademikoak" icon={GraduationCap} />
                <NavItem id="documents" label="Dokumentuak" icon={FileText} />
                <NavItem id="ai-assistant" label="IA Analisia" icon={Sparkles} />
                <div className="pt-4 mt-4 border-t border-slate-100">
                  <NavItem id="help" label="Eskuliburua" icon={HelpCircle} />
                </div>
              </>
            )}
          </nav>
          
          <div className="p-4 border-t border-slate-100 space-y-4">
            {!isAdmin && (
              <div className="flex items-center space-x-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xs shadow-md">
                  {centro.nombre.substring(0,2).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-black text-slate-800 truncate uppercase">{centro.nombre}</p>
                  <div className="flex items-center text-[10px] font-bold mt-0.5">
                    {isSaving ? (
                      <span className="flex items-center text-blue-500 animate-pulse">
                         <Save className="w-3 h-3 mr-1" /> Gordetzen...
                      </span>
                    ) : (
                      <span className="flex items-center text-emerald-500">
                         <ShieldCheck className="w-3 h-3 mr-1" /> Gordeta
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
            {!isAdmin && localStorage.getItem('ERALDATZEN_IS_ADMIN_SESSION') === 'true' && (
               <button onClick={() => { setIsAdmin(true); setView('admin'); }} className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-slate-700 transition-all shadow-sm"><ShieldCheck className="w-4 h-4" /><span>Admin Panelera</span></button>
            )}
            <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-slate-200 transition-colors"><LogOut className="w-4 h-4" /><span>Saioa itxi</span></button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden print:h-auto print:overflow-visible bg-slate-50/50">
        <header className="lg:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between print:hidden">
            <h1 className="font-black text-lg text-blue-700 tracking-tighter">ERALDATZEN</h1>
            <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-600 rounded-lg"><Menu className="w-6 h-6" /></button>
        </header>
        
        <div className="flex-1 overflow-auto p-4 lg:p-8 print:p-0 print:overflow-visible">
          <div className="max-w-7xl mx-auto">
            {/* Page Header (Desktop) */}
            {!isAdmin && view !== 'admin' && view !== 'help' && (
              <header className="mb-8 hidden lg:flex justify-between items-start print:hidden">
                <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                            {view === 'dashboard' && 'Aginte-panela'}
                            {view === 'school' && 'Ikastetxea eta HP'}
                            {view === 'amia' && 'AMIA Diagnostikoa'}
                            {view === 'objectives' && 'Helburu Zehatzak'}
                            {view === 'satisfaction' && 'Asebetetze Maila'}
                            {view === 'palancas' && 'Eraldaketa Palankak'}
                            {view === 'academic' && 'Emaitza Akademikoak'}
                            {view === 'documents' && 'Dokumentu Kudeaketa'}
                            {view === 'ai-assistant' && 'Adimen Artifiziala'}
                        </h1>
                        {isSaving && <span className="flex items-center space-x-1.5 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black animate-pulse uppercase tracking-wider"><Save className="w-3 h-3"/><span>Gordetzen</span></span>}
                    </div>
                    <p className="text-slate-500 font-medium text-sm">
                        {view === 'dashboard' && 'Sareko garapen globalaren laburpena.'}
                        {view === 'school' && 'Ikastetxearen datuak eta Hobekuntza Plana.'}
                        {view === 'amia' && 'Egoeraren diagnostiko estrategikoa (DAFO).'}
                        {view === 'objectives' && 'Ikasturtean landu beharreko helburuak.'}
                        {view === 'satisfaction' && 'Asebetetze-inkesten emaitzak.'}
                        {view === 'palancas' && 'Palanken jarraipena eta RdC1 monitoreoa.'}
                        {view === 'academic' && 'Konpetentziak eta promozio tasak.'}
                        {view === 'documents' && 'Ebidentziak eta fitxategi kudeaketa.'}
                        {view === 'ai-assistant' && 'Gemini IA bidezko analisi sakona.'}
                    </p>
                </div>
                <button 
                    onClick={handleDownloadReport}
                    className="flex items-center space-x-2 px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-indigo-700 font-black rounded-2xl shadow-sm transition-all active:scale-95 border-b-4 border-indigo-100 hover:border-b-2 hover:translate-y-0.5"
                >
                    <FileDown className="w-5 h-5" />
                    <span className="text-sm">DESKARGATU TXOSTENA</span>
                </button>
              </header>
            )}

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
