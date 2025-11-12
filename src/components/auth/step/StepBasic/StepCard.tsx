import { Controller, useForm } from "react-hook-form";
import StepperComponent from "../Stepper";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import TextField from "../../../InputField/TextField";
import { useState, } from "react";
import verify from "../../../../assets/icons/authentication/verify.svg";
import { Link } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "../../../../utils/apiClient";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { toPersianDigits } from "../../../Deposit/CardToCardTransfer";
import useGetKYCInfo from "../../../../hooks/useGetKYCInfo";

type Props = {
  onNext: () => void;
  userInfo?: {
    kyc?: {
      basic?: {
        cardbank?: boolean;
      };
    };
  };
};

type FormValues = {
  CardNumber: string;
};

const schema = yup.object().shape({
  CardNumber: yup
    .string()
    .required("شماره کارت الزامی است.")
    .test("len", "شماره کارت باید ۱۶ رقم باشد.", (val) => {
      return (val || "").replace(/\D/g, "").length === 16;
    }),
});

const formatCardNumber = (digits: string): string => {
  if (!digits) return "____ ____ ____ ____";
  const parts = digits.match(/.{1,4}/g) || [];
  // while (parts.length < 4) parts.push("____");
  return parts.join("-");
};

export default function StepCard({ onNext,  }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { refetch } = useGetKYCInfo();
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { CardNumber: "" },
    mode: "onBlur",
    resolver: yupResolver(schema),
  });
  const watchCardNumber = watch("CardNumber");
  const watchCardComplete = (watchCardNumber || "").replace(/\D/g, "").length === 16;
  // useEffect(() => {
  //   if (userInfo?.kyc?.basic?.cardbank) {
  //     setIsModalOpen(true);
  //   }
  // }, [userInfo]);

  const submitCardMutation = useMutation({
    mutationFn: (data: FormValues) => {
      const payload = { CardNumber: data.CardNumber };
      return apiRequest<{ status: boolean; msg?: string }, { CardNumber: string }>({
        url: "/account/credit-card",
        method: "POST",
        data: payload,
      });
    },
    onSuccess: (data) => {
      if (data.status) {
        toast.success("شماره کارت با موفقیت ثبت شد.");
        refetch();
        setIsModalOpen(true);
        onNext();
      } else {
        toast.error(data.msg || "خطا در ثبت شماره کارت.");
      }
    },
    onError: (error: AxiosError<{ msg: string }>) => {
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
        <form className="lg:px-8 px-2 lg:border border-gray26 lg:bg-gray9 lg:rounded-2xl" onSubmit={handleSubmit(onSubmit)}>
          <StepperComponent currentStep={2} />

          <p className="lg:text-xl text-sm font-medium  mt-10 lg:mb-8 mb-5 text-end text-black0">. شماره کارت خود را وارد کنید</p>

          <Controller
            name="CardNumber"
            control={control}
            render={({ field }) => {
              const inputRef = (el: HTMLInputElement | null) => {
                if (el) {
                  // حفظ ref برای دسترسی در onKeyDown
                  (field as any).ref = el;
                }
              };

              return (
                <TextField
                  label="شماره کارت"
                  type="text"
                  error={errors.CardNumber?.message || (submitCardMutation.error as any)?.response?.data?.msg}
                  inputRef={inputRef}
                  value={toPersianDigits(formatCardNumber(field.value || ""))}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const input = e.target;
                    const raw = input.value.replace(/[^\d۰-۹]/g, "").slice(0, 16);
                    const englishDigits = raw.replace(/[۰-۹]/g, (d) => "0123456789"["۰۱۲۳۴۵۶۷۸۹".indexOf(d)]);
                    field.onChange(englishDigits);
                    input.value = toPersianDigits(formatCardNumber(englishDigits));
                  }}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === "Backspace") {
                      e.preventDefault();
                      const current = field.value || "";
                      if (current.length > 0) {
                        const newVal = current.slice(0, -1);
                        field.onChange(newVal);
                        const input = e.target as HTMLInputElement;
                        // input.value = formatCardNumber(newVal);
                        input.value = toPersianDigits(formatCardNumber(newVal));
                      }
                    }
                  }}
                  onPaste={(e: React.ClipboardEvent<HTMLInputElement>) => {
                    e.preventDefault();
                    const pasted = (e.clipboardData.getData("text") || "").replace(/\D/g, "").slice(0, 16);
                    field.onChange(pasted);
                    const input = e.target as HTMLInputElement;
                    input.value = formatCardNumber(pasted);
                  }}
                  placeholder="____-____-____-____"
                  inputMode="numeric"
                  className="input-card text-center tracking-widest "
                  labelBgClass="lg:bg-gray9 bg-gray38"
                />
              );
            }}
          />

          <div className="flex gap-5 items-center lg:mt-22 mt-12 mb-60 w-full lg:flex-row flex-col">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="lg:w-1/2 w-full h-[40px] lg:h-[56px] border border-blue2  lg:text-xl text-base font-medium transition-all rounded-lg text-gray5 hover:bg-blue2 hover:text-white2"
            >
              بعدا انجام میدهم
            </button>
            <button
              type="submit"
              disabled={submitCardMutation.isPending || !watchCardComplete}
              className={`lg:w-1/2 w-full h-[40px] lg:h-[56px] bg-blue2 lg:text-xl text-base font-bold text-white2 rounded-lg transition-all
               ${submitCardMutation.isPending || !watchCardComplete ? "opacity-65 cursor-not-allowed" : "opacity-100 hover:bg-blue1"}`}
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
              // onClick={() => setIsModalOpen(false)}
            >
              <div className="rounded-lg lg:p-10 p-4 relative bg-white8" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center flex-col gap-4 justify-between">
                  <div className="w-16 h-16">
                    <img src={verify} alt="verify" />
                  </div>
                  <h2 className="lg:text-lg text-sm lg:font-bold font-normal text-black1">! احراز هویت شما باموفقیت انجام شد</h2>
                </div>
                <div className="w-full mt-14">
                  <Link to={"/kyc-advanced"}>
                    <button onClick={handleCloseModal} className="w-full h-[48px] font-bold bg-blue2 text-white2 rounded-lg">
                      تکمیل فرآیند احراز هویت
                    </button>
                  </Link>
                  <Link to={"/"}>
                    <button onClick={handleCloseModal} className="mt-4 w-full h-[48px] font-bold border border-blue2 text-blue2 rounded-lg">
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
