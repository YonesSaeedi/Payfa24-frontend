import CryptoJS from "crypto-js";

const SECRET_KEY = "V65HMX2FHYVQCFT33WX3PCPY7H59MIBDOMCOWQ4LALMYCYBY4HJIGAN51JOEK590";

export function getAuthHeaders(method: string, path: string, body: any = [], params?: Record<string, any>) {

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const device = "website";

  let bodyForSign: any;

  // GET → فقط params
  if (method === "GET") {
    const rawParams = params ?? {};
    console.log("rawParams", rawParams);

    const cleanedParams = Object.fromEntries(
      Object.entries(rawParams)
        .filter(([_, v]) => v !== "" && v !== null && v !== undefined)
        .map(([k, v]) => [k, String(v)])
    );

    bodyForSign = Object.keys(cleanedParams).length > 0 ? cleanedParams : [];
  } else {
    // POST → JSON or FormData
    if (body instanceof FormData) {
    const jsonObj: any = {};
    body.forEach((val, key) => {
      if (val instanceof File) return; // ← فایل ها را نادیده بگیر
      jsonObj[key] = val;
    });
    bodyForSign = Object.keys(jsonObj).length ? jsonObj : [];
    } else {
      bodyForSign = body && Object.keys(body).length ? body : [];
    }
  }

  console.log("bodyForSign", bodyForSign);


  // ❗ پاکسازی و استانداردسازی path
  // سرور انتظار دارد: api/v4/xxxxx
  let cleanPath = path;

  cleanPath = cleanPath.replace(/^\//, ""); // حذف اسلش اول
  if (!cleanPath.startsWith("api/v4/")) {
    cleanPath = "api/v4/" + cleanPath.replace(/^v4\//, "");
  }

  // اکنون cleanPath همیشه این شکل را دارد:
  // api/v4/wallets/fiat

  const dataToSign = `${method} ${cleanPath} ${timestamp} ${JSON.stringify(bodyForSign)}`;

  const signature = CryptoJS.HmacSHA256(dataToSign, SECRET_KEY)
    .toString(CryptoJS.enc.Hex);

  return {
    "X-Timestamp": timestamp,
    "X-Device": device,
    "X-Signature": signature
  };
}
