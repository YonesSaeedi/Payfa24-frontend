import { useEffect, useState } from "react";
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
      id: "type",
      label: "همه تراکنش ها",
      options: [
       
        { id: 1, name: "سفارش", value: "order" },
        { id: 2, name: "کیف پول", value: "wallet" },
      ],
    },
    {
      id: "status",
      label: "همه وضعیت ها",
      options: [
        { id: 1, name: "موفق", value: "success" },
        { id: 2, name: "در حال بررسی", value: "pending" },
        { id: 3, name: "ناموفق", value: "failed" },
        { id: 4, name: "رد شده", value: "rejected" },
      ],
    },
    {
      id: "filterFor",
      label: "واریز و برداشت",
      options: [
        { id: 1, name: "واریز", value: "deposit" },
        { id: 2, name: "برداشت", value: "withdraw" },
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
    const initial: { [key: string]: OptionType | null } = {};
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
    onApplyFilters(cleared);
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
      <div dir="rtl"
        className="bg-white8 rounded-2xl p-6 w-[327px] max-w-md shadow-xl text-black0 dark:text-white transition-colors duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-semibold text-lg">فیلترها</h2>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center text-gray12 hover:text-blue2"
          >
            <IconClose />
          </button>
        </div>

        <div className="space-y-4">
          {pageFilters[page].map((field) => (
            <FilterDropdown
              key={field.id}
              id={field.id}
              label={selectedFilters[field.id]?.name || field.label}
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
            className="w-full py-2 border border-blue2 text-blue2 rounded-lg text-sm hover:bg-blue2 hover:text-white"
          >
            حذف فیلتر
          </button>
          <button
            onClick={handleApplyFilters}
            className="w-full py-2 bg-blue2 text-white rounded-lg text-sm hover:bg-white8 hover:border hover:border-blue2 hover:text-blue2"
          >
            اعمال فیلتر
          </button>
        </div>
      </div>
    </div>
  );
}
