import React, { Dispatch, SetStateAction } from "react";
import IconClose from "../../assets/Icons/Login/IconClose";

type CryptoListModalProps = {
  setIsCryptoListModalOpen: Dispatch<SetStateAction<boolean>>;
}

const CryptoListModal = ({ setIsCryptoListModalOpen }: CryptoListModalProps) => {
  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
  }

  return (
    <div onClick={() => setIsCryptoListModalOpen(false)} className="fixed inset-0 z-[60] bg-[rgba(0,0,0,0.3)] backdrop-blur-sm flex items-center justify-center">
      <div onClick={handleModalClick} className="bg-white8 rounded-2xl border border-white6 pt-8 px-6 flex flex-col gap-5 w-[480px]">
        {/* modal header ======================================================================================================== */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium lg:text-lg lg:font-bold text-black1">انتخاب ارز</span>
          <span className="icon-wrapper h-6 w-6"><IconClose /></span>
        </div>
      </div>
    </div>
  )
}

export default CryptoListModal