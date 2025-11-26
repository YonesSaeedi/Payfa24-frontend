// import React, { useState, useEffect } from "react";
// import BackgroundCard from "./../../assets/images/BankCards/BackgroundCard.png";
// import BackgroundCardDark from "./../../assets/images/BankCards/BackgroundCardDark.png";
// import IconAccept from "../../assets/icons/BankCards/IconAccept";
// import IconInProgress from "../../assets/icons/BankCards/IconInProgress";
// import IconDelete from "../../assets/icons/BankCards/IconDelete";
// import useGetUser from "../../hooks/useGetUser"; 



// type Card = {
//   id: number;
//   number: string;
//   holder: string;
//   bankName: string;
//   status: "confirm" | "pending" | "reject";
// };

// type BankCardListProps = {
//   cards: Card[];
//   onAddCard: () => void;
// };


// const banks: { name: string; img: string }[] = [
//   {   img: 'bank-sayer.png', name: 'سایر' },
//   {   img: 'bank-mellat.png', name: 'بانک ملت' },
//   {   img: 'bank-melli.png', name: 'بانک ملی' },
//   {   img: 'bank-tejarat.png', name: 'بانک تجارت' },
//   {   img: 'bank-sepah.png', name: 'بانک سپه' },
//   {   img: 'bank-toseesaderat.png', name: 'بانک توسعه صادرات' },
//   {   img: 'bank-sanatvamadan.png', name: 'بانک صنعت و معدن' },
//   {   img: 'bank-keshavarzi.png', name: 'بانک کشاورزی' },
//   {   img: 'bank-maskan.png', name: 'بانک مسکن' },
//   {   img: 'bank-post.png', name: 'پست بانک' },
//   {  img: 'bank-tosee.png', name: 'بانک توسعه و تعاون' },
//   {   img: 'bank-eqtesadnovin.png', name: 'بانک اقتصاد نوین' },
//   {   img: 'bank-parsian.png', name: 'بانک پارسیان' },
//   {   img: 'bank-pasargad.png', name: 'بانک پاسارگاد'},
//   {   img: 'bank-karafarin.png', name: 'بانک کارآفرین' },
//   {   img: 'bank-saman.png', name: 'بانک سامان' },
//   {   img: 'bank-sina.png', name: 'بانک سینا' },
//   {   img: 'bank-sarmaye.png', name: 'بانک سرمایه'},
//   {   img: 'bank-ayandeh.png', name: 'بانک آینده' },
//   {   img: 'bank-shahr.png', name: 'بانک شهر' },
//   {   img: 'bank-day.png', name: 'بانک دی' },
//   {   img: 'bank-saderat.png', name: 'بانک صادرات'},
//   {   img: 'bank-refah.png', name: 'بانک رفاه' },
//   {   img: 'bank-ansar.png', name: 'بانک انصار' },
//   {   img: 'bank-iranzamin.png', name: 'بانک ایران زمین' },
//   {   img: 'bank-hekmatiranian.png', name: 'بانک حکمت ایرانیان'},
//   {   img: 'bank-gardeshgari.png', name: 'بانک گردشگری' },
//   {   img: 'bank-mehriran.png', name: 'بانک قرض الحسنه مهر ایران' },
//   {   img: 'bank-kosar.png', name: 'موسسه مالی کوثر' },
//   {   img: 'bank-ghavamin.png', name: 'موسسه قوامین' },
//   {   img: 'bank-khavarmiane.png', name: 'بانک خاورمیانه' },
//   {   img: 'bank-resalat.png', name: 'رسالت' },
//   {   img: 'bank-noor.png', name: 'موسسه نور' },
//   {   img: 'bank-blu.png', name: 'بلوبانک' },
//   {   img: 'bank-mehreghtesad.png', name: 'بانک مهر اقتصاد' },
//   {   img: 'bank-melal.png', name: 'موسسه ملل' },
//   {   img: 'bank-markazi.png', name: 'بانک مرکزی' },
// ];

// const getBankLogo = (bankName: string) => {
//   const bank = banks.find((b) => b.name === bankName);
//   return bank ? `/bank-logos/${bank.img}` : null;
// };

// const BankCardList: React.FC<BankCardListProps> = ({ cards }) => {
//   const [isDark, setIsDark] = useState(false);
//   const { data: userData } = useGetUser();

//   useEffect(() => {
//     const updateTheme = () => {
//       setIsDark(document.documentElement.classList.contains("dark"));
//     };

//     updateTheme();

//     const observer = new MutationObserver(updateTheme);
//     observer.observe(document.documentElement, {
//       attributes: true,
//       attributeFilter: ["class"],
//     });

//     return () => observer.disconnect();
//   }, []);

//   const statusColor = (status: Card["status"]) => {
//     switch (status) {
//       case "confirm":
//         return "text-green-500";
//       case "pending":
//         return "text-orange-500";
//       case "reject":
//         return "text-red-500";
//       default:
//         return "";
//     }
//   };
// const statusText: Record<Card["status"], string> = {
//   confirm: "تایید شده",
//   pending: "درحال بررسی",
//   reject: "رد شده",
// };

//   const statusIcon = (status: Card["status"]) => {
//     switch (status) {
//       case "confirm":
//         return (
//           <span className="w-[18px] h-[18px]">
//             <IconAccept />
//           </span>
//         );
//       case "pending":
//         return (
//           <span className="w-[18px] h-[18px]">
//             <IconInProgress />
//           </span>
//         );
//       case "reject":
//         return (
//           <span className="w-[18px] h-[18px]">
//             <IconDelete />
//           </span>
//         );
//       default:
//         return null;
//     }
//   };
//  const formatPersianCardNumber = (input: string | number): string => {
//   if (input === null || input === undefined || input === "") return "";
//   const persianMap = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
//   const persianNumber = String(input).replace(/[0-9]/g, (d) => persianMap[+d]);
//   return persianNumber.replace(/(.{4})(?=.)/g, "$1 ");
// };

//   return (
//     <div dir="rtl ">
//       <h2 className=" lg:mb-[32px] mb-3 lg:text-2xl  text-black1 font-bold text-[14px]">کارت‌های من</h2>
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//         {cards.map((card) => {
//           const logoSrc = getBankLogo(card.bankName);
//           return (
//             <div
//               dir="rtl"
//               key={card.id}
//               className="lg:rounded-xl shadow p-4 flex flex-col justify-between relative rounded-[16px]
// "
//               style={{
//                 backgroundImage:`url(${isDark ? BackgroundCardDark : BackgroundCard})`,
//                 backgroundSize: "cover",
//                 backgroundPosition:"center",
//               }}
//             >
//               <div className="flex justify-start items-center space-x-2 relative z-10">
//                   <div className="h-6 w-6 ml-1">
//                   {logoSrc ? (
//                     <img
//                       src={logoSrc}
//                       alt={card.bankName}
//                       className="w-6 h-6 object-contain"
//                     />
//                   ) : (
//                     <div className="h-6 w-6 rounded bg-gray-300"/>
//                   )}
//                 </div>
//                 <div className="font-semibold  text-black1">{card.bankName}</div>
              
//               </div>

//               <div dir="rtl" className="relative z-10 flex justify-end flex-col pt-6">
//                 <p className=" pb-1 text-black1 text-[12px] font-normal">شماره کارت</p>
//                 <div dir="ltr" className="text-lg mb-2 text-black1 font-medium text-right"> {formatPersianCardNumber(card.number)}</div>
//               </div>

//               <div className="relative z-10 flex justify-between flex-row-reverse pt-2 items-center">
//               <div className={`font-medium text-xs flex items-center gap-1 ${statusColor(card.status)}`}>
//   {statusIcon(card.status)}
//   {statusText[card.status]}
// </div>


//                 <div className="flex flex-col">
//                   <p className="text-black1 text-[12px] font-normal">دارنده کارت</p>
//                   <div className="text-sm text-black1 mb-2 font-medium"> {card.holder || userData?.user.name_display || "—"}</div>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default BankCardList;
import React, { useState, useEffect } from "react";
import BackgroundCard from "./../../assets/images/BankCards/BackgroundCard.png";
import BackgroundCardDark from "./../../assets/images/BankCards/BackgroundCardDark.png";
import IconAccept from "../../assets/icons/BankCards/IconAccept";
import IconInProgress from "../../assets/icons/BankCards/IconInProgress";
import IconDelete from "../../assets/icons/BankCards/IconDelete";


// =========================
// 🔥 تایپ اصلی کارت داخل UI
// =========================
export type Card = {
  id: string; 
  number: string;
  holder: string;
  bankName: string;
  status: "confirm" | "pending" | "reject";
  reason?: string | null;
};

// =========================
// 🔥 تایپ خروجی API
// =========================
export type ApiCard = {
  bank_name: string;
  card_number: string;
  iban: string | null;
  status: "confirm" | "pending" | "reject";
  reason: string | null;
};

// =========================
// 🔥 مپ کردن API → UI
// =========================
export const mapApiCardToUI = (apiCard: ApiCard): Card => {
  return {
    id: apiCard.card_number,
    number: apiCard.card_number,
    holder: "", // از userData گرفته می‌شود
    bankName: apiCard.bank_name,
    status: apiCard.status,
    reason: apiCard.reason,
  };
};

type BankCardListProps = {
  cards: Card[];
  onAddCard?: () => void;
};

const banks: { name: string; img: string }[] = [
  { img: 'bank-sayer.png', name: 'سایر' },
  { img: 'bank-mellat.png', name: 'بانک ملت' },
  { img: 'bank-melli.png', name: 'بانک ملی' },
  { img: 'bank-tejarat.png', name: 'بانک تجارت' },
  { img: 'bank-sepah.png', name: 'بانک سپه' },
  { img: 'bank-toseesaderat.png', name: 'بانک توسعه صادرات' },
  { img: 'bank-sanatvamadan.png', name: 'بانک صنعت و معدن' },
  { img: 'bank-keshavarzi.png', name: 'بانک کشاورزی' },
  { img: 'bank-maskan.png', name: 'بانک مسکن' },
  { img: 'bank-post.png', name: 'پست بانک' },
  { img: 'bank-tosee.png', name: 'بانک توسعه و تعاون' },
  { img: 'bank-eqtesadnovin.png', name: 'بانک اقتصاد نوین' },
  { img: 'bank-parsian.png', name: 'بانک پارسیان' },
  { img: 'bank-pasargad.png', name: 'بانک پاسارگاد'},
  { img: 'bank-karafarin.png', name: 'بانک کارآفرین' },
  { img: 'bank-saman.png', name: 'بانک سامان' },
  { img: 'bank-sina.png', name: 'بانک سینا' },
  { img: 'bank-sarmaye.png', name: 'بانک سرمایه'},
  { img: 'bank-ayandeh.png', name: 'بانک آینده' },
  { img: 'bank-shahr.png', name: 'بانک شهر' },
  { img: 'bank-day.png', name: 'بانک دی' },
  { img: 'bank-saderat.png', name: 'بانک صادرات'},
  { img: 'bank-refah.png', name: 'بانک رفاه' },
  { img: 'bank-ansar.png', name: 'بانک انصار' },
  { img: 'bank-iranzamin.png', name: 'بانک ایران زمین' },
  { img: 'bank-hekmatiranian.png', name: 'بانک حکمت ایرانیان'},
  { img: 'bank-gardeshgari.png', name: 'بانک گردشگری' },
  { img: 'bank-mehriran.png', name: 'بانک قرض الحسنه مهر ایران' },
  { img: 'bank-kosar.png', name: 'موسسه مالی کوثر' },
  { img: 'bank-ghavamin.png', name: 'موسسه قوامین' },
  { img: 'bank-khavarmiane.png', name: 'بانک خاورمیانه' },
  { img: 'bank-resalat.png', name: 'رسالت' },
  { img: 'bank-noor.png', name: 'موسسه نور' },
  { img: 'bank-blu.png', name: 'بلوبانک' },
  { img: 'bank-mehreghtesad.png', name: 'بانک مهر اقتصاد' },
  { img: 'bank-melal.png', name: 'موسسه ملل' },
  { img: 'bank-markazi.png', name: 'بانک مرکزی' },
];

const getBankLogo = (bankName: string) => {
  const bank = banks.find((b) => b.name === bankName);
  return bank ? `/bank-logos/${bank.img}` : null;
};

const BankCardList: React.FC<BankCardListProps> = ({ cards }) => {
  const [isDark, setIsDark] = useState(false);
  

  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const statusColor = (status: Card["status"]) => {
    switch (status) {
      case "confirm":
        return "text-green-500";
      case "pending":
        return "text-orange-500";
      case "reject":
        return "text-red-500";
      default:
        return "";
    }
  };

  const statusText: Record<Card["status"], string> = {
    confirm: "تایید شده",
    pending: "درحال بررسی",
    reject: "رد شده",
  };

  const statusIcon = (status: Card["status"]) => {
    switch (status) {
      case "confirm":
        return (
          <span className="w-[18px] h-[18px]"><IconAccept /></span>
        );
      case "pending":
        return (
          <span className="w-[18px] h-[18px]"><IconInProgress /></span>
        );
      case "reject":
        return (
          <span className="w-[18px] h-[18px]"><IconDelete /></span>
        );
      default:
        return null;
    }
  };

  const formatPersianCardNumber = (input: string | number): string => {
    if (input === null || input === undefined || input === "") return "";
    const persianMap = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    const persianNumber = String(input).replace(/[0-9]/g, (d) => persianMap[+d]);
    return persianNumber.replace(/(.{4})(?=.)/g, "$1 ");
  };

  return (
    <div dir="rtl ">
      <h2 className="lg:mb-[32px] mb-3 lg:text-2xl text-black1 font-bold text-[14px]">کارت‌های من</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {cards.map((card) => {
          const logoSrc = getBankLogo(card.bankName);
          return (
            <div
              dir="rtl"
              key={card.id}
              className="lg:rounded-xl shadow p-4 flex flex-col justify-between relative rounded-[16px]"
              style={{
                backgroundImage:`url(${isDark ? BackgroundCardDark : BackgroundCard})`,
                backgroundSize: "cover",
                backgroundPosition:"center",
              }}
            >
              <div className="flex justify-start items-center space-x-2 relative z-10">
                <div className="h-6 w-6 ml-1">
                  {logoSrc ? (
                    <img src={logoSrc} alt={card.bankName} className="w-6 h-6 object-contain" />
                  ) : (
                    <div className="h-6 w-6 rounded bg-gray-300"/>
                  )}
                </div>
                <div className="font-semibold text-black1">{card.bankName}</div>
              </div>

              <div dir="rtl" className="relative z-10 flex justify-end flex-col pt-6">
                <p className="pb-1 text-black1 text-[12px] font-normal">شماره کارت</p>
                <div dir="ltr" className="text-lg mb-2 text-black1 font-medium text-right">
                  {formatPersianCardNumber(card.number)}
                </div>
              </div>

              <div className="relative z-10 flex justify-between flex-row-reverse pt-2 items-center">
                <div className={`font-medium text-xs flex items-center gap-1 ${statusColor(card.status)}`}>
                  {statusIcon(card.status)}
                  {statusText[card.status]}
                </div>

                <div className="flex flex-col">
                  <p className="text-black1 text-[12px] font-normal">دارنده کارت</p>
                  <div className="text-sm text-black1 mb-2 font-medium">
                    {card.holder || "—"}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BankCardList;
