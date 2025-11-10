import React, { useEffect, useState } from "react";
import ValidationlightIcon from "./../../assets/images/Home/ValidationIcon/402384808_1bcd8fe0-5c1f-4e2b-9729-fddbb4cab579 2 (1).png";
import ValidationDarkIcon from "./../../assets/images/Home/ValidationIcon/402384808_1bcd8fe0-5c1f-4e2b-9729-fddbb4cab579 2.png";
import ArrowLeftIcon from "../../assets/icons/Home/CryptoTableIcon/ArrowLeftIcon";
import IdentyfyCardIcon from "../../assets/icons/Home/IdentyfyCardIcon/identyfyCardIcon";
import useGetKYCInfo from "../../hooks/useGetKYCInfo";
import { Link } from "react-router";
import { ROUTES } from "../../routes/routes";

interface IdentityCardProps {
  items: string[];
  accesses: string[];
}

const IdentityCard: React.FC<IdentityCardProps> = ({ accesses }) => {
  const { data: kycInfo, isLoading } = useGetKYCInfo()
  const [KYCStepItems, setKYCStepItems] = useState<string[]>(["ثبت ایمیل", "مشخصات فردی", 'کارت بانکی'])
  useEffect(() => {
    if (kycInfo?.level_kyc === null) setKYCStepItems(["ثبت ایمیل", "مشخصات فردی", 'کارت بانکی'])
    // else if (kycInfo?.level_kyc === "basic")
  }, [kycInfo])
  return (
    <div className="border rounded-xl p-6 flex flex-col lg:flex-row items-right lg:justify-between border-gray21 shadow ">
      <div className="hidden rounded-lg lg:flex items-center justify-center ">
        <img src={ValidationlightIcon} className="block dark:hidden" />
        <img src={ValidationDarkIcon} className="hidden dark:block" />
      </div>
      <div className="lg:w-1/2 flex  flex-col gap-2 text-right">
        <h2 className="text-xl font-semibold text-blue2 pb-4">
          {kycInfo?.level_kyc === null ? 'هنوز احراز هویت نشده‌اید' : kycInfo?.level_kyc === "basic" ? 'احراز هویت سطح پایه' : 'احراز هویت سطح پیشرفته'}
        </h2>
        <ul className="list-disc text-black1">
          {KYCStepItems.map((item, index) =>
            <li key={index} className="list-none">{item}<span className="w-[19px] h-[19px] icon-wrapper ml-1"><IdentyfyCardIcon /></span></li>
          )}
        </ul>
        <span className="mt-2 font-medium text-gray5">: دسترسی‌ ها </span>
        <ul dir="rtl" className="list-disc list-inside pr-4 text-black1">
          {accesses.map((a, index) => <li key={index}>{a}</li>)}
        </ul>
        {isLoading ?
          <div className=" skeleton-bg mt-4 bg-blue2 text-white2 rounded-lg lg:w-[198px] h-[40px] self-end flex items-center justify-center w-full disabled:opacity-50"></div>
          :
          <Link
            to={kycInfo?.level_kyc === null ? ROUTES.AUTHENTICATION_BASIC : kycInfo?.level_kyc === "basic" ? ROUTES.AUTHENTICATION_ADVANCED : '/'}
            className={`mt-4 bg-blue2 text-white2 rounded-lg lg:w-[198px] h-[40px] self-end items-center justify-center w-full disabled:opacity-50 ${kycInfo?.level_kyc === 'advanced' ? 'hidden' : 'flex'}`}
          >
            <span className="pr-2 flex w-8 h-8"><ArrowLeftIcon /></span>
            <span>{kycInfo?.level_kyc === null ? 'شروع احراز هویت' : kycInfo?.level_kyc === "basic" ? 'تکمیل احراز هویت' : 'احراز هویت کامل شده است'}</span>
          </Link>
        }
      </div>
    </div>
  );
};

export default IdentityCard;
