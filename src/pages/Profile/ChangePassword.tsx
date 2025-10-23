import BreadcrumbNavigation from "../../components/BreadcrumbNavigation";
import HeaderLayout from "../../layouts/HeaderLayout";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ThemeContext } from "../../context/ThemeContext";
import TextField from "../../components/InputField/TextField";
import IconEyeOpen from "../../assets/icons/Login/IconEyeOpen";
import IconEyeClosed from "../../assets/icons/Login/IconEyeClosed";
import PasswordConditionItem from "../../components/InputField/PasswordConditionitem/PasswordConditionItem";
import { useState } from "react";
import { Link } from "react-router";
import { getChangePasswordSchema } from "../../utils/validationSchemas";

type ChangePasswordFormData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};


export default function ChangePassword() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const schema = getChangePasswordSchema();

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<ChangePasswordFormData>({
    resolver: yupResolver(schema),
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

  const onSubmit = (data: ChangePasswordFormData) => {
    console.log("Submitted Data:", data);
    // اینجا می‌تونی لاجیک ارسال به API رو بذاری
  };
  return (
    <>
      <HeaderLayout>
        <div className="container-style w-full pt-7 flex gap-10 flex-col">
          <BreadcrumbNavigation />
          <div className="lg:bg-gray9 bg-white1 w-full lg:shadow-[0_0_12px_0_rgba(0,0,0,0.16)] rounded-2xl pb-10">
            <div className="flex items-center justify-center w-full " dir="rtl">
              <div className="w-full max-w-lg lg:px-8  ">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <h1 className="text-black1 text-center lg:pt-20 lg:text-xl text-sm font-medium">
                    تغییر رمز عبور
                  </h1>
                  <p className="font-normal lg:mb-12  mb-8 pt-3 lg:text-base text-sm text-center text-gray5">
                    در این بخش رمزعبور حساب کاربری خود را تغییر دهید.
                  </p>
                  <div className="flex flex-col gap-8">
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
                          labelBgClass="lg:bg-gray9 bg-white1"
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
                          labelBgClass="lg:bg-gray9 bg-white1"
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
                          labelBgClass="lg:bg-gray9 bg-white1"
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
                  <Link to={'/MultiFactor'}>
                    <button
                      type="submit"
                      className="w-full h-[48px] rounded-xl bg-blue2 lg:mt-14 mt-12 text-white2 font-bold text-lg"
                    >
                      تغییر رمز عبور
                    </button>
                  </Link>
                </form>
              </div>
            </div>
          </div>
        </div>
      </HeaderLayout>
    </>
  );
}
