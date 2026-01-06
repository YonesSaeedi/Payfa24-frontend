import React, { RefObject, useRef } from "react";
import { formatPersianDigits } from "../utils/formatPersianDigits";

type ReferralPercentBar = {
  selectedPercent: number;
  setSelectedPercent: (percent: number) => void;
  lastChangedRef: RefObject<"percent" | "input" | null>;
};

const ReferralPercentBar = ({
  setSelectedPercent,
  selectedPercent,
  lastChangedRef,
}: ReferralPercentBar) => {
  const trackRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    let percent = ((clientX - rect.left) / rect.width) * 100; // محدود کردن درصد به 0 تا 30

    const maxPercent = 30;
    percent = (percent * maxPercent) / 100;
    percent = Math.min(maxPercent, Math.max(0, percent)); // گرد کردن به نزدیک‌ترین مضرب ۵

    const roundedPercent = Math.round(percent / 5) * 5;

    lastChangedRef.current = "percent";
    setSelectedPercent(roundedPercent);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    handleMove(e.clientX);
    const onMove = (ev: PointerEvent) => handleMove(ev.clientX);
    const onUp = () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    };
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
  };
  // تنظیم نشانگرهای عددی با فواصل ۵ درصدی تا ۳۰
  const checkpoints = [0, 5, 10, 15, 20, 25, 30];

  return (
    <div className="w-full flex flex-col items-center" dir="ltr">
      {/* Slider Track */}
      <div
        ref={trackRef}
        className="relative w-full h-1 bg-gray21 cursor-pointer touch-none rounded-full"
        onPointerDown={handlePointerDown}
      >
        {/* Active Fill */}
        <div
          className="absolute top-0 -translate-y-1/2 h-1 bg-blue2 rounded-full transition-width"
          style={{ width: `${(selectedPercent / 30) * 100}%` }}
        />
        {/* Checkpoints */}
        {checkpoints.map((point) => (
          <React.Fragment key={point}>
            <div
              className={`absolute top-1/2 w-px h-3 -translate-x-1/2 -translate-y-1/2 ${
                selectedPercent >= point ? "bg-blue2" : "bg-gray21"
              }`}
              style={{ left: `${(point / 30) * 100}%` }}
            ></div>
            <div
              className="absolute top-5 -translate-x-1/2  text-xs  text-black0 "
              style={{ left: `${(point / 30) * 100}%` }}
            >
              {formatPersianDigits(point)}%
            </div>
          </React.Fragment>
        ))}
        {/* Draggable Thumb */}
        <div
          className="absolute top-1/2 w-4 h-4 bg-blue2  rounded-full shadow-[0_0_11.74px_0_#5091FF] -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing"
          style={{ left: `${(selectedPercent / 30) * 100}%` }}
          onPointerDown={handlePointerDown}
        >
          {/* Value Indicator */}
          <div className="absolute left-1/2 -translate-x-1/2 lg:p-1.5 p-1 -top-8 bg-blue2 text-white text-xs font-medium rounded-md   whitespace-nowrap">
            {formatPersianDigits(Math.round(selectedPercent))}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralPercentBar;
