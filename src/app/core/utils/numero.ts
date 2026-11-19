/**
 * Converte um valor numérico ou texto formatado em pt-BR (ex.: "R$ 1.234,56") para number.
 * Valores vazios ou inválidos retornam 0.
 */
export function paraNumero(valor: unknown): number {
  if (typeof valor === 'number') {
    return Number.isFinite(valor) ? valor : 0;
  }
  if (valor == null || valor === '') {
    return 0;
  }
  const texto = String(valor).replace(/[^\d,.-]/g, '');
  // Formato pt-BR: ponto = milhar, vírgula = decimal.
  const normalizado = texto.includes(',') ? texto.replace(/\./g, '').replace(',', '.') : texto;
  const numero = parseFloat(normalizado);
  return Number.isFinite(numero) ? numero : 0;
}
