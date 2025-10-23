import { useState } from "react";
import TextField from "../components/InputField/TextField";
import PasswordConditionItem from "../components/InputField/PasswordConditionitem/PasswordConditionItem";
import IconEyeOpen from "../assets/icons/Login/IconEyeOpen";
import IconEyeClosed from "../assets/icons/Login/IconEyeClosed";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { getChangePasswordSchema } from "../utils/validationSchemas"; 
import { apiRequest } from "../utils/apiClient";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

type PasswordFormData = {
  password: string;
};
interface SetPasswordResponse {
  status: boolean;
  msg: string;
}

export default function StepPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const navigate = useNavigate()

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<PasswordFormData>({
    resolver: yupResolver(getChangePasswordSchema()), 
    mode: "onChange",
    defaultValues: {
      password: "",
    },
  });

  const passwordValue = watch("password");

  const hasMinLength = passwordValue.length >= 8;
  const hasLowerAndUpper = /[a-z]/.test(passwordValue) && /[A-Z]/.test(passwordValue);
  const hasNumber = /\d/.test(passwordValue);
  // submits the entered password to the api ============================================================================================================
  const onSubmit = async (data: PasswordFormData) => {
    try {
      setIsLoading(true)
      const response: SetPasswordResponse = await apiRequest({ url: '/api/auth/register/set-password', method: 'POST', data: data })
      if (response?.status === true) {
        toast.success('با موفقیت وارد شدید.')
        navigate('/')
      } else {
        toast.error('ثبت رمز عبور با مشکل مواجه شد.')
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.msg || 'ثبت رمز عبور با مشکل مواجه شد.')
    }
    finally {
      setIsLoading(false)
    }
    console.log("Submitted Data:", data);
  };

  return (
    <div className="flex items-center justify-center w-full " dir="rtl">
      <div className="w-full max-w-md py-10 px-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1 className="lg:text-[28px] text-[22px] font-bold text-blue2 mb-3 text-center">
            ایجاد رمز عبور
          </h1>
          <p
            className="font-normal lg:mb-10 mb-6 lg:text-[18px] text-[14px] text-center text-black1"
          >
            رمز عبور برای حساب کاربری خود وارد کنید.
          </p>

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                label="رمز عبور خود را وارد کنید"
                type={showPassword ? "text" : "password"}
                error={errors.password?.message}
                icon={showPassword ? <IconEyeOpen /> : <IconEyeClosed />}
                onIconClick={() => setShowPassword((prev) => !prev)}
                {...field}
                labelBgClass="bg-white4"
              />
            )}
          />

          <div className="mt-3 space-y-1 text-xs font-normal text-gray5">
            <PasswordConditionItem
              ok={hasMinLength}
              text="حداقل دارای ۸ کاراکتر"
              password={passwordValue}
            />
            <PasswordConditionItem
              ok={hasLowerAndUpper}
              text="حداقل یک حرف کوچک و بزرگ"
              password={passwordValue}
            />
            <PasswordConditionItem
              ok={hasNumber}
              text="حداقل یک عدد"
              password={passwordValue}
            />
          </div>

          <button
            type="submit"
            className="w-full h-[48px] rounded-xl bg-blue2 lg:mt-14 mt-12 text-white2 font-bold text-lg"
            disabled={isLoading}
          >
            {isLoading ? 'در حال ارسال ...' : 'تایید'}
          </button>
        </form>
      </div>
    </div>
  );
}