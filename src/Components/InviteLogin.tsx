import React, { useState, useContext } from "react";
import { ThemeContext } from "../Context/ThemeContext";
import TextField from "../Components/InputField/TextField";
import IconAlert from "../assets/Icons/Login/IconAlert";
import IconGoogle from "../assets/Icons/Login/IconGoogle";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

type StepInviteFormData = {
  email: string;
  inviteCode: string;
};

const stepInviteSchema = yup.object().shape({
  email: yup
    .string()
    .required("ایمیل یا شماره همراه الزامی است.")
    .test(
      "email-or-phone",
      "فرمت ایمیل یا شماره همراه معتبر نیست.",
      (value) => {
        if (!value) return false;
        const isEmail = yup.string().email().isValidSync(value);
        const isPhone = /^(09|\+989)\d{9}$/.test(value);
        return isEmail || isPhone;
      }
    ),
  inviteCode: yup.string().when((val, schema) => {
    if (val[0]) {
      return schema.required("کد دعوت الزامی است.");
    }
    return schema.notRequired();
  }),
});

export default function StepInvite({ onNext }) {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("ThemeContext is undefined");
  const { theme } = context;

  const [hasInviteCode, setHasInviteCode] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<StepInviteFormData>({
    resolver: yupResolver(stepInviteSchema),
    defaultValues: {
      email: "",
      inviteCode: "",
    },
  });

  const onSubmit = (data: StepInviteFormData) => {
    console.log("Submitted Data:", data);
    onNext();
  };

  const switchClass = (isChecked: boolean, theme: string) =>
    `w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300
   ${isChecked ? "bg-blue2" : theme === "dark" ? "bg-gray19" : "bg-gray19"}`;

  const knobClass = (isChecked) =>
    `bg-white1 w-4 h-4 rounded-full shadow-md transform transition-transform duration-300
    ${isChecked ? "translate-x-[-25px]" : "translate-x-0"}`;

  return (
    <div className="flex items-center justify-center w-2/3 px-10">
      <div className="w-full  px-4 flex items-center justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          dir="rtl"
          className="w-full mx-auto"
        >
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

          <div className="w-full text-gray12 sm:text-sm text-xs  font-normal flex gap-1 items-end justify-end flex-row-reverse mt-2 mb-6 ">
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
                className={switchClass(hasInviteCode, theme)}
                onClick={() => setHasInviteCode((prev) => !prev)}
              >
                <div className={knobClass(hasInviteCode)}></div>
              </div>
            </div>

            {hasInviteCode && (
              <Controller
                name="inviteCode"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="کد دعوت"
                    error={errors.inviteCode?.message}
                    {...field}
                  />
                )}
              />
            )}
          </div>

          <button
            type="submit"
            className="w-full h-[48px] rounded-xl mt-10 bg-blue2 text-white2 font-bold text-lg"
          >
            ادامه
          </button>

          <p className="text-sm font-normal text-gray12 mt-3 mb-10 text-start">
            حساب کاربری دارید؟
            <span className="text-blue2 text-sm px-1 font-normal">
              <a href="#">ورود به حساب</a>
            </span>
          </p>

          <div className="flex items-center justify-center ">
            <div className="flex-grow h-[1px] bg-gray19"></div>
            <p className="flex-none px-2 text-xs text-gray12">ورود با</p>
            <div
              className="flex-grow h-[1px] bg-gray19"
            ></div>
          </div>
          <button className="lg:w-full w-[343px] h-[46px] flex justify-center items-center gap-2 font-normal mt-4 mb-8 rounded-xl text-xs text-gray12 border border-gray12">
            <span className="icon-wrapper h-5 w-5">
              <IconGoogle />
            </span>
            اکانت گوگل
          </button>
        </form>
      </div>
    </div>
  );
}
