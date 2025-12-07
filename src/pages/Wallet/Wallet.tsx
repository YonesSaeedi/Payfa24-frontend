import WalletCard from "../../components/Home/WalletCard/WalletCard";
import HeaderLayout from "../../layouts/HeaderLayout";
import WalletAssets from "../../components/Wallet/WalletAssets";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Dashboard } from "../../types/api/dashboard";
import { apiRequest } from "../../utils/apiClient";
import WalletPieChart from "../../components/Wallet/WalletPieChart";

export default function Wallet() {
  const [dashboardData, setDashboardData] = useState<Dashboard | null>(null);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState<boolean>(false);
  // fetch dashboard data =================================================================================================================
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoadingDashboard(true);
        const response = await apiRequest<Dashboard>({ url: "/dashboard/web" });
        setDashboardData(response);
      } catch (err) {
        toast.error((err as AxiosError<{ msg: string }>)?.response?.data?.msg || "دریافت اطلاعات داشبورد با مشکل مواجه شد.");
      } finally {
        setIsLoadingDashboard(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="h-full w-full">
      <HeaderLayout>
        <div className="container-style lg:px-4 w-full  pt-10 flex flex-col lg:flex-row-reverse gap-[33px] overflow-visible">
          <div className="w-full lg:w-5/12 text-right">
          <div>
        <WalletCard
  isLoading={isLoadingDashboard}
  walletData={dashboardData?.wallets}
  showConvert={true}  // نمایش دکمه تبدیل
  showBuySell={false} // مخفی کردن دکمه‌های خرید و فروش
/>

 <WalletPieChart  />
          </div>
            
          </div>
          <div className="w-full lg:w-7/12">
            {/* <p className="text-black2 lg:pb-7 pb-3 text-right align-middle text-lg font-bold">دارایی های شما</p> */}

            <WalletAssets />
          </div>
        </div>
      </HeaderLayout>
    </div>
  );
}
