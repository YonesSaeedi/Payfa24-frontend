import { useState, useContext } from "react";
import StepInvite from "./InviteLogin";
import StepPassword from "./PasswordInput";
import { ThemeContext } from "../context/ThemeContext";

import inviteLight from "../assets/invite-light.png";
import inviteDark from "../assets/invite-dark.png";
import passwordLight from "../assets/password-light.png";
import passwordDark from "../assets/password-dark.png";

const stepImages = {
  1: { light: inviteLight, dark: inviteDark },
  2: { light: passwordLight, dark: passwordDark },
};

export default function RegisterForm() {
  const [step, setStep] = useState(1);
  const context = useContext(ThemeContext);
  if (!context) throw new Error("ThemeContext is undefined");
  const { theme } = context;

  const currentImage = stepImages[step][theme];

  return (
    <div className="register-form">
      {/* Optional: show step image above the form */}
      <img src={currentImage} alt="Step illustration" />
      {step === 1 && <StepInvite onNext={() => setStep(2)} />}
      {step === 2 && <StepPassword onBack={() => setStep(1)} />}
    </div>
  );
}
