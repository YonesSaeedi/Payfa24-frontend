import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import IconWarning2 from "../../assets/icons/trade/IconWarning2";
import { TradeConfirmationData } from "../../types/tradePage";
import { toast } from "react-toastify";
import { apiRequest } from "../../utils/apiClient";
import { CryptoBuyConfirm } from "../../types/apiResponses";
import { formatPersianDigits } from "../../utils/formatPersianDigits";
import IconRefresh from "../../assets/icons/trade/Iconrefresh";

interface TradeConfirmationModalProps {
  setIsTradeConfirmationModalOpen: Dispatch<SetStateAction<boolean>>;
  isSell: boolean
  tradeConfirmationModalData: TradeConfirmationData
  fetchCryptoBalanceAndPrice: () => Promise<void>
  fetchTomanBalance: () => Promise<void>
  handleCancelTrade: () => void
  handleSuccessTrade: () => void
}

const TradeConfirmationModal = ({
  setIsTradeConfirmationModalOpen,
  isSell,
  tradeConfirmationModalData,
  fetchCryptoBalanceAndPrice,
  fetchTomanBalance,
  handleCancelTrade,
  handleSuccessTrade
}: TradeConfirmationModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [timeLeft, setTimeLeft] = useState<number>(10)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
  }
  useEffect(() => {
    setTimeLeft(10) // reset when modal mounts
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current!) // cleanup on unmount
  }, [])
  useEffect(() => {
    if (timeLeft === 0) {
      handleCancelTrade()
    }
  }, [timeLeft])
  // api functionality =========================================================================================================================
  const handleBuyOrSellConfirm = async () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (isSell) {
      try {
        setIsSubmitting(true)
        const response = await apiRequest<CryptoBuyConfirm, { amountCoin: string, id_order: number }>({
          url: `/api/order/crypto/sell/${tradeConfirmationModalData?.symbol}`,
          method: 'POST',
          data: { amountCoin: String(tradeConfirmationModalData?.coinAmount), id_order: tradeConfirmationModalData?.orderID },
        })
        fetchTomanBalance()
        fetchCryptoBalanceAndPrice()
        // toast.success('فروش با موفقیت انجام شد.')
        handleSuccessTrade()
      } catch (err) {
        toast.error(err?.response?.data?.msg || err?.response?.data?.message || 'در تایید سفارش فروش شما مشکلی پیش آمد.');
        setIsTradeConfirmationModalOpen(false)
      } finally {
        setIsSubmitting(false)
      }
    } else {
      try {
        setIsSubmitting(true)
        const response = await apiRequest<CryptoBuyConfirm, { amount: string, id_order: number }>({
          url: `/api/order/crypto/buy/${tradeConfirmationModalData?.symbol}`,
          method: 'POST',
          data: { amount: String(tradeConfirmationModalData?.tomanAmount), id_order: tradeConfirmationModalData?.orderID },
        })
        fetchTomanBalance()
        fetchCryptoBalanceAndPrice()
        // toast.success('خرید با موفقیت انجام شد.')
        handleSuccessTrade()
      } catch (err) {
        toast.error(err?.response?.data?.msg || err?.response?.data?.message || 'در تایید سفارش خرید شما مشکلی پیش آمد.');
        setIsTradeConfirmationModalOpen(false)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div onClick={handleCancelTrade} className="fixed inset-0 z-[60] bg-[rgba(0,0,0,0.3)] backdrop-blur-sm flex items-center justify-center">
      <div onClick={handleModalClick} className="bg-white8 rounded-2xl border border-white6 py-4 px-4 lg:py-8 lg:px-10 flex flex-col gap-8 w-[328px] lg:w-[448px]">
        {/* header */}
        <div className="flex flex-col items-center gap-3">
          <span className="text-blue2 h-14 w-14 lg:h-[72px] lg:w-[72px]"><IconWarning2 /></span>
          <h3 className="font-medium text-base lg:text-2xl text-black1">{isSell ? 'تایید فروش!' : 'تایید خرید!'}</h3>
        </div>
        {/* body */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <span className="font-normal text-xs lg:text-base text-black1">قیمت هر واحد {tradeConfirmationModalData?.symbol}</span>
            <span className="font-medium text-xs lg:text-base text-black1">{formatPersianDigits(tradeConfirmationModalData?.unitPrice)} تومان</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-normal text-xs lg:text-base text-black1">مقدار پرداختی</span>
            <span className="font-medium text-xs lg:text-base text-black1">
              {isSell ? tradeConfirmationModalData?.coinAmount : formatPersianDigits(tradeConfirmationModalData?.tomanAmount)} {isSell ? tradeConfirmationModalData?.symbol : 'تومان'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-normal text-xs lg:text-base text-black1">مقدار دریافتی</span>
            <span className="font-medium text-xs lg:text-base text-black1">{isSell ? formatPersianDigits(tradeConfirmationModalData?.tomanAmount) : tradeConfirmationModalData?.coinAmount} {isSell ? 'تومان' : tradeConfirmationModalData?.symbol}</span>
          </div>
        </div>
        {/* footer */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center justify-center gap-1 lg:gap-2 mb-2">
            <span className="w-5 h-5 lg:w-6 lg:h-6 text-gray1"><IconRefresh /></span>
            <span className="text-gray1 text-sm lg:text-base font-normal">{timeLeft} ثانیه</span>
          </div>
          <button
            onClick={handleBuyOrSellConfirm}
            disabled={isSubmitting}
            className={`w-full rounded-lg py-2 lg:py-2.5 font-bold text-base lg:text-lg text-white border border-transparent hover:bg-transparent transition duration-300 
              bg-green2 hover:text-green2 hover:border-green2`}
          >
            {isSubmitting ? `در حال تایید ${isSell ? 'فروش' : 'خرید'} ...` : isSell ? 'تایید فروش' : 'تایید خرید'}
          </button>
          {/* remove modal data when canceled !!! , no, i decided it's not necessary since parent only updates data and opens the modal after a successful api call */}
          <button
            onClick={handleCancelTrade}
            className={`w-full rounded-lg py-2 lg:py-2.5 font-normal text-base lg:text-lg text-gray1 border border-gray1 hover:bg-red1 transition duration-300 bg-transparent hover:text-white hover:border-red1`}
          >
            انصراف
          </button>
        </div>
      </div>
    </div>
  )
}

export default TradeConfirmationModal