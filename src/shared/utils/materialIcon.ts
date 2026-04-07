import type { IconifyIcon } from '@iconify/types';

/**
 * Converts an Iconify icon object to a data URI string compatible with <ion-icon>.
 * This lets us use Material Symbols icons with Ionic's icon system.
 */
export function toIonIcon(icon: IconifyIcon): string {
  const width = icon.width ?? 24;
  const height = icon.height ?? 24;
  // ion-icon expects raw (unencoded) SVG after "utf8,"
  // Replace double quotes with single quotes to avoid breaking the data URI
  // Remove fill="currentColor" — ion-icon handles color via CSS
  const body = icon.body
    .replace(/"/g, "'")
    .replace(/ fill='currentColor'/g, '');
  return `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 ${width} ${height}'>${body}</svg>`;
}
