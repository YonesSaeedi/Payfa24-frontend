import { Controller, useForm } from "react-hook-form";
import { useState, useEffect, useCallback, useMemo } from "react";
import FloatingSelect from "../FloatingInput/FloatingSelect";
import IconMonnos from "../../assets/Icons/Deposit/IconMonnos";
import IconVideo from "../../assets/Icons/Deposit/IconVideo";
import QrCode from "../../assets/images/QRcode.png";
import IconCopy from "../../assets/Icons/AddFriend/IconCopy";
import TextField from "../InputField/TextField";
import Accordion from "../Withdrawal/Accordion";
import { apiRequest } from "../../utils/apiClient";
import { CryptoItem } from "../../types/crypto";
import CryptoListModal from "../trade/CryptoListModal";
import useGetGeneralInfo from "../../hooks/useGetGeneralInfo";

const NETWORK_OPTIONS = [
  { value: "trc20", label: "ترون (TRC20)" },
  { value: "ton", label: "تن (TON)" },
  { value: "erc20", label: "اتریوم (ERC20)" },
  { value: "polygon", label: "پالیگان" },
];

const INITIAL_CURRENCY = {
  name: "مونوس",
  icon: "", // فقط URL یا خالی
  symbol: "MONOS",
  price: 0,
};

const formatPersianDigits = (num: number | string) => {
  const number = Number(num);
  if (isNaN(number)) return "۰";
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  return number.toString().replace(/\d/g, (d) => persianDigits[parseInt(d)]);
};

export default function DepositWithTxID() {
  const [isCryptoListModalOpen, setIsCryptoListModalOpen] = useState(false);
  const [cryptoListData, setCryptoListData] = useState<CryptoItem[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState(INITIAL_CURRENCY);
  const [isDepositCoinsLoading, setIsDepositCoinsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { control, watch } = useForm();
  const { data: generalInfo, isLoading: isGeneralInfoLoading } = useGetGeneralInfo();

  const selectedNetwork = watch("network");
  const selectedNetworkLabel = useMemo(
    () =>
      NETWORK_OPTIONS.find((opt) => opt.value === selectedNetwork)?.label ||
      "انتخاب شبکه",
    [selectedNetwork]
  );

  // 🟩 داده‌ها را به محض آماده‌شدن generalInfo واکشی می‌کنیم
  const fetchAndMergeCryptoData = useCallback(async () => {
    setIsDepositCoinsLoading(true);
    try {
      const depositRes = await apiRequest({
        url: "/api/wallets/crypto/deposit",
        method: "GET",
      });

      const depositCoins = depositRes?.coins ?? [];
      const infoCoins = generalInfo?.cryptocurrency ?? [];

      const merged: CryptoItem[] = depositCoins.map((coin: any) => {
        const info = infoCoins.find(
          (i: any) => i.symbol.toLowerCase() === coin.symbol.toLowerCase()
        );

        const priceString = (Number(coin.price) || 0).toString();

        return {
          ...info,
          priceBuy: priceString,
        } as CryptoItem;
      });

      setCryptoListData(merged);

      // 🟦 اولین ارز را به‌صورت پیش‌فرض در input نمایش بده
      if (merged.length > 0) {
        const first = merged[0];
        setSelectedCurrency({
          name: first.locale?.fa?.name || first.symbol || "نام ناشناس",
          icon: first.icon || "",
          symbol: first.symbol || "UNK",
          price: Number(first.priceBuy) || Number(first.price) || 0,
        });
      }

      console.log("Merged data:", merged);
    } catch (err) {
      console.error("خطا در دریافت ارزها:", err);
    } finally {
      setIsDepositCoinsLoading(false);
    }
  }, [generalInfo]);

  // 🟩 وقتی generalInfo آماده شد، داده‌ها را واکشی کن
  useEffect(() => {
    if (generalInfo && !isDepositCoinsLoading && cryptoListData.length === 0) {
      fetchAndMergeCryptoData();
    }
  }, [generalInfo, isDepositCoinsLoading, cryptoListData.length, fetchAndMergeCryptoData]);

  const openCryptoListModal = () => {
    // داده‌ها از قبل آماده است، فقط مدال را باز می‌کنیم
    setIsCryptoListModalOpen(true);
  };

  const handleCurrencySelect = (crypto: CryptoItem) => {
  setSelectedCurrency({
    name: crypto.locale?.fa?.name || crypto.symbol || "نام ناشناس",
    symbol: crypto.symbol || "UNK",
    price: Number(crypto.priceBuy) || Number(crypto.price) || 0,
    isFont: crypto.isFont || false,
    color: crypto.color || "#000",
    icon: crypto.icon || "",
  });

  setIsCryptoListModalOpen(false);
};


  return (
    <div className="w-full" dir="rtl">
      {/* ویدیو آموزشی */}
      <div className="mb-8 bg-blue14 text-blue2 flex items-center p-3 rounded-lg gap-2">
        <span className="icon-wrapper w-6 h-6 text-blue2">
          <IconVideo />
        </span>
        <span>ویدیو آموزشی واریز با TxID</span>
      </div>

      {/* انتخاب ارز */}
      <Controller
        name="currency"
        control={control}
        rules={{ required: "لطفا یک ارز انتخاب کنید" }}
        render={({ field }) => (
          <FloatingSelect
            placeholder={selectedCurrency.name}
            label="انتخاب رمز ارز"
            options={[]}
            value={selectedCurrency.symbol}
            onChange={field.onChange}
            onOpen={openCryptoListModal}
            placeholderIcon={
  selectedCurrency.isFont ? (
    <i
      className={`cf cf-${selectedCurrency.symbol?.toLowerCase()}`}
      style={{ color: selectedCurrency.color, fontSize: "28px" }}
    ></i>
  ) : selectedCurrency.icon ? (
    <img
      src={`https://api.payfa24.org/images/currency/${selectedCurrency.icon}`}
      alt={selectedCurrency.symbol}
      className="w-7 h-7 rounded-full object-contain"
    />
  ) : (
    <IconMonnos />
  )
}

            placeholderClasses="text-black0"
          />
        )}
      />

      {selectedCurrency && (
        <div className="flex justify-between mt-2 mb-10">
          <span className="text-sm text-gray5">قیمت ارز</span>
          <span className="text-sm text-black0">
            {formatPersianDigits(selectedCurrency.price)} تومان
          </span>
        </div>
      )}

      {/* انتخاب شبکه */}
      <Controller
        name="network"
        control={control}
        rules={{ required: "لطفا یک شبکه انتخاب کنید" }}
        render={({ field }) => (
          <FloatingSelect
            placeholder={selectedNetworkLabel}
            label="انتخاب شبکه"
            options={NETWORK_OPTIONS}
            value={field.value}
            onChange={(val) => field.onChange(val)}
            onOpen={() => console.log("Network dropdown open")}
          />
        )}
      />

      {/* حداقل واریز */}
      <div className="flex justify-between mt-2 mb-10">
        <span className="text-sm text-gray5">حداقل واریز</span>
        <span className="text-sm text-black0">Monos 1</span>
      </div>

      {/* QR Code و آدرس ولت */}
      <div className="rounded-lg border mb-10 border-gray19 py-6 px-4 flex flex-col justify-center items-center gap-6">
        <img className="w-32 h-32" src={QrCode} alt="QrCode" />
        <div className="flex justify-between w-full">
          <span className="text-gray5 text-xs lg:text-sm">آدرس ولت</span>
          <div className="flex items-center gap-1 justify-between">
            <span className="text-black0 lg:text-sm text-xs">
              373HD32HDKDIUWUEuyei877IIJDD
            </span>
            <span className="icon-wrapper lg:w-5 lg:h-5 w-4 h-4 text-gray5">
              <IconCopy />
            </span>
          </div>
        </div>
      </div>

      {/* TxID */}
      <Controller
        name="txid"
        control={control}
        render={({ field }) => (
          <TextField
            label="لینک تراکنش TxID"
            type={showPassword ? "text" : "password"}
            onIconClick={() => setShowPassword((prev) => !prev)}
            {...field}
            labelBgClass="lg:bg-gray43 bg-white4"
            inputBgClass="lg:bg-gray43 bg-white4"
          />
        )}
      />

      {/* ثبت اطلاعات و راهنما */}
      <div className="lg:mt-14 mt-8 mb-10">
        <button className="text-white2 bg-blue2 w-full py-3 font-bold text-lg rounded-lg">
          ثبت اطلاعات
        </button>

        <div className="mt-4" dir="ltr">
          <Accordion title="TxID راهنمای واریز رمز ارز با ">
            <ul className="list-disc pr-5 space-y-2 text-black1">
              <li>
                از صحت آدرس صفحه‌ پرداخت و بودن در یکی از سایت‌های سامانه‌ی شاپرک مطمئن شوید.
              </li>
              <li>مطمئن شوید مبلغ نمایش‌ داده‌شده در صفحه‌ی پرداخت درست باشد.</li>
            </ul>
          </Accordion>
        </div>
      </div>

      {/* مدال */}
      {isCryptoListModalOpen && (
        <CryptoListModal
          cryptoListData={cryptoListData}
          setIsCryptoListModalOpen={setIsCryptoListModalOpen}
          setCurrentCryptoCurrency={handleCurrencySelect}
          isCryptoListLoading={isGeneralInfoLoading || isDepositCoinsLoading}
        />
      )}
    </div>
  );
}
