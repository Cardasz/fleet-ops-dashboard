import { ChevronDown, Search } from 'lucide-react';
import VehicleCard from '../components/VehicleCard';
import type { DashboardStats, FleetVehicle } from '../types/fleet';

interface Props {
  stats: DashboardStats;
  darkMode: boolean;
  visibleCount: number;
  onLoadMore: () => void;
  onOpenDetail: (vehicle: FleetVehicle) => void;
}

export default function PerformanceView({ stats, darkMode, visibleCount, onLoadMore, onOpenDetail }: Props) {
  return (
    <div
      className={`p-8 rounded-[40px] border animate-in fade-in duration-500 ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h3 className="font-black text-[11px] uppercase tracking-[3px] flex items-center gap-2 text-emerald-600 italic">
          <Search className="w-4 h-4" /> Análise Individual (Auditoria)
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.analiseFinanceira.slice(0, visibleCount).map((v, i) => (
          <VehicleCard key={`${v.placa}-${i}`} vehicle={v} darkMode={darkMode} onClick={onOpenDetail} />
        ))}
      </div>

      {visibleCount < stats.analiseFinanceira.length && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={onLoadMore}
            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-black text-[10px] uppercase tracking-[3px] shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2"
          >
            <ChevronDown className="w-4 h-4" /> Carregar Mais Veículos
          </button>
        </div>
      )}
    </div>
  );
}
