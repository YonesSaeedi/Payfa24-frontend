import { DigitalCurrency } from "../types/crypto";

export const ListDigitalCoin = [
  {
    cryptoNameFa: "پرفکت مانی",
    name: "PerfectMoney",
    symbol: "PM",
    colorCode: "F44336",
    icon: "perfectmoney.svg",
    type: "digitalCurrency",
    locale: {
      en: { name: "PerfectMoney" },
      fa: { name: "پرفکت مانی" }
    },
  },
  {
    cryptoNameFa: "ووچر پرفکت مانی",
    name: "PMvoucher",
    symbol: "PMV",
    colorCode: "F44336",
    icon: "perfectmoney.svg",
    type: "voucher",
    locale: {
      en: { name: "PMvoucher" },
      fa: { name: "ووچر پرفکت مانی" }
    },
  },
  {
    cryptoNameFa: "پی اس ووچر",
    name: "PSVouchers",
    symbol: "PSV",
    colorCode: "FFEB3B",
    icon: "psvoucher.svg",
    type: "voucher",
    locale: {
      en: { name: "PSVouchers" },
      fa: { name: "پی اس ووچر" }
    },
  },
  {
    cryptoNameFa: "پاییر",
    name: "Payeer",
    symbol: "PY",
    colorCode: "2196F3",
    icon: "payeer.svg",
    type: "digitalCurrency",
    locale: {
      en: { name: "Payeer" },
      fa: { name: "پاییر" }
    },
  },
  {
    cryptoNameFa: "(یو ووچر) اوتوپیا",
    name: "Utopia",
    symbol: "UUSD",
    colorCode: "448AFF",
    icon: "uusd.png",
    type: "voucher",
    locale: {
      en: { name: "Utopia" },
      fa: { name: "(یو ووچر) اوتوپیا" }
    },
  },
];

export const mappedDigitalGeneralData = ListDigitalCoin.reduce((acc, item) => {
  acc[item.symbol] = item
  return acc
}, {} as Record<string, DigitalCurrency>)