import React from "react";
import IconDownloadApp from "../../../assets/icons/MultiFactor/IconDownloadApp";
import IconScanQRcode from "../../../assets/icons/MultiFactor/IconScanQRcode";
import IconSmsTracking from "../../../assets/icons/MultiFactor/IconSmsTracking";


interface Props {
  currentStep: number;
}

export default function Stepper({ currentStep }: Props) {
  const steps = [
    { label: "دانلود اپ", icon: <IconDownloadApp /> },
    { label: "اسکن QR", icon: <IconScanQRcode /> },
    { label: "کد تأیید", icon: <IconSmsTracking /> },
  ];

  return (
    <div className="flex items-center justify-center flex-row py-8 gap-2">
      {steps.map((item, index) => (
        <React.Fragment key={index}>
          <div className="flex flex-col items-center gap-1">
            <span
              className={`lg:w-9 lg:h-9 w-6 h-6 ${
                index === currentStep
                  ? "text-blue2"
                  : index < currentStep
                 ? "text-blue2"
                  : "text-gray12"
              }`}
            >
              {index < currentStep ? item.icon : item.icon}
            </span>
            <span
              className={`lg:text-lg text-xs ${
                index === currentStep
                  ? "text-blue2"
                  : index < currentStep
                  ? "text-blue2"
                  : "text-gray12"
              }`}
            >
              {item.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className="flex-none lg:w-24 w-12 h-0"
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
}