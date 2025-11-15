import React from "react";
import IconUserOctagon from "../../../assets/icons/authentication/IconUserOctagon";
import IconcardBank from "../../../assets/icons/authentication/IconcardBank";
import IdentyIcon from "../../../assets/icons/authentication/IdentyIcon";
import IconCheckmark from "../../../assets/icons/authentication/IconCheckmark";
import IconCardIdenty from "../../../assets/icons/authentication/IconCardIdenty";

type StepperProps = {
  currentStep: number;
  isAdvance?: boolean;
};

const StepperComponent: React.FC<StepperProps> = ({
  currentStep,
  isAdvance = false,
}) => {
  const steps = isAdvance
    ? [
        { label: "ثبت مدرک شناسایی", icon: <IconCardIdenty /> },
        { label: "تایید هویت", icon: <IdentyIcon /> },
      ]
    : [
        { label: "ثبت ایمیل", icon: <IdentyIcon /> },
        { label: "مشخصات فردی", icon: <IconUserOctagon /> },
        { label: "کارت بانکی", icon: <IconcardBank /> },
      ];

  return (
    <div className="flex w-full items-center justify-center flex-row-reverse py-8 gap-2">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className="flex flex-col items-center gap-1 ">
            {/* آیکون */}
            <span
              className={`lg:w-9 lg:h-9 w-6 h-6 icon-wrapper ${
                index === currentStep
                  ? "text-blue2"
                  : index < currentStep
                  ? "text-blue2"
                  : "text-gray12"
              }`}
            >
              {index < currentStep ? <IconCheckmark /> : step.icon}
            </span>

            {/* عنوان مرحله */}
            <span
              className={`lg:text-lg text-xs text-center ${
                index === currentStep
                  ? "text-blue2"
                  : index < currentStep
                  ? "text-blue2"
                  : "text-gray12"
              }`}
            >
              {step.label}
            </span>
          </div>

          {index < steps.length - 1 && (
            <div
              className="flex-none lg:w-32 w-12 h-0"
              style={{
                border: `2px dashed ${
                  index < currentStep ? "#0B60FF" : "#8792AF"
                }`,
              }}
            ></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepperComponent;
