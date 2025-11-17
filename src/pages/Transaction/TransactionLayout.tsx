import { useState } from "react";
import IconFilterTable from "../../assets/icons/transaction-history/IconFilterTable";
import BreadcrumbNavigation from "../../components/BreadcrumbNavigation";
import HeaderLayout from "../../layouts/HeaderLayout";
import { Outlet } from "react-router";
import FilterModal from "../../components/History/FilterModal";
import { statusOptions, filterForOptions, typeOptions } from "./../../components/History/typeHistory"; 

const TransactionLayout = () => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(statusOptions?.[0] || null);

  const [selectedFilterFor, setSelectedFilterFor] = useState(filterForOptions[0]);
  const [selectedFilterType, setSelectedFilterType] = useState(typeOptions[0]);
  const [page, setPage] = useState(1);

  const handleApplyMobileFilters = (filters: { [key: string]: string | null }) => {
    const typeOption = typeOptions.find((o) => o.value === filters.type) || typeOptions[0];
    const statusOption = statusOptions.find((o) => o.value === filters.status) || statusOptions[0];
    const filterForOption = filterForOptions.find((o) => o.value === filters.filterFor) || filterForOptions[0];

    setSelectedFilterType(typeOption);
    setSelectedStatus(statusOption);
    setSelectedFilterFor(filterForOption);

    setPage(1);
  };

  return (
    <div className="h-full">
      <HeaderLayout>
        <div className="bg-backgroundMain min-h-screen w-full">
          <div className="container-style flex flex-col lg:gap-12">
            <div className="mt-7 lg:mt-4 flex flex-row-reverse items-center justify-between px-4">
              <BreadcrumbNavigation />
              <span className="w-6 h-6 icon-wrapper text-gray12 lg:hidden cursor-pointer" onClick={() => setIsFilterModalOpen(true)}>
                <IconFilterTable />
              </span>
            </div>
            <Outlet context={{ selectedStatus, selectedFilterFor, selectedFilterType, page, setPage }} />
          </div>
        </div>
      </HeaderLayout>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        page="transactions"
        onApplyFilters={handleApplyMobileFilters}
      />
    </div>
  );
};

export default TransactionLayout;


