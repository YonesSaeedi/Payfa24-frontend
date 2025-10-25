import { useEffect, useState, useRef } from "react";
import { apiRequest } from "../../utils/apiClient";
import { toast } from "react-toastify";
import { Link } from "react-router";

type Slide = {
  locale?: string[];
  sort?: string;
  link?: string;
  imgUrl?: string;
  [key: string]: unknown;
};

const PosterSlider = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const draggedRef = useRef(false);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        setIsLoading(true);
        const response = await apiRequest({ url: "/api/dashboard/web" });
        const banners = response?.banner?.banner;
        if (Array.isArray(banners)) setSlides(banners);
        else setSlides([]);
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

 
  useEffect(() => {
    if (!slides.length) return;
    intervalRef.current = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [slides]);

  const handleSlideChange = (index: number) => {
    setCurrentIndex(index);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = window.setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
      }, 4000);
    }
  };

  if (isLoading) return (
    <div className="w-full h-60 lg:h-80 rounded-lg skeleton-bg"></div>
  );

  if (!slides.length) return null;

  const handleDragStart = (clientX: number) => {
    isDraggingRef.current = true;
    startXRef.current = clientX;
    draggedRef.current = false;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleDragMove = (clientX: number) => {
    if (!isDraggingRef.current) return;
    const delta = clientX - startXRef.current;
    if (Math.abs(delta) > 5) draggedRef.current = true;
    setDragOffset(delta);
  };

  const handleDragEnd = () => {
    if (!isDraggingRef.current) return;
    const threshold = 50;
    if (dragOffset > threshold) {
      setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    } else if (dragOffset < -threshold) {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }
    setDragOffset(0);
    isDraggingRef.current = false;

    intervalRef.current = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto pb-8 lg:pb-0 overflow-hidden rounded-2xl">
      <div
        className="flex select-none"
        style={{
          transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`,
          transition: isDraggingRef.current ? "none" : "transform 0.7s ease-in-out",
        }}
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => handleDragMove(e.clientX)}
        onMouseUp={handleDragEnd}
        onMouseLeave={() => isDraggingRef.current && handleDragEnd()}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
      >
        {slides.map((slide, index) => (
          <Link
            key={index}
            to={slide.link || "#"}
            draggable={false}
            onClick={(e) => draggedRef.current && e.preventDefault()}
            className="flex-shrink-0 w-full lg:h-80 h-60 bg-[#0B0D17] overflow-hidden rounded-2xl"
          >
            {slide.imgUrl && (
              <img
                src={`https://cdn.payfa24.org/banner/${slide.imgUrl}`}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
                draggable={false}
              />
            )}
          </Link>
        ))}
      </div>
      <div className="absolute bottom-3 lg:-bottom-5 left-1/2 -translate-x-1/2 bg-white1 rounded-full px-4 py-1 flex flex-col gap-2">
        <div className="flex items-center gap-1 justify-center">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleSlideChange(index)}
              className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex ? "w-5 bg-blue-500" : "w-2 bg-gray-400"
                }`}
            />
          ))}
        </div>
        <div className="h-2"></div>
      </div>

    </div>
  );
};

export default PosterSlider;
