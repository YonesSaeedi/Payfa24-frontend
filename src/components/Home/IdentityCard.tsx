import React from "react";
import ValidationlightIcon from "./../../assets/images/Home/ValidationIcon/402384808_1bcd8fe0-5c1f-4e2b-9729-fddbb4cab579 2 (1).png";
import ValidationDarkIcon from "./../../assets/images/Home/ValidationIcon/402384808_1bcd8fe0-5c1f-4e2b-9729-fddbb4cab579 2.png";
import ArrowLeftIcon from "../../assets/icons/Home/CryptoTableIcon/ArrowLeftIcon";
import IdentyfyCardIcon from "../../assets/icons/Home/IdentyfyCardIcon/identyfyCardIcon";
import useGetKYCInfo from "../../hooks/useGetKYCInfo";
import IconIdentyBasic from "../../assets/icons/authentication/IconIdentyBasic";
import { formatPersianNumber } from "../../utils/formatPersianNumber";
interface IdentityCardProps {
 dailyWithdrawalLimit?: number;
  dailyWithdrawalUsage?: number;
}


const IdentityCard: React.FC<IdentityCardProps> = ({dailyWithdrawalLimit = 0, dailyWithdrawalUsage = 0}) => {

  const { data: kycInfo, isLoading } = useGetKYCInfo();
  if (isLoading) {
    return <div className="skeleton-bg w-full h-full rounded-xl animate-pulse "></div>;
  }

  const level = kycInfo?.level_kyc;

  let title = "";
  let items: string[] = [];
  let accesses: string[] = [];
  let showButton = true;
  let buttonLink = "/kyc-basic";
  let buttonText = "احراز هویت";

  if (!level) {
    title = "احراز هویت پایه";
    items = ["ایمیل", "مشخصات فردی", "کارت بانکی"];
    accesses = ["مشاهده قیمت‌ها", "خرید و فروش رمز ارزها"];
    buttonLink = "/kyc-basic";
    buttonText = "شروع احراز هویت";
  } else if (level === "basic") {
    title = "احراز هویت سطح پیشرفته";
    items = ["ثبت مدرک شناسایی", "تایید هویت"];
    accesses = ["واریز با کارت به کارت", "دسترسی به ارزهای دلاری", "برداشت رمزارز"];
    buttonLink = "/kyc-advanced";
    buttonText = "تکمیل احراز هویت";
  } else if (level === "advanced") {
    title = "احراز هویت کامل انجام شد";
    items = ["ثبت مدرک شناسایی", "تایید هویت"];
    accesses = ["واریز با کارت به کارت", "دسترسی به ارزهای دلاری", "برداشت رمزارز"];
    showButton = false;
  }

  return (
      <div className="border rounded-xl p-6 shadow border-gray21 min-h-[371px] flex flex-col gap-0 lg:gap-6">
      <div className=" flex flex-col lg:flex-row items-right lg:justify-between  h-full lg:items-start">
      <div className="hidden rounded-lg w-[300px] lg:flex flex-col items-left justify-start gap-4">
  {/* بخش advanced */}
  {level === "advanced" && (
    <div className="bg-green10 text-green2 lg:w-[115px] lg:h-[36px] w-[87px] h-[32px] flex gap-1 rounded-sm items-center justify-center">
      <span className="lg:text-sm text-xs font-medium">احراز شده</span>
      <span className="icon-wrapper w-6 h-6 text-green2">
        <IconIdentyBasic />
      </span>
    </div>
  )}

  {/* دکمه برای basic */}
{level === "basic" && showButton && (
  <div
    onClick={() => {
      // اینجا می‌توانید لینک یا عملکرد دلخواه را اضافه کنید
      window.location.href = buttonLink;
    }}
    className="flex items-center cursor-pointer text-blue2 font-bold text-base hover:underline"
  >
    <span className="mr-2 flex w-5 h-5">
      <ArrowLeftIcon />
    </span>
    <span>{buttonText}</span>
  </div>
)}


  {/* تصاویر Validation درست زیر دکمه */}
  <img src={ValidationlightIcon} className="block dark:hidden" />
  <img src={ValidationDarkIcon} className="hidden dark:block" />
      </div>
      
      <div className=" flex flex-col gap-2 text-right  min-w-0">
        <h2 className="text-xl font-semibold text-blue2 pb-4 overflow-hidden whitespace-nowrap" style={{textOverflow: 'ellipsis', direction: 'rtl',unicodeBidi: 'plaintext',}}title={title}>
            {title}
        </h2>
        <ul dir="rtl" className="list-disc text-black1">
          {items.map((item, index) => (
            <li key={index} className="list-none flex items-center whitespace-nowrap text-[10px] sm:text-xs md:text-sm lg:text-base">
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
            <li key={index} className="whitespace-nowrap text-[10px] sm:text-xs md:text-sm lg:text-base">
              {a}
            </li>
          ))}
        </ul>

      </div>
      </div>
      <div dir="rtl" className="w-full flex flex-col lg:flex-row gap-5  lg:mt-0 mt-8">


  {/* آیتم اول */}
<div className="flex justify-between items-center gap-2 p-3 border border-gray21 rounded-lg shadow-sm w-full bg-gray27">
  <span className="flex items-center gap-1 text-sm text-black1">
    <span className="w-[16px] h-[16px] flex items-center justify-center">
      {dailyWithdrawalLimit === 0
        ? <span className="w-[6px] h-[6px] bg-black1 rounded-sm block" />
        : <IdentyfyCardIcon />
      }
    </span>
    سقف برداشت روزانه:
  </span>

  <span className="whitespace-nowrap text-black1 text-sm">
    {formatPersianNumber(dailyWithdrawalLimit.toLocaleString()) } تومان
  </span>
</div>


  {/* آیتم دوم */}
<div className="flex justify-between items-center gap-2 p-3 border border-gray21 rounded-lg shadow-sm w-full bg-gray27">
  <span className="flex items-center gap-1 text-sm text-black1">
    <span className="w-[14px] h-[14px] flex items-center justify-center">
      {dailyWithdrawalUsage === 0 ? (
        <span className="w-[6px] h-[6px] bg-black1 rounded-sm block" aria-hidden />
      ) : (
        <IdentyfyCardIcon />
      )}
    </span>
    مقدار روزانه برداشت شده:
  </span>

    <span className="whitespace-nowrap text-black1 text-sm">
    {formatPersianNumber(dailyWithdrawalUsage.toLocaleString())} تومان
     </span>
     </div>
     </div>

   
    </div>
  );
};

export default IdentityCard;
