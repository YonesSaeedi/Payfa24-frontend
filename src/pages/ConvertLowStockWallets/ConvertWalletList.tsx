import { useEffect, useState } from "react";
import HeaderFooterLayout from "../../layouts/HeaderFooterLayout";
import { apiRequest } from "../../utils/apiClient";
// import useGetGeneralInfo from "../../hooks/useGetGeneralInfo"; // مسیر ممکنه فرق کنه

interface WalletItem {
  symbol: string;
  amount_coin: string | number;
  amount: number;
  price?: string;
  locale?: {
    fa?: {
      name: string;
    }
  }
}
// interface CoinInfo {
//   symbol: string;
//   image: string;
//   name?: string;
// }

// interface GeneralInfo {
//   coins: CoinInfo[];
//   // بقیه فیلدها
// }


export default function ConvertPage() {
  const [wallets, setWallets] = useState<WalletItem[]>([]);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});
  const [allChecked, setAllChecked] = useState(false);

//   const { data: generalInfo } = useGetGeneralInfo();

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const data = await apiRequest<{ wallets: WalletItem[] }>({
          url: "/wallets/crypto/convert/list",
          method: "GET",
        });

        const formattedWallets = data.wallets.map(item => ({
          ...item,
          amount_coin: String(item.amount_coin),
          price: item.price || "0",
        }));

        setWallets(formattedWallets);
      } catch (error) {
        console.error("خطا در دریافت داده‌های کیف پول:", error);
      }
    };

    fetchWallets();
  }, []);

  const mergedList = wallets;

  const handleCheckItem = (symbol: string) => {
    const updated = { ...checkedItems, [symbol]: !checkedItems[symbol] };
    setCheckedItems(updated);

    const allSelected = mergedList.every(item => updated[item.symbol]);
    setAllChecked(allSelected);
  };

  const handleCheckAll = () => {
    const newAllChecked = !allChecked;
    const newCheckedItems: { [key: string]: boolean } = {};
    mergedList.forEach(item => newCheckedItems[item.symbol] = newAllChecked);
    setCheckedItems(newCheckedItems);
    setAllChecked(newAllChecked);
  };

  const handleConvert = () => {
    const selectedSymbols = Object.entries(checkedItems)
      .filter(([, checked]) => checked)
      .map(([symbol]) => symbol);

    if (selectedSymbols.length === 0) {
      alert("لطفاً حداقل یک رمزارز انتخاب کنید.");
      return;
    }

    console.log("Selected for convert:", selectedSymbols);
    alert("عملیات تبدیل (شبیه‌سازی شده) با موفقیت انجام شد.");

    setCheckedItems({});
    setAllChecked(false);
  };

//   const getCoinImage = (symbol: string) => {
//   if (!generalInfo) return null;
//   const coin = generalInfo.coins?.find((c: CoinInfo) => c.symbol === symbol);
//   return coin?.image || null;
// };


  return (
    <div className="bg-white1">
      <HeaderFooterLayout>
        <div className="container-style mx-auto px-1 sm:px-4 lg:px-10">
          <div dir="rtl" className="base-style gap-5">
            <div className='w-full h-full rounded-2xl  py-8 flex flex-col gap-6'>
              <h1 className='text-onSurface text-base font-bold'>تبدیل موجودی‌های اندک</h1>

              <div className='flex items-center justify-between'>
                <ol className='gap-2 list-disc mr-6'>
                  <li className='text-onSurface text-base font-normal'>
                    شما می‌توانید رمزارزهای با موجودی کمتر از 10,000 تومان خود را مستقیماً به تومان تبدیل کنید.
                  </li>
                  <li className='text-onSurface text-base font-normal'>
                    دقت کنید که ارزش نمایش داده شده به صورت تقریبی است.
                  </li>
                </ol>

                <button
                  onClick={handleConvert}
                  className='bg-blue2 text-white1 px-11 py-2 rounded-xl'>
                  تبدیل موجودی
                </button>
              </div>

              <div className="flex flex-col">
                <div className='grid grid-cols-4 px-6 py-3 font-bold text-center bg-gray41'>
                  <div className='flex items-center justify-start gap-2'>
                    <div className="relative w-[18px] h-[18px]">
                      <input
                        type="checkbox"
                        checked={allChecked}
                        onChange={handleCheckAll}
                        className="w-full h-full appearance-none border border-outlineVariant rounded-[4px]"
                      />
                      {allChecked && (
                        <span className="absolute inset-0 flex items-center justify-center text-onSurface font-bold text-sm pointer-events-none">
                          ✓
                        </span>
                      )}
                    </div>
                    <h5 className='text-black1 text-sm font-semibold'>نماد رمزارز</h5>
                  </div>
                  <h5 className='text-black1 text-sm font-semibold'>موجودی</h5>
                  <h5 className='text-black1 text-sm font-semibold'>قیمت لحظه‌ای (تومان)</h5>
                  <h5 className='text-black1 text-sm font-semibold'>معادل تومانی</h5>
                </div>

                {mergedList.map((item) => (
                  <div key={item.symbol} className='grid grid-cols-4 px-6 py-3 text-center rounded-lg border-b border-outlineVariant'>
                    <div className='flex gap-2 items-center justify-start'>
                      <div className="relative w-[18px] h-[18px]">
                        <input
                          type="checkbox"
                          checked={!!checkedItems[item.symbol]}
                          onChange={() => handleCheckItem(item.symbol)}
                          className="w-full h-full appearance-none border border-outlineVariant rounded-[4px]"
                        />
                        {checkedItems[item.symbol] && (
                          <span className="absolute inset-0 flex items-center justify-center text-onSurface font-bold text-sm pointer-events-none">
                            ✓
                          </span>
                        )}
                      </div>
{/* 
                      {getCoinImage(item.symbol) && (
                        <img
                          src={getCoinImage(item.symbol)!}
                          alt={item.symbol}
                          className="w-6 h-6 rounded-full"
                        />
                      )} */}

                      <div className='flex flex-col'>
                        <h4 className='text-onSurface text-base font-normal text-start'>
                          {item.locale?.fa?.name || item.symbol}
                        </h4>
                        <h5 className='text-onSurfaceVariant text-sm font-normal text-start'>{item.symbol}</h5>
                      </div>
                    </div>

                    <div className='text-onSurface text-base font-normal flex items-center justify-center'>
                      {Number(item.amount_coin).toLocaleString()}
                    </div>

                    <div className='text-onSurface text-base font-normal flex items-center justify-center'>
                      {Number(item.price).toLocaleString()}
                    </div>

                    <div className='text-onSurface text-base font-normal flex items-center justify-center'>
                      {item.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </HeaderFooterLayout>
    </div>
  );
}
