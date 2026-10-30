import { currency } from '../lib/formatters';
import type { FleetVehicle } from '../types/fleet';

interface VehicleCardProps {
  vehicle: FleetVehicle;
  darkMode: boolean;
  onClick: (vehicle: FleetVehicle) => void;
}

export default function VehicleCard({ vehicle: p, darkMode, onClick }: VehicleCardProps) {
  const metaBatida = p.percentual >= 100;

  return (
    <button
      onClick={() => onClick(p)}
      className={`p-6 rounded-[32px] border border-transparent transition-all group text-left shadow-sm hover:shadow-xl ${
        darkMode
          ? 'bg-slate-800/40 hover:border-emerald-500/50 hover:bg-slate-800'
          : 'bg-slate-50 hover:border-emerald-500/50 hover:bg-white'
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        <div
          className={`px-2.5 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider ${
            p.status === 'EM VIAGEM' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-slate-400/10 text-slate-500'
          }`}
        >
          {p.status}
        </div>
        <div
          className={`px-3 py-1 rounded-xl text-[10px] font-black shadow-sm ${
            metaBatida
              ? 'bg-emerald-500 text-white shadow-emerald-500/20'
              : 'bg-amber-500 text-white shadow-amber-500/20'
          }`}
        >
          {p.percentual.toFixed(0)}%
        </div>
      </div>

      <div className="mb-6">
        <span className="text-2xl font-black tracking-tighter leading-none group-hover:text-emerald-600 transition-colors">
          {p.placa}
        </span>
        <p className="text-[10px] font-black uppercase text-emerald-500/60 mt-1 truncate italic tracking-tighter leading-none">
          {p.motorista}
        </p>
        <p className="text-[9px] font-bold opacity-30 uppercase tracking-widest mt-1 truncate leading-none">
          {p.segmento}
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
          <div className="flex flex-col">
            <span className="opacity-40 text-[8px] mb-1 italic leading-none">Realizado</span>
            <span>{currency(p.fatAtual)}</span>
          </div>
          <div className="flex flex-col items-end text-right">
            <span className="opacity-40 text-[8px] mb-1 italic leading-none">Meta Mensal</span>
            <span>{currency(p.metaMensal)}</span>
          </div>
        </div>
        <div className="w-full h-2 bg-slate-200 dark:bg-slate-700/50 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              metaBatida ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-amber-500'
            }`}
            style={{ width: `${Math.min(p.percentual, 100)}%` }}
          />
        </div>
      </div>
    </button>
  );
}
