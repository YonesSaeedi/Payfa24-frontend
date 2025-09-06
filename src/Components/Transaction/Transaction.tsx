import React, { useState, useMemo } from "react";
import FilterDropdown from "./FilterDropdown";
import StatusBadge from "../UI/Button/StatusBadge";
import { transactions } from "../../Components/Data/DataTransactions";
import IconFilterTable from "../../assets/icons/transaction-history/IconFilterTable";
import Pagination from "./Pagination";
import TransactionModal from "./TransactionModal"; 


const TransactionTable: React.FC = () => {



  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [selectedTx, setSelectedTx] = useState<any | null>(null); 

  const pageSize = 10;

  const handleToggle = (id: string) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  };

  const handleSelect = (id: string, value: string) => {
    setFilters((prev) => ({ ...prev, [id]: value }));
    setOpenDropdown(null);
    setPage(1);
  };

  const filteredData = transactions.filter((tx) => {
    const typeFilter = filters["type"]
      ? tx.type === filters["type"] || filters["type"] === "همه"
      : true;
    const statusFilter = filters["status"]
      ? tx.status === filters["status"] || filters["status"] === "همه"
      : true;
    return typeFilter && statusFilter;
  });

  const pagedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page]);

  return (
    <div dir="rtl">
     
      <div className="text-black1 flex lg:mb-4 font-medium lg:justify-between justify-end container-style">
        <h1 className="hidden lg:block">تاریخچه تراکنش ها</h1>
        <span className="w-6 h-6 icon-wrapper text-gray12 lg:hidden">
          <IconFilterTable />
        </span>
      </div>

   
      <div className="bg-white1 rounded-2xl lg:border lg:border-gray21 p-4 text-black1">
    
        <div className="hidden lg:flex flex-wrap gap-2 justify-start mb-6">
          <div className="flex items-center gap-1">
            <span className="w-5 h-5 icon-wrapper text-gray12">
              <IconFilterTable />
            </span>
            <span className="text-gray12">فیلترها</span>
          </div>
          <div className="w-px h-6 bg-gray-400 self-center"></div>

          <FilterDropdown
            id="sort"
            label="بیشترین تراکنش"
            options={["جدیدترین", "قدیمی‌ترین"]}
            selected={filters["sort"] || ""}
            isOpen={openDropdown === "sort"}
            onToggle={handleToggle}
            onSelect={handleSelect}
          />
          <FilterDropdown
            id="type"
            label="نوع تراکنش"
            options={["همه", "واریز", "برداشت", "خرید", "فروش"]}
            selected={filters["type"] || ""}
            isOpen={openDropdown === "type"}
            onToggle={handleToggle}
            onSelect={handleSelect}
          />
          <FilterDropdown
            id="status"
            label="وضعیت"
            options={["همه", "انجام شده", "در حال بررسی", "رد شده"]}
            selected={filters["status"] || ""}
            isOpen={openDropdown === "status"}
            onToggle={handleToggle}
            onSelect={handleSelect}
          />
        </div>

    
        <div className="block lg:hidden space-y-4">
          {pagedData.map((tx) => (
            <div key={tx.id} className="border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-9 h-9">{tx.currencyIcon}</span>
                  <div>
                    <p className="font-medium text-black1">{tx.currencyName}</p>
                    <p className="text-xs text-gray-500">{tx.currencySymbol}</p>
                  </div>
                </div>
                <StatusBadge text={tx.status} />
              </div>

              <div className="text-sm space-y-1">
                <p className="flex justify-between">
                  مقدار: <span className="font-medium">{tx.amount}</span>
                </p>
                <p className="flex justify-between">
                  تاریخ تراکنش:{" "}
                  <span className="font-medium">
                    {tx.date} | {tx.time}
                  </span>
                </p>
              </div>

              <div
                className="text-blue-600 text-sm mt-3 cursor-pointer border-t pt-2 text-center"
                onClick={() => setSelectedTx(tx)}
              >
                جزئیات تراکنش
              </div>
            </div>
          ))}
        </div>

        <div className="hidden lg:block">
          <table dir="rtl" className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray41 text-black1 text-right">
                <th className="py-5 px-4">ارز</th>
                <th className="py-5 px-4">مقدار</th>
                <th className="py-5 px-4">نوع</th>
                <th className="py-5 px-4">وضعیت</th>
                <th className="py-5 px-4">تاریخ و زمان</th>
                <th className="py-5 px-4">جزئیات</th>
              </tr>
            </thead>
            <tbody>
              {pagedData.map((tx) => (
                <tr
                  key={tx.id}
                  className="lg:border-b last:border-none hover:bg-gray-50 text-start lg:border-b-gray21"
                >
                  <td className="py-3 px-4 flex items-start gap-2 justify-start">
                    <span className="w-9 h-9">{tx.currencyIcon}</span>
                    <div className="flex flex-col text-right">
                      <span className="font-medium text-black1">
                        {tx.currencyName}
                      </span>
                      <span className="text-xs text-gray-500 pt-1">
                        {tx.currencySymbol}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">{tx.amount}</td>
                  <td className="py-3 px-4">{tx.type}</td>
                  <td className="py-3 px-4">
                    <StatusBadge text={tx.status} />
                  </td>
                  <td className="py-3 px-4">
                    {tx.date} | {tx.time}
                  </td>
                  <td
                    className="py-3 px-4 text-blue-600 cursor-pointer"
                    onClick={() => setSelectedTx(tx)}
                  >
                    جزئیات
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* صفحه‌بندی */}
        <Pagination current={page} total={12} onPageChange={setPage} />
      </div>

      {/* مودال 👇 */}
      {selectedTx && (
        <TransactionModal tx={selectedTx} onClose={() => setSelectedTx(null)} />
      )}
    </div>
  );
};

export default TransactionTable;
