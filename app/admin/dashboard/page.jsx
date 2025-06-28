"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function AdminDashboard() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [type, setType] = useState("design");
  const [filters, setFilters] = useState({
    email: "",
    date: "",
    roomType: "",
    style: "",
  });
  const [data, setData] = useState([]);

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin !== "true") {
      router.push("/admin/login");
    } else {
      setCheckingAuth(false);
    }
  }, [router]);

  const fetchReports = async () => {
    const query = new URLSearchParams({
      type,
      email: filters.email,
      date: filters.date,
      roomType: filters.roomType,
      style: filters.style,
    }).toString();

    const res = await fetch(`/api/admin/reports?${query}`);
    const result = await res.json();

    if (result.success) {
      setData(result.result);
      toast.success("Data loaded");
    } else {
      toast.error("Failed to fetch report data");
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    if (type === "design") {
      autoTable(doc, {
        head: [["Email", "Room Type", "Style", "Prompt", "Date"]],
        body: data.map((item) => [
          item.userEmail,
          item.roomType || (item.prompt?.match(/(Kitchen|Bedroom|Living Room|Office|Bathroom)/i)?.[0] ?? "N/A"),
          item.style,
          item.prompt || "—",
          new Date(item.createdAt).toLocaleString(),
        ]),
      });
      doc.save("AI-Design-Report.pdf");
    } else {
      autoTable(doc, {
        head: [["Email", "Amount", "Credits", "Date"]],
        body: data.map((item) => [
          item.email,
          item.amount,
          item.credits,
          new Date(item.createdAt).toLocaleString(),
        ]),
      });
      doc.save("AI-Payment-Report.pdf");
    }
  };

  if (checkingAuth) {
    return <p className="text-center mt-10">Verifying admin access...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">Admin Report Dashboard</h1>

      <div className="bg-gray-100 p-6 rounded-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="design">Design Reports</option>
            <option value="payment">Payment Reports</option>
          </select>

          <input
            type="email"
            placeholder="User Email"
            value={filters.email}
            onChange={(e) => setFilters({ ...filters, email: e.target.value })}
            className="border rounded px-3 py-2"
          />

          <input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            className="border rounded px-3 py-2"
          />

          {type === "design" && (
            <>
              <select
                value={filters.roomType}
                onChange={(e) => setFilters({ ...filters, roomType: e.target.value })}
                className="border rounded px-3 py-2"
              >
                <option value="">All Room Types</option>
                <option value="Living Room">Living Room</option>
                <option value="Bedroom">Bedroom</option>
                <option value="Kitchen">Kitchen</option>
                <option value="Office">Office</option>
                <option value="Bathroom">Bathroom</option>
              </select>

              <select
                value={filters.style}
                onChange={(e) => setFilters({ ...filters, style: e.target.value })}
                className="border rounded px-3 py-2"
              >
                <option value="">All Styles</option>
                <option value="Modern">Modern</option>
                <option value="Rustic">Rustic</option>
                <option value="Bohemian">Bohemian</option>
                <option value="Minimalist">Minimalist</option>
                <option value="Traditional">Traditional</option>
              </select>
            </>
          )}
        </div>

        <div className="mt-4 flex gap-4">
          <Button onClick={fetchReports} className="bg-purple-600 text-white hover:bg-black">
            Search Reports
          </Button>
          <Button onClick={generatePDF} className="bg-green-600 text-white hover:bg-black">
            Export PDF
          </Button>
        </div>
      </div>

      {data.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border mt-6">
            <thead>
              <tr className="bg-purple-100">
                {type === "design" ? (
                  <>
                    <th className="p-2">Email</th>
                    <th className="p-2">Room Type</th>
                    <th className="p-2">Style</th>
                    <th className="p-2">Prompt</th>
                    <th className="p-2">Date</th>
                  </>
                ) : (
                  <>
                    <th className="p-2">Email</th>
                    <th className="p-2">Amount</th>
                    <th className="p-2">Credits</th>
                    <th className="p-2">Date</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-2">{item.email || item.userEmail}</td>
                  {type === "design" ? (
                    <>
                      <td className="p-2">
                        {item.roomType || (item.prompt?.match(/(Kitchen|Bedroom|Living Room|Office|Bathroom)/i)?.[0] ?? "N/A")}
                      </td>
                      <td className="p-2">{item.style}</td>
                      <td className="p-2">{item.prompt || "—"}</td>
                      <td className="p-2">{new Date(item.createdAt).toLocaleString()}</td>
                    </>
                  ) : (
                    <>
                      <td className="p-2">{item.amount}</td>
                      <td className="p-2">{item.credits}</td>
                      <td className="p-2">{new Date(item.createdAt).toLocaleString()}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
