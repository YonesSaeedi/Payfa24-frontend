import { useState, useEffect } from "react";
import IconClose from "../../assets/icons/Login/IconClose";
import FilterDropdown from "./FilterDropdown";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: { [key: string]: string | null }) => void;
  page: "transactions" | "users"; 
}

interface OptionType {
  id: number;
  name: string;
  value: string;
}


const pageFilters: Record<string, { id: string; label: string; options: OptionType[] }[]> = {
  transactions: [
    {
      id: "status",
      label: "وضعیت",
      options: [
        { id: 1, name: "همه", value: "all" },
        { id: 2, name: "فعال", value: "active" },
        { id: 3, name: "غیرفعال", value: "inactive" },
      ],
    },
    {
      id: "type",
      label: "نوع تراکنش",
      options: [
        { id: 1, name: "همه", value: "all" },
        { id: 2, name: "دریافتی", value: "received" },
        { id: 3, name: "پرداختی", value: "paid" },
      ],
    },
    {
      id: "sort",
      label: "مرتب سازی بر اساس",
      options: [
        { id: 1, name: "جدیدترین", value: "newest" },
        { id: 2, name: "قدیمی‌ترین", value: "oldest" },
        { id: 3, name: "بیشترین تراکنش", value: "most" },
        { id: 4, name: "کمترین تراکنش", value: "least" },
      ],
    },
  ],
  users: [
    {
      id: "role",
      label: "نقش کاربر",
      options: [
        { id: 1, name: "همه", value: "all" },
        { id: 2, name: "ادمین", value: "admin" },
        { id: 3, name: "کاربر عادی", value: "user" },
      ],
    },
    {
      id: "status",
      label: "وضعیت",
      options: [
        { id: 1, name: "همه", value: "all" },
        { id: 2, name: "فعال", value: "active" },
        { id: 3, name: "غیرفعال", value: "inactive" },
      ],
    },
  ],
};

export default function FilterModal({ isOpen, onClose, onApplyFilters, page }: FilterModalProps) {
  const [openDropdown, setOpenDropdown] = useState<string>("");
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: OptionType | null }>({});

useEffect(() => {
  if (!pageFilters[page]) return; 
  const initial: { [key: string]: null } = {};
  pageFilters[page].forEach((field) => {
    initial[field.id] = null;
  });
  setSelectedFilters(initial);
  setOpenDropdown("");
}, [page, isOpen]);


  if (!isOpen) return null;

  const handleSelect = (id: string, option: OptionType) => {
    setSelectedFilters((prev) => ({ ...prev, [id]: option }));
    setOpenDropdown("");
  };

  const handleClearFilters = () => {
    const cleared: { [key: string]: null } = {};
    pageFilters[page].forEach((field) => {
      cleared[field.id] = null;
    });
    setSelectedFilters(cleared);
    setOpenDropdown("");
    onClose();
  };

  const handleApplyFilters = () => {
    const appliedFilters: { [key: string]: string | null } = {};
    Object.entries(selectedFilters).forEach(([key, value]) => {
      appliedFilters[key] = value?.value || null;
    });
    onApplyFilters(appliedFilters);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white8 rounded-2xl p-6 w-[90%] max-w-md shadow-xl text-black0 dark:text-white transition-colors duration-200"
        onClick={(e) => e.stopPropagation()}
      >
       
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">فیلترها</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center text-black0"
          >
            <IconClose />
          </button>
        </div>

        
        <div className="space-y-4">
          {pageFilters[page].map((field) => (
            <FilterDropdown
              key={field.id}
              id={field.id}
              label={field.label}
              options={field.options}
              selected={selectedFilters[field.id]}
              isOpen={openDropdown === field.id}
              onToggle={(id) => setOpenDropdown(openDropdown === id ? "" : id)}
              onSelect={handleSelect}
            />
          ))}
        </div>

      
        <div className="flex gap-2 mt-6">
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
