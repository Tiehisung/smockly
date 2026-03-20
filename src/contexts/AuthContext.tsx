import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../configs/firebase";
import { useAppDispatch } from "../store/hooks";
import { authService } from "../services/auth.service";
import {
  type IAuthContext,
  type IAuthUser,
  type ISignInData,
  type ISignUpData,
} from "../types/auth.types";
import type { EUserRole, EUserStatus } from "../types/user.types";

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<IAuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useAppDispatch(); // Redux dispatch

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get the ID token result which contains custom claims
        const idTokenResult = await firebaseUser.getIdTokenResult();

        const mappedUser: IAuthUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified,
          role: idTokenResult.claims.role as EUserRole,
          dbId: idTokenResult.claims.dbId as string,
          status: idTokenResult.claims.status as EUserStatus,
        };

        setUser(mappedUser);
      } else {
        setUser(null);
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
