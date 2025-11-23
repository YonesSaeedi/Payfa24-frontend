import CryptoWithdrawForm from "../../components/Withdrawal/CryptoWithdrawForm";
import IconWarning from "../../assets/icons/trade/IconWarning";

export default function WithdrawCrypto() {
  const alertList = [
    "لطفا در صورت استفاده از فیلترشکن آن را خاموش کنید."
  ];

  return (
    <div>
      <CryptoWithdrawForm />

      <div dir="rtl" className="bg-orange5 rounded-xl p-4 text-sm text-left w-full mt-6">
        <h3 className="text-orange1 flex items-left gap-1 mb-2">
          <span className="w-5 h-5 text-orange1">
            <IconWarning />
          </span>
          توجه داشته باشید
        </h3>

        <ul className="list-disc list-inside text-black1 space-y-1 p-1">
          {alertList.map((alert, index) => (
            <li key={index} className="text-right">{alert}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

