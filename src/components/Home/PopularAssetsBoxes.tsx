import { Link } from "react-router";
import { ROUTES } from "../../routes/routes";

type Coin = {
  symbol: string;
  price?: {
    buy: number;
    sell: number;
  };
};

type MergedCoin = Coin & {
  name?: string;
  image?: string;
};

type PopularAssetsBoxesProps = {
  topCoins?: MergedCoin[];
  isLoading?: boolean;
};

export default function PopularAssetsBoxes({ topCoins = [], isLoading = false }: PopularAssetsBoxesProps) {
  // همیشه 4 باکس ثابت
  const boxes = Array.from({ length: 4 });

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {boxes.map((_, i) => {
          const coin = topCoins[i]; // داده واقعی اگر موجود باشه
          const showSkeleton = isLoading || !coin;

          return (
            <div
              key={i}
              dir="rtl"
              className="relative bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center justify-between min-h-[120px]"
            >
              {showSkeleton ? (
                <div className="flex justify-between items-center w-full animate-pulse">
                  <div className="flex items-center gap-3 flex-row-reverse">
                    <div className="flex flex-col text-right gap-2">
                      <div className="skeleton-bg rounded w-24 h-5"></div>
                      <div className="skeleton-bg  rounded w-16 h-4"></div>
                    </div>
                    <div className="skeleton-bg  rounded-full w-10 h-10"></div>
                  </div>
                  <div className="skeleton-bg  rounded-lg w-20 h-8"></div>
                </div>
              ) : (
                <>
                  {/* ارز و نام */}
                  <div className="flex items-center gap-3 flex-row-reverse">
                    <div className="flex flex-col text-right">
                      <div className="text-lg font-semibold text-gray-900">{coin.name || coin.symbol}</div>
                      <span className="text-sm font-medium text-gray-700">{coin.symbol}</span>
                    </div>
                    <img
                      src={coin.image ? `https://api.payfa24.org/images/currency/${coin.image}` : "/images/fallback-coin.png"}
                      className="w-10 h-10 object-contain"
                      alt={coin.symbol}
                    />
                  </div>

                  {/* دکمه خرید/فروش */}
                  <Link
                    to={`${ROUTES.TRADE.BUY}?coin=${coin.symbol}`}
                    className="bg-blue2 text-white rounded-lg px-4 py-1.5 text-sm border border-transparent 
                               hover:bg-transparent hover:border-blue2 hover:text-blue2 transition duration-200 ease-in font-bold"
                  >
                    خرید/فروش
                  </Link>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
