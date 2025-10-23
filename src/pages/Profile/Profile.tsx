import { useState, useEffect } from "react";
import { apiRequest } from "../../utils/apiClient";
import EmailIcon from "../../assets/icons/authentication/EmailIcon";
import IconcardBank from "../../assets/icons/authentication/IconcardBank";
import IconUserOctagon from "../../assets/icons/authentication/IconUserOctagon";
import HeaderLayout from "../../layouts/HeaderLayout";
import IdentyIcon from "../../assets/icons/authentication/IdentyIcon";
import IconCardIdenty from "../../assets/icons/authentication/IconCardIdenty";
import BreadcrumbNavigation from "../../components/BreadcrumbNavigation";
import { Link } from "react-router";

interface ApiResponse {
  user: UserData;
}

interface UserData {
  id: number;
  name: string;
  email: string;
  mobile: string;
  join_date: string;
  verification_level: number;
  profile_img: string | null;
  family?: string;
  name_display?: string;
  level_account?: number;
  date_register?: string;
}

async function getUserInfo(): Promise<UserData> {
  const response = await apiRequest<ApiResponse>({
    url: "/api/account/get-user",
    method: "GET",
  });

  const userDataFromApi = response.user;

  const level = userDataFromApi.level_account || 0;
  const fullName =
    userDataFromApi.name_display ||
    userDataFromApi.name + " " + (userDataFromApi.family || "");

  return {
    id: userDataFromApi.id,
    name: fullName,
    email: userDataFromApi.email || "---",
    mobile: userDataFromApi.mobile,
    join_date: userDataFromApi.date_register || "---",
    verification_level: level,
    profile_img: userDataFromApi.profile_img,
    family: userDataFromApi.family,
  };
}

function formatPersianDate(dateStr: string): string {
  if (!dateStr || dateStr === "---") return "---";

  const [day, month, year] = dateStr.split(" ");
  const persianMonths: { [key: string]: number } = {
    فروردین: 1,
    اردیبهشت: 2,
    خرداد: 3,
    تیر: 4,
    مرداد: 5,
    شهریور: 6,
    مهر: 7,
    آبان: 8,
    آذر: 9,
    دی: 10,
    بهمن: 11,
    اسفند: 12,
  };

  const monthNum = persianMonths[month];
  if (!monthNum) return dateStr;

  return `${year}/${monthNum.toString().padStart(2, "0")}/${day.padStart(
    2,
    "0"
  )}`;
}

export default function Profile() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getUserInfo();
        setUserData(data);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setError(
          err instanceof Error ? err : new Error("Unknown error occurred")
        );
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const verificationLevel = userData?.verification_level || 0;
  const showEmailAndName = verificationLevel >= 1;
  const userName = userData?.name || "احراز هویت نشده";
  const userMobile = userData?.mobile || "---";
  const userEmail = userData?.email || "---";
  const userJoinDate = userData?.join_date
    ? formatPersianDate(userData.join_date)
    : "---";

  const getInitials = () => {
    const nameInitial = userData?.name?.charAt(0).toUpperCase() || "";
    const familyInitial = userData?.family?.charAt(0).toUpperCase() || "";
    return nameInitial && familyInitial
      ? `${nameInitial} ${familyInitial}`
      : nameInitial || "N/A";
  };

  return (
    <>
      <HeaderLayout>
        <div className="container-style w-full pt-7 flex gap-10 flex-col">
          <BreadcrumbNavigation />
          <div className="bg-gray25 w-full lg:shadow-[0_0_12px_0_rgba(0,0,0,0.16)] rounded-2xl lg:pb-10">
            <div>
              <div className="flex items-center justify-center flex-col">
                <div className="mb-6 lg:mt-14 mt-8">
                  {loading ? (
                    <div className="w-32 h-32 rounded-full bg-blue13 animate-pulse" />
                  ) : userData?.profile_img ? (
                    <img
                      className="w-32 h-32 rounded-full object-cover"
                      src={userData?.profile_img}
                      alt="ProfilePicture"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-blue13 flex items-center justify-center text-[#1D4ED8] text-2xl font-bold">
                      {getInitials()}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-start flex-row-reverse lg:text-lg font-normal text-sm lg:w-[498px] w-full mb-8">
                  {/*ستون چپ -  */}
                  <div className="flex flex-col text-end gap-4 text-gray5 w-[140px]">
                    <span>سطح کاربری</span>
                    {showEmailAndName && <span>نام و نام خانوادگی</span>}
                    <span>شماره موبایل</span>
                    {showEmailAndName && <span>ایمیل</span>}
                    <span>تاریخ عضویت</span>
                  </div>

                  {/* ستون راست -  */}
                  <div className="flex flex-col gap-4 text-black1 flex-1 min-w-0">
                    {/* سطر 1 */}
                    <span className="truncate">
                      {loading ? (
                        <div className="skeleton-bg w-20 h-5 rounded-md" />
                      ) : verificationLevel === 0 ? (
                        "احراز هویت نشده"
                      ) : verificationLevel === 1 ? (
                        "سطح ۱"
                      ) : (
                        `سطح ${verificationLevel}`
                      )}
                    </span>

                    {/* سطر 2 */}
                    <span className="truncate">
                      {loading ? (
                        <div className="skeleton-bg w-28 h-5 rounded-md" />
                      ) : (
                        showEmailAndName && <span>{userName}</span>
                      )}
                    </span>

                    {/* سطر 3 */}
                    <span className="truncate">
                      {loading ? (
                        <div className="skeleton-bg w-36 h-5 rounded-md" />
                      ) : (
                        <span>{userMobile}</span>
                      )}
                    </span>

                    {/* سطر 4 */}
                    <span className="truncate">
                      {loading ? (
                        <div className="skeleton-bg w-64 h-5 rounded-md" />
                      ) : (
                        showEmailAndName && <span>{userEmail}</span>
                      )}
                    </span>

                    {/* سطر 5 */}
                    <span className="truncate">
                      {loading ? (
                        <div className="skeleton-bg w-32 h-5 rounded-md" />
                      ) : (
                        <span>{userJoinDate}</span>
                      )}
                    </span>
                  </div>
                </div>

                {/* --- فرم احراز هویت --- */}
                {verificationLevel === 0 ? (
                  <form className="lg:w-[498px] w-full border-solid border-blue2 rounded-lg border-[1px] md:flex flex-col p-6 dark:text-white justify-center sm:justify-end">
                    {loading ? (
                      <span className="w-full mb-2 h-5 skeleton-bg rounded-sm "></span>
                    ) : (
                      <h1 className="text-right mb-5 text-blue2">
                        سطح ۱ : احراز هویت پایه
                      </h1>
                    )}
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
                      <p className="text-right mt-5">دسترسی‌ها :</p>
                      <ul className="list-disc list-inside text-right text-gray15">
                        {loading ? (
                          <div className="flex flex-col gap-2">
                            <div className="w-3/6 h-4 skeleton-bg rounded-sm"></div>
                            <div className="w-3/6 h-4 skeleton-bg rounded-sm"></div>
                          </div>
                        ) : (
                          <>
                            <li>مشاهده قیمت‌ها</li>
                            <li>خرید و فروش رمز ارزها</li>
                          </>
                        )}
                      </ul>
                    </div>
                    <Link to={"/kyc-basic"} className="w-full">
                      <button className="bg-blue2 flex items-center justify-center w-full mt-5 h-[48px] rounded-lg text-white2 font-bold">
                        احراز هویت
                      </button>
                    </Link>
                  </form>
                ) : verificationLevel === 1 ? (
                  <form className="lg:w-[498px] text-gray15 w-full items-end mb-5 border-solid border-blue2 rounded-lg border-[1px] md:flex flex-col p-6 justify-center sm:justify-end">
                    {loading ? (
                      <div className="w-4/6 h-4 skeleton-bg rounded-sm"></div>
                    ) : (
                      <h1 className="text-right text-blue2 font-medium">
                        سطح ۲ : احراز هویت پیشرفته
                      </h1>
                    )}
                    <div className="flex flex-row items-center justify-end mt-5">
                      <span className="mr-2 text-black1">ثبت مدرک شناسایی</span>
                      <span className="icon-wrapper w-7 h-7 text-blue2">
                        <IconCardIdenty />
                      </span>
                    </div>
                    <div className="flex flex-row items-center justify-end">
                      <span className="mr-2 text-black1">تایید هویت</span>
                      <span className="icon-wrapper w-7 h-7 text-blue2">
                        <IdentyIcon />
                      </span>
                    </div>
                    <div dir="rtl">
                      <p className="mt-5 text-right text-black1">دسترسی‌ها :</p>
                      <ul className="flex flex-col gap-1 list-inside list-disc text-gray5 lg:text-base text-sm">
                        {loading ? (
                          <div className="flex flex-col gap-2">
                            <div className="w-3/6 h-4 skeleton-bg rounded-sm"></div>
                            <div className="w-3/6 h-4 skeleton-bg rounded-sm"></div>
                            <div className="w-3/6 h-4 skeleton-bg rounded-sm"></div>
                          </div>
                        ) : (
                          <>
                            <li className="text-right">
                              ۵ میلیون تومان برداشت ریالی روزانه
                            </li>
                            <li className="text-right">
                              ۵ میلیون تومان برداشت ارزی روزانه
                            </li>
                            <li className="text-right">
                              دسترسی به ارز Utopia USD
                            </li>
                          </>
                        )}
                      </ul>
                    </div>
                    <Link to={"/kyc-advanced"} className="w-full">
                      <button className="bg-blue2 w-full mt-5 h-[48px] rounded-lg text-white2 font-bold">
                        احراز هویت
                      </button>
                    </Link>
                  </form>
                ) : (
                  <div className="lg:w-[498px] p-6 text-center text-green-600 border-solid border-green-600 rounded-lg border-[1px]">
                    احراز هویت شما کامل است.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </HeaderLayout>
    </>
  );
}
