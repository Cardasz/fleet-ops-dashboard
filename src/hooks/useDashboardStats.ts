import { useMemo } from 'react';
import { computeStats, filterVehicles } from '../lib/computeStats';
import type { DashboardStats, FleetVehicle } from '../types/fleet';

export function useDashboardStats(
  vehicles: FleetVehicle[],
  referenceDate: Date | null,
  search: string,
  origem: string,
  segmento: string,
): DashboardStats | null {
  return useMemo(() => {
    if (!referenceDate) return null;
    return computeStats(filterVehicles(vehicles, search, origem, segmento), referenceDate);
  }, [vehicles, referenceDate, search, origem, segmento]);
}
