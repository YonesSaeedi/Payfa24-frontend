import React, { useEffect, useRef, useState } from "react";
import { CryptoItem } from "../../types/crypto";
import { formatPersianDigits } from "../../utils/formatPersianDigits";
import { formatPersianNumber } from "../../utils/formatPersianNumber";

export type Slide = CryptoItem;
interface BoxConfig {
  header: string;
  headerIcon: React.ReactNode;
  slides: Slide[];
}
interface SyncSliderProps {
  boxes: BoxConfig[];
  isLoading: boolean
}
const clamp = (value: number, length: number) => {
  if (length <= 0) return 0;
  return ((value % length) + length) % length;
};

const SyncSlider = ({ boxes, isLoading }: SyncSliderProps) => {
  const [index, setIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const slidesCount = boxes[0]?.slides?.length || 0;
  // helper to start (or restart) auto sliding ==================================================================================================
  const startAutoSlide = () => {
    clearInterval(intervalRef.current!)
    if (slidesCount > 1) {
      intervalRef.current = setInterval(() => {
        setIndex(prev => clamp(prev + 1, slidesCount))
      }, 4000);
    }
  }
  // start auto slide when slides are ready =====================================================================================================
  useEffect(() => {
    startAutoSlide()
    return () => clearInterval(intervalRef.current!)
  }, [slidesCount])
  // restart timer after manual sliding ==========================================================================================================
  const resetAutoSlide = () => {
    clearInterval(intervalRef.current!)
    startAutoSlide()
  }
  // ===========================================================================================================================================
  let startX = 0;
  const handleStart = (clientX: number) => {
    startX = clientX;
  };
  const handleEnd = (clientX: number) => {
    const diff = clientX - startX;
    if (Math.abs(diff) > 20) {
      if (diff > 0) {
        setIndex(prev => clamp(prev - 1, slidesCount));
      } else {
        setIndex(prev => clamp(prev + 1, slidesCount));
      }
      resetAutoSlide()
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 select-none">
      {boxes.map((box, bIndex) =>
        <div key={bIndex} className="relative overflow-hidden rounded-2xl bg-gray27 shadow px-4 pt-4 pb-5 border border-gray21 ">
          <div className="flex flex-row-reverse items-center gap-1 mb-4 pr-2">
            <div className="h-5 w-5">{box?.headerIcon}</div>
            <span className="flex items-center translate-y-1 text-black1 text-lg font-medium">{box?.header}</span>
          </div>
          <div className="relative">
            {/* === background icon (unclipped) === */}
            <div className="pointer-events-none absolute -bottom-14 -right-14 opacity-10 z-0 w-[185px] h-[185px] rounded-full overflow-hidden">
              {!isLoading && (
                box?.slides[index]?.isFont ?
                  <i className={`cf cf-${box?.slides[index]?.symbol?.toLowerCase()}`} style={{ color: box?.slides[index]?.color, fontSize: '185px' }}></i>
                  :
                  <img src={`https://api.payfa24.org/images/currency/${box?.slides[index]?.icon}`} alt={box?.slides[index]?.symbol} className="object-cover w-full h-full" />
              )}
            </div>
            {/* === slides (clipped for movement) === */}
            <div
              className="overflow-hidden relative z-10 "
              onMouseDown={(e) => handleStart(e.clientX)}
              onMouseUp={(e) => handleEnd(e.clientX)}
              onTouchStart={(e) => handleStart(e.touches[0].clientX)}
              onTouchEnd={(e) => handleEnd(e.changedTouches[0].clientX)}
            >
              <div className="flex transition-all duration-300" style={{ transform: `translateX(-${index * 100}%)` }} >
                {isLoading ?
                  <div className="min-w-full">
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4 pt-2">
                        <div className="h-14 w-14 rounded-full overflow-hidden flex items-center justify-center skeleton-bg"></div>
                        <div dir="rtl" className="">
                          <div className="skeleton-bg w-24 h-6 rounded"></div>
                          <div className="mt-2 skeleton-bg w-1/2 h-4 rounded"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-1 mb-5">
                        <div className='skeleton-bg h-4 w-12 rounded'>
                        </div>
                        <div className="flex items-center">
                          <span className="ml-2 skeleton-bg h-4 w-8 rounded"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                  :
                  box.slides.map((slide, i) =>
                    <div key={i} className="min-w-full relative">
                      {/* Foreground content only */}
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4 pt-2">
                          <div className="h-14 w-14 rounded-full overflow-hidden flex items-center justify-center">
                            {slide?.isFont ?
                              <i className={`cf cf-${slide?.symbol.toLowerCase()}`} style={{ color: slide?.color, fontSize: '54px' }}></i>
                              :
                              <img src={`https://api.payfa24.org/images/currency/${slide?.icon}`} alt={slide?.symbol} className="object-contain" />
                            }
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-black1">{slide?.locale?.fa?.name}</div>
                            <div className="text-xs uppercase text-gray3 pt-1">{slide?.symbol}</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm font-medium mt-1 mb-5">
                          <span className={Number(slide?.priceChangePercent) >= 0 ? "text-green1" : "text-rose-600"}>
                            {Number(slide?.priceChangePercent) >= 0 ? "+" : ""}
                            {formatPersianDigits(Number(slide?.priceChangePercent).toFixed(2))}%
                          </span>
                          <div className="text-black1 tabular-nums flex items-center gap-1">
                            <span className="text-gray3 pl-2">تومان</span>
                            <span className="text-base lg:text-xl font-medium">{formatPersianNumber(parseFloat(slide?.priceBuy ?? '0'))}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            </div>
            <div className="flex justify-center gap-1">
              {Array.from({ length: slidesCount }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setIndex(i)
                    resetAutoSlide()
                  }}
                  className={`h-2 w-2 rounded-full transition-all ${i === clamp(index, slidesCount) ? "w-5 bg-blue-500" : "w-2 bg-gray-300"}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SyncSlider;
