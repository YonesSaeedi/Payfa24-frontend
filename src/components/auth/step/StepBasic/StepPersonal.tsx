import { useContext, useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import StepperComponent from "../Stepper";
import TextField from "../../../InputField/TextField";
import IconCalender from "../../../../assets/icons/authentication/IconCalender";
import DatePickerModal from "../../../DatePicker";
import { ThemeContext } from "../../../../context/ThemeContext";
import { apiRequest } from "../../../../utils/apiClient";
import useGetKYCInfo from "../../../../hooks/useGetKYCInfo";

type Props = {
  onNext: () => void;
  userInfo: {
    kyc?: {
      basic?: {
        name?: string;
        family?: string;
        father?: string;
        national_code?: string;
        date_birth?: string;
      };
    };
  };
};

type FormData = {
  name: string;
  family: string;
  father: string;
  nationalCode: string;
  dateBirth: string;
};

type ApiResponse = {
  status: boolean;
  msg?: string;
};

export default function StepPersonal({ onNext, userInfo }: Props) {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("ThemeContext is undefined");
  const { refetch } = useGetKYCInfo();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { control, handleSubmit, setValue, setError } = useForm<FormData>({
    defaultValues: {
      name: "",
      family: "",
      father: "",
      nationalCode: "",
      dateBirth: "",
    },
  });

  // دریافت اطلاعات کاربر برای پر کردن فرم
  useEffect(() => {
    if (!userInfo?.kyc?.basic) return;

    const basic = userInfo.kyc.basic;
    const isCompleted = basic.name && basic.family && basic.father && basic.national_code && basic.date_birth;

    if (isCompleted) return onNext();

    setValue("name", basic.name || "");
    setValue("family", basic.family || "");
    setValue("father", basic.father || "");
    setValue("nationalCode", basic.national_code || "");
    setValue("dateBirth", basic.date_birth || "");
  }, [userInfo, setValue, onNext]);

  // ثبت اطلاعات
  const submitMutation = useMutation<ApiResponse, AxiosError<{ msg: string }>, FormData>({
    mutationFn: (data) =>
      apiRequest<ApiResponse, FormData>({
        url: "/kyc/basic/level2",
        method: "POST",
        data,
      }),
    onSuccess: (data) => {
      if (data.status) {
        toast.success("اطلاعات با موفقیت ثبت شد.");
        refetch();
      } else if (data.msg?.includes("قبلا این اطلاعات را ثبت کرده‌اید")) {
        toast.info("اطلاعات شما قبلا ثبت شده است.");
      } else toast.error(data.msg || "خطا در ثبت اطلاعات.");

      onNext();
    },
    onError: (error) => {
      const msg = error.response?.data?.msg || "خطا در ارتباط با سرور.";
      if (msg.includes("قبلا این اطلاعات را ثبت کرده اید")) toast.info("اطلاعات شما قبلا ثبت شده است.");
      else toast.error(msg);
      // onNext();
    },
  });

  const onSubmit = (data: FormData) => {
    // بررسی تاریخ
    const dateRegex = /^\d{4}\/\d{1,2}\/\d{1,2}$/;
    if (!dateRegex.test(data.dateBirth)) {
      setError("dateBirth", { message: "فرمت تاریخ تولد نادرست است (مثلاً 1375/05/20)" });
      return;
    }

    const [year] = data.dateBirth.split("/").map(Number);
    const currentYear = new Date().getFullYear() - 621; // تبدیل تقریبی به شمسی
    const age = currentYear - year;

    if (age < 18) {
      setError("dateBirth", { message: "حداقل سن مجاز ۱۸ سال است." });
      return;
    }

    submitMutation.mutate(data);
  };

  const formFields = [
    { name: "family", label: "نام خانوادگی" },
    { name: "name", label: "نام" },
    { name: "father", label: "نام پدر" },
    { name: "nationalCode", label: "کد ملی" },
    { name: "dateBirth", label: "تاریخ تولد" },
  ];

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="lg:bg-gray9 lg:rounded-2xl lg:px-8 px-4">
        <StepperComponent currentStep={1} />

        <div className="space-y-7 lg:space-y-8 my-14">
          <div className="flex space-x-4">
            {formFields.slice(0, 2).map((field) => (
              <Controller
                key={field.name}
                name={field.name as "name" | "family"}
                control={control}
                rules={{ required: `${field.label} الزامی است` }}
                render={({ field: f, fieldState }) => <TextField {...f} label={field.label} error={fieldState.error?.message} labelBgClass="lg:bg-gray9 bg-gray38" />}
              />
            ))}
          </div>

          {formFields.slice(2).map((field) => {
            if (field.name === "dateBirth") {
              return (
                <Controller
                  key={field.name}
                  name="dateBirth"
                  control={control}
                  rules={{ required: "تاریخ تولد الزامی است" }}
                  render={({ field: f, fieldState }) => (
                    <TextField
                      label="تاریخ تولد"
                      value={f.value || ""}
                      onChange={() => {}}
                      placeholder="تاریخ تولد خود را انتخاب کنید"
                      labelBgClass="lg:bg-gray9 bg-gray38"
                      alwaysLabelOnTop={true}
                      error={fieldState.error?.message}
                      icon={
                        <span className="icon-wrapper w-5 h-5 text-gray5 cursor-pointer">
                          <IconCalender />
                        </span>
                      }
                      onIconClick={() => setIsModalOpen(true)}
                    />
                  )}
                />
              );
            }

            if (field.name === "nationalCode") {
              return (
                <Controller
                  key={field.name}
                  name="nationalCode"
                  control={control}
                  rules={{
                    required: "کد ملی الزامی است",
                    pattern: {
                      value: /^\d{10}$/,
                      message: "کد ملی باید ۱۰ رقم باشد",
                    },
                  }}
                  render={({ field: f, fieldState }) => <TextField {...f} label={field.label} error={fieldState.error?.message} labelBgClass="lg:bg-gray9 bg-gray38" />}
                />
              );
            }

            return (
              <Controller
                key={field.name}
                name={field.name as "father"}
                control={control}
                rules={{
                  required: `${field.label} الزامی است`,
                  minLength: {
                    value: 3,
                    message: `${field.label} باید حداقل ۳ کاراکتر باشد`,
                  },
                }}
                render={({ field: f, fieldState }) => <TextField {...f}  label={field.label} error={fieldState.error?.message} showError={true}  labelBgClass="lg:bg-gray9 bg-gray38" />}
              />
            );
          })}
        </div>

        <button type="submit" className="mt-1 text-lg font-bold mb-8 bg-blue1 w-full h-[56px] rounded-lg text-white2" disabled={submitMutation.isPending}>
          {submitMutation.isPending ? "در حال ثبت..." : "تأیید"}
        </button>
      </form>

      {isModalOpen && (
        <DatePickerModal
          setBirthDateBtnValue={(value) => {
            const finalValue = typeof value === "string" ? value : "";
            setValue("dateBirth", finalValue);
            setIsModalOpen(false);
          }}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
