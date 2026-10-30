import type { LucideIcon } from 'lucide-react';
import { AlertTriangle } from 'lucide-react';

interface KpiCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  subtext: string;
  darkMode: boolean;
  alert?: boolean;
  highlightClass?: string;
}

export default function KpiCard({
  icon: Icon,
  title,
  value,
  subtext,
  darkMode,
  alert = false,
  highlightClass = '',
}: KpiCardProps) {
  return (
    <div
      className={`p-6 rounded-3xl shadow-sm relative transition-all duration-500 ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      } ${alert ? 'border border-rose-500/50 bg-rose-500/5' : 'border'}`}
    >
      {alert && (
        <div className="absolute top-3 right-3 animate-pulse">
          <AlertTriangle className="w-5 h-5 text-rose-500" />
        </div>
      )}
      <div className="flex items-center gap-3 mb-2 opacity-50">
        <Icon className="w-4 h-4" />
        <span className="text-[10px] font-black uppercase tracking-[2px]">{title}</span>
      </div>
      <div className={`text-2xl font-black leading-none mb-3 truncate ${highlightClass}`}>{value}</div>
      <div className="text-[10px] font-bold opacity-40 uppercase tracking-tighter">{subtext}</div>
    </div>
  );
}
