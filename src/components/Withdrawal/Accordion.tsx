import { useState, useRef, ReactNode } from "react";
import IconChervDown from "../../assets/icons/Withdrawal/IconChervDown";
import IconChervUp from "../../assets/icons/Withdrawal/IconChervUp";

interface AccordionProps {
  title: string;
  children: ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="border border-gray12 rounded-lg lg:text-sm text-xs bg-gry44">
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-4 py-3 text-right text-gray-800"
      >
        
        {isOpen ? (
          <div  className="w-4 h-4 text-gray5">
            <IconChervUp />
          </div>
         
        ) : (
          <div  className="w-4 h-4 text-gray5">
             <IconChervDown />
          </div>
        )}
        <span className="font-medium text-black1">{title}</span>
      </button>

      {/* Content */}
      <div
        ref={contentRef}
        className={`transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-60" : "max-h-0"
        }`}
      >
        <div dir="rtl" className="p-4 text-sm text-gray-700 leading-6 overflow-y-auto max-h-56">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Accordion;
