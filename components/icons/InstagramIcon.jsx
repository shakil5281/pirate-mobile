export default function InstagramIcon({ size = 48, className, ...props }) {
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
        d="M14.5 24C14.5 19.5217 14.5 17.2825 15.8912 15.8912C17.2825 14.5 19.5217 14.5 24 14.5C28.4783 14.5 30.7175 14.5 32.1088 15.8912C33.5 17.2825 33.5 19.5217 33.5 24C33.5 28.4783 33.5 30.7175 32.1088 32.1088C30.7175 33.5 28.4783 33.5 24 33.5C19.5217 33.5 17.2825 33.5 15.8912 32.1088C14.5 30.7175 14.5 28.4783 14.5 24Z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <path
        d="M28.5 24C28.5 26.4853 26.4853 28.5 24 28.5C21.5147 28.5 19.5 26.4853 19.5 24C19.5 21.5147 21.5147 19.5 24 19.5C26.4853 19.5 28.5 21.5147 28.5 24Z"
        stroke="currentColor"
        strokeWidth={1.5}
      />
      <path
        d="M29.5078 18.5L29.4988 18.5"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

