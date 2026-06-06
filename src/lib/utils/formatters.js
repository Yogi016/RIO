/**
 * Format number with Indonesian locale (dot as thousands separator)
 * @param {number} n
 * @returns {string}
 */
export function formatNumber(n) {
  if (n == null) return '-';
  return n.toLocaleString('id-ID');
}

/**
 * Format area with km² unit
 * @param {number} n
 * @returns {string}
 */
export function formatArea(n) {
  if (n == null) return '-';
  return `${n.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} km²`;
}

/**
 * Format weight in tons
 * @param {number} n
 * @returns {string}
 */
export function formatTon(n) {
  if (n == null) return '-';
  return `${n.toLocaleString('id-ID')} ton`;
}

/**
 * Format hectare area
 * @param {number} n
 * @returns {string}
 */
export function formatHa(n) {
  if (n == null) return '-';
  return `${n.toLocaleString('id-ID')} ha`;
}

/**
 * Calculate total of a specific key in an array of objects
 * @param {Array<Object>} arr
 * @param {string} key
 * @returns {number}
 */
export function calculateTotal(arr, key) {
  if (!arr || !arr.length) return 0;
  return arr.reduce((sum, item) => sum + (item[key] || 0), 0);
}

/**
 * Calculate average of a specific key in an array of objects
 * @param {Array<Object>} arr
 * @param {string} key
 * @returns {number}
 */
export function calculateAverage(arr, key) {
  if (!arr || !arr.length) return 0;
  const total = calculateTotal(arr, key);
  return Math.round((total / arr.length) * 100) / 100;
}

/**
 * Compact number format (K, M, B)
 * @param {number} n
 * @returns {string}
 */
export function compactNumber(n) {
  if (n == null) return '-';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

/**
 * Chart color palette
 * @type {string[]}
 */
export const CHART_COLORS = [
  'hsl(210, 78%, 36%)',  // blue
  'hsl(156, 71%, 31%)',  // green
  'hsl(35, 92%, 46%)',   // amber
  'hsl(188, 84%, 32%)',  // teal
  'hsl(252, 44%, 46%)',  // indigo
  'hsl(344, 65%, 43%)',  // rose
  'hsl(201, 48%, 47%)',  // sky
  'hsl(84, 45%, 38%)',   // olive
];

/**
 * Chart color palette with transparency
 * @param {number} alpha
 * @returns {string[]}
 */
export function chartColorsAlpha(alpha = 0.6) {
  return [
    `hsla(210, 78%, 36%, ${alpha})`,
    `hsla(156, 71%, 31%, ${alpha})`,
    `hsla(35, 92%, 46%, ${alpha})`,
    `hsla(188, 84%, 32%, ${alpha})`,
    `hsla(252, 44%, 46%, ${alpha})`,
    `hsla(344, 65%, 43%, ${alpha})`,
    `hsla(201, 48%, 47%, ${alpha})`,
    `hsla(84, 45%, 38%, ${alpha})`,
  ];
}

/**
 * Get accent color by category
 * @param {'pertanian' | 'perkebunan' | 'peternakan' | 'penduduk'} category
 * @returns {string}
 */
export function getCategoryColor(category) {
  const map = {
    pertanian: 'var(--accent-green)',
    perkebunan: 'var(--accent-orange)',
    peternakan: 'var(--accent-purple)',
    penduduk: 'var(--accent-blue)',
  };
  return map[category] || 'var(--accent-blue)';
}
