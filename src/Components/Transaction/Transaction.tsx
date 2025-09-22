// import React, { useState, useMemo } from "react";
// import FilterDropdown from "./FilterDropdown";
// import StatusBadge from "../UI/Button/StatusBadge";
// import { transactions, Transaction } from "../../Components/Data/DataTransactions";
// import IconFilterTable from "../../assets/icons/transaction-history/IconFilterTable";
// import Pagination from "./Pagination";
// import TransactionModal from "./TransactionModal";
// import FilterModal from "./FilterModal";
// import TrasactionHisory from "./../../assets/images/Transaction/Transactionhistory.png";
// import TransactionHistoryDark from "./../../assets/images/Transaction/Transaction HistoryDark.png"
// const TransactionTable: React.FC = () => {
//   const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
//   const [openDropdown, setOpenDropdown] = useState<string | null>(null);
//   const [filters, setFilters] = useState<Record<string, string>>({});
//   const [page, setPage] = useState(1);
//   const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

//   const pageSize = 10;

//   const handleToggle = (id: string) => {
//     setOpenDropdown((prev) => (prev === id ? null : id));
//   };

//   const handleSelect = (id: string, value: string) => {
//     setFilters((prev) => ({ ...prev, [id]: value }));
//     setOpenDropdown(null);
//     setPage(1);
//   };

//   const filteredData = transactions.filter((tx) => {
//     const typeFilter = filters["type"]
//       ? tx.type === filters["type"] || filters["type"] === "همه"
//       : true;
//     const statusFilter = filters["status"]
//       ? tx.status === filters["status"] || filters["status"] === "همه"
//       : true;
//     return typeFilter && statusFilter;
//   });

//   const pagedData = useMemo(() => {
//     const start = (page - 1) * pageSize;
//     return filteredData.slice(start, start + pageSize);
//   }, [filteredData, page]);

  
//   const emptyRows = pageSize - pagedData.length;

//   return (
//     <div dir="rtl">
//       <div className="text-black1 flex lg:mb-4 font-medium lg:justify-between justify-end container-style">
//         <h1 className="hidden lg:block">تاریخچه تراکنش ها</h1>
//         <span
//           className="w-6 h-6 icon-wrapper text-gray12 lg:hidden"
//           onClick={() => setIsFilterModalOpen(true)}
//         >
//           <IconFilterTable />
//         </span>
//       </div>

//       <div className="bg-white1 rounded-2xl lg:border lg:border-gray21 p-4 text-black1">

//         <div className="hidden lg:flex flex-wrap gap-2 justify-start mb-6">
//           <div className="flex items-center gap-1">
//             <span className="w-5 h-5 icon-wrapper text-gray12">
//               <IconFilterTable />
//             </span>
//             <span className="text-gray12">فیلترها</span>
//           </div>
//           <div className="w-px h-6 bg-gray-400 self-center"></div>

//           <FilterDropdown
//             id="sort"
//             label="بیشترین تراکنش"
//             options={["جدیدترین", "قدیمی‌ترین"]}
//             selected={filters["sort"] || ""}
//             isOpen={openDropdown === "sort"}
//             onToggle={handleToggle}
//             onSelect={handleSelect}
//             absolute={true}
//              withBorder={true}
//           />
//           <FilterDropdown
//             id="type"
//             label="نوع تراکنش"
//             options={["همه", "واریز", "برداشت", "خرید", "فروش"]}
//             selected={filters["type"] || ""}
//             isOpen={openDropdown === "type"}
//             onToggle={handleToggle}
//             onSelect={handleSelect}
//             absolute={true}
//              withBorder={true}
//           />
//           <FilterDropdown
//             id="status"
//             label="وضعیت"
//             options={["همه", "انجام شده", "در حال بررسی", "رد شده"]}
//             selected={filters["status"] || ""}
//             isOpen={openDropdown === "status"}
//             onToggle={handleToggle}
//             onSelect={handleSelect}
//             absolute={true}
//              withBorder={true}
//           />
//         </div>

//         <div className="block lg:hidden space-y-4">
//           {pagedData.length > 0 ? (
//             pagedData.map((tx) => (
//               <div key={tx.id} className="border rounded-xl p-4">
//                 <div className="flex items-center justify-between mb-2">
//                   <div className="flex items-center gap-2">
//                     <span className="w-9 h-9 icon-wrapper">{tx.currencyIcon}</span>
//                     <div>
//                       <p className="font-medium text-black1">{tx.currencyName}</p>
//                       <p className="text-xs text-gray-500">{tx.currencySymbol}</p>
//                     </div>
//                   </div>
//                   <StatusBadge text={tx.status} />
//                 </div>

//                 <div className="text-sm space-y-1">
//                   <p className="flex justify-between">
//                     مقدار: <span className="font-medium">{tx.amount}</span>
//                   </p>
//                   <p className="flex justify-between">
//                     تاریخ تراکنش:{" "}
//                     <span className="font-medium">
//                       {tx.date} | {tx.time}
//                     </span>
//                   </p>
//                 </div>

//                 <div
//                   className="text-blue-600 text-sm mt-3 cursor-pointer border-t pt-2 text-center"
//                   onClick={() => setSelectedTx(tx)}
//                 >
//                   جزئیات تراکنش
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="flex flex-col items-center justify-center py-12 min-h-[600px]">
//               <img
//                 src="/assets/images/no-transaction.png"
//                 alt="بدون تراکنش"
//                 className="w-32 h-32 mb-3 opacity-80"
//               />
//               <p className="text-gray-500 text-base">تاکنون تراکنشی نداشته‌اید!</p>
//             </div>
//           )}
//         </div>

    
//         <div className="hidden lg:block">
//           <div style={{ minHeight: "400px" }}>
//             {pagedData.length > 0 ? (
//               <table dir="rtl" className="w-full text-sm border-collapse">
//                 <thead>
//                   <tr className="bg-gray41 text-black1 text-right ">
//                     <th className="py-5 px-3">ارز</th>
//                     <th className="py-5 px-3">مقدار</th>
//                     <th className="py-5 px-3">نوع</th>
//                     <th className="py-5 px-3">وضعیت</th>
//                     <th className="py-5 px-3">تاریخ و زمان</th>
//                     <th className="py-5 px-3">جزئیات</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {pagedData.map((tx) => (
//                     <tr
//                       key={tx.id}
//                       className="lg:border-b last:border-none hover:bg-gray42 text-start lg:border-b-gray21"
//                       style={{ height: "60px" }}
//                     >
//                       <td className="py-3 px-4 flex items-start gap-2 justify-start">
//                         <span className="w-9 h-9 icon-wrapper">{tx.currencyIcon}</span>
//                         <div className="flex flex-col text-right">
//                           <span className="font-medium text-black1">{tx.currencyName}</span>
//                           <span className="text-xs text-gray-500 pt-1">{tx.currencySymbol}</span>
//                         </div>
//                       </td>
//                       <td className="py-3 px-4">{tx.amount}</td>
//                       <td className="py-3 px-4">{tx.type}</td>
//                       <td className="py-3 px-4">
//                         <StatusBadge text={tx.status} />
//                       </td>
//                       <td className="py-3 px-4">{tx.date} | {tx.time}</td>
//                       <td
//                         className="py-3 px-4 text-blue-600 cursor-pointer"
//                         onClick={() => setSelectedTx(tx)}
//                       >
//                         جزئیات
//                       </td>
//                     </tr>
//                   ))}

//                   {/* ردیف‌های خالی برای ثابت نگه داشتن ارتفاع */}
//                   {Array.from({ length: emptyRows }).map((_, idx) => (
//                     <tr key={`empty-${idx}`} style={{ height: "60px" }}>
//                       <td className="py-3 px-4">&nbsp;</td>
//                       <td className="py-3 px-4">&nbsp;</td>
//                       <td className="py-3 px-4">&nbsp;</td>
//                       <td className="py-3 px-4">&nbsp;</td>
//                       <td className="py-3 px-4">&nbsp;</td>
//                       <td className="py-3 px-4">&nbsp;</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             ) : (
//               <div className="flex flex-col items-center justify-center min-h-[600px]">
//            <img
//     src={TrasactionHisory} // تصویر پیش‌فرض (لایت)
//     alt="بدون تراکنش"
//     className="mb-3 dark:hidden"
//   />
//   <img
//     src={TransactionHistoryDark} // تصویر دارک
//     alt="بدون تراکنش"
//     className="mb-3 hidden dark:block"
//   />
//                 <p className="text-gray-500 text-lg font-medium">تاکنون تراکنشی نداشته‌اید!</p>
//               </div>
//             )}
//           </div>
//         </div>

     
//       </div>

//         {pagedData.length > 0 && (
//   <Pagination current={page} total={12} onPageChange={setPage} />
// )}

//       {selectedTx && <TransactionModal tx={selectedTx} onClose={() => setSelectedTx(null)} />}
//       <FilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} />
//     </div>
//   );
// };

// export default TransactionTable;
import React, { useState, useMemo, useEffect } from "react";
import FilterDropdown from "./FilterDropdown";
import StatusBadge from "../UI/Button/StatusBadge";
import IconFilterTable from "../../assets/icons/transaction-history/IconFilterTable";
import Pagination from "./Pagination";
import TransactionModal, { Transaction as ModalTransaction } from "./TransactionModal";
import FilterModal from "./FilterModal";
import TrasactionHisory from "./../../assets/images/Transaction/Transactionhistory.png";
import TransactionHistoryDark from "./../../assets/images/Transaction/Transaction HistoryDark.png";
import { apiRequest } from "../../utils/apiClient"; // تابع فرضی برای فراخوانی API

// ---------- تایپ برای Table ----------
export interface Transaction {
  id: number;
  type: string;
  amount: number;
  status: string;
  DateTime: string;
  coin: { name: string; symbol: string };
  fee?: number;
  memoTag?: string;
  code?: string;
  date?: string;
  time?: string;
  total?: number;
}

const TransactionTable: React.FC = () => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTx, setSelectedTx] = useState<ModalTransaction | null>(null);
  const pageSize = 10;

  // ---------- API تراکنش‌ها ----------
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = (await apiRequest({ url: "/api/history/crypto-transaction" })) as {
          transaction: Transaction[];
        };
        // استخراج date و time از DateTime
        const txWithDateTime = response.transaction.map((tx) => {
          let date = tx.DateTime;
          let time = "";
          const parts = tx.DateTime.split(" ");
          if (parts.length >= 2) {
            time = parts.slice(-2).join(" ");
            date = parts.slice(0, -2).join(" ");
          }
          return { ...tx, date, time, total: tx.amount };
        });
        setTransactions(txWithDateTime);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      }
    };
    fetchTransactions();
  }, []);

  // ---------- فیلتر ----------
  const filteredData = transactions.filter((tx) => {
    const typeFilter = filters["type"]
      ? tx.type === filters["type"] || filters["type"] === "همه"
      : true;
    const statusFilter = filters["status"]
      ? tx.status === filters["status"] || filters["status"] === "همه"
      : true;
    return typeFilter && statusFilter;
  });

  // ---------- صفحه‌بندی ----------
  const pagedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page]);

  const emptyRows = pageSize - pagedData.length;

  // ---------- هندلرها ----------
  const handleToggle = (id: string) => setOpenDropdown((prev) => (prev === id ? null : id));
  const handleSelect = (id: string, value: string) => {
    setFilters((prev) => ({ ...prev, [id]: value }));
    setOpenDropdown(null);
    setPage(1);
  };

  // ---------- تبدیل داده برای Modal ----------
  const handleOpenModal = (tx: Transaction) => {
    const modalTx: ModalTransaction = {
      id: tx.id.toString(),
      currencyName: tx.coin.name,
      currencySymbol: tx.coin.symbol,
      currencyIcon: null, // بعداً از API ارزها پر می‌کنیم
      amount: tx.amount.toString(),
      type: tx.type,
      status:
        tx.status === "success"
          ? "انجام شده"
          : tx.status === "pending"
          ? "درحال بررسی"
          : "رد شده",
      date: tx.date || "",
      time: tx.time || "",
      total: tx.total?.toString() || tx.amount.toString(),
      fee: tx.fee?.toString() || "0",
      memoTag: tx.memoTag || "",
      code: tx.code || "",
    };
    setSelectedTx(modalTx);
  };

  // ---------- JSX ----------
  return (
    <div dir="rtl">
      <div className="text-black1 flex lg:mb-4 font-medium lg:justify-between justify-end container-style">
        <h1 className="hidden lg:block">تاریخچه تراکنش ها</h1>
        <span
          className="w-6 h-6 icon-wrapper text-gray12 lg:hidden"
          onClick={() => setIsFilterModalOpen(true)}
        >
          <IconFilterTable />
        </span>
      </div>

      <div className="bg-white1 rounded-2xl lg:border lg:border-gray21 p-4 text-black1">
        {/* فیلترها */}
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
            absolute
            withBorder
          />
          <FilterDropdown
            id="type"
            label="نوع تراکنش"
            options={["همه", "واریز", "برداشت", "خرید", "فروش"]}
            selected={filters["type"] || ""}
            isOpen={openDropdown === "type"}
            onToggle={handleToggle}
            onSelect={handleSelect}
            absolute
            withBorder
          />
          <FilterDropdown
            id="status"
            label="وضعیت"
            options={["همه", "انجام شده", "درحال بررسی", "رد شده"]}
            selected={filters["status"] || ""}
            isOpen={openDropdown === "status"}
            onToggle={handleToggle}
            onSelect={handleSelect}
            absolute
            withBorder
          />
        </div>

        {/* موبایل */}
        <div className="block lg:hidden space-y-4">
          {pagedData.length > 0 ? (
            pagedData.map((tx) => (
              <div key={tx.id} className="border rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-9 h-9 icon-wrapper">{/* بدون آیکون فعلاً */}</span>
                    <div>
                      <p className="font-medium text-black1">{tx.coin.name}</p>
                      <p className="text-xs text-gray-500">{tx.coin.symbol}</p>
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
                  onClick={() => handleOpenModal(tx)}
                >
                  جزئیات تراکنش
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 min-h-[600px]">
              <img
                src={TrasactionHisory}
                alt="بدون تراکنش"
                className="w-32 h-32 mb-3 opacity-80"
              />
              <p className="text-gray-500 text-base">تاکنون تراکنشی نداشته‌اید!</p>
            </div>
          )}
        </div>

        {/* دسکتاپ */}
        <div className="hidden lg:block">
          <div style={{ minHeight: "400px" }}>
            {pagedData.length > 0 ? (
              <table dir="rtl" className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray41 text-black1 text-right ">
                    <th className="py-5 px-3">ارز</th>
                    <th className="py-5 px-3">مقدار</th>
                    <th className="py-5 px-3">نوع</th>
                    <th className="py-5 px-3">وضعیت</th>
                    <th className="py-5 px-3">تاریخ و زمان</th>
                    <th className="py-5 px-3">جزئیات</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedData.map((tx) => (
                    <tr
                      key={tx.id}
                      className="lg:border-b last:border-none hover:bg-gray42 text-start lg:border-b-gray21"
                      style={{ height: "60px" }}
                    >
                      <td className="py-3 px-4 flex items-start gap-2 justify-start">
                        <span className="w-9 h-9 icon-wrapper">{/* بدون آیکون */}</span>
                        <div className="flex flex-col text-right">
                          <span className="font-medium text-black1">{tx.coin.name}</span>
                          <span className="text-xs text-gray-500 pt-1">{tx.coin.symbol}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">{tx.amount}</td>
                      <td className="py-3 px-4">{tx.type}</td>
                      <td className="py-3 px-4">
                        <StatusBadge text={tx.status} />
                      </td>
                      <td className="py-3 px-4">{tx.date} | {tx.time}</td>
                      <td
                        className="py-3 px-4 text-blue-600 cursor-pointer"
                        onClick={() => handleOpenModal(tx)}
                      >
                        جزئیات
                      </td>
                    </tr>
                  ))}
                  {Array.from({ length: emptyRows }).map((_, idx) => (
                    <tr key={`empty-${idx}`} style={{ height: "60px" }}>
                      <td className="py-3 px-4">&nbsp;</td>
                      <td className="py-3 px-4">&nbsp;</td>
                      <td className="py-3 px-4">&nbsp;</td>
                      <td className="py-3 px-4">&nbsp;</td>
                      <td className="py-3 px-4">&nbsp;</td>
                      <td className="py-3 px-4">&nbsp;</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[600px]">
                <img
                  src={TrasactionHisory}
                  alt="بدون تراکنش"
                  className="mb-3 dark:hidden"
                />
                <img
                  src={TransactionHistoryDark}
                  alt="بدون تراکنش"
                  className="mb-3 hidden dark:block"
                />
                <p className="text-gray-500 text-lg font-medium">تاکنون تراکنشی نداشته‌اید!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pagination */}
      {pagedData.length > 0 && (
        <Pagination
          current={page}
          total={Math.ceil(filteredData.length / pageSize)}
          onPageChange={setPage}
        />
      )}

      {/* Modal */}
      {selectedTx && <TransactionModal tx={selectedTx} onClose={() => setSelectedTx(null)} />}
      <FilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} />
    </div>
  );
};

export default TransactionTable;

