import { describe, expect, it } from 'vitest';
import { getReferenceDate, parseFleetCsv } from './parseFleetCsv';

const HEADER = [
  'Placa',
  'Carreta 1',
  'MOTORISTA',
  'Cpf',
  'Status',
  'Eficiencia',
  'Centro de Gasto Veículo',
  'Tempo Parado',
  'Dias sem fat Veic',
  'Frete acum. mês atual',
  'Faturamento Esperado',
  'Meta Mensal',
  'Vencimento Férias',
  'Dias de Folga',
  'Data Saída Origem',
].join(',');

const CSV = [
  HEADER,
  'AAA0A00,BBB0B00,MOTORISTA UM,111.111.111-11,EM VIAGEM,ACIMA DO ESPERADO,GRANELEIRO,2:30,0,30000.5,50000,60000,2026-11-10,3,2026-10-29 08:00:00',
  'CCC0C00,,MOTORISTA DOIS,222.222.222-22,DISPONIVEL,IMPRODUTIVO,VEGETAL,33:34,3,1000,50000,0,2026-12-01,12,2026-10-30 04:25:53',
].join('\n');

describe('parseFleetCsv', () => {
  const vehicles = parseFleetCsv(CSV);

  it('lê todas as linhas e converte os campos', () => {
    expect(vehicles).toHaveLength(2);
    const [a] = vehicles;
    expect(a.placa).toBe('AAA0A00');
    expect(a.segmento).toBe('GRANELEIRO');
    expect(a.fatAtual).toBe(30000.5);
    expect(a.tempoParadoHoras).toBe(2.5);
    expect(a.percentual).toBeCloseTo(50, 1);
    expect(a.vencFerias?.getMonth()).toBe(10);
    expect(a.isEngatado).toBe(true);
  });

  it('marca como não engatado quando falta a carreta e usa a meta esperada como fallback', () => {
    const b = vehicles[1];
    expect(b.isEngatado).toBe(false);
    expect(b.isImprodutivo).toBe(false);
    expect(b.diasFolga).toBe(12);
    expect(b.percentual).toBeCloseTo(2, 5); // 1000 / 50000 (meta mensal = 0)
  });

  it('devolve lista vazia para CSV sem linhas de dados', () => {
    expect(parseFleetCsv(HEADER)).toEqual([]);
    expect(parseFleetCsv('')).toEqual([]);
  });

  it('suporta BOM e separador ponto e vírgula', () => {
    const semicolon = '\uFEFF' + CSV.split('\n').map((l) => l.replaceAll(',', ';')).join('\n');
    expect(parseFleetCsv(semicolon)).toHaveLength(2);
  });

  it('usa a saída mais recente como data de referência', () => {
    const ref = getReferenceDate(vehicles);
    expect(ref.getDate()).toBe(30);
    expect(ref.getMonth()).toBe(9);
  });
});
