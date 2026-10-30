import type { DashboardStats, FleetVehicle } from '../types/fleet';
import { FERIAS_ALERT_DAYS, FOLGA_ALERT_DAYS, INERT_DAYS } from './constants';

const DAY_MS = 24 * 60 * 60 * 1000;

export function filterVehicles(
  vehicles: FleetVehicle[],
  search: string,
  origem: string,
  segmento: string,
): FleetVehicle[] {
  const term = search.toLowerCase();
  return vehicles.filter((v) => {
    const matchSearch =
      v.placa.toLowerCase().includes(term) ||
      v.motorista.toLowerCase().includes(term) ||
      v.destino.toLowerCase().includes(term);
    const matchOrigem = origem ? v.origem === origem : true;
    const matchSegmento = segmento ? v.segmento === segmento : true;
    return matchSearch && matchOrigem && matchSegmento;
  });
}

export function computeStats(
  vehicles: FleetVehicle[],
  referenceDate: Date,
): DashboardStats | null {
  if (vehicles.length === 0) return null;

  const totalAtual = vehicles.reduce((acc, v) => acc + v.fatAtual, 0);
  const totalMeta = vehicles.reduce((acc, v) => acc + v.metaMensal, 0);
  // "Meta atual" = soma do Faturamento Esperado da frota até hoje
  const metaDiariaTotal = vehicles.reduce((acc, v) => acc + v.fatEsperado, 0);

  const engatados = vehicles.filter((v) => v.isEngatado);
  const improdutivos = engatados.filter((v) => v.isImprodutivo);

  const veiculosInertes = engatados.filter(
    (v) => v.diasSemFat >= INERT_DAYS && v.status !== 'EM VIAGEM',
  );

  const limiteFerias = referenceDate.getTime() + FERIAS_ALERT_DAYS * DAY_MS;
  const feriasAlerta = engatados.filter(
    (v) => v.vencFerias !== null && v.vencFerias.getTime() < limiteFerias,
  );
  const folgaAlerta = engatados.filter((v) => v.diasFolga >= FOLGA_ALERT_DAYS);

  return {
    totalAtual,
    totalMeta,
    metaDiariaTotal,
    gapDiario: totalAtual - metaDiariaTotal,
    veiculosInertes,
    feriasAlerta,
    folgaAlerta,
    totalComplianceAlerts: feriasAlerta.length + folgaAlerta.length,
    totalEngatados: engatados.length,
    improdutivosCount: improdutivos.length,
    percImprodutivo: engatados.length > 0 ? (improdutivos.length / engatados.length) * 100 : 0,
    topOciosidade: [...vehicles].sort((a, b) => b.tempoParadoHoras - a.tempoParadoHoras).slice(0, 15),
    analiseFinanceira: [...vehicles].sort((a, b) => b.percentual - a.percentual),
  };
}
