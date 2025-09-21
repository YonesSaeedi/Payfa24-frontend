
import TradeLayoutFAQ from "../../trade/TradeLayoutFAQ";
import question from "./../../../assets/images/Home/QuestionBoxIcon/question.png";
import ArrowLeftIcon from "../../../assets/icons/Home/CryptoTableIcon/ArrowLeftIcon";
import { FAQData } from "../../../Data/faqData";

function QuestionBox() {

  return (
    <div className="flex flex-col-reverse lg:flex-row justify-between lg:gap-x-[40px] bg-backgroundMain2 text-text">

      <button className="flex lg:hidden px-4 py-2 rounded-lg text-primary items-center justify-center gap-2 font-bold pt-8 h-8 text-blue2">
        <span className="w-8 h-8 inline-flex items-center justify-center icon-wrapper">
          <ArrowLeftIcon />
        </span>

        مشاهده همه سوالات
      </button>

      <div dir="rtl" className="lg:w-2/3 w-full">
        <TradeLayoutFAQ items={FAQData.home} />

      </div>
      <div id="question" className="lg:w-1/3 w-full flex flex-col items-center bg-backgroundMain2 rounded-2xl gap-y-1 text-black1">
        <img src={question} alt="question icon" />
        <h2 className="text-xl font-bold pt-5 mb-1">سوالات متداول</h2>
        <p className="text-center text-base">سوال دیگری اگر دارید میتوانید از طریق</p>
        <p className="text-center text-base">پشتیبانی آنلاین با ما در تماس باشید</p>
        <div className="text-center lg:pb-4 pt-4 pb-10">
          <span className="text-base">تماس با پشتیبانی</span>
          <p className="text-blue-600">۰۲۱-۱۲۳۴۵۶۷۸۹</p>
        </div>
        <button className="hidden lg:flex px-3 py-2 rounded-lg bg-blue2 text-white  items-center justify-center gap-2 font-bold">
          <span className="w-8 h-8 "> <ArrowLeftIcon /></span>
          مشاهده همه سوالات
        </button>
      </div>
    </div>
  );
}

export default QuestionBox
