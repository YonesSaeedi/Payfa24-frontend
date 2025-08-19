import React from "react";
import { Link, useLocation } from "react-router"
import IconChevron from "../assets/icons/trade/IconChevron"

const BREADCRUMB_LABELS: Record<string, string> = {
  trade: "معامله",
  buy: "خرید",
  sell: "فروش",
  options: "حدمات",
  ticket: "تیکت",
};

const BreadcrumbNavigation = () => {
  const location = useLocation()
  const pathnames = location.pathname.split("/").filter(x => x); // the last line is used due to prevent falsy values, and to only return truthy values

  return (
    <nav className="w-full flex items-center gap-1 lg:gap-2 text-xs lg:text-sm font-normal" dir="rtl">
      <Link className="text-text2 hover:text-primary" to='/'>پی‌فا24</Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1; // isLast is used to specify whether the item should be a link or a span (since last items in breadcrumb navigation are not links)
        return (
          <React.Fragment key={to}>
            <span className="w-4 h-4 text-text2"><IconChevron /></span>
            {isLast ?
              <span className="text-primary">{BREADCRUMB_LABELS[value]}</span>
              :
              <Link className="text-text2 hover:text-primary" to={to}>{BREADCRUMB_LABELS[value]}</Link>
            }
          </React.Fragment>
        );
      })}
    </nav>
  )
}

export default BreadcrumbNavigation