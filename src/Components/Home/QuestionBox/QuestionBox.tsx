// import FAQAccordion from "./questionboxes";
import TradeLayoutFAQ from "../../trade/TradeLayoutFAQ";
import question from "./../../../assets/images/HomeIcon/QuestionBoxIcon/question.png";
import ArrowLeftIcon from "../../../assets/icons/Home/CryptoTableIcon/ArrowLeftIcon";

function QuestionBox() {


  const FAQData= [
  {
    id: 1,
    question: "چگونه در پی‌فا24  ثبت نام کنم؟",
    answer: "برای ثبت نام در پی فا 24  کافی است به صفحه ثبت نام رفته و اطلاعات شخصی خود را وارد کنید  پس از تایید ایمیل و شماره تماس  حساب کاربری شما فعال میشود"
  },
  {
    id: 2,
    question: "مدارک لازم برای احراز هویت چیست؟",
    answer: "حداقل مبلغ خرید و فروش در پی فا 24 بسته به نوع ارز متفاوت است. برای اطلاع از حداقل مبلغ، به صفحه جزئیات هر ارز مراجعه کنید."
  },
  {
    id: 3,
    question: "کارمزد معاملات در پی فا 24 چقدر است؟",
    answer: "خیر، تراکنش‌های ارز دیجیتال غیرقابل بازگشت هستند. لطفاً قبل از تایید تراکنش، تمامی جزئیات را به دقت بررسی کنید."
  },
  {
    id: 4,
    question: "چگونه امنیت حساب کاربری خود را افزایش بدهم؟",
    answer: "بله , تمامی سفارش‌های انجام شده را میتوانید در قسمت تاریخچه تراکنش‌های حساب کاربری شما ثبت میشود و در هر لحظه میتوانید مشاهده کنید."
  },
  {
    id: 5,
    question: "آیا پی فا 24 سقف برداشت روزانه دارد؟",
    answer: "در صورت مواجهه با خطا ابتدا اتصال اینترنت خود را بررسی کنید در صورتی که همچنان مشکل داشت با پشتیبانی پی‌فا24 تماس بگیرید تا بررسی شود."
  },
];


  return (
<div className="flex flex-col-reverse lg:flex-row justify-between lg:gap-x-[40px] bg-backgroundMain2 text-text">

  <button className="flex lg:hidden px-4 py-2 rounded-lg text-primary items-center justify-center gap-2 font-bold pt-8 ">
  <ArrowLeftIcon />
  مشاهده همه سوالات
</button>

  <div dir="rtl" className="lg:w-2/3 w-full">
      <TradeLayoutFAQ items={FAQData} />

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
  <button className="hidden lg:flex px-4 py-2 rounded-lg bg-blue-500 text-white items-center justify-center gap-2 font-bold">
  <ArrowLeftIcon />
  مشاهده همه سوالات
</button>



</div>


</div>


  );
}

export default QuestionBox
