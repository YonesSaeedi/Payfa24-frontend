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
  route?: string;
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

const handleItemClick = (item: ServiceItem) => {
  if (item.route) navigate(item.route);
};


const financeItems: ServiceItem[] = [
  { label: "خرید", icon: <ReceivedIcon />, route: ROUTES.TRADE.BUY },
  { label: "فروش", icon: <SendIcon />, route: ROUTES.TRADE.SELL },
  { label: "واریز", icon: <WalletAddIcon />, route: ROUTES.DEPOSIT},
  { label: "برداشت", icon: <WalletMinesIcon />, route: ROUTES.WITHDRAWAL},
  { label: "کیف پول", icon: <IconWalletCard />, route: ROUTES.WALLET },
  { label: "کارت‌ها", icon: <IconCards />, route: ROUTES.BANK_CARDS },
];

const marketItems: ServiceItem[] = [
  { label: "بازار", icon: <ChartIcon />, route: ROUTES.MARKET },
  { label: "نمای بازار", icon: <IconMarketView />,route:ROUTES.MARKET_VIEW },
  { label: "پرتفوی", icon: <IconPieChart /> },
];

const historyItems: ServiceItem[] = [
  { label: "خریدو فروش", icon: <IconReceipt />, route: ROUTES.TRANSACTION.ORDER_HISTORY },
  { label: "تومانی", icon: <IconReceipt />, route: ROUTES.TRANSACTION.TOMAN_HISTORY },
  { label: "رمزارز", icon: <IconReceipt />, route: ROUTES.TRANSACTION.CRYPTO_HISTORY },
];

const supportItems: ServiceItem[] = [
  { label: "احراز هویت", icon: <IconPersonalCard />, route: ROUTES.AUTHENTICATION_BASIC},
  { label: "امنیت", icon: <IconSecurity />, route: ROUTES.AUTHENTICATION_BASIC },
  { label: "تیکت", icon: <IconTicket />, route: ROUTES.TICKET.ROOT },
  { label: "سوالات", icon: <IconQuestionLabel />, route: ROUTES.FAQ},
];

const otherItems: ServiceItem[] = [
  { label: "اعلانات", icon: <IconNotification />, route: ROUTES.NOTIFICATIONS },
  { label: "مقالات", icon: <IconPersonalCard /> },
  { label: "دعوت دوستان", icon: <IconUserPlus />, route: ROUTES.ADD_FRIEND},
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
            onClick={() => handleItemClick(item)}
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
        className={`bg-white8 rounded-xl shadow-lg p-6 w-[500px] h-[700] transform transition-all duration-300 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
          } relative`}
        onClick={(e) => e.stopPropagation()} // جلوگیری از بسته شدن مودال با کلیک داخلش
      >
        <div className="flex border-b border-b-gray21 pb-4">
          <span className="w-6 h-6 icon-wrapper ml-1">
            <CategoryActiveIcon />
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
        {renderSection(" تاریخچه", historyItems)}
        {renderSection("پشتیبانی و حساب کاربری", supportItems)}
        {renderSection("سایر", otherItems)}
      </div>
    </div>
  );
};

export default ServicesBox;
