import { useState, useContext } from "react";
import AuthLayout from "../layouts/AuthLayout";
import StepInvite from "../Components/InviteLogin";
import StepPassword from "../Components/PasswordInput";
import { ThemeContext } from "../Context/ThemeContext";
import inviteLight from "../assets/InviteLight.png"
import inviteDark from "../assets/InviteDark.png"
import passwordLight from "../assets/CreatePasswordLight.png"
import passwordDark from "../assets/createpasswordDark.png"

const steps = [
  { component: StepInvite, light: inviteLight, dark: inviteDark },
  { component: StepPassword, light: passwordLight, dark: passwordDark },
];

export default function RegisterPage() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("ThemeContext is undefined");
  const { theme } = context;
  const [step, setStep] = useState(1);

  const currentStepIndex = step - 1;
  const StepComponent = steps[currentStepIndex]?.component;
  const currentImage =
    theme === "dark"
      ? steps[currentStepIndex]?.dark
      : steps[currentStepIndex]?.light;

  if (!StepComponent) {
    return <div>Invalid step</div>;
  }

  return (
    <AuthLayout image={currentImage}>
      <StepComponent
        onNext={() => {
          if (currentStepIndex < steps.length - 1) {
            setStep(step + 1);
          }
        }}
        // onBack={() => {
        //   if (step > 1) {
        //     setStep(step - 1);
        //   }
        // }}
      />
    </AuthLayout>
  );
}
