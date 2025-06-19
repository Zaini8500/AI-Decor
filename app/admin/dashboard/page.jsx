"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalDesigns: 0,
    totalPayments: 0,
    recentPayments: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (!isAdmin) {
      router.push("/admin/login");
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/reports");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Error loading admin report:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    router.push("/admin/login");
  };

  if (loading) return <p className="text-center mt-10">Loading reports...</p>;

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-700">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="text-sm bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white p-6 shadow rounded border">
          <h2 className="text-lg font-semibold text-gray-700">Total Designs Generated</h2>
          <p className="text-4xl font-bold text-purple-600 mt-2">{stats.totalDesigns}</p>
        </div>

        <div className="bg-white p-6 shadow rounded border">
          <h2 className="text-lg font-semibold text-gray-700">Total Payments</h2>
          <p className="text-4xl font-bold text-purple-600 mt-2">${stats.totalPayments}</p>
        </div>
      </div>

      <div className="bg-white p-6 shadow rounded border">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Payments</h2>

        {stats.recentPayments?.length > 0 ? (
          <ul className="space-y-2">
            {stats.recentPayments.map((p, i) => (
              <li key={i} className="text-sm text-gray-700 border-b pb-2">
                <span className="font-medium">{p.email}</span> paid{" "}
                <span className="text-purple-600 font-bold">${p.amount}</span> on{" "}
                {new Date(p.date).toLocaleString()}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No recent payments found.</p>
        )}
      </div>
    </div>
  );
}
