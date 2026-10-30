import { describe, expect, it } from 'vitest';
import { computeStats, filterVehicles } from './computeStats';
import type { FleetVehicle } from '../types/fleet';

const REF = new Date(2026, 9, 30);

const make = (overrides: Partial<FleetVehicle> = {}): FleetVehicle => ({
  placa: 'AAA0A00',
  status: 'DISPONIVEL',
  motorista: 'MOTORISTA TESTE',
  cpf: '111.111.111-11',
  carreta: 'BBB0B00',
  segmento: 'GRANELEIRO',
  eficiencia: 'ABAIXO DO ESPERADO',
  origem: 'MARINGÁ / PR',
  destino: 'SANTOS / SP',
  destinatario: 'N/A',
  fatEsperado: 100,
  fatAtual: 80,
  metaMensal: 200,
  freteManifesto: 0,
  qtdEntregas: 0,
  isEngatado: true,
  isImprodutivo: false,
  percentual: 40,
  tempoParadoHoras: 0,
  diasSemFat: 0,
  diasFolga: 0,
  prevChegada: null,
  dataSaidaOrigem: null,
  vencFerias: null,
  ultimaFolga: null,
  ...overrides,
});

describe('computeStats', () => {
  it('retorna null sem veículos', () => {
    expect(computeStats([], REF)).toBeNull();
  });

  it('soma faturamento, meta e gap', () => {
    const stats = computeStats([make(), make({ placa: 'BBB', fatAtual: 20 })], REF)!;
    expect(stats.totalAtual).toBe(100);
    expect(stats.totalMeta).toBe(400);
    expect(stats.metaDiariaTotal).toBe(200);
    expect(stats.gapDiario).toBe(-100);
  });

  it('classifica veículos inertes (engatado, 2+ dias sem faturar, fora de viagem)', () => {
    const stats = computeStats(
      [
        make({ placa: 'INERTE', diasSemFat: 3 }),
        make({ placa: 'VIAJANDO', diasSemFat: 3, status: 'EM VIAGEM' }),
        make({ placa: 'DESENGATADO', diasSemFat: 5, isEngatado: false }),
      ],
      REF,
    )!;
    expect(stats.veiculosInertes.map((v) => v.placa)).toEqual(['INERTE']);
  });

  it('gera alertas de férias (30 dias a partir da referência) e de folga (10+ dias)', () => {
    const stats = computeStats(
      [
        make({ placa: 'FERIAS', vencFerias: new Date(2026, 10, 15) }),
        make({ placa: 'LONGE', vencFerias: new Date(2027, 5, 1) }),
        make({ placa: 'FOLGA', diasFolga: 10 }),
      ],
      REF,
    )!;
    expect(stats.feriasAlerta.map((v) => v.placa)).toEqual(['FERIAS']);
    expect(stats.folgaAlerta.map((v) => v.placa)).toEqual(['FOLGA']);
    expect(stats.totalComplianceAlerts).toBe(2);
  });

  it('calcula o percentual de improdutivos sobre os engatados', () => {
    const stats = computeStats(
      [make({ isImprodutivo: true }), make({ placa: 'B' }), make({ placa: 'C', isEngatado: false })],
      REF,
    )!;
    expect(stats.totalEngatados).toBe(2);
    expect(stats.percImprodutivo).toBe(50);
  });
});

describe('filterVehicles', () => {
  const list = [
    make({ placa: 'AAA1', motorista: 'ANA', origem: 'MARINGÁ / PR', segmento: 'VEGETAL' }),
    make({ placa: 'BBB2', motorista: 'BRUNO', origem: 'CUIABÁ / MT', segmento: 'AÇO' }),
  ];

  it('filtra por busca, origem e segmento', () => {
    expect(filterVehicles(list, 'bruno', '', '')).toHaveLength(1);
    expect(filterVehicles(list, '', 'MARINGÁ / PR', '')).toHaveLength(1);
    expect(filterVehicles(list, '', '', 'AÇO')[0].placa).toBe('BBB2');
    expect(filterVehicles(list, '', '', '')).toHaveLength(2);
  });
});
