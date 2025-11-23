
import EmailIcon from "../assets/icons/authentication/EmailIcon";
import IconUserOctagon from "../assets/icons/authentication/IconUserOctagon";
import IconcardBank from "../assets/icons/authentication/IconcardBank";
import IdentyIcon from "../assets/icons/authentication/IdentyIcon";
import { toPersianDigits } from "./Deposit/CardToCardTransfer";
import IconPersonalCard from "../assets/icons/services/IconPersonalCard";

interface Props {
  step: number;
  onStart: () => void;
  levelKyc: string | null;
  started: boolean;
}

export default function AuthenticationRight({ onStart, step }: Props) {
  // const isCompleted = levelKyc === "basic" || levelKyc === "advanced";

  return (
    <div className={`w-full h-full flex flex-col gap-6 items-end ${step === 0  ? "flex" : "hidden lg:flex"}`}>
      {/* سطح 1 */}
      <div className="lg:w-5/6 w-full  py-5 lg:py-6 border-solid border-blue2 rounded-lg border flex flex-col ">
        <h1 className="text-right mb-5 lg:pe-6 pe-5 text-blue2 font-medium lg:text-xl text-lg">سطح {toPersianDigits(1)} : احراز هویت پایه</h1>

        <div className="flex mb-2 lg:pe-6 pe-5 flex-row items-center justify-end lg:gap-2 gap-[6px]">
          <span className="mr-2 text-black1">ثبت ایمیل</span>
          <span className="icon-wrapper w-7 h-7 text-blue2">
            <EmailIcon />
          </span>
        </div>
        <div className="flex mb-2 lg:pe-6 pe-5 flex-row items-center justify-end lg:gap-2 gap-[6px]">
          <span className="mr-2 text-black1">مشخصات فردی</span>
          <span className="icon-wrapper w-7 h-7 text-blue2">
            <IconUserOctagon />
          </span>
        </div>
        <div className="flex lg:pe-6 pe-5 flex-row items-center justify-end lg:gap-2 gap-[6px]">
          <span className="mr-2 text-black1">کارت بانکی</span>
          <span className="icon-wrapper w-7 h-7 text-blue2">
            <IconcardBank />
          </span>
        </div>
        <div dir="rtl">
          <p className="text-right lg:mt-5 mt-4 lg:pr-6 pr-5 lg:mb-[6px] mb-1 lg:text-lg text-base font-medium">دسترسی ها :</p>

          <ul className="list-disc list-inside text-right text-gray15 lg:pr-6 pr-5">
            <li>مشاهده قیمت‌ها</li>
            <li>خرید و فروش رمز ارزها</li>
          </ul>
        </div>

        <div className="lg:mx-6 mx-2">
      
          <button
            className={`bg-blue2 flex items-center justify-center w-full mt-5 h-[48px] rounded-lg text-white2 font-bold lg:text-lg text-base ${step === 0 ? "flex" : "hidden"}`}
            onClick={onStart}
          >
            احراز هویت
          </button>
        </div>
      </div>

      {/* سطح 2 */}
      <div className="lg:w-5/6 w-full max-w-full flex-shrink-0 text-gray15 items-end mb-5 border-solid border-gray49 rounded-lg border-[1px] md:flex flex-col p-6 justify-center sm:justify-end transition-all duration-300 flex">
        <h1 className="text-right lg:text-xl text-lg font-medium text-gray5"> سطح {toPersianDigits(2)} : احراز هویت پیشرفته </h1>
        <div className="flex flex-row items-center justify-end mt-5 mb-2 lg:gap-2 gap-[6px]">
          <span className="mr-2 lg:text-base text-sm">ثبت مدرک شناسایی</span>
          <span className="icon-wrapper w-7 h-7">
            <IconPersonalCard />
          </span>
        </div>
        <div className="flex flex-row items-center justify-end lg:gap-2 gap-[6px]">
          <span className="mr-2 lg:text-base text-sm">تایید هویت</span>
          <span className="icon-wrapper w-7 h-7">
            <IdentyIcon />
          </span>
        </div>
        <div dir="rtl">
          <p className="lg:mt-5 mt-4 lg:mb-[6px] mb-1 lg:text-lg text-base font-medium">دسترسی ها :</p>
          <ul className="list-disc list-inside text-right text-gray15 lg:text-base text-sm">
            <li className="text-right">واریز با کارت به کارت</li>
            <li className="text-right">دسترسی به ارز های دلاری </li>
            <li className="text-right">برداشت رمز ارز </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
