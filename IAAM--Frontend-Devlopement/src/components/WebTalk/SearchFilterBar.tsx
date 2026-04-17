'use client';

import { ChevronDown, Search } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface VideoItem {
  id: number;
  Title: string;
  VideoCategory: string;
  HostName: string;
}

export default function SearchFilterBar({
  search,
  setSearch,
  filterCategory,
  setFilterCategory,
  filterSort,
  setFilterSort,
  isShrunk = false,
}: {
  search: string;
  setSearch: (v: string) => void;
  filterCategory: string;
  setFilterCategory: (v: string) => void;
  filterSort: string;
  setFilterSort: (v: string) => void;
  isShrunk?: boolean;
}) {

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<VideoItem[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  /* ─────────────────────────────────────────────
     FETCH CATEGORY OPTIONS FROM STRAPI
  ───────────────────────────────────────────── */

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/video-filters");
        const json = await res.json();
        if (json.categories) {
          setCategories(json.categories);
        }
      } catch (error) {
        setCategories(["All"]);
      }
    }

    fetchCategories();
  }, []);

  /* ─────────────────────────────────────────────
     FETCH SEARCH SUGGESTIONS
  ───────────────────────────────────────────── */

  useEffect(() => {
    if (search.trim().length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search-videos?q=${encodeURIComponent(search)}`);
        const json = await res.json();
        setSuggestions(json.data || []);
        setShowSuggestions(true);
      } catch (error) {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 400);

  }, [search]);

  /* ─────────────────────────────────────────────
     CLOSE SUGGESTIONS ON OUTSIDE CLICK
  ───────────────────────────────────────────── */

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSuggestionClick = (title: string) => {
    setSearch(title);
    setShowSuggestions(false);
  };

  return (
    <div className="w-full bg-[#F6F6F6] border-b border-[#E7E7E7] fixed z-20">
      <div className={`max-w-[1440px] mx-auto px-4 lg:px-[30px] transition-all duration-200 ${isShrunk ? 'py-[8px]' : 'py-[14px]'}`}>
        <div className="flex flex-col sm:flex-row items-stretch gap-3">

          {/* SEARCH INPUT */}
          <div
            ref={searchRef}
            className={`relative flex items-center gap-3 bg-white rounded-[5px] border border-[#D1CFCF] flex-1 min-w-0 transition-all duration-200 ${
              isShrunk ? 'px-[10px] py-[6px] h-[40px]' : 'px-[11px] py-[8px] h-[52px]'
            }`}
          >
            <Search size={isShrunk ? 18 : 20} className="text-[#696969] flex-shrink-0" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className={`flex-1 bg-transparent outline-none text-[#1E1E1E] placeholder-[#696969] min-w-0 ${
                isShrunk ? 'text-[15px]' : 'text-[18px]'
              }`}
            />

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto mt-1">
                {suggestions.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSuggestionClick(item.Title)}
                    className="w-full text-left px-4 py-2 text-gray-900 hover:bg-gray-100 hover:text-[#1e40af] transition-colors text-sm"
                  >
                    {item.Title}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* FILTER DROPDOWNS */}
          <div className="flex items-center gap-3 flex-shrink-0">

            {/* CATEGORY FILTER */}
            <div className={`relative flex items-center bg-white rounded-[5px] border border-[#D1CFCF] w-[48%] sm:w-[160px] lg:w-[203px] transition-all duration-200 ${
              isShrunk ? 'px-[10px] h-[40px]' : 'px-[11px] h-[52px]'
            }`}>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className={`w-full bg-transparent outline-none text-[#1E1E1E] appearance-none cursor-pointer pr-5 ${
                  isShrunk ? 'text-[14px]' : 'text-[16px]'
                }`}
              >
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>

              <ChevronDown size={isShrunk ? 12 : 14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#696969] pointer-events-none" />
            </div>

            {/* SORT FILTER (can also be dynamic later) */}
            <div className={`relative flex items-center bg-white rounded-[5px] border border-[#D1CFCF] w-[48%] sm:w-[160px] lg:w-[203px] transition-all duration-200 ${
              isShrunk ? 'px-[10px] h-[40px]' : 'px-[11px] h-[52px]'
            }`}>
              <select
                value={filterSort}
                onChange={(e) => setFilterSort(e.target.value)}
                className={`w-full bg-transparent outline-none text-[#1E1E1E] appearance-none cursor-pointer pr-5 ${
                  isShrunk ? 'text-[14px]' : 'text-[16px]'
                }`}
              >
                <option>Newest</option>
                <option>Oldest</option>
                <option>A–Z</option>
              </select>

              <ChevronDown size={isShrunk ? 12 : 14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#696969] pointer-events-none" />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}