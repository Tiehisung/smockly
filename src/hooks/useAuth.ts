// hooks/useAuth.ts
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { setUser, setLoading, setError, clearUser, clearError } from '../store/slices/auth.slice';
import type { ISignUpData, ISignInData } from '../types/auth.types';
import { useAppDispatch, useAppSelector } from '../store/hooks';

export const useAuth = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { user, loading, error } = useAppSelector((state) => state.auth);

    // Listen to auth state changes
    useEffect(() => {
        const unsubscribe = authService.onAuthStateChanged((user) => {
            dispatch(setUser(user));
        });

        return () => unsubscribe();
    }, [dispatch]);

    // Handle redirect result on mount
    useEffect(() => {
        const handleRedirect = async () => {
            try {
                const { user, returnUrl } = await authService.handleRedirectResult();
                if (user) {
                    dispatch(setUser(user));
                    navigate(returnUrl, { replace: true });
                }
            } catch (error) {
                console.error('Redirect handling failed:', error);
            }
        };

        handleRedirect();
    }, [dispatch, navigate]);

    const getReturnUrl = () => {
        const params = new URLSearchParams(location.search);
        const redirect = params.get('redirect');
        if (redirect) return redirect;
        if (location.state?.from) return location.state.from;
        return '/shop';
    };

    const signUp = async (data: ISignUpData) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const user = await authService.signUp(data.email, data.password, data.displayName);
            dispatch(setUser(user));
            navigate('/verify-email');
            return user;
        } catch (error: any) {
            dispatch(setError(error.message || 'Sign up failed'));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const signIn = async (data: ISignInData) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const user = await authService.signIn(data.email, data.password);
            dispatch(setUser(user));
            navigate('/shop');
            return user;
        } catch (error: any) {
            dispatch(setError(error.message || 'Sign in failed'));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const signInWithGoogle = async () => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const returnUrl = getReturnUrl();
            await authService.signInWithGoogle(returnUrl);
            // Redirect happens automatically
        } catch (error: any) {
            dispatch(setError(error.message || 'Google sign in failed'));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const signInWithFacebook = async () => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const returnUrl = getReturnUrl();
            await authService.signInWithFacebook(returnUrl);
            // Redirect happens automatically
        } catch (error: any) {
            dispatch(setError(error.message || 'Facebook sign in failed'));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const logout = async () => {
        try {
            dispatch(setLoading(true));
            await authService.logout();
            dispatch(clearUser());
            navigate('/auth/signin');
        } catch (error: any) {
            dispatch(setError(error.message || 'Logout failed'));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const refreshUser = async () => {
        try {
            const user = await authService.reloadUser();
            if (user) dispatch(setUser(user));
            return user;
        } catch (error: any) {
            dispatch(setError(error.message || 'Refresh failed'));
            throw error;
        }
    };

    return {
        user,
        isAuthenticated: !!user,
        loading,
        error,
        signUp,
        signIn,
        signInWithGoogle,
        signInWithFacebook,
        logout,
        refreshUser,
        clearError: () => dispatch(clearError()),
    };
};