
import React from "react";
import SocialLinks from "./SocialLinks";
import DownloadCard from "./DownloadCard";
import ContactInfo from "./ContactInfo";

import mayket from "/images/download (1) 1.png";
import bazzer from "/images/bazaar-logo-and-logotype 1 (1).png";
import Logo from "/images/logo.png";
import mobile from "/images/footer-mobile.png"

export default function Footer(): React.JSX.Element {
  return (
    <footer className="bg-primary text-white py-5">
    
      <div className="container-style flex justify-between items-center gap-8">
        <SocialLinks />
        <img src={Logo} alt="لوگو" />
      </div>

   
      <div className="border-t border-white mt-4">
        <div className="container-style mb-[14px] flex flex-col lg:flex-row lg:justify-between gap-8">
        
          <div className="order-2 lg:order-1 flex flex-col gap-4 items-end relative lg:ml-[76px]">
            <img src={mobile} alt="اپلیکیشن موبایل" />
            <div className="flex bg-white rounded-md w-[360px] h-[77px] absolute bottom-0 justify-center items-center text-black">
              <DownloadCard title="مایکت" img={mayket} />
              <div className="w-px h-[60px] bg-gray-400 mx-4"></div>
              <DownloadCard title="بازار" img={bazzer} />
            </div>
          </div>

       
          <ContactInfo />
        </div>
      </div>
    </footer>
  );
}
