import React, { useRef, useState, useEffect } from "react";
import UploadImage from "../../../../assets/icons/authentication/UploadImage";
import IconAlert from "../../../../assets/icons/Login/IconAlert";
import { toast } from "react-toastify";
import StepperComponent from "../Stepper";

type IdentificationDocumentProps = {
  handleUploadImageFiles: (key: "idCardImageFile" | "identityVerifyImageFile", imageFile: File | undefined) => void;
  setStep: React.Dispatch<React.SetStateAction<0 | 1 | 2>>;
};

export default function IdentificationDocument({ handleUploadImageFiles, setStep }: IdentificationDocumentProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  // upload image and display it =======================================================================================================================
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = e.target.files?.[0];
    if (!imageFile) return;
    if (imageFile.size > 20 * 1024 * 1024) {
      toast.error("حجم فایل نباید بیشتر از 20 مگابایت باشد.");
      return;
    }
    if (!imageFile?.type.startsWith("image/")) {
      toast.error("نوع فایل باید تصویر باشد.");
      return;
    }
    const imageURL = URL.createObjectURL(imageFile);
    setPreviewImage(imageURL);
    handleUploadImageFiles("idCardImageFile", imageFile);
  };
  // cleanup object URL when previewImage changes or component unmounts; preventing memory leak ============================================================
  useEffect(() => {
    return () => {
      if (previewImage) URL.revokeObjectURL(previewImage);
    };
  }, [previewImage]);
  //
  const handleProceed = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setStep(2);
  };

  return (
    <div className="w-full">
      <form className="lg:bg-gray9 lg:rounded-2xl lg:px-8 w-full">
        <div className="flex flex-col text-right">
    

          <StepperComponent currentStep={0} isAdvance={true} />
          <p className="lg:text-xl text-sm font-medium text-black0 lg:mt mb-5">لطفا مدرک شناسایی خود را بارگذاری کنید</p>
          <div
            className="relative w-full cursor-pointer mx-auto lg:mb-6 mb-5 p-4 border-2 border-dashed border-gray31 rounded-lg text-center"
            onClick={() => fileInputRef?.current?.click()}
          >
            <div className="flex flex-col items-center justify-center h-48">
              {previewImage ? (
                <div className="flex justify-center items-center w-full h-full">
                  <img src={previewImage} alt="پیش نمایش مدرک شناسایی" className="max-h-full max-w-full rounded-lg object-contain" />
                </div>
              ) : (
                <>
                  <span className="icon-wrapper lg:w-14 lg:h-14 w-8 h-8 text-gray15">
                    <UploadImage />
                  </span>
                  <p className="text-gray15 lg:text-lg text-sm mt-1 font-normal">بارگذاری تصویر مدرک شناسایی</p>
                </>
              )}
            </div>
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*" />
          </div>
          <div className="bg-orange4 flex flex-col pr-6 pl-2 py-4 gap-2 lg:mb-12 mb-24 rounded-lg">
            <div className="flex text-orange1 gap-1 self-end font-medium">
              <span className="lg:text-base text-xs">توجه داشته باشید</span>
              <span className="icon-wrapper lg:w-6 lg:h-6 w-4 h-4 text-orange1">
                <IconAlert />
              </span>
            </div>
            <p className="text-black1 font-medium lg:text-base text-xs">
              در صورت عدم وجود کارت ملی می‌توانید از کارت‌های (گواهینامه و یا کارت پایان خدمت و یا معافیت) نیز استفاده کنید
            </p>
          </div>
        </div>
        <button
          onClick={handleProceed}
          type="submit"
          className={`mt-1 text-lg font-bold mb-6 w-full lg:h-[56px] h-10 rounded-lg border border-transparent transition duration-300 ease-in
          ${previewImage ? "hover:bg-blue1 text-white2 bg-blue2" : "bg-blue2 text-white2 opacity-60 cursor-not-allowed"}`}
          disabled={!previewImage}
        >
          تأیید
        </button>
      </form>
    </div>
  );
}
