import React from "react"
import IconSuccess from "../../assets/icons/trade/IconSuccess"
import { Link } from "react-router"
import IconCopy from "../../assets/icons/AddFriend/IconCopy"
import { toast } from "react-toastify"

interface TradeSuccessModalProps {
  setIsTradeSuccessModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  successMsg?: string
  linkTo: string
  buyVoucherCode?: string;
}

const TradeSuccessModal = ({ setIsTradeSuccessModalOpen, successMsg, linkTo, buyVoucherCode }: TradeSuccessModalProps) => {
  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => { e.stopPropagation() }
  const handleCopy = async (text: string) => {
    if (!navigator?.clipboard?.writeText) {
      toast.error('مرورگر شما امکان کپی کردن را ندارد.');
      return;
    }
    try {
      await navigator.clipboard.writeText(text)
      toast.success('کد کپی شد.')
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? process.env.NODE_ENV === 'development'
            ? err.message
            : 'در کپی کردن کد مشکلی پیش آمد.'
          : 'در کپی کردن کد مشکلی پیش آمد.';
      toast.error(message)
    }
  }

  return (
    <div onClick={() => setIsTradeSuccessModalOpen(false)} className="fixed inset-0 z-[60] bg-[rgba(0,0,0,0.3)] backdrop-blur-sm flex items-center justify-center">
      <div onClick={handleModalClick} className="bg-white8 rounded-2xl border border-white6 py-8 px-6 lg:py-10 lg:px-10 flex flex-col gap-10 lg:gap-12 w-[328px] lg:w-[448px]">
        <div className="flex flex-col items-center gap-4">
          <span className="h-14 w-14 lg:h-[72px] lg:w-[72px] text-green4"><IconSuccess /></span>
          <span className="font-medium text-lg lg:text-xl text-black1">{successMsg}</span>
          {buyVoucherCode &&
            <div className="mt-2 lg:mt-3 w-full flex flex-col gap-1 lg:gap-2">
              کد ووچر:
              <div onClick={() => handleCopy(buyVoucherCode)} className="flex items-center justify-between gap-4 lg:gap-5 cursor-pointer">
                <span className="min-w-0 truncate" dir="ltr">{buyVoucherCode}</span>
                <span className="w-6 h-6 text-gray1 shrink-0"><IconCopy /></span>
              </div>
            </div>
          }
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsTradeSuccessModalOpen(false)}
            className="w-1/3 text-sm lg:text-lg font-bold py-2.5 rounded-lg bg-blue2 border border-transparent text-white transition duration-300 hover:bg-transparent hover:text-blue2 hover:border-blue2"
          >
            متوجه شدم
          </button>
          <Link
            to={linkTo}
            className="w-2/3 text-sm lg:text-lg font-bold py-2.5 rounded-lg bg-transparent border border-blue2 text-blue2 transition duration-300 hover:bg-blue2 hover:text-white hover:border-transparent text-center"
          >
            مشاهده جزئیات
          </Link>
        </div>
      </div>
    </div>
  )
}


export default TradeSuccessModal