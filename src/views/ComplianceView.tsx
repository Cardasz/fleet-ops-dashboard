import { AlertCircle, Calendar, Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { FOLGA_ALERT_DAYS } from '../lib/constants';
import { formatDate } from '../lib/formatters';
import type { DashboardStats, FleetVehicle } from '../types/fleet';

interface Props {
  stats: DashboardStats;
  darkMode: boolean;
  onOpenDetail: (vehicle: FleetVehicle) => void;
}

function buildAlertText(stats: DashboardStats): string {
  const lines: string[] = [];

  if (stats.feriasAlerta.length > 0) {
    lines.push('📅 ALERTAS DE FÉRIAS (Próximos 30 dias):');
    stats.feriasAlerta.forEach((v) =>
      lines.push(`- [${v.placa}] - ${v.motorista} - Vence em: ${formatDate(v.vencFerias)}`),
    );
    lines.push('');
  }

  if (stats.folgaAlerta.length > 0) {
    lines.push(`⏰ CONTROLE DE JORNADA (${FOLGA_ALERT_DAYS}+ dias sem folga):`);
    stats.folgaAlerta.forEach((v) =>
      lines.push(`- [${v.placa}] - ${v.motorista} - ${v.diasFolga} dias sem folga`),
    );
    lines.push('');
  }

  if (lines.length === 0) return 'Nenhum alerta crítico no momento.';
  return ['⚠️ RELATÓRIO DE ALERTAS CRÍTICOS - COMPLIANCE E RH ⚠️', '', ...lines].join('\n');
}

export default function ComplianceView({ stats, darkMode, onOpenDetail }: Props) {
  const [copied, setCopied] = useState(false);
  const card = darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200';
  const item = darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200';

  const handleCopyAlerts = async () => {
    try {
      await navigator.clipboard.writeText(buildAlertText(stats));
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-end mb-2">
        <button
          onClick={handleCopyAlerts}
          className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[10px] font-black uppercase tracking-[2px] flex items-center gap-2 shadow-lg active:scale-95 transition-all"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copiado para Área de Transferência!' : 'Copiar Alertas Críticos'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`p-6 rounded-[32px] border ${card}`}>
          <h3 className="text-[11px] font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-amber-500">
            <Calendar className="w-4 h-4" /> Alertas de Férias (Próx. 30D)
          </h3>
          <div className="space-y-3">
            {stats.feriasAlerta.length === 0 ? (
              <p className="text-xs opacity-50 font-bold">Tudo limpo.</p>
            ) : (
              stats.feriasAlerta.map((v, i) => (
                <button
                  key={`${v.placa}-${i}`}
                  onClick={() => onOpenDetail(v)}
                  className={`w-full p-4 rounded-2xl border text-left hover:border-amber-500 transition-all ${item}`}
                >
                  <div className="font-black text-sm uppercase leading-tight">{v.motorista}</div>
                  <div className="text-[9px] text-amber-500 font-bold uppercase mt-2 tracking-widest">
                    Vence: {formatDate(v.vencFerias)}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className={`p-6 rounded-[32px] border ${card}`}>
          <h3 className="text-[11px] font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-indigo-500">
            <AlertCircle className="w-4 h-4" /> Controle de Jornada ({FOLGA_ALERT_DAYS}+ Dias)
          </h3>
          <div className="space-y-3">
            {stats.folgaAlerta.length === 0 ? (
              <p className="text-xs opacity-50 font-bold">Tudo limpo.</p>
            ) : (
              stats.folgaAlerta.map((v, i) => (
                <button
                  key={`${v.placa}-${i}`}
                  onClick={() => onOpenDetail(v)}
                  className={`w-full p-4 rounded-2xl border text-left hover:border-indigo-500 transition-all ${item}`}
                >
                  <div className="font-black text-sm uppercase leading-tight">{v.motorista}</div>
                  <div className="text-[9px] text-indigo-500 font-bold uppercase mt-2 tracking-widest">
                    {v.diasFolga} dias sem folga
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
