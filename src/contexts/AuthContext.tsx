import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../configs/firebase";
import { useAppDispatch } from "../store/hooks";
import { setUserProfile, clearUserData } from "../store/slices/userSlice";
import { authService } from "../services/auth.service";
import {
  mapFirebaseUser,
  type IAuthContext,
  type IAuthUser,
  type ISignInData,
  type ISignUpData,
} from "../types/auth.types";

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<IAuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useAppDispatch(); // Redux dispatchc

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      const mappedUser = mapFirebaseUser(firebaseUser);
      setUser(mappedUser);

      // Sync with Redux
      if (mappedUser) {
        // User logged in - save to Redux
        dispatch(
          setUserProfile({
            uid: mappedUser.uid,
            email: mappedUser.email || "",
            displayName: mappedUser.displayName || undefined,
            photoURL: mappedUser.photoURL || undefined,
          }),
        );
      } else {
        // User logged out - clear Redux
        dispatch(clearUserData());
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [dispatch]);

  // Redux will be updated by onAuthStateChanged

  const signUp = async (data: ISignUpData) => {
    return await authService.signUp(data);
  };

  const signIn = async (data: ISignInData) => {
   return await authService.signIn(data);
  };

  const logout = async () => {
    await authService.logout();
  };

  const value: IAuthContext = {
    user,
    isLoading: loading,
    signUp,
    signIn,
    logout,
    dbUser: null,
    error: null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): IAuthContext => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  //   console.log(context.loading)
  return context;
};
