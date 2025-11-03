import { useEffect, useMemo } from "react";
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

function HomePage() {
  const { data: generalData, isLoading: generalDataIsLoading } = useGetGeneralInfo()
  const { data: cryptoData, isLoading: cryptoDataIsLoading } = useGetCryptoData()
  const isLoading = generalDataIsLoading || cryptoDataIsLoading
  // computes an object with keys of crypto symbols and memoize it ======================================================================================
  const mappedGeneralData = useMemo(() => {
    return generalData?.cryptocurrency?.reduce((acc, item) => {
      acc[item.symbol] = item
      return acc
    }, {} as CryptoDataMap)
  }, [generalData])
  // function that returns merged data (general info + list-cryptocurrencies) about crypto currencies; and memoizing ======================================
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
  // preparing lists ====================================================================================================================================
  const gainers = Object.values(mergedCryptosData).sort((item1, item2) => Number(item2.priceChangePercent) - Number(item1.priceChangePercent))
  const losers = Object.values(mergedCryptosData).sort((item1, item2) => Number(item1.priceChangePercent) - Number(item2.priceChangePercent))
  const mostTraded = Object.values(mergedCryptosData).sort((item1, item2) => Number(item2.quoteVolume) - Number(item1.quoteVolume))
  const newest = Object.values(mergedCryptosData).sort((item1, item2) => Number(item2.id) - Number(item1.id))
  const cryptoBoxes = [
    {
      header: "تازه های بازار",
      headerIcon: <Fire />,
      slides: newest.slice(0, 4),
    },
    {
      header: "بیشترین افت قیمت",
      headerIcon: <span className="w-6 h-6 icon-wrapper text-red1"><TrendDownIcon /></span>,
      slides: losers.slice(0, 4),
    },
    {
      header: "بیشترین افزایش قیمت",
      headerIcon: <span className="text-green2 icon-wrapper"><TrendIcon /></span>,
      slides: gainers.slice(0, 4)
    },
    {
      header: "بیشترین حجم معامله",
      headerIcon: <span className="w-6 h-6 icon-wrapper"><MostDeal /></span>,
      slides: mostTraded.slice(0, 4),
    },
  ];
  // firebase stuff, Javad kenevisi knows =================================================================================================================
  // 1️⃣ ارسال توکن به سرور (فقط اگر مرورگر پشتیبانی کند)
  useEffect(() => {
    const sendTokenToServer = async () => {
      if (typeof window === "undefined") return; // SSR safe
      const supported = await isSupported();
      if (!supported) return; // مرورگر FCM را پشتیبانی نمی‌کند
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
  // 2️⃣ گوش دادن به پیام‌های foreground
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

  return (
    <div>
      <HeaderFooterLayout>
        <div className="bg-white1 text-text">
          <div className="container-style" >
            <div className="pt-8 pb-12 flex flex-col lg:flex-row-reverse justify-between gap-4">
              <div className="w-full lg:w-1/2 h-full"><WalletCard /></div>
              <IdentityCard
                title="احراز هویت سطح 1"
                items={["مشخصات فردی", "تصویر مدرک شناسایی"]}
                accesses={["مشاهده قیمت‌ها", "خرید و فروش رمز ارزها"]}
                onClick={() => console.log("start identity")}
              />
            </div>
            <div className="flex flex-col lg:flex-row-reverse justify-between gap-4 pb-10 ">
              <PosterSlider />
              <InvitationCard />
            </div>
            <div id="SyncSlider" className="pt-12 pb-12">
              <SyncSlider boxes={cryptoBoxes} isLoading={isLoading} />
            </div>
            <div className="w-full pt-7">
              <CryptoTable data={Object.values(mergedCryptosData)} isLoading={isLoading} />
            </div>
            <div id="qustionBox" className="pt-12 lg:pb-28 pb-14">
              <QuestionBox />
            </div>
          </div>
        </div>
      </HeaderFooterLayout>
    </div>
  );
}

export default HomePage;
