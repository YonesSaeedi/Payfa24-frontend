export function formatPersianDigits(input: string | number): string {
  if (input === null || input === undefined || input === "") return "";
  const persianMap = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const str = String(input).replace(/,/g, "");
  const [intPart, decimalPart] = str.split(".");
  // Add commas to integer part
  const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const persianInt = withCommas.replace(/[0-9]/g, d => persianMap[+d]);
  const persianDec = decimalPart
    ? decimalPart.replace(/[0-9]/g, d => persianMap[+d])
    : "";
  return decimalPart ? `${persianInt}.${persianDec}` : persianInt;
}
