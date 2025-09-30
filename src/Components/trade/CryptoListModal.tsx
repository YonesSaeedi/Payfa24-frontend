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
        {/* modal header ================================================================================================================================== */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium lg:text-lg lg:font-bold text-black1">انتخاب ارز</span>
          <span onClick={() => setIsCryptoListModalOpen(false)} className="icon-wrapper h-6 w-6 cursor-pointer"><IconClose /></span>
        </div>
        {/* modal body ==================================================================================================================================== */}
        <div className="flex flex-col gap-4">
          {/* search box */}
          <div className="rounded-lg px-4 py-2.5 lg:py-3 flex items-center gap-2 border border-gray15"></div>
          {/* currency type toggle */}
          <div className=""></div>
          {/* crypto currencies list */}

        </div>
      </div>
    </div>
  )
}

export default CryptoListModal