// import { useContext, useState } from "react";
// import { ThemeContext } from "../Context/ThemeContext";
// import StepInvite from "../Components/InviteLogin";
// import StepPassword from "../Components/PasswordInput";

// export default function RegisterForm() {
//   const context = useContext(ThemeContext);
//   if (!context) throw new Error("ThemeContext is undefined");
//   const { theme } = context;

//   const stepImages = {
//     1: {
//       light: require("../assets/invite-light.png"),
//       dark: require("../assets/invite-dark.png"),
//     },
//     2: {
//       light: require("../assets/password-light.png"),
//       dark: require("../assets/password-dark.png"),
//     },
//     3: {
//       light: require("../assets/phone-light.png"),
//       dark: require("../assets/phone-dark.png"),
//     },
//   };
//   const [step, setStep] = useState(1);
//   const currentImage = stepImages[step][theme];

//   return (
//     <div className="">
//       {step === 1 && <StepInvite onNext={() => setStep(2)} />}
//       {step === 2 && <StepPassword onBack={() => setStep(1)} />}
//     </div>
//   );
// }

import { useState, useContext } from "react";
import StepInvite from "../Components/InviteLogin";
import StepPassword from "../Components/PasswordInput";
import { ThemeContext } from "../Context/ThemeContext";

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
