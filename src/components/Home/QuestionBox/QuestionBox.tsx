
import TradeLayoutFAQ from "../../trade/TradeLayoutFAQ";
import question from "./../../../assets/images/Home/QuestionBoxIcon/question.png";
import ArrowLeftIcon from "../../../assets/icons/Home/CryptoTableIcon/ArrowLeftIcon";
import { FAQData } from "../../../data/faqData";
import { Link } from "react-router";
import { ROUTES } from "../../../routes/routes";

function QuestionBox() {

  return (
    <div className="flex flex-col-reverse lg:flex-row justify-between lg:gap-x-[40px] bg-backgroundMain2 text-text">
      <Link to={ROUTES.FAQ} className="flex lg:hidden px-4 lg:py-2 py-5 rounded-lg text-primary items-center text-sm justify-center gap-1 font-bold hover:text-blue-900  text-blue2">
        <span className="w-5 h-5 inline-flex items-center justify-center icon-wrapper"><ArrowLeftIcon /></span>
        مشاهده همه سوالات
      </Link>
      <div dir="rtl" className="lg:w-2/3 w-full"><TradeLayoutFAQ items={FAQData.home} /></div>
      <div id="question" className="lg:w-1/3 w-full flex flex-col items-center bg-backgroundMain2 rounded-2xl  text-black1">
        <img src={question} alt="question icon" className="w-[108px] h-[105px] lg:w-[164px] lg:h-[160px]" />
        <h2 className="text-base lg:text-xl font-bold lg:pt-5 mb-2 pt-3">سوالات متداول</h2>
        <p className="text-center font-normal text-sm lg:text-lg ">سوال دیگری اگر دارید میتوانید از طریق</p>
        <p className="text-center font-normal text-sm lg:text-lg ">پشتیبانی آنلاین با ما در تماس باشید</p>
        <div className="text-center lg:pb-[29px] pt-4  pb-5 flex flex-col gap-1">
          <span className="text-xs lg:text-base font-normal">تماس با پشتیبانی</span>
          <Link to='tel:04433721037' className="text-blue2 hover:underline  lg:text-lg font-medium text-base">۰۴۴۳۳۷۲۱۰۳۷</Link>
        </div>
        <Link
  to={ROUTES.FAQ}
  className="hidden lg:flex px-4 py-2 rounded-lg bg-blue2 border border-transparent text-base hover:border-blue2 hover:text-blue2 hover:bg-transparent text-white items-center justify-center gap-1 font-bold transition duration-200 ease-in"
>
  <span className="w-5 h-5"><ArrowLeftIcon /></span>
  مشاهده همه سوالات
</Link>

      </div>
    </div>
  );
}

export default QuestionBox
