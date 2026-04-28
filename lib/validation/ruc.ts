// Algoritmo módulo 11 — requerido por DNIT para validar RUC (Ley 6380/2019, Art. 35)

export function validarRUC(ruc: string): { valido: boolean; error?: string } {
  const limpio = ruc.replace(/[\s.]/g, '');
  const match = limpio.match(/^(\d+)-?(\d{1,2})$/);

  if (!match) {
    return { valido: false, error: 'Formato inválido. Esperado: XXXXXXXX-D' };
  }

  const [, numero, digitoStr] = match;
  const digito = parseInt(digitoStr, 10);

  const digits = numero.split('').reverse().map(Number);
  const sum = digits.reduce((acc, d, i) => acc + d * (2 + (i % 7)), 0);
  const resto = sum % 11;
  const calculado = resto < 2 ? 0 : 11 - resto;

  if (calculado !== digito) {
    return {
      valido: false,
      error: `Dígito verificador inválido. Calculado: ${calculado}, recibido: ${digito}. Verificá el RUC en el portal de la DNIT.`,
    };
  }

  return { valido: true };
}

export function formatearRUC(ruc: string): string {
  const limpio = ruc.replace(/[\s.\-]/g, '');
  const match = limpio.match(/^(\d+)(\d)$/);
  if (!match) return ruc;
  return `${match[1]}-${match[2]}`;
}

export function normalizarRUC(ruc: string): string {
  const limpio = ruc.replace(/[\s.]/g, '');
  const match = limpio.match(/^(\d+)-?(\d{1,2})$/);
  if (!match) return ruc.trim();
  return `${match[1]}-${match[2]}`;
}
