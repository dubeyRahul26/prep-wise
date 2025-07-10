// src/components/Layout.tsx
import React from "react";
import Navbar from "./Navbar";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="pt-20 px-4 min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
        <div className="container mx-auto py-6">{children}</div>
      </main>
    </>
  );
};

export default Layout;
