import { useState, FC } from "react";
import FloatingSelect from "../FloatingInput/FloatingSelect";
import FloatingInput from "../FloatingInput/FloatingInput";
import IconVideo from "../../assets/icons/Withdrawal/IconVideo";
import Accordion from "../Withdrawal/Accordion";
import { apiRequest } from "../../utils/apiClient";


const CryptoWithdrawForm: FC = () => {
  const [network, setNetwork] = useState("");
  const [crypto, setCrypto] = useState("");
  const [address, setAddress] = useState("");
const [amount, setAmount] = useState("");
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

 
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError(null);

  try {
    const response = await apiRequest({
      url: `api/wallets/crypto/withdraw/${crypto}`,
      method: "POST",
      data: {
        network,
        withdrawAmount: parseFloat(amount),
        withdrawAddressWallet: address,
        withdrawAddressWalletTag: "", // اگر شبکه نیاز داشت مقدار بده
        // codeOtp: 123456, // اگر نیاز به تایید دو مرحله‌ای هست
      },
    });

    console.log("برداشت موفق:", response);
    alert("برداشت با موفقیت ثبت شد!");
  } catch (err: any) {
    console.error(err);
    setError(err.response?.data?.msg || "خطا در برداشت!");
  } finally {
    setIsLoading(false);
  }
};


  return (
    <form className="lg:p-8 rounded-xl lg:shadow-sm lg:bg-gray44 flex flex-col justify-between h-[644px] overflow-y-auto" onSubmit={handleSubmit}>
      <div>
        {/* ویدیو آموزشی */}
        <div dir="rtl" className="mb-6 bg-blue14 py-4 px-4 rounded-[8px] flex items-center gap-2">
          <span className="w-6 h-6 icon-wrapper">
            <IconVideo />
          </span>
          <h2 className="font-normal text-blue2">ویدیو آموزشی برداشت رمز ارز</h2>
        </div>

        {/* انتخاب رمز ارز */}
        <div dir="rtl" className="mb-6 relative">
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
        <div dir="rtl" className="mb-6 relative">
          <FloatingSelect
            label="شبکه برداشت"
            value={network}
            onChange={(val) => setNetwork(val)}
            options={[
              { value: "trc20", label: "ترون (TRC20)" },
              { value: "erc20", label: "اتریوم (ERC20)" },
            ]}
          />

          {/* فیلدها وقتی شبکه انتخاب شد */}
          {network && (
            <div className="mt-4 relative z-10 flex flex-col gap-4">
              <FloatingInput
                label="آدرس تتر مقصد"
                value={address}
               onChange={(e) => setAddress(e.target.value)}
                type="text"
              />

              <div>
                <FloatingInput
                  label="مقدار برداشت"
                  value={amount}
               onChange={(e) => setAmount(e.target.value)}
                  type="number"
                />
                <div className="flex justify-between pt-2 text-xs text-gray-500">
                  <p>کل موجودی: 34.000 MOS</p>
                  <button
                    type="button"
                    className="text-blue-500"
                    onClick={() => console.log("Set all balance")}
                  >
                    همه موجودی
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* دکمه تایید */}
      <div>
        <button
  type="submit"
  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg"
  disabled={isLoading}
>
  {isLoading ? "در حال ارسال..." : "تایید"}
</button>


        {/* راهنمای برداشت */}
        <div className="mt-6">
          <Accordion title="راهنمای برداشت رمز ارز">
            <ul className="list-disc pr-5 space-y-2 text-black1">
              <li>از برداشت مستقیم از آدرس خود به مقصد اکس‌چنچ‌های جهانی با محدودیت‌های ایران اجتناب کنید.</li>
              <li>برداشت ممکن است تا 72 ساعت طول بکشد.</li>
              <li>در صورت استفاده از کیف پول پی فا 24، انتقال رایگان خواهد بود.</li>
              <li>برای آدرس‌های دفتر، نیاز به ورود دو مرحله و رمز یک‌بار مصرف نیست.</li>
              <li>در انتخاب شبکه دقت لازم را داشته باشید.</li>
              <li>از انتقال چندلایه و آدرس‌های یک‌بار مصرف برای امنیت استفاده کنید.</li>
            </ul>
          </Accordion>
        </div>
      </div>
    </form>
  );
};

export default CryptoWithdrawForm;
