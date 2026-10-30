import Papa from 'papaparse';
import type { FleetVehicle } from '../types/fleet';
import {
  parseCurrency,
  parseDate,
  parseTimeToHours,
  sanitizeString,
} from './formatters';

type Row = string[];

/**
 * Converte o texto de um CSV (separador detectado automaticamente) em veículos.
 * Os cabeçalhos são casados por "apelidos", então variações como
 * "Frete acum. mês atual" / "Faturamento Atual" funcionam.
 */
export function parseFleetCsv(text: string): FleetVehicle[] {
  const clean = text.replace(/^\uFEFF/, '');
  const { data } = Papa.parse<Row>(clean, { skipEmptyLines: 'greedy' });
  if (data.length < 2) return [];

  const [header, ...rows] = data;
  const idxMap = new Map<string, number>();
  header.forEach((h, i) => idxMap.set(sanitizeString(h), i));

  const getVal = (row: Row, names: string[]): string | null => {
    for (const name of names) {
      const idx = idxMap.get(sanitizeString(name));
      if (idx !== undefined) {
        const value = row[idx]?.trim();
        if (value) return value;
      }
    }
    return null;
  };

  return rows.map((row) => {
    const placa = getVal(row, ['placa', 'veiculo', 'veículo']) ?? 'N/A';
    const carreta = getVal(row, ['carreta 1', 'carreta', 'reboque']) ?? 'N/A';
    const eficiencia = (getVal(row, ['eficiencia', 'eficiência', 'produtividade']) ?? 'S/D').toUpperCase();

    const fatAtual = parseCurrency(
      getVal(row, ['frete acum. mês atual', 'fat atual', 'faturamento atual', 'faturamento']),
    );
    const fatEsperado = parseCurrency(
      getVal(row, ['faturamento esperado', 'fat esperado', 'meta diária', 'meta diaria']),
    );
    const metaMensal = parseCurrency(getVal(row, ['meta mensal', 'meta do mês']));

    const isEngatado =
      placa.length > 3 && carreta.length > 3 && placa !== 'N/A' && carreta !== 'N/A';
    const isImprodutivo =
      isEngatado && (eficiencia === 'IMPRODUTIVO' || eficiencia === 'SEM FATURAR');

    let percentual = 0;
    if (metaMensal > 0) percentual = (fatAtual / metaMensal) * 100;
    else if (fatEsperado > 0) percentual = (fatAtual / fatEsperado) * 100;

    return {
      placa,
      carreta,
      status: (getVal(row, ['status', 'situacao', 'situação']) ?? 'S/D').toUpperCase(),
      motorista: getVal(row, ['motorista', 'condutor']) ?? 'Não Identificado',
      cpf: getVal(row, ['cpf', 'documento']) ?? 'N/A',
      segmento: (
        getVal(row, ['centro de gasto veículo', 'segmento', 'tipo carreta', 'mod carreta']) ?? 'N/A'
      ).toUpperCase(),
      eficiencia,
      origem: getVal(row, ['origem', 'cidade origem', 'local de origem']) ?? 'N/A',
      destino: getVal(row, ['destino', 'cidade destino', 'local de destino']) ?? 'N/A',
      destinatario: getVal(row, ['destinatário', 'destinatario', 'cliente', 'recebedor']) ?? 'N/A',
      fatAtual,
      fatEsperado,
      metaMensal,
      freteManifesto: parseCurrency(getVal(row, ['frete manifesto', 'frete bruto'])),
      qtdEntregas: parseInt(getVal(row, ['qtd. entregas', 'entregas']) ?? '0', 10) || 0,
      isEngatado,
      isImprodutivo,
      percentual,
      tempoParadoHoras: parseTimeToHours(getVal(row, ['tempo parado', 'ociosidade'])),
      diasSemFat:
        parseInt(getVal(row, ['dias sem fat veic', 'dias sem faturar', 'dias parado']) ?? '0', 10) || 0,
      diasFolga: parseInt(getVal(row, ['dias de folga', 'dias folga']) ?? '0', 10) || 0,
      prevChegada: parseDate(getVal(row, ['prev. fim viagem', 'prev. chegada', 'previsão de chegada'])),
      dataSaidaOrigem: parseDate(getVal(row, ['data saída origem', 'data saida origem'])),
      vencFerias: parseDate(getVal(row, ['vencimento férias', 'vencimento ferias', 'ferias'])),
      ultimaFolga: parseDate(getVal(row, ['última folga', 'ultima folga'])),
    };
  });
}

/**
 * Data de referência da base: a saída mais recente encontrada.
 * Os alertas de férias são calculados em relação a ela (e não ao relógio de hoje),
 * para o demo continuar coerente mesmo meses depois da geração do CSV.
 */
export function getReferenceDate(vehicles: FleetVehicle[]): Date {
  let latest = 0;
  for (const v of vehicles) {
    const t = v.dataSaidaOrigem?.getTime() ?? 0;
    if (t > latest) latest = t;
  }
  return latest > 0 ? new Date(latest) : new Date();
}
