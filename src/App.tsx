// App.tsx
import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { Toaster } from "sonner";
import { useEffect } from "react";
import { authService } from "./services/auth.service";
import { store } from "./store/store";
import { setUser } from "./store/slices/auth.slice";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./configs/firebase";
 
import { Debugger } from "./components/Debug";
import { useAppSelector } from "./store/hooks";

function App() {
  const { user, loading } = useAppSelector(s=>s.auth);
  console.log("user", user, loading);

  useEffect(() => {
 

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        console.log("🔥 Auth state changed:", firebaseUser.email);

        // Get enriched user with custom claims
        const enrichedUser = await authService.getCurrentUser();
        console.log("✨ Enriched user:", enrichedUser);

        // Update Redux store
        store.dispatch(setUser(enrichedUser));
      } else {
        console.log("❌ Not logged in");
        store.dispatch(setUser(null));
      }
    });

    return () => unsubscribe();
  }, []); // Remove empty dependency array - run once on mount

  return (
    <>
   
      <Debugger />
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
