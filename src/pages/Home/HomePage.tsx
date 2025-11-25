// import { useEffect, useMemo, useRef, useState } from "react";
// import Fire from "../../assets/icons/Home/SynchronizedSlidersIcon/fireIcon";
// import TrendDownIcon from "../../assets/icons/Home/SynchronizedSlidersIcon/TrendDownIcon";
// import TrendIcon from "../../assets/icons/Home/SynchronizedSlidersIcon/TrendIcon";
// import HeaderFooterLayout from "../../layouts/HeaderFooterLayout";
// import WalletCard from "../../components/Home/WalletCard/WalletCard";
// import IdentityCard from "../../components/Home/IdentityCard";
// import PosterSlider from "../../components/Home/PosterSlider";
// import InvitationCard from "../../components/Home/InvitationCard";
// import SyncSlider from "../../components/Home/SynchronizedSliders";
// import CryptoTable from "../../components/Home/CryptoTable";
// import QuestionBox from "../../components/Home/QuestionBox/QuestionBox";
// import MostDeal from "../../assets/icons/Home/SynchronizedSlidersIcon/MostDeal";
// import { toast } from "react-toastify";
// import { apiRequest } from "../../utils/apiClient";
// import { requestFirebaseToken } from "../../firebase/messaging";
// import { getMessaging, isSupported, onMessage } from "firebase/messaging";
// import useGetGeneralInfo from "../../hooks/useGetGeneralInfo";
// import useGetCryptoData from "../../hooks/useGetCryptoData";
// import { CryptoDataMap } from "../../types/crypto";
// import { AxiosError } from "axios";
// import { Dashboard } from "../../types/api/dashboard";
// import PopularAssetsBoxes from "../../components/Home/PopularAssetsBoxes";

// function HomePage() {
//   const [dashboardData, setDashboardData] = useState<Dashboard | null>(null)
//   const [isLoadingDashboard, setIsLoadingDashboard] = useState<boolean>(false)
//   const { data: generalData, isLoading: generalDataIsLoading } = useGetGeneralInfo()
//   const { data: cryptoData, isLoading: cryptoDataIsLoading } = useGetCryptoData()
//   const isLoading = generalDataIsLoading || cryptoDataIsLoading
//   // computes an object with keys of crypto symbols and memoize it ======================================================================================
//   const mappedGeneralData = useMemo(() => {
//     return generalData?.cryptocurrency?.reduce((acc, item) => {
//       acc[item.symbol] = item
//       return acc
//     }, {} as CryptoDataMap)
//   }, [generalData])
//   // function that returns merged data (general info + list-cryptocurrencies) about crypto currencies; and memoizing ======================================
//   function mergeCryptoData(cryptosConstantInfo: CryptoDataMap, cryptosVariableInfo: CryptoDataMap) {
//     const result: CryptoDataMap = {}
//     for (const key of Object.keys(cryptosVariableInfo)) {
//       if (cryptosConstantInfo[key])
//         result[key] = {
//           ...cryptosConstantInfo[key],
//           ...cryptosVariableInfo[key],
//         }
//     }
//     return result
//   }
//   const mergedCryptosData = useMemo(() => {
//     if (
//       mappedGeneralData &&
//       Object.keys(mappedGeneralData).length > 0 &&
//       cryptoData &&
//       Object.keys(cryptoData).length > 0
//     ) {
//       return mergeCryptoData(mappedGeneralData, cryptoData)
//     }
//     return {}
//   }, [mappedGeneralData, cryptoData])
// const identityRef = useRef<HTMLDivElement>(null);
// const walletRef = useRef<HTMLDivElement>(null);

// useEffect(() => {
//   const id = identityRef.current;
//   const wa = walletRef.current;
//   if (!id || !wa) return;

//   const syncHeights = () => {
//     id.style.height = "auto";
//     wa.style.height = "auto";

//     // گرفتن بیشترین ارتفاع
//     const max = Math.max(id.offsetHeight, wa.offsetHeight);

//     // اعمال ارتفاع
//     id.style.height = `${max}px`;
//     wa.style.height = `${max}px`;
//   };

//   // هنگام تغییر سایز محتوا
//   const ro = new ResizeObserver(syncHeights);
//   ro.observe(id);
//   ro.observe(wa);

//   // اجرای اولیه
//   syncHeights();

//   return () => {
//     ro.disconnect();
//   };
// }, [dashboardData]);




  
//   // preparing lists ====================================================================================================================================
//   const gainers = Object.values(mergedCryptosData).sort((item1, item2) => Number(item2.priceChangePercent) - Number(item1.priceChangePercent))
//   const losers = Object.values(mergedCryptosData).sort((item1, item2) => Number(item1.priceChangePercent) - Number(item2.priceChangePercent))
//   const mostTraded = Object.values(mergedCryptosData).sort((item1, item2) => Number(item2.quoteVolume) - Number(item1.quoteVolume))
//   const newest = Object.values(mergedCryptosData).sort((item1, item2) => Number(item2.id) - Number(item1.id))
//   const cryptoBoxes = [
//     {
//       header: "تازه های بازار",
//       headerIcon: <Fire />,
//       slides: newest.slice(0, 4),
//     },
//     {
//       header: "بیشترین افت قیمت",
//       headerIcon: <span className="w-6 h-6 icon-wrapper text-red1"><TrendDownIcon /></span>,
//       slides: losers.slice(0, 4),
//     },
//     {
//       header: "بیشترین افزایش قیمت",
//       headerIcon: <span className="text-green2 icon-wrapper"><TrendIcon /></span>,
//       slides: gainers.slice(0, 4)
//     },
//     {
//       header: "بیشترین حجم معامله",
//       headerIcon: <span className="w-6 h-6 icon-wrapper"><MostDeal /></span>,
//       slides: mostTraded.slice(0, 4),
//     },
//   ];
//   // firebase stuff, Javad kenevisi knows =================================================================================================================
//   // 1 ارسال توکن به سرور (فقط اگر مرورگر پشتیبانی کند)
//   useEffect(() => {
//     const sendTokenToServer = async () => {
//       if (typeof window === "undefined") return; // SSR safe
//       const supported = await isSupported();
//       if (!supported) return; // مرورگر FCM را پشتیبانی نمی‌کند
//       try {
//         const fcmTokenValue = await requestFirebaseToken();
//         if (!fcmTokenValue) return;
//         const savedToken = localStorage.getItem("fcmToken");
//         if (savedToken && savedToken === fcmTokenValue) return;
//         await apiRequest({ url: "/token-firebase", method: "PUT", data: { token: fcmTokenValue } });
//         localStorage.setItem("fcmToken", fcmTokenValue);
//       } catch (err) {
//         console.error("Failed to send token to server", err);
//       }
//     };
//     sendTokenToServer();
//   }, []);

//   useEffect(() => {
//     const initMessaging = async () => {
//       if (typeof window === "undefined") return;
//       const supported = await isSupported();
//       if (!supported) return;
//       const messaging = getMessaging();
//       const unsubscribe = onMessage(messaging, (payload) => {
//         toast.info(payload.notification?.title || "پیام جدید دریافت شد");
//       });
//       return () => unsubscribe();
//     };
//     initMessaging();
//   }, []);
//   // fetch dashboard data =================================================================================================================
//   useEffect(() => {
//     const fetchDashboard = async () => {
//       try {
//         setIsLoadingDashboard(true);
//         const response = await apiRequest<Dashboard>({ url: "/dashboard/web" });
//         setDashboardData(response)
//       } catch (err) {
//         toast.error((err as AxiosError<{ msg: string }>)?.response?.data?.msg || "دریافت اطلاعات داشبورد با مشکل مواجه شد.");
//       } finally {
//         setIsLoadingDashboard(false);
//       }
//     };
//     fetchDashboard();
//   }, []);
//   function mergeTopCoinsWithGeneralInfo(topCoins: Coin[], generalDataMap: CryptoDataMap) {
//   return topCoins.map(coin => {
//     const info = generalDataMap[coin.symbol];
//     return {
//       ...coin,
//       name: info?.name || coin.symbol,
//       image: info ? `/coins/${info.symbol}.png` : undefined,
//       price: coin.price // اگر موجود است
//     };
//   });
// }
// const mergedTopCoins = useMemo(() => {
//   if (!dashboardData?.top_coins || !mappedGeneralData) return [];
//   return mergeTopCoinsWithGeneralInfo(dashboardData.top_coins, mappedGeneralData);
// }, [dashboardData?.top_coins, mappedGeneralData]);


//   return (
//     <div className="bg-white1">
//       <HeaderFooterLayout>
//         <div className="container-style">
//     <div className="pt-8 pb-10 flex flex-col lg:flex-row-reverse gap-6 items-stretch lg:items-start">

//   <div className="w-full lg:w-1/2 h-full">
//   <div ref={walletRef} className="h-full">
//    <WalletCard
//       isLoading={isLoadingDashboard}
//       walletData={dashboardData?.wallets}
//     />
//   </div>
// </div>

// <div className="w-full lg:w-1/2 h-full">
//   <div ref={identityRef} className="h-full">
//   <IdentityCard
//   dailyWithdrawalLimit={dashboardData?.dailyWithdrawal?.limit ?? 0}
//   dailyWithdrawalUsage={dashboardData?.dailyWithdrawal?.usage ?? 0}
// />


//   </div>
// </div>
// </div>
// <div className="pb-10">
//   <PopularAssetsBoxes topCoins={mergedTopCoins}/>
// </div>
//           <div className="flex flex-col lg:flex-row-reverse justify-between gap-[27px] lg:pb-[49px] pb-[40px]">
//             <PosterSlider isLoading={isLoadingDashboard} bannersData={dashboardData?.banner?.banner} />
//             <InvitationCard />
//           </div>
//           <div id="SyncSlider" className="pb-[61px]">
//             <SyncSlider boxes={cryptoBoxes} isLoading={isLoading} />
//           </div>
//           <div className="w-full ">
//             <CryptoTable data={Object.values(mergedCryptosData)} isLoading={isLoading} />
//           </div>
//           <div id="qustionBox" className="pt-[93px]">
//             <QuestionBox />
//           </div>
//         </div>
//       </HeaderFooterLayout>
//     </div>
//   );
// }

// export default HomePage;
import { useEffect, useMemo, useRef, useState } from "react";
import Fire from "../../assets/icons/Home/SynchronizedSlidersIcon/fireIcon";
import TrendDownIcon from "../../assets/icons/Home/SynchronizedSlidersIcon/TrendDownIcon";
import TrendIcon from "../../assets/icons/Home/SynchronizedSlidersIcon/TrendIcon";
import HeaderFooterLayout from "../../layouts/HeaderFooterLayout";
import WalletCard from "../../components/Home/WalletCard/WalletCard";
import IdentityCard from "../../components/Home/IdentityCard";
import PosterSlider from "../../components/Home/PosterSlider";
import InvitationCard from "../../components/Home/InvitationCard";
import SyncSlider from "../../components/Home/SynchronizedSliders";
import CryptoTable from "../../components/Home/CryptoTable";
import QuestionBox from "../../components/Home/QuestionBox/QuestionBox";
import MostDeal from "../../assets/icons/Home/SynchronizedSlidersIcon/MostDeal";
import { toast } from "react-toastify";
import { apiRequest } from "../../utils/apiClient";
import { requestFirebaseToken } from "../../firebase/messaging";
import { getMessaging, isSupported, onMessage } from "firebase/messaging";
import useGetGeneralInfo from "../../hooks/useGetGeneralInfo";
import useGetCryptoData from "../../hooks/useGetCryptoData";
import { CryptoDataMap } from "../../types/crypto";
import { AxiosError } from "axios";
import { Dashboard } from "../../types/api/dashboard";
import PopularAssetsBoxes from "../../components/Home/PopularAssetsBoxes";


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

function HomePage() {
  const [dashboardData, setDashboardData] = useState<Dashboard | null>(null)
  const [isLoadingDashboard, setIsLoadingDashboard] = useState<boolean>(false)
  const { data: generalData, isLoading: generalDataIsLoading } = useGetGeneralInfo()
  const { data: cryptoData, isLoading: cryptoDataIsLoading } = useGetCryptoData()
  const isLoading = generalDataIsLoading || cryptoDataIsLoading

  const mappedGeneralData = useMemo(() => {
    return generalData?.cryptocurrency?.reduce((acc, item) => {
      acc[item.symbol] = item
      return acc
    }, {} as CryptoDataMap)
  }, [generalData])

  function mergeCryptoData(cryptosConstantInfo: CryptoDataMap, cryptosVariableInfo: CryptoDataMap) {
    const result: CryptoDataMap = {}
    for (const key of Object.keys(cryptosVariableInfo)) {
      if (cryptosConstantInfo[key])
        result[key] = {
          ...cryptosConstantInfo[key],
          ...cryptosVariableInfo[key],
        }
    }
    return result
  }

  const mergedCryptosData = useMemo(() => {
    if (
      mappedGeneralData &&
      Object.keys(mappedGeneralData).length > 0 &&
      cryptoData &&
      Object.keys(cryptoData).length > 0
    ) {
      return mergeCryptoData(mappedGeneralData, cryptoData)
    }
    return {}
  }, [mappedGeneralData, cryptoData])

  const identityRef = useRef<HTMLDivElement>(null);
  const walletRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = identityRef.current;
    const wa = walletRef.current;
    if (!id || !wa) return;

    const syncHeights = () => {
      id.style.height = "auto";
      wa.style.height = "auto";
      const max = Math.max(id.offsetHeight, wa.offsetHeight);
      id.style.height = `${max}px`;
      wa.style.height = `${max}px`;
    };

    const ro = new ResizeObserver(syncHeights);
    ro.observe(id);
    ro.observe(wa);
    syncHeights();

    return () => { ro.disconnect(); }
  }, [dashboardData]);

  // آماده‌سازی لیست‌ها
  const gainers = Object.values(mergedCryptosData).sort((item1, item2) => Number(item2.priceChangePercent) - Number(item1.priceChangePercent))
  const losers = Object.values(mergedCryptosData).sort((item1, item2) => Number(item1.priceChangePercent) - Number(item2.priceChangePercent))
  const mostTraded = Object.values(mergedCryptosData).sort((item1, item2) => Number(item2.quoteVolume) - Number(item1.quoteVolume))
  const newest = Object.values(mergedCryptosData).sort((item1, item2) => Number(item2.id) - Number(item1.id))
  const cryptoBoxes = [
    { header: "تازه های بازار", headerIcon: <Fire />, slides: newest.slice(0, 4) },
    { header: "بیشترین افت قیمت", headerIcon: <span className="w-6 h-6 icon-wrapper text-red1"><TrendDownIcon /></span>, slides: losers.slice(0, 4) },
    { header: "بیشترین افزایش قیمت", headerIcon: <span className="text-green2 icon-wrapper"><TrendIcon /></span>, slides: gainers.slice(0, 4) },
    { header: "بیشترین حجم معامله", headerIcon: <span className="w-6 h-6 icon-wrapper"><MostDeal /></span>, slides: mostTraded.slice(0, 4) },
  ];

  // firebase
  useEffect(() => {
    const sendTokenToServer = async () => {
      if (typeof window === "undefined") return;
      const supported = await isSupported();
      if (!supported) return;
      try {
        const fcmTokenValue = await requestFirebaseToken();
        if (!fcmTokenValue) return;
        const savedToken = localStorage.getItem("fcmToken");
        if (savedToken && savedToken === fcmTokenValue) return;
        await apiRequest({ url: "/token-firebase", method: "PUT", data: { token: fcmTokenValue } });
        localStorage.setItem("fcmToken", fcmTokenValue);
      } catch (err) {
        console.error("Failed to send token to server", err);
      }
    };
    sendTokenToServer();
  }, []);

  useEffect(() => {
    const initMessaging = async () => {
      if (typeof window === "undefined") return;
      const supported = await isSupported();
      if (!supported) return;
      const messaging = getMessaging();
      const unsubscribe = onMessage(messaging, (payload) => {
        toast.info(payload.notification?.title || "پیام جدید دریافت شد");
      });
      return () => unsubscribe();
    };
    initMessaging();
  }, []);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoadingDashboard(true);
        const response = await apiRequest<Dashboard>({ url: "/dashboard/web" });
        setDashboardData(response)
      } catch (err) {
        toast.error((err as AxiosError<{ msg: string }>)?.response?.data?.msg || "دریافت اطلاعات داشبورد با مشکل مواجه شد.");
      } finally {
        setIsLoadingDashboard(false);
      }
    };
    fetchDashboard();
  }, []);

  // merge top coins with general info
function mergeTopCoinsWithGeneralInfo(topCoins: Coin[], generalDataMap: CryptoDataMap): MergedCoin[] {
  return topCoins.map(coin => {
    const info = generalDataMap[coin.symbol];
    return {
      ...coin,
      name: info?.locale?.fa?.name || info?.name || coin.symbol, 
      image: info?.icon || undefined, 
      price: coin.price
    };
  });
}



  const mergedTopCoins = useMemo(() => {
    if (!dashboardData?.top_coins || !mappedGeneralData) return [];
    return mergeTopCoinsWithGeneralInfo(dashboardData.top_coins, mappedGeneralData);
  }, [dashboardData?.top_coins, mappedGeneralData]);

  return (
    <div className="bg-white1">
      <HeaderFooterLayout>
        <div className="container-style">
          <div className="pt-8 pb-10 flex flex-col lg:flex-row-reverse gap-6 items-stretch lg:items-start">
            <div className="w-full lg:w-1/2 h-full">
              <div ref={walletRef} className="h-full">
                <WalletCard
                  isLoading={isLoadingDashboard}
                  walletData={dashboardData?.wallets}
                />
              </div>
            </div>

            <div className="w-full lg:w-1/2 h-full">
              <div ref={identityRef} className="h-full">
                <IdentityCard
                  dailyWithdrawalLimit={dashboardData?.dailyWithdrawal?.limit ?? 0}
                  dailyWithdrawalUsage={dashboardData?.dailyWithdrawal?.usage ?? 0}
                />
              </div>
            </div>
          </div>

          <div className="pb-10">
            <PopularAssetsBoxes topCoins={mergedTopCoins} />
          </div>

          <div className="flex flex-col lg:flex-row-reverse justify-between gap-[27px] lg:pb-[49px] pb-[40px]">
            <PosterSlider isLoading={isLoadingDashboard} bannersData={dashboardData?.banner?.banner} />
            <InvitationCard />
          </div>

          <div id="SyncSlider" className="pb-[61px]">
            <SyncSlider boxes={cryptoBoxes} isLoading={isLoading} />
          </div>

          <div className="w-full ">
            <CryptoTable data={Object.values(mergedCryptosData)} isLoading={isLoading} />
          </div>

          <div id="qustionBox" className="pt-[93px]">
            <QuestionBox />
          </div>
        </div>
      </HeaderFooterLayout>
    </div>
  );
}

export default HomePage;
