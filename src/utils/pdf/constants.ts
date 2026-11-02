/**
 * PDF export constants for layout, spacing, and styling
 */

// Page layout
export const PAGE_MARGIN = 15;

// Typography
export const FONT_SIZE = {
  TITLE: 18,
  SUBTITLE: 10,
  SECTION_HEADER: 12,
  BODY: 10,
  SMALL: 8,
  TINY: 6,
  MAP_LABEL: 9,
  MAP_VALUE: 5,
} as const;

// Colors
export const TEXT_COLOR = {
  PRIMARY: [0, 0, 0] as [number, number, number],
  SECONDARY: [100, 100, 100] as [number, number, number],
  MUTED: [150, 150, 150] as [number, number, number],
} as const;

export const BACKGROUND_COLOR = {
  MAP: [240, 240, 240] as [number, number, number],
} as const;

// Spacing
export const SPACING = {
  AFTER_TITLE: 10,
  AFTER_SUBTITLE: 15,
  AFTER_SECTION_HEADER: 8,
  SECTION_MARGIN: 12,
  LINE_HEIGHT: 6,
  FOOTER_OFFSET: 10,
} as const;

// Map settings
export const MAP = {
  SIZE: 70,
  LEGEND_OFFSET: 5,
  GRID_LINE_WIDTH: 0.1,
  AXIS_LINE_WIDTH: 0.3,
  POINT_RADIUS: 3,
  FIXATION_RADIUS: 1.5,
  BLIND_SPOT_RADIUS: 4,
  BLIND_SPOT_LINE_WIDTH: 0.5,
} as const;

// Grid colors
export const GRID_COLOR = {
  LINES: [200, 200, 200] as [number, number, number],
  AXES: [150, 150, 150] as [number, number, number],
  FIXATION: [0, 0, 0] as [number, number, number],
  BLIND_SPOT: [100, 100, 100] as [number, number, number],
} as const;

// Line widths
export const LINE_WIDTH = {
  SECTION_DIVIDER: 0.5,
} as const;

// Legend settings
export const LEGEND = {
  ITEM_HEIGHT: 6,
  ITEM_OFFSET: 5,
  SQUARE_SIZE: 4,
  TEXT_OFFSET: 6,
} as const;

// Threshold color scale items
export const THRESHOLD_SCALE_ITEMS = [
  { value: '>=30', color: [0, 128, 0] as [number, number, number] },
  { value: '25-29', color: [144, 238, 144] as [number, number, number] },
  { value: '20-24', color: [255, 255, 0] as [number, number, number] },
  { value: '15-19', color: [255, 165, 0] as [number, number, number] },
  { value: '10-14', color: [255, 99, 71] as [number, number, number] },
  { value: '<10', color: [255, 0, 0] as [number, number, number] },
] as const;

// Deviation color scale items
export const DEVIATION_SCALE_ITEMS = [
  { value: '>=-2', color: [200, 200, 200] as [number, number, number] },
  { value: '-2 to -6', color: [255, 255, 150] as [number, number, number] },
  { value: '-6 to -12', color: [255, 200, 100] as [number, number, number] },
  { value: '<-12', color: [255, 100, 100] as [number, number, number] },
] as const;

// Statistic color thresholds
export const STAT_COLORS = {
  MD: {
    GOOD: [0, 128, 0] as [number, number, number],
    MODERATE: [200, 150, 0] as [number, number, number],
    POOR: [200, 0, 0] as [number, number, number],
  },
  PSD: {
    GOOD: [0, 128, 0] as [number, number, number],
    MODERATE: [200, 150, 0] as [number, number, number],
    POOR: [200, 0, 0] as [number, number, number],
  },
  VFI: {
    GOOD: [0, 128, 0] as [number, number, number],
    MODERATE: [200, 150, 0] as [number, number, number],
    POOR: [200, 0, 0] as [number, number, number],
  },
} as const;
