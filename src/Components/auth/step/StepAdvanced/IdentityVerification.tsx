import { useEffect, useRef, useState, } from "react";
import UploadImage from "../../../../assets/icons/authentication/UploadImage";
import IconAlert from "../../../../assets/Icons/Login/IconAlert";
import StepperComponent from "../Stepper";
import IconCloseChervon from "../../../../assets/icons/authentication/IconCloseChervon";
import IconOpenChervon from "../../../../assets/icons/authentication/IconOpenChervon";
import IconClose from "../../../../assets/Icons/Login/IconClose";
import previewURLImage2 from "../../../../assets/previewURLImage (2).png";
import { toast } from "react-toastify";

type IdentityVerificationProps = {
  handleUploadImageFiles: (key: "idCardImageFile" | "identityVerifyImageFile", imageFile: File | undefined) => void;
  uploadProgress: number | null;
  handleSubmit: () => Promise<void>;
};

export default function IdentityVerification({ handleSubmit, uploadProgress, handleUploadImageFiles }: IdentityVerificationProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isOpenAccordion, setIsOpenAccordion] = useState(false);
  const [isOpenTextModal, setIsOpenTextModal] = useState(false);
  // handles file upload/change =============================================================================================================================================
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = e.target.files?.[0]
    if (!imageFile) return
    if (!imageFile.type.startsWith('image/')) {
      toast.error('باید یک فایل تصویری انتخاب کنید.')
      return
    }
    if (imageFile.size > 20 * 1024 * 1024) {
      toast.error('حجم فایل نباید بیشتر از 20 مگابایت باشد.')
      return
    }
    const imageURL = URL.createObjectURL(imageFile)
    setPreviewImage(imageURL)
    handleUploadImageFiles('identityVerifyImageFile', imageFile)
  }
  // prevent refresh and submits data =========================================================================================================================================
  const handleProceed = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    handleSubmit()
  }
  // cleanup object URL when previewImage changes or component unmounts; preventing memory leak ===============================================================================
  useEffect(() => {
    return () => {
      if (previewImage) URL.revokeObjectURL(previewImage)
    }
  }, [previewImage])

  return (
    <div className="w-full">
      <form className="lg:bg-gray9 lg:rounded-2xl lg:px-8 w-full">
        <div className="flex flex-col text-right">
          <StepperComponent currentStep={1} isAdvance={true} />
          <p className="lg:text-xl font-medium text-black1 hidden lg:flex self-end mb-5">لطفا مدرک شناسایی خود را بارگذاری کنید</p>
          <div className="bg-orange4 flex flex-col pr-6 pl-2 py-4 gap-2 lg:mb-6 mb-4 rounded-lg">
            <div className="flex text-orange1 gap-1 self-end font-medium">
              <span className="lg:text-base text-xs">توجه داشته باشید</span>
              <span className="icon-wrapper lg:w-6 lg:h-6 w-4 h-4 text-orange1"><IconAlert /></span>
            </div>
            <ul className="list-disc list-inside text-right text-black1 lg:text-base text-xs" dir="rtl">
              <li>تصاویر و مدارک ارائه‌شده واضح، خوانا و کامل باشند و در صورت تار بودن یا ناقص بودن، مورد تأیید قرار نگیرند.</li>
              <li>تعهدنامه بدون امضا و تاریخ فاقد اعتبار است.</li>
              <li>متن این تعهدنامه عیناً مطابق نمونه نوشته شود و هرگونه تغییر، حذف یا خلاصه‌نویسی موجب رد آن می‌شود.</li>
              <li>نام صرافی [پی فا 24] به صورت صحیح ذکر شود و در صورت وجود غلط املایی، تعهدنامه رد خواهد شد.</li>
            </ul>
          </div>
          <div
            className="relative w-full cursor-pointer mx-auto my-5 p-4 border-2 border-dashed border-gray31 rounded-lg text-center"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center justify-center h-48">
              {!previewImage ?
                <>
                  <span className="icon-wrapper lg:w-14 lg:h-14 w-8 h-8 text-gray15"><UploadImage /></span>
                  <p className="text-gray15 lg:text-lg text-sm mt-1 font-normal">بارگذاری تصویر مدرک شناسایی</p>
                </>
                :
                <div className="flex justify-center items-center w-full h-full">
                  <img src={previewImage} alt=" بارگذاری تصویر مدرک شناسایی" className="max-h-48 max-w-full rounded-lg absolute" />
                  <div>
                    <span className="icon-wrapper lg:w-14 lg:h-14 w-8 h-8 text-gray15"><UploadImage /></span>
                    <p className="text-gray15 lg:text-lg text-sm mt-1 font-normal">بارگذاری تصویر مدرک شناسایی</p>
                  </div>
                </div>
              }
            </div>
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*" disabled={uploadProgress !== null} />
          </div>
          <button
            type="button"
            className="text-blue2 lg:text-lg text-base font-bold rounded-lg border border-blue2 lg:h-[56px] h-[40px]"
            onClick={() => setIsOpenAccordion(!isOpenAccordion)}
          >
            متن تعهد نامه
          </button>
          {/* نمایش تعهد نامه - آکوردئون */}
          <div className="mt-4 mb-14 border border-gray12 rounded-lg">
            <div className="flex justify-between items-center flex-row-reverse p-4 cursor-pointer" onClick={() => setIsOpenAccordion(!isOpenAccordion)}>
              <h2 className="text-base font-medium text-black1">نمونه تصویر تعهدنامه</h2>
              <span className="icon-wrapper w-5 h-5 text-gray15">{isOpenAccordion ? <IconCloseChervon /> : <IconOpenChervon />}</span>
            </div>
            {isOpenAccordion &&
              <div><img src={previewURLImage2} alt="تعهد نامه" className="w-full h-64 object-fill rounded-lg mb-2 px-4" /></div>
            }
          </div>
        </div>
        <button
          onClick={handleProceed}
          type="submit"
          className="mt-1 text-lg font-bold mb-6 bg-blue1 w-full lg:h-[56px] h-10 rounded-lg text-white2"
          disabled={!previewImage || uploadProgress !== null} // disable during upload
        >
          تأیید
        </button>
      </form>
      {isOpenTextModal &&
        <div onClick={closeTextModalAndOpenSuccessModal} className="fixed cursor-pointer inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
          <div className="lg:w-[448px] w-full lg:rounded-lg lg:p-8 p-4 relative bg-white8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center flex-row justify-between text-black1">
              <span className="icon-wrapper h-6 w-6 cursor-pointer" onClick={closeTextModalAndOpenSuccessModal}><IconClose /></span>
              <span className="font-normal text-base">متن تعهدنامه</span>
            </div>
            <p className="text-right mt-12 mb-6 lg:text-lg text-sm font-medium text-black1">
              اینجانب (نام و نام خانوادگی) فرزند (نام پدر) با پذیرش تمام شرایط و
              قوانین مندرج در وبسایت payfa24.com اقدام به ثبت نام و فعالیت نموده
              و کاربری و حساب خود را اجاره نخواهم داد
            </p>
            <span className="text-lg font-medium text-black1">تاریخ + امضا</span>
          </div>
        </div>
      }
    </div>
  );
}
