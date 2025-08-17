import { useState } from "react"
import IconMinus from "../../assets/icons/trade/IconMinus";
import IconPlus from "../../assets/icons/trade/IconPlus";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const FAQData: FAQItem[] = [
  {
    id: 1,
    question: "چگونه در پی‌فا24 ارز دیجیتال بفروشیم؟",
    answer: "برای فروش ارز دیجیتال در صرافی پی‌فا24، ابتدا باید هویت خود را تایید کنید. سپس به بخش خرید و فروش رفته، ارز مورد نظر را انتخاب کرده و مقدار آن را وارد کنید. در نهایت با کلیک بر روی گزینه فروش، تراکنش خود را تکمیل کنید."
  },
  {
    id: 2,
    question: "حداقل مبلغ خرید و فروش چقدر است؟",
    answer: "حداقل مبلغ خرید و فروش در پی فا 24 بسته به نوع ارز متفاوت است. برای اطلاع از حداقل مبلغ، به صفحه جزئیات هر ارز مراجعه کنید."
  },
  {
    id: 3,
    question: "آیا امکان بازگشت تراکنش‌ها وجود دارد؟",
    answer: "خیر، تراکنش‌های ارز دیجیتال غیرقابل بازگشت هستند. لطفاً قبل از تایید تراکنش، تمامی جزئیات را به دقت بررسی کنید."
  },
  {
    id: 4,
    question: "آیا میتوان جزئیات سفارش انجام شده را مشاهده کنم؟",
    answer: "بله , تمامی سفارش‌های انجام شده را میتوانید در قسمت تاریخچه تراکنش‌های حساب کاربری شما ثبت میشود و در هر لحظه میتوانید مشاهده کنید."
  },
  {
    id: 5,
    question: "اگر خرید انجام نشد و با خطا مواجه شد , باید چه کنم؟",
    answer: "در صورت مواجهه با خطا ابتدا اتصال اینترنت خود را بررسی کنید در صورتی که همچنان مشکل داشت با پشتیبانی پی‌فا24 تماس بگیرید تا بررسی شود."
  },
];

const TradeLayoutFAQ = () => {
  const [openQuestionID, setOpenQuestionID] = useState<number>(FAQData[0].id)
  const toggleOpenQuestionID = (dataID: number) => {
    if (dataID === openQuestionID) {
      return null
    } else {
      setOpenQuestionID(dataID)
    }
  }

  return (
    <div className="flex flex-col gap-2 lg:gap-3">
      {FAQData.map((data) =>
        <div onClick={() => toggleOpenQuestionID(data.id)} key={data.id} className={`lg:py-5 lg:px-6 px-4 py-3.5 flex flex-col border border-borderSecondary rounded-[10px] cursor-pointer ${data.id === openQuestionID ? '' : 'overflow-hidden'}`}>
          <div className={`flex items-center justify-between ${data.id === openQuestionID ? 'border-b border-borderSecondary lg:pb-4 pb-3' : ''}`}>
            <p className="font-normal text-sm lg:text-base xl:text-lg text-text4">{data.question}</p>
            <span className="icon-wrapper w-6 h-6 lg:w-7 lg:h-7 text-blue2">
              {data.id === openQuestionID ? <IconMinus /> : <IconPlus />}
            </span>
          </div>
          <p className={`text-xs lg:text-sm xl:text-base font-normal text-text2 transition-all duration-300 ease-out ${data.id === openQuestionID ? 'lg:h-20 max-h-96 opacity-100 mt-3 lg:mt-4' : 'h-0 opacity-0 mt-0 lg:mt-0'}`}>{data.answer}</p>
        </div>
      )}
    </div>
  )
}

export default TradeLayoutFAQ