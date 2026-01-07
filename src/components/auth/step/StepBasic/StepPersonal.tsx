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
  userInfo?: {
    kyc?: {
      basic?: {
        name?: string | null;
        family?: string | null;
        father?: string | null;
        national_code?: string | null;
        date_birth?: string | null;
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
      onNext();
    } else if (data.msg?.includes("قبلا این اطلاعات را ثبت کرده‌اید")) {
      toast.info("اطلاعات شما قبلا ثبت شده است.");
      onNext();
    } else {
      toast.error(data.msg || "خطا در ثبت اطلاعات.");
    }
  },
  onError: (error) => {
    const msg = error.response?.data?.msg || "خطا در ارتباط با سرور.";

    if (msg.includes("قبلا این اطلاعات را ثبت کرده اید")) {
      toast.info("اطلاعات شما قبلا ثبت شده است.");
      onNext();
    } else {
      toast.error(msg);
    }
  },
});
const onSubmit = (data: FormData) => {
  const trimmedData: FormData = {
    name: data.name?.trim() || "",
    family: data.family?.trim() || "",
    father: data.father?.trim() || "",
    nationalCode: data.nationalCode?.trim() || "",
    dateBirth: data.dateBirth?.trim() || "",
  };


  // بررسی تاریخ و سن
const dateRegex = /^\d{4}\/\d{1,2}\/\d{1,2}$/;
  if (!dateRegex.test(trimmedData.dateBirth)) {
    setError("dateBirth", { message: "فرمت تاریخ تولد نادرست است (مثلاً 1375/05/20)" });
    return;
  }

   const [year] = trimmedData.dateBirth.split("/").map(Number);
  const currentYear = new Date().getFullYear() - 621;
  const age = currentYear - year;
  if (age < 18) {
    setError("dateBirth", { message: "حداقل سن مجاز ۱۸ سال است." });
    return;
  }


  submitMutation.mutate(trimmedData); 
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

        {/* فقط یک map برای بقیه فیلدها */}
        {formFields.slice(2).map((field) => {
          if (field.name === "dateBirth") {
            return (
              <Controller
                key={field.name}
                name="dateBirth"
                control={control}
                rules={{ required: "تاریخ تولد الزامی است" }}
                render={({ field: f, fieldState }) => (
                  <div className="mb-4" >
                    {/* Custom Date Field - شبیه TextField اما قابل کلیک در کل area */}
                    <div 
                      className={`
                        relative w-full bg-transparent 
                        lg:h-[56px] h-[48px] rounded-xl border 
                        px-4 pt-3 pb-1 cursor-pointer
                        transition-all duration-200
                        ${fieldState.error ? 
                          'border-red1' : 
                          f.value ? 'border-blue2' : 'border-gray5'
                        }
                      `}
                      onClick={() => setIsModalOpen(true)}
                    >
                      {/* Label - شبیه TextField */}
                      <label className={`
                        absolute right-3 px-1 transition-all duration-200
                        pointer-events-none  
                        ${f.value || fieldState.error ? 
                          `top-[-12px] lg:text-sm text-xs 
                           ${fieldState.error ? 'text-red1' : 'text-gray5'} 
                           lg:bg-gray9 bg-gray38` :
                          '-top-[0%] -translate-y-1/2 text-xs text-gray5 lg:bg-gray9  bg-gray38'
                        }
                      `}>
                        تاریخ تولد
                      </label>
                      
                      {/* Value/Placeholder */}
                      <div className="flex items-end lg:mt-1 mt-0 flex-row-reverse justify-between">
                        <span className={`
                          text-xs font-normal block truncate
                          ${f.value ? 'text-black0' : 'text-gray5'}
                        `}>
                          {f.value || "تاریخ تولد خود را انتخاب کنید"}
                        </span>
                        
                        {/* Icon */}
                        <span className="icon-wrapper w-5 h-5 text-gray5 flex-shrink-0">
                          <IconCalender />
                        </span>
                      </div>
                    </div>
                    
                    {/* Error Message */}
                    {fieldState.error && (
                      <p className="text-red1 text-xs mt-2 pr-3">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
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
                render={({ field: f, fieldState }) => (
                  <TextField 
                    {...f} 
                    label={field.label} 
                    error={fieldState.error?.message} 
                    labelBgClass="lg:bg-gray9 bg-gray38" 
                  />
                )}
              />
            );
          }

          return (
            <Controller
              key={field.name}
              name={field.name as "father"}
              control={control}
              rules={{ required: `${field.label} الزامی است` }}
              render={({ field: f, fieldState }) => (
                <TextField 
                  {...f} 
                  label={field.label} 
                  error={fieldState.error?.message} 
                  labelBgClass="lg:bg-gray9 bg-gray38" 
                />
              )}
            />
          );
        })}
      </div>

      <button dir="rtl" type="submit" className="mt-32 text-lg font-bold mb-8 bg-blue1 w-full h-[56px] rounded-lg text-white2" disabled={submitMutation.isPending}>
        {submitMutation.isPending ? "در حال ثبت ..." : "تأیید"}
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
