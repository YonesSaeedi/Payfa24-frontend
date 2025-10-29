import React from "react"
import IconSuccess from "../../assets/icons/trade/IconSuccess"
import { Link } from "react-router"
import { ROUTES } from "../../routes/routes"

interface TradeSuccessModalProps {
  setIsTradeSuccessModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  isSell: boolean
}

const TradeSuccessModal = ({ setIsTradeSuccessModalOpen, isSell }: TradeSuccessModalProps) => {
  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
  }

  return (
    <div onClick={() => setIsTradeSuccessModalOpen(false)} className="fixed inset-0 z-[60] bg-[rgba(0,0,0,0.3)] backdrop-blur-sm flex items-center justify-center">
      <div onClick={handleModalClick} className="bg-white8 rounded-2xl border border-white6 py-8 px-6 lg:py-10 lg:px-10 flex flex-col gap-10 lg:gap-12 w-[328px] lg:w-[448px]">
        <div className="flex flex-col items-center gap-4">
          <span className="h-14 w-14 lg:h-[72px] lg:w-[72px] text-green4"><IconSuccess /></span>
          <span className="font-medium text-lg lg:text-xl text-black1">{isSell ? 'فروش ' : 'خرید '}با موفقیت انجام شد.</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsTradeSuccessModalOpen(false)}
            className="w-1/3 text-sm lg:text-lg font-bold py-2.5 rounded-lg bg-blue2 border border-transparent text-white transition duration-300 hover:bg-transparent hover:text-blue2 hover:border-blue2"
          >
            متوجه شدم
          </button>
          <Link
            to={ROUTES.TRANSACTION.ROOT} // to be corrected later !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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