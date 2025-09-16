// import { useState } from "react";
// import BreadcrumbNavigation from "../../Components/BreadcrumbNavigation";
// import HeaderLayout from "../../layouts/HeaderLayout";
// import EmailIcon from "../../assets/Icons/authentication/EmailIcon";
// import MultiFactorCard from "../../Components/MultiFactor/MultiFactorCard";
// import Google from "../../assets/Icons/MultiFactor/Google.png";
// import MessagesIcon from "../../assets/Icons/MultiFactor/Iconmessages";
// import TwoFactorModal from "../../Components/MultiFactor/TwoFactorModal";
// import VerifyGooglePage from "./VerifyGooglePage";
// // import { TwoFactorModalGoogle } from "../../Components/MultiFactor/TwoFactorModalGoogle";
// export default function MultiFactor() {
//   const [modalType, setModalType] = useState(null);

//   const MultiInfo = [
//     {
//       type: "google",
//       img: Google,
//       button: "فعال کردن",
//       Title: "تایید دو مرحله‌ای گوگل",
//       text: "میتوانید با نصب اپلیکیشن google Authenticator هنگام ورود کد دو مرحله‌ای را دریافت کنید.",
//     },
//     {
//       type: "sms",
//       icon: <MessagesIcon />,
//       button: "فعال کردن",
//       Title: "تایید دو مرحله‌ای پیامک",
//       text: "فعال سازی ورود دو مرحله ای با استفاده از پیامکی که به شماره 049893993*** ارسال شده است.",
//     },
//     {
//       type: "email",
//       icon: <EmailIcon />,
//       button: "فعال کردن",
//       Title: "تایید دو مرحله‌ای ایمیل",
//       text: "فعال سازی ورود دو مرحله ای با استفاده از پیامکی که به ایمیل ko.mo.ko***@gmail.com  ارسال شده است.",
//     },
//   ];
//   return (
//     <>
//       <HeaderLayout>
//         <div className="container-style w-full pt-7 flex gap-10 flex-col">
//           <BreadcrumbNavigation />
//           <div className="lg:bg-gray42 lg:shadow-[0_0_12px_0_rgba(0,0,0,0.16)] rounded-2xl pb-10">
//             <div className="flex items-center justify-center " dir="rtl">
//               <div className=" ">
//                 <form className="w-full text-black1 text-center lg:pt-20 lg:text-xl text-sm font-medium">
//                   <h1>ورود دو مرحله‌ای</h1>
//                   <p className="pt-3 text-gray5 lg:text-base font-normal text-xs">
//                     برای امنیت بیشتر یکی از مراحل زیر را فعال کنید (تنها یک روش
//                     را میتوانید فعال کنید)
//                   </p>

//                   <div className="w-full flex gap-4 flex-col lg:mt-10 mt-6 mb-20">
//                     {MultiInfo.map((item, index) => (
//                       <MultiFactorCard
//                         dataCard={item}
//                         key={index}
//                         onClick={() => setModalType(item.type)}
//                       />
//                     ))}
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </HeaderLayout>

//       {modalType && (
//         <>
//           {modalType === "google" ? (
//             <VerifyGooglePage  closeModal={() => setModalType(null)} />
//           ) : (
//             <TwoFactorModal
//               type={modalType}
//               closeModal={() => setModalType(null)}
//             />
//           )}
//         </>
//       )}
//     </>
//   );
// }










import { useState } from "react";
import { useNavigate } from "react-router-dom"; // این خط جدید است
import BreadcrumbNavigation from "../../Components/BreadcrumbNavigation";
import HeaderLayout from "../../layouts/HeaderLayout";
import EmailIcon from "../../assets/Icons/authentication/EmailIcon";
import MultiFactorCard from "../../Components/MultiFactor/MultiFactorCard";
import Google from "../../assets/Icons/MultiFactor/Google.png";
import MessagesIcon from "../../assets/Icons/MultiFactor/Iconmessages";
import TwoFactorModal from "../../Components/MultiFactor/TwoFactorModal";
import VerifyGooglePage from "./GoogleAuthFlow";

export default function MultiFactor() {
  const [modalType, setModalType] = useState(null);
  const navigate = useNavigate(); // این خط جدید است

  const MultiInfo = [
    {
      type: "google",
      img: Google,
      button: "فعال کردن",
      Title: "تایید دو مرحله‌ای گوگل",
      text: "میتوانید با نصب اپلیکیشن google Authenticator هنگام ورود کد دو مرحله‌ای را دریافت کنید.",
    },
    {
      type: "sms",
      icon: <MessagesIcon />,
      button: "فعال کردن",
      Title: "تایید دو مرحله‌ای پیامک",
      text: "فعال سازی ورود دو مرحله ای با استفاده از پیامکی که به شماره 049893993*** ارسال شده است.",
    },
    {
      type: "email",
      icon: <EmailIcon />,
      button: "فعال کردن",
      Title: "تایید دو مرحله‌ای ایمیل",
      text: "فعال سازی ورود دو مرحله ای با استفاده از پیامکی که به ایمیل ko.mo.ko***@gmail.com  ارسال شده است.",
    },
  ];

  const handleCardClick = (type) => {
    if (type === "google") {
      navigate('/GoogleAuthFlow'); // آدرس صفحه مورد نظر برای گوگل را اینجا وارد کنید
    } else {
      setModalType(type);
    }
  };

  return (
    <>
      <HeaderLayout>
        <div className="container-style w-full pt-7 flex gap-10 flex-col">
          <BreadcrumbNavigation />
          <div className="lg:bg-gray42 lg:shadow-[0_0_12px_0_rgba(0,0,0,0.16)] rounded-2xl pb-10">
            <div className="flex items-center justify-center " dir="rtl">
              <div className=" ">
                <form className="w-full text-black1 text-center lg:pt-20 lg:text-xl text-sm font-medium">
                  <h1>ورود دو مرحله‌ای</h1>
                  <p className="pt-3 text-gray5 lg:text-base font-normal text-xs">
                    برای امنیت بیشتر یکی از مراحل زیر را فعال کنید (تنها یک روش
                    را میتوانید فعال کنید)
                  </p>
                  <div className="w-full flex gap-4 flex-col lg:mt-10 mt-6 mb-20">
                    {MultiInfo.map((item, index) => (
                      <MultiFactorCard
                        dataCard={item}
                        key={index}
                        onClick={() => handleCardClick(item.type)} // این خط اصلاح شده است
                      />
                    ))}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </HeaderLayout>
      {modalType && (
        <TwoFactorModal
          type={modalType}
          closeModal={() => setModalType(null)}
        />
      )}
    </>
  );
}