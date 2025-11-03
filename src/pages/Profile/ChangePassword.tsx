import BreadcrumbNavigation from "../../components/BreadcrumbNavigation";
import HeaderLayout from "../../layouts/HeaderLayout";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import TextField from "../../components/InputField/TextField";
import IconEyeOpen from "../../assets/icons/Login/IconEyeOpen";
import IconEyeClosed from "../../assets/icons/Login/IconEyeClosed";
import PasswordConditionItem from "../../components/InputField/PasswordConditionitem/PasswordConditionItem";
import { useState } from "react";
import { apiRequest } from "../../utils/apiClient";
import { toast } from "react-toastify";
import { getChangePasswordSchemaProfile } from "../../utils/validationSchemas";

interface ChangePasswordRequestBody {
  old_password: string;
  new_password: string;
  confirm_new_password: string;
  [key: string]: string | number | boolean | Blob | File; // ← اینجا
}


type ChangePasswordFormData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};
interface ChangePasswordResponse {
  status: boolean;
  msg?: string;
}

export default function ChangePassword() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors, isValid }, // ✅ isValid اضافه شد
    watch,
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: yupResolver(getChangePasswordSchemaProfile()),
    mode: "onChange",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPasswordValue = watch("newPassword");

  const hasMinLength = newPasswordValue.length >= 8;
  const hasLowerAndUpper =
    /[a-z]/.test(newPasswordValue) && /[A-Z]/.test(newPasswordValue);
  const hasNumber = /\d/.test(newPasswordValue);

 const onSubmit = async (data: ChangePasswordFormData) => {
  setIsSubmitting(true);

  try {
 const response = await apiRequest<
  ChangePasswordResponse,
  ChangePasswordRequestBody
>({
  url: "/account/password",
  method: "POST",
  data: {
    old_password: data.currentPassword,
    new_password: data.newPassword,
    confirm_new_password: data.confirmPassword,
  },
});


    if (response.status === true) {
      toast.success("رمز عبور با موفقیت تغییر کرد");
      reset();
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } else {
      toast.error(response.msg || "خطا در تغییر رمز عبور");
    }
  } catch (error: any) {
    console.error("API ERROR:", error);
    const errorMsg =
      error?.response?.data?.message ||
      error?.message ||
      "خطا در اتصال به سرور";
    toast.error(errorMsg);
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <>
      <HeaderLayout>
        <div className="lg:container-style w-full pt-7 flex gap-10 px-4 lg:px-0 flex-col">
          <BreadcrumbNavigation />
          <div className="dark:bg-gray9  w-full lg:shadow-[0_0_12px_0_rgba(0,0,0,0.16)] rounded-2xl pb-10">
            <div className="flex items-center justify-center w-full" dir="rtl">
              <div className="w-full max-w-lg lg:px-8">
                <form className="py-8 px-4" onSubmit={handleSubmit(onSubmit)}>
                  <h1 className="text-black1 text-center lg:pt-20 lg:text-xl text-sm font-medium">
                    تغییر رمز عبور
                  </h1>
                  <p className="font-normal lg:mb-12 mb-8 pt-3 lg:text-base text-sm text-center text-gray5">
                    در این بخش رمزعبور حساب کاربری خود را تغییر دهید.
                  </p>

                  <div className="flex flex-col lg:gap-8 gap-5">
                    <Controller
                      name="currentPassword"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          label="رمز عبور فعلی"
                          type={showCurrentPassword ? "text" : "password"}
                          error={errors.currentPassword?.message}
                          icon={
                            showCurrentPassword ? (
                              <IconEyeOpen />
                            ) : (
                              <IconEyeClosed />
                            )
                          }
                          onIconClick={() =>
                            setShowCurrentPassword((prev) => !prev)
                          }
                          {...field}
                          disabled={isSubmitting}
                          labelBgClass="bg-gray9 "
                        />
                      )}
                    />

                    <Controller
                      name="newPassword"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          label="رمز عبور جدید"
                          type={showNewPassword ? "text" : "password"}
                          error={errors.newPassword?.message}
                          icon={
                            showNewPassword ? (
                              <IconEyeOpen />
                            ) : (
                              <IconEyeClosed />
                            )
                          }
                          onIconClick={() =>
                            setShowNewPassword((prev) => !prev)
                          }
                          {...field}
                          disabled={isSubmitting}
                          labelBgClass="bg-gray9"
                        />
                      )}
                    />

                    <Controller
                      name="confirmPassword"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          label="تکرار رمز عبور جدید"
                          type={showConfirmPassword ? "text" : "password"}
                          error={errors.confirmPassword?.message}
                          icon={
                            showConfirmPassword ? (
                              <IconEyeOpen />
                            ) : (
                              <IconEyeClosed />
                            )
                          }
                          onIconClick={() =>
                            setShowConfirmPassword((prev) => !prev)
                          }
                          {...field}
                          disabled={isSubmitting}
                          labelBgClass="bg-gray9"
                        />
                      )}
                    />
                  </div>

                  <div className="mt-3 space-y-1 text-xs font-normal text-gray12">
                    <PasswordConditionItem
                      ok={hasMinLength}
                      text="حداقل دارای ۸ کاراکتر"
                      password={newPasswordValue}
                    />
                    <PasswordConditionItem
                      ok={hasLowerAndUpper}
                      text="حداقل یک حرف کوچک و بزرگ"
                      password={newPasswordValue}
                    />
                    <PasswordConditionItem
                      ok={hasNumber}
                      text="حداقل یک عدد"
                      password={newPasswordValue}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !isValid}
                    className={`
                      w-full h-[48px] rounded-xl lg:mt-14 mt-12  font-bold text-lg 
                      transition-all duration-200 ease-in-out text-white2
                   ${isSubmitting || !isValid ? "bg-gray24 " : "bg-blue2"}
                  `}
                  >
                    {isSubmitting ? "در حال تغییر..." : "تغییر رمز عبور"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </HeaderLayout>
    </>
  );
}
