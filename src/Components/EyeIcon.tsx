import React from "react";

// props `isVisible` برای تعیین اینکه چشم باز است یا بسته
export default function EyeIcon({ onClick, isVisible }) {
  return (
    <div
      className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center cursor-pointer"
      onClick={onClick}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        stroke="var(--text-gray)" 
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {isVisible ? (
          // SVG برای حالت چشم باز
          <>
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </>
        ) : (
          // SVG برای حالت چشم بسته
          <>
            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
            <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.75 9.75 0 0 0 5.39-1.61" />
            <line x1="2" x2="22" y1="2" y2="22" />
          </>
        )}
      </svg>
    </div>
  );
}
