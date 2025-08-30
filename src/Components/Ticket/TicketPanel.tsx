
import TicketForm from "../../Components/Ticket/TicketForm";
import TradeLayoutFAQ from "../trade/TradeLayoutFAQ";
import OptionSelector from "../../Components/Ticket/CategorySelector";
import Icontechnical from "../../assets/icons/ticket/Icontechnical";
const FAQData = [
  {
    id: 1,
    question: "چگونه در پی‌فا24 ثبت نام کنم؟",
    answer:
      "برای ثبت نام در پی فا 24 کافی است به صفحه ثبت نام رفته و اطلاعات شخصی خود را وارد کنید. پس از تایید ایمیل و شماره تماس حساب کاربری شما فعال میشود",
  },
  {
    id: 2,
    question: "احراز هویت چقدر زمان میبرد؟",
    answer:
      "حداقل مبلغ خرید و فروش در پی فا 24 بسته به نوع ارز متفاوت است. برای اطلاع از حداقل مبلغ، به صفحه جزئیات هر ارز مراجعه کنید.",
  },
  {
    id: 3,
    question: "کارمزد معاملات در پی فا 24 چقدر است؟",
    answer:
      "خیر، تراکنش‌های ارز دیجیتال غیرقابل بازگشت هستند. لطفاً قبل از تایید تراکنش، تمامی جزئیات را به دقت بررسی کنید.",
  },
  {
    id: 4,
    question: "چرا برداشت من تایید نشده است؟",
    answer:
      "بله, تمامی سفارش‌های انجام شده را میتوانید در قسمت تاریخچه تراکنش‌های حساب کاربری خود مشاهده کنید.",
  },
  {
    id: 5,
    question: "چگونه ارز دیجیتال بفروشم؟",
    answer:
      "در صورت مواجهه با خطا ابتدا اتصال اینترنت خود را بررسی کنید. در صورتی که همچنان مشکل داشت با پشتیبانی پی‌فا24 تماس بگیرید تا بررسی شود.",
  },
];

const TicketPage: React.FC = () => {


  const handleSubmit = (data: { title: string; description: string; file?: File }) => {
    console.log("تیکت ارسال شد:", data);
  };

  return (
    <div className="bg-white1">
  <div className="p-6 flex gap-6 max-w-6xl container-style items-stretch">

    <div className="flex-1 bg-white shadow p-4 rounded">
      <TicketForm onSubmit={handleSubmit} />
    </div>
 
    <div className="flex-1 flex flex-col bg-white shadow p-4 rounded">
      <div dir="rtl">
        <h3 className="font-semibold mb-2 text-[20px] text-black1">
          ارسال تیکت برای بخش
        </h3>
        <p className="text-[14px] font-normal text-gray5 pt-2 pb-6">
          به منظور ارایه بهتر خدمات و راهنمای دقیق‌تر، لطفاً دسته بندی زیر را انتخاب کنید تا تیم پشتیبانی پی‌فا24 سریع‌تر مشکل شما را حل کند.
        </p>

         <div className="p-6">
      <OptionSelector
        options={[
          { id: "finance", label: "مالی", icon: <Icontechnical /> },
          { id: "tech", label: "فنی", icon: <Icontechnical /> },
          { id: "identity", label: "احراز هویت", icon: <Icontechnical /> },
          { id: "order", label: "پیگیری سفارش", icon: <Icontechnical /> },
        ]}
        defaultActive="order"
        onSelect={(id) => console.log("Selected:", id)}
      />
    </div>
      </div>


      <div className="mt-6 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-right mb-2">
          سوالات متداول پیگیری سفارش
        </h3>
        <div dir="rtl" className="w-full flex-1">
          <TradeLayoutFAQ items={FAQData} />
        </div>
      </div>
    </div>
  </div>
</div>

  );
};

export default TicketPage;
