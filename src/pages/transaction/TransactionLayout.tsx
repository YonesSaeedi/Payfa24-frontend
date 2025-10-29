
import  { useState } from "react";
import IconFilterTable from "../../assets/icons/transaction-history/IconFilterTable";
import BreadcrumbNavigation from "../../components/BreadcrumbNavigation";
import HeaderLayout from "../../layouts/HeaderLayout";
import { Outlet } from "react-router";
import FilterModal from "../../components/History/FilterModal";

const TransactionLayout = () => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  return (
    <div className="h-full">
      <HeaderLayout>
        <div className="bg-backgroundMain min-h-screen w-full">
          <div className="container-style flex flex-col  lg:gap-12">
           <div className="mt-7 lg:mt-4 flex flex-row-reverse items-center justify-between px-4">
  <BreadcrumbNavigation />
  <span
    className="w-6 h-6 icon-wrapper text-gray12 lg:hidden cursor-pointer"
    onClick={() => setIsFilterModalOpen(true)}
  >
    <IconFilterTable />
  </span>
</div>

            <Outlet />
          </div>
        </div>
      </HeaderLayout>
      {/* مودال فیلتر */}
      <div dir="rtl">
         <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />
      </div>
     
    </div>
  );
};

export default TransactionLayout;
