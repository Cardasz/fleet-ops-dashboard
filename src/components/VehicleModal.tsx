import { Calendar, CreditCard, MapPin, Truck, User, X } from 'lucide-react';
import { currency, formatDate, maskCpf } from '../lib/formatters';
import type { FleetVehicle } from '../types/fleet';

interface VehicleModalProps {
  vehicle: FleetVehicle;
  darkMode: boolean;
  onClose: () => void;
  onIsolate: (placa: string) => void;
}

export default function VehicleModal({ vehicle: v, darkMode, onClose, onIsolate }: VehicleModalProps) {
  const panel = darkMode ? 'bg-slate-800' : 'bg-slate-50';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Detalhes do veículo ${v.placa}`}
        className={`w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden border ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="p-8 bg-emerald-600 text-white relative">
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-white/20 rounded-3xl backdrop-blur-sm">
              <Truck className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-4xl font-black tracking-tighter leading-none">{v.placa}</h3>
              <div className="flex gap-2 mt-2">
                <span className="px-2 py-0.5 bg-white/20 rounded text-[9px] font-black uppercase tracking-widest">
                  {v.status}
                </span>
                <span className="px-2 py-0.5 bg-emerald-500 rounded text-[9px] font-black uppercase tracking-widest">
                  {v.eficiencia}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[70vh] overflow-y-auto scroll-thin">
          <div className="space-y-6">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[2px] opacity-40 mb-3 flex items-center gap-2 italic">
                <User className="w-3 h-3" /> Condutor
              </h4>
              <div className={`p-4 rounded-2xl ${panel}`}>
                <p className="font-black text-sm uppercase">{v.motorista}</p>
                <p className="text-xs opacity-50 font-mono mt-1 flex items-center gap-1">
                  <CreditCard className="w-3 h-3" /> CPF: {maskCpf(v.cpf)}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[2px] opacity-40 mb-3 flex items-center gap-2 italic">
                <Calendar className="w-3 h-3" /> RH e Jornada
              </h4>
              <div className={`p-4 rounded-2xl ${panel}`}>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Dias sem Folga:</span>
                  <span className="text-indigo-500">{v.diasFolga}</span>
                </div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Última Folga:</span>
                  <span className="opacity-60">{formatDate(v.ultimaFolga)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold">
                  <span>Venc. Férias:</span>
                  <span className="text-amber-500">{formatDate(v.vencFerias)}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[2px] opacity-40 mb-3 flex items-center gap-2 italic">
                <MapPin className="w-3 h-3" /> Roteiro
              </h4>
              <div className={`p-4 rounded-2xl ${panel} space-y-3`}>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold truncate uppercase">{v.origem}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className="text-xs font-bold truncate uppercase">{v.destino}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div
              className={`p-6 rounded-[32px] ${
                darkMode ? 'bg-slate-800/50 border border-slate-700' : 'bg-slate-50 border border-slate-100'
              }`}
            >
              <p className="text-[10px] font-black uppercase opacity-50 mb-6 tracking-widest italic text-center underline">
                Métricas Financeiras
              </p>
              <div className="grid grid-cols-1 gap-3">
                <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                  <p className="text-[8px] font-black uppercase opacity-60">Faturamento Realizado</p>
                  <p className="text-xl font-black text-emerald-600">{currency(v.fatAtual)}</p>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1 p-3 bg-slate-500/10 rounded-2xl border border-slate-500/20">
                    <p className="text-[8px] font-black uppercase opacity-60">Frete do Manifesto</p>
                    <p className="text-sm font-black">{currency(v.freteManifesto)}</p>
                  </div>
                  <div className="flex-1 p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                    <p className="text-[8px] font-black uppercase opacity-60">Entregas</p>
                    <p className="text-sm font-black text-blue-500">{v.qtdEntregas}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-end">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-black opacity-50 uppercase tracking-widest">
                      Atingimento da Meta
                    </span>
                    <span className="text-2xl font-black text-emerald-500">{Math.round(v.percentual)}%</span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => onIsolate(v.placa)}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95"
            >
              Isolar no Raio-X
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
