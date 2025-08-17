import React, { useState } from "react";

export type Slide = {
  title: string;
  subtitle: string;
  price: number | string;
  changePct: number;
  iconSrc: React.ReactNode;
};

interface BoxConfig {
  header: string;
  headerIcon: React.ReactNode;
  bgShape?: string;
  slides: Slide[];
}

interface Props {
  boxes: BoxConfig[];
}

const clamp = (value: number, length: number) => {
  if (length <= 0) return 0;
  return ((value % length) + length) % length;
};

const SyncSlider: React.FC<Props> = ({ boxes }) => {
  const [index, setIndex] = useState(0);
  const slidesCount = boxes[0].slides.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2  xl:grid-cols-4 gap-4">
      {boxes.map((box, bIndex) => (
        <div
          key={bIndex}
          className="relative overflow-hidden rounded-2xl bg-backgroundCard shadow px-4 pt-4 pb-5"
        >
          {/* Header */}
          <div className="flex flex-row-reverse items-center gap-1 mb-4 pr-2 ">
            <div className="h-5 w-5">{box.headerIcon}</div>
            <span className="flex items-center translate-y-[4px] text-sm font-medium text-gray-600">
              {box.header}
            </span>
          </div>

          {/* Slider (all slides inside) */}
          <div className="overflow-hidden">
            <div
              className="flex transition-all duration-300"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {box.slides.map((slide, i) => (
                <div key={i} className="min-w-full">
                  {/* Title / Subtitle — Icon */}
                  <div className="flex items-center justify-between mb-4 pt-4.5">
                    <div className="h-12 w-12 rounded-full overflow-hidden flex items-center justify-center">
                      {slide.iconSrc}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-800">{slide.title}</div>
                      <div className="text-xs uppercase text-gray-400">{slide.subtitle}</div>
                    </div>
                  </div>

                  {/* Price / Percent */}
                  <div className="flex items-center justify-between text-sm font-medium mt-1 mb-5">
                    <span
                      className={
                        slide.changePct >= 0
                          ? "text-emerald-600"
                          : "text-rose-600"
                      }
                    >
                      {slide.changePct >= 0 ? "+" : ""}
                      {slide.changePct.toFixed(2)}%
                    </span>
                    <div className="text-gray-900 tabular-nums">
                      {slide.price}{" "}
                      <span className="text-gray-500">تومان</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-1">
            {Array.from({ length: slidesCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-2 w-2 rounded-full transition-all ${
                  i === clamp(index, slidesCount) ? "  w-5 bg-blue-500" : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Background circle */}
          {box.bgShape && (
            <img
              src={box.bgShape}
              className="pointer-events-none absolute -bottom-2 -right-2 w-40 opacity-30"
              aria-hidden
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default SyncSlider;
