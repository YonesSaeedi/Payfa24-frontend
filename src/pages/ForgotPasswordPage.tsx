import AuthLayout from "../layouts/AuthLayout";
import imageForgetDark from "../assets/imageForgetDark.png";
import imageForgetLight from "../assets/imageForgetLight.png";
import { ThemeContext } from "../Context/ThemeContext";
import { useContext, useState } from "react";
import TextField from "../Components/InputField/TextField";
import { useNavigate } from "react-router-dom"; 

export default function ForgotPasswordPage() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("ThemeContext is undefined");
  const { theme } = context;
  const navigate = useNavigate(); 

  const [email, setEmail] = useState<string>("");
  const [emailFocused, setEmailFocused] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailIsEmpty = !email.trim();
    setEmailError(emailIsEmpty);

    if (!emailIsEmpty) {
      console.log("Submitted Email:", email);
      navigate('/password-input'); 
    }
  };

  return (
    <AuthLayout image={theme === "dark" ? imageForgetDark : imageForgetLight}>
      <div className="flex items-center justify-center " dir="rtl">
        <div className="w-full  py-10 max-w-md px-0">
          <form onSubmit={handleSubmit} className="flex  items-center flex-col">
            <h1 className="lg:text-[28px] text-[20px] font-bold text-primary mb-3 text-center">
              فراموشی رمز عبور
            </h1>
            <p
              className={`font-normal lg:mb-10 mb-6 lg:text-[18px] text-[14px]  ${
                theme === "dark" ? "text-[var(--text)]" : "text-[var(--text-black)]"
              }`}
            >
              برای بازیابی رمز عبور ایمیل یا شماره همراه خود را وارد کنید
            </p>

            <TextField
          
              label="ایمیل یا شماره همراه"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (e.target.value.trim()) setEmailError(false);
              }}
              error={emailError}
              focused={emailFocused}
              onFocus={() => {
                setEmailFocused(true);
                setEmailError(false);
              }}
              onBlur={() => setEmailFocused(false)}
            />

            <button
              type="submit" 
              className=" h-[48px] lg:w-[392px] w-[343px] rounded-xl bg-primary lg:mt-14 mt-12 text-white font-bold text-lg"
            >
              ادامه
            </button>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}

