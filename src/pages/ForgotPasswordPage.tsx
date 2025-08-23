import AuthLayout from "../layouts/AuthLayout";
import imageForgetDark from "../assets/imageForgetDark.png";
import imageForgetLight from "../assets/imageForgetLight.png";
import { ThemeContext } from "../Context/ThemeContext";
import { useContext } from "react";
import TextField from "../Components/InputField/TextField";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

type FormData = {
  email: string;
};

export default function ForgotPasswordPage() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("ThemeContext is undefined");
  const { theme } = context;

  const navigate = useNavigate();

  const schema = yup.object().shape({
    email: yup
      .string()
      .required("لطفا ایمیل یا شماره همراه خود را وارد کنید.")
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
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: FormData) => {
    console.log("Submitted Data:", data);
    navigate("/register");
  };

  return (
    <AuthLayout image={theme === "dark" ? imageForgetDark : imageForgetLight}>
      <div className="flex items-center justify-center pb-8 " dir="rtl">
        <div className="w-full ">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex items-center flex-col"
          >
            <h1 className="lg:text-[28px] text-[20px] font-bold text-blue2 mb-3 text-center">
              فراموشی رمز عبور
            </h1>
            <p
              className={`font-normal lg:mb-10 mb-6 lg:text-[18px] text-[14px] ${
                theme === "dark"
                  ? "text-black1"
                  : "text-black1"
              }`}
            >
              برای بازیابی رمز عبور ایمیل یا شماره همراه خود را وارد کنید
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

            <button
              type="submit"
              className="h-[48px] lg:w-[392px] w-[343px] rounded-xl bg-blue2 lg:mt-14 mt-12 text-white font-bold text-lg"
            >
              ادامه
            </button>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}
