
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

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {/* اسلاید */}
      <div className="flex items-center bg-[#0B0D17] rounded-2xl overflow-hidden h-[300px]">
        {/* بخش تصویر */}
        <div className="w-1/2 bg-[#0B0D17]">
          <img
            src={slides[current].imageSrc}
            alt={slides[current].title}
            className="w-full h-بعمم object-cover"
          />
        </div>

        {/* بخش متن */}
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

     
      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-white rounded-full px-4 py-2  flex justify-center text-center gap-2 هفثئس-ثدی">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === current ? "w-6 bg-blue-500" : "w-2.5 bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default PosterSlider;
