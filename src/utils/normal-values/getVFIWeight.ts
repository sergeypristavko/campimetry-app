/**
 * Возвращает вес точки для расчёта VFI в зависимости от эксцентриситета
 * Центральные точки имеют больший вес
 * @param eccentricity - Расстояние от центра в градусах
 * @returns Вес от 0.2 до 1.0
 */
export function getVFIWeight(eccentricity: number): number {
  if (eccentricity <= 5) return 1.0;
  if (eccentricity <= 10) return 0.8;
  if (eccentricity <= 15) return 0.6;
  if (eccentricity <= 20) return 0.4;
  if (eccentricity <= 25) return 0.3;
  return 0.2;
}
