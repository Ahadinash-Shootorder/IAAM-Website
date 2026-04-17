"use client";

import Image from "next/image";
import { Search, Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pages, setPages] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // language switch function with google translate
  useEffect(() => {
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        { pageLanguage: "en", includedLanguages: "sv,en" },
        "google_translate_element",
      );
    };

    const script = document.createElement("script");
    script.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;

    document.body.appendChild(script);
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuRes, catRes, pageRes] = await Promise.all([
          fetch("/api/menu"),
          fetch("/api/categories"),
          fetch("/api/pages"),
        ]);

        const menuData = await menuRes.json();
        const catData = await catRes.json();
        const pageData = await pageRes.json();

        setMenuItems(Array.isArray(menuData) ? menuData : []);
        setCategories(Array.isArray(catData) ? catData : []);
        setPages(Array.isArray(pageData) ? pageData : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const getMenuLink = (item) => {
    if (item.type === "category") {
      const category = categories.find((c) => c.id === item.target);
      return `/categories/${category?.slug || item.target}`;
    } else if (item.type === "page") {
      const page = pages.find((p) => p.id === item.target);
      const slug = page?.slug || item.target;
      return slug === "homepage" ? "/" : `/${slug}`;
    } else if (item.type === "link") {
      return item.target;
    }
    return item.target;
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(
        `/api/products/search?q=${encodeURIComponent(query)}`,
      );
      const data = await res.json();
      setSearchResults(Array.isArray(data) ? data.slice(0, 5) : []);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };
  // language switch fucntion
  const changeLanguage = (lang) => {
    const select = document.querySelector(".goog-te-combo");
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event("change"));
    }
  };

  return (
    <header className="w-full bg-gradient-to-r from-[#081C4A] to-[#0A2A6B] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-[80px] flex items-center justify-between">
        {/* Left: Logo only */}
        <div className="relative h-[42px] w-[150px]">
          <Link href="/">
            <Image
              src="/logo.png" // replace with your logo
              alt="Scandinavian Scientific Instruments"
              fill
              className="object-contain"
              priority
            />
          </Link>
        </div>

        {/* Center: Navigation */}
        <nav className="hidden lg:flex items-center gap-10 text-white text-sm font-medium">
          {menuItems.map((item) => (
            <div key={item.id} className="relative group">
              <Link
                href={getMenuLink(item)}
                className="flex items-center gap-1 hover:text-gray-300 transition"
              >
                {item.label}

                {item.children?.length > 0 && (
                  <ChevronDown size={16} className="mt-[2px]" />
                )}
              </Link>

              {/* DROPDOWN */}
              {item.children?.length > 0 && (
                <div className="absolute left-0 top-full bg-white  text-gray-900 rounded-lg shadow-lg min-w-[200px] py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  {item.children.map((child) => (
                    <Link
                      key={child.id}
                      href={getMenuLink(child)}
                      className="block px-4 py-2 hover:bg-gray-100 text-sm"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right: Search + Language */}
        <div className="hidden lg:flex items-center gap-6 text-white relative">
          <div className="relative">
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                className="bg-transparent text-white placeholder-gray-400 outline-none w-40 text-sm"
              />
              <Search size={18} className="text-gray-400" />
            </div>

            {searchOpen &&
              (searchQuery.length >= 2 || searchResults.length > 0) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white text-gray-900 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                  {isSearching ? (
                    <div className="p-4 text-center text-gray-500">
                      Searching...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <>
                      {searchResults.map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.id}`}
                          onClick={() => {
                            setSearchOpen(false);
                            setSearchQuery("");
                          }}
                          className="flex items-center gap-3 p-3 hover:bg-gray-100 border-b last:border-b-0 transition"
                        >
                          {/* <p className="font-medium text-sm">
                              {product.title}
                            </p> */}

                          <div className="relative w-16 h-16 flex-shrink-0">
                            <Image
                              src={product.featureImage}
                              alt={product.title}
                              fill
                              className="object-contain"
                            />
                          </div>

                          {/* RIGHT - Text */}
                          <div className="flex flex-col">
                            <p className="font-medium text-sm text-gray-900">
                              {product.title}
                            </p>

                            <p className="text-xs text-gray-500">
                              {product.category}
                            </p>
                          </div>

                          {/* <p className="text-sm font-semibold text-gray-700">
                            ${product.price}
                          </p> */}
                        </Link>
                      ))}
                    </>
                  ) : (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No products found
                    </div>
                  )}
                </div>
              )}

            {searchOpen && (
              <div
                className="fixed inset-0 z-40"
                onClick={() => setSearchOpen(false)}
              />
            )}
          </div>

          {/* language switch UI */}
          <div id="google_translate_element" style={{ display: "none" }}></div>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span
              className="cursor-pointer"
              onClick={() => changeLanguage("sv")}
            >
              SWE
            </span>

            <span className="opacity-50">|</span>

            <span
              className="cursor-pointer"
              onClick={() => changeLanguage("en")}
            >
              EN
            </span>
          </div>
        </div>

        {/* Mobile: Hamburger */}
        <button onClick={() => setOpen(true)} className="lg:hidden text-white">
          <Menu size={28} />
        </button>
      </div>

      {/* ================= MOBILE MENU ================= */}

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Slide Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-[80%] max-w-sm bg-[#081C4A] z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-[80px] border-b border-white/10">
          <span className="text-white font-semibold text-lg">Menu</span>
          <button onClick={() => setOpen(false)} className="text-white">
            <X size={26} />
          </button>
        </div>

        {/* Links */}
        <nav className="flex flex-col px-6 py-6 space-y-6 text-white text-base font-medium">
          {menuItems.length > 0 ? (
            menuItems.map((item) => (
              <Link
                key={item.id}
                href={getMenuLink(item)}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))
          ) : (
            <>
              <Link href="#" onClick={() => setOpen(false)}>
                Microscopes
              </Link>
              <Link href="#" onClick={() => setOpen(false)}>
                Lab Instruments
              </Link>
              <Link href="#" onClick={() => setOpen(false)}>
                Applications
              </Link>
              <Link href="#" onClick={() => setOpen(false)}>
                Service & Support
              </Link>
              <Link href="/about" onClick={() => setOpen(false)}>
                Company
              </Link>
              <Link href="/contact" onClick={() => setOpen(false)}>
                Contact us
              </Link>
            </>
          )}

          {/* Divider */}
          <div className="h-px bg-white/10 my-4"></div>

          {/* Search */}
          <div className="flex items-center gap-3">
            <Search size={18} />
            <span>Search</span>
          </div>

          {/* Language */}
          <div className="flex items-center gap-3 text-sm font-semibold">
            <span>SWE</span>
            <span className="opacity-50">|</span>
            <span>EN</span>
          </div>
        </nav>
      </div>
    </header>
  );
}
