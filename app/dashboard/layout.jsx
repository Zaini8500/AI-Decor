import React from "react";
import Header from "./_components/Header";

export default function DashboardLayout({ children }) {
  return (
    <div>
      <Header />
      <main className="pt-24 px-6">{children}</main>
    </div>
  );
}
