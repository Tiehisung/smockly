import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { Toaster } from "sonner";
import { useAppSelector } from "./store/hooks";
import { useEffect } from "react";
import { initAuthListener } from "./services/auth.listeners";

function App() {
  const { user, loading } = useAppSelector((s) => s.auth);
  console.log("user", user, loading);

  useEffect(() => {
    const unsubscribe = initAuthListener();
    return () => unsubscribe();
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        richColors
        closeButton
        expand={true}
        duration={3000}
        theme="light"
      />
    </>
  );
}

export default App;
