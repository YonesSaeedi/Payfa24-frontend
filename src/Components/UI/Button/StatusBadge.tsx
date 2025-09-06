import React from "react";
import {  Hourglass } from "lucide-react";
import IconComplete from "../../../assets/icons/StatusBadge/IconButtomComplete"
import IconButtonReject from "../../../assets/icons/StatusBadge/IconButtonReject";
import IconButtonOnHold from "../../../assets/icons/StatusBadge/IconButtonOnHold";
interface StatusBadgeProps {
  text: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ text }) => {
  const statusConfig: Record<
    string,
    { textColor: string; bgColor: string; icon: React.ReactNode }
  > = {
    "پاسخ داده شده": {
      textColor: "text-green-600",
      bgColor: "bg-green8",
      icon:  <span className="w-4 h-4 icon-wrapper"><IconComplete/></span>,
    },
    "انجام شده": {
      textColor: "text-green-600",
      bgColor: "bg-green8",
      icon:<span className="w-4 h-4 icon-wrapper"><IconComplete/></span>,
    },
    "بسته شده": {
      textColor: "text-red1",
      bgColor: "bg-red6",
      icon:<span className="w-4 h-4 icon-wrapper"><IconButtonReject/></span>,
    },
     "رد شده": {
      textColor: "text-red1",
      bgColor: "bg-red6",
      icon:<span className="w-4 h-4 icon-wrapper"><IconButtonReject/></span>,
    },
    "در حال بررسی": {
      textColor: "text-orange1",
      bgColor: "bg-orange4",
      icon: <span className="w-4 h-4 icon-wrapper"><IconButtonOnHold/></span>,
    },
  };

  const status =
    statusConfig[text] || {
      textColor: "text-gray-600",
      bgColor: "bg-gray-100",
      icon: <Hourglass className="w-5 h-5 text-gray-600" />,
    };

  return (
    <div
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-[4px] ${status.bgColor}`}
    >
        {status.icon}
      <span className={`text-sm   ${status.textColor}`}>{text}</span>
      
    </div>
  );
};

export default StatusBadge;
