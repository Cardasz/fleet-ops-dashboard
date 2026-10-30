import { Clock } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { INERT_DAYS } from '../lib/constants';
import type { DashboardStats, FleetVehicle } from '../types/fleet';

interface Props {
  stats: DashboardStats;
  darkMode: boolean;
  onOpenDetail: (vehicle: FleetVehicle) => void;
}

export default function OciosidadeView({ stats, darkMode, onOpenDetail }: Props) {
  const temInertes = stats.veiculosInertes.length > 0;
  const baseCard = darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200';

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div
        className={`p-8 rounded-[32px] border ${
          temInertes ? 'border-amber-500/30 bg-amber-500/5' : baseCard
        }`}
      >
        <h3 className="text-sm font-black uppercase tracking-widest mb-6 text-amber-500 flex items-center gap-2">
          <Clock className="w-5 h-5" /> Veículos Inertes ({INERT_DAYS}+ dias sem faturar)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {!temInertes ? (
            <p className="opacity-50 text-sm">Nenhum veículo inerte.</p>
          ) : (
            stats.veiculosInertes.map((v, i) => (
              <button
                key={`${v.placa}-${i}`}
                onClick={() => onOpenDetail(v)}
                className={`p-5 rounded-2xl border text-left hover:scale-[1.02] transition-all shadow-sm ${
                  darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="font-black text-lg leading-none">{v.placa}</span>
                  <span className="text-[10px] font-black text-amber-500 px-2 py-1 bg-amber-500/10 rounded-lg">
                    {v.diasSemFat} DIAS
                  </span>
                </div>
                <p className="text-[10px] uppercase font-bold opacity-50 truncate leading-none">
                  {v.motorista}
                </p>
              </button>
            ))
          )}
        </div>
      </div>

      <div className={`p-8 rounded-[32px] border ${baseCard}`}>
        <h3 className="font-black text-[11px] uppercase tracking-[3px] mb-8 flex items-center gap-2 text-rose-500 italic">
          <Clock className="w-4 h-4" /> Top 15 Tempo Parado (Horas)
        </h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.topOciosidade} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#1e293b' : '#f1f5f9'} />
              <XAxis
                dataKey="placa"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
              <Tooltip
                cursor={{ fill: darkMode ? '#1e293b' : '#f8fafc' }}
                contentStyle={{
                  borderRadius: '20px',
                  border: 'none',
                  background: darkMode ? '#0f172a' : '#fff',
                }}
                formatter={(val) => [`${Number(val).toFixed(2)}h`, 'Parado']}
              />
              <Bar dataKey="tempoParadoHoras" fill="#f43f5e" radius={[12, 12, 0, 0]} barSize={26} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
