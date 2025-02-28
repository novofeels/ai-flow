"use client";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Topbar />
      <Sidebar />
      <div style={{ marginLeft: "4rem", position: "relative", zIndex: 0 }}>
        {children}
      </div>
    </>
  );
}