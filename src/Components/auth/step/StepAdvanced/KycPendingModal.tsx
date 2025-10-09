import { Link } from "react-router"
import { ROUTES } from "../../../../routes/routes"
import IconHourGlass from "../../../../assets/icons/transaction-history/IconHourGlass"

const KycPendingModal = () => {

  return (
    <div className="fixed inset-0 z-[60] bg-[rgba(0,0,0,0.3)] backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white8 rounded-2xl border border-white6 py-8 px-6 lg:py-10 lg:px-10 flex flex-col gap-10 w-[328px] lg:w-[448px]">
        <div className="flex flex-col items-center gap-4">
          <span className="h-14 w-14 text-orange1"><IconHourGlass /></span>
          <h2 dir="rtl" className="font-medium text-lg lg:text-2xl text-black1">در حال بررسی!</h2>
          <span dir="rtl" className="text-gray5 font-normal text-sm lg:text-lg">مدارک شما در حال بررسی می‌باشد.</span>
        </div>
        <Link
          to={ROUTES.HOME}
          className="text-sm lg:text-lg font-bold py-2.5 rounded-lg bg-blue2 border border-transparent text-center
          text-white transition duration-300 hover:bg-transparent hover:text-blue2 hover:border-blue2"
        >
          صفحه اصلی
        </Link>
      </div>
    </div>
  )
}

export default KycPendingModal