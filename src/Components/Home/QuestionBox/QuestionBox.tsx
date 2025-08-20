import FAQAccordion from "./questionboxes";
import question from "./../../../../public/images/question.png";
import ArrowLeftIcon from "../../../assets/icons/Home/CryptoTable/ArrowLeftIcon";

function QuestionBox() {


  return (
    <div className="flex flex-col-reverse lg:flex-row justify-between lg:gap-x-[40px]">
      <div className="lg:w-2/3 w-full">
        <FAQAccordion />

      </div>

      <div id="question" className="lg:w-1/3 w-full flex flex-col items-center bg-white rounded-2xl gap-y-1 ">
        <img src={question} alt="question icon" />
        <h2 className="text-xl font-bold pt-5 mb-1">سوالات متداول</h2>
        <p className="text-center text-base">سوال دیگری اگر دارید میتوانید از طریق</p>
        <p className="text-center text-base">پشتیبانی آنلاین با ما در تماس باشید</p>
        <div className="text-center pb-4">
          <span className="text-base">تماس با پشتیبانی</span>
          <p className="text-blue-600">۰۲۱-۱۲۳۴۵۶۷۸۹</p>
        </div>
        <button className="px-4 py-2 rounded-lg bg-blue-500 text-white flex items-center justify-center gap-2 font-bold">
          <ArrowLeftIcon />
          مشاهده همه سوالات
        </button>
      </div>
    </div>


  );
}

export default QuestionBox
