import React from "react"
import IconError from "../../assets/icons/trade/IconError"

interface TradeCancelModalProps {
  setIsTradeCancelModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const TradeCancelModal = ({ setIsTradeCancelModalOpen }: TradeCancelModalProps) => {
  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
  }

  return (
    <div onClick={() => setIsTradeCancelModalOpen(false)} className="fixed inset-0 z-[60] bg-[rgba(0,0,0,0.3)] backdrop-blur-sm flex items-center justify-center">
      <div onClick={handleModalClick} className="bg-white8 rounded-2xl border border-white6 py-8 px-6 lg:py-10 lg:px-10 flex flex-col gap-10 w-[328px] lg:w-[448px]">
        <div className="flex flex-col items-center gap-4">
          <span className="h-14 w-14 lg:h-[72px] lg:w-[72px] text-red1"><IconError /></span>
          <span className="font-medium text-lg lg:text-xl text-black1">سفارش با عدم تایید شما لغو شد.</span>
        </div>
        <button
          onClick={() => setIsTradeCancelModalOpen(false)}
          className="text-sm lg:text-lg font-bold py-2.5 rounded-lg bg-blue2 border border-transparent text-white transition duration-300 hover:bg-transparent hover:text-blue2 hover:border-blue2">متوجه شدم</button>
      </div>
    </div>
  )
}

export default TradeCancelModal