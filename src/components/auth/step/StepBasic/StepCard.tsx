import { Controller, useForm } from "react-hook-form";
import StepperComponent from "../Stepper";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import TextField from "../../../InputField/TextField";
import { useState, useEffect } from "react";
import verify from "../../../../assets/icons/authentication/verify.svg";
import { Link } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "../../../../utils/apiClient";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

type Props = {
  onNext: () => void;
};

type FormValues = {
  CardNumber: string;
};

interface KycCheckResponse {
  status: boolean;
  msg?: string;
  kyc?: {
    basic?: {
      cardbank?: boolean;
    };
  };
}

const schema = yup.object().shape({
  CardNumber: yup
    .string()
    .required("شماره کارت الزامی است.")
    .matches(/^\d{4}-?\d{4}-?\d{4}-?\d{4}$/, "شماره کارت باید ۱۶ رقمی باشد.")
    .test("valid-length", "شماره کارت باید ۱۶ رقم باشد.", (value) => {
      const digits = value ? value.replace(/-/g, "") : "";
      return digits.length === 16;
    }),
});

// تابع برای فرمت‌دهی شماره کارت
const formatCardNumber = (value: string): string => {
  const numericValue = value.replace(/[^0-9]/g, "");
  const formattedValue = numericValue
    .slice(0, 16)
    .replace(/(\d{4})/g, "$1-")
    .replace(/-$/, "");

  if (formattedValue.length === 0) {
    return "____-____-____-____";
  }

  const parts = formattedValue.split("-");
  while (parts.length < 4) {
    parts.push("____");
  }
  return parts.join("-").slice(0, 19);
};

export default function StepCard({ onNext }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { CardNumber: "" },
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const CardNumberValue = watch("CardNumber");

  // useEffect برای بررسی وضعیت تکمیل بودن این مرحله
  useEffect(() => {
    const checkCardStatus = async () => {
      try {
        const response = await apiRequest<KycCheckResponse>({
          url: "/api/kyc/get-info",
        });

        // بررسی وجود فیلد cardbank در پاسخ
        if (response.kyc?.basic?.cardbank) {
          console.log("Card info already completed. Navigating to next step.");
          onNext();
        }
      } catch (error) {
        console.error("Error checking card status:", error);
      }
    };

    checkCardStatus();
  }, []);

  // استفاده از useMutation برای مدیریت ارسال اطلاعات کارت
  const submitCardMutation = useMutation({
    mutationFn: (data: FormValues) => {
      const payload = {
        CardNumber: data.CardNumber.replace(/-/g, ""),
      };
      return apiRequest<
        { status: boolean; msg?: string },
        { CardNumber: string }
      >({
        url: "/api/account/credit-card",
        method: "POST",
        data: payload,
      });
    },
    onSuccess: (data) => {
      console.log("Submit card info response:", data);
      if (data.status) {
        toast.success("شماره کارت با موفقیت ثبت شد.");
        setIsModalOpen(true);
      } else {
        toast.error(data.msg || "خطا در ثبت شماره کارت.");
      }
    },
    onError: (error: AxiosError<{ msg: string }>) => {
      console.error("Submit card info error:", error);
      const errorMsg = error.response?.data?.msg || "خطا در ارتباط با سرور.";
      toast.error(errorMsg);
    },
  });

  const onSubmit = (data: FormValues) => {
    submitCardMutation.mutate(data);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    onNext();
  };

  return (
    <>
      <div className="w-full">
        <form
          className="lg:px-8 px-2 lg:border border-gray26 lg:bg-gray9 lg:rounded-2xl"
          onSubmit={handleSubmit(onSubmit)}
        >
          <StepperComponent currentStep={2} />

          <p className="lg:text-lg text-xs lg:mt-14 mt-10 lg:mb-8 mb-5 text-end text-black0">
            شماره کارت خود را وارد کنید
          </p>

          <Controller
            name="CardNumber"
            control={control}
            render={({ field }) => (
              <TextField
                label="شماره کارت"
                type="text"
                error={
                  errors.CardNumber?.message ||
                  submitCardMutation.error?.response?.data?.msg
                }
                {...field}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const formatted = formatCardNumber(e.target.value);
                  setValue("CardNumber", formatted, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
                value={CardNumberValue}
                labelBgClass="bg-gray9 "
                className="input-card"
              />
            )}
          />

          <div className="flex gap-5 items-center lg:mt-22 mt-12 mb-60 w-full lg:flex-row flex-col">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="lg:w-1/2 w-full h-[40px] lg:h-[56px] border border-blue2 rounded-lg text-black0"
            >
              بعدا انجام میدهم
            </button>
            <button
              type="submit"
              className="lg:w-1/2 w-full h-[40px] lg:h-[56px] bg-blue1 font-bold text-white2 rounded-lg"
              disabled={submitCardMutation.isPending}
            >
              {submitCardMutation.isPending ? "در حال تایید..." : "تایید"}
            </button>
          </div>
        </form>
        {isModalOpen && (
          <div>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-45"></div>
            <div
              className="fixed inset-0 flex items-center justify-center z-50"
              onClick={() => {
                setIsModalOpen(false);
              }}
            >
              <div
                className="rounded-lg lg:p-10 p-4 relative bg-white8"
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
                  <Link to={"/authenticationAdvance"}>
                    <button
                      onClick={handleCloseModal}
                      className="w-full h-[48px] font-bold bg-blue2 text-white2 rounded-lg"
                    >
                      تکمیل فرآیند احراز هویت
                    </button>
                  </Link>
                  <Link to={"/"}>
                    <button
                      onClick={handleCloseModal}
                      className="mt-4 w-full h-[48px] font-bold border border-blue2 text-blue2 rounded-lg"
                    >
                      بازگشت به صفحه اصلی
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
