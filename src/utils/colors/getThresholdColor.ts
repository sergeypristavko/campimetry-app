/**
 * Возвращает цвет для отображения порога чувствительности
 * @param threshold - Порог чувствительности в dB
 * @returns HEX цвет для визуализации
 */
export function getThresholdColor(threshold: number): string {
  if (threshold >= 30) return '#22c55e'; // зелёный - отлично
  if (threshold >= 25) return '#84cc16'; // салатовый - хорошо
  if (threshold >= 20) return '#eab308'; // жёлтый - удовлетворительно
  if (threshold >= 15) return '#f97316'; // оранжевый - снижено
  if (threshold >= 10) return '#ef4444'; // красный - низко
  if (threshold >= 5) return '#dc2626'; // тёмно-красный - очень низко
  return '#7f1d1d'; // бордовый - тяжёлая потеря
}

/**
 * Возвращает RGB-триплет для экспорта в PDF
 * @param threshold - Порог чувствительности в dB
 * @returns RGB триплет [R, G, B] (0-255)
 */
export function getThresholdColorRGB(threshold: number): [number, number, number] {
  if (threshold >= 30) return [0, 128, 0]; // зелёный
  if (threshold >= 25) return [144, 238, 144]; // светло-зелёный
  if (threshold >= 20) return [255, 255, 0]; // жёлтый
  if (threshold >= 15) return [255, 200, 100]; // оранжевый
  if (threshold >= 10) return [255, 150, 100]; // светло-красный
  if (threshold >= 5) return [255, 100, 100]; // красный
  return [200, 0, 0]; // тёмно-красный
}
