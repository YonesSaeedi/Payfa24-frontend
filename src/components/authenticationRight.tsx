import EmailIcon from "../assets/icons/authentication/EmailIcon";
import IconUserOctagon from "../assets/icons/authentication/IconUserOctagon";
import IconcardBank from "../assets/icons/authentication/IconcardBank";
import IconDownloadPhoto from "../assets/icons/authentication/IconDownloadPhoto";
import IdentyIcon from "../assets/icons/authentication/IdentyIcon";
import { toPersianDigits } from "./Deposit/CardToCardTransfer";
import IconPersonalCard from "../assets/icons/services/IconPersonalCard";

interface Props {
  step: number;
  onStart: () => void;
}


export default function AuthenticationRight({ step, onStart }: Props) {
  return (
    <div
      className={`w-full h-full flex flex-col gap-6 items-end  ${
        step === 0 ? "flex" : "hidden lg:flex"
      }`}
    >
      {/* سطح 1 */}
      <div className="lg:w-5/6 w-full border-solid border-blue2 rounded-lg border-[1px] md:flex flex-col p-6 dark:text-white justify-center sm:justify-end">
        <h1 className="text-right mb-5 text-blue2 font-medium lg:text-xl text-lg">سطح {toPersianDigits(1)} : احراز هویت پایه</h1>
        <div className="flex flex-row items-center justify-end">
          <span className="mr-2 text-black1">ثبت ایمیل</span>
          <span className="icon-wrapper w-7 h7 text-blue2">
            <EmailIcon />
          </span>
        </div>
        <div className="flex flex-row items-center justify-end">
          <span className="mr-2 text-black1">مشخصات فردی</span>
          <span className="icon-wrapper w-7 h7 text-blue2">
            <IconUserOctagon />
          </span>
        </div>
        <div className="flex flex-row items-center justify-end">
          <span className="mr-2 text-black1">کارت بانکی</span>
          <span className="icon-wrapper w-7 h7 text-blue2">
            <IconcardBank />
          </span>
        </div>
        <div dir="rtl">
          <p className="text-right mt-5">دسترسی ها :</p>
          <ul className="list-disc list-inside text-right text-gray15">
            <li>مشاهده قیمت‌ها</li>
            <li>خرید و فروش رمز ارزها</li>
          </ul>
        </div>
        <button
          className={`bg-blue2 flex items-center justify-center w-full mt-5 h-[48px] rounded-lg text-white2 font-bold ${ step === 0 ? "flex" : "hidden  "}`}
          onClick={onStart} 
        >
          احراز هویت
        </button>
      </div>

      {/* سطح 2 */}
      <div className="lg:w-5/6  text-gray15 w-full items-end mb-5 border-solid border-gray49 rounded-lg border-[1px] md:flex flex-col p-6 justify-center sm:justify-end">
        <h1 className="text-right lg:text-xl text-lg font-medium text-gray5">سطح {toPersianDigits(2)} : احراز هویت پیشرفته</h1>
        <div className="flex flex-row items-center justify-end mt-5">
          <span className="mr-2">ثبت مدرک شناسایی</span>
          <span className="icon-wrapper w-7 h-7">
            <IconPersonalCard />
          </span>
        </div>
        <div className="flex flex-row items-center justify-end">
          <span className="mr-2">تایید هویت</span>
          <span className="icon-wrapper w-7 h-7">
            <IdentyIcon />
          </span>
        </div>
        {/* <h3 className="mt-5 text-right">دسترسی ها </h3> */}
        <div dir="rtl">
        <p className="mt-5">دسترسی ها :</p>
        <ul className="list-disc list-inside text-right text-gray15" dir="rtl">
          <li className="text-right">5 میلیون تومان برداشت ریالی روزانه</li>
          <li className="text-right">5 میلیون تومان برداشت ارزی روزانه</li>
          <li className="text-right">دسترسی به ارز Utopia USD</li>
        </ul>
        
        </div>
      </div>
    </div>
  );
}















