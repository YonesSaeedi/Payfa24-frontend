export default function IconArrow({ direction = "right" }) {
  const rotate = direction === "left" ? "180" : "0";

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      style={{ transform: `rotate(${rotate}deg)` }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.5752 3.39961L7.14186 8.83294C6.50019 9.47461 6.50019 10.5246 7.14186 11.1663L12.5752 16.5996"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
