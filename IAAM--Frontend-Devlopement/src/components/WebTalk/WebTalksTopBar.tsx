'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getTopMenu } from '@/lib/api';
import { useEffect, useState } from 'react';
import LazyImage from '@/components/common/LazyImage';

interface MenuItem {
  label: string;
  href: string;
}

const LEFT_NAV: MenuItem[] = [
  { label: 'The Association', href: 'the-association' },
  { label: 'Society', href: 'society' },
  { label: 'Councils', href: 'councils' },
  { label: 'Join IAAM', href: 'join-iaam' },
];

export default function WebTalksTopBar() {
      const [topLeft, setTopLeft] = useState<MenuItem[]>(LEFT_NAV);


      useEffect(() => {
          getTopMenu()
            .then((res) => {
              if (res?.left?.length) setTopLeft(res.left);
            })
            .catch(() => {});
        }, []);
  return (
    <div className="hidden md:block w-full bg-[#F6F6F6]">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-[30px]">
        <div className="flex items-center justify-between h-[34px] text-[13px]">

          <div className="flex items-center flex-wrap">
            <Link href="/" className="mr-3">
              <LazyImage
                src="/Frame 2.svg"
                alt="Home"
                width={18}
                height={18}
                priority
              />
            </Link>

            {topLeft.map((link, i) => (
              <span key={i} className="flex items-center">
                {i > 0 && <span className="mx-2 text-gray-400">|</span>}
                <Link
                  href={link.href}
                  className="font-semibold text-iaam-text-dark hover:text-iaam-primary transition"
                >
                  {link.label}
                </Link>
              </span>
            ))}
          </div>

          {/* Right — WebTalks specific */}
          <div className="flex items-center gap-7">
            <Link
              href="/"
              className="flex items-center gap-[6px] font-semibold text-[14px] text-[rgba(30,30,30,0.93)] hover:text-[#1C3E9C] transition whitespace-nowrap"
            >
              <ArrowLeft size={13} strokeWidth={2} />
              Back to IAAM
            </Link>
            <Link
              href="#"
              className="font-semibold text-[14px] text-[rgba(30,30,30,0.93)] hover:text-[#1C3E9C] transition whitespace-nowrap"
            >
              Login IAAM Portal
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}