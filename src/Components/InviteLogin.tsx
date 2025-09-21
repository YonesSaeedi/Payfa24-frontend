import React, { useState, useContext, useEffect } from "react";
import { ThemeContext } from "../Context/ThemeContext";
import TextField from "../Components/InputField/TextField";
import IconAlert from "../assets/Icons/Login/IconAlert";
import IconGoogle from "../assets/Icons/Login/IconGoogle";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { apiRequest } from "../utils/apiClient";
import { Link } from "react-router-dom";
import IconAgain from "../assets/Icons/Login/IconAgain";
import OTPModal from "./OTPModal";
import IconClose from "../assets/Icons/Login/IconClose";
import { getStepInviteSchema } from "../utils/validationSchemas"; 
import { toast } from "react-toastify";

interface RegisterResponse {
  status: boolean;
  access_token: string;
  expires_in: number;
  msg?: string;
  refresh_token: string;
  [key: string]: unknown;
}
interface CheckResponse {
  status: boolean;
  msg?: string;
  [key: string]: unknown;
}

type StepInviteFormData = {
  email: string;
  inviteCode: string;
};

export default function StepInvite({ onNext }) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const context = useContext(ThemeContext);
  if (!context) throw new Error("ThemeContext is undefined");
  const { theme } = context;
  const { executeRecaptcha } = useGoogleReCaptcha()
  const [isOpen, setIsOpen] = useState(false);
  const [hasInviteCode, setHasInviteCode] = useState(false);
  const [contactMethod, setContactMethod] = useState<'phone' | 'email' | null>(null);
  const [otpCode, setOtpCode] = useState<string>("");
  const [isOtpError, setIsOtpError] = useState<boolean>(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
    getValues,
  } = useForm<StepInviteFormData>({
    resolver: yupResolver(getStepInviteSchema()),
    defaultValues: {
      email: "",

  
    },
  });
  // submits the entered mobile/email; and opens the code verification modal ===========================================================================
  const onSubmit = async (data: StepInviteFormData) => {
    if (!executeRecaptcha) return;
    try {
      setIsLoading(true)
      const recaptchaToken = await executeRecaptcha('register')
      const value = data.email.trim()
      const payload: Record<string, string> = { recaptcha: recaptchaToken }
      if (/^\d+$/.test(value)) {
        payload.mobile = value;
        setContactMethod('phone');
      } else {
        payload.email = value;
        setContactMethod('email');
      }
      const response = await apiRequest<RegisterResponse, Record<string, string>>({ url: '/api/auth/register', method: "POST", data: payload })
      console.log("Submitted Data:", payload);
      console.log('register api response => ', response)
      if (response?.status === true) {
        localStorage.setItem('accessToken', response?.access_token);
        localStorage.setItem('refreshToken', response?.refresh_token);
        localStorage.setItem('expiresAt', response?.expires_in.toString())
      }
      setIsOpen(true)
    } catch (err: any) {
      toast.error(err?.response?.data?.msg || err?.response?.data?.message || 'در ثبت اطلاعات مشکلی پیش آمد.')
    } finally {
      setIsLoading(false)
    }
  }
  // handles otp change ===============================================================================================================================
  const handleOtpChange = (code: string) => {
    setOtpCode(code);
    setIsOtpError(false);
  };
  // handles otp confirm ==============================================================================================================================
  const handleConfirm = async () => {
    if (otpCode.length === 5) {
      const response: CheckResponse = await apiRequest<CheckResponse, Record<string, string>>({ url: '/api/auth/register/check', method: 'POST', data: { 'code': otpCode } })
      console.log('otp check response => ', response)
      if (response?.status === true) {
        toast.success('حساب شما با موفقیت ایجاد شد.')
        onNext()
      } else {
        toast.error(response?.msg || 'در تایید کد مشکلی به وجود آمد.')
      }
    }
  };
  const switchClass = (isChecked: boolean, theme: string) =>
    `w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300
    ${isChecked ? "bg-blue2" : theme === "dark" ? "bg-gray19" : "bg-gray19"}`;

  const knobClass = (isChecked: boolean) =>
    `bg-white1 w-4 h-4 rounded-full shadow-md transform transition-transform duration-300
    ${isChecked ? "translate-x-6" : "translate-x-0"}`;

  return (
    <div className="flex items-center justify-center w-full lg:w-3/4 lg:px-16">
      <div className="w-full px-4 flex items-center justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          dir="rtl"
          className="w-full mx-auto"
        >
          <h1 className="text-[28px] font-bold text-blue2 mb-2 text-center">
            ثبت نام در پی‌فا24
          </h1>
          <p className="font-normal mb-10 lg:text-lg text-sm text-center text-black1">
            برای ثبت نام ایمیل یا شماره همراه خود را وارد کنید
          </p>

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                label="ایمیل یا شماره همراه"
                type="text"
                error={errors.email?.message}
                {...field}
                labelBgClass="bg-white4"
              />
            )}
          />

          <div className="w-full text-gray12 sm:text-sm text-xs font-normal flex gap-1 items-end justify-end flex-row-reverse mt-2 mb-6">
            <p>توجه داشته باشید که در دامنه (panel.payfa24.com) هستید.</p>
            <span className="icon-wrapper h-4 w-4">
              <IconAlert />
            </span>
          </div>

          <div
            className="text-blue2 flex flex-col gap-2 w-full items-center"
            dir="rtl"
          >
            <div className="flex justify-between w-full text-sm font-normal mb-3">
              <span>کد دعوت دارید؟</span>
              <div
                dir="ltr"
                className={switchClass(hasInviteCode, theme)}
                onClick={() => setHasInviteCode((prev) => !prev)}
              >
                <div className={knobClass(hasInviteCode)}></div>
              </div>
            </div>

            {hasInviteCode && (
              <div className="flex flex-col w-full ">
                <Controller
                  name="inviteCode"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="کد دعوت"
                      error={errors.inviteCode?.message}
                      {...field}
                      labelBgClass="bg-white4"
                    />
                  )}
                />
                {errors.inviteCode && (
                  <p className="text-sm font-normal text-red1 mt-2 text-right">
                    {errors.inviteCode.message}
                  </p>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full h-[48px] rounded-xl mt-10 bg-blue2 text-white2 font-bold text-lg"
            disabled={!executeRecaptcha || isLoading}
          >
            {isLoading ? 'در حال ارسال ...' : 'ادامه'}
          </button>

          <p className="text-sm font-normal text-gray12 mt-3 mb-10 text-start">
            حساب کاربری دارید؟
            <span className="text-blue2 text-sm px-1 font-normal">
              <Link to="#">ورود به حساب</Link>
            </span>
          </p>

          <div className="flex items-center justify-center">
            <div className="flex-grow h-[1px] bg-gray19"></div>
            <p className="flex-none px-2 text-xs text-gray12">ورود با</p>
            <div className="flex-grow h-[1px] bg-gray19"></div>
          </div>
          <button className="w-full h-[46px] flex justify-center items-center gap-2 font-normal mt-4 mb-8 rounded-xl text-xs text-gray12 border border-gray12">
            <span className="icon-wrapper h-5 w-5">
              <IconGoogle />
            </span>
            اکانت گوگل
          </button>
        </form>

        {isOpen && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-45"></div>
            <div
              className="fixed inset-0 flex items-center justify-center z-50"
              onClick={() => setIsOpen(false)}
            >
              <div
                className="lg:w-[448px] w-[328px] rounded-lg lg:p-8 p-4 relative bg-white8"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center flex-row-reverse justify-between">
                  <h2 className="lg:text-lg text-sm lg:font-bold font-normal text-black0">
                    {contactMethod === "phone"
                      ? "تایید شماره همراه"
                      : "تایید ایمیل"}
                  </h2>
                  <span
                    className="icon-wrapper h-6 w-6 cursor-pointer"
                    onClick={() => setIsOpen(false)}
                  >
                    <IconClose />
                  </span>
                </div>

                <p
                  className="lg:mt-12 mt-8 mb-6 lg:text-lg text-sm text-center text-gray24"
                  dir="rtl"
                >
                  لطفا کد ارسالی به{" "}
                  {contactMethod === "phone"
                    ? `شماره ${getValues("email")}`
                    : `ایمیل ${getValues("email")}`}{" "}
                  را وارد کنید.
                </p>

                <div className="mt-[32px] mb-[48px]">
                  <OTPModal
                    length={5}
                    onChange={handleOtpChange}
                  />
                </div>

                <div className="flex justify-between flex-row-reverse mb-4">
                  <div className="flex gap-2 items-center">
                    <span className="text-gray12">ارسال مجدد</span>
                    <span className="icon-wrapper h-5 w-5 cursor-pointer">
                      <IconAgain />
                    </span>
                  </div>
                  <p className="text-gray12">ارسال مجدد کد تا 2:30</p>
                </div>
                <div className="flex gap-2 mb-8">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="mt-4 w-[180px] h-[48px] border border-blue2 rounded-lg text-blue2 text-sm lg:text-medium"
                  >
                    ویرایش ایمیل
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={otpCode.length < 5}
                    className={`mt-4 w-[200px] h-[48px] font-bold text-white2 rounded-lg transition-colors duration-300
                      ${otpCode.length < 5 ? "bg-gray5 cursor-not-allowed" : "bg-blue2"}`}
                  >
                    تایید
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}