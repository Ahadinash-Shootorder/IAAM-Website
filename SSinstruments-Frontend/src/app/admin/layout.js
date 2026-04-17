"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, LogOut, Home, FileText, ShoppingBag, Layers, Users, Settings, MessageSquare, List, BookOpen } from "lucide-react";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === "/admin/login";

  const menuItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: Home },
    { label: "Home Sections", href: "/admin/home-sections", icon: FileText },
    { label: "Pages", href: "/admin/pages", icon: FileText },
    { label: "Blogs", href: "/admin/blogs", icon: BookOpen },
    { label: "Products", href: "/admin/products", icon: ShoppingBag },
    { label: "Categories", href: "/admin/categories", icon: Layers },
    { label: "Menu Manager", href: "/admin/menu", icon: List },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Contact Messages", href: "/admin/contact", icon: MessageSquare },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    router.push("/admin/login");
  };

  const isActive = (href) => pathname === href || pathname.startsWith(href + "/");

  if (isLoginPage) {
    return <div>{children}</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-[#0A2A3A] text-white transition-all duration-300 fixed h-screen overflow-y-auto z-40`}
      >
        <div className="p-6 flex items-center justify-between border-b border-gray-700">
          {sidebarOpen && <h1 className="text-xl font-bold">SS Admin</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-gray-700 rounded"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <main className={`flex-1 ${sidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300 overflow-auto`}>
        <header className="bg-white shadow sticky top-0 z-30">
          <div className="px-6 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              View Site
            </Link>
          </div>
        </header>

        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
