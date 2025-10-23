import EmailIcon from "../../../../assets/icons/authentication/EmailIcon";
import IconcardBank from "../../../../assets/icons/authentication/IconcardBank";
import IconCardIdenty from "../../../../assets/icons/authentication/IconCardIdenty";
import IconIdentyBasic from "../../../../assets/icons/authentication/IconIdentyBasic";
import IconUserOctagon from "../../../../assets/icons/authentication/IconUserOctagon";
import IdentyIcon from "../../../../assets/icons/authentication/IdentyIcon";

interface Props {
  step: number;
  onStart: () => void;
}

export default function AuthenticationRightAdvance({ step, onStart }: Props) {

  return (
    <div className={`w-full h-full flex flex-col gap-6 items-end ${step === 0 ? "flex" : "hidden lg:flex "}`}>
      {/* سطح 1 ========================================================================================================================================================================== */}
      <div className="lg:w-[498px] w-full border-solid border-gray15 rounded-lg border-[1px] md:flex flex-col lg:p-6 px-4 py-5 dark:text-white justify-center sm:justify-end">
        <div className="flex flex-row-reverse justify-between mb-5 items-center">
          <h1 className="text-right text-blue2 font-medium">سطح 1 : احراز هویت پایه</h1>
          <div className="bg-green9 text-green2 lg:w-[115px] lg:h-[36px] w-[87px] h-[32px] flex gap-1 rounded-sm items-center justify-center">
            <span className="lg:text-sm text-xs font-medium">احزار شده</span>
            <span className="icon-wrapper w-6 h-6 text-green2"><IconIdentyBasic /></span>
          </div>
        </div>
        <div className="flex flex-row items-center justify-end">
          <span className="mr-2 text-black1">ثبت ایمیل</span>
          <span className="icon-wrapper w-7 h7 text-blue2"><EmailIcon /></span>
        </div>
        <div className="flex flex-row items-center justify-end">
          <span className="mr-2 text-black1">مشخصات فردی</span>
          <span className="icon-wrapper w-7 h7 text-blue2"><IconUserOctagon /></span>
        </div>
        <div className="flex flex-row items-center justify-end">
          <span className="mr-2 text-black1">کارت بانکی</span>
          <span className="icon-wrapper w-7 h7 text-blue2"><IconcardBank /></span>
        </div>
        <div dir="rtl">
          <p className="text-right mt-5">دسترسی ها :</p>
          <ul className="list-disc list-inside text-right text-gray5 lg:text-base text-sm">
            <li>مشاهده قیمت‌ها</li>
            <li>خرید و فروش رمز ارزها</li>
          </ul>
        </div>
      </div>
      {/* سطح 2 ========================================================================================================================================================================== */}
      <div className="lg:w-[498px] text-gray15 w-full items-end mb-5 border-solid border-blue2 rounded-lg border-[1px] md:flex flex-col p-6 justify-center sm:justify-end">
        <h1 className="text-right text-blue2 font-medium">سطح 2 : احراز هویت پیشرفته</h1>
        <div className="flex flex-row items-center justify-end mt-5">
          <span className="mr-2 text-black1">ثبت مدرک شناسایی</span>
          <span className="icon-wrapper w-7 h-7 text-blue2"><IconCardIdenty /></span>
        </div>
        <div className="flex flex-row items-center justify-end">
          <span className="mr-2 text-black1">تایید هویت</span>
          <span className="icon-wrapper w-7 h-7 text-blue2"><IdentyIcon /></span>
        </div>
        <div dir="rtl">
          <p className="mt-5 text-right text-black1"> دسترسی ها : </p>
          <ul className="flex flex-col gap-1 list-inside list-disc text-gray5 lg:text-base text-sm">
            <li className="text-right">10 میلیون تومان برداشت ریالی روزانه</li>
            <li className="text-right">10 میلیون تومان برداشت ارزی روزانه</li>
            <li className="text-right">دسترسی به ارز Utopia USD</li>
          </ul>
        </div>
        <button className="bg-blue2 w-full mt-5 h-[48px] rounded-lg text-white2 font-bold" onClick={onStart}>احراز هویت</button>
      </div>
    </div>
  );
}
