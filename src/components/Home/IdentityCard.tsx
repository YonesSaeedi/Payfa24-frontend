// import React from "react";
// import ValidationlightIcon from "./../../assets/images/Home/ValidationIcon/402384808_1bcd8fe0-5c1f-4e2b-9729-fddbb4cab579 2 (1).png";
// import ValidationDarkIcon from "./../../assets/images/Home/ValidationIcon/402384808_1bcd8fe0-5c1f-4e2b-9729-fddbb4cab579 2.png";
// import ArrowLeftIcon from "../../assets/icons/Home/CryptoTableIcon/ArrowLeftIcon";

// import { useNavigate } from "react-router";
// import IdentyfyCardIcon from "../../assets/icons/Home/IdentyfyCardIcon/identyfyCardIcon";
// import { apiRequest } from "../../utils/apiClient";
// import { useQuery } from "@tanstack/react-query";

interface IdentityCardProps {
  title: string;
  items: string[];
  accesses: string[];
  onClick: () => void;
}

// const IdentityCard: React.FC<IdentityCardProps> = ({
//   title,
//   items,
//   accesses,
// }) => {
//   const navigate = useNavigate();

  
//   const { data: kycInfo, isLoading } = useQuery({
//     queryKey: ["kyc-info"],
//     queryFn: () =>
//       apiRequest<{ kyc: { basic?: { cardbank?: any } } }>({
//         url: "/kyc/get-info",
//       }),
//     staleTime: 1000 * 60,
//     retry: 1,
//   });

//   const handleKycNavigation = () => {
//     if (kycInfo?.kyc?.basic?.cardbank) {
//       navigate("/kyc-advanced");
//     } else {
//       navigate("/kyc-basic");
//     }
//   };
//   return (
//     <div className="border rounded-xl p-6 flex flex-col lg:flex-row items-right lg:justify-between border-gray21 shadow ">
//       <div className="hidden rounded-lg lg:flex items-center justify-center ">
//         <img src={ValidationlightIcon} className="block dark:hidden" />

//         <img src={ValidationDarkIcon} className="hidden dark:block" />
//       </div>

//       <div className="lg:w-1/2 flex  flex-col gap-2 text-right">
//         <h2 className="text-xl font-semibold text-blue2 pb-4">{title}</h2>
//         <ul className="list-disc text-black1">
//           {items.map((item, index) => (
//             <li key={index} className="list-none">
//               {item}
//               <span className="w-[19px] h-[19px] icon-wrapper ml-1">
//                 <IdentyfyCardIcon />
//               </span>
//             </li>
//           ))}
//         </ul>

//         <span className="mt-2 font-medium text-gray5">: دسترسی‌ ها </span>
//         <ul dir="rtl" className="list-disc list-inside pr-4 text-black1">
//           {accesses.map((a, index) => (
//             <li key={index}>{a}</li>
//           ))}
//         </ul>

//         {isLoading ? (
//           <div className=" skeleton-bg mt-4 bg-blue2 text-white2 rounded-lg lg:w-[198px] h-[40px] self-end flex items-center justify-center w-full disabled:opacity-50"></div>
//         ) : (
//           <button
//             onClick={handleKycNavigation}
//             disabled={isLoading}
//             className="mt-4 bg-blue2 text-white2 rounded-lg lg:w-[198px] h-[40px] self-end flex items-center justify-center w-full disabled:opacity-50"
//           >
//             <span className="pr-2 flex w-8 h-8">
//               <ArrowLeftIcon />
//             </span>
//             <span>احراز هویت</span>
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default IdentityCard;

import React from "react";
import ValidationlightIcon from "./../../assets/images/Home/ValidationIcon/402384808_1bcd8fe0-5c1f-4e2b-9729-fddbb4cab579 2 (1).png";
import ValidationDarkIcon from "./../../assets/images/Home/ValidationIcon/402384808_1bcd8fe0-5c1f-4e2b-9729-fddbb4cab579 2.png";
import ArrowLeftIcon from "../../assets/icons/Home/CryptoTableIcon/ArrowLeftIcon";
import { useNavigate } from "react-router";
import IdentyfyCardIcon from "../../assets/icons/Home/IdentyfyCardIcon/identyfyCardIcon";
import { apiRequest } from "../../utils/apiClient";
import { useQuery } from "@tanstack/react-query";



const IdentityCard: React.FC<IdentityCardProps> = () => {
  const navigate = useNavigate();

  const { data: kycInfo, isLoading } = useQuery({
    queryKey: ["kyc-info"],
    queryFn: () =>
      apiRequest<{
        user: { level_kyc: "null" | "basic" | "advanced" | null };
        kyc?: { basic?: { cardbank?: any } };
      }>({
        url: "/kyc/get-info",
      }),
    staleTime: 1000 * 60,
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="skeleton-bg w-full h-[200px] rounded-xl animate-pulse"></div>
    );
  }

  const level = kycInfo?.user?.level_kyc;

  // تعیین محتوا بر اساس level_kyc
  let title = "";
  let items: string[] = [];
  let accesses: string[] = [];
  let showButton = true;
  let buttonHandler = () => {};
  let buttonText = "احراز هویت";

  if (!level || level === "null") {
    title = "احراز هویت پایه";
    items = ["ایمیل", "مشخصات فردی", "کارت بانکی"];
    accesses = ["مشاهده قیمت‌ها", "خرید و فروش رمز ارزها"];
    buttonHandler = () => navigate("/kyc-basic");
    buttonText = "شروع احراز هویت";
  } else if (level === "basic") {
    title = "احراز هویت سطح پیشرفته";
    items = ["ثبت مدرک شناسایی", "تایید هویت"];
    accesses = ["واریز با کارت به کارت", "دسترسی به ارزهای دلاری", "برداشت رمزارز"];
    buttonHandler = () => navigate("/kyc-advanced");
    buttonText = "تکمیل احراز هویت";
  } else if (level === "advanced") {
    title = "احراز هویت کامل انجام شد";
    items = ["ثبت مدرک شناسایی", "تایید هویت"];
    accesses = ["واریز با کارت به کارت", "دسترسی به ارزهای دلاری", "برداشت رمزارز"];
    showButton = false; 
  }

  return (
    <div className="border rounded-xl p-6 flex flex-col lg:flex-row items-right lg:justify-between border-gray21 shadow ">
      <div className="hidden rounded-lg lg:flex items-center justify-center ">
        <img src={ValidationlightIcon} className="block dark:hidden" />
        <img src={ValidationDarkIcon} className="hidden dark:block" />
      </div>

      <div className="lg:w-1/2 flex flex-col gap-2 text-right">
        <h2 className="text-xl font-semibold text-blue2 pb-4">{title}</h2>

        <ul dir="rtl" className="list-disc text-black1">
          {items.map((item, index) => (
            <li key={index} className="list-none flex items-center">
              <span className="w-[19px] h-[19px] icon-wrapper ml-1">
                <IdentyfyCardIcon />
              </span>
              {item}
            </li>
          ))}
        </ul>

        <span className="mt-2 font-medium text-gray5">: دسترسی‌ ها </span>
        <ul dir="rtl" className="list-disc list-inside pr-4 text-black1">
          {accesses.map((a, index) => (
            <li key={index}>{a}</li>
          ))}
        </ul>

        {showButton && (
          <button
            onClick={buttonHandler}
            className="mt-4 bg-blue2 text-white2 rounded-lg lg:w-[198px] h-[40px] self-end flex items-center justify-center w-full"
          >
            <span className="pr-2 flex w-8 h-8">
              <ArrowLeftIcon />
            </span>
            <span>{buttonText}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default IdentityCard;
