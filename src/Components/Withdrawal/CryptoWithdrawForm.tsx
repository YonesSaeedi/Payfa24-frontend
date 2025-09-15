import { useState } from "react";
import FloatingSelect from "../FloatingInput/FloatingSelect";
import FloatingInput from "../FloatingInput/FloatingInput";
import IconVideo from "../../assets/icons/Withdrawal/IconVideo";

export default function CryptoWithdrawForm() {
  const [network, setNetwork] = useState("");
  const [crypto, setCrypto] = useState("");
  return (
    <form className="p-8 rounded-xl shadow-sm bg-gray44 flex flex-col justify-between h-[644px]">
      {/* بخش بالایی (فیلدها) */}
      <div>
        {/* ویدیو آموزشی */}
        <div dir="rtl" className="mb-6 bg-blue14 py-4 px-4 rounded-[8px] flex">
          <span className="w-6 h-6 icon-wrapper ml-2">
            <IconVideo />
          </span>
          <h2 className="font-normal text-blue2">
            ویدیو آموزشی برداشت رمز ارز
          </h2>
        </div>

        {/* انتخاب رمز ارز */}
        <div dir="rtl" className="mb-6">
          <FloatingSelect
            label="انتخاب رمز ارز"
            value={crypto}
            onChange={(val) => setCrypto(val)}
            options={[
              { value: "mos", label: "مونوس" },
              { value: "usdt", label: "تتر" },
              { value: "btc", label: "بیت‌کوین" },
            ]}
          />
        </div>

        {/* انتخاب شبکه */}
        <div dir="rtl" className="mb-6">
          <FloatingSelect
            label="شبکه برداشت"
            value={network}
            onChange={(val) => setNetwork(val)}
            options={[
              { value: "trc20", label: "ترون (TRC20)" },
              { value: "erc20", label: "اتریوم (ERC20)" },
            ]}
          />
        </div>

        {/* ✅ فقط وقتی شبکه انتخاب بشه اینا نشون داده می‌شن */}
        {network && (
          <>
            {/* آدرس مقصد */}
            <div dir="rtl" className="mb-6">
              <FloatingInput
                label="آدرس تتر مقصد"
                value=""
                onChange={() => {}}
                type="text"
              />
            </div>

            {/* مقدار برداشت */}
            <div dir="rtl" className="mb-4">
              <FloatingInput
                label="مقدار برداشت"
                value=""
                onChange={() => {}}
                type="number"
              />
              <div className="flex justify-between pt-2">
                <p className="text-xs text-gray-500 mt-1">
                  کل موجودی: 34.000 MOS
                </p>
                <button
                  type="button"
                  className="text-blue-500 text-xs mt-1"
                  onClick={() => {
                    console.log("Set all balance");
                  }}
                >
                  همه موجودی
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* دکمه تایید */}
      <div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg"
        >
          تایید
        </button>
      </div>
    </form>
  );
}
