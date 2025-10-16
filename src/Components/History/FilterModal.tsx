import  { useState } from "react";
import IconClose from "../../assets/Icons/Login/IconClose";
import FilterDropdown from "./FilterDropdown";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FilterModal({ isOpen, onClose }: FilterModalProps) {
  const [openDropdown, setOpenDropdown] = useState<string>("");
  const [selectedFilters, setSelectedFilters] = useState({
    status: "",
    type: "",
    sort: "",
  });

  if (!isOpen) return null;


  const handleSelect = (id: string, value: string) => {
    setSelectedFilters((prev) => ({ ...prev, [id]: value }));
    setOpenDropdown("");
  };

  
  const handleClearFilters = () => {
    setSelectedFilters({ status: "", type: "", sort: "" });
    setOpenDropdown("");
    onClose();
  };

  const handleApplyFilters = () => {
    console.log("فیلترهای انتخاب‌شده:", selectedFilters);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"  onClick={onClose} >
      <div className="bg-white8 w-11/12 max-w-lg rounded-2xl p-4 shadow-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-medium text-black0">فیلترها</h2>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded-full text-black0"
          >
            <IconClose />
          </button>
        </div>
        <div className="space-y-3 pt-6">
          <FilterDropdown
            id="status"
            label="وضعیت"
            options={["همه", "فعال", "غیرفعال"]}
            selected={selectedFilters.status}
            isOpen={openDropdown === "status"}
            onToggle={(id) => setOpenDropdown(openDropdown === id ? "" : id)}
            onSelect={handleSelect}
            className="w-full"
            absolute={false}
          />

          <FilterDropdown
            id="type"
            label="نوع تراکنش"
            options={["همه", "دریافتی", "پرداختی"]}
            selected={selectedFilters.type}
            isOpen={openDropdown === "type"}
            onToggle={(id) => setOpenDropdown(openDropdown === id ? "" : id)}
            onSelect={handleSelect}
            className="w-full"
            absolute={false}
          />

          <FilterDropdown
            id="sort"
            label="مرتب سازی بر اساس"
            options={["جدیدترین", "قدیمی‌ترین", "بیشترین تراکنش", "کمترین تراکنش"]}
            selected={selectedFilters.sort}
            isOpen={openDropdown === "sort"}
            onToggle={(id) => setOpenDropdown(openDropdown === id ? "" : id)}
            onSelect={handleSelect}
            className="w-full"
            absolute={false}
          />
        </div>
        <div className="flex  gap-2 mt-6">
          <button
            onClick={handleClearFilters}
            className="w-full py-2 border border-blue-500 text-blue-500 rounded-lg text-sm"
          >
            حذف فیلتر
          </button>
          <button
            onClick={handleApplyFilters}
            className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm"
          >
            اعمال فیلتر
          </button>
        </div>
      </div>
    </div>
  );
}
