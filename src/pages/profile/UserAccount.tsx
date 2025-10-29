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
  level_kyc?: "none" | "basic" | "advanced";
}

async function getUserInfo(): Promise<UserData> {
  const response = await apiRequest<ApiResponse>({
    url: "/api/account/get-user",
    method: "GET",
  });

  const user = response.user;

  const level = user.level_account || 0;
  const fullName =
    user.name_display || `${user.name} ${user.family || ""}`.trim();

  return {
    id: user.id,
    name: fullName,
    email: user.email || "---",
    mobile: user.mobile,
    join_date: user.date_register || "---",
    verification_level: level,
    profile_img: user.profile_img,
    family: user.family,
    level_kyc: user.level_kyc || "none",
  };
}

function formatPersianDate(dateStr: string): string {
  if (!dateStr || dateStr === "---") return "---";
  const [day, month, year] = dateStr.split(" ");
  const persianMonths: Record<string, number> = {
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

export default function UserAccount() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await getUserInfo();
        setUserData(data);
      } catch (err) {
        console.error("Error fetching user data:", err);
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
  const userKycLevel = userData?.level_kyc || "none";

  const getInitials = () => {
    const nameInitial = userData?.name?.charAt(0).toUpperCase() || "";
    const familyInitial = userData?.family?.charAt(0).toUpperCase() || "";
    return nameInitial && familyInitial
      ? `${nameInitial} ${familyInitial}`
      : nameInitial || "N/A";
  };

  // تصمیم‌گیری برای نمایش فرم
  let kycContent;
  if (userKycLevel === "none") {
    // سطح ۱ : احراز پایه
    kycContent = (
      <form className="lg:w-[498px] w-full border-solid border-blue2 rounded-lg border-[1px] md:flex flex-col p-6 dark:text-white justify-center sm:justify-end">
        <h1 className="text-right mb-5 text-blue2">سطح ۱ : احراز هویت پایه</h1>
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
            <li>مشاهده قیمت‌ها</li>
            <li>خرید و فروش رمز ارزها</li>
          </ul>
        </div>
        <Link to={"/kyc-basic"} className="w-full">
          <button className="bg-blue2 flex items-center justify-center w-full mt-5 h-[48px] rounded-lg text-white2 font-bold">
            احراز هویت
          </button>
        </Link>
      </form>
    );
  } else if (userKycLevel === "basic") {
    // سطح ۲ : احراز پیشرفته
    kycContent = (
      <form className="lg:w-[498px] text-gray15 w-full items-end mb-5 border-solid border-blue2 rounded-lg border-[1px] md:flex flex-col p-6 justify-center sm:justify-end">
        <h1 className="text-right text-blue2 font-medium">
          سطح ۲ : احراز هویت پیشرفته
        </h1>
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
            <li className="text-right">۵ میلیون تومان برداشت ریالی روزانه</li>
            <li className="text-right">۵ میلیون تومان برداشت ارزی روزانه</li>
            <li className="text-right">دسترسی به ارز Utopia USD</li>
          </ul>
        </div>
        <Link to={"/kyc-advanced"} className="w-full">
          <button className="bg-blue2 w-full mt-5 h-[48px] rounded-lg text-white2 font-bold">
            احراز هویت
          </button>
        </Link>
      </form>
    );
  } else if (userKycLevel === "advanced") {
    kycContent = (
      <button className="bg-blue2 lg:w-[498px] w-full py-3 font-bold text-white2 mt-5 rounded-md">
        احراز هویت شما تکمیل است
      </button>
    );
  }

  return (
    <HeaderLayout>
      <div className="container-style w-full pt-7 flex gap-10 flex-col">
        <BreadcrumbNavigation />
        <div className="bg-gray25 w-full lg:shadow-[0_0_12px_0_rgba(0,0,0,0.16)] rounded-2xl lg:pb-10">
          <div className="flex items-center justify-center flex-col">
            {/* آواتار */}
            <div className="mb-6 lg:mt-14 mt-8">
              {loading ? (
                <div className="w-32 h-32 rounded-full bg-blue13 animate-pulse" />
              ) : userData?.profile_img ? (
                <img
                  className="w-32 h-32 rounded-full object-cover"
                  src={userData.profile_img}
                  alt="ProfilePicture"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-blue13 flex items-center justify-center text-[#1D4ED8] text-2xl font-bold">
                  {getInitials()}
                </div>
              )}
            </div>

            {/* اطلاعات کاربر */}
            <div className="flex justify-between items-start flex-row-reverse lg:text-lg font-normal text-sm lg:w-[498px] w-full mb-8">
              <div className="flex flex-col text-end gap-4 text-gray5 w-[140px]">
                <span>سطح کاربری</span>
                {showEmailAndName && <span>نام و نام خانوادگی</span>}
                <span>شماره موبایل</span>
                {showEmailAndName && <span>ایمیل</span>}
                <span>تاریخ عضویت</span>
              </div>
              <div className="flex flex-col gap-4 text-black1 flex-1 min-w-0">

              {loading? <span className="skeleton-bg w-28 h-5 rounded-sm"></span>:  
              
              
                <span>
                  {verificationLevel === null
                    ? "احراز هویت نشده"
                    : `سطح ${verificationLevel}`}
                </span>
              }

                {loading ? (
                  <span className="skeleton-bg w-28 h-5 rounded-sm"></span>
                ) : (
                  showEmailAndName && <span>{userName}</span>
                )}

              {loading ? (
                  <span className="skeleton-bg w-28 h-5 rounded-sm  "></span>
                ) : (
                  <span>{userMobile}</span>
                )}
                {loading ? (
                  <span className="skeleton-bg w-28 h-5 rounded-sm"></span>
                ) : (
                  showEmailAndName && <span>{userEmail}</span>
                )}

                {loading ? (
                  <span className="skeleton-bg w-28 h-5 rounded-sm  "></span>
                ) : (
                  <span>{userJoinDate}</span>
                )}
              </div>
            </div>

            {/* بخش احراز هویت پایین */}
            {kycContent}
          </div>
        </div>
      </div>
    </HeaderLayout>
  );
}
