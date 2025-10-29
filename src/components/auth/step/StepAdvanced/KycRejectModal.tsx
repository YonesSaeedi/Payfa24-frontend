import { Link } from "react-router"
import { ROUTES } from "../../../../routes/routes"
import IconError from "../../../../assets/icons/trade/IconError"

interface KycRejectModalProps {
  setIsRejectModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  msg: string | null
}

const KycRejectModal = ({ setIsRejectModalOpen, msg }: KycRejectModalProps) => {
  return (
    <div className="fixed inset-0 z-[60] bg-[rgba(0,0,0,0.3)] backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white8 rounded-2xl border border-white6 py-8 px-6 lg:py-10 lg:px-10 flex flex-col gap-10 w-[328px] lg:w-[448px]">
        <div className="flex flex-col items-center gap-4">
          <span className="h-14 w-14 text-red1"><IconError /></span>
          <h2 dir="rtl" className="font-medium text-lg lg:text-2xl text-black1">تایید نشد!</h2>
          <span dir="rtl" className="text-gray5 font-normal text-sm lg:text-lg">{msg}</span>
        </div>
        <div className="flex items-center gap-2 w-full">
          <button
            onClick={() => setIsRejectModalOpen(false)}
            className="w-1/2 text-base lg:text-lg font-medium rounded-lg border border-blue2 py-2.5 text-blue2 hover:bg-blue2 hover:border-transparent hover:text-white transition duration-300"
          >
            تلاش مجدد
          </button>
          <Link
            to={ROUTES.HOME}
            className="w-1/2 text-sm lg:text-lg font-bold py-2.5 rounded-lg bg-blue2 border border-transparent text-center
          text-white transition duration-300 hover:bg-transparent hover:text-blue2 hover:border-blue2"
          >
            صفحه اصلی
          </Link>
        </div>
      </div>
    </div>
  )
}

export default KycRejectModal