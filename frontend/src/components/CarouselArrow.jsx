/* eslint-disable no-unused-vars */
export function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <button
      className={
        " cursor-pointer !flex !items-center !justify-center !bg-primary !rounded-full !w-12 !h-12 !shadow-lg absolute top-1/2 z-10 transition-all duration-200"
      }
      style={{
        ...style,
        right: "-30px", // قرّب السهم أكثر للسلايدر (أو جرب right: 10)
        transform: "translateY(-50%)",
      }}
      onClick={onClick}
      aria-label="التالي"
    >
      <svg width={28} height={28} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="12" fill="none" />
        <path
          d="M8 5l8 7-8 7"
          stroke="#fff"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
export function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <button
      className={
        "cursor-pointer !flex !items-center !justify-center !bg-primary !rounded-full !w-12 !h-12 !shadow-lg absolute top-1/2 z-10 transition-all duration-200"
      }
      style={{
        ...style,
        left: "-30px",
        transform: "translateY(-50%)",
      }}
      onClick={onClick}
      aria-label="السابق"
    >
      <svg width={28} height={28} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="12" fill="none" />
        <path
          d="M16 5l-8 7 8 7"
          stroke="#fff"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
