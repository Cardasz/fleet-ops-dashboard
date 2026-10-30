import { Activity, AlertCircle, DollarSign, Target, TrendingUp, Truck } from 'lucide-react';
import KpiCard from '../components/KpiCard';
import { currency } from '../lib/formatters';
import type { DashboardStats } from '../types/fleet';

interface Props {
  stats: DashboardStats;
  darkMode: boolean;
}

export default function TorreControleView({ stats, darkMode }: Props) {
  const percAtingido = stats.totalMeta > 0 ? (stats.totalAtual / stats.totalMeta) * 100 : 0;
  const gapTotal = stats.totalAtual - stats.totalMeta;
  const card = darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200';

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard
          title="Faturamento Mês"
          value={currency(stats.totalAtual)}
          icon={DollarSign}
          darkMode={darkMode}
          subtext="Acumulado Realizado"
        />
        <KpiCard
          title="Meta Total"
          value={currency(stats.totalMeta)}
          icon={TrendingUp}
          darkMode={darkMode}
          subtext="Planejamento Mensal Global"
        />
        <KpiCard
          title="Gap Financeiro Total"
          value={currency(gapTotal)}
          alert={gapTotal < 0}
          highlightClass={gapTotal < 0 ? 'text-rose-500' : 'text-emerald-500'}
          icon={AlertCircle}
          darkMode={darkMode}
          subtext="Diferença para o Alvo Mensal"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <KpiCard
          title="Meta Atual"
          value={currency(stats.metaDiariaTotal)}
          icon={Target}
          darkMode={darkMode}
          subtext="Soma Faturamento Esperado (Frota)"
        />
        <KpiCard
          title="Gap da Meta Atual"
          value={currency(stats.gapDiario)}
          alert={stats.gapDiario < 0}
          highlightClass={stats.gapDiario < 0 ? 'text-rose-500' : 'text-emerald-500'}
          icon={Activity}
          darkMode={darkMode}
          subtext="Faturamento Mês Acumulado vs Meta Atual"
        />
      </div>

      <div className={`p-8 rounded-[32px] border shadow-sm ${card}`}>
        <h3 className="text-sm font-black uppercase tracking-widest mb-6 opacity-60">
          Termômetro de Meta Mensal
        </h3>
        <div className="relative w-full h-14 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner flex items-center">
          <div
            className={`absolute left-0 top-0 h-full transition-all duration-1000 ${
              percAtingido >= 100 ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
            style={{ width: `${Math.min(percAtingido, 100)}%` }}
          />
          <div
            className={`absolute top-1/2 -translate-y-1/2 transition-all duration-1000 z-10 flex items-center justify-center p-2 rounded-full shadow-md ${
              darkMode ? 'bg-slate-900' : 'bg-white'
            }`}
            style={{ left: `calc(${Math.min(percAtingido, 100)}% - 24px)` }}
          >
            <Truck className={`w-5 h-5 ${percAtingido >= 100 ? 'text-emerald-500' : 'text-amber-500'}`} />
          </div>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-black mix-blend-difference text-white tracking-[2px] z-0">
            {percAtingido.toFixed(1)}% ATINGIDO
          </span>
        </div>
      </div>

      <div className={`p-8 rounded-[32px] border ${card}`}>
        <h3 className="text-sm font-black uppercase tracking-widest mb-6 opacity-60">
          Produtividade da Frota Engatada
        </h3>
        <div className="flex items-center gap-6">
          <div
            className={`w-24 h-24 rounded-full border-8 flex items-center justify-center text-2xl font-black ${
              stats.percImprodutivo > 7
                ? 'border-rose-500 text-rose-500'
                : 'border-emerald-500 text-emerald-500'
            }`}
          >
            {(100 - stats.percImprodutivo).toFixed(0)}%
          </div>
          <div>
            <p className="font-bold">Veículos Operando na Meta</p>
            <p className="text-xs opacity-50 mt-1">
              {stats.totalEngatados - stats.improdutivosCount} de {stats.totalEngatados} conjuntos ativos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
