import BreadcrumbNavigation from "../../Components/BreadcrumbNavigation";
import HeaderLayout from "../../layouts/HeaderLayout";
import IconCopy from "../../assets/Icons/AddFriend/IconCopy";
import IconUserAdd from "../../assets/Icons/AddFriend/IconUserAdd";
import inviteLeftImg from "../../assets/images/Addfriend/inviteLeft.png";
import inviteRightImg from "../../assets/images/Addfriend/inviteRight.png";
import addFriendLight from "../../assets/images/Addfriend/addFriendLight.png";
import addFriendDark from "../../assets/images/Addfriend/addFriendDark.png";
import { useContext, useRef, useState } from "react";
import { ThemeContext } from "../../Context/ThemeContext";
import IconGiftBox from "../../assets/Icons/AddFriend/IconGiftBox";
import Gift from "../../assets/images/Addfriend/GiftInvitImg.png";
import Share from "../../assets/images/Addfriend/shareimg.png";
import person from "../../assets/images/Addfriend/personimag.png";
import gitImg from "../../assets/images/Addfriend/giftimag.png";
import UserImg from "../../assets/images/Addfriend/User.png";
import IconClose from "../../assets/Icons/Login/IconClose";
import ReferralPercentBar from "../../Components/ReferralPercentBar";

export default function AddFriend() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("ThemeContext is undefined");
  const { theme } = context;
  const [activeTab, setActiveTab] = useState("transactions");
  const [IsModal, setIsModal] = useState<boolean>(false);
  const [selectedPercent, setSelectedPercent] = useState<number>(15);
  const lastChangedRef = useRef<"percent" | "input" | null>(null);
  const LinkInvite = [
    {
      Title: "لینک دعوت شما :",
      Link: "https://panel.payfa24.com/panel/referral",
      Icon: <IconCopy />,
    },
    { Title: "کد دعوت شما :", Link: "8387299kuru", Icon: <IconCopy /> },
  ];

  const BoxInvite = [
    { Icon: <IconGiftBox />, Text: "کل درآمد شما", count: "350,000 تومان" },
    { Icon: <IconUserAdd />, Text: "مجموع کاربران دعوت شده", count: "23نفر" },
  ];

  const QuestionBox = [
    {
      img: Share,
      title: "اشتراک گذاری لینک دعوت",
      description: "لینک اختصاصی خود را با دوستانتان به اشتراک بگذراید. ",
    },
    {
      img: person,
      title: "ثبت نام در پی فا 24",
      description:
        "دوستان شما زمانی که با کد دعوت اختصاصی شما ثبت نام کنند واحراز هویت خودر را تکمیل و شروع به معامله کنند",
    },
    {
      img: gitImg,
      title: "دریافت پاداش",
      description:
        "دوستان شما زمانی که با کد دعوت اختصاصی شما ثبت نام کنند واحراز هویت خودر را تکمیل و شروع به معامله کنند.",
    },
  ];

  const invitedUsersData = [
    {
      ID: "#154284",
      Date: "1404/08/09 | 12:34",
      Username: "کوثر محمدی",
      TotalFee: "4,703 تومان",
      YourCommission: "50%",
      YourFriendCommission: "50%",
    },
    {
      ID: "#154284",
      Date: "1404/08/09 | 12:34",
      Username: "کیان ایرانی",
      TotalFee: "4,703 تومان",
      YourCommission: "70%",
      YourFriendCommission: "30%",
    },
    {
      ID: "#154284",
      Date: "1404/08/09 | 12:34",
      Username: " مختار ثقفی",
      TotalFee: "4,703 تومان",
      YourCommission: "10%",
      YourFriendCommission: "90%",
    },
  ];

  return (
    <>
      <HeaderLayout>
        <div className="flex items-center flex-col justify-center">
          {/* All ==> */}
          <div className="w-full container-style my-8 ">
            <BreadcrumbNavigation />
            {/* Section1==> */}
            <div className="w-full  bg-gray41 rounded-2xl my-8 py-10  flex flex-row-reverse justify-evenly items-center overflow-x-hidden">
              {/* right==> */}
              <div className="hidden lg:block">
                <img
                  src={theme === "dark" ? addFriendDark : addFriendLight}
                  alt="theme-based image"
                  className="w-full max-w-[480px] h-auto lg:h-[305px]"
                />
              </div>
              {/* left==> */}
              <div className="space-y-5 lg:w-[580px] w-full px-4" dir="rtl">
                <h3 className="lg:text-xl text-sm font-medium text-black1">
                  با دعوت از دوستانتان از 25 تا 45 درصد در سود تراکنش‌های آن‌ها
                  پاداش بگیرید
                </h3>

                {LinkInvite.map((e, index) => (
                  <div key={index}>
                    <h3 className="font-medium text-black1">{e.Title}</h3>
                    <div className="flex items-center gap-1 text-gray5 lg:text-lg text-sm font-normal">
                      <span>{e.Link}</span>
                      <span className="icon-wrapper lg:w-6 lg:h-6 w-4 h-4">
                        {e.Icon}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="flex gap-5 justify-center flex-row">
                  {BoxInvite.map((item, index) => (
                    <div
                      key={index}
                      className="lg:w-[258px] lg:h-[142px] w-[145px] h-[107px] border border-gray12 rounded-xl flex gap-1 items-center flex-col justify-center text-black1 font-medium "
                    >
                      <span className="icon-wrapper lg:w-9 lg:h-9 w-7 h-7 text-blue2">
                        {item.Icon}
                      </span>
                      <p className="lg:text-base text-xs">{item.Text}</p>
                      <span className="lg:text-base text-xs font-medium">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setIsModal(!IsModal);
                  }}
                  className="w-full font-bold text-lg text-white2 bg-blue2 py-3 rounded-lg "
                >
                  تنظیم درصد سود
                </button>
              </div>
            </div>
            {/* =============================================== */}
            {/* section 2 */}
            <div className="flex justify-center gap-5 items-center flex-wrap">
              <img
                src={inviteLeftImg}
                alt="inviteLeftImg"
                className="max-w-full h-auto"
              />
              <img
                src={inviteRightImg}
                alt="inviteRightImg"
                className="max-w-full h-auto"
              />
            </div>

            {/* ======================== */}
            {/* section 3 */}
            <div
              className="flex flex-col w-full space-y-8 items-start mt-14"
              dir="rtl"
            >
              <h3 className="text-black1 font-medium lg:text-2xl text-base">
                چطور پاداش دریافت کنیم؟
              </h3>
              <div className="relative w-full gap-4 flex">
                <div className="flex lg:flex-row flex-col justify-between items-center lg:items-start lg:gap-0 gap-8">
                  {QuestionBox.map((item, index) => (
                    <div
                      key={index}
                      className="flex lg:flex-col h-full w-full lg:gap-0 gap-3 flex-row lg:items-center items-start lg:text-center text-start flex-1 lg:max-w-f "
                    >
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-20 h-20 object-c p-1"
                      />

                      {/* عنوان و توضیحات */}
                      <div className="space-y-1">
                        <span className="text-black1 lg:text-lg text-sm font-medium text-start">
                          {item.title}
                        </span>
                        <p className="lg:text-sm text-xs font-normal text-gray5">
                          {item.description}
                        </p>
                      </div>

                      {index < QuestionBox.length - 1 && (
                        <div
                          className="lg:block hidden absolute w-[33%] h-[2px] bg-gradient-to-r from-transparent via-blue2 to-transparent opacity-70"
                          style={{
                            left: `${
                              ((index + 1) * 100) / QuestionBox.length
                            }%`,
                            top: "30px",
                            transform: "translateX(-50%)",
                          }}
                        ></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* ================= */}
            {/* section 4 */}
            <div
              className="w-full lg:border rounded-xl border-gray21 lg:p-6 shadow-sm mt-20"
              dir="rtl"
            >
              {/* تب‌ها */}
              <div className="flex flex-row-reverse lg:items-end items-center justify-center lg:justify-end gap-6 pb-2">
                <button
                  onClick={() => setActiveTab("transactions")}
                  className={`pb-2 lg:text-lg text-sm ${
                    activeTab === "transactions"
                      ? "text-blue2 border-b-2 border-blue2 font-normal"
                      : "text-gray5"
                  }`}
                >
                  تراکنش‌های کاربران
                </button>
                <button
                  onClick={() => setActiveTab("invited")}
                  className={`pb-2  lg:text-lg text-sm ${
                    activeTab === "invited"
                      ? "text-blue2 border-b-2 border-blue2 font-medium"
                      : "text-gray5"
                  }`}
                >
                  کاربران دعوت شده
                </button>
              </div>
              {/* محتوا */}
              <div className="mt-5">
                {/* جدول تراکنش‌ها */}
                {activeTab === "transactions" && (
                  <div className="w-full overflow-hidden">
                    {/* هدر دسکتاپ */}
                    <div className="hidden lg:grid lg:grid-cols-6 bg-gray41 p-3 text-black0 font-medium items-center text-center text-base">
                      <span>شناسه</span>
                      <span>تاریخ و زمان</span>
                      <span>نام کاربر</span>
                      <span>کل کارمزد</span>
                      <span>پورسانت شما</span>
                      <span>پورسانت دوستان</span>
                    </div>
                    {invitedUsersData.map((item, index) => (
                      <div
                        key={index}
                        className="lg:grid lg:grid-cols-6 mt-3 lg:mt-0 lg:p-3 p-4 gap-4 lg:gap-0 rounded-2xl lg:rounded-none lg:space-y-0 space-y-4 text-sm text-black0 items-center text-center border lg:border-b-0 border-gray21"
                      >
                        {/* چیدمان موبایل */}
                        <div className="flex flex-col space-y-2 lg:hidden border-b pb-3 border-gray21">
                          <div className="flex flex-row justify-between items-center">
                            <span className="font-medium lg:text-black0 text-gray5 text-xs">
                              تاریخ و زمان
                            </span>
                            <span className="text-black0 text-sm">
                              {item.Date}
                            </span>
                          </div>
                          <div className="flex flex-row justify-between items-center">
                            <span className="font-medium lg:text-black0 text-gray5">
                              نام کاربر
                            </span>
                            <span className="text-black0 text-sm">
                              {item.Username}
                            </span>
                          </div>
                          <div className="flex flex-row justify-between items-center">
                            <span className="font-medium lg:text-black0 text-gray5">
                              کل کارمزد
                            </span>
                            <span className="text-black0 text-sm">
                              {item.TotalFee}
                            </span>
                          </div>
                        </div>
                        <div className="lg:hidden flex flex-row items-center justify-between w-full pt-3">
                          <div className="flex items-center flex-col gap-2 w-1/2">
                            <span className="font-medium lg:text-black0 text-gray5">
                              پورسانت شما
                            </span>
                            <span className="text-black0 text-sm">
                              {item.YourCommission}
                            </span>
                          </div>
                          <div className="border-l border-gray21 h-10 mx-2"></div>
                          <div className="flex items-center flex-col gap-2 w-1/2">
                            <span className="font-medium lg:text-black0 text-gray5">
                              پورسانت دوستان
                            </span>
                            <span className="text-black0 text-sm">
                              {item.YourFriendCommission}
                            </span>
                          </div>
                        </div>
                        {/* چیدمان دسکتاپ */}
                        <span className="hidden lg:block">{item.ID}</span>
                        <span className="hidden lg:block">{item.Date}</span>
                        <span className="hidden lg:block">{item.Username}</span>
                        <span className="hidden lg:block">{item.TotalFee}</span>
                        <span className="hidden lg:block">
                          {item.YourCommission}
                        </span>
                        <span className="hidden lg:block">
                          {item.YourFriendCommission}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* جدول کاربران دعوت شده */}

                {activeTab === "invited" &&
                  (invitedUsersData.length > 0 ? (
                    <div className="w-full overflow-hidden">
                      {/* هدر دسکتاپ */}
                      <div className="hidden lg:grid lg:grid-cols-4 bg-gray41 border border-gray21 p-3 text-base text-black0 font-medium items-center text-center">
                        <span>نام کاربر</span>
                        <span>تاریخ و زمان</span>
                        <span>پورسانت شما</span>
                        <span>پورسانت دوستان</span>
                      </div>
                      {invitedUsersData.map((item, index) => (
                        <div
                          key={index}
                          className="p-4 lg:p-3 flex flex-col lg:grid lg:grid-cols-4 lg:border-b-0 mt-3 lg:mt-0 rounded-xl lg:rounded-none border border-gray21"
                        >
                          {/* چیدمان موبایل */}
                          <div className="flex flex-col space-y-2 lg:hidden ">
                            <div className="flex items-center gap-2">
                              <img
                                className="w-10 h-10 "
                                src={UserImg}
                                alt="User"
                              />
                              <div className="flex justify-between w-full items-center">
                                <div className="font-medium text-black0 text-sm">
                                  {item.Username}
                                </div>
                                <div className="text-black0 text-xs">
                                  {item.Date}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-row justify-between w-full pt-3 border-t border-gray21">
                              <div className="flex flex-col items-center gap-2 w-1/2">
                                <div className="font-medium text-gray5 text-sm">
                                  پورسانت شما
                                </div>
                                <div className="text-gray5 text-lg">
                                  {item.YourCommission}
                                </div>
                              </div>
                              <div className="border-l border-gray21 h-10 mx-2"></div>
                              <div className="flex flex-col items-center gap-2 w-1/2">
                                <div className="font-medium text-black0 text-sm">
                                  پورسانت دوستان
                                </div>
                                <div className="text-black0 text-lg">
                                  {item.YourFriendCommission}
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* چیدمان دسکتاپ */}
                          <span className="hidden lg:block text-center text-black0">
                            {item.Username}
                          </span>
                          <span className="hidden lg:block text-center text-black0">
                            {item.Date}
                          </span>
                          <span className="hidden lg:block text-center text-black0">
                            {item.YourCommission}
                          </span>
                          <span className="hidden lg:block text-center text-black0">
                            {item.YourFriendCommission}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div
                      style={{ backgroundImage: `url(${Gift})` }}
                      className="bg-center bg-no-repeat flex flex-col items-center justify-center gap-3 mt-6 py-20 rounded-lg"
                    >
                      <h1 className="text-2xl font-medium text-black1">
                        هنوز کاربری دعوت نکرده‌اید!
                      </h1>
                      <p className="text-lg text-gray5 text-center">
                        با اشتراک‌گذاری لینک دعوتتان با دوستان، از تراکنش‌های
                        آن‌ها پاداش دریافت کنید.
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {IsModal && (
          <>
            <div
            
              onClick={() => setIsModal(false)}
              className="fixed inset-0 bg-black/25 z-40 cursor-pointer"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="fixed inset-0 flex items-center justify-center z-50"
              >
                <div className="bg-white8 w-full max-w-md lg:rounded-xl shadow-lg overflow-hidden p-6">
                  {/* هدر */}
                  <div className="flex justify-between items-center border-b border-gray21 pb-4">
                    <span
                      className="icon-wrapper w-6 h-6 cursor-pointer text-gray5 hover:text-black0"
                      onClick={() => setIsModal(false)}
                    >
                      <IconClose />
                    </span>
                    <span className="text-black0 font-medium text-base">
                      تنظیم درصد سود
                    </span>
                  </div>

                  {/* متن راهنما */}
                  <p className="text-black0 text-xs lg:text-sm text-end mt-6">
                    . میزان سود خود و دوستتان را از کارمزد معاملات مشخص کنید
                  </p>

                  {/* اسلایدر */}
                  <div className="mt-14">
                    <ReferralPercentBar
                      selectedPercent={selectedPercent}
                      setSelectedPercent={setSelectedPercent}
                      lastChangedRef={lastChangedRef}
                    />
                  </div>

                  {/* نمایش پورسانت‌ها */}
                  <div className="flex flex-col items-center mt-14 mb-14">
                    <div className="grid grid-cols-2 w-full text-center gap-y-2">
   
                      <span className="text-gray5 lg:text-sm text-xs font-medium">
                        پورسانت شما
                      </span>
                      <span className="text-gray5 lg:text-sm text-xs font-medium">
                        پورسانت دوستان
                      </span>

                      <span className="text-black0 text-lg font-bold">
                        {100 - selectedPercent}%
                      </span>
                      <div className="relative">
                        <span className="text-black0 text-lg font-bold">
                          {selectedPercent}%
                        </span>
                        <div className="absolute left-[-10px] top-1/4 w-px h-10 bg-gray2 transform -translate-y-1/2"></div>
                      </div>
                    </div>
                  </div>

                    <button className="w-full font-bold text-base text-white2 bg-blue2 lg:py-3 py-2 rounded-lg">
                      تایید
                    </button>
                </div>
              </div>
            </div>
          </>
        )}
      </HeaderLayout>
    </>
  );
}
