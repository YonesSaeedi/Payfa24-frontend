import { useState } from "react";
import FloatingSelect from "../FloatingInput/FloatingSelect";
import FloatingInput from "../FloatingInput/FloatingInput";
import IconVideo from "../../assets/icons/Withdrawal/IconVideo";
import Accordion from "../Withdrawal/Accordion"; // 👈 اضافه کن

export default function CryptoWithdrawForm() {
  const [network, setNetwork] = useState("");
  const [crypto, setCrypto] = useState("");

  return (
    <form className="p-8 rounded-xl shadow-sm bg-gray44 flex flex-col justify-between h-[644px] overflow-y-auto">
      <div>
        {/* ویدیو آموزشی */}
        <div dir="rtl" className="mb-6 bg-blue14 py-4 px-4 rounded-[8px] flex">
          <span className="w-6 h-6 icon-wrapper ml-2">
            <IconVideo />
          </span>
          <h2 className="font-normal text-blue2">ویدیو آموزشی برداشت رمز ارز</h2>
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

        {/* فیلدها وقتی شبکه انتخاب شد */}
        {network && (
          <>
            <div dir="rtl" className="mb-6">
              <FloatingInput
                label="آدرس تتر مقصد"
                value=""
                onChange={() => {}}
                type="text"
              />
            </div>

            <div dir="rtl" className="mb-4">
              <FloatingInput
                label="مقدار برداشت"
                value=""
                onChange={() => {}}
                type="number"
              />
              <div className="flex justify-between pt-2">
                <p className="text-xs text-gray-500 mt-1">کل موجودی: 34.000 MOS</p>
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
        {/* راهنمای برداشت */}
      <div className="mt-6">
        <Accordion title="راهنمای برداشت رمز ارز">
          <ul className="list-disc pr-5 space-y-2 text-black1">
            <li>
              از برداشت مستقیم از آدرس خود به مقصد اکس‌چنچ‌های جهانی که در شروط استفاده از خدمات خود به کاربران ایرانی با محدودیت ساخته اند به ویژه اکسچنچ های آمریکایی، حتما از کیف پول شخصی و آدرس های یک بار مصرف و انتقال چند لایه بین آدرس های خود استفاده کنید.
            </li>
            <li>
         به دستور مقام قضایی فاصله بین واریز ریالی و برداشت رمز ارز بین 72 ساعت ممکن است طول بکشد.
            </li>
            <li>
         در صورتی که آدرس مقصد متعلق به کاربر پی فا 24  باشد. انتقال به صورت رایگان انجام خواهد شد .
            </li>
            <li>
            در صورت برداشت به آدرس های دفتر ، نیاز به ورود دو مرحله و استفاده از رمز یک بر مصرف نمیباشد.
            </li>
              <li>
            در تعیین شبکه برداشت دقت لازم را داشته باشید و از پشتیبانی کیف پول مقصد از شبکه انتخابی اطمینان حاصل کنید
            </li>
             <li>
            از برداشت مستقیم از آدرس خود به مقصد اکسچنچ‌های جهانی که در شروط استفاده از خدمات خود به کاربران ایرانی با محدودیت ساخته اند به ویژه اکسچنچ های آمریکایی، حتما از کیف پول شخصی و آدرس های یک بار مصرف و انتقال چند لایه بین آدرس های خود استفاده کنید.
            </li>
          </ul>
        </Accordion>
      </div>
      </div>

      
    </form>
  );
}
