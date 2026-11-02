/**
 * Возвращает цвет для отображения отклонения от нормы
 * @param deviation - Отклонение в dB (может быть отрицательным)
 * @returns HEX цвет для визуализации
 */
export function getDeviationColor(deviation: number): string {
  if (deviation >= -1) return '#4ade80'; // зелёный - норма
  if (deviation >= -5) return '#a3e635'; // салатовый - незначительное
  if (deviation >= -10) return '#facc15'; // жёлтый - лёгкое
  if (deviation >= -15) return '#fb923c'; // оранжевый - умеренное
  if (deviation >= -20) return '#f87171'; // красный - выраженное
  return '#991b1b'; // тёмно-красный - тяжёлое
}

/**
 * Возвращает RGB-триплет для экспорта в PDF
 * @param deviation - Отклонение в dB
 * @returns RGB триплет [R, G, B] (0-255)
 */
export function getDeviationColorRGB(deviation: number): [number, number, number] {
  if (deviation >= -2) return [200, 200, 200]; // норма - серый
  if (deviation >= -6) return [255, 255, 150]; // лёгкое - жёлтый
  if (deviation >= -12) return [255, 200, 100]; // умеренное - оранжевый
  if (deviation >= -18) return [255, 150, 100]; // выраженное - красный
  return [255, 100, 100]; // тяжёлое - тёмно-красный
}
