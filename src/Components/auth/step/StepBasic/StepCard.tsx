import { Controller, useForm } from "react-hook-form";
import StepperComponent from "../Stepper";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import TextField from "../../../InputField/TextField";
import { useState } from "react";
import IconClose from "../../../../assets/Icons/Login/IconClose";
import OTPModal from "../../../OTPModal";
import IconAgain from "../../../../assets/Icons/Login/IconAgain";
import verify from "../../../../assets/Icons/authentication/verify.svg";
import { Link } from "react-router";
type Props = {
  onNext: () => void;
};

type FormValues = {
  cardNumber: string;
};

const schema = yup.object().shape({
  cardNumber: yup
    .string()
    .required("شماره کارت الزامی است.")
    .matches(/^\d{4}-?\d{4}-?\d{4}-?\d{4}$/, "شماره کارت باید ۱۶ رقمی باشد.")
    .test("valid-length", "شماره کارت باید ۱۶ رقم باشد.", (value) => {
      const digits = value ? value.replace(/-/g, "") : "";
      return digits.length === 16;
    }),
});

const formatCardNumber = (value: string): string => {
  const numericValue = value.replace(/[^0-9]/g, "");
  if (numericValue.length === 0) return "____-____-____-_ ___";
  const formattedValue = numericValue
    .slice(0, 16) // حداکثر 16 رقم
    .replace(/(\d{4})/g, "$1-")
    .replace(/-$/, "");
  const parts = formattedValue.split("-");
  while (parts.length < 4) parts.push("____");
  return parts.join("-").slice(0, 19);
};

export default function StepCard({ onNext }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const contactMethod = "email";
  const {
    control,
    handleSubmit,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { cardNumber: "_ _ _ _  _ _ _ _  _ _ _ _  _ _ _ _" },
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const cardNumberValue = watch("cardNumber");

  const onSubmit = (data: FormValues) => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    onNext();
  };

  return (
    <>
      <div className="w-full">
        <form className="lg:px-8 px-2 lg:border border-gray26 lg:bg-gray9 lg:rounded-2xl">
          <StepperComponent currentStep={2} />

          <p className="lg:text-lg text-xs lg:mt-14 mt-10 lg:mb-8 mb-5 text-end text-black0">
            شماره کارت خود را وارد کنید
          </p>

          <Controller
            name="cardNumber"
            control={control}
            render={({ field }) => (
              <TextField
                label="شماره کارت"
                type="text"
                error={errors.cardNumber?.message}
                {...field}
                onChange={(e) => {
                  const formatted = formatCardNumber(e.target.value);
                  setValue("cardNumber", formatted, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
                value={cardNumberValue}
                labelBgClass="bg-gray9 "
                className="input-card"
              />
            )}
          />

          <button
            onClick={handleSubmit(onSubmit)}
            type="submit"
            className="lg:mt-22 mt-12 mb-60 w-full h-[40px] lg:h-[56px] bg-blue1 font-bold text-white2 rounded-lg"
          >
            تایید
          </button>
        </form>

        {isModalOpen && (
          <div>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-45"></div>
            <div
              className="fixed inset-0 flex items-center justify-center z-50"
              onClick={() => {
                setIsModalOpen(false);
                console.log("Clicked outside, closing modal");
              }}
            >
              <div
                className=" rounded-lg lg:p-10 p-4 relative bg-white8"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center flex-col gap-4 justify-between">
                  <div className="w-16 h-16">
                    <img src={verify} alt="verify" />
                  </div>
                  <h2 className="lg:text-lg text-sm lg:font-bold font-normal text-black1">
                    ! احراز هویت شما باموفقیت انجام شد
                  </h2>
                </div>

                <div className="w-full mt-14">
                  <Link to={'/authenticationAdvance'}>
                  <button
                    onClick={handleCloseModal}
                    className="w-full h-[48px] font-bold bg-blue2 text-white2 rounded-lg"
                  >
                    تکمیل فرآیند احراز هویت
                  </button>
                  </Link>
                   <button
                    onClick={handleCloseModal}
                    className="mt-4 w-full h-[48px] font-bold border border-blue2 text-blue2 rounded-lg"
                  >
                    بازگشت به صفحه اصلی
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
