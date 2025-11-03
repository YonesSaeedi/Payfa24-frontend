import  { useContext, useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router';
import TextField from '../components/InputField/TextField';
import PasswordConditionItem from '../components/InputField/PasswordConditionitem/PasswordConditionItem';
import IconEyeOpen from '../assets/icons/Login/IconEyeOpen';
import IconEyeClosed from '../assets/icons/Login/IconEyeClosed';
import { apiRequest } from '../utils/apiClient';
import { toast } from 'react-toastify';
import AuthLayout from '../layouts/AuthLayout';
import imageForgetDark from "../assets/imageForgetDark.png";
import imageForgetLight from "../assets/imageForgetLight.png";
import { ThemeContext } from "../context/ThemeContext";


interface ForgetPasswordResetResponse {
  status: boolean;
  msg?: string;
}
interface ForgetPasswordResetRequest {
  username: string;
  password: string;
  password_confirmation: string;
  tokenForget: string;
  [key: string]: string | number | boolean | Blob | File;
}

type PasswordFormData = {
  password: string;
  confirmPassword: string;
};

interface LocationState {
  username: string;
  tokenForget: string;
}

export default function ForgotPasswordPageSetPasswordPage() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("ThemeContext is undefined");
  const { theme } = context;

  const location = useLocation();
  const state = location.state as LocationState;
  const navigate = useNavigate();

  // --- همه هوک‌ها قبل از شرط ---
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit, control, watch, setError, formState: { errors } } = useForm<PasswordFormData>({
    defaultValues: { password: '', confirmPassword: '' },
    mode: 'onChange',
  });

  const passwordValue = watch('password');

  const hasMinLength = passwordValue.length >= 8;
  const hasLowerAndUpper = /[a-z]/.test(passwordValue) && /[A-Z]/.test(passwordValue);
  const hasNumber = /\d/.test(passwordValue);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_\-=\[\]\\\/'`~]/.test(passwordValue);


  const onSubmit: SubmitHandler<PasswordFormData> = async (data) => {
    if (!state?.username || !state?.tokenForget) return;

    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', { type: 'manual', message: 'رمز عبور و تکرار آن مطابقت ندارند' });
      return;
    }

    try {
      setIsLoading(true);

      const response = await apiRequest<ForgetPasswordResetResponse, ForgetPasswordResetRequest>({
        url: '/auth/forget/reset',
        method: 'POST',
        data: {
          username: state.username,
          password: data.password,
          password_confirmation: data.confirmPassword,
          tokenForget: state.tokenForget,
        },
      });

      if (response?.status === true) {
        toast.success('رمز عبور با موفقیت تغییر کرد.');
        navigate('/login');
      } else {
        toast.error(response?.msg || 'ثبت رمز عبور با مشکل مواجه شد.');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.msg || 'ثبت رمز عبور با مشکل مواجه شد.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- چک کردن state در render ---
  if (!state?.username || !state?.tokenForget) {
    return (
      <div className="flex items-center justify-center w-full h-screen" dir="rtl">
        <p className="text-red-500 text-lg">اطلاعات لازم برای تغییر رمز عبور موجود نیست.</p>
      </div>
    );
  }

  return (
    <AuthLayout image={theme === "dark" ? imageForgetDark : imageForgetLight}>
      <div className="flex items-center justify-center w-full" dir="rtl">
        <div className="w-full max-w-md py-10 px-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <h1 className="lg:text-[28px] text-[22px] font-bold text-blue2 mb-3 text-center">
              ایجاد رمز عبور
            </h1>
            <p className="font-normal lg:mb-10 mb-6 lg:text-[18px] text-[14px] text-center text-black1">
              رمز عبور برای حساب کاربری خود وارد کنید.
            </p>

            {/* ورودی رمز عبور */}
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  label="رمز عبور خود را وارد کنید"
                  type={showPassword ? 'text' : 'password'}
                  error={errors.password?.message}
                  icon={showPassword ? <IconEyeOpen /> : <IconEyeClosed />}
                  onIconClick={() => setShowPassword(prev => !prev)}
                  {...field}
                  labelBgClass="bg-white4"
                />
              )}
            />

            {/* ورودی تکرار رمز عبور */}
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  label="تکرار رمز عبور"
                  type={showPassword ? 'text' : 'password'}
                  error={errors.confirmPassword?.message}
                  icon={showPassword ? <IconEyeOpen /> : <IconEyeClosed />}
                  onIconClick={() => setShowPassword(prev => !prev)}
                  {...field}
                  labelBgClass="bg-white4"
                />
              )}
            />

            {/* شروط رمز عبور */}
            <div className="mt-3 space-y-1 text-xs font-normal text-gray5">
              <PasswordConditionItem ok={hasMinLength} text="حداقل دارای ۸ کاراکتر" password={passwordValue} />
              <PasswordConditionItem ok={hasLowerAndUpper} text="حداقل یک حرف کوچک و بزرگ" password={passwordValue} />
              <PasswordConditionItem ok={hasNumber} text="حداقل یک عدد" password={passwordValue} />
              <PasswordConditionItem ok={hasSpecialChar} text="حداقل یک کاراکتر خاص" password={passwordValue} />

            </div>

            {/* دکمه ارسال */}
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
    </AuthLayout>
  );
}
