

 import IconSearch from "../../assets/icons/market/IconSearch";
import ContactBox from "../../components/FAQ/ContactBox";
import FAQTabs from "../../components/FAQ/FAQTabs";
import TradeLayoutFAQ from "../../components/trade/TradeLayoutFAQ";
import { FAQData } from "../../data/faqData";
import  question from "./../../assets/images/FAQ/FAQ.png"
import questionDark from "./../../assets/images/FAQ/questionDark.png"
import questions from "./../../assets/images/FAQ/question.png"
 import React, { useState } from "react";
import BreadcrumbNavigation from "../../components/BreadcrumbNavigation";
import HeaderLayout from "../../layouts/HeaderLayout";

const FAQPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

 const filteredItems = (
  activeTab === "all"
    ? [...FAQData.home, ...FAQData.trade, ...FAQData.account]
    : activeTab === "general"
    ? FAQData.home
    : activeTab === "buy-sell"
    ? FAQData.trade
    : activeTab === "deposit-withdraw"
    ? FAQData.trade
    : activeTab === "register"
    ? FAQData.account
    : []
).filter(item =>
  item.question.toLowerCase().includes(searchTerm.toLowerCase())
);


  return (

  <HeaderLayout>
        <div className="bg-backgroundMain min-h-screen w-full">
          <div className="container-style flex flex-col gap-8 lg:gap-12">
              <div className="mt-7 lg:mt-4">
              <BreadcrumbNavigation/>
            </div>   

    <div className="w-full  flex flex-col px-4 z-10 relative">
      <img
        src={questions}
        className="absolute top-2 -right-[23px] w-64 rotate-[8deg] dark:hidden -z-10 hidden lg:block" alt="question background"/>
                 <div className="lg:flex items-center">
                     <div className="flex-col  flex justify-between gap-24 lg:flex-row-reverse">
                      <div className="flex flex-col items-center justify-center">
            <h1 className=" mb-2 text-black1 text-4xl font-bold">
              سوالات متداول
            </h1>
            <div className="w-full max-w-md">
              <p className="text-gray-500 text-center md:text-right pt-4 w-full text-lg font-normal">
                 سوالات خود را در این بخش جستجو کنید. در صورت نیافتن پاسخ از
                طریق راه‌های ارتباطی سوال خود را با ما در میان بگذارید.
              </p>
              <div className="w-full relative mt-10">
              <input
  dir="rtl"
  type="text"
  placeholder="جستجو"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  className="w-full border rounded-lg px-4 pr-10 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white1 border-gray21"
/>

                <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none w-5 h-5 top-[9px] text-gray-400">
                  <IconSearch />
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center order-1">
            <img src={question} className="dark:hidden" />
            <img
              src={questions}
              dir="rtl"
              className="absolute top-[12.5rem] left-[-111px] w-64 -rotate-12  dark:hidden -z-10 scale-x-[-1] hidden lg:block"
              alt="question background"
            />
            <img
              src={questionDark}
              className="hidden dark:block"
              alt="FAQ Dark"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row-reverse gap-8 items-center lg:items-start text-center lg:text-right">
      <div
  dir="rtl"
  className="flex flex-col items-center lg:items-start w-full max-w-[900px] mx-auto px-4 lg:px-0"
>
  <div className="pt-6 w-full lg:w-auto flex gap-3 flex-col">
    <span className="text-2xl font-bold text-black1 pb-[28px]">سوالات پرتکرار</span>
    <FAQTabs activeTab={activeTab} setActiveTab={setActiveTab} />
  </div>

  <div className="w-full lg:w-auto mt-2 lg:pb-12">
    {filteredItems.length > 0 ? (
  <TradeLayoutFAQ items={filteredItems} />
) : (
  <p className="text-center text-gray-500 mt-4">
    موردی یافت نشد.
  </p>
)}

  
  </div>
</div>

        <div className=" lg:pt-0 pb-6">
          <ContactBox />
        </div>
      </div>
    </div>
      </div></div></HeaderLayout>
  );
};

export default FAQPage;
