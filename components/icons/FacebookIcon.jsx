export default function FacebookIcon({ size = 48, className, ...props }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.1818 22.3333C17.2041 22.3333 17 22.5252 17 23.4444V25.1111C17 26.0304 17.2041 26.2222 18.1818 26.2222H20.5455V32.8889C20.5455 33.8081 20.7495 34 21.7273 34H24.0909C25.0687 34 25.2727 33.8081 25.2727 32.8889V26.2222H27.9267C28.6683 26.2222 28.8594 26.0867 29.0631 25.4164L29.5696 23.7497C29.9185 22.6014 29.7035 22.3333 28.4332 22.3333H25.2727V19.5556C25.2727 18.9419 25.8018 18.4444 26.4545 18.4444H29.8182C30.7959 18.4444 31 18.2526 31 17.3333V15.1111C31 14.1919 30.7959 14 29.8182 14H26.4545C23.191 14 20.5455 16.4873 20.5455 19.5556V22.3333H18.1818Z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </svg>
  );
}

