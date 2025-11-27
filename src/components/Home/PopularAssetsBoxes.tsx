import { Link } from "react-router";
import { ROUTES } from "../../routes/routes";
import { useMemo } from "react";
import { ListDigitalCoin } from "../../constants/ListdigitalCoins";
import useGetGeneralInfo from "../../hooks/useGetGeneralInfo";
import { formatPersianNumber } from "../../utils/formatPersianNumber";

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
  const { data: generalData } = useGetGeneralInfo();

  const mappedGeneralData = useMemo(() => {
    return (
      generalData?.cryptocurrency?.reduce((acc, item) => {
        acc[item.symbol.toUpperCase()] = item;
        return acc;
      }, {} as Record<string, any>) ?? {}
    );
  }, [generalData]);

  const mergedCoins: MergedCoin[] = useMemo(() => {
    return topCoins.map((coin) => {
      const localCoin = ListDigitalCoin.find((c) => c.symbol.toUpperCase() === coin.symbol.toUpperCase());
      const coinData = localCoin || mappedGeneralData[coin.symbol.toUpperCase()];

      return {
        ...coin,
        name: coinData?.locale?.fa?.name || coinData?.name || coin.symbol,
        image: coinData?.icon || coin.image,
      };
    });
  }, [topCoins, mappedGeneralData]);

 
  const boxes = Array.from({ length: 4 });

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {boxes.map((_, i) => {
          const coin = mergedCoins[i]; 
          const showSkeleton = isLoading || !coin;

          return (
      <div
  key={i}
  dir="rtl"
  className="relative border border-gray21 rounded-2xl p-4 pl-2 shadow-sm flex justify-between min-h-[120px] overflow-hidden"
>
  {showSkeleton ? (
    <div className="flex flex-row gap-3 w-full animate-pulse">
      <div className="flex-1 flex flex-col gap-2">
        <div className="skeleton-bg rounded w-full h-5"></div>
        <div className="skeleton-bg rounded w-2/3 h-4"></div>
        <div className="skeleton-bg rounded w-1/2 h-4"></div>
      </div>
      <div className="skeleton-bg rounded-lg w-20 h-8"></div>
    </div>
  ) : (
    <>
      {/* سمت راست: محتوای عمودی */}
      <div className="flex-1 flex flex-col text-right overflow-hidden gap-2">
        <div className="flex items-center gap-3">
          <img
            src={coin.image ? `https://api.payfa24.org/images/currency/${coin.image}` : "/images/fallback-coin.png"}
            className="w-10 h-10 object-contain flex-shrink-0"
            alt={coin.symbol}
          />
          <div className="flex flex-col overflow-hidden">
            <div className="text-lg font-semibold text-black1">
              {coin.name || coin.symbol}
            </div>
            <span className="text-sm font-medium text-gray35">{coin.symbol}</span>
          </div>
        </div>
    <div className="flex justify-between items-end">
  {/* سمت راست: قیمت‌ها */}
  <div className="flex flex-col gap-y-1 text-sm">
    {coin.price && (
      <>
        <span className="text-black1 font-medium whitespace-nowrap">
          قیمت خرید: <span className="text-green2">{formatPersianNumber(coin.price.buy)}</span>
        </span>
        <span className="text-black1 font-medium whitespace-nowrap">
          قیمت فروش: <span className="text-red1">{formatPersianNumber(coin.price.sell)}</span>
        </span>
      </>
    )}
  </div>

  {/* سمت چپ: دکمه خرید/فروش */}
  <Link
    to={`${ROUTES.TRADE.BUY}?coin=${coin.symbol}`}
    className="hover:bg-blue2 hover:text-white rounded-lg px-3 py-1.5 text-sm border border-blue2 transition duration-200 ease-in font-bold whitespace-nowrap text-blue2"
  >
    خرید/فروش
  </Link>
</div>

   
      </div>

      
    </>
  )}
</div>

          );
        })}
      </div>
    </div>
  );
}
