
import React, { useRef, useState } from 'react';
import { DocumentData, PalankaDoc } from '../types';
import { FileText, Upload, AlertCircle, Link as LinkIcon, Trash2, Plus, FileType, Save } from 'lucide-react';

interface DocumentUploadProps {
  data: DocumentData;
  onUpdate: (data: DocumentData) => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ data, onUpdate }) => {
  const [localData, setLocalData] = useState<DocumentData>(data);
  const pemFileInputRef = useRef<HTMLInputElement>(null);
  const palancaFileInputRef = useRef<HTMLInputElement>(null);
  const [newPalancaDoc, setNewPalancaDoc] = useState<Partial<PalankaDoc>>({ izena: '', url: '' });

  const handleSave = () => {
    onUpdate(localData);
  };

  const handlePemFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLocalData({ ...localData, pemFile: file.name });
  };

  const handlePemUrlChange = (val: string) => {
    setLocalData({ ...localData, pemUrl: val });
  };

  const handleAddPalancaDoc = () => {
    if (!newPalancaDoc.izena) return alert("Mesedez, idatzi dokumentuaren izena.");
    const doc: PalankaDoc = {
      id: Date.now().toString(),
      izena: newPalancaDoc.izena,
      url: newPalancaDoc.url || '',
      fitxategia: newPalancaDoc.fitxategia || ''
    };
    setLocalData({
      ...localData,
      palankakDocs: [...(localData.palankakDocs || []), doc]
    });
    setNewPalancaDoc({ izena: '', url: '', fitxategia: '' });
  };

  const handleRemovePalancaDoc = (id: string) => {
    setLocalData({
      ...localData,
      palankakDocs: localData.palankakDocs.filter(d => d.id !== id)
    });
  };

  const handlePalancaFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewPalancaDoc({ ...newPalancaDoc, fitxategia: file.name });
  };

  const handleTextChange = (field: keyof DocumentData, value: string) => {
    setLocalData({ ...localData, [field]: value });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center space-x-3 mb-6 border-b border-slate-100 pb-4">
            <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><FileText className="w-6 h-6" /></div>
            <div><h2 className="text-xl font-bold text-slate-800">Hobekuntza Plana (HP)</h2><p className="text-sm text-slate-500">Igo zure HP dokumentua.</p></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Drive Esteka (URL)</label>
                <div className="flex items-center"><div className="bg-slate-100 p-2.5 border border-r-0 border-slate-300 rounded-l-lg text-slate-500"><LinkIcon className="w-5 h-5" /></div><input type="url" placeholder="URL..." className="w-full px-4 py-2.5 border border-slate-300 rounded-r-lg focus:ring-2 focus:ring-purple-500 outline-none" value={localData.pemUrl || ''} onChange={(e) => handlePemUrlChange(e.target.value)} /></div>
            </div>
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Igo Fitxategia</label>
                <div className="flex items-center space-x-3"><input type="file" accept=".doc,.docx,.pdf" className="hidden" ref={pemFileInputRef} onChange={handlePemFileChange} /><button onClick={() => pemFileInputRef.current?.click()} className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-slate-50 border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium rounded-lg transition-colors"><Upload className="w-5 h-5" /><span>{localData.pemFile ? 'Aldatu Fitxategia' : 'Aukeratu Fitxategia'}</span></button></div>
                {localData.pemFile && <p className="mt-2 text-sm text-green-600 flex items-center"><FileType className="w-4 h-4 mr-1"/> {localData.pemFile}</p>}
            </div>
        </div>
        <div className="mt-8 pt-6 border-t border-slate-100">
            <details className="group"><summary className="flex items-center cursor-pointer text-sm font-medium text-slate-500 hover:text-purple-600 transition-colors"><AlertCircle className="w-4 h-4 mr-2" />IA-rako testu gordina (hautazkoa)</summary><div className="mt-4"><textarea className="w-full h-40 p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none font-mono text-xs text-slate-600 bg-slate-50" placeholder="Itsatsi dokumentuaren testua hemen IAren azterketa hobetzeko..." value={localData.pemText} onChange={(e) => handleTextChange('pemText', e.target.value)} /></div></details>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center space-x-3 mb-6 border-b border-slate-100 pb-4"><div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><FileText className="w-6 h-6" /></div><div><h2 className="text-xl font-bold text-slate-800">Palanka Dokumentuak</h2><p className="text-sm text-slate-500">Gehitu palanken inguruko dokumentuak.</p></div></div>
        <div className="space-y-4 mb-8">
            {localData.palankakDocs?.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200"><div className="flex items-center space-x-4"><div className="w-10 h-10 bg-white rounded flex items-center justify-center text-indigo-600 shadow-sm"><FileText className="w-5 h-5" /></div><div><h4 className="font-bold text-slate-800 text-sm">{doc.izena}</h4><div className="flex space-x-3 text-xs text-slate-500 mt-1">{doc.url && <span className="flex items-center"><LinkIcon className="w-3 h-3 mr-1"/> Esteka</span>}{doc.fitxategia && <span className="flex items-center"><FileType className="w-3 h-3 mr-1"/> {doc.fitxategia}</span>}</div></div></div><button onClick={() => handleRemovePalancaDoc(doc.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button></div>
            ))}
        </div>
        <div className="bg-indigo-50/50 p-6 rounded-xl border border-indigo-100"><h4 className="font-bold text-indigo-900 text-sm uppercase mb-4 flex items-center"><Plus className="w-4 h-4 mr-2" /> Gehitu Berria</h4><div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end"><div className="md:col-span-4"><label className="block text-xs font-bold text-slate-500 mb-1">Izena</label><input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-sm" value={newPalancaDoc.izena || ''} onChange={(e) => setNewPalancaDoc({...newPalancaDoc, izena: e.target.value})} /></div><div className="md:col-span-4"><label className="block text-xs font-bold text-slate-500 mb-1">URL</label><input type="url" className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-sm" value={newPalancaDoc.url || ''} onChange={(e) => setNewPalancaDoc({...newPalancaDoc, url: e.target.value})} /></div><div className="md:col-span-3"><label className="block text-xs font-bold text-slate-500 mb-1">Fitxategia</label><input type="file" className="hidden" ref={palancaFileInputRef} onChange={handlePalancaFileChange} /><button onClick={() => palancaFileInputRef.current?.click()} className="w-full px-3 py-2 bg-white border border-slate-300 text-slate-600 text-sm rounded-lg truncate text-left flex items-center"><Upload className="w-3 h-3 mr-2" /><span className="truncate">{newPalancaDoc.fitxategia || 'Igo...'}</span></button></div><div className="md:col-span-1"><button onClick={handleAddPalancaDoc} className="w-full py-2 bg-indigo-600 text-white rounded-lg flex items-center justify-center shadow-sm"><Plus className="w-5 h-5" /></button></div></div></div>
      </div>

       <div className="flex justify-end pt-8">
        <button onClick={handleSave} className="flex items-center space-x-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-all active:scale-95"><Save className="w-5 h-5" /><span>Aldaketak gorde</span></button>
      </div>
    </div>
  );
};

export default DocumentUpload;
