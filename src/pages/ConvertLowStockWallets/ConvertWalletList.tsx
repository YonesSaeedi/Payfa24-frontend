
import { useEffect, useState } from "react";
import { apiRequest } from "../../utils/apiClient";
import BreadcrumbNavigation from "../../components/BreadcrumbNavigation";
import useGetGeneralInfo from "../../hooks/useGetGeneralInfo";
import HeaderLayout from "../../layouts/HeaderLayout";
import { toast } from "react-toastify";
import BankCardImg from "../../assets/images/BankCards/BankCard (2).png";
import BankCardDarkImg from "../../assets/images/BankCards/bankCardDark.png"
import { AxiosError } from "axios";


interface WalletItem {
  symbol: string;
  amount_coin: string | number;
  amount: number;
  price?: string;
  icon?: string | null;
  color?: string | null;
  isFont?: boolean;
  locale?: { fa?: { name: string } };
}
interface WalletResponse {
  wallets: WalletItem[];
}

interface ConvertResponse {
  msg?: string;
}
export default function ConvertPage() {
  const [wallets, setWallets] = useState<WalletItem[]>([]);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});
  const [allChecked, setAllChecked] = useState(false);
  const [loading, setLoading] = useState(true);

  const { data: generalInfo } = useGetGeneralInfo();

  const mappedGeneralData =
    generalInfo?.cryptocurrency?.reduce((acc, coin) => {
      acc[coin.symbol.toUpperCase()] = coin;
      return acc;
    }, {} as Record<string, any>) || {};

  const fetchWallets = async () => {
    try {
      setLoading(true);

      const data = await apiRequest<WalletResponse>({
        url: "/wallets/crypto/convert/list",
        method: "GET",
      });

      const formattedWallets = data.wallets.map((item) => {
        const symbol = item.symbol.toUpperCase();
        const general = mappedGeneralData[symbol];

        return {
          ...item,
          amount_coin: String(item.amount_coin),
          price: item.price || "0",
          icon: general?.icon || null,
          color: general?.color || null,
          locale: general?.locale || null,
          isFont: general?.isFont || false,
        };
      });

      setWallets(formattedWallets);
    } catch (error) {
      toast.error((error as AxiosError<{ msg: string }>)?.response?.data?.msg || "خطا در دریافت کیف پول:");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (!generalInfo) return;
    fetchWallets();
  }, [generalInfo]);

  const mergedList = wallets;

  // ⭐ انتخاب یک مورد
  const handleCheckItem = (symbol: string) => {
    const updated = { ...checkedItems, [symbol]: !checkedItems[symbol] };
    setCheckedItems(updated);

    const allSelected = mergedList.every((item) => updated[item.symbol]);
    setAllChecked(allSelected);
  };

  // ⭐ انتخاب همه
  const handleCheckAll = () => {
    const newAllChecked = !allChecked;
    const newCheckedItems: { [key: string]: boolean } = {};

    mergedList.forEach((item) => {
      newCheckedItems[item.symbol] = newAllChecked;
    });

    setCheckedItems(newCheckedItems);
    setAllChecked(newAllChecked);
  };

  // ⭐ تبدیل
  const handleConvert = async () => {
    try {
      const selectedSymbols = Object.keys(checkedItems).filter(
        (key) => checkedItems[key]
      );

      if (!selectedSymbols.length) {
        toast.error("لطفا حداقل یک رمزارز را انتخاب کنید");
        return;
      }

      const formData = new FormData();
      selectedSymbols.forEach(symbol => formData.append("symbols[]", symbol));

      const response = await apiRequest<ConvertResponse, FormData>({
        url: "/wallets/crypto/convert",
        method: "POST",
        data: formData,
        isFormData: true,
      });

      toast.info(response?.msg || "عملیات با موفقیت انجام شد");
      fetchWallets();
      setCheckedItems({});
      setAllChecked(false);
    } catch (err: any) {
      const serverMsg =
        err?.response?.data?.msg ||
        err?.response?.data?.message ||
        err?.message ||
        "خطا در عملیات تبدیل";

      toast.error(serverMsg);
    }
  };


  return (
    <div className="bg-white1">
      <HeaderLayout>
        <div className="container-style flex gap-14 flex-col mx-auto px-1 sm:px-4 lg:px-10">
          <div className="mt-7 lg:mt-4">
            <BreadcrumbNavigation />
          </div>

          <div dir="rtl" className="base-style gap-5 lg:bg-gray25 rounded-2xl w-full lg:shadow-[0_0_12px_0_#00000029] lg:px-16 pt-12 pb-28 lg:flex-row lg:gap-10">
            <div className="flex justify-between ">
              <h1 className="lg:text-xl text-sm font-bold  text-black1">تبدیل موجودی‌های اندک</h1>
              <button
                onClick={handleConvert}
                disabled={wallets.length === 0}
                className={`
    hidden lg:block
    rounded-lg px-11 py-2 lg:py-2.5 text-base font-medium lg:text-lg lg:font-bold
    bg-blue2 text-white2 transition duration-300
    ${wallets.length === 0 ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"}
  `}
              >
                تبدیل موجودی
              </button>

            </div>


            <div className="w-full h-full rounded-2xl  flex flex-col gap-8">
              {/* توضیحات و دکمه */}
              <div className="lg:flex items-center justify-between">
                <ol className=" lg:p-6   flex flex-col  gap-2 list-disc">


                  <div className="pr-4 pb-2">
                    <li className="text-black1  lg:text-sm mt-4 text-xs lg:mt-1">
                      شما می‌توانید رمزارزهای با موجودی کمتر از 10,000 تومان خود را مستقیماً به تومان تبدیل کنید.
                    </li>
                    <li className="text-black1 lg:text-sm mt-4 text-xs lg:mt-1">
                      دقت کنید که ارزش نمایش داده شده به صورت تقریبی است.
                    </li>
                  </div>
                </ol>
                <div className="lg:hidden px-4 mt-3 flex justify-end">
                  <button
                    onClick={handleConvert}
                    disabled={wallets.length === 0}
                    className={`
       rounded-lg px-6 py-2  font-bold 
      bg-blue2 text-white2 transition duration-300 text-sm
      ${wallets.length === 0 ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"}
    `}
                  >
                    تبدیل موجودی
                  </button>
                </div>



              </div>

              {/* جدول */}
              <div className="flex flex-col">
                {/* هدر */}
                <div className="grid grid-cols-4 px-6 py-3 font-bold text-center bg-gray41">

                  {/* انتخاب همه */}
                  <div className="flex items-center gap-2">
                    <div className="relative w-[18px] h-[18px]">
                      <input
                        type="checkbox"
                        checked={allChecked}
                        onChange={handleCheckAll}
                        className="w-full h-full appearance-none border border-gray-400 rounded-[4px]"
                      />
                      {allChecked && (
                        <span
                          className="absolute inset-0 flex items-center justify-center text-black font-bold text-sm pointer-events-none"
                        >
                          ✓
                        </span>
                      )}
                    </div>
                    <span className="text-sm">انتخاب همه</span>
                  </div>

                  <h5 className="text-black1 text-sm font-semibold">نماد رمزارز</h5>
                  <h5 className="text-black1 text-sm font-semibold">قیمت لحظه‌ای</h5>
                  <h5 className="text-black1 text-sm font-semibold">معادل تومانی</h5>
                </div>

                {/* دیتا */}
                {loading ? (
                  // ⭐ اسکلتون
                  [...Array(4)].map((_, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-4 px-6 py-3 text-center border-b border-outlineVariant animate-pulse"
                    >
                      <div className="flex gap-2 items-center justify-start">
                        <div className="relative w-[18px] h-[18px] skeleton-bg" />
                        <div className="flex flex-col gap-1">
                          <div className="w-20 h-4 skeleton-bg rounded" />
                          <div className="w-12 h-3 skeleton-bg rounded" />
                        </div>
                      </div>
                      <div className="w-16 h-4 skeleton-bg rounded mx-auto" />
                      <div className="w-16 h-4 skeleton-bg rounded mx-auto" />
                      <div className="w-16 h-4 skeleton-bg rounded mx-auto" />
                    </div>
                  ))
                ) : wallets.length === 0 ? (
                  // ⭐ تصویر خالی
                  <div className="flex flex-col items-center justify-center py-10 gap-4">
                    <img
                      src={BankCardImg}
                      alt="Bank Card Illustration"
                      className="max-w-sm dark:hidden"
                    />
                    <img
                      src={BankCardDarkImg}
                      alt="Bank Card Illustration Dark"
                      className="max-w-sm hidden dark:block"
                    />
                    <p className="text-gray-500 text-lg">هیچ رمزارزی برای تبدیل وجود ندارد</p>
                  </div>
                ) : (
                  // ⭐ دیتا
                  mergedList.map((item) => (
                    <div
                      key={item.symbol}
                      className="grid grid-cols-4 px-6 py-3 text-center border-b border-outlineVariant"
                    >
                      <div className="flex gap-2 items-center justify-start">

                        {/* چک‌باکس */}
                        <div className="relative w-[18px] h-[18px]">
                          <input
                            type="checkbox"
                            checked={!!checkedItems[item.symbol]}
                            onChange={() => handleCheckItem(item.symbol)}
                            className="w-full h-full appearance-none border border-gray-400 rounded-[4px]"
                          />
                          {checkedItems[item.symbol] && (
                            <span className="absolute inset-0 flex items-center justify-center text-black font-bold text-sm pointer-events-none">
                              ✓
                            </span>
                          )}
                        </div>

                        {/* آیکن */}
                        <span className="w-7 h-7 rounded-full flex items-center justify-center">
                          {!item.icon && !item.isFont ? (
                            <div className="w-7 h-7 rounded-full skeleton-bg" />
                          ) : item.isFont ? (
                            <i
                              className={`cf cf-${item.symbol.toLowerCase()}`}
                              style={{
                                color: item.color || "#000",
                                fontSize: "28px",
                              }}
                            />
                          ) : (
                            <img
                              src={`https://api.payfa24.com/images/currency/${item.icon}`}
                              alt={item.symbol}
                              className="object-contain w-7 h-7 rounded-full"
                            />
                          )}
                        </span>

                        {/* نام */}
                        <div className="flex flex-col">
                          <h4 className="text-black1 text-base text-start">
                            {item.locale?.fa?.name || item.symbol}
                          </h4>
                          <h5 className="text-black1 text-sm text-start">{item.symbol}</h5>
                        </div>
                      </div>

                      <div className="text-onSurface text-base font-normal flex items-center justify-center text-black1">
                        {Number(item.amount_coin).toLocaleString()}
                      </div>

                      <div className="text-black1 text-base flex items-center justify-center">
                        {Number(item.price).toLocaleString()}
                      </div>

                      <div className="text-black1 text-base flex items-center justify-center">
                        {item.amount.toLocaleString()}
                      </div>
                    </div>
                  ))
                )}

              </div>
            </div>
          </div>
        </div>
      </HeaderLayout>
    </div>
  );
}
