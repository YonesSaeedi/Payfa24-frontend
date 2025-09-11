import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import StepperComponent from "../Stepper";
import UploadImage from "../../../../assets/Icons/authentication/UploadImage";
import IconAlert from "../../../../assets/Icons/Login/IconAlert";

type Props = {
  onNext: () => void;
};

type FormData = {
  document: FileList;
};

export default function IdentificationDocument({ onNext }: Props) {
  const { handleSubmit, setValue } = useForm<FormData>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);

  const onSubmit = () => {
    if (!selectedFile) return;
    console.log("فایل انتخاب شده:", selectedFile);
    onNext();
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      setValue("document", files);

      const objectUrl = URL.createObjectURL(file);
      setPreviewURL(objectUrl);
    }
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="lg:bg-gray9 lg:rounded-2xl lg:px-8 w-full"
      >
        <div className="flex flex-col text-right">
          <StepperComponent currentStep={0} isAdvance={true} />

          <p className="lg:text-xl text-sm font-medium text-black0">
            لطفا مدرک شناسایی خود را بارگذاری کنید
          </p>

          <div
            className="relative w-full cursor-pointer mx-auto my-5 p-4 border-2 border-dashed border-gray31 rounded-lg text-center"
            onClick={handleClick}
          >
            <div className="flex flex-col items-center justify-center h-48">
              {/* قبل از انتخاب عکس: آیکون و متن */}
              {!previewURL && (
                <>
                  <span className="icon-wrapper lg:w-14 lg:h-14 w-8 h-8 text-gray15">
                    <UploadImage />
                  </span>
                  <p className="text-gray15 lg:text-lg text-sm mt-1 font-normal">
                    بارگذاری تصویر مدرک شناسایی
                  </p>
                </>
              )}

              {/* بعد از انتخاب عکس: فقط نمایش پیش‌نمایش */}
              {previewURL && (
                <div className="flex justify-center items-center w-full h-full">
                  <img
                    src={previewURL}
                    alt="پیش نمایش"
                    className="max-h-full max-w-full rounded-lg object-contain"
                  />
                </div>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>

          <div className="bg-orange4 flex flex-col pr-6 pl-2 py-4 gap-2 lg:mb-12 mb-24 rounded-lg">
            <div className="flex text-orange1 gap-1 self-end font-medium">
              <span className="lg:text-base text-xs">توجه داشته باشید</span>
              <span className="icon-wrapper lg:w-6 lg:h-6 w-4 h-4 text-orange1">
                <IconAlert />
              </span>
            </div>
            <p className="text-black1 font-medium lg:text-base text-xs">
              در صورت عدم وجود کارت ملی میتوانید از کارت‌های (گواهینامه و یا کارت پایان خدمت و یا معافیت) نیز استفاده کنید
            </p>
          </div>
        </div>

        <button
          type="submit"
          className="mt-1 text-lg font-bold mb-6 bg-blue1 w-full lg:h-[56px] h-10 rounded-lg text-white2"
        >
          تأیید
        </button>
      </form>
    </div>
  );
}
