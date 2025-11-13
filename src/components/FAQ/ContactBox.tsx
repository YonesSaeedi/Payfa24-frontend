import React from "react";
import IconEmail from "../../assets/icons/FAQ/IconEmail";
import IconCall from "../../assets/icons/FAQ/IconCall";
import SocialLinks from "../Footer/SocialLinks";

const ContactBox: React.FC = () => {
  return (
    <div className="flex flex-col justify-end items-end lg:pt-[71px]">
      <h2 className=" text-black1 pb-3 lg:pb-5 font-medium text-[20px] lg:pt-0">
        راه‌های ارتباطی با ما 
      </h2>

      <div className="flex justify-between w-full lg:gap-3 gap-4">
        <div className="w-full lg:w-[190px] h-[130px] bg-gray27 border-gray21 rounded-[12px] border flex flex-col justify-center items-center gap-2   hover:shadow-sm hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="w-12 h-12 ">
            <IconEmail />
          </div>{" "}
         
          <div className="flex justify-center flex-col">
            <span
              dir="rtl"
              className="font-medium text-base text-black1 justify-center flex pb-1"
            >
              ایمیل
            </span>
            <span className="text-sm font-medium text-black1">
            <a
        href="mailto:info@payfa.com"
        className="text-sm font-medium text-black1 hover:text-blue2 "
      >
        pishdad24co@gmail.com
      </a>
            </span>
          </div>
        </div>

        <div className="w-full lg:w-[190px] h-[130px] bg-gray27  border-gray21   rounded-[12px] border flex flex-col justify-center items-center gap-2   hover:shadow-sm hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="w-12 h-12 ">
            <IconCall />
          </div>
          <div className="flex justify-center flex-col">
            <span
              dir="rtl"
              className="font-medium text-base text-black1 justify-center flex pb-1"
            >
              تماس
            </span>
            <span className="text-sm font-medium text-black1"> <a
        href="tel:04433721037"
        className="text-sm font-medium text-black1 hover:text-blue2 "
      >
        04433721037
      </a></span>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[400px] h-[110px] bg-gray27  border-gray21 rounded-[12px] border flex flex-col justify-center items-center mt-4  hover:shadow-sm hover:scale-105 transition-all duration-300 cursor-pointer">
       <p className="text-black1 font-medium text-base ">ما را در شبکه های اجتماعی دنبال کنید </p>

     
       
      <div className="container-style flex justify-between items-center pt-3 text-blue2">
        <SocialLinks borderColor="border-blue2 "/>
      </div>
      
     
    

      </div>
    </div>
  );
};

export default ContactBox;
