import React, { RefObject, useRef } from "react";
import { formatPersianDigits } from "../../utils/formatPersianDigits";

type PercentBarProps = {
  selectedPercent: number;
  setSelectedPercent: (percent: number) => void;
  lastChangedRef: RefObject<"percent" | "input" | null>;
}

const PercentBar = ({ setSelectedPercent, selectedPercent, lastChangedRef }: PercentBarProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const handleMove = (clientX: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    let percent = ((clientX - rect.left) / rect.width) * 100;
    percent = Math.min(100, Math.max(0, percent));
    lastChangedRef.current = 'percent'
    setSelectedPercent(percent);
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

  return (
    <div className="w-full" dir="ltr">
      {/* Slider Track */}
      <div ref={trackRef} className="relative h-0.5 bg-grey2 cursor-pointer touch-none" onPointerDown={handlePointerDown}>
        {/* Active Fill */}
        <div className="absolute top-0 -translate-y-1/4 h-1 bg-primary" style={{ width: `${selectedPercent}%` }} />
        {/* Checkpoints */}
        {[0, 25, 50, 75, 100].map((point) =>
          <div
            key={point}
            className={`absolute top-1/2 w-0.5 h-3 rounded-full -translate-x-1/2 -translate-y-1/2 ${selectedPercent >= point ? "bg-primary" : "bg-grey2"}`}
            style={{ left: `${point}%` }}
          >
            <span className={`absolute top-3.5 -translate-x-1/3 text-text4 text-xs font-normal select-none ${point === 100 ? '-left-1' : 'left-0'}`}>{formatPersianDigits(point)}%</span>
          </div>
        )}
        {/* Draggable Thumb */}
        <div
          className="absolute top-1/2 w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_11.74px_0_#5091FF] -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing"
          style={{ left: `${selectedPercent}%` }}
          onPointerDown={handlePointerDown}
        >
          {/* Value Indicator */}
          <div className="absolute left-0 -translate-x-1/3 -top-8 bg-primary text-white text-xs font-medium px-1.5 py-0.5 rounded">{Math.round(selectedPercent)}%</div>
        </div>
      </div>
    </div>
  );
};

export default PercentBar;
