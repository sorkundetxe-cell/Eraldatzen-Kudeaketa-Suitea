import React from 'react';
import { Download, BookOpen } from 'lucide-react';
import { generateUserManual } from '../services/reportService';

const HelpManual: React.FC = () => {
  
  const handleDownload = (lang: 'eu' | 'es') => {
    generateUserManual(lang);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center justify-center">
            <BookOpen className="w-10 h-10 mr-4 text-blue-600" />
            Erabiltzailearen Eskuliburua
        </h1>
        <p className="text-slate-500 mt-4 text-lg max-w-2xl mx-auto leading-relaxed">
            Aplikazioa erabiltzeko gida osoa, urratsez urrats eta adibide praktikoekin.
            Hautatu hizkuntza dokumentua Word formatuan deskargatzeko.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Euskara Button */}
          <button 
            onClick={() => handleDownload('eu')}
            className="flex flex-col items-center justify-center p-10 bg-white border-2 border-slate-100 hover:border-blue-500 rounded-2xl shadow-sm hover:shadow-xl transition-all group"
          >
            <div className="p-6 bg-blue-50 rounded-full mb-6 group-hover:bg-blue-100 transition-colors">
                <Download className="w-10 h-10 text-blue-600" />
            </div>
            <span className="text-xl font-bold text-slate-800 mb-2">Eskuliburua Deskargatu</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full">Euskara</span>
          </button>

          {/* Castellano Button */}
          <button 
            onClick={() => handleDownload('es')}
            className="flex flex-col items-center justify-center p-10 bg-white border-2 border-slate-100 hover:border-slate-500 rounded-2xl shadow-sm hover:shadow-xl transition-all group"
          >
            <div className="p-6 bg-slate-100 rounded-full mb-6 group-hover:bg-slate-200 transition-colors">
                <Download className="w-10 h-10 text-slate-600" />
            </div>
            <span className="text-xl font-bold text-slate-800 mb-2">Descargar Manual</span>
            <span className="px-3 py-1 bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-full">Castellano</span>
          </button>
      </div>

      <div className="mt-16 text-center text-slate-400 text-sm">
        <p>Dokumentuak Word (.doc) formatuan deskargatuko dira editatu ahal izateko.</p>
      </div>

    </div>
  );
};

export default HelpManual;