import React from "react";
import { Link, useLocation } from "react-router"
import IconChevron from "../assets/icons/trade/IconChevron";

const BREADCRUMB_LABELS: Record<string, string> = {
  trade: "معامله",
  buy: "خرید",
  sell: "فروش",
  options: "حدمات",

  ticket: " تیکت ها",

  authentication: 'احراز هویت'

};

const BreadcrumbNavigation = () => {
  const location = useLocation()
  const pathnames = location.pathname.split("/").filter(x => x); 

  return (
    <nav className="w-full flex items-center gap-1 lg:gap-2 text-xs lg:text-sm font-normal" dir="rtl">
      <Link className="text-text2 text-black0" to='/'>پی‌فا24</Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        return (
          <React.Fragment key={to}>
            <span className="w-4 h-4 text-text2 text-black0"><IconChevron/></span>
            {isLast ?
              <span className="text-blue2">{BREADCRUMB_LABELS[value]}</span>
              :
              <Link className="text-black1 hover:text-primary" to={to}>{BREADCRUMB_LABELS[value]}</Link>
            }
          </React.Fragment>
        );
      })}
    </nav>
  )
}

export default BreadcrumbNavigation