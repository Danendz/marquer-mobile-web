/**
 * Timer background image filenames.
 * Backend stores/expects just the filename (e.g. "IMG_1157.webp").
 * Use `timerBgUrl()` to get the full path for display.
 */
export const TIMER_BACKGROUNDS: string[] = [
  'IMG_1157.webp',
  'IMG_1158.webp',
  'IMG_1159.webp',
  'IMG_1160.webp',
  'IMG_1161.webp',
  'IMG_1162.webp',
  'IMG_1163.webp',
  'IMG_1164.webp',
  'IMG_1165.webp',
  'IMG_1166.webp',
  'IMG_1167.webp',
  'IMG_1168.webp',
  'IMG_1169.webp',
  'IMG_1170.webp',
  'IMG_1171.webp',
  'IMG_1172.webp',
  'IMG_1173.webp',
  'IMG_1174.webp',
  'IMG_1175.webp',
  'IMG_1314.webp',
  'IMG_1315.webp',
  'IMG_1316.webp',
  'IMG_1317.webp',
  'IMG_1318.webp',
  'IMG_1319.webp',
  'IMG_1320.webp',
  'IMG_1321.webp',
  'IMG_1322.webp',
  'IMG_1323.webp',
  'IMG_1324.webp',
  'IMG_1325.webp',
  'IMG_1326.webp',
  'IMG_1327.webp',
  'IMG_1328.webp',
  'IMG_1330.webp',
  'IMG_1331.webp',
  'IMG_1332.webp',
  'IMG_1333.webp',
  'IMG_1334.webp',
];

const BG_PATH = '/assets/timer_bg/';

/** Full URL path for displaying a timer background image. */
export function timerBgUrl(filename: string): string {
  return `${BG_PATH}${filename}`;
}

/** Random background filename (for API payloads). */
export function randomTimerBackground(): string {
  return TIMER_BACKGROUNDS[Math.floor(Math.random() * TIMER_BACKGROUNDS.length)];
}

/** Random background full URL (for display). */
export function randomTimerBackgroundUrl(): string {
  return timerBgUrl(randomTimerBackground());
}
