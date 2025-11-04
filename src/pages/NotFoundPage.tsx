import { Link } from "react-router"
import BGNotFound from "../assets/icons/404/BGNotFound"
import { ROUTES } from "../routes/routes"

const NotFoundPage = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center p-4 bg-white1">
      <div className="flex flex-col gap-6 lg:gap-10 items-center">
        <span className="text-black0 w-64 h-56 lg:w-96 lg:h-80"><BGNotFound /></span>
        <h2 className="text-lg lg:text-2xl font-medium text-black0" dir="rtl">صفحه مورد نظر شما یافت نشد.</h2>
        <Link
          to={ROUTES.HOME}
          className="bg-blue2 w-full text-center font-semibold p-2 lg:p-3 rounded-lg text-white border border-transparent hover:bg-transparent hover:border-blue2 hover:text-blue2 transition duration-200"
        >
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage