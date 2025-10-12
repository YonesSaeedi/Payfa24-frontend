import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useOutletContext } from "react-router";
import IconArrowBottomLeft from "../../assets/icons/trade/IconArrowBottomLeft";
import IconArrowTopLeft from "../../assets/icons/trade/IconArrowTopLeft";
import IconBorderedPlus from "../../assets/icons/trade/IconBorderedPlus";
import { formatPersianDigits } from "../../utils/formatPersianDigits";
import IconChevron from "../../assets/Icons/trade/IconChevron";
import CryptoListModal from "./CryptoListModal";
import PercentBar from "./PercentBar";
import { toast } from "react-toastify";
import { apiRequest } from "../../utils/apiClient";
import { CryptoBuy, FiatBalance, TradeSymbolResponse } from "../../types/apiResponses";
import useGetGeneralInfo from "../../hooks/useGetGeneralInfo";
import { CryptoDataMap, CryptoItem, DigitalCurrency, OrderInfoCryptoDataMap } from "../../types/crypto";
import { ROUTES } from "../../routes/routes";
import TradeConfirmationModal from "./TradeConfirmationModal";
import { TradeConfirmationData } from "../../types/tradePage";
import TradeCancelModal from "./TradeCancelModal";
import TradeSuccessModal from "./TradeSuccessModal";
import useGetOrderInfo from "../../hooks/useGetOrderInfo";
import { mappedDigitalGeneralData } from "../../constants/ListdigitalCoins";
import OTPModal from "../OTPModal";
import OTPInputModal from "./OTPInputModal";
import useGetUser from "../../hooks/useGetUser";
import useGetSettings from "../../hooks/useGetSettings";
import { formatTime } from "../../utils/formatTime";

const BuyAndSell = ({ isSell = false }: { isSell: boolean }) => {
  const countInputRef = useRef<HTMLInputElement | null>(null)
  const amountInputRef = useRef<HTMLInputElement | null>(null)
  const voucherCodeInputRef = useRef<HTMLInputElement | null>(null)
  const lastChangedRef = useRef<'percent' | 'input' | null>(null);
  const [countInputStr, setCountInputStr] = useState<string>("");
  const [amountValue, setAmountValue] = useState<number | ''>('')
  const [selectedPercent, setSelectedPercent] = useState<number>(0)
  const [isCryptoListModalOpen, setIsCryptoListModalOpen] = useState<boolean>(false)
  const [isTradeConfirmationModalOpen, setIsTradeConfirmationModalOpen] = useState<boolean>(false)
  const [TradeConfirmationModalData, setTradeConfirmationModalData] = useState<TradeConfirmationData | null>(null)
  const [isTradeCancelModalOpen, setIsTradeCancelModalOpen] = useState<boolean>(false)
  const [isTradeSuccessModalOpen, setIsTradeSuccessModalOpen] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [TomanBalance, setTomanBalance] = useState<number | null>(null)
  const [currentCryptoPrice, setCurrentCryptoPrice] = useState<number | null>(null)
  const [cryptoBalance, setCryptoBalance] = useState<number | null>(null)
  const [voucherCode, setVoucherCode] = useState<string>('')
  const [isOtpModalOpen, setIsOtpModalOpen] = useState<boolean>(false)
  const [otpCode, setOtpCode] = useState<string>('')
  const [resendCodeIsSubmitting, setResendCodeIsSubmitting] = useState<boolean>(false)
  const [resendCodeTimeLeft, setResendCodeTimeLeft] = useState<number>(0)
  const [digitalIDOrder, setDigitalIDOrder] = useState<number | null>(null)
  const { currentCryptocurrency, setCurrentCryptocurrency } = useOutletContext<{ currentCryptocurrency: CryptoItem | null; setCurrentCryptocurrency: React.Dispatch<React.SetStateAction<CryptoItem | null>>; }>();
  const persianToEnglish = (input: string) => input.replace(/[۰-۹]/g, d => String(d.charCodeAt(0) - 1776)).replace(/,/g, "");
  // handles count input change ============================================================================================================================
  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    lastChangedRef.current = 'input';
    let val = persianToEnglish(e.target.value)
      .replace(/[^0-9.]/g, '')      // only numbers + dot
      .replace(/(\..*)\./g, '$1');  // prevent multiple dots
    let num = Number(val);
    if (!isNaN(num) && val !== '' && val !== '.') {
      const max = isSell
        ? cryptoBalance
        : TomanBalance / currentCryptoPrice;
      if (num > max) {
        num = max;
        val = String(Math.round(max * 1e8) / 1e8);
      }
      setCountInputStr(val);
      setAmountValue(Math.round(num * currentCryptoPrice * 100) / 100);
    } else {
      setCountInputStr(val);
      setAmountValue(0);
    }
  };
  // handles amount input change =============================================================================================================================
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    lastChangedRef.current = 'input';
    const val = persianToEnglish(e.target.value).replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    let num = val === '' ? 0 : Number(val);
    if (!isSell && num > TomanBalance) num = TomanBalance
    else if (isSell && num > cryptoBalance * currentCryptoPrice) num = cryptoBalance * currentCryptoPrice
    const rounded = Math.round(num * 100) / 100;
    setAmountValue(rounded);
    setCountInputStr(String(Math.round((rounded / currentCryptoPrice) * 1e8) / 1e8));
  };
  // handles filling the count input by 'all balance' button ====================================================================================================
  const handleFillCount = () => {
    if (!cryptoBalance) return
    const roundedCount = isSell ? cryptoBalance : Math.round((TomanBalance / currentCryptoPrice) * 1e8) / 1e8;
    setCountInputStr(String(roundedCount));
    setAmountValue(Math.round((roundedCount * currentCryptoPrice) * 100) / 100);
    setSelectedPercent(100)
  };
  // handles filling the amount input by 'all balance' button ====================================================================================================
  const handleFillAmount = () => {
    if (!TomanBalance) return
    const roundedAmount = isSell ? Math.round(cryptoBalance * currentCryptoPrice * 100) / 100 : TomanBalance;
    setAmountValue(roundedAmount);
    setCountInputStr(String(Math.round((roundedAmount / currentCryptoPrice) * 1e8) / 1e8));
    setSelectedPercent(100)
  };
  // syncing the percent bar and inputs together =============================================================================================================
  useEffect(() => {
    if (lastChangedRef.current === 'input') {
      // User typed → update percent only
      let percent;
      if (isSell) {
        percent = cryptoBalance ? (Number(countInputStr) / cryptoBalance) * 100 : 0;
      } else {
        percent = TomanBalance ? (Number(amountValue) / TomanBalance) * 100 : 0;
      }
      const roundedPercent = Math.round(percent * 100) / 100;
      if (roundedPercent !== selectedPercent) {
        setSelectedPercent(roundedPercent);
      }
    } else if (lastChangedRef.current === 'percent') {
      // Percent changed => update inputs
      if (selectedPercent === 0) {
        setCountInputStr("0");
        setAmountValue(0);
      } else if (isSell) {
        const newCount = Math.round((cryptoBalance * selectedPercent / 100) * 1e8) / 1e8;
        const newAmount = Math.round(newCount * currentCryptoPrice * 100) / 100;
        if (Number(countInputStr) !== newCount) setCountInputStr(String(newCount));
        if ((amountValue || 0) !== newAmount) setAmountValue(newAmount);
      } else {
        const newAmount = Math.round((TomanBalance * selectedPercent / 100) * 100) / 100;
        const newCount = Math.round(newAmount / currentCryptoPrice * 1e8) / 1e8;
        if ((amountValue || 0) !== newAmount) setAmountValue(newAmount);
        if (Number(countInputStr) !== newCount) setCountInputStr(String(newCount));
      }
    }
    // Reset the change source after applying
    lastChangedRef.current = null;
  }, [countInputStr, amountValue, selectedPercent, isSell, cryptoBalance, TomanBalance, currentCryptoPrice]);
  // fetch Toman balance and cryptocurrency balance/price at first ================================================================================================================
  const fetchTomanBalance = async () => {
    try {
      setIsLoading(true)
      const response = await apiRequest<FiatBalance>({ url: '/api/wallets/fiat/balance' })
      setTomanBalance(response?.balance_available ?? null)
    } catch (err) {
      toast.error(err?.response?.data?.msg || err?.response?.data?.message || "دریافت موجودی کاربر با مشکل مواجه شد!");
    } finally {
      setIsLoading(false)
    }
  }
  const fetchCryptoBalanceAndPrice = async () => {
    if (currentCryptocurrency) {
      try {
        setIsLoading(true)
        const response = await apiRequest<TradeSymbolResponse>({ url: `/api/order/get-info/${currentCryptocurrency?.symbol}` })
        setCryptoBalance(response?.balance)
        setCurrentCryptoPrice(isSell ? response?.price?.sell : response?.price?.buy)
      } catch (err) {
        toast.error(err?.response?.data?.msg || err?.response?.data?.message || `دریافت اطلاعات ${currentCryptocurrency?.locale?.fa?.name} با مشکل مواجه شد`);
      } finally {
        setIsLoading(false)
      }
    }
  }
  useEffect(() => {
    if (currentCryptocurrency?.type === 'digitalCurrency' || currentCryptocurrency?.type === 'voucher') {
      setCurrentCryptocurrency(mergedDigitalCryptosData[currentCryptocurrency.symbol])
      if (isSell) setCurrentCryptoPrice(Number(currentCryptocurrency.priceSell))
      else {
        setCurrentCryptoPrice(Number(currentCryptocurrency.priceBuy))
        fetchTomanBalance()
      }
    }
    else {
      fetchTomanBalance()
      fetchCryptoBalanceAndPrice()
    }
  }, [isSell, currentCryptocurrency])
  // preparing crypto list modal data ===============================================================================================================================================
  // preparing crypto list modal data ===============================================================================================================================================
  // preparing crypto list modal data ===============================================================================================================================================
  const { data: generalData, isLoading: isGeneralInfoLoading } = useGetGeneralInfo()
  const { data: orderInfoData, isLoading: isOrderInfoDataLoading } = useGetOrderInfo()
  const isCryptoListLoading = isGeneralInfoLoading || isOrderInfoDataLoading
  // computes an object with keys of crypto symbols and memoize it =======================================================================================
  const mappedGeneralData: CryptoDataMap = useMemo(() => {
    return generalData?.cryptocurrency?.reduce((acc, item) => {
      acc[item.symbol] = item
      return acc
    }, {} as CryptoDataMap) ?? {}
  }, [generalData]) // only recalculates when generalData changes  
  // function that returns merged data (general info + list-cryptocurrencies) about crypto currencies; and memoizing ======================================
  function mergeCryptoData(cryptosConstantInfo: OrderInfoCryptoDataMap, cryptosVariableInfo: OrderInfoCryptoDataMap) {
    const result: CryptoDataMap = {}
    for (const key of Object.keys(cryptosVariableInfo)) {
      if (cryptosConstantInfo[key])
        result[key] = {
          ...cryptosConstantInfo[key],
          ...cryptosVariableInfo[key],
          priceBuy: cryptosVariableInfo[key].price?.buy.toString(),
          priceSell: cryptosVariableInfo[key].price?.sell.toString()
        }
    }
    return result
  }
  const mergedCryptosData = useMemo(() => {
    if (
      mappedGeneralData &&
      Object.keys(mappedGeneralData).length > 0 &&
      orderInfoData &&
      typeof orderInfoData === "object"
    ) {
      return mergeCryptoData(mappedGeneralData, orderInfoData.coins)
    }
    return {}
  }, [mappedGeneralData, orderInfoData])
  // computing merged digital currencies if they exist and memoize it ======================================================================================
  const mergeDigitalCurrenciesData = (cryptosConstantInfo: Record<string, DigitalCurrency>, cryptosVariableInfo: Record<string, DigitalCurrency>) => {
    if (!cryptosVariableInfo || Object.keys(cryptosVariableInfo).length === 0) return {};
    else {
      const result: CryptoDataMap = {}
      for (const key of Object.keys(cryptosVariableInfo)) {
        if (cryptosConstantInfo[key])
          result[key] = {
            symbol: cryptosConstantInfo[key].symbol,
            color: cryptosConstantInfo[key].colorCode,
            locale: cryptosConstantInfo[key].locale,
            type: cryptosConstantInfo[key].type,
            icon: cryptosConstantInfo[key].icon,
            priceBuy: cryptosVariableInfo[key].price?.buy.toString(),
            priceSell: cryptosVariableInfo[key].price?.sell.toString()
          }
      }
      return result
    }
  }
  const mergedDigitalCryptosData = useMemo(() => {
    if (
      mappedGeneralData &&
      Object.keys(mappedGeneralData).length > 0 &&
      orderInfoData &&
      typeof orderInfoData === "object"
    ) {
      return mergeDigitalCurrenciesData(mappedDigitalGeneralData, orderInfoData.digitalCurrency)
    }
    return {}
  }, [mappedGeneralData, orderInfoData])
  // assign BTC to the current cryptocurrency at first
  useEffect(() => {
    if ((mergedCryptosData['BTC'] && currentCryptocurrency === null)) setCurrentCryptocurrency(mergedCryptosData['BTC'])
  }, [mergedCryptosData, currentCryptocurrency, setCurrentCryptocurrency])
  // buy/sell functionality ==========================================================================================================================================================
  // buy/sell functionality ==========================================================================================================================================================
  // buy/sell functionality ==========================================================================================================================================================
  const handleBuyOrSell = async () => {
    if (currentCryptocurrency?.type === 'digitalCurrency' || currentCryptocurrency?.type === 'voucher') {
      if (isSell) {
        try {
          setIsSubmitting(true)
          const response = await apiRequest({
            url: `/api/order/digital/sell/${currentCryptocurrency?.locale?.en?.name}`,
            method: 'POST',
            data: { voucherCode: voucherCode }
          })
          // setTradeConfirmationModalData({
          //   coinAmount: response?.amount_coin,
          //   tomanAmount: response?.amount,
          //   symbol: currentCryptocurrency?.symbol ? currentCryptocurrency?.symbol : '',
          //   unitPrice: response?.fee,
          //   orderID: response?.id_order
          // })
          // setIsTradeConfirmationModalOpen(true)
          setIsTradeSuccessModalOpen(true)
        } catch (err) {
          toast.error(err?.response?.data?.msg || err?.response?.data?.message || 'در ثبت سفارش مشکلی پیش آمد.');
        }
        finally {
          setIsSubmitting(false)
        }
      } else {
        try {
          setIsSubmitting(true)
          const response = await apiRequest({ url: `/api/order/digital/buy/${currentCryptocurrency?.locale?.en?.name}`, method: 'POST', data: { amount: String(amountValue) } })
          setDigitalIDOrder(response?.id_order)
          setResendCodeTimeLeft(120)
          setIsOtpModalOpen(true)
          toast.success(response?.msgOtp)
        } catch (err) {
          toast.error(err?.response?.data?.msg || err?.response?.data?.message || 'در ثبت سفارش مشکلی پیش آمد.');
        }
        finally {
          setIsSubmitting(false)
        }
      }
    }
    else if (isSell) {
      try {
        setIsSubmitting(true)
        const response = await apiRequest<CryptoBuy, { amountCoin: string }>({ url: `/api/order/crypto/sell/${currentCryptocurrency?.symbol}`, method: 'POST', data: { amountCoin: countInputStr } })
        setTradeConfirmationModalData({
          coinAmount: response?.amount_coin,
          tomanAmount: response?.amount,
          symbol: currentCryptocurrency?.symbol ? currentCryptocurrency?.symbol : '',
          unitPrice: response?.fee,
          orderID: response?.id_order
        })
        setIsTradeConfirmationModalOpen(true)
      } catch (err) {
        toast.error(err?.response?.data?.msg || err?.response?.data?.message || 'در ثبت سفارش مشکلی پیش آمد.');
      }
      finally {
        setIsSubmitting(false)
      }
    } else {
      try {
        setIsSubmitting(true)
        const response = await apiRequest<CryptoBuy, { amount: string }>({ url: `/api/order/crypto/buy/${currentCryptocurrency?.symbol}`, method: 'POST', data: { amount: String(amountValue) } })
        setTradeConfirmationModalData({
          coinAmount: response?.amount_coin,
          tomanAmount: response?.amount,
          symbol: currentCryptocurrency?.symbol ? currentCryptocurrency?.symbol : '',
          unitPrice: response?.fee,
          orderID: response?.id_order
        })
        setIsTradeConfirmationModalOpen(true)
      } catch (err) {
        toast.error(err?.response?.data?.msg || err?.response?.data?.message || 'در ثبت سفارش مشکلی پیش آمد.');
      }
      finally {
        setIsSubmitting(false)
      }
    }
  }
  // handleSubmitDigitalTrade ==================================================================================================================================================
  const handleSubmitDigitalBuy = async () => {
    try {
      setIsSubmitting(true)
      const response = await apiRequest({ url: `/api/order/digital/buy/${currentCryptocurrency?.locale?.en?.name}`, method: 'POST', data: { amount: String(amountValue), codeOtp: otpCode, id_order: String(digitalIDOrder) } })
      setIsOtpModalOpen(false)
      setIsTradeSuccessModalOpen(true)
    } catch (err) {
      toast.error(err?.response?.data?.msg || err?.response?.data?.message || 'در ثبت سفارش مشکلی پیش آمد.');
    } finally {
      setIsSubmitting(false)
    }
  }
  // handle cancel trade ================================================================================================================================================================
  const handleCancelTrade = () => {
    setIsTradeConfirmationModalOpen(false)
    setIsTradeCancelModalOpen(true)
  }
  //
  const handleCancelDigitalBuy = () => {
    setIsOtpModalOpen(false)
    setIsTradeCancelModalOpen(true)
  }
  // handle success trade ===============================================================================================================================================================
  const handleSuccessTrade = () => {
    setIsTradeConfirmationModalOpen(false)
    setIsTradeSuccessModalOpen(true)
  }
  // compute isDisabled for the percent bar =====================================================================================================================================
  const isDisabled = (isSell && cryptoBalance === 0) || (!isSell && TomanBalance === 0)
  // compute if it's isDigitalCurrencySell or isDigitalCurrency =================================================================================================================
  const isDigitalCurrencySell = (currentCryptocurrency?.type === 'digitalCurrency' || currentCryptocurrency?.type === 'voucher') && isSell
  const isDigitalCurrency = (currentCryptocurrency?.type === 'digitalCurrency' || currentCryptocurrency?.type === 'voucher')
  // data of the OTP modal ======================================================================================================================================================
  const { data: settingsData, isLoading: isSettingsDataLoading } = useGetSettings()
  const { data: userData, isLoading: isUserDataLoading } = useGetUser()
  const OTPModalMainText = settingsData?.twofa?.type === 'sms' ? `کد ارسال شده به شماره ${userData?.user?.mobile} را وارد کنید.`
    : settingsData?.twofa?.type === 'email' ? `کد ارسال شده به ایمیل ${userData?.user?.email} را وارد کنید.`
      : settingsData?.twofa?.type === 'telegram' ? `کد ارسال شده به تلگرام ${userData?.user?.mobile} را وارد کنید.`
        : settingsData?.twofa?.type === 'google' ? `کد ارسال شده به google authenticator را وارد کنید.`
          : ''
  useEffect(() => {
    if (resendCodeTimeLeft <= 0) return;
    const interval = setInterval(() => {
      setResendCodeTimeLeft(prev => prev - 1)
    }, 1000);
    return () => clearInterval(interval)
  }, [resendCodeTimeLeft])
  // console.log(userData);
  // console.log(settingsData);

  return (
    <div className="w-full h-full lg:bg-white8 rounded-2xl lg:px-8 lg:py-12 flex flex-col gap-10 justify-between lg:border lg:border-gray21">
      <div className="flex flex-col gap-10">
        <div className="flex items-center gap-2">
          <Link to={ROUTES.TRADE.BUY} className={`w-1/2 py-3 flex items-center gap-1 justify-center rounded-lg border border-transparent transition duration-300 ${isSell ? 'bg-gray10 text-gray17 hover:bg-transparent hover:text-green2 hover:border-green2' : 'bg-green2 text-white2'}`}>
            <span className="text-sm font-medium lg:text-lg lg:font-bold">خرید</span>
            <span className="icon-wrapper lg:w-5 lg:h-5 w-4 h-4"><IconArrowBottomLeft /></span>
          </Link>
          <Link to={ROUTES.TRADE.SELL} className={`w-1/2 py-3 flex items-center gap-1 justify-center rounded-lg text-text6 border border-transparent transition duration-300 ${isSell ? 'bg-red1 text-white2' : 'bg-gray10 text-gray17 hover:bg-transparent hover:text-red1 hover:border-red1'}`}>
            <span className="text-sm font-medium lg:text-lg lg:font-bold">فروش</span>
            <span className="icon-wrapper lg:w-5 lg:h-5 w-4 h-4"><IconArrowTopLeft /></span>
          </Link>
        </div>
        {/* select coin button ======================================================================================================= */}
        <div className="flex flex-col gap-3">
          <div onClick={() => setIsCryptoListModalOpen(true)} className="border border-gray12 rounded-lg px-4 py-2.5 lg:py-3.5 flex items-center justify-between cursor-pointer relative group hover:border-blue2">
            <div className="absolute px-1 bg-white1  lg:bg-white8 border-none -top-4 right-4 text-gray5 text-sm font-normal group-hover:text-blue2">انتخاب رمز ارز</div>
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full">
                {currentCryptocurrency?.isFont ?
                  <i className={`cf cf-${currentCryptocurrency?.symbol.toLowerCase()}`} style={{ color: currentCryptocurrency?.color, fontSize: '28px' }}></i>
                  :
                  <img src={`https://api.payfa24.org/images/currency/${currentCryptocurrency?.icon}`} alt={currentCryptocurrency?.symbol} className="object-contain" />
                }
              </span>
              <span className="text-black1 text-sm font-normal">{currentCryptocurrency?.locale?.fa?.name}</span>
            </div>
            <span className="icon-wrapper w-5 h-5 -rotate-90 text-gray23 group-hover:text-blue2"><IconChevron /></span>
          </div>
          {isCryptoListModalOpen &&
            <CryptoListModal
              setIsCryptoListModalOpen={setIsCryptoListModalOpen}
              cryptoListData={Object.values(mergedCryptosData)}
              setCurrentCryptoCurrency={setCurrentCryptocurrency}
              isCryptoListLoading={isCryptoListLoading}
              digitalCryptoListData={Object.values(mergedDigitalCryptosData)}
            />}
          {isTradeConfirmationModalOpen &&
            <TradeConfirmationModal
              setIsTradeConfirmationModalOpen={setIsTradeConfirmationModalOpen}
              isSell={isSell}
              tradeConfirmationModalData={TradeConfirmationModalData!}
              fetchCryptoBalanceAndPrice={fetchCryptoBalanceAndPrice}
              fetchTomanBalance={fetchTomanBalance}
              handleCancelTrade={handleCancelTrade}
              handleSuccessTrade={handleSuccessTrade}
            />}
          {isTradeCancelModalOpen && <TradeCancelModal setIsTradeCancelModalOpen={setIsTradeCancelModalOpen} />}
          {isTradeSuccessModalOpen && <TradeSuccessModal setIsTradeSuccessModalOpen={setIsTradeSuccessModalOpen} isSell={isSell} />}
          {/* {isOtpModalOpen &&
            <div className="fixed inset-0 z-[60] bg-[rgba(0,0,0,0.3)] backdrop-blur-sm flex items-center justify-center">
              <div className="bg-white8 rounded-2xl border border-white6 py-4 px-4 lg:py-8 lg:px-10 flex flex-col gap-8 w-[328px] lg:w-[448px]">
                <OTPModal length={6} onChange={(value: string) => setOtpCode(value)} />
                <button className="bg-blue2 p-2 " onClick={handleSubmitDigitalBuy}>ثبت</button>
              </div>
            </div>
          } */}
          {isOtpModalOpen &&
            <OTPInputModal
              titleText={`تایید ${isSell ? 'فروش' : 'خرید'} ${currentCryptocurrency?.locale?.fa?.name}`}
              mainText={OTPModalMainText}
              closeModal={handleCancelDigitalBuy}
              OTPLength={6}
              onSubmit={handleSubmitDigitalBuy}
              handleResendCode={handleBuyOrSell}
              resendCodeIsSubmitting={resendCodeIsSubmitting}
              resendCodeTimeLeft={formatTime(resendCodeTimeLeft)}
              onChange={(value: string) => setOtpCode(value)}
            />
          }
          <div className={`flex items-center ${isDigitalCurrency ? 'justify-end' : 'justify-between'}`}>
            <div className={`items-center gap-1 text-gray24 text-xs lg:text-sm font-medium ${isDigitalCurrency ? 'hidden' : 'flex'}`}>
              موجودی شما :
              {isLoading || cryptoBalance === null ?
                <span className="skeleton-bg h-3 w-16 rounded-sm"></span>
                :
                <span className="text-black1 font-normal" dir="ltr">{`${cryptoBalance} ${currentCryptocurrency?.symbol}`}</span>
              }
            </div>
            <span className="text-sm font-normal text-black1 flex items-center gap-1">
              {isSell ? 'قیمت فروش' : 'قیمت خرید'} :
              {isLoading ?
                <span className="skeleton-bg h-3 w-16 rounded-sm"></span>
                :
                <span>{formatPersianDigits(currentCryptoPrice)} تومان</span>
              }
            </span>
          </div>
        </div>
        {/* choose coin count (gets hidden when digital currency: sell) ============================================================================================ */}
        <div className={`${isDigitalCurrencySell ? 'hidden' : 'flex'} flex-col gap-5 lg:gap-3`}>
          <div onClick={() => countInputRef.current?.focus()} className="border border-gray12 rounded-lg px-4 py-2.5 lg:py-3.5 cursor-text relative group focus-within:border-blue2">
            <div className="absolute px-1 bg-white1 lg:bg-white8  border-none -top-4 right-4 text-gray5 text-sm font-normal group-focus-within:text-blue2">مقدار رمز ارز</div>
            <input
              ref={countInputRef}
              type="text"
              inputMode="decimal"
              className="bg-transparent appearance-none outline-none w-full text-gray5 text-right"
              placeholder={`مقدار ${currentCryptocurrency?.locale?.fa?.name} مدنظر را وارد کنید`}
              value={countInputStr}
              onChange={handleCountChange}
              dir="ltr"
            />
          </div>
          <div className={`justify-end text-sm font-normal ${isSell ? 'flex' : 'hidden'}`}>
            <button onClick={handleFillCount} className="text-blue2 text-sm font-normal hover:underline">تمام موجودی</button>
          </div>
        </div>
        {/* input for voucher code (only visible when digital currency: sell) ======================================================================================= */}
        <div className={`${isDigitalCurrencySell && isSell ? 'flex' : 'hidden'} flex-col gap-5 lg:gap-3`}>
          <div onClick={() => voucherCodeInputRef.current?.focus()} className="border border-gray12 rounded-lg px-4 py-2.5 lg:py-3.5 cursor-text relative group focus-within:border-blue2">
            <div className="absolute px-1 bg-white1 lg:bg-white8 border-none -top-4 right-4 text-gray5 text-sm font-normal group-focus-within:text-blue2">کد ووچر</div>
            <input
              ref={voucherCodeInputRef}
              type="text"
              className="bg-transparent appearance-none outline-none w-full text-gray5 text-right"
              placeholder={`کد ووچر ${currentCryptocurrency?.locale?.fa?.name} را وارد کنید`}
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
              dir="ltr"
            />
          </div>
          {/* <div className={`justify-end text-sm font-normal ${isSell ? 'flex' : 'hidden'}`}>
          <button onClick={handleFillCount} className="text-primary text-sm font-normal hover:text-blue2 hover:underline">تمام موجودی</button>
        </div> */}
        </div>
      </div>
      {/* choose total amount ======================================================================================================= */}
      <div className={`${isDigitalCurrencySell ? 'hidden' : 'flex'} flex-col gap-5 lg:gap-3`}>
        <div onClick={() => amountInputRef.current?.focus()} className="border border-gray12 rounded-lg px-4 py-2.5 lg:py-3.5 cursor-text relative group focus-within:border-blue2">
          <div className="absolute px-1 bg-white1 lg:bg-white8 border-none -top-4 right-4 text-gray5 text-sm font-normal group-focus-within:text-blue2">{isSell ? 'مقدار دریافتی' : 'مقدار پرداختی'}</div>
          <div className="w-full flex items-center justify-between">
            <input
              ref={amountInputRef}
              type="text"
              inputMode="decimal"
              className="bg-transparent appearance-none outline-none text-black1 text-right w-10/12"
              value={amountValue === "" ? formatPersianDigits(0) : formatPersianDigits(amountValue)}
              onChange={handleAmountChange}
              dir="ltr"
            />
            <span className="text-sm font-normal text-gray5">تومان</span>
          </div>
        </div>
        <div className={`items-center justify-between text-sm font-normal ${isSell ? 'hidden' : 'flex'}`}>
          <Link to={ROUTES.DEPOSIT} className="flex items-center gap-1 group">
            <span className="icon-wrapper w-5 h-5 text-gray24 group-hover:text-blue2"><IconBorderedPlus /></span>
            <span className="text-xs lg:text-sm font-medium text-gray24 group-hover:text-blue2">موجودی شما : </span>
            {isLoading ?
              <span className="skeleton-bg h-3 w-16 rounded-sm"></span>
              :
              <span className="text-black1">{formatPersianDigits(TomanBalance)} تومان</span>
            }
          </Link>
          <button onClick={handleFillAmount} className="text-blue2 text-sm font-normal hover:underline">تمام موجودی</button>
        </div>
      </div>
      {/* percent bar ======================================================================================================= */}
      {!isDigitalCurrencySell &&
        <PercentBar selectedPercent={selectedPercent} setSelectedPercent={setSelectedPercent} lastChangedRef={lastChangedRef} isDisabled={isDisabled} />
      }
      <button
        disabled={isDigitalCurrencySell ? !voucherCode || isSubmitting : (isSubmitting || !countInputStr || !amountValue)}
        onClick={handleBuyOrSell}
        className={`rounded-lg py-2 lg:py-2.5 text-base font-medium lg:text-lg lg:font-bold transition duration-300
        ${isSubmitting
            || (!isDigitalCurrencySell && !countInputStr)
            || (!isDigitalCurrencySell && !amountValue)
            || (isDigitalCurrencySell && !voucherCode) ? 'text-black1 bg-gray2' : 'bg-blue2 text-white2 hover:bg-blue-600 hover:-translate-y-0.5'}`}
      >
        {isSubmitting ? 'در حال ثبت سفارش ...' : isSell ? "ثبت فروش" : "ثبت خرید"}
      </button>
    </div >
  )
}

export default BuyAndSell
