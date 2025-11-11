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
import IconIdentyBasic from "../../assets/icons/authentication/IconIdentyBasic";
import { toPersianDigits } from "../../components/Deposit/CardToCardTransfer";

// اینجا ارایه ای از ابجکت برای تغییر  جاهاشون ساختم
const FIELD_ORDER = [
  { key: "level", label: "سطح کاربری" },
  { key: "name_display", label: "نام نمایشی" },
  { key: "mobile", label: "شماره موبایل" },
  { key: "join_date", label: "تاریخ عضویت" },
  { key: "name", label: "نام" },
  { key: "family", label: "نام خانوادگی" },
  { key: "email", label: "ایمیل" },
  { key: "national_code", label: "کد ملی" },
];

// --- فقط ۴ فیلد اول برای لودینگ ---
const LOADING_FIELDS = FIELD_ORDER.slice(0, 4);

interface ApiResponse {
  status: boolean;
  msg: string;
  user: {
    id: number;
    name?: string;
    family?: string;
    name_display?: string;
    email?: string;
    mobile?: string;
    profile_img?: string | null;
    date_register?: string;
    level_account?: number;
    level_kyc?: "none" | "basic" | "advanced";
    national_code?: string;
  };
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
  level_kyc: "none" | "basic" | "advanced";
  national_code?: string;
  
}

async function getUserInfo(): Promise<UserData> {
  const response = await apiRequest<ApiResponse>({
    url: "/account/get-user",
    method: "GET",
  });

  const user = response.user;
  const level = user.level_account ?? 0;
  const fullName = user.name || `${user.name || ""} ${user.family || ""}`.trim();

  return {
    id: user.id,
    name: fullName,
    email: user.email || "---",
    mobile: user.mobile || "---",
    join_date: user.date_register || "---",
    verification_level: level,
    profile_img: user.profile_img || null,
    family: user.family,
    level_kyc: user.level_kyc || "none",
    name_display: user.name_display,
    national_code: user.national_code || null,
  };
}

export function formatPersianDate(dateStr: string): string {
  if (!dateStr || dateStr === "---" || dateStr.trim() === "") return "---";

  const [day, month, year] = dateStr.split(" ");
  if (!day || !month || !year) return dateStr;

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

  return `${year}/${monthNum.toString().padStart(2, "0")}/${day.padStart(2, "0")}`;
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

  const userKycLevel = userData?.level_kyc || "none";

  const getInitials = () => {
    const displayName = userData?.name_display || "";
    const parts = displayName.trim().split(/\s+/);
    let initials = "";
    if (parts.length >= 1) initials += parts[0].charAt(0).toUpperCase();
    if (parts.length >= 2) initials += " " + parts[1].charAt(0).toUpperCase();
    return initials.trim() || "N/A";
  };

  // --- تابع کمکی: مقدار فیلد ---
  const getFieldValue = (key: string): string | null => {
    if (!userData) return null;

    switch (key) {
      case "level":
        return userData.verification_level > 0 ? `سطح ${toPersianDigits(userData.verification_level)}` : "احراز هویت نشده";
      case "join_date": {
        const formattedDate = formatPersianDate(userData.join_date) ;
        return formattedDate !== "---" ? toPersianDigits(formattedDate) : null;
      }
      case "mobile":
        return userData.mobile !== "---" ? toPersianDigits(userData.mobile) : null;
      case "national_code":
        return userData.national_code ? toPersianDigits(userData.national_code) : null;
      default: {
        const val = userData[key];
        return val && val !== "---" && val !== "احراز هویت نشده" ? val : null;
      }
    }
  };

  // --- محتوای KYC ---
  let kycContent;
  if (userKycLevel === "none") {
    kycContent = (
      <form className="lg:w-[498px] w-full border-solid border-blue2 rounded-lg border-[1px] md:flex flex-col p-6 dark:text-white justify-center sm:justify-end">
        <h1 className="text-right mb-5 text-blue2">سطح ۱ : احراز هویت پایه</h1>
        <div className="flex flex-row items-center justify-end">
          <span className="mr-2 text-black1">ثبت ایمیل</span>
          <span className="icon-wrapper w-7 h-7 text-blue2">
            <EmailIcon />
          </span>
        </div>
        <div className="flex flex-row items-center justify-end">
          <span className="mr-2 text-black1">مشخصات فردی</span>
          <span className="icon-wrapper w-7 h-7 text-blue2">
            <IconUserOctagon />
          </span>
        </div>
        <div className="flex flex-row items-center justify-end">
          <span className="mr-2 text-black1">کارت بانکی</span>
          <span className="icon-wrapper w-7 h-7 text-blue2">
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
          <button className="bg-blue2 flex items-center justify-center w-full mt-5 h-[48px] rounded-lg text-white2 font-bold"> شروع احراز هویت</button>
        </Link>
      </form>
    );
  } else if (userKycLevel === "basic") {
    kycContent = (
      <form className="lg:w-[498px] text-gray15 w-full items-end mb-5 border-solid border-blue2 rounded-lg border-[1px] md:flex flex-col p-6 justify-center sm:justify-end">
        <h1 className="text-right text-blue2 font-medium">سطح ۲ : احراز هویت پیشرفته</h1>
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
            <li className="text-right">واریز با کارت به کارت</li>
            <li className="text-right">دسترسی به ارز های دلاری</li>
            <li className="text-right">برداشت رمز ارز</li>
          </ul>
        </div>
        <Link to={"/kyc-advanced"} className="w-full">
          <button className="bg-blue2 w-full mt-5 h-[48px] rounded-lg text-white2 font-bold">تکمیل احراز هویت</button>
        </Link>
      </form>
    );
  } else if (userKycLevel === "advanced") {
    kycContent = (
      <div dir="rtl" className="flex flex-col lg:w-[498px] w-full border border-gray19 px-5 py-4 rounded-lg">
        <div className="flex justify-between w-full items-center">
          <div>
            <span className="text-base font-medium text-blue2">احراز هویت تکمیل شده است </span>
          </div>
          <div className="bg-green9 text-green2 lg:w-[115px] lg:h-[36px] w-[87px] h-[32px] flex gap-1 rounded-lg items-center justify-center">
            <span className="lg:text-sm text-xs font-medium">احراز شده</span>
            <span className="icon-wrapper w-6 h-6 text-green2">
              <IconIdentyBasic />
            </span>
          </div>
        </div>
        <div>
          <div className="flex flex-row items-center justify-start mt-5">
            <span className="icon-wrapper w-7 h-7 text-blue2">
              <IconCardIdenty />
            </span>
            <span className="mr-2 text-black1">ثبت مدرک شناسایی</span>
          </div>
          <div className="flex flex-row items-center justify-start">
            <span className="icon-wrapper w-7 h-7 text-blue2">
              <IdentyIcon />
            </span>
            <span className="mr-2 text-black1">تایید هویت</span>
          </div>
          <p className="mt-5 text-right text-black1">دسترسی‌ها :</p>
          <ul className="flex flex-col gap-1 list-inside list-disc text-gray5 lg:text-base text-sm">
            <li className="text-right">واریز با کارت به کارت</li>
            <li className="text-right">دسترسی به ارز های دلاری</li>
            <li className="text-right">برداشت رمز ارز</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <HeaderLayout>
      <div className="container-style w-full pt-7 flex gap-10 flex-col">
        <BreadcrumbNavigation />
        <div className="lg:bg-gray25 w-full lg:shadow-[0_0_12px_0_rgba(0,0,0,0.16)] rounded-2xl lg:pb-10">
          <div className="flex items-center justify-center flex-col">
            {/* آواتار */}
            <div className="mb-6 lg:mt-14 mt-8">
              {loading ? (
                <div className="lg:w-[104px] lg:h-[104px] w-18 h-18 rounded-full bg-blue13 animate-pulse" />
              ) : userData?.profile_img ? (
                <img className="lg:w-[104px] lg:h-[104px] w-18 h-18 rounded-full object-cover" src={userData.profile_img} alt="Profile" />
              ) : (
                <div className="lg:w-[104px] lg:h-[104px] w-[72px] h-[72px] rounded-full bg-blue13 flex items-center justify-center text-[#1D4ED8] lg:text-[28px] text-lg font-bold">
                  {getInitials()}
                </div>
              )}
            </div>

            {/* اطلاعات کاربر */}
            <div className="flex justify-between items-start flex-row-reverse lg:text-lg font-normal text-sm lg:w-[498px] w-full mb-8">
              {/* برچسب‌ها (سمت راست) */}
              <div className="flex flex-col text-end gap-4 text-gray5 w-[140px]">
                {loading
                  ? LOADING_FIELDS.map((f) => <span key={f.key}>{f.label}</span>)
                  : FIELD_ORDER.map((f) => {
                      const value = getFieldValue(f.key);
                      if (!value) return null;
                      return <span key={f.key}>{f.label}</span>;
                    }).filter(Boolean)}
              </div>

              {/* مقادیر (سمت چپ) */}
              <div className="flex flex-col gap-4 text-black1 flex-1 min-w-0">
                {loading ? (
                  <>
                    <span className="skeleton-bg w-16 h-5 rounded-sm"></span>
                    <span className="skeleton-bg w-24 h-5 rounded-sm"></span>
                    <span className="skeleton-bg w-32 h-5 rounded-sm"></span>
                    <span className="skeleton-bg w-40 h-5 rounded-sm"></span>
                    <span className="skeleton-bg w-48 h-5 rounded-sm"></span>
                  </>
                ) : (
                  FIELD_ORDER.map((f) => {
                    const value = getFieldValue(f.key);
                    if (!value) return null;
                    return <span key={f.key}>{value}</span>;
                  }).filter(Boolean)
                )}
              </div>
            </div>

            {/* بخش KYC */}
            {kycContent}
          </div>
        </div>
      </div>
    </HeaderLayout>
  );
}
