import WalletCard from "../../Components/Home/WalletCard/WalletCard";
import HeaderLayout from "../../layouts/HeaderLayout";
import WalletAssets from "../../Components/Wallet/WalletAssets"
export default function Wallet() {
  return (
    <div className="h-full">
      <HeaderLayout>
        <div className="p-6 pt-16 container-style flex flex-col lg:flex-row-reverse gap-10">
          <div className="w-full lg:w-auto text-right">
            <WalletCard
              balance={1000000}
              changeAmount={5000}
              change={2.3}
              showBuySell={false}
            />
          </div>
          <div className="w-full lg:w-auto">
            <p className="pb-7 font-bold text-[18px] leading-[100%] tracking-[0%] text-right align-middle">
              دارایی های شما
            </p>

            <WalletAssets />
          </div>
        </div>
      </HeaderLayout>
    </div>
  );
}
