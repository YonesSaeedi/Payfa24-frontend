import { BitcoinIcon, SearchIcon } from "lucide-react";
import React, { useState, useMemo } from "react";
import IconClose from "../../assets/Icons/Login/IconClose";

// Mock data (داده‌های تستی)
const mockCurrencies = [
  {
    name: "بیت کوین",
    symbol: "BTC",
    price: "۴۸۹,۷۰۳",
    icon: <BitcoinIcon />,
  },
  {
    name: "تزوس",
    symbol: "XTZ",
    price: "۴۸۹,۷۰۳",
    icon: <BitcoinIcon />,
  },
  {
    name: "دتا فول",
    symbol: "TFUL",
    price: "۴۸۹,۷۰۳",
    icon: <BitcoinIcon />,
  },
  {
    name: "یوبیک",
    symbol: "BTC",
    price: "۴۸۹,۷۰۳",
    icon: <BitcoinIcon />,
  },
  {
    name: "یونیپ رایت",
    symbol: "UBT",
    price: "۴۸۹,۷۰۳",
    icon: <BitcoinIcon />,
  },
   {
    name: "یونیپ رایت",
    symbol: "UBT",
    price: "۴۸۹,۷۰۳",
    icon: <BitcoinIcon />,
  },
   {
    name: "یونیپ رایت",
    symbol: "UBT",
    price: "۴۸۹,۷۰۳",
    icon: <BitcoinIcon />,
  },
];

interface Currency {
  name: string;
  symbol: string;
  price: string;
  icon: React.ReactNode;
}

interface CurrencyModalProps {
  onClose: () => void;
}

export default function CurrencyModal({ onClose }: CurrencyModalProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredCurrencies = useMemo(() => {
    if (!searchTerm) {
      return mockCurrencies;
    }
    return mockCurrencies.filter(
      (currency) =>
        currency.name.includes(searchTerm) ||
        currency.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleCurrencyClick = (currency: Currency) => {
    console.log("ارز انتخاب شده:", currency);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white1 rounded-xl shadow-lg w-full max-w-md px-4 pt-4">
        {/* Modal Header */}
        <div className="flex justify-between flex-row-reverse items-center mb-4">
          <h2 className="text-lg font-bold text-black0">انتخاب ارز</h2>
          <span onClick={onClose} className="icon-wrapper w-6 h-6">
            <IconClose />
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative w-full mb-4 ">
          <input
            type="text"
            placeholder="... جستجو "
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-8 py-3 bg-transparent border border-gray5 rounded-lg focus:outline-none focus:border-blue2 text-right"
          />

          <span className="absolute top-1/2 right-3 transform -translate-y-1/2 h-5 w-5 icon-wrapper text-gray5">
            <SearchIcon />
          </span>
        </div>

        {/* Currency List */}
       <div className="space-y-3 max-h-96 overflow-y-auto px-5">
  {filteredCurrencies.length > 0 ? (
    filteredCurrencies.map((currency) => (
      <div
        key={currency.name}
        className="flex items-center justify-between h-14 cursor-pointer rounded-lg"
        onClick={() => handleCurrencyClick(currency)}
      >
        <div className="flex w-full items-center flex-row-reverse justify-between">
          {/* right */}
          <div className="flex items-center gap-3">
            <div className="flex items-end flex-col gap-1">
              <span className="text-sm text-black0">{currency.name}</span>
              <span className="text-xs text-gray3">{currency.symbol}</span>
            </div>
            <span className="w-9 h-9 flex items-center justify-center bg-green-500 rounded-full">
              {currency.icon}
            </span>
          </div>

          {/* left */}
          <div className="flex flex-col">
            <span className="text-gray3 text-xs">قیمت خرید</span>
            <span
              className="text-black0"
              style={{ direction: "rtl", unicodeBidi: "isolate" }}
            >
              {currency.price} تومان
            </span>
          </div>
        </div>
      </div>
    ))
  ) : (
    <p className="text-center text-gray-500 mt-4">ارزی یافت نشد.</p>
  )}
</div>

      </div>
    </div>
  );
}
