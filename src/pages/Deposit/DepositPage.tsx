import { useState } from "react";
import HeaderLayout from "../../layouts/HeaderLayout";
import DepositLayout from "./DepositLayout";
import IconVideo from "../../assets/Icons/Deposit/IconVideo";
import IconBank from "../../assets/Icons/Deposit/IconBank";
import IconConvertCard from "../../assets/Icons/Deposit/IconConvertCard";
import IconMoneyTime from "../../assets/Icons/Deposit/IconMoneyTime";
import IconWallet from "../../assets/Icons/Deposit/Iconwallet";
import IconLink from "../../assets/Icons/Deposit/IconLink";
import IconArrowRight from "../../assets/Icons/Deposit/IconArrowRight";

export default function DepositPage() {
  const [step, setStep] = useState<number>(1); // گام فعلی
  const [selectedOption, setSelectedOption] = useState<string>(""); // گزینه انتخاب‌شده از بخش راست
  const [started, setStarted] = useState<boolean>(false);

  const handleStart = () => {
    setStarted(true);
  };

  // گزینه‌های ثابت بخش راست
  const rightOptions = [
    {
      id: "closeDeal",
      Icon: <IconBank />,
      Title: "واریز با درگاه پرداخت",
      description: "واریز حداکثر تا 25 ملیون تومان",
      button: "پرداخت در لحضه",
      IconMore: <IconArrowRight />,
    },
    {
      id: "goodTrip",
      Icon: <IconConvertCard />,
      Title: "واریز با فیش کارت به کارت  ",
      description: "واریز تا سقف 10 ملیون تومان",
      button: "پرداخت در 20 دقیقه",
      IconMore: <IconArrowRight />,
    },
    {
      id: "goto",
      Icon: <IconMoneyTime />,
      Title: "واریز خودکار",
      description: "واریز مداوم با دسترسی تا 25 ملیون تومان",
      button: "پرداخت در لحضه",
      IconMore: <IconArrowRight />,
    },
    {
      id: "trade",
      Icon: <IconWallet />,
      Title: "واریز با ولت اختصاصی",
      description: "بدون نیاز به TxID , واریز خودکار و سریع",
      button: "",
      IconMore: <IconArrowRight />,
    },
    {
      // id: "trade",
      Icon: <IconLink />,
      Title: "واریز با TxID",
      description: "برای واریز از صرافی با کیف پول دیگر",
      button: "",
      IconMore: <IconArrowRight />,
    },
  ];

  const renderStep = () => {
    switch (selectedOption) {
      case "closeDeal":
        return (
          <div className="w-full bg-orange-200 px-7" dir="rtl">
            <div className="bg-blue14 text-blue2 flex items-center p-3 rounded-lg gap-2">
              <span className="icon-wrapper w-6 h-6 text-blue2">
                <IconVideo />
              </span>
              <span>ویدیو آموزشی واریز با درگاه پرداخت</span>
            </div>
            {/* یه اینپوت باید بزارم اینجا یادت نره */}
            <p className="text-gray12 text-sm">
              میزان واریزی حداقل 25 هزار تومان و حداکثر تا سقف 25 میلیون تومان{" "}
            </p>
            <div className="flex gap-2 items-center">
              <button className="border border-gray12 rounded-lg px-7 py-2 text-gray12 text-sm">
                5 میلیون
              </button>
              <button className="border border-gray12 rounded-lg px-7 py-2 text-gray12 text-sm">
                10 میلیون
              </button>
              <button className="border border-gray12 rounded-lg px-7 py-2 text-gray12 text-sm">
                20 میلیون
              </button>
              <button className="border border-gray12 rounded-lg px-7 py-2 text-gray12 text-sm">
                50 میلیون
              </button>
            </div>
            <div className="mt-16">
              <button className="text-white2 bg-blue2 w-full py-3 font-bold text-lg rounded-lg">
                واریز
              </button>

              {/* <select className="w-full overflow-x-hidden" name="" id="">
                <option value="">راهنمای واریز با درگاه پرداخت</option>
                <option value="">
                  <ul className="w-full">
                    <li>از صحت آدرس صفحه‌ پرداخت و بودن در یکی از سایت‌های سامانه‌ی شاپرک مطمئن شوید. (صفحه درگاه الزاما .shaparak.ir باشد)</li>
                    <li></li>
                  </ul>
                </option>
              </select> */}
            </div>
          </div>
        );
      case "goodTrip":
        return (
          <div className="w-full">
            <h2>Good Trip Form</h2>
            <input
              placeholder="Enter trip details"
              className="w-full p-2 border"
            />
            <button className="mt-2 bg-blue-500 text-white p-2">Submit</button>
          </div>
        );
      case "goto":
        return (
          <div className="w-full">
            <h2>Goto Form</h2>
            <input
              placeholder="Enter destination"
              className="w-full p-2 border"
            />
            <button className="mt-2 bg-blue-500 text-white p-2">Submit</button>
          </div>
        );
      case "trade":
        return (
          <div className="w-full">
            {/* <h2>Trade Form</h2> */}
            <input
              placeholder="Enter trade amount"
              className="w-full p-2 border"
            />
            <button className="mt-2 bg-blue-500 text-whit p-2">Submit</button>
          </div>
        );
      default:
        return <div className="w-full">Select an option to start</div>;
    }
  };

  return (
    <>
      <HeaderLayout>
        <DepositLayout step={step} started={started} onStart={handleStart}>
          {/* بخش راست - ثابت */}
          <div className="w-full p-4 overflow-y-auto h-full lg:block hidden" dir="rtl">
            <span className="text-base text-black0  mb-4">واریز تومان</span>
            {rightOptions.slice(0, 3).map((option) => (
              <div
                key={option.id}
                className="p-2 cursor-pointer "
                onClick={() => setSelectedOption(option.id)}
              >
                <div className="flex items-center rounded-lg gap-2 justify-between border p-3 border-gray-19">
                  <div>
                    <div className="flex items-center gap-1">
                      <div className="bg-blue14 p-3 rounded-lg bg">
                        <span className="icon-wrapper w-7 h-7 text-blue2">
                          {option.Icon}
                        </span>
                      </div>
                      <div>
                        <h2 className="text-lg font-medium text-black0">
                          {option.Title}
                        </h2>
                        <p className="text-sm text-gray5">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="border text-gray5 border-gray26 p-2 rounded-lg">
                      {option.button}
                    </button>
                    <span className="icon-wrapper w-5 h-5 text-gray5">
                      {option.IconMore}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* بخش چپ - متغیر */}
          <div className="w-full  p-6">{renderStep()}</div>
        </DepositLayout>
      </HeaderLayout>
    </>
  );
}
