// src/utils/bankLogos.ts

export interface BankLogo {
  name: string;
  img: string;
}

export const banks: BankLogo[] = [
  { img: "bank-sayer.png", name: "سایر" },
  { img: "bank-mellat.png", name: "بانک ملت" },
  { img: "bank-melli.png", name: "بانک ملی" },
  { img: "bank-tejarat.png", name: "بانک تجارت" },
  { img: "bank-sepah.png", name: "بانک سپه" },
  { img: "bank-toseesaderat.png", name: "بانک توسعه صادرات" },
  { img: "bank-sanatvamadan.png", name: "بانک صنعت و معدن" },
  { img: "bank-keshavarzi.png", name: "بانک کشاورزی" },
  { img: "bank-maskan.png", name: "بانک مسکن" },
  { img: "bank-post.png", name: "پست بانک" },
  { img: "bank-tosee.png", name: "بانک توسعه و تعاون" },
  { img: "bank-eqtesadnovin.png", name: "بانک اقتصاد نوین" },
  { img: "bank-parsian.png", name: "بانک پارسیان" },
  { img: "bank-pasargad.png", name: "بانک پاسارگاد" },
  { img: "bank-karafarin.png", name: "بانک کارآفرین" },
  { img: "bank-saman.png", name: "بانک سامان" },
  { img: "bank-sina.png", name: "بانک سینا" },
  { img: "bank-sarmaye.png", name: "بانک سرمایه" },
  { img: "bank-ayandeh.png", name: "بانک آینده" },
  { img: "bank-shahr.png", name: "بانک شهر" },
  { img: "bank-day.png", name: "بانک دی" },
  { img: "bank-saderat.png", name: "بانک صادرات" },
  { img: "bank-refah.png", name: "بانک رفاه" },
  { img: "bank-ansar.png", name: "بانک انصار" },
  { img: "bank-iranzamin.png", name: "بانک ایران زمین" },
  { img: "bank-hekmatiranian.png", name: "بانک حکمت ایرانیان" },
  { img: "bank-gardeshgari.png", name: "بانک گردشگری" },
  { img: "bank-mehriran.png", name: "بانک قرض الحسنه مهر ایران" },
  { img: "bank-kosar.png", name: "موسسه مالی کوثر" },
  { img: "bank-ghavamin.png", name: "موسسه قوامین" },
  { img: "bank-khavarmiane.png", name: "بانک خاورمیانه" },
  { img: "bank-resalat.png", name: "رسالت" },
  { img: "bank-noor.png", name: "موسسه نور" },
  { img: "bank-blu.png", name: "بلوبانک" },
  { img: "bank-mehreghtesad.png", name: "بانک مهر اقتصاد" },
  { img: "bank-melal.png", name: "موسسه ملل" },
  { img: "bank-markazi.png", name: "بانک مرکزی" },
];


export const getBankLogo = (bankName: string) => {
  const bank = banks.find((b) => b.name === bankName);
  return bank ? `/bank-logos/${bank.img}` : null;
};