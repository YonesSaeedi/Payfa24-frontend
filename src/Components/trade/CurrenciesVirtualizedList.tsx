import { FixedSizeList as List, ListChildComponentProps } from "react-window";
import { CryptoItem } from "../../types/crypto";
import React from "react";
import { formatPersianDigits } from "../../utils/formatPersianDigits";

interface CurrenciesVirtualizedListProps {
  items: (CryptoItem | null)[];
  height: number;
  itemHeight: number;
  width: number | string;
  setCurrentCryptoCurrency: (cryptocurrency: CryptoItem) => void
  closeModal: () => void
}

const CurrenciesVirtualizedList: React.FC<CurrenciesVirtualizedListProps> = ({ height, itemHeight, items, width, setCurrentCryptoCurrency, closeModal }) => {
  const Row: React.FC<ListChildComponentProps<(CryptoItem | null)[]>> = ({ index, style, data, }) => {
    const item = data[index];

    if (!item) return (
      <div className="p-3 rounded-lg bg-gray-200 animate-pulse mb-2">
        <div className="h-4 w-2/3 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
      </div>
    )
    return (
      <div style={{ ...style, top: (style.top as number) + 4, paddingRight: 6 }}>
        <button
          onClick={() => {
            setCurrentCryptoCurrency(item)
            closeModal()
          }}
          dir="rtl"
          className="w-full px-3 lg:px-4 py-1 lg:py-2 rounded-lg border border-gray26 bg-gray33 flex items-center hover:bg-gray6 hover:border-blue2"
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-1">
              <div className="w-8 h-8 rounded-full">
                {item.isFont ?
                  <i className={`cf cf-${item.symbol.toLowerCase()}`} style={{ color: item.color, fontSize: '32px' }}></i>
                  :
                  <img src={`https://api.payfa24.org/images/currency/${item.icon}`} alt={item.symbol} className="object-contain w-full h-full" />
                }
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-normal text-black1">{item.locale.fa.name}</span>
                <span className="text-gray3 text-xs font-normal w-min">{item.symbol}</span>
              </div>
            </div>
            <div className="flex flex-col lg:gap-1 items-end">
              <span className="text-gray3 text-xs font-normal">قیمت خرید</span>
              <span className="text-xs lg:text-sm font-normal text-black1">{formatPersianDigits(Number(item.priceBuy))} تومان</span>
            </div>
          </div>
        </button>
      </div>
    );
  };

  if (items.length === 0) {
    return <div className="flex items-center justify-center p-4 text-black2" style={{ height }}>موردی یافت نشد.</div>
  }
  return (
    <List
      height={height}
      width={width}
      itemCount={items.length}
      itemSize={itemHeight + 4}
      itemData={items} // this replaces your rowProps
    >
      {Row}
    </List>
  );
};

export default CurrenciesVirtualizedList;
