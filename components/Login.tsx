
import React, { useState } from 'react';
import { School, Lock, ArrowRight, AlertCircle, ShieldCheck, PlayCircle } from 'lucide-react';
import { verifyCredentials } from '../services/storageService';

interface LoginProps {
  onLogin: (code: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  const handleSchoolLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!code.trim()) {
      setError('Mesedez, sartu ikastetxearen kodea.');
      return;
    }

    const isValid = verifyCredentials(code, password);

    if (isValid) {
      onLogin(code);
    } else {
      setError('Kodea edo pasahitza okerra da.');
    }
  };

  const handleDemoLogin = () => {
    onLogin('000000');
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'Sorkun_Master') {
       onLogin('ADMIN');
    } else {
       setError('Administratzaile pasahitza okerra da.');
    }
  };

  if (isAdminMode) {
    return (
        <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                    Administrazioa
                </h2>
                <p className="mt-2 text-center text-sm text-slate-400">
                    Sartu administratzailearen gako nagusia.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-slate-800 py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-slate-700">
                    <form className="space-y-6" onSubmit={handleAdminLogin}>
                        <div>
                            <label className="block text-sm font-medium text-slate-300">
                                Admin Gakoa
                            </label>
                            <div className="mt-1">
                                <input
                                    type="password"
                                    required
                                    className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-slate-600 rounded-lg py-2 bg-slate-700 text-white placeholder-slate-400"
                                    placeholder="••••••••"
                                    value={adminPassword}
                                    onChange={(e) => setAdminPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-md bg-red-900/50 p-4 border border-red-800">
                                <div className="flex">
                                    <AlertCircle className="h-5 w-5 text-red-400" />
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-300">{error}</h3>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                            >
                                Sartu Panelean
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </button>
                        </div>
                    </form>
                    <div className="mt-6 text-center">
                        <button 
                            onClick={() => { setIsAdminMode(false); setError(''); }}
                            className="text-sm text-slate-400 hover:text-white underline"
                        >
                            Itzuli Ikastetxeen sarbidera
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      <div className="absolute bottom-4 right-4">
          <button 
            onClick={() => setIsAdminMode(true)}
            className="flex items-center space-x-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm text-xs font-medium text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-colors"
          >
              <Lock className="w-3 h-3" />
              <span>Admin Sarbidea</span>
          </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
            <School className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          ERALDATZEN
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Euskal Autonomia Erkidegoko Ikastetxeen Kudeaketa
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleSchoolLogin}>
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-slate-700">
                Ikastetxearen Kodea
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <School className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="code"
                  type="text"
                  required
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-lg py-2"
                  placeholder="Adib: 012345"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Pasahitza (PIN)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-lg py-2"
                  placeholder="PIN kodea"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <button
                type="submit"
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Sartu
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200"></span></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400">Edo erabili demoa</span></div>
              </div>

              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 space-y-3">
                <p className="text-xs text-blue-700 font-medium leading-tight">
                  <span className="font-bold">Eredua ikusi nahi?</span><br/>
                  Erabili <span className="font-mono bg-blue-100 px-1 rounded">000000</span> kodea adibide osatu bat ikusteko eta aplikazioa nola bete ikasteko.
                </p>
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full flex justify-center items-center py-2 px-4 border border-blue-200 rounded-lg shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 transition-colors"
                >
                  <PlayCircle className="mr-2 w-4 h-4" />
                  Sartu Demo gisa
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
