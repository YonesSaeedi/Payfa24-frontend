import React, { useState, useContext } from "react";
import IconAlert from "../assets/Icons/Login/IconAlert";
import IconGoogle from "../assets/Icons/Login/IconGoogle";
import { ThemeContext } from "../Context/ThemeContext";
import IconEyeOpen from "../assets/Icons/Login/IconEyeOpen";
import IconEyeClosed from "../assets/Icons/Login/IconEyeClosed";
import AuthLayout from "../layouts/AuthLayout";
import imageLoginDark from "../assets/Login ImageDark.png";
import imageLoginLight from "../assets/Login imageLight.png";
import TextField from "../Components/InputField/TextField";
import { Link, useNavigate } from "react-router-dom";
import IconClose from "../assets/Icons/Login/IconClose";
import IconAgain from "../assets/Icons/Login/IconAgain";
import OTPModal from "../Components/OTPModal";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

type LoginFormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("ThemeContext is undefined");
  const { theme } = context;

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [contactMethod, setContactMethod] = useState<"email" | "phone" | null>(
    null
  );

  const loginSchema = yup.object().shape({
    email: yup
      .string()
      .required("ایمیل یا شماره همراه الزامی است.")
      .test(
        "email-or-phone",
        "ایمیل یا شماره همراه وارد شده معتبر نیست.",
        (value) => {
          if (!value) return false;
          const isPhone = /^(09|\+989)\d{9}$/.test(value);
          const isEmail = yup.string().email().isValidSync(value);
          return isEmail || isPhone;
        }
      ),
    password: yup
      .string()
      .required("رمز عبور الزامی است.")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
        "رمز عبور معتبر نیست."
      ),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    getValues,
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    console.log("Submitted Data:", data);
    const isPhone = /^\d+$/.test(data.email);
    setContactMethod(isPhone ? "phone" : "email");
    setIsOpen(true);
  };

  return (
    <AuthLayout image={theme === "dark" ? imageLoginDark : imageLoginLight}>
      <div className="flex items-center justify-center " dir="rtl">
        <div className="w-full max-w-md px-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <h1 className="text-[28px] font-bold text-blue2 mb-2 text-center">
              ورود به پی‌فا24
            </h1>
            <p className="font-normal mb-10 lg:text-lg text-sm text-center text-black1">
              برای ورود ایمیل یا شماره همراه خود را وارد کنید
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
                />
              )}
            />

            <div className="sm:text-sm text-xs  font-normal pb-6 flex gap-1 items-end justify-start text-gray12 ">
              <span className="icon-wrapper h-4 w-4">
                <IconAlert />
              </span>
              <p>توجه داشته باشید که در دامنه (panel.payfa24.com) هستید.</p>
            </div>

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
                />
              )}
            />

            <Link to={"/forgot-password"}>
              <div className="flex justify-between items-center mb-10">
                <p className="text-gray12 text-sm font-normal">
                  رمز عبور خود را فراموش کرده‌اید؟
                </p>
                <span className="font-normal text-blue2 cursor-pointer text-[14px]">
                  بازیابی رمز عبور
                </span>
              </div>
            </Link>

            <button
              type="submit"
              className="w-full  h-[48px] rounded-xl bg-blue2
              text-white font-bold text-lg lg:bg-gray19"
            >
              ادامه
            </button>

            <p className="text-sm font-normal text-gray12 pt-3 pb-10 text-start">
              هنوز ثبت نام نکرده‌اید؟
              <span className="text-blue2 text-sm px-1 font-normal">
                <Link to={"/register"}>ساخت حساب کاربری</Link>
              </span>
            </p>

            <div className="flex items-center justify-center ">
              <div
                className={`flex-grow h-[1px] ${
                  theme === "dark" ? "bg-gray19" : "bg-gray19"
                }`}
              ></div>
              <p className="flex-none px-2 text-xs text-gray12">ورود با</p>
              <div
                className="flex-grow h-[1px] bg-gray19"
              ></div>
            </div>
            <button className="w-full  h-[46px] flex justify-center items-center gap-2 font-normal mt-4 mb-8 rounded-xl text-xs text-gray12 border border-gray12">
              <span className="icon-wrapper h-5 w-5">
                <IconGoogle />
              </span>
              اکانت گوگل
            </button>
          </form>
        </div>
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-45"></div>
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            onClick={() => {
              setIsOpen(false);
              console.log("Clicked outside, closing modal");
            }}
          >
            <div
              className="lg:w-[448px] w-[328px] rounded-lg lg:p-8 p-4 relative bg-white8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center flex-row-reverse justify-between">
                <h2
                  className="lg:text-lg text-sm lg:font-bold font-normal text-black0"
                 
                >
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
                  onChange={(code) => console.log("کد وارد شده:", code)}
                />
              </div>

              <div className="flex justify-between flex-row-reverse mb-4">
                <div className="flex gap-2 items-center ">
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
                <Link to={""}>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="mt-4 w-[200px] h-[48px] font-bold bg-blue2 text-white1 rounded-lg"
                  >
                    تایید
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </AuthLayout>
  );
}
