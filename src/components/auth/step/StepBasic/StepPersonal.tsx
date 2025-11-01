import { useContext, useState, useEffect } from "react";
import StepperComponent from "../Stepper";
import TextField from "../../../InputField/TextField";
import { Controller, useForm } from "react-hook-form";
import IconCalender from "../../../../assets/icons/authentication/IconCalender";
import DatePickerModal from "../../../DatePicker";
import { ThemeContext } from "../../../../context/ThemeContext";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "../../../../utils/apiClient";
import { toast } from "react-toastify";
import { AxiosError } from "axios";



interface ApiResponse {
  status: boolean;
  msg?: string;
}
type Props = {
  onNext: () => void;
  onBack?: () => void;
};

type FormData = {
  name: string;
  family: string;
  father: string;
  nationalCode: string;
  dateBirth: string;
};

type UserInfo = {
  level_kyc: number;
  kyc: {
    basic?: {
      name?: string;
      family?: string;
      mobile?: string | null;
      email?: string | null;
      father?: string;
      national_code?: string;
      date_birth?: string;
      cardbank?: number;
    };
    advanced?: {
      status: "pending" | "success" | "reject";
      reason_reject?: string | null;
    };
  };
};

export default function StepPersonal({ onNext }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const context = useContext(ThemeContext);
  if (!context) throw new Error("ThemeContext is undefined");

  const formInput = [
    { name: "family", label: "نام خانوادگی" },
    { name: "name", label: "نام" },
    { name: "father", label: "نام پدر" },
    { name: "nationalCode", label: "کد ملی" },
    { name: "dateBirth", label: "تاریخ تولد" },
  ];

  const {
    control,
    handleSubmit,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      family: "",
      father: "",
      nationalCode: "",
      dateBirth: "",
    },
  });

  // Fetch user info to prefill form and navigate if already completed
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiRequest<UserInfo>({
          url: "/kyc/get-info",
        });
        console.log("User info response stepPersonal:", response);
        if (response.kyc?.basic) {
          // Check if all required fields are filled
          const isCompleted =
            response.kyc.basic.name &&
            response.kyc.basic.family &&
            response.kyc.basic.father &&
            response.kyc.basic.national_code &&
            response.kyc.basic.date_birth;

          if (isCompleted) {
            console.log(
              "Personal info already completed. Navigating to next step."
            );
            onNext();
            return;
          }

          setValue("name", response.kyc.basic.name || "");
          setValue("family", response.kyc.basic.family || "");
          setValue("father", response.kyc.basic.father || "");
          setValue("nationalCode", response.kyc.basic.national_code || "");
          setValue("dateBirth", response.kyc.basic.date_birth || "");
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        toast.error("خطا در دریافت اطلاعات کاربر.");
      }
    };
    fetchUserData();
  }, [setValue, onNext]);

  // Mutation for submitting personal info
const submitPersonalInfoMutation = useMutation<
  ApiResponse,
  AxiosError<{ msg: string }>,
  FormData
>({
  mutationFn: (payload: FormData) =>
    apiRequest<ApiResponse,FormData>({
      url: "/kyc/basic/level2",
      method: "POST",
      data: payload,
    }),
  onSuccess: (data) => {
    console.log("Submit personal info response:", data);
    if (data.status) {
      toast.success("اطلاعات با موفقیت ثبت شد.");
      onNext();
    } else {
      const isAlreadyRegistered =
        data.msg && data.msg.includes("قبلا این اطلاعات را ثبت کرده‌اید");
      if (isAlreadyRegistered) {
        toast.info("اطلاعات شما قبلا ثبت شده است. به مرحله بعد می‌روید.");
        onNext();
      } else {
        toast.error(data.msg || "خطا در ثبت اطلاعات.");
      }
    }
  },
  onError: (error) => {
    console.error("Submit personal info error:", error);
    const errorMsg = error.response?.data?.msg || "خطا در ارتباط با سرور.";

    const isAlreadyRegisteredError =
      error.response?.status === 400 &&
      errorMsg.includes("قبلا این اطلاعات را ثبت کرده اید");

    if (isAlreadyRegisteredError) {
      toast.info("اطلاعات شما قبلا ثبت شده است. به مرحله بعد می‌روید.");
      onNext();
    } else {
      toast.error(errorMsg);
    }
  },
});


  const onSubmit = (data: FormData) => {
    const payload = {
      name: data.name,
      family: data.family,
      father: data.father,
      nationalCode: data.nationalCode,
      dateBirth: data.dateBirth,
    };
    console.log("Sending personal info payload:", payload);
    submitPersonalInfoMutation.mutate(payload);
  };



  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="lg:bg-gray9 lg:rounded-2xl lg:px-8 px-1"
      >
        <StepperComponent currentStep={1} />
        <div className="space-y-7 lg:space-y-8 my-14">
          <div className="flex space-x-4">
            {formInput.slice(0, 2).map((field) => (
              <Controller
                key={field.name}
                name={field.name as "name" | "family"}
                control={control}
                rules={{
                  required: `${field.label} الزامی است`,
                }}
                render={({ field: controllerField, fieldState }) => (
                  <TextField
                    label={field.label}
                    type="text"
                    error={fieldState.error?.message}
                    {...controllerField}
                    labelBgClass="bg-gray9"
                  />
                )}
              />
            ))}
          </div>
          {formInput.slice(2).map((field) => {
            if (field.name === "dateBirth") {
              return (
                <Controller
                  key={field.name}
                  name="dateBirth"
                  control={control}
                  rules={{
                    required: "تاریخ تولد الزامی است",
                  }}
                  render={({ field: controllerField, fieldState }) => (
                    <div className="relative">
                      <TextField
                        label={field.label}
                        type="text"
                        value={controllerField.value || ""}
                        onChange={() => {}}
                        onBlur={() => {}}
                        labelBgClass="bg-gray9"
                        error={fieldState.error?.message}
                        icon={
                          <span className="icon-wrapper text-gray12 w-5 h-5 flex items-center justify-center cursor-pointer">
                            <IconCalender />
                          </span>
                        }
                        onIconClick={() => setIsModalOpen(true)}
                      />
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
                      message: "کد ملی باید یک عدد ۱۰ رقمی باشد",
                    },
                  }}
                  render={({ field: controllerField, fieldState }) => (
                    <TextField
                      label={field.label}
                      type="text"
                      {...controllerField}
                      error={fieldState.error?.message}
                      labelBgClass="bg-gray9"
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
                rules={{
                  required: `${field.label} الزامی است`,
                }}
                render={({ field: controllerField, fieldState }) => (
                  <TextField
                    label={field.label}
                    type="text"
                    {...controllerField}
                    error={fieldState.error?.message}
                    labelBgClass="bg-gray9"
                  />
                )}
              />
            );
          })}
        </div>

        <button
          type="submit"
          className="mt-1 text-lg font-bold mb-8 bg-blue1 w-full h-[56px] rounded-lg text-white2"
          disabled={submitPersonalInfoMutation.isPending}
        >
          {submitPersonalInfoMutation.isPending ? "در حال ثبت..." : "تأیید"}
        </button>
      </form>

      {isModalOpen && (
        <DatePickerModal
          setBirthDateBtnValue={(value) => {
            const date = typeof value === "function" ? value(null) : value;
            setValue("dateBirth", date ?? "");
            setIsModalOpen(false);
          }}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
