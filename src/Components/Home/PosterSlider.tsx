import React, { useState } from "react";

type Slide = {
  title: string;
  subtitle: string;
  buttonText: string;
  imageSrc: string;
};

type PosterSliderProps = {
  slides: Slide[];
};

const PosterSlider: React.FC<PosterSliderProps> = ({ slides }) => {
  const [current, setCurrent] = useState(0);


  let startX = 0;

  const handleStart = (clientX: number) => {
    startX = clientX;
  };

  const handleEnd = (clientX: number) => {
    const diff = clientX - startX;
    if (Math.abs(diff) > 30) {
      if (diff > 0) {
       
        setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
      } else {

        setCurrent((prev) => (prev + 1) % slides.length);
      }
    }
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto pb-8 lg:pb-0">
    
      <div
        className="flex items-center bg-[#0B0D17] rounded-2xl overflow-hidden h-full"
        onMouseDown={(e) => handleStart(e.clientX)}
        onMouseUp={(e) => handleEnd(e.clientX)}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        onTouchEnd={(e) => handleEnd(e.changedTouches[0].clientX)}
      >
     
        <div className="w-1/2 h-full bg-[#0B0D17] pl-2">
          <img
            src={slides[current].imageSrc}
            alt={slides[current].title}
            className="max-w-full max-h-full object-contain"
          />
        </div>

        <div className="w-1/2 p-8 flex flex-col justify-center text-center items-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {slides[current].title}
          </h2>
          <p className="text-gray-300 mb-6">{slides[current].subtitle}</p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg w-fit transition">
            {slides[current].buttonText}
          </button>
        </div>
      </div>

   
      <div className="absolute lg:-bottom-5 left-1/2 -translate-x-1/2 bg-white1 rounded-full px-4 py-2 flex justify-center text-center gap-2 bottom-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === current ? "w-6 bg-blue-500" : "w-2.5 bg-gray34"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default PosterSlider;
