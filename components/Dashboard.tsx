
import React from 'react';
import { CentroEducativo, PlanEstrategicoMejora, AsebetetzeMailaEmaitza, PalankenEmaitza, EmaitzaAkademikoa, HelburuZehaztua } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadialBarChart, RadialBar
} from 'recharts';
import { Users, School, Activity, Layers, GraduationCap, Target, BookOpen, Binary, Atom, HeartHandshake, TrendingUp, Zap } from 'lucide-react';

interface DashboardProps {
  centro: CentroEducativo;
  pem: PlanEstrategicoMejora;
  satisfaction: AsebetetzeMailaEmaitza;
  palancas: PalankenEmaitza;
  academic: EmaitzaAkademikoa;
  objectives: HelburuZehaztua[];
}

const Dashboard: React.FC<DashboardProps> = ({ centro, pem, satisfaction, palancas, academic, objectives }) => {
  
  const calculateObjectivesAvg = () => {
     if (!objectives || objectives.length === 0) return 0;
     
     let weightedTotalAchievement = 0;
     let objectivesWithIndicatorsCount = 0;

     objectives.forEach(obj => {
        if (obj.adierazleak && obj.adierazleak.length > 0) {
            let objTotalWeight = obj.adierazleak.reduce((acc, curr) => acc + (curr.pisua || 0), 0);
            if (objTotalWeight > 0) {
                let objWeightedSum = obj.adierazleak.reduce((acc, curr) => {
                    return acc + ((curr.lorpen_maila || 0) * (curr.pisua || 0));
                }, 0);
                weightedTotalAchievement += (objWeightedSum / objTotalWeight);
                objectivesWithIndicatorsCount++;
            }
        }
     });

     return objectivesWithIndicatorsCount === 0 ? 0 : weightedTotalAchievement / objectivesWithIndicatorsCount;
  };

  const calculateAcademicAvg = (valLH: number | null, valDBH: number | null) => {
    if (valLH === null && valDBH === null) return '-';
    if (valLH === null && valDBH !== null) return valDBH.toFixed(2);
    if (valDBH === null && valLH !== null) return valLH.toFixed(2);
    if (valLH !== null && valDBH !== null) return ((valLH + valDBH) / 2).toFixed(2);
    return '-';
  };

  const objectivesAvg = calculateObjectivesAvg();

  const satisfactionData = [
    {
      group: 'Ikasleak',
      Diagnostikoa: satisfaction.ik_0 || 0,
      '1. Urtea': satisfaction.ik_1 || 0,
      '2. Urtea': satisfaction.ik_2 || 0,
      '3. Urtea': satisfaction.ik_3 || 0,
    },
    {
      group: 'Irakasleak',
      Diagnostikoa: satisfaction.ir_0 || 0,
      '1. Urtea': satisfaction.ir_1 || 0,
      '2. Urtea': satisfaction.ir_2 || 0,
      '3. Urtea': satisfaction.ir_3 || 0,
    },
    {
      group: 'Familiak',
      Diagnostikoa: satisfaction.fa_0 || 0,
      '1. Urtea': satisfaction.fa_1 || 0,
      '2. Urtea': satisfaction.fa_2 || 0,
      '3. Urtea': satisfaction.fa_3 || 0,
    },
  ];

  const developmentData = [
    { name: 'Garapen Orokorra', value: centro.garapen_orokorra || 0, fill: '#6366f1' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* 1. LERROA: ESTRATEGIA ETA KUDEAKETA */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Adierazle Estrategikoak</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard 
                title="Garapen Orokorra" 
                value={centro.garapen_orokorra?.toFixed(2) || '-'} 
                icon={<Activity className="w-5 h-5 text-indigo-600" />} 
                color="bg-indigo-50"
            />
            <StatCard 
                title="Helburuak B.B." 
                value={`${objectivesAvg.toFixed(1)}%`} 
                subtext="Haztatutako Lorpena"
                icon={<Target className="w-5 h-5 text-rose-600" />} 
                color="bg-rose-50"
            />
            <StatCard 
                title="Erronka Nagusia" 
                value={centro.erronka_nagusia || 'Zehaztu gabe'} 
                icon={<Zap className="w-5 h-5 text-amber-600" />} 
                color="bg-amber-50"
            />
            <StatCard 
                title="Palankak B.B." 
                value={palancas.palanken_batezbestekoa_final?.toFixed(2) || '-'} 
                subtext="Eskala 1-4"
                icon={<Layers className="w-5 h-5 text-violet-600" />} 
                color="bg-violet-50"
            />
            <StatCard 
                title="Aholkularia" 
                value={centro.aholkularia.split(' ')[0]} 
                icon={<School className="w-5 h-5 text-blue-600" />} 
                color="bg-blue-50"
            />
        </div>
      </div>

      {/* 2. LERROA: EMAITZA AKADEMIKOAK ETA KONPETENTZIAK */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
            <GraduationCap className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Konpetentziak eta Emaitzak</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard 
                title="Ez-promozionatuak" 
                value={`${academic.prom_final_dbh || '-'}%`} 
                subtext="DBH tasa"
                icon={<GraduationCap className="w-5 h-5 text-red-600" />} 
                color="bg-red-50"
            />
            <StatCard 
                title="Hizkuntza" 
                value={calculateAcademicAvg(academic.hk_a1_lh, academic.hk_a1_dbh)} 
                subtext="Konpetentzia"
                icon={<BookOpen className="w-5 h-5 text-sky-600" />} 
                color="bg-sky-50"
            />
            <StatCard 
                title="Matematika" 
                value={calculateAcademicAvg(academic.matematika_a1_lh, academic.matematika_a1_dbh)} 
                subtext="Konpetentzia"
                icon={<Binary className="w-5 h-5 text-emerald-600" />} 
                color="bg-emerald-50"
            />
            <StatCard 
                title="Zientzia" 
                value={calculateAcademicAvg(academic.zientzia_a1_lh, academic.zientzia_a1_dbh)} 
                subtext="Konpetentzia"
                icon={<Atom className="w-5 h-5 text-teal-600" />} 
                color="bg-teal-50"
            />
            <StatCard 
                title="Bizikidetza" 
                value={calculateAcademicAvg(academic.bizikidetza_a1_lh, academic.bizikidetza_a1_dbh)} 
                subtext="Indizea"
                icon={<HeartHandshake className="w-5 h-5 text-orange-600" />} 
                color="bg-orange-50"
            />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Asebetetze Grafikoa */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-600" />
            Asebetetze Mailaren Bilakaera
          </h3>
          <div className="h-[400px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={satisfactionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="group" axisLine={false} tickLine={false} fontSize={12} tick={{ fill: '#64748b', fontWeight: 'bold' }} />
                <YAxis domain={[0, 10]} axisLine={false} tickLine={false} fontSize={12} tick={{ fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" />
                <Bar dataKey="Diagnostikoa" fill="#cbd5e1" radius={[6, 6, 0, 0]} barSize={20} />
                <Bar dataKey="1. Urtea" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={20} />
                <Bar dataKey="2. Urtea" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={20} />
                <Bar dataKey="3. Urtea" fill="#10b981" radius={[6, 6, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Garapen Indizea (Radial Gauge) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-indigo-600" />
            Garapen Indizea
          </h3>
          <div className="h-[400px] w-full min-w-0 relative">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart 
                innerRadius="80%" 
                outerRadius="100%" 
                data={developmentData} 
                startAngle={180} 
                endAngle={0}
              >
                <RadialBar
                  background
                  dataKey="value"
                  cornerRadius={10}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-12">
                <span className="text-5xl font-black text-slate-800 tracking-tighter">{centro.garapen_orokorra?.toFixed(2)}</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">10etik</span>
            </div>
          </div>
          <p className="text-center text-xs text-slate-500 mt-4 leading-relaxed font-medium">
            Kanpo-ebaluazioetan eta auditoretzetan oinarritutako ikastetxearen garapen-adierazle globala.
          </p>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{title: string, value: string | number, subtext?: string, icon: React.ReactNode, color: string}> = ({ title, value, subtext, icon, color }) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-start justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{title}</p>
      <h4 className="text-xl font-black text-slate-900 tracking-tight">{value}</h4>
      {subtext && <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase opacity-60">{subtext}</p>}
    </div>
    <div className={`p-2.5 rounded-xl ${color} shadow-sm`}>
      {icon}
    </div>
  </div>
);

export default Dashboard;
