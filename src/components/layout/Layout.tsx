// src/components/layout/RootLayout.tsx
import { Outlet } from "react-router-dom";
import { Header } from "../Header";
import { Footer } from "../Footer";
import useScrollToTop from "../../hooks/useScrollToTop";
import { AuthRedirectHandler } from "../auth/AuthRedirectHandler";

export function RootLayout() {
  useScrollToTop();
  return (
    <div className="min-h-screen flex flex-col">
      <AuthRedirectHandler/>
      <Header />
      <main className="grow">
        <Outlet /> 
      </main>
      <Footer />
    </div>
  );
}
