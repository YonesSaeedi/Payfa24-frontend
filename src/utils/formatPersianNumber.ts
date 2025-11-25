
export const formatPersianNumber = (input: string | number): string => {
  if (input === null || input === undefined) return "۰";

  const numStr = String(input).replace(/,/g, "").trim();
  if (numStr === "" || isNaN(Number(numStr))) return "۰";

  const [intPartRaw, decimalRaw] = numStr.split(".");

  const intPart = intPartRaw.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  let decimal = decimalRaw ? decimalRaw.replace(/0+$/, "") : "";

  if (decimalRaw) {
    if (parseInt(decimalRaw) === 0) {
      decimal = "";
    } else if (numStr.startsWith("0.")) {
      const match = decimalRaw.match(/^0+(.*)$/);
      if (match) {
        const nonZeroPart = match[1].slice(0, 2);
        decimal = match[0].slice(0, -match[1].length) + nonZeroPart;
      }
    } else {
      decimal = decimal.slice(0, 2);
    }
  }

  const finalNumber = decimal ? `${intPart}.${decimal}` : intPart;

  return finalNumber.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d)]);
};










export const formatEnglishNumber = (input: string | number): string => {
  if (input === null || input === undefined) return "0";

  const numStr = String(input).replace(/,/g, "").trim();
  if (numStr === "" || isNaN(Number(numStr))) return "0";

  const [intPartRaw, decimalRaw] = numStr.split(".");

  // افزودن جداکننده هزارگان
  const intPart = intPartRaw.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  let decimal = decimalRaw ? decimalRaw.replace(/0+$/, "") : "";

  if (decimalRaw) {
    if (parseInt(decimalRaw) === 0) {
      decimal = "";
    } else if (numStr.startsWith("0.")) {
      const match = decimalRaw.match(/^0+(.*)$/);
      if (match) {
        const nonZeroPart = match[1].slice(0, 2);
        decimal = match[0].slice(0, -match[1].length) + nonZeroPart;
      }
    } else {
      decimal = decimal.slice(0, 2);
    }
  }

  return decimal ? `${intPart}.${decimal}` : intPart;
};
