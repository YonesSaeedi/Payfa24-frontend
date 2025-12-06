import IconCardIdenty from "../../../../assets/icons/authentication/IconCardIdenty";
import IconCheckmark from "../../../../assets/icons/authentication/IconCheckmark";
import IconIdentyBasic from "../../../../assets/icons/authentication/IconIdentyBasic";
import IdentyIcon from "../../../../assets/icons/authentication/IdentyIcon";
import { toPersianDigits } from "../../../Deposit/CardToCardTransfer";

interface Props {
  step: number;
  onStart: () => void;
  isAdvanced: boolean;
}

export default function AuthenticationRightAdvance({ step, onStart, isAdvanced }: Props) {
  return (
    <div className={`w-full h-full flex flex-col gap-6 items-end ${step === 0 ? "flex" : "hidden lg:flex"}`}>
   
      <div className="lg:w-5/6 w-full border-gray49 rounded-lg border md:flex flex-col lg:p-6 px-4 py-5 justify-center sm:justify-end">
        <div className="flex flex-row-reverse justify-between mb-5 items-center">
          <h1 className="text-right text-blue2 font-medium lg:text-xl text-sm">سطح {toPersianDigits(1)} : احراز هویت پایه</h1>
          <div className="bg-green10 text-green2 lg:w-[115px] lg:h-[36px] w-[87px] h-[32px] flex gap-1 rounded-sm items-center justify-center">
            <span className="lg:text-sm text-xs font-medium">احراز شده</span>
            <span className="icon-wrapper w-6 h-6 text-green2">
              <IconIdentyBasic />
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center justify-end">
            <span className="mr-2 text-black1 text-base">ثبت ایمیل</span>
            <span className="icon-wrapper lg:w-7 lg:h-7 w-6 h-6 text-blue2">
              <IconCheckmark />
            </span>
          </div>
          <div className="flex flex-row items-center justify-end">
            <span className="mr-2 text-black1 text-base">مشخصات فردی</span>
            <span className="icon-wrapper lg:w-7 lg:h-7 w-6 h-6 text-blue2">
              <IconCheckmark />
            </span>
          </div>
          <div className="flex flex-row items-center justify-end">
            <span className="mr-2 text-black1 text-base">کارت بانکی</span>
            <span className="icon-wrapper lg:w-7 lg:h-7 w-6 h-6 text-blue2">
              <IconCheckmark />
            </span>
          </div>
        </div>
        <div dir="rtl">
          <p className="text-right mt-5 lg:mb-[6px] mb-1 text-black1">دسترسی ها :</p>
          <ul className="list-disc list-inside text-right text-gray5 lg:text-base text-sm font-normal">
            <li>مشاهده قیمت‌ها</li>
            <li>خرید و فروش رمز ارزها</li>
          </ul>
        </div>
      </div>

    
      <div className={`lg:w-5/6 w-full rounded-lg border md:flex flex-col p-6 justify-center sm:justify-end ${isAdvanced ? "border-gray49" : "border-blue2 border-[1px]"}`}>
        <div className="flex flex-row-reverse justify-between items-center mb-5">
          <h1 className="text-right text-blue2 font-medium lg:text-xl text-sm">سطح {toPersianDigits(2)} : احراز هویت پیشرفته</h1>

         
          {isAdvanced && (
            <div className="bg-green10 text-green2 lg:w-[115px] lg:h-[36px] w-[87px] h-[32px] flex gap-1 rounded-sm items-center justify-center">
              <span className="lg:text-sm text-xs font-medium">احراز شده</span>
              <span className="icon-wrapper w-6 h-6 text-green2">
                <IconIdentyBasic />
              </span>
            </div>
          )}
        </div>

        {/* فقط وقتی هنوز احراز نکرده → محتوا + دکمه رو نشون بده */}

        <div className="flex flex-col gap-3">
          <div className="flex flex-row items-center justify-end">
            <span className="mr-2 text-black1">ثبت مدرک شناسایی</span>
            <span className="icon-wrapper w-7 h-7 text-blue2">
              <IconCardIdenty />
            </span>
          </div>
          <div className="flex flex-row items-center justify-end">
            <span className="mr-2 text-black1">تایید هویت</span>
            <span className="icon-wrapper w-7 h-7 text-blue2">
              <IdentyIcon />
            </span>
          </div>
        </div>

        <div dir="rtl" className="mt-5">
          <p className="text-right text-black1 lg:mb-[6px] mb-1">دسترسی ها :</p>
          <ul className="list-disc list-inside text-right text-gray5 font-normal lg:text-base text-sm">
            <li>واریز با کارت به کارت</li>
            <li>دسترسی به ارز های دلاری</li>
            <li>برداشت رمز ارز</li>
          </ul>
        </div>
        {!isAdvanced && (
          <button onClick={onStart} className="bg-blue2 w-full mt-6 h-12 rounded-lg text-white2 font-bold hover:bg-blue1 transition-all">
            احراز هویت
          </button>
          
        )}
      </div>
    </div>
  );
}
