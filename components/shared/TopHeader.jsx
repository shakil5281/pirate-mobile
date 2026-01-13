export default function TopHeader({ children }) {
  return (
    <div className="relative bg-gradient-to-b from-[#FFFBEB] via-[#FEF3C7] to-white pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}

