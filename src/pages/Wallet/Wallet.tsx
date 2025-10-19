import WalletCard from "../../Components/Home/WalletCard/WalletCard";
import HeaderLayout from "../../layouts/HeaderLayout";
import WalletAssets from "../../Components/Wallet/WalletAssets"



export default function Wallet() {


  return (
    <div className="h-full w-full">
      <HeaderLayout>
        <div className="container-style lg:px-4 w-full  pt-16 flex flex-col lg:flex-row-reverse gap-10 overflow-visible">
          <div className="w-full lg:w-5/12 text-right">
            <WalletCard
              showBuySell={false}
            />
          </div>
          <div className="w-full lg:w-7/12">
            <p className="text-black2 pb-7 font-bold text-[18px] leading-[100%] tracking-[0%] text-right align-middle">
              دارایی های شما
            </p>

            <WalletAssets />
          </div>
        </div>
      </HeaderLayout>
    </div>
  );
}
