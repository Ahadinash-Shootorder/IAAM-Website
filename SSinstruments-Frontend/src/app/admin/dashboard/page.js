"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("admin_user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productsRes, usersRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/users"),
        ]);

        const products = await productsRes.json();
        const users = await usersRes.json();

        const totalRevenue = products.reduce(
          (sum, p) => sum + (p.price || 0),
          0,
        );

        setStats({
          totalProducts: products.length,
          totalUsers: users.length,
          totalOrders: 0,
          totalRevenue: totalRevenue.toFixed(2),
        });

        setRecentUsers(users.slice(-5).reverse());
        setRecentProducts(products.slice(-5).reverse());
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-semibold">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            {user && <p className="text-sm text-gray-600 mt-1">Welcome, {user.name} ({user.role})</p>}
          </div>
          <div className="flex gap-4">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              View Site
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Total Products
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalProducts}
                </p>
              </div>
              <div className="text-4xl">📦</div>
            </div>
            <Link
              href="/admin/products"
              className="text-blue-600 hover:text-blue-800 text-sm mt-4 inline-block"
            >
              Manage Products →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalUsers}
                </p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
            <Link
              href="/admin/users"
              className="text-blue-600 hover:text-blue-800 text-sm mt-4 inline-block"
            >
              Manage Users →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Total Orders
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalOrders}
                </p>
              </div>
              <div className="text-4xl">📋</div>
            </div>
            <p className="text-gray-500 text-sm mt-4">Coming soon</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Total Revenue
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ${stats.totalRevenue}
                </p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
            <p className="text-gray-500 text-sm mt-4">From products</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Recent Users</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Role
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan="3"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No users yet
                      </td>
                    </tr>
                  ) : (
                    recentUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {user.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              user.role === "admin"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Recent Products
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentProducts.length === 0 ? (
                    <tr>
                      <td
                        colSpan="3"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No products yet
                      </td>
                    </tr>
                  ) : (
                    recentProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {product.title}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {product.category}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          ${product.price}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-4 gap-6">
          <Link
            href="/admin/blogs"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              📝 Blogs
            </h3>
            <p className="text-gray-600">Create and manage blog posts</p>
          </Link>
          <Link
            href="/admin/pages"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              📄 Pages
            </h3>
            <p className="text-gray-600">Manage site pages content</p>
          </Link>
          <Link
            href="/admin/categories"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              🏷️ Categories
            </h3>
            <p className="text-gray-600">Manage product categories</p>
          </Link>
          <Link
            href="/admin/settings"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              ⚙️ Settings
            </h3>
            <p className="text-gray-600">Configure general site settings</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
