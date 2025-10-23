import React from "react";
import { Link, useLocation } from "react-router"
import IconChevron from "../assets/icons/trade/IconChevron";

const BREADCRUMB_LABELS: Record<string, string> = {

  "trade": "معامله",
  "buy": "خرید",
  "sell": "فروش",
  "options": "خدمات",
  "Profile": "پروفایل",
  "ticket": "تیکت‌ها",
  "create": "ایجاد تیکت",
  "authentication": 'احراز هویت',
  "services": 'خدمات',
  "transaction": 'تاریخچه تراکنش ها',
  "connected-devices": 'دستگاه های متصل',
  "faq": 'سوالات متداول',
  "bank-cards": 'کارت های بانکی',
  "withdraw": 'برداشت',
  'market-view': 'نمای بازار',
  "kyc-basic": "احراز هویت پایه",
  "history": "خدمات",
  "order": "تاریخچه خرید و فروش",
  "toman": "تاریخچه تراکنش های تومانی",
  "Cryptocurrency": "تاریخچه تراکنش های رمز ارز",
  "fiat": "برداشت تومانی",
  "crypto": "برداشت رمز ارز",
  "add-friend": "دعوت از دوستان",
  "multi-factor": 'ورود دو مرحله‌ای',
};

const BreadcrumbNavigation = () => {
  const location = useLocation()
  const pathnames = location.pathname.split("/").filter(x => x);

  return (
    <nav className="w-full flex items-center gap-1 lg:gap-2 text-xs lg:text-sm font-normal" dir="rtl">
      <Link className="text-text2 text-black0 hover:text-blue2 hover:underline" to='/'>پی‌فا24</Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        return (
          <React.Fragment key={to}>
            <span className="w-4 h-4 text-text2 text-black0"><IconChevron /></span>
            {isLast ?
              <span className="text-blue2">{BREADCRUMB_LABELS[value]}</span>
              :
              <Link className="text-black1 hover:text-blue2 hover:underline" to={to}>{BREADCRUMB_LABELS[value]}</Link>
            }
          </React.Fragment>
        );
      })}
    </nav>
  )
}

export default BreadcrumbNavigation




