export function removeDecs(num: number | `${number}`): number {
  const n = Number(num);
  if (!Number.isFinite(n)) return NaN;
  // > 10 → remove decimals
  if (n > 10) return Math.trunc(n);
  // 1 ≤ n ≤ 10 → keep 1 decimal
  if (n >= 1) return Math.floor(n * 10) / 10;
  // 0 < n < 1
  if (n > 0) {
    const s = n.toString();
    // Normal decimal notation ("0.xxx")
    if (s.includes(".")) {
      const [, dec] = s.split(".");
      if (dec.length > 2) return Math.floor(n * 100) / 100;
    }
    // Scientific or tiny number → truncate manually but keep up to 6 decimals
    const truncated = n.toFixed(10).replace(/(\.\d{0,6}).*/, "$1");
    return Number(truncated);
  }
  return n; // handles 0, negative numbers
}