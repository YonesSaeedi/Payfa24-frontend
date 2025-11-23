export function formatCryptoAmount(value: number | string): string {
  if (value === null || value === undefined) return "0";

  let num = Number(value);

  // اگر NaN باشد
  if (isNaN(num)) return "0";

  // مقادیر بزرگ
  if (Math.abs(num) >= 1) {
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 4,
    });
  }

  // مقادیر کوچک‌تر از 1 ولی بالای 0.0001
  if (Math.abs(num) >= 0.0001) {
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 8,
    });
  }

  // مقادیر خیلی کوچک → scientific
  return num.toExponential(4);
}
