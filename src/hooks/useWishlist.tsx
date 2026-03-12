// src/hooks/useWishlist.ts
import { useCallback } from "react";
import {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} from "../store/api/wishlistApi";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const useWishlist = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    data: wishlist = [],
    isLoading,
    refetch,
  } = useGetWishlistQuery(undefined, {
    skip: !user, // Skip if not logged in
  });

  const [addToWishlistMutation] = useAddToWishlistMutation();
  const [removeFromWishlistMutation] = useRemoveFromWishlistMutation();

  const isInWishlist = useCallback(
    (productId: string) => {
      return wishlist.some((item) => item._id === productId);
    },
    [wishlist],
  );

  const addToWishlist = useCallback(
    async (productId: string) => {
      if (!user) {
        navigate("/login");
        toast.error("Please login to add items to wishlist");
        return;
      }

      try {
        await addToWishlistMutation(productId).unwrap();
        toast.success("Added to wishlist");
      } catch (error) {
        toast.error("Failed to add to wishlist");
      }
    },
    [user, navigate, addToWishlistMutation],
  );

  const removeFromWishlist = useCallback(
    async (productId: string) => {
      try {
        await removeFromWishlistMutation(productId).unwrap();
        toast.success("Removed from wishlist");
      } catch (error) {
        toast.error("Failed to remove from wishlist");
      }
    },
    [removeFromWishlistMutation],
  );

  const toggleWishlist = useCallback(
    async (productId: string) => {
      if (isInWishlist(productId)) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist(productId);
      }
    },
    [isInWishlist, addToWishlist, removeFromWishlist],
  );

  return {
    wishlist,
    isLoading,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    refetch,
    itemCount: wishlist.length,
  };
};
