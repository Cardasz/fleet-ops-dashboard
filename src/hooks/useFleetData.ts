import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_CSV_NAME } from '../lib/constants';
import { getReferenceDate, parseFleetCsv } from '../lib/parseFleetCsv';
import type { FleetVehicle } from '../types/fleet';

interface FleetState {
  vehicles: FleetVehicle[];
  fileName: string;
  referenceDate: Date | null;
  loading: boolean;
  error: string | null;
}

/**
 * Carrega o CSV estático (public/data) e permite importar outro CSV localmente.
 * Nada é enviado a servidor: o arquivo importado vive só na memória do navegador.
 */
export function useFleetData() {
  const [state, setState] = useState<FleetState>({
    vehicles: [],
    fileName: '',
    referenceDate: null,
    loading: true,
    error: null,
  });

  const applyCsv = useCallback((text: string, fileName: string) => {
    const vehicles = parseFleetCsv(text);
    if (vehicles.length === 0) {
      setState((s) => ({
        ...s,
        loading: false,
        error: 'Não foi possível ler o CSV. Confira o cabeçalho e o separador.',
      }));
      return;
    }
    setState({
      vehicles,
      fileName,
      referenceDate: getReferenceDate(vehicles),
      loading: false,
      error: null,
    });
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const url = `${import.meta.env.BASE_URL}data/${DEFAULT_CSV_NAME}`;

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Falha ao carregar o CSV (HTTP ${res.status}).`);
        return res.text();
      })
      .then((text) => applyCsv(text, DEFAULT_CSV_NAME))
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setState((s) => ({
          ...s,
          loading: false,
          error: err instanceof Error ? err.message : 'Erro desconhecido ao carregar os dados.',
        }));
      });

    return () => controller.abort();
  }, [applyCsv]);

  const importFile = useCallback(
    async (file: File) => {
      applyCsv(await file.text(), file.name);
    },
    [applyCsv],
  );

  return { ...state, importFile };
}
