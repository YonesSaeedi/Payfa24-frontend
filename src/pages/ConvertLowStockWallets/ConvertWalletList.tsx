import { useEffect, useState } from "react";
import { apiRequest } from "../../utils/apiClient";
import BreadcrumbNavigation from "../../components/BreadcrumbNavigation";
import useGetGeneralInfo from "../../hooks/useGetGeneralInfo";
import { toast } from "react-toastify";
import HeaderLayout from "../../layouts/HeaderLayout";
import IconStarGold from "../../assets/icons/market/CryptoMarketTable.tsx/IconStarGold";
import IconStar from "../../assets/icons/market/IconStar";

interface WalletItem {
  symbol: string;
  amount_coin: string | number;
  amount: number;
  price?: string;
  icon?: string | null;
  color?: string | null;
  locale?: {
    fa?: {
      name: string;
    };
  };
}

export default function ConvertPage() {
  const [wallets, setWallets] = useState<WalletItem[]>([]);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});
  const [, setAllChecked] = useState(false);

  const { data: generalInfo } = useGetGeneralInfo();

  const mappedGeneralData =
    generalInfo?.cryptocurrency?.reduce((acc, coin) => {
      acc[coin.symbol.toUpperCase()] = coin;
      return acc;
    }, {} as Record<string, any>) || {};

  useEffect(() => {
    if (!generalInfo) return;

    const fetchWallets = async () => {
      try {
        const data = await apiRequest<{ wallets: WalletItem[] }>({
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
          };
        });

        setWallets(formattedWallets);
      } catch (error) {
        console.error("خطا در دریافت داده‌های کیف پول:", error);
      }
    };

    fetchWallets();
  }, [generalInfo]);

  const mergedList = wallets;

  const handleCheckItem = (symbol: string) => {
    const updated = { ...checkedItems, [symbol]: !checkedItems[symbol] };
    setCheckedItems(updated);

    const allSelected = mergedList.every((item) => updated[item.symbol]);
    setAllChecked(allSelected);
  };

  // const handleCheckAll = () => {
  //   const newAllChecked = !allChecked;
  //   const newCheckedItems: { [key: string]: boolean } = {};
  //   mergedList.forEach((item) => (newCheckedItems[item.symbol] = newAllChecked));
  //   setCheckedItems(newCheckedItems);
  //   setAllChecked(newAllChecked);
  // };

const handleConvert = async () => {
  const selectedSymbols = Object.entries(checkedItems)
    .filter(([, checked]) => checked)
    .map(([symbol]) => symbol);

  if (selectedSymbols.length === 0) {
    toast.error("لطفاً حداقل یک رمزارز انتخاب کنید.");
    return;
  }

  // استفاده از FormData برای ارسال آرایه
  const formData = new FormData();
  selectedSymbols.forEach(symbol => formData.append("symbols[]", symbol));

  console.log("=== Sending Convert Request ===");
  console.log("FormData:", selectedSymbols);

  try {
    const response = await apiRequest<
      { status: boolean; message?: string; msg?: string },
      FormData
    >({
      url: "/wallets/crypto/convert",
      method: "POST",
      data: formData,
      isFormData: true,
    });

    console.log("=== Response from Convert API ===", response);

    if (!response.status) {
      toast.error(response.message || response.msg || "عملیات ناموفق بود.");
      return;
    }

    toast.success("تبدیل با موفقیت انجام شد.");
    setCheckedItems({});
    setAllChecked(false);
  } catch (err: any) {
    console.error("=== Error in Convert API ===", err);
    if (err?.response) {
      console.log("Response status:", err.response.status);
      console.log("Response data:", err.response.data);
    }
    toast.error("خطا در اتصال به سرور");
  }
};


  return (
    <div className="bg-white1">
       <HeaderLayout>
        <div className="container-style mx-auto px-1 sm:px-4 lg:px-10">
          <div className="mt-7 lg:mt-4">
            <BreadcrumbNavigation />
          </div>
          <div dir="rtl" className="base-style gap-5">
            <h1 className="text-xl font-bold mt-14 text-black1">تبدیل موجودی‌های اندک</h1>
            <div className="w-full h-full rounded-2xl py-8 flex flex-col gap-16">
              <div className="flex items-center justify-between">
                <ol className="gap-2 list-disc mr-6">
                  <li className="text-onSurface text-base font-normal text-black1">
                    شما می‌توانید رمزارزهای با موجودی کمتر از 10,000 تومان خود را مستقیماً به تومان تبدیل کنید.
                  </li>
                  <li className="text-onSurface text-base font-normal text-black1">
                    دقت کنید که ارزش نمایش داده شده به صورت تقریبی است.
                  </li>
                </ol>

                <button onClick={handleConvert} className="bg-blue2  px-11 py-2 rounded-lg text-white">
                  تبدیل موجودی
                </button>
              </div>

           <div className="flex flex-col">
  <div className="grid grid-cols-4 px-6 py-3 font-bold text-center bg-gray41">
    <div className="flex items-center justify-start gap-2">
      <h5 className="text-black1 text-sm font-semibold">نماد رمزارز</h5>
    </div>
    <h5 className="text-black1 text-sm font-semibold">موجودی</h5>
    <h5 className="text-black1 text-sm font-semibold">قیمت لحظه‌ای (تومان)</h5>
    <h5 className="text-black1 text-sm font-semibold">معادل تومانی</h5>
  </div>

  {wallets.length === 0 ? (
    // اسکلتون قبل از لود داده‌ها
    [...Array(4)].map((_, index) => (
      <div
        key={index}
        className="grid grid-cols-4 px-6 py-3 text-center  border-b border-outlineVariant animate-pulse"
      >
        <div className="flex gap-2 items-center justify-start">
          <div className="relative w-[18px] h-[18px] skeleton-bg"></div>
          <div className="flex flex-col gap-1">
            <div className="w-20 h-4  skeleton-bg rounded"></div>
            <div className="w-12 h-3  skeleton-bg rounded"></div>
          </div>
        </div>
        <div className="w-16 h-4  skeleton-bg rounded mx-auto"></div>
        <div className="w-16 h-4  skeleton-bg rounded mx-auto"></div>
        <div className="w-16 h-4  skeleton-bg rounded mx-auto"></div>
      </div>
    ))
  ) : (
    // جدول اصلی بعد از لود داده‌ها
    mergedList.map((item) => (
      <div
        key={item.symbol}
        className="grid grid-cols-4 px-6 py-3 text-center  border-b border-outlineVariant"
      >
        <div className="flex gap-2 items-center justify-start">
          <div className="relative w-[22px] h-[22px] flex items-center justify-center">
  <button
    onClick={() => handleCheckItem(item.symbol)}
    className="flex items-center justify-center text-gray12"
  >
    {checkedItems[item.symbol] ? <IconStarGold /> : <IconStar />}
  </button>
</div>

          {item.icon && (
            <img
              src={`https://api.payfa24.org/images/currency/${item.icon}`}
              alt={item.symbol}
              className="w-6 h-6 rounded-full"
            />
          )}
          <div className="flex flex-col">
            <h4 className="text-black1 text-base font-normal text-start">
              {item.locale?.fa?.name || item.symbol}
            </h4>
            <h5 className="text-black1 text-sm font-normal text-start">{item.symbol}</h5>
          </div>
        </div>

        <div className="text-onSurface text-base font-normal flex items-center justify-center text-black1">
          {Number(item.amount_coin).toLocaleString()}
        </div>

        <div className="text-onSurface text-base font-normal flex items-center justify-center text-black1">
          {Number(item.price).toLocaleString()}
        </div>

        <div className="text-onSurface text-base font-normal flex items-center justify-center text-black1">
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
