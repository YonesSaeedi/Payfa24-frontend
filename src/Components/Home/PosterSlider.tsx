import { useEffect, useState, useRef } from "react";
import { apiRequest } from "../../utils/apiClient";
import { toast } from "react-toastify";
import { Link } from "react-router";

type Slide = {
  locale?: string[];
  sort?: string;
  link?: string;
  imageUrl?: string;
  [key: string]: unknown;
};

const PosterSlider = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch slides data ======================================================================================================
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        setIsLoading(true);
        const response = await apiRequest({ url: "/api/dashboard/web" });
        setSlides(response?.banner || []);
      } catch (err: any) {
        toast.error(
          err?.response?.data?.msg ||
            err?.response?.data?.message ||
            "دریافت اطلاعات بنر با مشکل مواجه شد."
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchSlides();
  }, []);

  // Auto slide logic =======================================================================================================
  useEffect(() => {
    if (!slides.length) return;

    const startAutoSlide = () => {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
      }, 4000);
    };

    startAutoSlide();
    return () => intervalRef.current && clearInterval(intervalRef.current);
  }, [slides]);

  // Manual slide click ======================================================================================================
  const handleSlideChange = (index: number) => {
    setCurrentIndex(index);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
      }, 4000);
    }
  };

  // Rendering ===============================================================================================================
  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="loader border-t-4 border-blue-500 rounded-full w-10 h-10 animate-spin"></div>
      </div>
    );
  }

  if (!slides.length) return null;

  const currentSlide = slides[currentIndex];

  return (
    <div className="relative w-full max-w-5xl mx-auto pb-8 lg:pb-0 overflow-hidden rounded-2xl">
      <Link
        to={currentSlide?.link || "#"}
        className="block w-full h-full bg-[#0B0D17] rounded-2xl overflow-hidden"
      >
        <img
          src={currentSlide?.imageUrl || ""}
          alt={`Slide ${currentIndex + 1}`}
          className="w-full h-auto object-cover"
        />
      </Link>

      {/* Buttons ========================================================================================================== */}
      <div className="absolute lg:-bottom-5 left-1/2 -translate-x-1/2 bg-white1 rounded-full px-4 py-2 flex justify-center text-center gap-2 bottom-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === currentIndex ? "w-6 bg-blue-500" : "w-2.5 bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default PosterSlider;
