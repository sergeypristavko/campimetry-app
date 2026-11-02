/**
 * Интерпретация статистических показателей теста
 */

/**
 * Интерпретация значения MD
 */
export function interpretMD(md: number): string {
  if (md >= -2) return 'В пределах нормы';
  if (md >= -6) return 'Лёгкое снижение';
  if (md >= -12) return 'Умеренное снижение';
  if (md >= -20) return 'Выраженное снижение';
  return 'Тяжёлое снижение';
}

/**
 * Интерпретация значения PSD
 */
export function interpretPSD(psd: number): string {
  if (psd <= 2) return 'В пределах нормы';
  if (psd <= 4) return 'Незначительная локализация';
  if (psd <= 6) return 'Умеренная локализация';
  return 'Выраженная локализация';
}

/**
 * Интерпретация значения VFI
 */
export function interpretVFI(vfi: number): string {
  if (vfi >= 95) return 'Норма';
  if (vfi >= 80) return 'Лёгкие изменения';
  if (vfi >= 60) return 'Умеренные изменения';
  if (vfi >= 40) return 'Выраженные изменения';
  return 'Тяжёлые изменения';
}
