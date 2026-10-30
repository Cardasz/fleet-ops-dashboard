import type { LucideIcon } from 'lucide-react';
import {
  Clock,
  Database,
  LayoutDashboard,
  Menu,
  Moon,
  Search,
  Shield,
  Sun,
  Upload,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import VehicleModal from './components/VehicleModal';
import { useDashboardStats } from './hooks/useDashboardStats';
import { useFleetData } from './hooks/useFleetData';
import { PAGINATION_STEP } from './lib/constants';
import { formatDate } from './lib/formatters';
import type { FleetVehicle, TabId } from './types/fleet';
import ComplianceView from './views/ComplianceView';
import OciosidadeView from './views/OciosidadeView';
import PerformanceView from './views/PerformanceView';
import TorreControleView from './views/TorreControleView';

interface MenuItem {
  id: TabId;
  label: string;
  icon: LucideIcon;
  alertCount: number;
}

const uniqueSorted = (values: string[]): string[] =>
  [...new Set(values.filter((v) => v && v !== 'N/A'))].sort();

export default function App() {
  const { vehicles, fileName, referenceDate, loading, error, importFile } = useFleetData();

  const [activeTab, setActiveTab] = useState<TabId>('torre_controle');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOrigem, setFilterOrigem] = useState('');
  const [filterSegmento, setFilterSegmento] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [selected, setSelected] = useState<FleetVehicle | null>(null);

  // Paginação que "zera" sozinha quando filtros/aba mudam (sem useEffect)
  const resetKey = [searchTerm, filterOrigem, filterSegmento, activeTab].join('|');
  const [pagination, setPagination] = useState({ key: resetKey, count: PAGINATION_STEP });
  const visibleCount = pagination.key === resetKey ? pagination.count : PAGINATION_STEP;
  const loadMore = () => setPagination({ key: resetKey, count: visibleCount + PAGINATION_STEP });

  const stats = useDashboardStats(vehicles, referenceDate, searchTerm, filterOrigem, filterSegmento);
  const origens = useMemo(() => uniqueSorted(vehicles.map((v) => v.origem)), [vehicles]);
  const segmentos = useMemo(() => uniqueSorted(vehicles.map((v) => v.segmento)), [vehicles]);

  // O Tailwind usa a classe "dark" no <html> para as variantes dark:
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const file = input.files?.[0];
    if (!file) return;
    setIsImporting(true);
    try {
      await importFile(file);
    } finally {
      setIsImporting(false);
      input.value = '';
    }
  };

  const themeClass = darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900';
  const fieldClass = darkMode
    ? 'bg-slate-900 border-slate-800 focus:border-emerald-500'
    : 'bg-white border-slate-200 focus:border-emerald-500';
  const emptyClass = darkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white/50';

  const menuItems: MenuItem[] = [
    { id: 'torre_controle', label: 'Torre de Controle', icon: LayoutDashboard, alertCount: 0 },
    { id: 'ociosidade', label: 'Gestão de Inércia', icon: Clock, alertCount: stats?.veiculosInertes.length ?? 0 },
    { id: 'compliance', label: 'Compliance & RH', icon: Shield, alertCount: stats?.totalComplianceAlerts ?? 0 },
    { id: 'performance', label: 'Análise de Performance', icon: Search, alertCount: 0 },
  ];

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${themeClass}`}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold uppercase tracking-widest animate-pulse italic">
            Carregando dados...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-300 ${themeClass}`}>
      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0 z-40 w-64 bg-slate-950 text-white border-r border-slate-800 transition-transform duration-300 ease-in-out flex flex-col`}
      >
        <div className="p-6 flex items-center justify-between">
          <h1 className="text-2xl font-black tracking-tight uppercase">
            Fleet<span className="text-emerald-500"> Ops</span>
            <span className="text-emerald-500 italic block text-sm">Dashboard Operacional</span>
          </h1>
          <button
            className="lg:hidden p-2 hover:bg-slate-800 rounded-lg"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Fechar menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setActiveTab(m.id);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                activeTab === m.id
                  ? 'bg-emerald-600 shadow-lg shadow-emerald-600/20'
                  : 'hover:bg-slate-800 opacity-60 hover:opacity-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <m.icon className="w-5 h-5" />
                <span className="font-black text-[11px] uppercase tracking-wider">{m.label}</span>
              </div>
              {m.alertCount > 0 && (
                <span className="bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                  {m.alertCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <label
            className={`w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 cursor-pointer font-black text-[10px] uppercase transition-all ${
              isImporting ? 'opacity-50' : ''
            }`}
          >
            {isImporting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            <span>{isImporting ? 'Lendo CSV...' : 'Importar CSV'}</span>
            <input type="file" className="hidden" accept=".csv" onChange={handleFileUpload} />
          </label>
          <p className="mt-3 text-[9px] font-bold uppercase tracking-wider opacity-40 truncate" title={fileName}>
            {fileName}
          </p>
          <p className="text-[9px] font-bold uppercase tracking-wider opacity-40">
            Base de referência: {formatDate(referenceDate)}
          </p>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header
          className={`p-4 md:p-6 border-b flex flex-col gap-4 z-30 ${
            darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <button
              className="lg:hidden p-2 rounded-xl bg-slate-200 dark:bg-slate-800"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Abrir menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Filtro Global: Placa, Motorista ou Destino..."
                className={`w-full pl-12 pr-4 py-3 rounded-2xl text-sm font-bold outline-none border transition-all ${fieldClass}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => setDarkMode((d) => !d)}
              aria-label="Alternar tema"
              className={`p-3 rounded-2xl border transition-all ${
                darkMode
                  ? 'bg-slate-900 border-slate-800 hover:bg-slate-800'
                  : 'bg-white border-slate-200 hover:bg-slate-100'
              }`}
            >
              {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              className={`px-4 py-2 rounded-xl text-xs font-bold outline-none border transition-all min-w-[150px] ${fieldClass}`}
              value={filterOrigem}
              onChange={(e) => setFilterOrigem(e.target.value)}
              aria-label="Filtrar por origem"
            >
              <option value="">Todas as Origens</option>
              {origens.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            <select
              className={`px-4 py-2 rounded-xl text-xs font-bold outline-none border transition-all min-w-[150px] ${fieldClass}`}
              value={filterSegmento}
              onChange={(e) => setFilterSegmento(e.target.value)}
              aria-label="Filtrar por segmento"
            >
              <option value="">Todos os Segmentos</option>
              {segmentos.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div
              role="alert"
              className="px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-bold"
            >
              {error}
            </div>
          )}
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 scroll-thin">
          {vehicles.length === 0 ? (
            <div className={`flex flex-col items-center justify-center h-full rounded-[40px] border-2 border-dashed ${emptyClass}`}>
              <div className="bg-emerald-100 p-8 rounded-full mb-6">
                <Database className="w-12 h-12 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-center">Nenhum dado carregado</h2>
              <p className="text-slate-500 text-sm mt-2 max-w-xs text-center font-medium opacity-60">
                Use o botão "Importar CSV" no menu lateral para iniciar.
              </p>
            </div>
          ) : !stats ? (
            <div className={`flex flex-col items-center justify-center h-full rounded-[40px] border-2 border-dashed ${emptyClass}`}>
              <div className="bg-emerald-100 p-8 rounded-full mb-6">
                <Search className="w-12 h-12 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-center">Nenhum veículo encontrado</h2>
              <p className="text-slate-500 text-sm mt-2 max-w-xs text-center font-medium opacity-60">
                Altere os filtros de busca para visualizar os resultados.
              </p>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto">
              {activeTab === 'torre_controle' && <TorreControleView stats={stats} darkMode={darkMode} />}
              {activeTab === 'ociosidade' && (
                <OciosidadeView stats={stats} darkMode={darkMode} onOpenDetail={setSelected} />
              )}
              {activeTab === 'compliance' && (
                <ComplianceView stats={stats} darkMode={darkMode} onOpenDetail={setSelected} />
              )}
              {activeTab === 'performance' && (
                <PerformanceView
                  stats={stats}
                  darkMode={darkMode}
                  visibleCount={visibleCount}
                  onLoadMore={loadMore}
                  onOpenDetail={setSelected}
                />
              )}
            </div>
          )}
        </main>
      </div>

      {selected && (
        <VehicleModal
          vehicle={selected}
          darkMode={darkMode}
          onClose={() => setSelected(null)}
          onIsolate={(placa) => {
            setSearchTerm(placa);
            setSelected(null);
            setActiveTab('performance');
          }}
        />
      )}
    </div>
  );
}
