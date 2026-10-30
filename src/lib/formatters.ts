export const currency = (val: number | null | undefined): string =>
  Number(val ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

/** minúsculas, sem acentos e sem espaços nas pontas (usado para casar cabeçalhos). */
export const sanitizeString = (str: string | null | undefined): string => {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

/** Aceita "1.234,56", "1234,56" e "1234.56". */
export const parseCurrency = (val: string | null | undefined): number => {
  if (!val) return 0;
  let cleaned = String(val).replace(/"/g, '').trim();
  if (cleaned.includes(',') && cleaned.includes('.')) {
    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
  } else if (cleaned.includes(',')) {
    cleaned = cleaned.replace(',', '.');
  }
  return parseFloat(cleaned) || 0;
};

/** "33:34" -> 33.57 horas. */
export const parseTimeToHours = (timeStr: string | null | undefined): number => {
  if (!timeStr || !timeStr.includes(':')) return 0;
  const parts = timeStr.replace(/"/g, '').split(':').map(Number);
  return (parts[0] || 0) + (parts[1] || 0) / 60;
};

const buildDate = (
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
  second = 0,
): Date | null => {
  const date = new Date(year, month - 1, day, hour, minute, second);
  const valid =
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  return valid ? date : null;
};

/**
 * Aceita "AAAA-MM-DD[ HH:MM[:SS]]" e "DD/MM/AAAA[ HH:MM[:SS]]".
 * Usa horário local (evita o deslocamento de fuso do `new Date('AAAA-MM-DD')`).
 */
export const parseDate = (str: string | null | undefined): Date | null => {
  if (!str) return null;
  const s = str.trim();

  const iso = /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?/.exec(s);
  if (iso) {
    return buildDate(+iso[1], +iso[2], +iso[3], +(iso[4] ?? 0), +(iso[5] ?? 0), +(iso[6] ?? 0));
  }

  const br = /^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?/.exec(s);
  if (br) {
    return buildDate(+br[3], +br[2], +br[1], +(br[4] ?? 0), +(br[5] ?? 0), +(br[6] ?? 0));
  }

  return null;
};

/** "291.548.801-07" -> "***.548.***-**" (boa prática LGPD, mesmo com dados fictícios). */
export const maskCpf = (cpf: string | null | undefined): string => {
  if (!cpf) return 'N/A';
  return cpf.replace(/^\d{3}\.(\d{3})\.\d{3}-\d{2}$/, '***.$1.***-**');
};

export const formatDate = (date: Date | null | undefined): string =>
  date ? date.toLocaleDateString('pt-BR') : 'N/A';
