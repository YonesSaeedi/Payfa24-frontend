export const formatPersianNumber = (input: string | number): string => {
  if (input === null || input === undefined) return "۰";

  const numStr = String(input).replace(/,/g, "").trim();
  if (numStr === "" || isNaN(Number(numStr))) return "۰";

  let num = Number(numStr);

 
  if (Math.abs(num) >= 1) {
  const integerPart = Math.trunc(num)  
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return integerPart.replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[+d]);
}


  if (Math.abs(num) >= 0.01) {
    const fixed = num.toFixed(2)
      .replace(/0+$/, "")
      .replace(/\.$/, ""); 

    return fixed.replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[+d]);
  }

  const match = numStr.match(/^(0\.0*)(\d+)/);
  if (match) {
    const zeros = match[1];     
    const digits = match[2];    
    const trimmed = zeros + digits.slice(0, 2);

    return trimmed.replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[+d]);
  }

  return "۰";
};


export const formatEnglishNumber = (input: string | number): string => {
  if (input === null || input === undefined) return "0";

  const numStr = String(input).replace(/,/g, "").trim();
  if (numStr === "" || isNaN(Number(numStr))) return "0";

  const num = Number(numStr);

  // ⭐ اگر >= 1: اعشار حذف نشود، همان را با کاما چاپ کن
  if (Math.abs(num) >= 1) {
    // اگر اعشار ندارد → فقط صحیح را چاپ کن
    if (Number.isInteger(num)) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // اگر اعشار دارد → کامل چاپ کن
    const [intPart, decimalPart] = numStr.split(".");
    const formattedInt = Number(intPart).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formattedInt}.${decimalPart}`;
  }

  // عدد بین 0.01 و 1: دو رقم اعشار
  if (Math.abs(num) >= 0.01) {
    return num
      .toFixed(2)
      .replace(/0+$/, "")
      .replace(/\.$/, "");
  }

  // عدد کوچک‌تر از 0.01
  const match = numStr.match(/^(0\.0*)(\d+)/);
  if (match) {
    const zeros = match[1];
    const digits = match[2];
    return zeros + digits.slice(0, 2);
  }

  return "0";
};
