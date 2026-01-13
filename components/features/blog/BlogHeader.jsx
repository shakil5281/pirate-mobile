"use client";

import TopHeader from "@/components/shared/TopHeader";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

export default function BlogHeader({ filters, search, tag }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(search || "");

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    
    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    } else {
      params.delete("search");
    }
    
    router.push(`/blog?${params.toString()}`);
  };

  return (
    <TopHeader>
      <section className="text-center relative mx-auto max-w-5xl">
        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 leading-tight mb-4">
          The Pirate Log Travel Smart
          <br />
          <span className="text-[#22C55E]">Stay Connected</span>
        </h1>

        {/* Subtitle */}
        <p className="text-neutral-600 text-sm sm:text-base md:text-lg mb-8 px-4">
          Learn the latest stories on international travel and staying connected
        </p>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="flex justify-center max-w-3xl mx-auto mb-8 px-4"
        >
          <div className="flex items-center p-1 w-full rounded-full overflow-hidden shadow-xl bg-white border border-neutral-200">
            <input
              type="text"
              placeholder="Search an article"
              className="flex-grow px-4 py-3 text-sm sm:text-base outline-none bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search blog articles"
            />
            <button
              type="submit"
              className="bg-[#FDE047] hover:bg-[#FCD34D] text-neutral-900 px-6 py-3 font-semibold text-sm sm:text-base transition-colors duration-200 flex items-center gap-2 whitespace-nowrap rounded-full"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </form>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 px-4">
          {filters.map((filter, i) => {
            const isActive = tag === filter;
            const href = filter === "All Articles" 
              ? "/blog" 
              : `/blog?tag=${encodeURIComponent(filter)}${search ? `&search=${encodeURIComponent(search)}` : ""}`;
            
            return (
              <Link
                key={i}
                href={href}
                scroll={false}
                className="transition-all duration-200"
              >
                <span
                  className={`inline-block text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full border transition-all duration-200 cursor-pointer font-medium ${
                    isActive
                      ? "bg-[#FDE047] text-neutral-900 border-[#FDE047] shadow-sm"
                      : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50"
                  }`}
                >
                  {filter}
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </TopHeader>
  );
}
