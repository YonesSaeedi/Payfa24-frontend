export const formatPersianNumber = (input: string | number): string => {
  if (input === null || input === undefined) return "۰";

  const numStr = String(input).replace(/,/g, "").trim();
  if (numStr === "" || isNaN(Number(numStr))) return "۰";

  let num = Number(numStr);

  // اعداد بزرگ‌تر از 1 بدون رند کردن
  if (Math.abs(num) >= 1) {
  const integerPart = Math.trunc(num)  // قسمت صحیح بدون رند کردن
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

  let num = Number(numStr);

 
  if (Math.abs(num) >= 1) {
    const rounded = Math.round(num).toString();
    return rounded.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

 
  if (Math.abs(num) >= 0.01) {
    return num
      .toFixed(2)
      .replace(/0+$/, "")
      .replace(/\.$/, ""); 
  }

  
  const match = numStr.match(/^(0\.0*)(\d+)/);
  if (match) {
    const zeros = match[1];     
    const digits = match[2];    
    return zeros + digits.slice(0, 2);
  }

  return "0";
};

