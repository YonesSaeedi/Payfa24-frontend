import { Link } from 'react-router'
import IconVerify from '../../../../assets/icons/authentication/IconVerify'
import { ROUTES } from '../../../../routes/routes'

const KycSuccessModal = () => {
  return (
    <div className="fixed cursor-pointer inset-0 bg-black backdrop-blur-sm bg-opacity-50 z-50 flex items-center justify-center">
      <div className="lg:w-[448px] w-full lg:rounded-2xl rounded-xl lg:p-8 p-4 relative bg-white8 text-center">
        <span className="icon-wrapper w-16 h-16 mx-auto text-blue1"><IconVerify /></span>
        <p dir='rtl' className="text-xl font-bold mt-4 mb-8 text-black0">! احراز هویت شما باموفقیت انجام شد</p>
        <Link
          to={ROUTES.HOME}
          className="mt-2 text-lg font-bold bg-blue1 w-full h-[56px] rounded-lg text-white2 border border-transparent hover:bg-transparent hover:border-blue1 hover:text-blue1 transition duration-300 ease-in"
        >
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </div>
  )
}

export default KycSuccessModal