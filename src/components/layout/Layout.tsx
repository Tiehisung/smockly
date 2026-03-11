// src/components/layout/RootLayout.tsx
import { Outlet } from "react-router-dom";
import { Header } from "../Header";
import { Footer } from "../Footer";


export function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="grow">
        <Outlet /> {/* This is where your page content will render */}
      </main>
      <Footer />
    </div>
  );
}
