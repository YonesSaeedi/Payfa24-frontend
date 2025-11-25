import { Link } from "react-router";
import { ROUTES } from "../../routes/routes";
import { useMemo } from "react";
import { ListDigitalCoin } from "../../constants/ListdigitalCoins";
import useGetGeneralInfo from "../../hooks/useGetGeneralInfo";

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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {boxes.map((_, i) => {
          const coin = mergedCoins[i]; 
          const showSkeleton = isLoading || !coin;

          return (
            <div
              key={i}
              dir="rtl"
              className="relative  border border-gray21 rounded-2xl p-4 shadow-sm flex items-center justify-between min-h-[120px]"
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
       <div className="flex items-center justify-between flex-row-reverse w-full">
      
  {/* دکمه خرید/فروش سمت راست */}
  <Link
    to={`${ROUTES.TRADE.BUY}?coin=${coin.symbol}`}
    className="bg-blue2 text-white rounded-lg px-4 py-1.5 text-sm border border-transparent 
               hover:bg-transparent hover:border-blue2 hover:text-blue2 transition duration-200 ease-in font-bold whitespace-nowrap mr-3"
  >
    خرید/فروش
  </Link> 
    <div className="flex items-center overflow-hidden">

       {/* آیکن سمت چپ */}
  <img
    src={coin.image ? `https://api.payfa24.org/images/currency/${coin.image}` : "/images/fallback-coin.png"}
    className="w-10 h-10 object-contain flex-shrink-0 ml-3 
             max-w-full max-h-full overflow-hidden"
    alt={coin.symbol}
  />
           {/* بخش اسم و نماد وسط */}
  <div className="flex flex-col text-right overflow-hidden ">
  <div className="text-lg font-semibold text-black1
            truncate overflow-hidden text-ellipsis whitespace-nowrap text-right max-w-[120px]">
  {coin.name || coin.symbol}
</div>

    <span className="text-sm font-medium text-gray35">{coin.symbol}</span>
  </div>
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
