import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import IconArrowBottomLeft from "../../assets/icons/trade/IconArrowBottomLeft";
import IconArrowTopLeft from "../../assets/icons/trade/IconArrowTopLeft";
import IconBorderedPlus from "../../assets/icons/trade/IconBorderedPlus";
import IconChevron from "../../assets/icons/trade/IconChevron";
import { formatPersianDigits } from "../../utils/formatPersianDigits";
import PercentBar from "./PercentBar";

type BuyAndSellProps = {
  isSell: boolean;
}

const BuyAndSell = ({ isSell = false }: BuyAndSellProps) => {
  const countInputRef = useRef<HTMLInputElement | null>(null)
  const amountInputRef = useRef<HTMLInputElement | null>(null)
  const lastChangedRef = useRef<'percent' | 'input' | null>(null);
  const [countInputStr, setCountInputStr] = useState<string>("");
  const [amountValue, setAmountValue] = useState<number | ''>('')
  const [selectedPercent, setSelectedPercent] = useState<number>(0)
  const currentCryptoPrice = 100_000 // to be removed after it is connected to the API
  const cryptoBalance = 12 // to be removed after it is connected to the API
  const TomanBalance = 700_000 // to be removed after it is connected to the API
  const persianToEnglish = (input: string) => input.replace(/[۰-۹]/g, d => String(d.charCodeAt(0) - 1776)).replace(/,/g, "");
  // handles count input change ====================================================================================================
  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    lastChangedRef.current = 'input';
    let val = persianToEnglish(e.target.value).replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    const num = Number(val);
    if (!isNaN(num)) {
      if (num > cryptoBalance) {
        val = cryptoBalance.toString();
      }
    }
    setCountInputStr(val); // keep the string as user typed
    setAmountValue(!isNaN(num) ? Math.round(Math.min(num, cryptoBalance) * currentCryptoPrice * 100) / 100 : 0);
  };
  // handles amount input change ====================================================================================================
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    lastChangedRef.current = 'input';
    const val = persianToEnglish(e.target.value).replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    let num = val === '' ? 0 : Number(val);
    if (num > TomanBalance) num = TomanBalance
    const rounded = Math.round(num * 100) / 100;
    setAmountValue(rounded);
    setCountInputStr(String(Math.round((rounded / currentCryptoPrice) * 100) / 100));
  };
  // handles filling the count input by 'all balance' button ====================================================================================================
  const handleFillCount = () => {
    const roundedCount = isSell ? cryptoBalance : Math.round((TomanBalance / currentCryptoPrice) * 100) / 100;
    setCountInputStr(String(roundedCount));
    setAmountValue(Math.round((roundedCount * currentCryptoPrice) * 100) / 100);
    setSelectedPercent(100)
  };
  // handles filling the amount input by 'all balance' button ====================================================================================================
  const handleFillAmount = () => {
    const roundedAmount = isSell ? Math.round(cryptoBalance * currentCryptoPrice * 100) / 100 : TomanBalance;
    setAmountValue(roundedAmount);
    setCountInputStr(String(Math.round((roundedAmount / currentCryptoPrice) * 100) / 100));
    setSelectedPercent(100)
  };
  // syncing the percent bar and inputs together ====================================================================================================
  useEffect(() => {
    if (lastChangedRef.current === 'input') {
      // User typed → update percent only
      let percent;
      if (isSell) {
        percent = cryptoBalance ? (Number(countInputStr) / cryptoBalance) * 100 : 0;
      } else {
        percent = TomanBalance ? (Number(amountValue) / TomanBalance) * 100 : 0;
      }
      const roundedPercent = Math.round(percent * 100) / 100;

      if (roundedPercent !== selectedPercent) {
        setSelectedPercent(roundedPercent);
      }
    } else if (lastChangedRef.current === 'percent') {
      // Percent changed → update inputs
      if (selectedPercent === 0) return;

      if (isSell) {
        const newCount = Math.round((cryptoBalance * selectedPercent / 100) * 100) / 100;
        const newAmount = Math.round(newCount * currentCryptoPrice * 100) / 100;
        if (Number(countInputStr) !== newCount) setCountInputStr(String(newCount));
        if ((amountValue || 0) !== newAmount) setAmountValue(newAmount);
      } else {
        const newAmount = Math.round((TomanBalance * selectedPercent / 100) * 100) / 100;
        const newCount = Math.round(newAmount / currentCryptoPrice * 100) / 100;
        if ((amountValue || 0) !== newAmount) setAmountValue(newAmount);
        if (Number(countInputStr) !== newCount) setCountInputStr(String(newCount));
      }
    }

    // Reset the change source after applying
    lastChangedRef.current = null;

  }, [countInputStr, amountValue, selectedPercent, isSell, cryptoBalance, TomanBalance, currentCryptoPrice]);

  return (
    <div className="w-full h-full lg:bg-bg4 rounded-2xl lg:px-8 lg:py-12 flex flex-col gap-10 justify-between">
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
          <div className="flex items-center gap-1 text-text5 text-xs lg:text-sm font-medium">موجودی شما :<span className="text-text4 font-normal" dir="ltr">{'12.003 MNS'}</span></div>
          <span className="text-sm font-normal text-text4">
            {isSell ? 'قیمت فروش' : 'قیمت خرید'} :{formatPersianDigits(currentCryptoPrice) + 'تومان'}
          </span>
        </div>
      </div>
      {/* choose coin count ======================================================================================================= */}
      <div className="flex flex-col gap-5 lg:gap-3">
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
        <div className={`justify-end text-sm font-normal ${isSell ? 'flex' : 'hidden'}`}>
          <span onClick={handleFillCount} className="text-primary text-sm font-normal cursor-pointer">تمام موجودی</span>
        </div>
      </div>
      {/* choose total amount ======================================================================================================= */}
      <div className="flex flex-col gap-5 lg:gap-3">
        <div onClick={() => amountInputRef.current?.focus()} className="border border-text2 rounded-lg px-4 py-2.5 lg:py-3.5 cursor-text relative">
          <div className="absolute px-1 bg-backgroundMain lg:bg-bg4 border-none -top-4 right-4 text-text7 text-sm font-normal">{isSell ? 'مقدار دریافتی' : 'مقدار پرداختی'}</div>
          <div className="w-full flex items-center justify-between">
            <input
              ref={amountInputRef}
              type="text"
              inputMode="decimal"
              className="bg-transparent appearance-none outline-none text-text4 text-right w-10/12"
              value={amountValue === "" ? formatPersianDigits(0) : formatPersianDigits(amountValue)}
              onChange={handleAmountChange}
              dir="ltr"
            />
            <span className="text-sm font-normal text-text7">تومان</span>
          </div>
        </div>
        <div className={`items-center justify-between text-sm font-normal ${isSell ? 'hidden' : 'flex'}`}>
          <div className="flex items-center gap-1">
            <span className="icon-wrapper w-5 h-5 text-text5"><IconBorderedPlus /></span>
            <span className="text-xs lg:text-sm font-medium text-text5">موجودی شما : </span>
            {formatPersianDigits(TomanBalance)} تومان
          </div>
          <span onClick={handleFillAmount} className="text-primary text-sm font-normal cursor-pointer">تمام موجودی</span>
        </div>
      </div>
      {/* percent bar ======================================================================================================= */}
      <PercentBar selectedPercent={selectedPercent} setSelectedPercent={setSelectedPercent} lastChangedRef={lastChangedRef} />
      <button className="rounded-lg bg-primary py-2 lg:py-2.5 text-white text-base font-medium lg:text-lg lg:font-bold">{isSell ? "ثبت فروش" : "ثبت خرید"}</button>
    </div>
  )
}

export default BuyAndSell
