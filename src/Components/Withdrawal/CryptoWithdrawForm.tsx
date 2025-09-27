// import { useState, FC } from "react";
// import FloatingSelect from "../FloatingInput/FloatingSelect";
// import FloatingInput from "../FloatingInput/FloatingInput";
// import IconVideo from "../../assets/icons/Withdrawal/IconVideo";
// import Accordion from "../Withdrawal/Accordion";
// import { apiRequest } from "../../utils/apiClient";


// const CryptoWithdrawForm: FC = () => {
//   const [network, setNetwork] = useState("");
//   const [crypto, setCrypto] = useState("");
//   const [address, setAddress] = useState("");
// const [amount, setAmount] = useState("");
// const [isLoading, setIsLoading] = useState(false);
// const [error, setError] = useState<string | null>(null);

 
// const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();
//   setIsLoading(true);
//   setError(null);

//   try {
//     const response = await apiRequest({
//       url: `api/wallets/crypto/withdraw/${crypto}`,
//       method: "POST",
//       data: {
//         network,
//         withdrawAmount: parseFloat(amount),
//         withdrawAddressWallet: address,
//         withdrawAddressWalletTag: "", // اگر شبکه نیاز داشت مقدار بده
//         // codeOtp: 123456, // اگر نیاز به تایید دو مرحله‌ای هست
//       },
//     });

//     console.log("برداشت موفق:", response);
//     alert("برداشت با موفقیت ثبت شد!");
//   } catch (err: any) {
//     console.error(err);
//     setError(err.response?.data?.msg || "خطا در برداشت!");
//   } finally {
//     setIsLoading(false);
//   }
// };


//   return (
//     <form className="lg:p-8 rounded-xl lg:shadow-sm lg:bg-gray44 flex flex-col justify-between h-[644px] overflow-y-auto" onSubmit={handleSubmit}>
//       <div>
//         {/* ویدیو آموزشی */}
//         <div dir="rtl" className="mb-6 bg-blue14 py-4 px-4 rounded-[8px] flex items-center gap-2">
//           <span className="w-6 h-6 icon-wrapper">
//             <IconVideo />
//           </span>
//           <h2 className="font-normal text-blue2">ویدیو آموزشی برداشت رمز ارز</h2>
//         </div>

//         {/* انتخاب رمز ارز */}
//         <div dir="rtl" className="mb-6 relative">
//           <FloatingSelect
//             label="انتخاب رمز ارز"
//             value={crypto}
//             onChange={(val) => setCrypto(val)}
//             options={[
//               { value: "mos", label: "مونوس" },
//               { value: "usdt", label: "تتر" },
//               { value: "btc", label: "بیت‌کوین" },
//             ]}
//           />
//         </div>

//         {/* انتخاب شبکه */}
//         <div dir="rtl" className="mb-6 relative">
//           <FloatingSelect
//             label="شبکه برداشت"
//             value={network}
//             onChange={(val) => setNetwork(val)}
//             options={[
//               { value: "trc20", label: "ترون (TRC20)" },
//               { value: "erc20", label: "اتریوم (ERC20)" },
//             ]}
//           />

//           {/* فیلدها وقتی شبکه انتخاب شد */}
//           {network && (
//             <div className="mt-4 relative z-10 flex flex-col gap-4">
//               <FloatingInput
//                 label="آدرس تتر مقصد"
//                 value={address}
//                onChange={(e) => setAddress(e.target.value)}
//                 type="text"
//               />

//               <div>
//                 <FloatingInput
//                   label="مقدار برداشت"
//                   value={amount}
//                onChange={(e) => setAmount(e.target.value)}
//                   type="number"
//                 />
//                 <div className="flex justify-between pt-2 text-xs text-gray-500">
//                   <p>کل موجودی: 34.000 MOS</p>
//                   <button
//                     type="button"
//                     className="text-blue-500"
//                     onClick={() => console.log("Set all balance")}
//                   >
//                     همه موجودی
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* دکمه تایید */}
//       <div>
//         <button
//   type="submit"
//   className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg"
//   disabled={isLoading}
// >
//   {isLoading ? "در حال ارسال..." : "تایید"}
// </button>


//         {/* راهنمای برداشت */}
//         <div className="mt-6">
//           <Accordion title="راهنمای برداشت رمز ارز">
//             <ul className="list-disc pr-5 space-y-2 text-black1">
//               <li>از برداشت مستقیم از آدرس خود به مقصد اکس‌چنچ‌های جهانی با محدودیت‌های ایران اجتناب کنید.</li>
//               <li>برداشت ممکن است تا 72 ساعت طول بکشد.</li>
//               <li>در صورت استفاده از کیف پول پی فا 24، انتقال رایگان خواهد بود.</li>
//               <li>برای آدرس‌های دفتر، نیاز به ورود دو مرحله و رمز یک‌بار مصرف نیست.</li>
//               <li>در انتخاب شبکه دقت لازم را داشته باشید.</li>
//               <li>از انتقال چندلایه و آدرس‌های یک‌بار مصرف برای امنیت استفاده کنید.</li>
//             </ul>
//           </Accordion>
//         </div>
//       </div>
//     </form>
//   );
// };

// export default CryptoWithdrawForm;
import { useState, useEffect, FC } from "react";
import FloatingSelect from "../FloatingInput/FloatingSelect";
import FloatingInput from "../FloatingInput/FloatingInput";
import IconVideo from "../../assets/icons/Withdrawal/IconVideo";
import Accordion from "../Withdrawal/Accordion";
import { apiRequest } from "../../utils/apiClient";

interface Coin {
  id: number;
  symbol: string;
  balance: string;
  balance_available: string;
  network: {
    id: number;
    withdraw_min: string;
  }[];
}

interface Network {
  id: number;
  name: string;
  symbol: string;
  tag: string | null;
  addressRegex: string;
  memoRegex: string;
}

const CryptoWithdrawForm: FC = () => {
  const [crypto, setCrypto] = useState("");
  const [network, setNetwork] = useState("");
  const [address, setAddress] = useState("");
  const [tag, setTag] = useState("");
  const [amount, setAmount] = useState("");
  const [otp, setOtp] = useState("");

  const [coins, setCoins] = useState<Coin[]>([]);
  const [networks, setNetworks] = useState<Network[]>([]);
  const [availableNetworks, setAvailableNetworks] = useState<Network[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log("useEffect fired");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiRequest({
          url: "/api/wallets/crypto",
          method: "GET",
        });

        console.log("API Response:", res.data);

        // mapping wallets به coins
        const fetchedCoins: Coin[] = res.data.wallets.map((w: any, index: number) => ({
          id: index,
          symbol: w.symbol,
          balance: w.balance.toString(),
          balance_available: w.balance.toString(),
          network: [
            {
              id: 1,
              withdraw_min: "0.001", // مقدار فرضی
            },
          ],
        }));

        setCoins(fetchedCoins);

        // شبکه dummy برای تست
        const dummyNetworks: Network[] = [
          {
            id: 1,
            name: "Bitcoin Network",
            symbol: "BTC",
            tag: null,
            addressRegex: "^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$",
            memoRegex: "",
          },
        ];
        setNetworks(dummyNetworks);
      } catch (err) {
        console.error("خطا در دریافت لیست رمز ارزها و شبکه‌ها:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!crypto) return;
    const selectedCoin = coins.find((c) => c.symbol === crypto);
    if (!selectedCoin) {
      setAvailableNetworks([]);
      return;
    }
    const filteredNetworks = networks.filter((n) =>
      selectedCoin.network.some((cn) => cn.id === n.id)
    );
    setAvailableNetworks(filteredNetworks);
    setNetwork(""); // ریست شبکه وقتی ارز تغییر می‌کند
  }, [crypto, coins, networks]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!crypto || !network || !address || !amount) {
        throw new Error("لطفاً تمام فیلدهای ضروری را پر کنید.");
      }

      const selectedNetwork = availableNetworks.find((n) => n.name === network);
      if (!selectedNetwork) throw new Error("شبکه انتخاب شده معتبر نیست.");

      const addressRegex = new RegExp(selectedNetwork.addressRegex);
      if (!addressRegex.test(address)) throw new Error("آدرس وارد شده معتبر نیست.");

      if (selectedNetwork.tag) {
        const memoRegex = new RegExp(selectedNetwork.memoRegex);
        if (!memoRegex.test(tag)) throw new Error("مقدار Tag/Memo معتبر نیست.");
      }

      const selectedCoin = coins.find((c) => c.symbol === crypto);
      if (!selectedCoin) throw new Error("رمز ارز انتخاب شده معتبر نیست.");

      const withdrawAmount = parseFloat(amount);
      const balanceAvailable = parseFloat(selectedCoin.balance_available);
      const networkData = selectedCoin.network.find((n) => n.id === selectedNetwork.id);
      const withdrawMin = parseFloat(networkData?.withdraw_min || "0");

      if (withdrawAmount > balanceAvailable)
        throw new Error("مقدار برداشت بیشتر از موجودی قابل برداشت است.");
      if (withdrawAmount < withdrawMin)
        throw new Error(`حداقل برداشت برای این شبکه ${withdrawMin} است.`);

      const payload: any = {
        network: selectedNetwork.name,
        withdrawAmount,
        withdrawAddressWallet: address,
        withdrawAddressWalletTag: selectedNetwork.tag ? tag : "",
      };

      if (otp) payload.codeOtp = otp;

      const response = await apiRequest({
        url: `/api/wallets/crypto/withdraw/${crypto}`,
        method: "POST",
        data: payload,
      });

      console.log("برداشت موفق:", response);
      alert("برداشت با موفقیت ثبت شد!");

      setAddress("");
      setTag("");
      setAmount("");
      setOtp("");
      setNetwork("");
      setCrypto("");
    } catch (err: any) {
      console.error(err);
      setError(err.message || err.response?.data?.msg || "خطا در برداشت!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="lg:p-8 rounded-xl lg:shadow-sm lg:bg-gray44 flex flex-col justify-between h-[644px] overflow-y-auto"
      onSubmit={handleSubmit}
    >
      <div>
        <div dir="rtl" className="mb-6 bg-blue14 py-4 px-4 rounded-[8px] flex items-center gap-2">
          <span className="w-6 h-6 icon-wrapper">
            <IconVideo />
          </span>
          <h2 className="font-normal text-blue2">ویدیو آموزشی برداشت رمز ارز</h2>
        </div>

        <div dir="rtl" className="mb-6 relative">
          <FloatingSelect<string>
            label="انتخاب رمز ارز"
            value={crypto}
            onChange={(val) => setCrypto(val)}
            options={coins.map((c) => ({ value: c.symbol, label: c.symbol }))}
          />
        </div>

        <div dir="rtl" className="mb-6 relative">
          <FloatingSelect<string>
            label="شبکه برداشت"
            value={network}
            onChange={(val) => setNetwork(val)}
            options={availableNetworks.map((n) => ({ value: n.name, label: n.name }))}
          />

          {network && (
            <div className="mt-4 relative z-10 flex flex-col gap-4">
              <FloatingInput
                label="آدرس مقصد"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                type="text"
              />

              {availableNetworks.find((n) => n.name === network)?.tag && (
                <FloatingInput
                  label="Tag / Memo"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  type="text"
                />
              )}

              <FloatingInput
                label="مقدار برداشت"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
              />

              <div className="flex justify-between pt-2 text-xs text-gray-500">
                <p>کل موجودی: {coins.find((c) => c.symbol === crypto)?.balance || "0"}</p>
                <button
                  type="button"
                  className="text-blue-500"
                  onClick={() => {
                    const balance = coins.find((c) => c.symbol === crypto)?.balance_available || "0";
                    setAmount(balance);
                  }}
                >
                  همه موجودی
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg"
          disabled={isLoading}
        >
          {isLoading ? "در حال ارسال..." : "تایید"}
        </button>

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
