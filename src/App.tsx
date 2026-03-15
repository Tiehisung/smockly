import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { Toaster } from "sonner";

function App() {
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
