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

  let startX = 0;

  const handleStart = (clientX: number) => {
    startX = clientX;
  };

  const handleEnd = (clientX: number) => {
    const diff = clientX - startX;
    if (Math.abs(diff) > 20) {
      if (diff > 0) {
       
        setIndex((prev) => clamp(prev - 1, slidesCount));
      } else {
        
        setIndex((prev) => clamp(prev + 1, slidesCount));
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {boxes.map((box, bIndex) => (
        <div
          key={bIndex}
          className="relative overflow-hidden rounded-2xl bg-gray27 shadow px-4 pt-4 pb-5 border border-gray21"
        >
         
          <div className="flex flex-row-reverse items-center gap-1 mb-4 pr-2 ">
            <div className="h-5 w-5">{box.headerIcon}</div>
            <span className="flex items-center translate-y-[4px]  text-black1 font-[20px] font-medium">
              {box.header}
            </span>
          </div>

          <div
            className="overflow-hidden"
            onMouseDown={(e) => handleStart(e.clientX)}
            onMouseUp={(e) => handleEnd(e.clientX)}
            onTouchStart={(e) => handleStart(e.touches[0].clientX)}
            onTouchEnd={(e) => handleEnd(e.changedTouches[0].clientX)}
          >
            <div
              className="flex transition-all duration-300"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {box.slides.map((slide, i) => (
                <div key={i} className="min-w-full">
             
                  <div className="flex items-center justify-between mb-4 pt-2">
                    <div className="h-12 w-12 rounded-full overflow-hidden flex items-center justify-center">
                      {slide.iconSrc}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-black1">
                        {slide.title}
                      </div>
                      <div className="text-xs uppercase text-gray3 pt-1 text-[12px]">
                        {slide.subtitle}
                      </div>
                    </div>
                  </div>

              
                  <div className="flex items-center justify-between text-sm font-medium mt-1 mb-5">
                    <span
                      className={
                        slide.changePct >= 0 ? "text-green1" : "text-rose-600"
                      }
                    >
                      {slide.changePct >= 0 ? "+" : ""}
                      {slide.changePct.toFixed(2)}%
                    </span>
                    <div className="text-black1 tabular-nums">
                        <span className="text-gray3 pl-2">تومان</span>
                      {slide.price}
                    
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-1">
            {Array.from({ length: slidesCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-2 w-2 rounded-full transition-all ${
                  i === clamp(index, slidesCount)
                    ? "w-5 bg-blue-500"
                    : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </div>

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
