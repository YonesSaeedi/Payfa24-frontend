export function toFixedNoExponential(num: number, decimals = 8): string {
  if (isNaN(num)) return '0';
  return num.toLocaleString('en-US', {
    useGrouping: false,
    maximumFractionDigits: decimals
  })
}