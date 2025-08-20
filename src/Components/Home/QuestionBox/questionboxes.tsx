import React, { useState } from "react";
import MinesIcon from "../../../assets/icons/Home/QuestionBox/MinesIcon";
import AddIcon from "../../../assets/icons/Home/QuestionBox/AddIcon";

interface FAQItem {
  question: string;
  answer: string;
}

const data: FAQItem[] = [
  { question: "چگونه در پی‌فا24 ثبت‌نام کنم؟", answer: "برای ثبت‌نام در پی فا ۲۴ کافی است به صفحه ثبت‌نام..." },
  { question: "مدارک لازم برای احراز هویت چیست؟", answer: "مدارک شامل کارت ملی و ..." },
  { question: "کارمزد معاملات در پی24 چقدر است؟", answer: "کارمزد بسته به نوع معامله متفاوت است..." },
  { question: "چگونه امنیت حساب کاربری خود را افزایش دهم؟", answer: "برای افزایش امنیت از رمز قوی استفاده کنید..." },
  { question: "آیا پی فا24 سقف برداشت روزانه دارد؟", answer: "بله، سقف برداشت روزانه براساس سطح کاربری تعیین می‌شود." },
];

export default function FAQAccordion() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setActiveIndex(prev => (prev === index ? null : index));
  };

  return (
    <div className="w-full max-w-3xl  space-y-4" dir="rtl">
      {data.map((item, index) => (
        <div key={index} className="border rounded-lg shadow p-4">
          <button
            className="flex justify-between w-full text-right items-center"
            onClick={() => handleToggle(index)}
          >
            <span className="ml-2 font-semibold">{item.question}</span>
            <span className="mr-2">{activeIndex === index ? <MinesIcon /> : <AddIcon />}</span>
          </button>
          {activeIndex === index && (
            <div className="mt-2 pt-2 border-t text-sm text-gray-600">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
