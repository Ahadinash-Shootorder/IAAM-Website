import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <div className="relative w-full bg-white py-4">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center gap-2 text-sm text-[#003399]">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-2">
            {item.href ? (
              <Link href={item.href} className="hover:text-[#1e40af] transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-[#111]">{item.label}</span>
            )}
            {i < items.length - 1 && <span className="text-[#999]">›</span>}
          </span>
        ))}
      </div>
    </div>
  );
}
