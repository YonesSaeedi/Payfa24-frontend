// import React, { useEffect, useState, ReactNode } from "react";

// import ReceivedIcon from "../../assets/icons/Home/WalletCardIcon/ReceivedIcon";
// import SendIcon from "../../assets/icons/Home/WalletCardIcon/SendIcon";
// import WalletAddIcon from "../../assets/icons/Home/WalletCardIcon/WalletAddIcon";
// import WalletMinesIcon from "../../assets/icons/Home/WalletCardIcon/WalletMinesIcon";
// import IconCards from "../../assets/icons/services/IconCards";
// import IconReceipt from "../../assets/icons/services/IconReceipt";
// import IconSecurity from "../../assets/icons/services/iconSecurity";
// import IconQuestionLabel from "../../assets/icons/services/IconQuestionLabel";
// import IconPieChart from "../../assets/icons/services/IconPieChart";
// import IconPersonalCard from "../../assets/icons/services/IconPersonalCard";
// import IconDocumentText from "../../assets/icons/services/IconDocumentText";
// import CategoryActiveIcon from "../../assets/icons/header/CategoryActiveIcon";
// import IconCloseButtun from "../../assets/icons/services/IconCloseButtun";
// import ChartIcon from "../../assets/icons/header/ChartIcon";


// interface ServiceItem {
//   label: string;
//   icon: ReactNode;
// }

// interface ServicesBoxProps {
//   onClose: () => void;
// }

// const ServicesBox: React.FC<ServicesBoxProps> = ({ onClose }) => {
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     setIsVisible(true);
//   }, []);

//   const handleClose = () => {
//     setIsVisible(false);
//     setTimeout(onClose, 300); 
//   };

//   const financeItems: ServiceItem[] = [
//     { label: "خرید", icon: <ReceivedIcon /> },
//     { label: "فروش", icon: <SendIcon /> },
//     { label: "واریز", icon: <WalletAddIcon /> },
//     { label: "برداشت", icon: <WalletMinesIcon /> },
//     { label: "کیف پول", icon: <IconPersonalCard /> },
//     { label: "کارت‌ها", icon: <IconCards /> },
//   ];

//   const marketItems: ServiceItem[] = [
//     { label:  "تاریخچه", icon: <IconReceipt /> },
//     { label:  "بازار", icon: <ChartIcon />  },
//     { label: "نمای بازار", icon:<IconSecurity /> },
//     { label: "پرتفوی", icon: <IconQuestionLabel /> },
//   ];

//   const supportItems: ServiceItem[] = [
//     { label: "احراز هویت", icon: <IconPieChart /> },
//     { label: "امنیت", icon: <IconPersonalCard /> },
//     { label: "تیکت" , icon: <IconDocumentText /> },
//     { label: "سوالات" , icon: <IconCards /> },
//   ];

//   const otherItems: ServiceItem[] = [
//     { label: "اعلانات", icon: <IconPersonalCard /> },
//     { label: "مقالات", icon: <IconPersonalCard /> },
//     { label: "دعوت دوستان" , icon: <IconPersonalCard /> },
//   ];


//   const renderSection = (title: string, items: ServiceItem[]) => (
//     <div dir="rtl" className=" mb-6 ">
 
//       <h3 dir="rtl" className="text-right text-gray-700 dark:text-gray-300 font-medium mb-4 mt-5">{title}</h3>
//       <div className="container-style grid grid-cols-4 gap-4  ">
//         {items.map((item, i) => (
//           <div
//             key={i}
//             className="flex flex-col items-center  justify-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition border border-gray21 bg-gray27 w-[90px] h-[72px]"
//           >
//             <span className="w-6 h-6 text-blue2">{item.icon}</span>
//             <span className="text-sm text-gray-700 dark:text-gray-200 text-center mt-2  whitespace-nowrap">{item.label}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );

//   return (
//     <div dir="rtl" className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
//       <div
//         className={`bg-white8  rounded-xl shadow-lg p-6 w-[500px] h-[760] transform transition-all duration-300 ${
//           isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
//         } relative`}
//       >
//     <div className="flex border-b border-b-gray12 pb-4">
//       <span className="w-6 h-6 icon-wrapper ml-1">
//         <CategoryActiveIcon/>
//       </span>
      
//       <h3 className="text-blue2">خدمات</h3>
//      </div>


//         <button
//           onClick={handleClose}
//           className="absolute top-5 left-4 w-7 h-7"
//         >
//          <IconCloseButtun/>
//         </button>

//         {renderSection("مالی و تراکنش", financeItems)}
//         {renderSection("بازار و اطلاعات", marketItems)}
//         {renderSection("پشتیبانی و حساب کاربری", supportItems)}
//         {renderSection("سایر", otherItems)}
//       </div>
//     </div>
//   );
// };

// export default ServicesBox;
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
import IconDocumentText from "../../assets/icons/services/IconDocumentText";
import CategoryActiveIcon from "../../assets/icons/header/CategoryActiveIcon";
import IconCloseButtun from "../../assets/icons/services/IconCloseButtun";
import ChartIcon from "../../assets/icons/header/ChartIcon";
import { ROUTES } from "../../routes/routes";  


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

  // 👉 هندل کلیک روی آیتم‌ها
  const handleItemClick = (label: string) => {
     if (label === "تاریخچه") {
    navigate(ROUTES.Transaction.CREATE); 
     }
  };

  const financeItems: ServiceItem[] = [
    { label: "خرید", icon: <ReceivedIcon /> },
    { label: "فروش", icon: <SendIcon /> },
    { label: "واریز", icon: <WalletAddIcon /> },
    { label: "برداشت", icon: <WalletMinesIcon /> },
    { label: "کیف پول", icon: <IconPersonalCard /> },
    { label: "کارت‌ها", icon: <IconCards /> },
  ];

  const marketItems: ServiceItem[] = [
    { label: "تاریخچه", icon: <IconReceipt /> },
    { label: "بازار", icon: <ChartIcon /> },
    { label: "نمای بازار", icon: <IconSecurity /> },
    { label: "پرتفوی", icon: <IconQuestionLabel /> },
  ];

  const supportItems: ServiceItem[] = [
    { label: "احراز هویت", icon: <IconPieChart /> },
    { label: "امنیت", icon: <IconPersonalCard /> },
    { label: "تیکت", icon: <IconDocumentText /> },
    { label: "سوالات", icon: <IconCards /> },
  ];

  const otherItems: ServiceItem[] = [
    { label: "اعلانات", icon: <IconPersonalCard /> },
    { label: "مقالات", icon: <IconPersonalCard /> },
    { label: "دعوت دوستان", icon: <IconPersonalCard /> },
  ];

  const renderSection = (title: string, items: ServiceItem[]) => (
    <div dir="rtl" className=" mb-6 ">
      <h3
        dir="rtl"
        className="text-right text-gray-700 dark:text-gray-300 font-medium mb-4 mt-5"
      >
        {title}
      </h3>
      <div className="container-style grid grid-cols-4 gap-4">
        {items.map((item, i) => (
          <div
            key={i}
            onClick={() => handleItemClick(item.label)} // کلیک روی آیتم
            className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition border border-gray21 bg-gray27 w-[90px] h-[72px]"
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
    >
      <div
        className={`bg-white8 rounded-xl shadow-lg p-6 w-[500px] h-[760] transform transition-all duration-300 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
        } relative`}
      >
        <div className="flex border-b border-b-gray12 pb-4">
          <span className="w-6 h-6 icon-wrapper ml-1">
            <CategoryActiveIcon />
          </span>
          <h3 className="text-blue2">خدمات</h3>
        </div>

        <button
          onClick={handleClose}
          className="absolute top-5 left-4 w-7 h-7"
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
