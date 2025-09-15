import { useState } from "react";
import HeaderLayout from "../../layouts/HeaderLayout";
import DepositLayout from "./DepositLayout";
import IconVideo from "../../assets/Icons/Deposit/IconVideo";
import IconBank from "../../assets/Icons/Deposit/IconBank";
import IconConvertCard from "../../assets/Icons/Deposit/IconConvertCard";
import IconMoneyTime from "../../assets/Icons/Deposit/IconMoneyTime";
import IconWallet from "../../assets/Icons/Deposit/Iconwallet";
import IconLink from "../../assets/Icons/Deposit/IconLink";

export default function DepositPage() {
  const [step, setStep] = useState<number>(1); // گام فعلی
  const [selectedOption, setSelectedOption] = useState<string>(""); // گزینه انتخاب‌شده از بخش راست
  const [started, setStarted] = useState<boolean>(false);

  const handleStart = () => {
    setStarted(true);
  };

  // گزینه‌های ثابت بخش راست
  const rightOptions = [
    { id: "closeDeal",Icon:<IconBank/>,Title:'واریز با درگاه پرداخت',description:'واریز حداکثر تا 25 ملیون تومان',button:'پرداخت در لحضه',IconMore:'', label: "Close Deal" },
    { id: "goodTrip",Icon:<IconConvertCard/>,Title:'واریز با فیش کارت به کارت  ',description:'واریز تا سقف 10 ملیون تومان',button:'پرداخت در 20 دقیقه',IconMore:'', label: "Good Trip" },
    { id: "goto",Icon:<IconMoneyTime/>,Title:'واریز خودکار',description:'واریز مداوم با دسترسی تا 25 ملیون تومان',button:'پرداخت در لحضه',IconMore:'', label: "Goto" },
    { id: "trade",Icon:<IconWallet/>,Title:'واریز با ولت اختصاصی',description:'بدون نیاز به TxID , واریز خودکار و سریع',button:'',IconMore:'', label: "Trade" },
    { id: "trade",Icon:<IconLink/>,Title:'واریز با TxID',description:'برای واریز از صرافی با کیف پول دیگر',button:'',IconMore:'', label: "Trade" },
  ];

  // رندر محتوا بر اساس انتخاب
  const renderStep = () => {
    switch (selectedOption) {
      case "closeDeal":
        return (
          <div className="w-full">
            <h2>Close Deal Form</h2>
            <input
              placeholder="Enter deal amount"
              className="w-full p-2 border"
            />
            <button className="mt-2 bg-blue-500 text-white p-2">Submit</button>
            <div>
              <span>ویدیو آموزشی واریز با درگاه پرداخت</span>
              <span className="icon-wrapper w-6 h-6">
                <IconVideo />
              </span>
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
            <h2>Trade Form</h2>
            <input
              placeholder="Enter trade amount"
              className="w-full p-2 border"
            />
            <button className="mt-2 bg-blue-500 text-white p-2">Submit</button>
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
          <div className="w-full  bg-gray-500 p-4 overflow-y-auto h-full" dir="rtl">
            <span className="text-lg  mb-4">واریز تومان</span>
            {rightOptions.filter((option, index) => index < 3) // فقط 3 تا اول (ایندکس 0، 1، 2)
  .map((option) => (
    <div
      key={option.id}
      className="p-2 cursor-pointer rounded" // استایل اضافه شد
      onClick={() => setSelectedOption(option.id)}
    >
      {option.label}
      <div>
      <span className="icon-wrapper w-7 h-7">{option.Icon}</span> {/* آیکون رو رندر کن */}
        <div>
          <h2>{option.Title}</h2>
          <p>{option.description}</p>
        </div>
      </div>
    </div>
  ))}
          </div>
          {/* بخش چپ - متغیر */}
          <div className="w-full lg:w-1/2 p-6">{renderStep()}</div>
        </DepositLayout>
      </HeaderLayout>
    </>
  );
}
