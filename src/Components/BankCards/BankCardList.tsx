import React, { useState, useEffect } from "react";
import BackgroundCard from "./../../assets/images/BankCards/BackgroundCard.png";
import BackgroundCardDark from "./../../assets/images/BankCards/BackgroundCardDark.png";
import IconAccept from "./../../assets/icons/BankCards/IconAccept";
import IconInProgress from "./../../assets/icons/BankCards/IconInProgress";
import IconDelete from "./../../assets/icons/BankCards/IconDelete";
import useGetUser from "../../hooks/useGetUser"; 

type Card = {
  id: number;
  number: string;
  holder: string;
  bankName: string;
  status: "confirm" | "pending" | "rejected";
};

type BankCardListProps = {
  cards: Card[];
  onAddCard: () => void;
};

// تعریف بانک‌ها با تصویرشان
const banks: { name: string; img: string }[] = [
  {   img: 'bank-sayer.png', name: 'سایر' },
  {   img: 'bank-mellat.png', name: 'بانک ملت' },
  {   img: 'bank-melli.png', name: 'بانک ملی' },
  {   img: 'bank-tejarat.png', name: 'بانک تجارت' },
  {   img: 'bank-sepah.png', name: 'بانک سپه' },
  {   img: 'bank-toseesaderat.png', name: 'بانک توسعه صادرات' },
  {   img: 'bank-sanatvamadan.png', name: 'بانک صنعت و معدن' },
  {   img: 'bank-keshavarzi.png', name: 'بانک کشاورزی' },
  {   img: 'bank-maskan.png', name: 'بانک مسکن' },
  {   img: 'bank-post.png', name: 'پست بانک' },
  {  img: 'bank-tosee.png', name: 'بانک توسعه و تعاون' },
  {   img: 'bank-eqtesadnovin.png', name: 'بانک اقتصاد نوین' },
  {   img: 'bank-parsian.png', name: 'بانک پارسیان' },
  {   img: 'bank-pasargad.png', name: 'بانک پاسارگاد'},
  {   img: 'bank-karafarin.png', name: 'بانک کارآفرین' },
  {   img: 'bank-saman.png', name: 'بانک سامان' },
  {   img: 'bank-sina.png', name: 'بانک سینا' },
  {   img: 'bank-sarmaye.png', name: 'بانک سرمایه'},
  {   img: 'bank-ayandeh.png', name: 'بانک آینده' },
  {   img: 'bank-shahr.png', name: 'بانک شهر' },
  {   img: 'bank-day.png', name: 'بانک دی' },
  {   img: 'bank-saderat.png', name: 'بانک صادرات'},
  {   img: 'bank-refah.png', name: 'بانک رفاه' },
  {   img: 'bank-ansar.png', name: 'بانک انصار' },
  {   img: 'bank-iranzamin.png', name: 'بانک ایران زمین' },
  {   img: 'bank-hekmatiranian.png', name: 'بانک حکمت ایرانیان'},
  {   img: 'bank-gardeshgari.png', name: 'بانک گردشگری' },
  {   img: 'bank-mehriran.png', name: 'بانک قرض الحسنه مهر ایران' },
  {   img: 'bank-kosar.png', name: 'موسسه مالی کوثر' },
  {   img: 'bank-ghavamin.png', name: 'موسسه قوامین' },
  {   img: 'bank-khavarmiane.png', name: 'بانک خاورمیانه' },
  {   img: 'bank-resalat.png', name: 'بانک قرض الحسنه رسالت' },
  {   img: 'bank-noor.png', name: 'موسسه نور' },
  {   img: 'bank-blu.png', name: 'بلوبانک' },
  {   img: 'bank-mehreghtesad.png', name: 'بانک مهر اقتصاد' },
  {   img: 'bank-melal.png', name: 'موسسه ملل' },
  {   img: 'bank-markazi.png', name: 'بانک مرکزی' },
];

const getBankLogo = (bankName: string) => {
  const bank = banks.find((b) => b.name === bankName);
  return bank ? `/bank-logos/${bank.img}` : null;
};

const BankCardList: React.FC<BankCardListProps> = ({ cards }) => {
  const [isDark, setIsDark] = useState(false);
  const { data: userData } = useGetUser();

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
      case "rejected":
        return "text-red-500";
      default:
        return "";
    }
  };

  const statusIcon = (status: Card["status"]) => {
    switch (status) {
      case "confirm":
        return (
          <span className="w-4 h-4">
            <IconAccept />
          </span>
        );
      case "pending":
        return (
          <span className="w-4 h-4">
            <IconInProgress />
          </span>
        );
      case "rejected":
        return (
          <span className="w-4 h-4">
            <IconDelete />
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div dir="rtl ">
      <h2 className=" mb-8 text-2xl font-bold text-black1">کارت‌های من</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {cards.map((card) => {
          const logoSrc = getBankLogo(card.bankName);
          return (
            <div
              dir="rtl"
              key={card.id}
              className="rounded-xl shadow p-4 flex flex-col justify-between relative"
              style={{
                backgroundImage:`url(${isDark ? BackgroundCardDark : BackgroundCard})`,
                backgroundSize: "cover",
                backgroundPosition:"center",
              }}
            >
              <div className="flex justify-start items-center space-x-2 relative z-10">
                  <div className="h-6 w-6 ml-1">
                  {logoSrc ? (
                    <img
                      src={logoSrc}
                      alt={card.bankName}
                      className="w-6 h-6 object-contain"
                    />
                  ) : (
                    <div className="h-6 w-6 rounded bg-gray-300"/>
                  )}
                </div>
                <div className="font-semibold  text-black1">{card.bankName}</div>
              
              </div>

              <div dir="rtl" className="relative z-10 flex justify-end flex-col pt-6">
                <p className="text-sm pb-1 text-black1">شماره کارت</p>
                <div className="text-lg mb-2 text-black1 font-medium">{card.number}</div>
              </div>

              <div className="relative z-10 flex justify-between flex-row-reverse pt-2 items-center">
                <div
                  className={`text-sm font-medium flex items-center gap-1 ${statusColor(
                    card.status
                  )}`}
                >
                  {statusIcon(card.status)}
                  {card.status === "confirm"
                    ? "تایید شده"
                    : card.status === "pending"
                    ? "درحال بررسی"
                    : "رد شده"}
                </div>

                <div className="flex flex-col">
                  <p className="text-black1">دارنده کارت</p>
                  <div className="text-sm text-black1 mb-2 font-medium"> {card.holder || userData?.user.name_display || "—"}</div>
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
