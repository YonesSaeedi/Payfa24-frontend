import CryptoJS from "crypto-js";

const SECRET_KEY = "V65HMX2FHYVQCFT33WX3PCPY7H59MIBDOMCOWQ4LALMYCYBY4HJIGAN51JOEK590";

export function getAuthHeaders(method: string, path: string, body: any = [], params?: Record<string, any>) {

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const device = "website";

  let bodyForSign: any;

  // GET → فقط params
  if (method === "GET") {
    const rawParams = params ?? {};

    const cleanedParams = Object.fromEntries(
      Object.entries(rawParams)
        .filter(([_, v]) => v !== "" && v !== null && v !== undefined)
        .map(([k, v]) => [k, String(v)])
    );

    bodyForSign = Object.keys(cleanedParams).length > 0 ? cleanedParams : [];
  } else {
    // POST → JSON or FormData
    if (body instanceof FormData) {
      const jsonObj: Record<string, any> = {};
      body.forEach((val, key) => {
        if (val instanceof File) return; // ← فایل ها را نادیده بگیر
        if (val !== "" && val !== null && val !== undefined) jsonObj[key] = val;
      });
      bodyForSign = Object.keys(jsonObj).length ? jsonObj : [];
    } else if (body && typeof body === 'object') {
      // Remove empty values for plain objects
      const cleanedBody = Object.fromEntries(
        Object.entries(body).filter(
          ([_, v]) => v !== "" && v !== null && v !== undefined
        )
      );
      bodyForSign = Object.keys(cleanedBody).length ? cleanedBody : [];
    }
    else {
      bodyForSign = [];
    }
  }

  let cleanPath = path;

  cleanPath = cleanPath.replace(/^\//, ""); // حذف اسلش اول
  if (!cleanPath.startsWith("api/v4/")) {
    cleanPath = "api/v4/" + cleanPath.replace(/^v4\//, "");
  }

  const dataToSign = `${method} ${cleanPath} ${timestamp} ${JSON.stringify(bodyForSign)}`;

  const signature = CryptoJS.HmacSHA256(dataToSign, SECRET_KEY)
    .toString(CryptoJS.enc.Hex);

  return {
    "X-Timestamp": timestamp,
    "X-Device": device,
    "X-Signature": signature
  };
}
