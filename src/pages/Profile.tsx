// import EmailIcon from "../assets/Icons/authentication/EmailIcon";
// import IconcardBank from "../assets/Icons/authentication/IconcardBank";
// import IconUserOctagon from "../assets/Icons/authentication/IconUserOctagon";
// import BreadcrumbNavigation from "../components/BreadcrumbNavigation";
// import HeaderLayout from "../layouts/HeaderLayout";
// import profile from "../assets/images/Profile/Profile.png";
// export default function Profile() {
//   return (
//     <>
//       <HeaderLayout>
//         <div className="container-style w-full pt-7  flex gap-10 flex-col">
//           <BreadcrumbNavigation />
//           <div className="bg-gray25 w-full lg:shadow-[0_0_12px_0_rgba(0,0,0,0.16)] rounded-2xl lg:pb-10">
//             <div>
//               {/* all */}
//               <div className="flex items-center justify-center flex-col ">
//                 <img
//                   className="mb-6 lg:mt-14 mt-8"
//                   src={profile}
//                   alt="ProfilePicture"
//                 />

//                 {/* above */}
//                 <div className="flex justify-between flex-row-reverse lg:text-lg font-normal text-sm lg:mb-10 mb-8 lg:w-[498px] w-full ">
//                   <div className="flex flex-col text-end gap-4 text-gray5">
//                     <span>سطح کاربری</span>
//                     <span>شماره موبایل</span>
//                     <span>تاریخ عضویت</span>
//                   </div>
//                   <div className="flex flex-col gap-4 text-black1">
//                     <span>احراز هویت نشده</span>
//                     <span>09389303983</span>
//                     <span>1404/05/13</span>
//                   </div>
//                 </div>
//                 {/* under */}
//                 <form className="lg:w-[498px] w-full border-solid border-blue2 rounded-lg border-[1px] md:flex flex-col p-6 dark:text-white justify-center sm:justify-end">
//                   <h1 className="text-right mb-5 text-blue2">
//                     سطح 1 : احراز هویت پایه
//                   </h1>
//                   <div className="flex flex-row items-center justify-end">
//                     <span className="mr-2 text-black1">ثبت ایمیل</span>
//                     <span className="icon-wrapper w-7 h7 text-blue2">
//                       <EmailIcon />
//                     </span>
//                   </div>
//                   <div className="flex flex-row items-center justify-end">
//                     <span className="mr-2 text-black1">مشخصات فردی</span>
//                     <span className="icon-wrapper w-7 h7 text-blue2">
//                       <IconUserOctagon />
//                     </span>
//                   </div>
//                   <div className="flex flex-row items-center justify-end">
//                     <span className="mr-2 text-black1">کارت بانکی</span>
//                     <span className="icon-wrapper w-7 h7 text-blue2">
//                       <IconcardBank />
//                     </span>
//                   </div>
//                   <div dir="rtl">
//                     <p className="text-right mt-5">دسترسی ها :</p>
//                     <ul className="list-disc list-inside text-right text-gray15">
//                       <li>مشاهده قیمت‌ها</li>
//                       <li>خرید و فروش رمز ارزها</li>
//                     </ul>
//                   </div>
//                   <button className="bg-blue2 flex items-center justify-center w-full mt-5 h-[48px] rounded-lg text-white2 font-bold">
//                     احراز هویت
//                   </button>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </HeaderLayout>
//     </>
//   );
// }

// برای وقتی     api   و گرفتی

import { useState } from "react";
import EmailIcon from "../assets/Icons/authentication/EmailIcon";
import IconcardBank from "../assets/Icons/authentication/IconcardBank";
import IconUserOctagon from "../assets/Icons/authentication/IconUserOctagon";
import HeaderLayout from "../layouts/HeaderLayout";
import profile from "../assets/images/Profile/Profile.png";
import IdentyIcon from "../assets/Icons/authentication/IdentyIcon";
import IconCardIdenty from "../assets/Icons/authentication/IconCardIdenty";
import BreadcrumbNavigation from "../Components/BreadcrumbNavigation";

export default function Profile() {
  // حالت برای سطح احراز هویت و ایمیل (داده‌های تست)
  const [verificationLevel, setVerificationLevel] = useState(0);
  const [userEmail, setUserEmail] = useState("ko.mosar@gmail.com");

  // تابع برای تغییر دستی سطح (برای تست)
  const handleToggleLevel = () => {
    setVerificationLevel((prev) => (prev === 0 ? 1 : 0));
  };

  return (
    <>
      <HeaderLayout>
        <div className="container-style w-full pt-7 flex gap-10 flex-col">
          <BreadcrumbNavigation />
          <div className="bg-gray25 w-full lg:shadow-[0_0_12px_0_rgba(0,0,0,0.16)] rounded-2xl lg:pb-10">
            <div>
              {/* all */}
              <div className="flex items-center justify-center flex-col ">
                <img
                  className="mb-6 lg:mt-14 mt-8"
                  src={profile}
                  alt="ProfilePicture"
                />

                {/* above - بخش مشترک اطلاعات کاربر */}
                <div className="flex justify-between flex-row-reverse lg:text-lg font-normal text-sm lg:mb-10 mb-8 lg:w-[498px] w-full ">
                  <div className="flex flex-col text-end gap-4 text-gray5">
                    <span>سطح کاربری</span>
                    <span>شماره موبایل</span>
                    <span>تاریخ عضویت</span>
                    {verificationLevel >= 1 && <span>ایمیل</span> }
                  </div>
                  <div className="flex flex-col gap-4 text-black1">
                    <span>
                      {verificationLevel === 0 ? "احراز هویت نشده" : "سطح 1"}
                    </span>
                    <span>09389303983</span>
                    <span>1404/05/13</span>
                    {verificationLevel >= 1 && <span>{userEmail}</span>}
                  </div>
                </div>

                {/* دکمه برای تست دستی تغییر سطح */}
                <button
                  className="bg-blue2 text-white2 font-bold rounded-lg px-4 py-2 mb-4"
                  onClick={handleToggleLevel}
                >
                  تغییر سطح احراز هویت (تست)
                </button>

                {/* under - بخش شرطی فرم احراز هویت */}
                {verificationLevel === 0 ? (
                  // فرم سطح 1 (سمت چپ تصویر)
                  <form className="lg:w-[498px] w-full border-solid border-blue2 rounded-lg border-[1px] md:flex flex-col p-6 dark:text-white justify-center sm:justify-end">
                    <h1 className="text-right mb-5 text-blue2">
                      سطح 1 : احراز هویت پایه
                    </h1>
                    <div className="flex flex-row items-center justify-end">
                      <span className="mr-2 text-black1">ثبت ایمیل</span>
                      <span className="icon-wrapper w-7 h7 text-blue2">
                        <EmailIcon />
                      </span>
                    </div>
                    <div className="flex flex-row items-center justify-end">
                      <span className="mr-2 text-black1">مشخصات فردی</span>
                      <span className="icon-wrapper w-7 h7 text-blue2">
                        <IconUserOctagon />
                      </span>
                    </div>
                    <div className="flex flex-row items-center justify-end">
                      <span className="mr-2 text-black1">کارت بانکی</span>
                      <span className="icon-wrapper w-7 h7 text-blue2">
                        <IconcardBank />
                      </span>
                    </div>
                    <div dir="rtl">
                      <p className="text-right mt-5">دسترسی ها :</p>
                      <ul className="list-disc list-inside text-right text-gray15">
                        <li>مشاهده قیمت‌ها</li>
                        <li>خرید و فروش رمز ارزها</li>
                      </ul>
                    </div>
                    <button className="bg-blue2 flex items-center justify-center w-full mt-5 h-[48px] rounded-lg text-white2 font-bold">
                      احراز هویت
                    </button>
                  </form>
                ) : (
                  // فرم سطح 2 (سمت راست تصویر)

                  <form className="lg:w-[498px] text-gray15 w-full items-end mb-5 border-solid border-blue2 rounded-lg border-[1px] md:flex flex-col p-6 justify-center sm:justify-end">
                    <h1 className="text-right text-blue2 font-medium">
                      سطح 2 : احراز هویت پیشرفته
                    </h1>
                    <div className="flex flex-row items-center justify-end mt-5">
                      <span className="mr-2 text-black1">ثبت مدرک شناسایی</span>
                      <span className="icon-wrapper w-7 h-7 text-blue2">
                        <IconCardIdenty/>
                      </span>
                    </div>
                    <div className="flex flex-row items-center justify-end">
                      <span className="mr-2 text-black1">تایید هویت</span>
                      <span className="icon-wrapper w-7 h-7 text-blue2">
                        <IdentyIcon />
                      </span>
                    </div>
                    <div dir="rtl">
                      <p className="mt-5 text-right text-black1">
                        {" "}
                        دسترسی ها :{" "}
                      </p>
                      <ul className="flex flex-col gap-1 list-inside list-disc text-gray5 lg:text-base text-sm">
                        <li className="text-right">
                          10 میلیون تومان برداشت ریالی روزانه
                        </li>
                        <li className="text-right">
                          10 میلیون تومان برداشت ارزی روزانه
                        </li>
                        <li className="text-right">دسترسی به ارز Utopia USD</li>
                      </ul>
                    </div>
                    <button
                      className="bg-blue2 w-full mt-5 h-[48px] rounded-lg text-white2 font-bold"
                      //   onClick={onStart}
                    >
                      احراز هویت
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </HeaderLayout>
    </>
  );
}
