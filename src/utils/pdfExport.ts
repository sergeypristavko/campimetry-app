/**
 * Экспорт результатов теста в PDF
 */

import { jsPDF } from 'jspdf';
import { TestSession } from '../types';
import { getPattern } from './gridPatterns';
import { interpretMD, interpretPSD, interpretVFI, formatReliabilityPercent } from './statistics';

/**
 * Возвращает цвет для значения порога
 */
function getThresholdColor(threshold: number): [number, number, number] {
  if (threshold >= 30) return [0, 128, 0]; // зелёный
  if (threshold >= 25) return [144, 238, 144]; // светло-зелёный
  if (threshold >= 20) return [255, 255, 0]; // жёлтый
  if (threshold >= 15) return [255, 165, 0]; // оранжевый
  if (threshold >= 10) return [255, 99, 71]; // красно-оранжевый
  if (threshold >= 5) return [255, 0, 0]; // красный
  return [139, 0, 0]; // тёмно-красный
}

/**
 * Возвращает цвет для значения отклонения
 */
function getDeviationColor(deviation: number): [number, number, number] {
  if (deviation >= -2) return [200, 200, 200]; // норма - серый
  if (deviation >= -6) return [255, 255, 150]; // лёгкое - жёлтый
  if (deviation >= -12) return [255, 200, 100]; // умеренное - оранжевый
  if (deviation >= -20) return [255, 100, 100]; // выраженное - красный
  return [139, 0, 0]; // тяжёлое - тёмно-красный
}

/**
 * Рисует карту чувствительности на PDF
 */
function drawSensitivityMap(
  doc: jsPDF,
  session: TestSession,
  x: number,
  y: number,
  size: number,
  showThresholds: boolean
) {
  const pattern = getPattern(session.pattern);
  const resultsMap = new Map(session.results.map(r => [r.pointId, r]));

  // Определяем границы паттерна
  let maxCoord = 24;
  if (session.pattern === '10-2') maxCoord = 10;
  if (session.pattern === '30-2') maxCoord = 30;

  const scale = size / (maxCoord * 2 + 10);
  const centerX = x + size / 2;
  const centerY = y + size / 2;

  // Рисуем фон
  doc.setFillColor(240, 240, 240);
  doc.rect(x, y, size, size, 'F');

  // Рисуем линии сетки
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.1);
  for (let i = -maxCoord; i <= maxCoord; i += 6) {
    const px = centerX + i * scale;
    const py = centerY - i * scale;
    doc.line(px, y, px, y + size);
    doc.line(x, py, x + size, py);
  }

  // Рисуем оси
  doc.setDrawColor(150, 150, 150);
  doc.setLineWidth(0.3);
  doc.line(centerX, y, centerX, y + size);
  doc.line(x, centerY, x + size, centerY);

  // Рисуем точку фиксации
  doc.setFillColor(0, 0, 0);
  doc.circle(centerX, centerY, 1.5, 'F');

  // Рисуем точки
  pattern.forEach(point => {
    const result = resultsMap.get(point.id);
    if (!result) return;

    const px = centerX + point.x * scale;
    const py = centerY - point.y * scale;

    const value = showThresholds ? result.threshold : result.totalDeviation;
    const color = showThresholds ? getThresholdColor(value) : getDeviationColor(value);

    doc.setFillColor(color[0], color[1], color[2]);
    doc.circle(px, py, 3, 'F');

    // Рисуем значение
    doc.setFontSize(5);
    doc.setTextColor(0, 0, 0);
    const text = Math.round(value).toString();
    doc.text(text, px, py + 1.5, { align: 'center' });
  });

  // Рисуем маркер слепого пятна для тестируемого глаза
  const blindSpotX = session.eye === 'OD' ? 15 : -15;
  const bsX = centerX + blindSpotX * scale;
  const bsY = centerY + 1.5 * scale;
  doc.setDrawColor(100, 100, 100);
  doc.setLineWidth(0.5);
  doc.circle(bsX, bsY, 4, 'S');
}

/**
 * Рисует легенду цветов
 */
function drawLegend(doc: jsPDF, x: number, y: number, showThresholds: boolean) {
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text(showThresholds ? 'dB' : 'dB', x, y);

  const items = showThresholds
    ? [
        { value: '>=30', color: [0, 128, 0] as [number, number, number] },
        { value: '25-29', color: [144, 238, 144] as [number, number, number] },
        { value: '20-24', color: [255, 255, 0] as [number, number, number] },
        { value: '15-19', color: [255, 165, 0] as [number, number, number] },
        { value: '10-14', color: [255, 99, 71] as [number, number, number] },
        { value: '<10', color: [255, 0, 0] as [number, number, number] },
      ]
    : [
        { value: '>=-2', color: [200, 200, 200] as [number, number, number] },
        { value: '-2 to -6', color: [255, 255, 150] as [number, number, number] },
        { value: '-6 to -12', color: [255, 200, 100] as [number, number, number] },
        { value: '<-12', color: [255, 100, 100] as [number, number, number] },
      ];

  items.forEach((item, i) => {
    const itemY = y + 5 + i * 6;
    doc.setFillColor(item.color[0], item.color[1], item.color[2]);
    doc.rect(x, itemY, 4, 4, 'F');
    doc.setFontSize(6);
    doc.text(item.value, x + 6, itemY + 3);
  });
}

/**
 * Экспортирует сессию в PDF-файл
 */
export function exportSessionToPDF(session: TestSession): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  let currentY = margin;

  // Заголовок
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text('Campimetry Test Results', pageWidth / 2, currentY, { align: 'center' });
  currentY += 10;

  // Подзаголовок
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Visual Field Examination Report', pageWidth / 2, currentY, { align: 'center' });
  currentY += 15;

  // Секция информации о тесте
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Test Information', margin, currentY);
  currentY += 2;
  doc.setLineWidth(0.5);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 8;

  doc.setFontSize(10);
  const testDate = new Date(session.date);
  const dateStr = testDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const timeStr = testDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const duration = Math.round(session.duration / 1000);
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  const col1 = margin;
  const col2 = pageWidth / 2;

  doc.text(`Eye: ${session.eye} (${session.eye === 'OD' ? 'Right' : 'Left'})`, col1, currentY);
  doc.text(`Date: ${dateStr}`, col2, currentY);
  currentY += 6;

  doc.text(`Pattern: ${session.pattern}`, col1, currentY);
  doc.text(`Time: ${timeStr}`, col2, currentY);
  currentY += 6;

  doc.text(`Strategy: ${session.strategy}`, col1, currentY);
  doc.text(`Duration: ${minutes}:${seconds.toString().padStart(2, '0')}`, col2, currentY);
  currentY += 6;

  doc.text(`Points tested: ${session.results.length}`, col1, currentY);
  if (session.patientAge) {
    doc.text(`Patient age: ${session.patientAge}`, col2, currentY);
  }
  currentY += 12;

  // Секция статистики
  doc.setFontSize(12);
  doc.text('Global Indices', margin, currentY);
  currentY += 2;
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 8;

  const { statistics } = session;

  // MD
  doc.setFontSize(10);
  const mdColor =
    statistics.MD >= -2 ? [0, 128, 0] : statistics.MD >= -6 ? [200, 150, 0] : [200, 0, 0];
  doc.setTextColor(0, 0, 0);
  doc.text('MD (Mean Deviation):', col1, currentY);
  doc.setTextColor(mdColor[0], mdColor[1], mdColor[2]);
  doc.text(`${statistics.MD > 0 ? '+' : ''}${statistics.MD.toFixed(2)} dB`, col1 + 50, currentY);
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.text(interpretMD(statistics.MD), col1 + 75, currentY);
  currentY += 6;

  // PSD
  doc.setFontSize(10);
  const psdColor =
    statistics.PSD <= 2 ? [0, 128, 0] : statistics.PSD <= 4 ? [200, 150, 0] : [200, 0, 0];
  doc.setTextColor(0, 0, 0);
  doc.text('PSD (Pattern Std Dev):', col1, currentY);
  doc.setTextColor(psdColor[0], psdColor[1], psdColor[2]);
  doc.text(`${statistics.PSD.toFixed(2)} dB`, col1 + 50, currentY);
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.text(interpretPSD(statistics.PSD), col1 + 75, currentY);
  currentY += 6;

  // VFI
  doc.setFontSize(10);
  const vfiColor =
    statistics.VFI >= 95 ? [0, 128, 0] : statistics.VFI >= 80 ? [200, 150, 0] : [200, 0, 0];
  doc.setTextColor(0, 0, 0);
  doc.text('VFI (Visual Field Index):', col1, currentY);
  doc.setTextColor(vfiColor[0], vfiColor[1], vfiColor[2]);
  doc.text(`${statistics.VFI}%`, col1 + 50, currentY);
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.text(interpretVFI(statistics.VFI), col1 + 75, currentY);
  currentY += 6;

  // GHT
  if (statistics.GHT) {
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text('GHT:', col1, currentY);
    const ghtText = {
      'within normal': 'Within Normal Limits',
      borderline: 'Borderline',
      'outside normal': 'Outside Normal Limits',
      'general reduction': 'General Reduction of Sensitivity',
      'abnormally high': 'Abnormally High Sensitivity',
    }[statistics.GHT];
    doc.text(ghtText || statistics.GHT, col1 + 50, currentY);
  }
  currentY += 12;

  // Секция надёжности
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Reliability Indices', margin, currentY);
  currentY += 2;
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 8;

  const { reliability } = session;
  doc.setFontSize(10);

  doc.text('Fixation Losses:', col1, currentY);
  doc.text(
    `${reliability.fixationLosses}/${reliability.fixationLossesTotal} (${formatReliabilityPercent(reliability.fixationLosses, reliability.fixationLossesTotal)})`,
    col1 + 40,
    currentY
  );
  currentY += 6;

  doc.text('False Positives:', col1, currentY);
  doc.text(
    `${reliability.falsePositives}/${reliability.falsePositivesTotal} (${formatReliabilityPercent(reliability.falsePositives, reliability.falsePositivesTotal)})`,
    col1 + 40,
    currentY
  );
  currentY += 6;

  doc.text('False Negatives:', col1, currentY);
  doc.text(
    `${reliability.falseNegatives}/${reliability.falseNegativesTotal} (${formatReliabilityPercent(reliability.falseNegatives, reliability.falseNegativesTotal)})`,
    col1 + 40,
    currentY
  );
  currentY += 15;

  // Карты поля зрения
  doc.setFontSize(12);
  doc.text('Visual Field Maps', margin, currentY);
  currentY += 2;
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 8;

  // Рисуем карту чувствительности (пороги)
  const mapSize = 70;
  doc.setFontSize(9);
  doc.text('Threshold (dB)', margin + mapSize / 2, currentY, { align: 'center' });
  currentY += 3;
  drawSensitivityMap(doc, session, margin, currentY, mapSize, true);
  drawLegend(doc, margin + mapSize + 5, currentY, true);

  // Рисуем карту отклонений
  const deviationMapX = pageWidth / 2 + 5;
  doc.text('Total Deviation (dB)', deviationMapX + mapSize / 2, currentY - 3, { align: 'center' });
  drawSensitivityMap(doc, session, deviationMapX, currentY, mapSize, false);
  drawLegend(doc, deviationMapX + mapSize + 5, currentY, false);

  currentY += mapSize + 15;

  // Футер
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    'This report is for screening purposes only. Consult an ophthalmologist for diagnosis.',
    pageWidth / 2,
    doc.internal.pageSize.getHeight() - 10,
    { align: 'center' }
  );

  // Сохраняем
  const filename = `campimetry_${session.eye}_${session.date.split('T')[0]}.pdf`;
  doc.save(filename);
}
