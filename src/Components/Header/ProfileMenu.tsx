import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import FrameIcon from "../../assets/icons/header/FrameIcon";
import IconUserAccount from "../../assets/icons/ProfileMenue/IconUserAccount";
import IconSecurity from "../../assets/icons/ProfileMenue/IconSecurity";
import IconAuthentication from "../../assets/icons/ProfileMenue/IconAuthentication";
import IconBankAccounts from "../../assets/icons/ProfileMenue/IconBankAccounts";
import IconConnecteddevices from "../../assets/icons/ProfileMenue/IconConnecteddevices";
import IconTransactionhistory from "../../assets/icons/ProfileMenue/IconTransactionhistory";
import IconExit from "../../assets/icons/ProfileMenue/IconExit";
import IconUser from "../../assets/icons/ProfileMenue/IconUser";
import IconArrowLeft from "../../assets/icons/ProfileMenue/IconArrowLeft";
// import LogOut from "../../assets/images/logout.png";
interface ProfileMenuProps {
  themeContext: {
    theme: "light" | "dark";
  };
  currentPath: string;
}

export default function ProfileMenu({
  themeContext,
  currentPath,
}: ProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [IsModal, setIsModal] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

const handleLogout = () => {
    // این توکن‌های امنیتی رو پاک می‌کنه
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("expiresAt");
    localStorage.removeItem("kycStepCompleted");
    
    // این خط برای پاک کردن اطلاعات فرم ثبت نام (رجیستر) هست
    localStorage.removeItem("tempContactValue");

    // کاربر رو به صفحه ورود هدایت می‌کنه
    window.location.href = "/login";
};
  
  return (
    <div className="relative" ref={menuRef}>

      <button
        onClick={() => setOpen(!open)}
        className={`hover:text-blue2 transition flex items-center ${currentPath === "/login"
          ? themeContext.theme === "dark"
            ? "text-primary"
            : "text-blue2 font-semibold"
          : "text-header-items"
          }`}
        aria-label="Profile"
      >
        <span className="w-9 h-9 icon-wrapper">
          <FrameIcon />
        </span>
      </button>


       
            <div
        className={`hidden lg:block absolute top-full left-0 mt-2 w-80 rounded-2xl shadow-lg bg-white8 text-sm z-50 overflow-hidden transition-transform duration-300 origin-top ${
          open
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0 pointer-events-none"
        }`}

      >
        <div
          dir="rtl"
          className="bg-gray33 py-4 px-3 flex items-center justify-between border border-gray21 m-4 rounded-[8px]"
        >
          <div className="flex ">
            <span className="w-[40px] h-[40px] icon-wrapper flex self-center text-center ml-1">
              <IconUser />
            </span>
            <div>
              <p className="font-semibold text-black1">کوثر محمدی</p>
              <p className="text-xs text-gray-500 pt-1">سطح کاربری 1</p>
            </div>
          </div>
          <button className="text-xs bg-blue13 text-blue1 px-3 py-2 rounded-lg  transition">
            ارتقا سطح
            <span className="w-5 h-5 icon-wrapper mr-1">
              <IconArrowLeft />
            </span>
          </button>
        </div>

        <ul dir="rtl" className="p-4 space-y-3 font-medium">
          <Link to={"/authProfile"} className="flex items-center gap-2 w-full">
            <li className="flex items-center gap-2 pt-1 hover:text-blue2 cursor-pointer text-black1">
              <span className="w-6 h-6">
                <IconUserAccount />
              </span>
              حساب کاربری
            </li>
          </Link>

           <Link to={"/Security settings"} className="flex items-center gap-2 w-full">
           <li className="flex items-center gap-2 hover:text-blue2 cursor-pointer pt-2 text-black1">
            <span className="w-6 h-6">
              <IconSecurity />
            </span>{" "}
            تنظیمات امنیت
          </li>
           </Link>
           <Link to={"/authentication"} className="flex items-center gap-2 w-full">
             <li className="flex items-center gap-2 hover:text-blue2 cursor-pointer pt-2 text-black1">
            <span className="w-6 h-6">
              <IconAuthentication />
            </span>{" "}
            احراز هویت
          </li>
           </Link>
          <Link to={"/authProfile"} className="flex items-center gap-2 w-full">
            <li className="flex items-center gap-2 hover:text-blue2 cursor-pointer pt-2 text-black1">
            <span className="w-6 h-6">
              <IconBankAccounts />
            </span>{" "}
            حساب‌های بانکی
          </li>

          </Link>

        <Link to={"/authProfile"} className="flex items-center gap-2 w-full">
         <li className="flex items-center gap-2 hover:text-blue2 cursor-pointer pt-2 text-black1">
            <span className="w-6 h-6">
              <IconTransactionhistory />
            </span>{" "}
            تاریخچه معاملات
          </li>
        </Link>
            <Link to={"/services/ConnectedDevices"} className="flex items-center gap-2 w-full">
              <li className="flex items-center gap-2 hover:text-blue2 cursor-pointer pt-2 pb-2 text-black1">
            <span className="w-6 h-6">
              <IconConnecteddevices />
            </span>{" "}
            دستگاه‌های متصل
          </li>


          </Link>
        </ul>

        <div
          onClick={() => {
            setIsModal(true);
            setOpen(false); // منو را می بندد
          }}
          className="p-4"
        >
          <button className="w-full rounded-xl border py-2 text-center border-blue2 text-blue-500 hover:bg-gray-100 transition">
            خروج از حساب کاربری
            <span className="w-6 h-6 icon-wrapper ml-1">
              <IconExit />
            </span>
          </button>
        </div>
      </div>




      {/* <div
        className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${open
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
          }`}
      >

        <div
          onClick={() => setOpen(false)}
          className="absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-300"
        ></div>


        <div
          className={`absolute top-0 left-88 w-72 h-full bg-white shadow-lg flex flex-col transform transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <div
            dir="rtl"
            className="bg-gray27 py-4 px-3 flex items-center justify-between border border-gray21 m-4 rounded-[8px]"
          >
            <div className="flex ">
              <span className="w-[40px] h-[40px] icon-wrapper flex self-center text-center ml-1">
                <IconUser />
              </span>
              <div>
                <p className="font-semibold text-black1">کوثر محمدی</p>
                <p className="text-xs text-gray-500 pt-1">سطح کاربری 1</p>
              </div>
            </div>
            <button className="text-xs bg-blue13 text-blue1 px-3 py-2 rounded-lg  transition">
              ارتقا سطح
              <span className="w-5 h-5 icon-wrapper mr-1">
                <IconArrowLeft />
              </span>
            </button>
          </div>

          <ul dir="rtl" className="p-4 space-y-3 font-medium">
            <Link
              to={"/authProfile"}
              className="flex items-center gap-2 w-full"
            >
              <li className="flex items-center gap-2 pt-1 hover:text-blue2 cursor-pointer">
                <span className="w-6 h-6">
                  <IconUserAccount />
                </span>
                حساب کاربری
              </li>
            </Link>
            <Link
              to={"/Security settings"}
              className="flex items-center gap-2 w-full"
            >
              <li className="flex items-center gap-2 hover:text-blue2 cursor-pointer pt-2">
                <span className="w-6 h-6">
                  <IconSecurity />
                </span>{" "}
                تنظیمات امنیت
              </li>
            </Link>
            <Link
              to={"/authentication"}
              className="flex items-center gap-2 w-full"
            >
              <li className="flex items-center gap-2 hover:text-blue2 cursor-pointer pt-2">
                <span className="w-6 h-6">
                  <IconAuthentication />
                </span>{" "}
                احراز هویت
              </li>
            </Link>
            <Link
              to={"/authProfile"}
              className="flex items-center gap-2 w-full"
            >
              <li className="flex items-center gap-2 hover:text-blue2 cursor-pointer pt-2">
                <span className="w-6 h-6">
                  <IconBankAccounts />
                </span>{" "}
                حساب‌های بانکی
              </li>
            </Link>
            <Link
              to={"/authProfile"}
              className="flex items-center gap-2 w-full"
            >
              <li className="flex items-center gap-2 hover:text-blue2 cursor-pointer pt-2">
                <span className="w-6 h-6">
                  <IconTransactionhistory />
                </span>{" "}
                تاریخچه معاملات
              </li>
            </Link>
            <Link
              to={"/authProfile"}
              className="flex items-center gap-2 w-full"
            >
              <li className="flex items-center gap-2 hover:text-blue2 cursor-pointer pt-2 pb-2">
                <span className="w-6 h-6">
                  <IconConnecteddevices />
                </span>{" "}
                دستگاه‌های متصل
              </li>
            </Link>
          </ul>

          <div
            onClick={() => {
              setIsModal(true);
              setOpen(false); // منو را می بندد
            }}
            className=" p-4 "
          >
            <button className="w-full rounded-xl border py-2 text-center border-blue2 text-blue-500 hover:bg-gray-100 transition">
              خروج از حساب کاربری
              <span className="w-6 h-6 icon-wrapper ml-1">
                <IconExit />
              </span>
            </button>
          </div>
        </div>
      </div> */}

      {IsModal && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-45"></div>
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            onClick={() => {
              setIsModal(false);
              console.log("Clicked outside, closing modal");
            }}
          >
            <div
              className="lg:w-3/12 w-11/12 rounded-lg lg:p-10 p-4 relative bg-white8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center gap-4 flex items-center justify-center flex-col">
                {/* <img src={LogOut} alt="LogOut" /> */}
                <h1 className="lg:text-2xl text-lg text-black0 font-medium">
                  خروج از حساب کاربری
                </h1>
                <p className="lg:text-lg text-sm text-gray5">
                  آیا از خروج از حساب کاربری خود اطمینان دارید. توجه داشته باشید
                  که اطلاعات شما نزد ما محفوظ میماند
                </p>
              </div>

              <div className="flex gap-2 mt-12 items-center justify-center ">
                <button

                  onClick={() => setIsModal(false)}
                  className="w-1/2 lg:py-3 py-2 border border-blue2 rounded-lg text-blue2  font-medium"
                >
                  انصراف
                </button>
                <Link to={""} className="w-1/2">
                  <button  onClick={handleLogout} className="w-full lg:py-3 py-2 font-bold bg-blue2 text-white2 rounded-lg ">
                    خروج
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}









// import { useState, useRef, useEffect } from "react";
// import { Link } from "react-router-dom";
// import FrameIcon from "../../assets/Icons/header/FrameIcon";
// import IconUserAccount from "../../assets/icons/ProfileMenue/IconUserAccount";
// import IconSecurity from "../../assets/icons/ProfileMenue/IconSecurity";
// import IconAuthentication from "../../assets/icons/ProfileMenue/IconAuthentication";
// import IconBankAccounts from "../../assets/icons/ProfileMenue/IconBankAccounts";
// import IconConnecteddevices from "../../assets/icons/ProfileMenue/IconConnecteddevices";
// import IconTransactionhistory from "../../assets/icons/ProfileMenue/IconTransactionhistory";
// import IconExit from "../../assets/icons/ProfileMenue/IconExit";
// import IconUser from "../../assets/icons/ProfileMenue/IconUser";
// import IconArrowLeft from "../../assets/icons/ProfileMenue/IconArrowLeft";
// import LogOut from "../../assets/images/logout.png";

// interface ProfileMenuProps {
//   themeContext: {
//     theme: "light" | "dark";
//   };
//   currentPath: string;
// }

// export default function ProfileMenu({
//   themeContext,
//   currentPath,
// }: ProfileMenuProps) {
//   const [open, setOpen] = useState(false);
//   const menuRef = useRef<HTMLDivElement | null>(null);
//   const [IsModal, setIsModal] = useState(false);

//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
//         setOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   // تابع خروج از حساب کاربری
//   const handleLogout = () => {
//     // این توکن‌های امنیتی رو پاک می‌کنه
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("refreshToken");
//     localStorage.removeItem("expiresAt");
//     localStorage.removeItem("kycStepCompleted");
//     
//     // این خط برای پاک کردن اطلاعات فرم ثبت نام (رجیستر) هست
//     localStorage.removeItem("tempContactValue");

//     // کاربر رو به صفحه ورود هدایت می‌کنه
//     window.location.href = "/login";
// };
//   return (
//     <div className="relative" ref={menuRef}>
//       <button
//         onClick={() => setOpen(!open)}
//         className={`hover:text-blue2 transition flex items-center ${
//           currentPath === "/login"
//             ? themeContext.theme === "dark"
//               ? "text-primary"
//               : "text-blue2 font-semibold"
//             : "text-header-items"
//         }`}
//         aria-label="Profile"
//       >
//         <span className="w-9 h-9 icon-wrapper">
//           <FrameIcon />
//         </span>
//       </button>

//       <div
//         className={`hidden lg:block absolute top-full left-0 mt-2 w-80 rounded-2xl shadow-lg bg-white text-sm z-50 overflow-hidden transition-transform duration-300 origin-top ${
//           open
//             ? "scale-100 opacity-100"
//             : "scale-95 opacity-0 pointer-events-none"
//         }`}
//       >
//         <div
//           dir="rtl"
//           className="bg-gray27 py-4 px-3 flex items-center justify-between border border-gray21 m-4 rounded-[8px]"
//         >
//           <div className="flex ">
//             <span className="w-[40px] h-[40px] icon-wrapper flex self-center text-center ml-1">
//               <IconUser />
//             </span>
//             <div>
//               <p className="font-semibold text-black1">کوثر محمدی</p>
//               <p className="text-xs text-gray-500 pt-1">سطح کاربری 1</p>
//             </div>
//           </div>
//           <button className="text-xs bg-blue13 text-blue1 px-3 py-2 rounded-lg  transition">
//             ارتقا سطح
//             <span className="w-5 h-5 icon-wrapper mr-1">
//               <IconArrowLeft />
//             </span>
//           </button>
//         </div>

//         <ul dir="rtl" className="p-4 space-y-3 font-medium">
//           <Link to={"/authProfile"} className="flex items-center gap-2 w-full">
//             <li className="flex items-center gap-2 pt-1 hover:text-blue2 cursor-pointer">
//               <span className="w-6 h-6">
//                 <IconUserAccount />
//               </span>
//               حساب کاربری
//             </li>
//           </Link>
//           <Link
//             to={"/ChangePassword"}
//             className="flex items-center gap-2 w-full"
//           >
//             <li className="flex items-center gap-2 hover:text-blue2 cursor-pointer pt-2">
//               <span className="w-6 h-6">
//                 <IconSecurity />
//               </span>
//               تنظیمات امنیت
//             </li>
//           </Link>
//           <Link
//             to={"/authentication"}
//             className="flex items-center gap-2 w-full"
//           >
//             <li className="flex items-center gap-2 hover:text-blue2 cursor-pointer pt-2">
//               <span className="w-6 h-6">
//                 <IconAuthentication />
//               </span>
//               احراز هویت
//             </li>
//           </Link>
//           <Link to={"/authProfile"} className="flex items-center gap-2 w-full">
//             <li className="flex items-center gap-2 hover:text-blue2 cursor-pointer pt-2">
//               <span className="w-6 h-6">
//                 <IconBankAccounts />
//               </span>
//               حساب‌های بانکی
//             </li>
//           </Link>

//           <Link to={"/authProfile"} className="flex items-center gap-2 w-full">
//             <li className="flex items-center gap-2 hover:text-blue2 cursor-pointer pt-2">
//               <span className="w-6 h-6">
//                 <IconTransactionhistory />
//               </span>{" "}
//               تاریخچه معاملات
//             </li>
//           </Link>
//           <Link
//             to={"/services/ConnectedDevices"}
//             className="flex items-center gap-2 w-full"
//           >
//             <li className="flex items-center gap-2 hover:text-blue2 cursor-pointer pt-2 pb-2">
//               <span className="w-6 h-6">
//                 <IconConnecteddevices />
//               </span>{" "}
//               دستگاه‌های متصل
//             </li>
//           </Link>
//         </ul>

//         <div
//           onClick={() => {
//             setIsModal(true);
//             setOpen(false); // منو را می بندد
//           }}
//           className="p-4"
//         >
//           <button className="w-full rounded-xl border py-2 text-center border-blue2 text-blue-500 hover:bg-gray-100 transition">
//             خروج از حساب کاربری
//             <span className="w-6 h-6 icon-wrapper ml-1">
//               <IconExit />
//             </span>
//           </button>
//         </div>
//       </div>

//       <div
//         className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
//           open
//             ? "opacity-100 pointer-events-auto"
//             : "opacity-0 pointer-events-none"
//         }`}
//       >
//         <div
//           onClick={() => setOpen(false)}
//           className="absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-300"
//         ></div>

//         <div
//           className={`absolute top-0 left-88 w-72 h-full bg-white shadow-lg flex flex-col transform transition-transform duration-300 ${
//             open ? "translate-x-0" : "translate-x-full"
//           }`}
//         >
//           <div
//             dir="rtl"
//             className="bg-gray27 py-4 px-3 flex items-center justify-between border border-gray21 m-4 rounded-[8px]"
//           >
//             <div className="flex ">
//               <span className="w-[40px] h-[40px] icon-wrapper flex self-center text-center ml-1">
//                 <IconUser />
//               </span>
//               <div>
//                 <p className="font-semibold text-black1">کوثر محمدی</p>
//                 <p className="text-xs text-gray-500 pt-1">سطح کاربری 1</p>
//               </div>
//             </div>
//             <button className="text-xs bg-blue13 text-blue1 px-3 py-2 rounded-lg  transition">
//               ارتقا سطح
//               <span className="w-5 h-5 icon-wrapper mr-1">
//                 <IconArrowLeft />
//               </span>
//             </button>
//           </div>

//           <ul dir="rtl" className="p-4 space-y-3 font-medium">
//             <Link
//               to={"/authProfile"}
//               className="flex items-center gap-2 w-full"
//             >
//               <li className="flex items-center gap-2 pt-1 hover:text-blue2 cursor-pointer">
//                 <span className="w-6 h-6">
//                   <IconUserAccount />
//                 </span>
//                 حساب کاربری
//               </li>
//             </Link>
//             <Link
//               to={"/Security settings"}
//               className="flex items-center gap-2 w-full"
//             >
//               <li className="flex items-center gap-2 hover:text-blue2 cursor-pointer pt-2">
//                 <span className="w-6 h-6">
//                   <IconSecurity />
//                 </span>{" "}
//                 تنظیمات امنیت
//               </li>
//             </Link>
//             <Link
//               to={"/authentication"}
//               className="flex items-center gap-2 w-full"
//             >
//               <li className="flex items-center gap-2 hover:text-blue2 cursor-pointer pt-2">
//                 <span className="w-6 h-6">
//                   <IconAuthentication />
//                 </span>{" "}
//                 احراز هویت
//               </li>
//             </Link>
//             <Link
//               to={"/authProfile"}
//               className="flex items-center gap-2 w-full"
//             >
//               <li className="flex items-center gap-2 hover:text-blue2 cursor-pointer pt-2">
//                 <span className="w-6 h-6">
//                   <IconBankAccounts />
//                 </span>{" "}
//                 حساب‌های بانکی
//               </li>
//             </Link>
//             <Link
//               to={"/authProfile"}
//               className="flex items-center gap-2 w-full"
//             >
//               <li className="flex items-center gap-2 hover:text-blue2 cursor-pointer pt-2">
//                 <span className="w-6 h-6">
//                   <IconTransactionhistory />
//                 </span>{" "}
//                 تاریخچه معاملات
//               </li>
//             </Link>
//             <Link
//               to={"/authProfile"}
//               className="flex items-center gap-2 w-full"
//             >
//               <li className="flex items-center gap-2 hover:text-blue2 cursor-pointer pt-2 pb-2">
//                 <span className="w-6 h-6">
//                   <IconConnecteddevices />
//                 </span>{" "}
//                 دستگاه‌های متصل
//               </li>
//             </Link>
//           </ul>

//           <div
//             onClick={() => {
//               setIsModal(true);
//               setOpen(false); // منو را می بندد
//             }}
//             className=" p-4 "
//           >
//             <button className="w-full rounded-xl border py-2 text-center border-blue2 text-blue-500 hover:bg-gray-100 transition">
//               خروج از حساب کاربری
//               <span className="w-6 h-6 icon-wrapper ml-1">
//                 <IconExit />
//               </span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {IsModal && (
//         <>
//           <div className="fixed inset-0 bg-black bg-opacity-50 z-45"></div>
//           <div
//             className="fixed inset-0 flex items-center justify-center z-50"
//             onClick={() => {
//               setIsModal(false);
//             }}
//           >
//             <div
//               className="lg:w-3/12 w-11/12 rounded-lg lg:p-10 p-4 relative bg-white8"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="text-center gap-4 flex items-center justify-center flex-col">
//                 <img src={LogOut} alt="LogOut" />
//                 <h1 className="lg:text-2xl text-lg text-black0 font-medium">
//                   خروج از حساب کاربری
//                 </h1>
//                 <p className="lg:text-lg text-sm text-gray5">
//                   آیا از خروج از حساب کاربری خود اطمینان دارید. توجه داشته باشید
//                   که اطلاعات شما نزد ما محفوظ میماند
//                 </p>
//               </div>

//               <div className="flex gap-2 mt-12 items-center justify-center ">
//                 <button
//                   onClick={() => setIsModal(false)}
//                   className="w-1/2 lg:py-3 py-2 border border-blue2 rounded-lg text-blue2  font-medium"
//                 >
//                   انصراف
//                 </button>
//                 <button
//                   onClick={handleLogout}
//                   className="w-1/2 lg:py-3 py-2 font-bold bg-blue2 text-white2 rounded-lg"
//                 >
//                   خروج
//                 </button>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }