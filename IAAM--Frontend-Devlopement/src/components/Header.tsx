'use client';

import { useState, useRef, useEffect, useMemo } from "react";

import { Search, Menu, ChevronRight, ArrowLeft } from "lucide-react";
import LazyImage from "@/components/common/LazyImage";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { dropdownData } from "@/lib/dropdownData";
import MobileAuth from "@/app/_shared/MobileAuth";

export default function Header({ isShrunk = false, mobileMenuOpen, setMobileMenuOpen }: {
  isShrunk?: boolean;
  mobileMenuOpen?: boolean;
  setMobileMenuOpen?: (open: boolean) => void;
}) {

  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [pageContent, setPageContent] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { title: "Membership", slug: "membership" },
    { title: "Meetings & Events", slug: "meetings-events" },
    { title: "Innovation & Sustainability", slug: "innovation-sustainability" },
    { title: "Journal & Proceedings", slug: "journals-proceedings" },
    { title: "Awards & Recognitions", slug: "awards-recognitions" },
    { title: "Discover IAAM", slug: "discover-iaam" },
  ];

  const quickLinks = [
    { label: "The Association", href: "/the-association" },
    { label: "Society", href: "/society" },
    { label: "Councils", href: "/councils" },
    { label: "Join IAAM", href: "/join-iaam" },
    { label: "Programs", href: "/programs" },
    { label: "Charters", href: "/charters" },
    { label: "Careers", href: "/careers" },
    { label: "Contact Us", href: "/contact-us" },
  ];

  const extractPageContent = () => {
    if (typeof window === 'undefined') return [];

    const content: string[] = [];

    // Extract headings
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(heading => {
      const text = heading.textContent?.trim();
      if (text && text.length > 3) content.push(text);
    });

    // Extract paragraphs and other text content
    const paragraphs = document.querySelectorAll('p, span, div, li');
    paragraphs.forEach(element => {
      const text = element.textContent?.trim();
      if (text && text.length > 10 && text.length < 100) {
        // Split into words and filter meaningful ones
        const words = text.split(/\s+/).filter(word =>
          word.length > 3 && !/^[0-9]+$/.test(word) && !/^[^a-zA-Z]*$/.test(word)
        );
        content.push(...words.slice(0, 3)); // Take first 3 meaningful words
      }
    });

    // Remove duplicates and limit
    return [...new Set(content)].slice(0, 20);
  };

  const getEnhancedSuggestions = () => {
    const navigationSuggestions = [
      ...navItems.map(item => ({ label: item.title, href: `/${item.slug}`, category: 'Navigation' })),
      ...quickLinks.map(link => ({ label: link.label, href: link.href, category: 'Quick Links' })),
      // Add all dropdown data using navItems slugs for dynamic URL generation
      ...navItems.map((navItem, navIndex) => {
        const dropdownItem = dropdownData[navIndex];
        if (!dropdownItem) return [];
        
        return [
          { label: dropdownItem.title, href: `/${navItem.slug}`, category: dropdownItem.title },
          // Add card CTA link
          ...(dropdownItem.card.cta ? [{
            label: dropdownItem.card.cta,
            href: navItem.slug === 'membership' && (dropdownItem.card.ctaUrl.includes('join') || dropdownItem.card.ctaUrl.includes('membership') || dropdownItem.card.ctaUrl.includes('fellow') || dropdownItem.card.ctaUrl.includes('lifetime') || dropdownItem.card.ctaUrl.includes('renew') || dropdownItem.card.ctaUrl.includes('faqs')) ? 
              `/${navItem.slug}${dropdownItem.card.ctaUrl}` : dropdownItem.card.ctaUrl,
            category: dropdownItem.title
          }] : []),
          // Add outline CTA link
          ...(dropdownItem.outlineCta && dropdownItem.outlineCtaUrl ? [{
            label: dropdownItem.outlineCta,
            href: navItem.slug === 'membership' && (dropdownItem.outlineCtaUrl.includes('join') || dropdownItem.outlineCtaUrl.includes('membership') || dropdownItem.outlineCtaUrl.includes('fellow') || dropdownItem.outlineCtaUrl.includes('lifetime') || dropdownItem.outlineCtaUrl.includes('renew') || dropdownItem.outlineCtaUrl.includes('faqs')) ? 
              `/${navItem.slug}${dropdownItem.outlineCtaUrl}` : dropdownItem.outlineCtaUrl,
            category: dropdownItem.title
          }] : []),
          ...dropdownItem.columns.flat().flatMap(section => [
            ...(section.header ? [{ 
              label: section.header, 
              href: section.headerUrl ? (section.headerUrl.startsWith('/') ? 
                (navItem.slug === 'membership' && (section.headerUrl.includes('join') || section.headerUrl.includes('membership') || section.headerUrl.includes('fellow') || section.headerUrl.includes('lifetime') || section.headerUrl.includes('renew') || section.headerUrl.includes('faqs')) ? 
                  `/${navItem.slug}${section.headerUrl}` : section.headerUrl) : 
                section.headerUrl) : `/${navItem.slug}`, 
              category: dropdownItem.title 
            }] : []),
            ...(section.links || []).map(link => ({
              label: link.text, 
              href: navItem.slug === 'membership' && (link.url.includes('join') || link.url.includes('membership') || link.url.includes('fellow') || link.url.includes('lifetime') || link.url.includes('renew') || link.url.includes('faqs')) ? 
                `/${navItem.slug}${link.url}` : link.url, 
              category: dropdownItem.title
            }))
          ]),
          // Add rightLinks if they exist
          ...(dropdownItem.rightLinks ? dropdownItem.rightLinks.flatMap(rightLink => [
            ...(rightLink.header ? [{
              label: rightLink.header,
              href: rightLink.headerUrl ? (rightLink.headerUrl.startsWith('/') ? 
                (navItem.slug === 'membership' && (rightLink.headerUrl.includes('join') || rightLink.headerUrl.includes('membership') || rightLink.headerUrl.includes('fellow') || rightLink.headerUrl.includes('lifetime') || rightLink.headerUrl.includes('renew') || rightLink.headerUrl.includes('faqs')) ? 
                  `/${navItem.slug}${rightLink.headerUrl}` : rightLink.headerUrl) : 
                rightLink.headerUrl) : `/${navItem.slug}`,
              category: dropdownItem.title
            }] : [])
          ]) : [])
        ];
      }).flat()
    ];

    // Add page content suggestions
    const pageContentSuggestions = pageContent
      .filter(word => word.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 3)
      .map(word => ({
        label: word,
        href: pathname, // Stay on current page
        category: 'Page Content'
      }));

    return [...navigationSuggestions, ...pageContentSuggestions];
  };

  const allSuggestions = getEnhancedSuggestions();

  const filteredSuggestions = allSuggestions.filter(suggestion =>
    suggestion.label.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(value.length >= 3);
  };

  const handleSuggestionClick = (href: string) => {
    setSearchQuery('');
    setShowSuggestions(false);
    if (href && href !== '#') {
      router.push(href);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // For now, navigate to first suggestion or search page
      if (filteredSuggestions.length > 0) {
        router.push(filteredSuggestions[0].href);
      } else {
        router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      }
      setSearchQuery('');
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(min-width: 1024px)');

    const handleChange = () => {
      if (mql.matches) {
        setMobileMenuOpen?.(false);
      }
    };

    handleChange();
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, [setMobileMenuOpen]);

  // Extract page content when pathname changes (DOM content changes on navigation)
  const pageContentMemo = useMemo(() => {
    return extractPageContent();
  }, []); // extractPageContent() doesn't use pathname, so no dependency needed

  useEffect(() => {
    setPageContent(pageContentMemo);
  }, [pageContentMemo]);

  const closeDrawer = () => {
    setMobileMenuOpen?.(false);
  };

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="w-full bg-white border-b border-gray-200 relative z-50">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-[30px]">
          <div
            className={`flex items-center justify-between transition-all duration-200 ${
              isShrunk ? 'py-1.5' : 'py-4'
            }`}
          >

            {/* LEFT - Logo + Title */}
            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
              <div
                className={`flex-shrink-0 transition-all duration-200 ${
                  isShrunk ? 'w-[46px] sm:w-[56px] lg:w-[64px]' : 'w-[80px] sm:w-[110px] lg:w-[140px]'
                }`}
              >
                <Link href="/">
                <LazyImage
                  src="/image.png"
                  alt="IAAM Logo"
                  width={120}
                  height={120}
                  className="w-full h-auto object-contain"
                  priority
                />
              </Link>
              </div>

              <div className="min-w-0">
                <h1
                  className={
                    `font-bold text-[#1e40af] leading-tight transition-all duration-200 ` +
                    (isShrunk
                      ? 'text-[13px] sm:text-[15px] lg:text-[18px] xl:text-[20px]'
                      : 'text-[16px] sm:text-[20px] lg:text-[26px] xl:text-[30px]')
                  }
                >
                  International Association <br className="hidden sm:block" />
                  of Advanced Materials
                </h1>

                <p
                  className={
                    `text-gray-600 transition-all duration-200 ` +
                    (isShrunk ? 'hidden lg:block lg:text-[11px] mt-0' : 'text-[9px] lg:text-[16px] mt-1')
                  }
                >
                  Integrating materials knowledge to achieve a sustainable planet.
                </p>
              </div>
            </div>

            {/* ================= DESKTOP RIGHT SIDE ================= */}
            <div className={`hidden lg:flex items-center ml-4 transition-all duration-200 ${isShrunk ? 'gap-3' : 'gap-4'}`}>
              <Link
                href="/web-talks"
                className={
                  `border border-[#1e40af] text-[#1e40af] rounded hover:bg-[#1e40af] hover:text-white transition ` +
                  (isShrunk ? 'px-3 py-1 text-[13px]' : 'px-4 py-1.5')
                }
              >
                Web Talks
              </Link>

              <div className="relative" ref={searchRef}>
                <form onSubmit={handleSearchSubmit}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search..."
                    className={
                      `border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-[#1e40af] ` +
                      (isShrunk ? 'w-[170px] xl:w-[190px] px-3 py-1.5 pr-9' : 'w-[200px] xl:w-[220px] px-3 py-2 pr-10')
                    }
                  />
                  <button type="submit">
                    <Search
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                      size={isShrunk ? 14 : 16}
                    />
                  </button>
                </form>

                {/* Autocomplete Dropdown */}
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto mt-1">
                    {filteredSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion.href)}
                        className="w-full text-left px-4 py-2 text-gray-900 hover:bg-gray-100 hover:text-[#1e40af] focus:bg-gray-100 focus:text-[#1e40af] focus:outline-none transition-colors text-sm border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{suggestion.label}</span>
                          {suggestion.category && (
                            <span className="text-xs text-gray-500 mt-1">{suggestion.category}</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* ================= MOBILE MENU BUTTON ================= */}
            <button
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen?.(true)}
              aria-label="Open Menu"
            >
              <Menu size={28} color="#1e40af" />
            </button>

          </div>
        </div>
      </header>

      {/* ================= OVERLAY ================= */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 lg:hidden ${
          mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={closeDrawer}
      />

      {/* ================= MOBILE DRAWER ================= */}
      <div
        className={`fixed top-0 right-0 h-full mb-3 w-[90%] max-w-[420px] bg-[#f3f4f6] z-50 transform transition-transform duration-300 lg:hidden flex flex-col ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >

        {/* Mobile Auth Section - Top */}
        <MobileAuth onCloseDrawer={closeDrawer} />

        {/* Scrollable Navigation Content */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          {/* Drawer Header with Back */}
          <div className="flex items-center justify-between px-4 py-4 bg-white border-b border-gray-300">
            <button
              onClick={closeDrawer}
              className="flex items-center gap-2 text-gray-700"
            >
              <ArrowLeft size={20} className="text-gray-800" />
              <span className="text-sm">Back</span>
            </button>
          </div>

          {/* MAIN NAV */}
          <div>
            {navItems.map((item) => (
              <Link
                key={item.title}
                href={`/${item.slug}`}
                onClick={closeDrawer}
                className="w-full flex justify-between items-center px-5 py-4 bg-[#e5e7eb] border-b border-gray-400 text-gray-800 text-[15px] font-medium"
              >
                {item.title}
                <ChevronRight size={18} />
              </Link>
            ))}
          </div>

          {/* QUICK LINKS SECTION */}
          <div className="mt-6">
            <div className="px-5 py-3 text-gray-800 font-semibold text-[15px]">
              Quick Links
            </div>

            {quickLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={closeDrawer}
                className="w-full flex justify-between items-center px-5 py-4 bg-[#e5e7eb] border-b border-gray-400 text-gray-800 text-[14px]"
              >
                {link.label}
                <ChevronRight size={16} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}


























































// 'use client'

// import { useEffect, useState } from 'react'
// import LazyImage from "@/components/common/LazyImage";
// import Link from 'next/link'
// import { Home, Menu, X, Search } from 'lucide-react'
// import { getMainMenu, getTopMenu } from '@/lib/api'
// import MainDropdown from './MainDropdown'

// export default function Header() {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
//   const [mainNav, setMainNav] = useState<any[]>([])
//   const [topLeft, setTopLeft] = useState<any[]>([])
//   const [topRight, setTopRight] = useState<any[]>([])

//   useEffect(() => {
//     getMainMenu().then((res) => {
//       setMainNav(res || [])
//     })

//     getTopMenu().then((res) => {
//       setTopLeft(res.left || [])
//       setTopRight(res.right || [])
//     })
//   }, [])

//   return (
//     <header className="w-full sticky top-0 z-[999] bg-white">

//       {/* ================= TOP BAR ================= */}
//       <div className="hidden md:block bg-gray-300 text-[hsl(197,63%,22%)] h-8 font-semibold text-xs">
//         <div className="container mx-auto px-4 py-2 flex justify-between">

//           {/* LEFT */}
//           <div className="flex items-center gap-1">
//             <Link href="/" className="px-2">
//               <Home className="h-3 w-3 text-black" />
//             </Link>

//             {topLeft.map((l, i) => (
//               <span key={`top-left-${l.label}-${i}`} className="flex items-center">
//                 {i > 0 && <span className="mx-1 opacity-50">|</span>}
//                 <Link href={l.href} className="px-2 hover:underline">
//                   {l.label}
//                 </Link>
//               </span>
//             ))}
//           </div>

//           {/* RIGHT */}
//           <div className="flex items-center gap-2">
//             {topRight.map((l, i) => (
//               <span key={`top-right-${l.label}-${i}`} className="flex items-center">
//                 {i > 0 && <span className="mx-1 opacity-50">|</span>}
//                 <Link href={l.href} className="px-2 hover:underline">
//                   {l.label}
//                 </Link>
//               </span>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ================= LOGO + SEARCH ================= */}
//       <div className="border-b bg-white">
//         <div className="container mx-auto px-4 py-4 flex items-center justify-between">

//           {/* LOGO */}
//           <Link href="/">
//             <LazyImage
//               src="/iaam-logo.png"
//               alt="IAAM"
//               width={180}
//               height={60}
//               className="h-12 w-auto"
//               priority
//             />
//           </Link>

//           {/* RIGHT */}
//           <div className="flex items-center gap-3">

//             {/* WEB TALKS */}
//             <Link
//               href="#"
//               className="hidden md:inline-flex border border-black px-4 py-2 text-sm rounded hover:bg-gray-100 text-black"
//             >
//               Web Talks
//             </Link>

//             {/* SEARCH */}
//             <div className="hidden md:block relative">
//               <input
//                 type="text"
//                 placeholder="Search"
//                 className="w-72 px-4 py-2 pr-10 border rounded text-sm text-gray-400"
//               />
//               <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
//             </div>

//             {/* MOBILE BUTTON */}
//             <button
//               className="md:hidden p-2 text-black"
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             >
//               {mobileMenuOpen ? <X /> : <Menu />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ================= MAIN NAV ================= */}
//       <nav className="hidden md:block bg-[hsl(197,63%,22%)] text-white text-sm font-bold">
//         <div className="container mx-auto px-4 flex justify-center gap-4 h-[44px] items-center">
//           {mainNav.map((section, index) => (
//             <MainDropdown
//               key={section.Identifier || `nav-${index}`}
//               section={section}
//             />
//           ))}
//         </div>
//       </nav>

//       {/* ================= MOBILE MENU ================= */}
//       {mobileMenuOpen && (
//         <div className="md:hidden absolute left-0 right-0 top-full text-black bg-white shadow-lg z-[999]">
//           <div className="container mx-auto px-4 py-4 space-y-4">

//             {/* SEARCH */}
//             <input
//               type="text"
//               placeholder="Search"
//               className="w-full px-4 py-2 border rounded text-sm"
//             />

//             {/* MAIN NAV */}
//             <div className="space-y-2">
//               {mainNav.map((s, index) => (
//                 <Link
//                   key={s.Identifier || `mobile-nav-${index}`}
//                   href={s.slug ? `/${s.slug}` : '#'}
//                   className="block px-3 py-2 font-semibold hover:bg-gray-100"
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   {s.Title}
//                 </Link>
//               ))}
//             </div>

//             {/* TOP LINKS */}
//             <div className="border-t pt-3 space-y-2 text-sm">
//               {[...topLeft, ...topRight].map((l, i) => (
//                 <Link
//                   key={`mobile-${l.label}-${i}`}
//                   href={l.href}
//                   className="block px-3 py-1"
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   {l.label}
//                 </Link>
//               ))}
//             </div>

//           </div>
//         </div>
//       )}
//     </header>
//   )
// }