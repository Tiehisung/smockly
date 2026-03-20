// src/hooks/usewishlistData.ts
import { useCallback } from "react";
import {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useClearWishlistMutation,
  useMoveToCartMutation,
  useLazyCheckInWishlistQuery,
} from "../store/api/wishlistApi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppSelector } from "../store/hooks";

export const useWishlist = () => {
  const { user } = useAppSelector((s) => s.auth);
  const navigate = useNavigate();

  const {
    data: wishlist,
    isLoading,
    refetch,
    error,
  } = useGetWishlistQuery(undefined, {
    skip: !user, // Skip if not logged in
  });

  const wishlistData = wishlist?.data || [];

  const [addToWishlistMutation] = useAddToWishlistMutation();
  const [removeFromWishlistMutation] = useRemoveFromWishlistMutation();
  const [clearWishlistMutation] = useClearWishlistMutation();
  const [moveToCartMutation] = useMoveToCartMutation();
  const [checkInWishlist] = useLazyCheckInWishlistQuery();

  const isInWishlist = useCallback(
    async (productId: string): Promise<boolean> => {
      if (!user) return false;
      try {
        const result = await checkInWishlist(productId).unwrap();
        return result;
      } catch (error) {
        return false;
      }
    },
    [user, checkInWishlist],
  );

  // Sync version for components that need immediate value
  const isInWishlistSync = useCallback(
    (productId: string): boolean => {
      if (!user) return false;
      return wishlistData.some((item) => item._id === productId);
    },
    [user, wishlistData],
  );

  const addToWishlist = useCallback(
    async (productId: string) => {
      if (!user) {
        navigate("/auth/login", { state: { from: window.location.pathname } });
        toast.error("Please login to add items to wishlist");
        return;
      }

      try {
        await addToWishlistMutation(productId).unwrap();
        toast.success("Added to wishlist");
      } catch (error: any) {
        if (error?.data?.message?.includes("already")) {
          toast.error("Item already in wishlist");
        } else {
          toast.error("Failed to add to wishlist");
        }
      }
    },
    [user, navigate, addToWishlistMutation],
  );

  const removeFromWishlist = useCallback(
    async (productId: string) => {
      if (!user) return;

      try {
        await removeFromWishlistMutation(productId).unwrap();
        toast.success("Removed from wishlist");
      } catch (error) {
        toast.error("Failed to remove from wishlist");
      }
    },
    [user, removeFromWishlistMutation],
  );

  const toggleWishlist = useCallback(
    async (productId: string) => {
      if (!user) {
        navigate("/auth/login", { state: { from: window.location.pathname } });
        toast.error("Please login to manage wishlist");
        return;
      }

      const isInList = isInWishlistSync(productId);

      if (isInList) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist(productId);
      }
    },
    [user, navigate, isInWishlistSync, addToWishlist, removeFromWishlist],
  );

  const clearWishlist = useCallback(async () => {
    if (!user) return;

    if (window.confirm("Are you sure you want to clear your wishlist?")) {
      try {
        await clearWishlistMutation().unwrap();
        toast.success("Wishlist cleared");
      } catch (error) {
        toast.error("Failed to clear wishlist");
      }
    }
  }, [user, clearWishlistMutation]);

  const moveToCart = useCallback(
    async (productId: string) => {
      if (!user) return;

      try {
        await moveToCartMutation(productId).unwrap();
        toast.success("Moved to cart");
      } catch (error) {
        toast.error("Failed to move to cart");
      }
    },
    [user, moveToCartMutation],
  );

  return {
    // Data
    wishlist,
    isLoading,
    error,
    itemCount: wishlistData.length,

    // Sync check (immediate, uses cached data)
    isInWishlist: isInWishlistSync,

    // Async check (makes API call)
    checkInWishlist: isInWishlist,

    // Actions
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    moveToCart,
    refetch,
  };
};
