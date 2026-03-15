// src/routes/public.routes.ts
import type { RouteObject } from "react-router-dom";
import { Home } from "../pages/Home";
import { About } from "../pages/About";
// import { Contact } from "../pages/Contact";
// import { FAQ } from "../pages/FAQ";
import { TestBackend } from "../pages/TestBackend";
import { ContactPage } from "../pages/Contact";
import { FAQPage } from "../pages/FAQ";
import TestPage from "../pages/test/TestPage";

export const publicRoutes: RouteObject[] = [
  {
    index: true,
    element: <Home />,
  },
  {
    path: "about",
    element: <About />,
  },
  {
    path: "contact",
    element: <ContactPage />,
  },
  {
    path: "faq",
    element: <FAQPage />,
  },
  {
    path: "test-backend",
    element: <TestBackend />,
  },
  {
    path: "test",
    element: <TestPage />,
  },
];
