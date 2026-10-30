import { describe, expect, it } from 'vitest';
import {
  maskCpf,
  parseCurrency,
  parseDate,
  parseTimeToHours,
  sanitizeString,
} from './formatters';

describe('parseCurrency', () => {
  it('aceita formato brasileiro, ponto decimal e vazio', () => {
    expect(parseCurrency('1.234,56')).toBe(1234.56);
    expect(parseCurrency('1234,56')).toBe(1234.56);
    expect(parseCurrency('26155.98')).toBe(26155.98);
    expect(parseCurrency('')).toBe(0);
    expect(parseCurrency(null)).toBe(0);
  });
});

describe('parseTimeToHours', () => {
  it('converte HH:MM em horas decimais', () => {
    expect(parseTimeToHours('0:00')).toBe(0);
    expect(parseTimeToHours('2:30')).toBe(2.5);
    expect(parseTimeToHours('33:34')).toBeCloseTo(33.5667, 3);
    expect(parseTimeToHours('abc')).toBe(0);
  });
});

describe('parseDate', () => {
  it('lê ISO com hora', () => {
    const d = parseDate('2026-10-30 06:16:00');
    expect(d?.getFullYear()).toBe(2026);
    expect(d?.getMonth()).toBe(9);
    expect(d?.getDate()).toBe(30);
    expect(d?.getHours()).toBe(6);
  });

  it('lê ISO só com data sem deslocar o dia (fuso)', () => {
    expect(parseDate('2026-11-10')?.getDate()).toBe(10);
  });

  it('lê DD/MM/AAAA', () => {
    const d = parseDate('05/03/2026');
    expect(d?.getDate()).toBe(5);
    expect(d?.getMonth()).toBe(2);
  });

  it('rejeita datas inválidas', () => {
    expect(parseDate('31/02/2026')).toBeNull();
    expect(parseDate('texto')).toBeNull();
    expect(parseDate('')).toBeNull();
  });
});

describe('sanitizeString / maskCpf', () => {
  it('remove acentos e normaliza caixa', () => {
    expect(sanitizeString('  Frete Líquido ')).toBe('frete liquido');
  });

  it('mascara o CPF', () => {
    expect(maskCpf('291.548.801-07')).toBe('***.548.***-**');
    expect(maskCpf(null)).toBe('N/A');
  });
});
