import { Link } from "react-router"
import IconArrowBottomLeft from "../../assets/icons/trade/IconArrowBottomLeft"
import IconArrowTopLeft from "../../assets/icons/trade/IconArrowTopLeft"
import IconChevron from "../../assets/icons/trade/IconChevron"
import { useRef, useState } from "react"
import { formatPersianDigits } from "../../utils/formatPersianDigits"

const Buy = () => {
  const countInputRef = useRef<HTMLInputElement | null>(null)
  const amountInputRef = useRef<HTMLInputElement | null>(null)
  const [countInputStr, setCountInputStr] = useState<string>("");
  const [amountValue, setAmountValue] = useState<number | ''>('')
  const currentCryptoPrice = 100_000
  const persianToEnglish = (input: string) => input.replace(/[۰-۹]/g, d => String(d.charCodeAt(0) - 1776)).replace(/,/g, "");
  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = persianToEnglish(e.target.value);
    val = val.replace(/[^0-9.]/g, "");
    val = val.replace(/(\..*)\./g, "$1");
    setCountInputStr(val);
    setAmountValue(val === "" ? 0 : Number(val) * currentCryptoPrice);
  };
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = persianToEnglish(e.target.value);
    val = val.replace(/[^0-9.]/g, "");
    val = val.replace(/(\..*)\./g, "$1");

    const num = val === "" ? 0 : Number(val);
    setAmountValue(num);
    setCountInputStr(String(num / currentCryptoPrice));
  };

  return (
    <div className="w-full h-full lg:bg-bg4 rounded-2xl lg:px-8 lg:py-12 flex flex-col gap-10">
      <div className="flex items-center gap-2">
        <Link to='/trade/buy' className="w-1/2 py-3 flex items-center gap-1 justify-center rounded-lg text-text6 bg-green1">
          <span className="text-sm font-medium lg:text-lg lg:font-bold">خرید</span>
          <span className="icon-wrapper lg:w-5 lg:h-5 w-4 h-4"><IconArrowBottomLeft /></span>
        </Link>
        <Link to='/trade/sell' className="w-1/2 py-3 flex items-center gap-1 justify-center rounded-lg text-text6 bg-green1">
          <span className="text-sm font-medium lg:text-lg lg:font-bold">فروش</span>
          <span className="icon-wrapper lg:w-5 lg:h-5 w-4 h-4"><IconArrowTopLeft /></span>
        </Link>
      </div>
      {/* select coin button ======================================================================================================= */}
      <div className="flex flex-col gap-3">
        <div onClick={() => null} className="border border-text2 rounded-lg px-4 py-2.5 lg:py-3.5 flex items-center justify-between cursor-pointer relative">
          <div className="absolute px-1 bg-backgroundMain lg:bg-bg4  border-none -top-4 right-4 text-text7 text-sm font-normal">انتخاب رمز ارز</div>
          <div className="flex items-center gap-8">
            <span className="icon-wrapper"></span>
            <span className="text-text4 text-sm font-normal">مونوس</span>
          </div>
          <span className="icon-wrapper w-5 h-5 -rotate-90 text-grey1"><IconChevron /></span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-text5 text-xs lg:text-sm font-medium">موجودی شما :<span className="text-text4 font-normal">{'12.003 MNS'}</span></div>
          <span className="text-sm font-normal text-text4">قیمت خرید :{'2,020,000 تومان'}</span>
        </div>
      </div>
      {/* choose count ======================================================================================================= */}
      <div onClick={() => countInputRef.current?.focus()} className="border border-text2 rounded-lg px-4 py-2.5 lg:py-3.5 cursor-text relative">
        <div className="absolute px-1 bg-backgroundMain lg:bg-bg4  border-none -top-4 right-4 text-text7 text-sm font-normal">مقدار رمز ارز</div>
        <input
          ref={countInputRef}
          type="text"
          inputMode="decimal"
          className="bg-transparent appearance-none outline-none w-full text-text7 text-right"
          placeholder={`مقدار ${'مونوس'} مدنظر را وارد کنید`}
          value={countInputStr}
          onChange={handleCountChange}
          dir="ltr"
        />
      </div>
      {/* choose amount ======================================================================================================= */}
      <div onClick={() => amountInputRef.current?.focus()} className="border border-text2 rounded-lg px-4 py-2.5 lg:py-3.5 cursor-text relative flex flex-col gap-5 lg:gap-3">
        <div className="absolute px-1 bg-backgroundMain lg:bg-bg4  border-none -top-4 right-4 text-text7 text-sm font-normal">مقدار پرداختی</div>
        <div className="w-full flex items-center justify-between">
          <input
            ref={amountInputRef}
            type="text"
            inputMode="decimal"
            className="bg-transparent appearance-none outline-none text-text4 text-right w-10/12"
            value={amountValue === "" ? formatPersianDigits(0) : formatPersianDigits(amountValue)}
            onChange={handleAmountChange}
            dir="ltr"
          />÷
          <span className="text-sm font-normal text-text7">تومان</span>
        </div>
        <div className="flex items-center justify-between text-sm font-normal">
          <div className="flex items-center gap-1">
            <span className="icon-wrapper w-5 h-5"></span>
            <span className="text-xs lg:text-sm font-medium">موجودی شما : </span>
            {formatPersianDigits(3400)} تومان
          </div>
        </div>
      </div>
    </div>
  )
}

export default Buy