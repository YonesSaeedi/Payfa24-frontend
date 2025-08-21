// import React, { useState, useContext } from "react";
// import { ThemeContext } from "../Context/ThemeContext";
// import TextField from "../Components/InputField/TextField";
// import IconAlert from "../assets/Icons/Login/IconAlert";
// import IconGoogle from "../assets/Icons/Login/IconGoogle";

// export default function StepInvite({ onNext }) {
//   const context = useContext(ThemeContext);
//   if (!context) throw new Error("ThemeContext is undefined");
//   const { theme } = context;
//   const [email, setEmail] = useState<string>("");
//   const [emailFocused, setEmailFocused] = useState<boolean>(false);
//   const [emailError, setEmailError] = useState<boolean>(false);
//   const [inviteCode, setInviteCode] = useState("");
//   const [checked1, setChecked1] = useState(false);

//   const toggle = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
//     setter((prev) => !prev);
//   };

//   const switchClass = (isChecked: boolean) =>
//     `w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300
//     ${isChecked ? "bg-primary" : "bg-grey1"}`;

//   const knobClass = (isChecked: boolean) =>
//     `bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300
//     ${isChecked ? "translate-x-[-25px]" : "translate-x-0"}`;

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//   };

//   return (
//     <div className="flex items-center justify-center w-full">
//       <div className="w-full max-w-md px-4 flex items-center justify-center bg-neutral-400">
//         <form onSubmit={handleSubmit} dir="rtl">
//           <h1 className="text-[28px] font-bold text-primary mb-2 text-center">
//             ورود به پی‌فا24
//           </h1>
//           <p
//             className={`font-normal mb-10 text-[18px] text-center ${
//               theme === "dark" ? "text-[var(--text)]" : "--primary"
//             }`}
//           >
//             برای ورود ایمیل یا شماره همراه خود را وارد کنید
//           </p>

//           <TextField
//             label="ایمیل یا شماره همراه"
//             value={email}
//             onChange={(e) => {
//               setEmail(e.target.value);
//               if (e.target.value.trim()) setEmailError(false);
//             }}
//             error={emailError}
//             focused={emailFocused}
//             onFocus={() => {
//               setEmailFocused(true);
//               setEmailError(false);
//             }}
//             onBlur={() => setEmailFocused(false)}
//           />

//           <div className="w-full sm:text-sm text-xs text-[var(--text-gray)] font-normal flex gap-1 items-end justify-end flex-row-reverse  mt-2 mb-6" >
//             <p>توجه داشته باشید که در دامنه (panel.payfa24.com) هستید.</p>
//             <span className="icon-wrapper h-4 w-4">
//               <IconAlert />
//             </span>
//           </div>

//           <div
//             className="text-[--primary] flex flex-col gap-2 w-full items-center"
//             dir="rtl"
//           >
//             <div className="flex justify-between w-full text-sm font-normal mb-3">
//               <span>کد دعوت دارید؟</span>
//               <div
//                 className={switchClass(checked1)}
//                 onClick={() => toggle(setChecked1)}
//               >
//                 <div className={knobClass(checked1)}></div>
//               </div>
//             </div>

//             {checked1 && (
//               <TextField
//                 label="کد دعوت"
//                 value={inviteCode}
//                 onChange={(e) => setInviteCode(e.target.value)}
//               />
//             )}
//           </div>


//           <button
//             type="submit"
//             className="lg:w-full max-w-md h-[48px] rounded-xl mx-auto mt-10 bg-primary text-white font-bold text-lg "
//           >
//             ادامه
//           </button>

//           <p className="text-sm font-normal text-[var(--text-gray)] mt-3 mb-10 text-start ">
//             حساب کاربری دارید؟
//             <span className="text-primary text-sm px-1 font-normal">
//               <a href="#">ورود به حساب</a>
//             </span>
//           </p>

//           <div className="flex items-center justify-center">
//             <div className="flex-grow h-[1px] bg-[var(--border-secondary)]"></div>
//             <p className="flex-none px-2 text-xs text-[var(--text-gray)]">
//               ورود با
//             </p>
//             <div className="flex-grow h-[1px] bg-[var(--border-secondary)]"></div>
//           </div>
//           <button className="lg:w-full w-[343px] h-[46px] flex justify-center items-center gap-2 font-normal mt-4 mb-8 rounded-xl text-xs text-[#8792AF] border border-[#D1D9F0]">
//             <span className="icon-wrapper h-5 w-5">
//               <IconGoogle />
//             </span>
//             اکانت گوگل
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }


import React, { useState, useContext } from "react";
import { ThemeContext } from "../Context/ThemeContext";
import TextField from "../Components/InputField/TextField";
import IconAlert from "../assets/Icons/Login/IconAlert";
import IconGoogle from "../assets/Icons/Login/IconGoogle";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// ---
// 1. تعریف نوع داده‌های فرم
type StepInviteFormData = {
  email: string;
  inviteCode: string;
};

// 2. تعریف Schema برای اعتبارسنجی با Yup
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
  inviteCode: yup
    .string()
    // شرطی کردن فیلد کد دعوت
    .when((val, schema) => {
      // اگر مقدار inviteCode وجود داشت، الزامی می‌شود
      if (val[0]) {
        return schema.required("کد دعوت الزامی است.");
      }
      return schema.notRequired();
    }),
});

// ---
export default function StepInvite({ onNext }) {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("ThemeContext is undefined");
  const { theme } = context;

  const [hasInviteCode, setHasInviteCode] = useState(false);

  // 3. استفاده از useForm و yupResolver
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
    // اینجا می‌توانید عملیات ارسال اطلاعات به سرور را انجام دهید
    onNext();
  };

  const switchClass = (isChecked) =>
    `w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300
    ${isChecked ? "bg-primary" : "bg-grey1"}`;

  const knobClass = (isChecked) =>
    `bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300
    ${isChecked ? "translate-x-[-25px]" : "translate-x-0"}`;

  return (
    <div className="flex items-center justify-center w-full">
      <div className="w-full max-w-[392px] px-4 flex items-center justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          dir="rtl"
          className="w-full sm:w-[343px] md:w-[343px] lg:w-[392px] mx-auto"
        >
          <h1 className="text-[28px] font-bold text-primary mb-2 text-center">
            ورود به پی‌فا24
          </h1>
          <p
            className={`font-normal mb-10 text-[18px] text-center ${
              theme === "dark" ? "text-[var(--text)]" : "--primary"
            }`}
          >
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

          <div className="w-full sm:text-sm text-xs text-[var(--text-gray)] font-normal flex gap-1 items-end justify-end flex-row-reverse mt-2 mb-6">
            <p>توجه داشته باشید که در دامنه (panel.payfa24.com) هستید.</p>
            <span className="icon-wrapper h-4 w-4">
              <IconAlert />
            </span>
          </div>

          <div
            className="text-[--primary] flex flex-col gap-2 w-full items-center"
            dir="rtl"
          >
            <div className="flex justify-between w-full text-sm font-normal mb-3">
              <span>کد دعوت دارید؟</span>
              <div
                className={switchClass(hasInviteCode)}
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
            className="w-full h-[48px] rounded-xl mt-10 bg-primary text-white font-bold text-lg"
          >
            ادامه
          </button>

          <p className="text-sm font-normal text-[var(--text-gray)] mt-3 mb-10 text-start">
            حساب کاربری دارید؟
            <span className="text-primary text-sm px-1 font-normal">
              <a href="#">ورود به حساب</a>
            </span>
          </p>

          <div className="flex items-center justify-center w-full">
            <div className="flex-grow h-[1px] bg-[var(--border-secondary)]"></div>
            <p className="flex-none px-2 text-xs text-[var(--text-gray)]">
              ورود با
            </p>
            <div className="flex-grow h-[1px] bg-[var(--border-secondary)]"></div>
          </div>
          <button
            className="w-full h-[46px] flex justify-center items-center gap-2 font-normal mt-4 mb-8 rounded-xl text-xs text-[#8792AF] border border-[#D1D9F0]"
          >
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