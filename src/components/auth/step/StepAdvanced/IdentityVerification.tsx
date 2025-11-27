import { useEffect, useRef, useState } from "react";
import UploadImage from "../../../../assets/icons/authentication/UploadImage";
import IconAlert from "../../../../assets/icons/Login/IconAlert";
import StepperComponent from "../Stepper";
import IconCloseChervon from "../../../../assets/icons/authentication/IconCloseChervon";
import IconOpenChervon from "../../../../assets/icons/authentication/IconOpenChervon";
import IconClose from "../../../../assets/icons/Login/IconClose";
import previewURLImage2 from "../../../../assets/previewURLImage (2).png";
import { toast } from "react-toastify";
import { toPersianDigits } from "../../../Deposit/CardToCardTransfer";
import ArrowLeftIcon from "../../../../assets/icons/Home/CryptoTableIcon/ArrowLeftIcon";

type IdentityVerificationProps = {
  handleUploadImageFiles: (key: "idCardImageFile" | "identityVerifyImageFile", imageFile: File | undefined) => void;
  uploadProgress: number | null;
  handleSubmit: () => Promise<void>;
};

export default function IdentityVerification({ handleSubmit, uploadProgress, handleUploadImageFiles }: IdentityVerificationProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isOpenAccordion, setIsOpenAccordion] = useState(false);
  const [isOpenTextModal, setIsOpenTextModal] = useState(false);
  // handles file upload/change =============================================================================================================================================
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = e.target.files?.[0];
    if (!imageFile) return;
    if (!imageFile.type.startsWith("image/")) {
      toast.error("باید یک فایل تصویری انتخاب کنید.");
      return;
    }
    if (imageFile.size > 20 * 1024 * 1024) {
      toast.error("حجم فایل نباید بیشتر از 20 مگابایت باشد.");
      return;
    }
    const imageURL = URL.createObjectURL(imageFile);
    setPreviewImage(imageURL);
    handleUploadImageFiles("identityVerifyImageFile", imageFile);
  };
  // prevent refresh and submits data =========================================================================================================================================
  const handleProceed = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    handleSubmit();
  };
  // cleanup object URL when previewImage changes or component unmounts; preventing memory leak ===============================================================================
  useEffect(() => {
    return () => {
      if (previewImage) URL.revokeObjectURL(previewImage);
    };
  }, [previewImage]);

  return (
    <div className="w-full">
      <form className="lg:bg-gray9 lg:rounded-2xl lg:px-8 w-full">
        <div className="flex flex-col text-right">
          <div className="relative flex items-center w-full justify-center sm:hidden mb-7 mt-5 text-black0">
            <span className="text-base font-medium text-center">احراز هویت پیشرفته</span>
            <span className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 rotate-180 ">
              <ArrowLeftIcon />
            </span>
          </div>
          <StepperComponent currentStep={1} isAdvance={true} />
          <p className="lg:text-xl text-sm font-medium text-black1  lg:flex self-end mb-5">لطفا مدرک شناسایی خود را بارگذاری کنید</p>
          <div className="bg-orange4 flex flex-col pr-6 pl-2 py-4 gap-2 lg:mb-6 mb-4 rounded-lg">
            <div className="flex text-orange1 gap-1 self-end font-medium">
              <span className="lg:text-base text-xs">توجه داشته باشید</span>
              <span className="icon-wrapper lg:w-6 lg:h-6 w-4 h-4 text-orange1">
                <IconAlert />
              </span>
            </div>
            <ul className="list-disc list-inside text-right text-black1 lg:text-base text-xs" dir="rtl">
              <li>تصاویر و مدارک ارائه‌شده واضح، خوانا و کامل باشند و در صورت تار بودن یا ناقص بودن، مورد تأیید قرار نگیرند.</li>
              <li>تعهدنامه بدون امضا و تاریخ فاقد اعتبار است.</li>
              <li>متن این تعهدنامه عیناً مطابق نمونه نوشته شود و هرگونه تغییر، حذف یا خلاصه‌نویسی موجب رد آن می‌شود.</li>
              <li>نام صرافی [پی فا 24] به صورت صحیح ذکر شود و در صورت وجود غلط املایی، تعهدنامه رد خواهد شد.</li>
            </ul>
          </div>
          <div
            className={`relative w-full  mx-auto my-5 p-4 border-2 border-dashed border-gray31 rounded-lg text-center
              ${uploadProgress === null ? "cursor-pointer" : "cursor-default"}`}
            onClick={uploadProgress === null ? () => fileInputRef.current?.click() : undefined}
          >
            <div className="flex flex-col items-center justify-center h-48">
              {!previewImage ? (
                <>
                  <span className="icon-wrapper lg:w-14 lg:h-14 w-8 h-8 text-gray15 mb-2">
                    <UploadImage />
                  </span>
                  <p className="text-gray15 lg:text-lg text-sm mt-1 font-normal">بارگذاری تصویر مدرک شناسایی</p>
                </>
              ) : (
                <img src={previewImage} alt="بارگذاری تصویر مدرک شناسایی" className="max-h-48 max-w-full rounded-lg object-contain" />
              )}
            </div>
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*" disabled={uploadProgress !== null} />
          </div>
          <button
            type="button"
            className="text-blue2 lg:text-lg text-base font-bold rounded-lg border border-blue2 lg:h-[56px] h-[40px]"
            onClick={() => setIsOpenTextModal(!isOpenTextModal)}
          >
            متن تعهد نامه
          </button>
          {/* نمایش تعهد نامه - آکوردئون */}
          <div className="mt-4 mb-14 border border-gray12 rounded-lg">
            <div className="flex justify-between items-center flex-row-reverse p-4 cursor-pointer" onClick={() => setIsOpenAccordion(!isOpenAccordion)}>
              <h2 className="text-base font-medium text-black1">نمونه تصویر تعهد نامه</h2>
              <span className="icon-wrapper w-5 h-5 text-gray15">{isOpenAccordion ? <IconCloseChervon /> : <IconOpenChervon />}</span>
            </div>
            {isOpenAccordion && (
              <div>
                <img src={previewURLImage2} alt="تعهد نامه" className="w-full h-64 object-fill rounded-lg mb-2 px-4" />
              </div>
            )}
          </div>
        </div>
        <button
          onClick={handleProceed}
          type="submit"
          disabled={uploadProgress !== null || !previewImage} 
          className={`relative mt-1 text-lg font-bold mb-6 w-full lg:h-[56px] h-10 rounded-lg border border-transparent transition duration-300 ease-in overflow-hidden
    ${
      uploadProgress !== null
        ? "bg-gray2 cursor-not-allowed"
        : previewImage
        ? "hover:bg-transparent hover:border-blue1 hover:text-blue1 text-white2 bg-blue1"
        : "bg-gray2 cursor-not-allowed"
    }`}
        >
          {uploadProgress !== null && <span className="absolute left-0 top-0 bottom-0 bg-green-500 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />}
          <span className="relative z-10">{uploadProgress !== null ? `در حال ارسال ${uploadProgress}%` : "ثبت و ارسال"}</span>
        </button>
      </form>
      {isOpenTextModal && (
        <>
          {/* Backdrop */}
          <div onClick={() => setIsOpenTextModal(false)} className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center lg:items-center lg:justify-center">
            {/* Modal Container */}
            <div
              className={`
          w-full lg:w-[448px] lg:max-w-md bg-white8 
          lg:rounded-2xl lg:shadow-xl rounded-t-2xl
          fixed lg:relative
          ${isOpenTextModal ? "animate-in fade-in-0 zoom-in-95" : "animate-out fade-out-0 zoom-out-95"}
          transition-all duration-300 ease-out
          ${isOpenTextModal ? "bottom-0 lg:bottom-auto" : "-bottom-full lg:bottom-auto"}
          lg:translate-y-0
        `}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Content */}
              <div className="p-4 lg:p-8">
                {/* Header */}
                <div className="flex items-center justify-between text-black1 mb-6">
                  <button onClick={() => setIsOpenTextModal(false)} className="icon-wrapper h-6 w-6 text-gray12 hover:text-blue2 transition-colors">
                    <IconClose />
                  </button>
                  <span className="font-normal lg:text-base text-sm">متن تعهدنامه</span>
                </div>

                {/* Body */}
                <p className="text-right mb-6 lg:text-lg text-sm font-medium text-black1 leading-relaxed">
                  اینجانب (نام و نام خانوادگی) فرزند (نام پدر) با پذیرش تمام شرایط و قوانین مندرج در وبسایت <span className="text-blue2">payfa{toPersianDigits(24)}.com</span> اقدام
                  به ثبت نام و فعالیت نموده و کاربری و حساب خود را اجاره نخواهم داد
                </p>

                {/* Footer */}
                <div className="flex justify-start">
                  <span className="text-lg font-medium text-black1">تاریخ + امضا</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile-only bottom padding fix */}
          <div className="h-4 lg:hidden" />
        </>
      )}
    </div>
  );
}
