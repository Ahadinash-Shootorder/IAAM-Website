'use client';

import { type CSSProperties, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import MainNav from "@/components/MainNav";
import SearchFilterBar from "@/components/WebTalk/SearchFilterBar";
import WebTalksTopBar from "@/components/WebTalk/WebTalksTopBar";

export default function ClientHeaderWrapper() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const [isShrunk, setIsShrunk] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const lastScrollYRef = useRef(0);

  // Conditional state for web-talks page
  const isWebTalksPage = pathname === '/web-talks' || pathname?.startsWith('/web-talks/');
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterSort, setFilterSort] = useState('Newest');

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)');

    const handleMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
      const matches = 'matches' in e ? e.matches : false;
      setIsDesktop(matches);
      if (!matches) setIsShrunk(false);
    };

    handleMediaChange(mql);
    mql.addEventListener('change', handleMediaChange);
    return () => mql.removeEventListener('change', handleMediaChange);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const lastY = lastScrollYRef.current;
      const isScrollingDown = currentY > lastY;

      // shrink when user scrolls down a bit; expand when scrolling up
      if (currentY < 8) {
        setIsShrunk(false);
      } else if (isScrollingDown && currentY > 80) {
        setIsShrunk(true);
      } else if (!isScrollingDown) {
        setIsShrunk(false);
      }

      lastScrollYRef.current = currentY;
    };

    lastScrollYRef.current = window.scrollY;
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDesktop]);

  const effectiveShrunk = isDesktop && isShrunk;

  const headerSpacerHeightClass = effectiveShrunk
    ? 'h-[110px] lg:h-[155px]'
    : 'h-[180px] lg:h-[235px]';

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className={`w-full transition-all duration-200 ${headerSpacerHeightClass}`}>
        <div
          className="absolute inset-x-0 top-0 bg-white shadow-sm"
          style={
            {
              '--mainnav-dropdown-top': effectiveShrunk ? '155px' : '235px',
            } as CSSProperties
          }
        >
          {/* {isWebTalksPage ? <WebTalksTopBar /> : <TopBar />} */}
          <TopBar />
          <Header isShrunk={effectiveShrunk} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
          <MainNav mobileMenuOpen={mobileMenuOpen} />
          {isWebTalksPage && (
            <SearchFilterBar
              search={search}
              setSearch={setSearch}
              filterCategory={filterCategory}
              setFilterCategory={setFilterCategory}
              filterSort={filterSort}
              setFilterSort={setFilterSort}
              isShrunk={effectiveShrunk}
            />
          )}
        </div>
      </div>
    </div>
  );
}
