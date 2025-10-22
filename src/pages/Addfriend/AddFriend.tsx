import HeaderLayout from "../../layouts/HeaderLayout";
import IconCopy from "../../assets/Icons/AddFriend/IconCopy";
import IconUserAdd from "../../assets/Icons/AddFriend/IconUserAdd";
import inviteLeftImg from "../../assets/images/Addfriend/inviteLeft.png";
import inviteRightImg from "../../assets/images/Addfriend/inviteRight.png";
import addFriendLight from "../../assets/images/Addfriend/addFriendLight.png";
import addFriendDark from "../../assets/images/Addfriend/addFriendDark.png";
import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../../Context/ThemeContext";
import IconGiftBox from "../../assets/Icons/AddFriend/IconGiftBox";
import Gift from "../../assets/images/Addfriend/GiftInvitImg.png";
import Share from "../../assets/images/Addfriend/shareimg.png";
import person from "../../assets/images/Addfriend/personimag.png";
import gitImg from "../../assets/images/Addfriend/giftimag.png";
import UserImg from "../../assets/images/Addfriend/User.png";
import IconClose from "../../assets/Icons/Login/IconClose";
import ReferralPercentBar from "../../Components/ReferralPercentBar";
import { toast } from "react-toastify";
import BreadcrumbNavigation from "../../components/BreadcrumbNavigation";
import {
  setReferralCommission,
  getReferralTransactions,
  getReferralReport,
  InvitedUserReportItem,
  TransactionItem,
  ReferralReportResponse,
} from "../../utils/api/referralApi";

interface InvitedUserItem extends InvitedUserReportItem {}
interface TransactionItemExt extends TransactionItem {}
interface ReferralReport extends ReferralReportResponse {}

export default function AddFriend() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("ThemeContext is undefined");
  const { theme } = context;

  const [activeTab, setActiveTab] = useState("transactions");
  const [IsOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const lastChangedRef = useRef<"percent" | "input" | null>(null);

  const [selectedPercent, setSelectedPercent] = useState<number>(15);
  const [transactions, setTransactions] = useState<TransactionItemExt[]>([]);
  const [invitedUsers, setInvitedUsers] = useState<InvitedUserItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalTransactionPages, setTotalTransactionPages] = useState<number>(1);
  const [referralReport, setReferralReport] = useState<ReferralReport | null>(
    null
  );

  const maxPercent = 30;
  const currentCallerPercent = referralReport?.referralPercent ?? 0;
  const currentFriendPercent = maxPercent - currentCallerPercent;

  const fetchReferralReportData = async () => {
    setIsLoading(true);
    try {
      const reportResponse = await getReferralReport();
      if (reportResponse) {
        setReferralReport(reportResponse);
        setSelectedPercent(maxPercent - reportResponse.referralPercent);
        if (reportResponse.user_referral) {
          setInvitedUsers(reportResponse.user_referral || []);
        } else {
          setInvitedUsers([]);
        }
      }
    } catch (error) {
      toast.error("خطا در دریافت گزارش رفرال.");
      setInvitedUsers([]);
    } finally {
      setIsLoading(false); // ✅ حتما false می‌شه!
    }
  };

  const fetchTransactionsData = async () => {
    setIsLoading(true);
    try {
      const response = await getReferralTransactions(currentPage);
      if (response && response.lists) {
        setTransactions(response.lists);
        setTotalTransactionPages(Math.ceil(response.total / 10));
      } else {
        setTransactions([]);
      }
    } catch (error) {
      toast.error("خطا در دریافت لیست تراکنش‌ها.");
      setTransactions([]);
    } finally {
      setIsLoading(false); // ✅ حتما false می‌شه!
    }
  };

  const handleSaveCommissionSplit = async () => {
    if (isLoading) return;

    const friendPercentToSend = selectedPercent;
    if (friendPercentToSend === currentFriendPercent) {
      toast.info("درصد تغییر نکرده است.");
      setIsOpenModal(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await setReferralCommission(friendPercentToSend);
      if (response.status) {
        toast.success(response.msg || "تقسیم سود با موفقیت ذخیره شد.");
        await fetchReferralReportData();
        setIsOpenModal(false);
      } else {
        toast.error(response.msg || "مشکلی در ذخیره درصد پیش آمد.");
      }
    } catch (error) {
      toast.error("خطا در برقراری ارتباط با سرور.");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ فقط 1 بار لود کن
  useEffect(() => {
    fetchReferralReportData();
  }, []);

  // ✅ تب عوض شد → داده‌ها رو لود کن
  useEffect(() => {
    if (activeTab === "transactions") {
      fetchTransactionsData();
    }
    // invited نیازی به لود نداره - از report میاد
  }, [activeTab]);

  const LinkInvite = [
    {
      Title: "لینک دعوت شما :",
      Link: referralReport?.reflink || "درحال بارگذاری...",
      Icon: <IconCopy />,
    },
    {
      Title: "کد دعوت شما :",
      Link: referralReport?.refid?.toString() || "درحال بارگذاری...",
      Icon: <IconCopy />,
    },
  ];

  const BoxInvite = [
    {
      Icon: <IconGiftBox />,
      Text: "مجموع درآمد شما",
      count:
        (referralReport?.referral_transaction_amount?.toLocaleString() || "0") +
        " تومان",
    },
    {
      Icon: <IconUserAdd />,
      Text: "مجموع کاربران دعوت شده",
      count: (invitedUsers.length || "0") + " نفر",
    },
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

  // ✅ تابع هدیه
  const EmptyState = (title: string, description: string) => (
    <div
      style={{ backgroundImage: `url(${Gift})` }}
      className="bg-center bg-no-repeat flex flex-col items-center justify-center gap-3 mt-6 py-20 rounded-lg"
    >
      <h1 className="text-2xl font-medium text-black1">{title}</h1>
      <p className="text-lg text-gray5 text-center">{description}</p>
    </div>
  );

  return (
    <>
      <HeaderLayout>
        <div className="flex items-center flex-col justify-center">
          <div className="w-full container-style my-8 ">
            <BreadcrumbNavigation />

            {/* Section1 */}
            <div className="w-full bg-gray41 rounded-2xl my-8 py-10 flex flex-row-reverse justify-evenly items-center overflow-x-hidden">
              <div className="hidden lg:block">
                <img
                  src={theme === "dark" ? addFriendDark : addFriendLight}
                  alt="theme-based image"
                  className="w-full max-w-[480px] h-auto lg:h-[305px]"
                />
              </div>
              <div className="space-y-5 lg:w-[580px] w-full px-4" dir="rtl">
                <h3 className="lg:text-xl text-sm font-medium text-black1">
                  با دعوت از دوستانتان از 25 تا 45 درصد در سود تراکنش‌های آن‌ها
                  پاداش بگیرید
                </h3>

                {LinkInvite.map((e, index) => (
                  <div key={index}>
                    <h3 className="font-medium text-black1">{e.Title}</h3>
                    <div
                      onClick={() => {
                        if (
                          !isLoading &&
                          e.Link &&
                          e.Link !== "درحال بارگذاری..."
                        ) {
                          navigator.clipboard.writeText(e.Link);
                          toast.info(`${e.Title} کپی شد.`);
                        }
                      }}
                      className={`items-center gap-1 inline-block text-gray5 lg:text-lg text-sm font-normal ${
                        !isLoading && e.Link !== "درحال بارگذاری..."
                          ? "cursor-pointer"
                          : ""
                      }`}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-1">
                          <div className="skeleton-bg h-6 w-72 rounded-md"></div>
                        </div>
                      ) : (
                        <>
                          <div>
                            <span>{e.Link}</span>
                            <span className="icon-wrapper lg:w-6 lg:h-6 w-4 h-4">
                              {e.Icon}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}

                <div className="flex gap-5 justify-center flex-row">
                  {BoxInvite.map((item, index) => (
                    <div
                      key={index}
                      className="lg:w-2/4 lg:h-[142px] w-[145px] h-[107px] border border-gray12 rounded-xl flex gap-1 items-center flex-col justify-center text-black1 font-medium"
                    >
                      <span className="icon-wrapper lg:w-9 lg:h-9 w-7 h-7 text-blue2">
                        {item.Icon}
                      </span>
                      <p className="lg:text-base text-xs">{item.Text}</p>
                      {isLoading ? (
                        <span className="skeleton-bg w-16 h-4 rounded-sm"></span>
                      ) : (
                        <span className="lg:text-base text-xs font-medium">
                          {item.count}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex flex-row justify-between w-full py-6 border border-gray21 rounded-xl text-black0">
                  <div className="flex flex-col items-center gap-2 w-1/2">
                    <div className="font-medium text-sm">
                      سهم دریافتی دوستتان
                    </div>
                    {isLoading ? (
                      <span className="skeleton-bg w-12 h-4 rounded-sm"></span>
                    ) : (
                      <p>{currentCallerPercent}%</p>
                    )}
                  </div>
                  <div className="border-l border-gray21 h-14"></div>
                  <div className="flex flex-col items-center gap-2 w-1/2">
                    <div className="font-medium text-sm">سهم دریافتی شما</div>
                    {isLoading ? (
                      <span className="skeleton-bg w-14 h-4 rounded-sm"></span>
                    ) : (
                      <p>{currentFriendPercent}%</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedPercent(currentFriendPercent);
                    setIsOpenModal(!IsOpenModal);
                  }}
                  className="w-full font-bold text-lg text-white2 bg-blue2 py-3 rounded-lg hover:bg-blue1"
                  disabled={isLoading}
                >
                  {isLoading ? "درحال بارگذاری..." : "تنظیم درصد سود"}
                </button>
              </div>
            </div>

            {/* Section 2 */}
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

            {/* Section 3 */}
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
                      className="flex lg:flex-col h-full w-full lg:gap-0 gap-3 flex-row lg:items-center items-start lg:text-center text-start flex-1 lg:max-w-f"
                    >
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-20 h-20 object-c p-1"
                      />
                      <div className="space-y-1">
                        <span className="text-black1 lg:text-lg text-sm font-medium text-start">
                          {item.title}
                        </span>
                        <p className="lg:text-sm text-xs font-normal text-gray5">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 4 - تب‌ها */}
            <div
              className="w-full lg:border rounded-xl border-gray21 lg:p-6 shadow-sm mt-20"
              dir="rtl"
            >
              <div className="flex flex-row-reverse lg:items-end items-center justify-center lg:justify-end gap-6 pb-2">
                <button
                  onClick={() => {
                    setActiveTab("transactions");
                  }}
                  className={`pb-2 lg:text-lg text-sm ${
                    activeTab === "transactions"
                      ? "text-blue2 border-b-2 border-blue2 font-normal"
                      : "text-gray5"
                  }`}
                >
                  تراکنش‌های کاربران
                </button>
                <button
                  onClick={() => {
                    setActiveTab("invited");
                  }}
                  className={`pb-2 lg:text-lg text-sm ${
                    activeTab === "invited"
                      ? "text-blue2 border-b-2 border-blue2 font-medium"
                      : "text-gray5"
                  }`}
                >
                  کاربران دعوت شده
                </button>
              </div>

              <div className="mt-5 w-full">
                {/* ✅ تب تراکنش‌ها */}
                {activeTab === "transactions" &&
                  (isLoading ? (
                    <div className="py-10 text-center flex flex-col  gap-4 w-full">
                      <span className="skeleton-bg w-2/6 h-8 mx-auto block rounded-md"></span>
                      <span className="skeleton-bg w-2/6 h-6 mx-auto block rounded-md"></span>
                    </div>
                  ) : transactions.length > 0 ? (
                    <div className="w-full overflow-hidden">
                      <div className="hidden lg:grid lg:grid-cols-6 bg-gray41 p-3 text-black0 font-medium items-center text-center text-base">
                        <span>شناسه</span>
                        <span>تاریخ و زمان</span>
                        <span>نام کاربر</span>
                        <span>کل کارمزد</span>
                        <span>پورسانت شما</span>
                        <span>پورسانت دوستان</span>
                      </div>
                      {transactions.map((item) => (
                        <div
                          key={item.id}
                          className="lg:grid lg:grid-cols-6 mt-3 lg:mt-0 lg:p-3 p-4 gap-4 lg:gap-0 rounded-2xl lg:rounded-none lg:space-y-0 space-y-4 text-sm text-black0 items-center text-center border lg:border-b-0 border-gray21"
                        >
                          <div className="flex flex-col space-y-2 lg:hidden border-b pb-3 border-gray21">
                            <div className="flex flex-row justify-between items-center">
                              <span className="font-medium text-gray5 text-xs">
                                تاریخ و زمان
                              </span>
                              <span>{item.date}</span>
                            </div>
                            <div className="flex flex-row justify-between items-center">
                              <span className="font-medium text-gray5">
                                نام کاربر
                              </span>
                              <span>{item.name}</span>
                            </div>
                            <div className="flex flex-row justify-between items-center">
                              <span className="font-medium text-gray5">
                                کل کارمزد
                              </span>
                              <span>
                                {item.total_wage_amount?.toLocaleString() ||
                                  "0"}{" "}
                                تومان
                              </span>
                            </div>
                          </div>
                          <div className="lg:hidden flex flex-row items-center justify-between w-full pt-3">
                            <div className="flex items-center flex-col gap-2 w-1/2">
                              <span className="font-medium text-gray5">
                                پورسانت شما
                              </span>
                              <span>{item.percent_caller}%</span>
                            </div>
                            <div className="border-l border-gray21 h-10 mx-2"></div>
                            <div className="flex items-center flex-col gap-2 w-1/2">
                              <span className="font-medium text-gray5">
                                پورسانت دوستان
                              </span>
                              <span>{item.percent_referral}%</span>
                            </div>
                          </div>
                          <span className="hidden lg:block">{item.id}</span>
                          <span className="hidden lg:block">{item.date}</span>
                          <span className="hidden lg:block">{item.name}</span>
                          <span className="hidden lg:block">
                            {item.total_wage_amount?.toLocaleString() || "0"}{" "}
                            تومان
                          </span>
                          <span className="hidden lg:block">
                            {item.percent_caller}%
                          </span>
                          <span className="hidden lg:block">
                            {item.percent_referral}%
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    EmptyState(
                      "هنوز تراکنشی ثبت نشده است!",
                      "با دعوت از دوستانتان از تراکنش‌های آن‌ها پاداش دریافت کنید."
                    )
                  ))}

                {/* ✅ تب کاربران دعوت شده */}
                {activeTab === "invited" &&
                  (isLoading ? (
                    <div className="py-10 text-center flex flex-col  gap-4 w-full">
                      <span className="skeleton-bg w-2/6 h-8 mx-auto block rounded-md"></span>
                      <span className="skeleton-bg w-2/6 h-6 mx-auto block rounded-md"></span>
                    </div>
                  ) : invitedUsers.length > 0 ? (
                    <div className="w-full overflow-hidden">
                      <div className="hidden lg:grid lg:grid-cols-4 bg-gray41 border border-gray21 p-3 text-base text-black0 font-medium items-center text-center">
                        <span>نام کاربر</span>
                        <span>تاریخ و زمان</span>
                        <span>پورسانت شما</span>
                        <span>پورسانت دوستان</span>
                      </div>
                      {invitedUsers.map((item) => (
                        <div
                          key={item.id}
                          className="p-4 lg:p-3 flex flex-col lg:grid lg:grid-cols-4 lg:border-b-0 mt-3 lg:mt-0 rounded-xl lg:rounded-none border border-gray21"
                        >
                          <div className="flex flex-col space-y-2 lg:hidden">
                            <div className="flex items-center gap-2">
                              <img
                                className="w-10 h-10"
                                src={UserImg}
                                alt="User"
                              />
                              <div className="flex justify-between w-full items-center">
                                <div className="font-medium text-black0 text-sm">
                                  {item.Name}
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
                                  {item.percent_caller}%
                                </div>
                              </div>
                              <div className="border-l border-gray21 h-10 mx-2"></div>
                              <div className="flex flex-col items-center gap-2 w-1/2">
                                <div className="font-medium text-black0 text-sm">
                                  پورسانت دوستان
                                </div>
                                <div className="text-black0 text-lg">
                                  {item.percent_referral}%
                                </div>
                              </div>
                            </div>
                          </div>
                          <span className="hidden lg:block text-center text-black0">
                            {item.Name}
                          </span>
                          <span className="hidden lg:block text-center text-black0">
                            {item.Date}
                          </span>
                          <span className="hidden lg:block text-center text-black0">
                            {item.percent_caller}%
                          </span>
                          <span className="hidden lg:block text-center text-black0">
                            {item.percent_referral}%
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    EmptyState(
                      "هنوز کاربری دعوت نکرده‌اید!",
                      "با اشتراک‌گذاری لینک دعوتتان با دوستان، از تراکنش‌های آن‌ها پاداش دریافت کنید."
                    )
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        {IsOpenModal && (
          <>
            <div className="fixed inset-0 bg-black/25 z-30 cursor-pointer"></div>
            <div
              onClick={() => setIsOpenModal(false)}
              className="fixed inset-0 flex items-center justify-center z-50"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white8 w-full max-w-md rounded-xl shadow-lg overflow-hidden lg:py-6 py-4 px-7 mx-2"
              >
                <div className="flex justify-between items-center border-b border-gray21 pb-4">
                  <span
                    className="icon-wrapper w-6 h-6 cursor-pointer text-gray5 hover:text-black0"
                    onClick={() => setIsOpenModal(false)}
                  >
                    <IconClose />
                  </span>
                  <span className="text-black0 font-medium text-base">
                    تنظیم درصد سود
                  </span>
                </div>
                <p className="text-black0 text-xs lg:text-sm text-end mt-6">
                  . میزان سود خود و دوستتان را از کارمزد معاملات مشخص کنید
                </p>
                <div className="mt-14">
                  <ReferralPercentBar
                    selectedPercent={selectedPercent}
                    setSelectedPercent={setSelectedPercent}
                    lastChangedRef={lastChangedRef}
                  />
                </div>
                <div className="flex flex-col items-center mt-14 mb-14">
                  <div className="grid grid-cols-2 w-full text-center gap-y-2">
                    <span className="text-gray5 lg:text-sm text-xs font-medium">
                      پورسانت شما
                    </span>
                    <span className="text-gray5 lg:text-sm text-xs font-medium">
                      پورسانت دوستان
                    </span>
                    <span className="text-black0 text-lg font-bold">
                      {maxPercent - selectedPercent}%
                    </span>
                    <div className="relative">
                      <span className="text-black0 text-lg font-bold">
                        {selectedPercent}%
                      </span>
                      <div className="absolute left-[-10px] top-1/4 w-px h-10 bg-gray2 transform -translate-y-1/2"></div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleSaveCommissionSplit}
                  disabled={isLoading}
                  className="w-full font-bold text-base text-white2 bg-blue2 lg:py-3 py-2 rounded-lg"
                >
                  {isLoading ? "درحال ذخیره..." : "تایید"}
                </button>
              </div>
            </div>
          </>
        )}
      </HeaderLayout>
    </>
  );
}
