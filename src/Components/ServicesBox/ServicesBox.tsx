import React, { useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import ReceivedIcon from "../../assets/icons/Home/WalletCardIcon/ReceivedIcon";
import SendIcon from "../../assets/icons/Home/WalletCardIcon/SendIcon";
import WalletAddIcon from "../../assets/icons/Home/WalletCardIcon/WalletAddIcon";
import WalletMinesIcon from "../../assets/icons/Home/WalletCardIcon/WalletMinesIcon";
import IconCards from "../../assets/icons/services/IconCards";
import IconReceipt from "../../assets/icons/services/IconReceipt";
import IconSecurity from "../../assets/icons/services/iconSecurity";
import IconQuestionLabel from "../../assets/icons/services/IconQuestionLabel";
import IconPieChart from "../../assets/icons/services/IconPieChart";
import IconPersonalCard from "../../assets/icons/services/IconPersonalCard";
import IconCloseButtun from "../../assets/icons/services/IconCloseButtun";
import ChartIcon from "../../assets/icons/header/ChartIcon";
import { ROUTES } from "../../routes/routes";  
import IconWalletCard from "../../assets/icons/services/IconWalletCard";
import IconMarketView from "../../assets/icons/services/IconMarketView";
import IconTicket from "../../assets/icons/services/IconTicket";
import IconNotification from "../../assets/icons/services/IconNotification";
import IconUserPlus from "../../assets/icons/services/IconUserPlus";
import CategoryActiveIcon from "../../assets/icons/header/CategoryActiveIcon";

interface ServiceItem {
  label: string;
  icon: ReactNode;
}

interface ServicesBoxProps {
  onClose: () => void;
}

const ServicesBox: React.FC<ServicesBoxProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleItemClick = (label: string) => {
    if (label === "تاریخچه") {
      navigate(ROUTES.TRANSACTION.CREATE); 
    } else if (label === "سوالات") {
      navigate(ROUTES.FAQ.CREATE); 
    } else if (label === "کارت‌ها") {
      navigate(ROUTES.BANK_CARDS.CREATE); 
    } else if (label === "تیکت") {
      navigate(ROUTES.TICKET.ROOT);
    } else if (label === "اعلانات") {
      navigate(ROUTES.NOTIFICATIONS);
    } else if (label === "بازار") {
      navigate(ROUTES.MARKET);
    } else if (label === "کیف پول") {
      navigate(ROUTES.Wallet);
    } else if (label === "برداشت") {
      navigate(ROUTES.WITHDRAWAL.ROOT);
    } else if (label === "احراز هویت") {
      navigate(ROUTES.AuthenticationBasic);
    } else if (label === "خرید") {
      navigate(ROUTES.TRADE.BUY);
    } else if (label === "فروش") {
      navigate(ROUTES.TRADE.SELL);
    } else if (label === "واریز") {
      navigate(ROUTES.Deposit);
    } else if (label === "امنیت") {
      navigate(ROUTES.AuthenticationBasic);
    }
  };

  const financeItems: ServiceItem[] = [
    { label: "خرید", icon: <span className="w-[26px] h-[26px] icon-wrapper"><ReceivedIcon /></span> },
    { label: "فروش", icon: <span className="w-[26px] h-[26px] icon-wrapper"><SendIcon /></span> },
    { label: "واریز", icon: <span className="w-[26px] h-[26px] icon-wrapper"><WalletAddIcon /></span> },
    { label: "برداشت", icon: <WalletMinesIcon /> },
    { label: "کیف پول", icon: <IconWalletCard/> },
    { label: "کارت‌ها", icon: <IconCards /> },
  ];

  const marketItems: ServiceItem[] = [
    { label: "تاریخچه", icon: <IconReceipt /> },
    { label: "بازار", icon: <ChartIcon /> },
    { label: "نمای بازار", icon:<IconMarketView/>  },
    { label: "پرتفوی", icon: <IconPieChart/>},
  ];

  const supportItems: ServiceItem[] = [
    { label: "احراز هویت", icon: <IconPersonalCard/> },
    { label: "امنیت", icon: <IconSecurity/> },
    { label: "تیکت", icon: <IconTicket/> },
    { label: "سوالات", icon: <IconQuestionLabel/> },
  ];

  const otherItems: ServiceItem[] = [
    { label: "اعلانات", icon: <IconNotification/> },
    { label: "مقالات", icon: <IconPersonalCard /> },
    { label: "دعوت دوستان", icon: <IconUserPlus/> },
  ];

  const renderSection = (title: string, items: ServiceItem[]) => (
    <div dir="rtl" className=" mb-6 ">
      <h3
        dir="rtl"
        className="text-right text-black1  font-medium mb-4 mt-5"
      >
        {title}
      </h3>
      <div className="container-style grid grid-cols-4 gap-6">
        {items.map((item, i) => (
          <div
            key={i}
            onClick={() => handleItemClick(item.label)} 
            className="flex flex-col items-center justify-center px-11 h-[72px]  rounded-lg hover:border-blue2 d cursor-pointer transition border border-gray21 bg-gray33"
          >
            <span className="w-6 h-6 text-blue2">{item.icon}</span>
            <span className="text-sm text-gray-700 dark:text-gray-200 text-center mt-2 whitespace-nowrap">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      onClick={handleClose} // کلیک روی پس‌زمینه -> بستن مودال
    >
      <div
        className={`bg-white8 rounded-xl shadow-lg p-6 w-[500px] h-[700] transform transition-all duration-300 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
        } relative`}
        onClick={(e) => e.stopPropagation()} // جلوگیری از بسته شدن مودال با کلیک داخلش
      >
        <div className="flex border-b border-b-gray21 pb-4">
          <span className="w-6 h-6 icon-wrapper ml-1">
            <CategoryActiveIcon/>
          </span>
          <h3 className="text-blue2">خدمات</h3>
        </div>

        <button
          onClick={handleClose}
          className="absolute top-5 left-4 w-7 h-7 text-gray12"
        >
          <IconCloseButtun />
        </button>

        {renderSection("مالی و تراکنش", financeItems)}
        {renderSection("بازار و اطلاعات", marketItems)}
        {renderSection("پشتیبانی و حساب کاربری", supportItems)}
        {renderSection("سایر", otherItems)}
      </div>
    </div>
  );
};

export default ServicesBox;
