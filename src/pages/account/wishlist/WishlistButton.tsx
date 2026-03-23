// src/components/wishlist/WishlistButton.tsx
import { useState } from "react";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { useWishlist } from "../../../hooks/useWishlist";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { smartToast } from "../../../lib/toast";
import { useAuth } from "../../../hooks/useAuth";

interface WishlistButtonProps {
  productId: string;
  variant?: "icon" | "button" | "card";
  size?: "sm" | "md" | "lg";
  className?: string;
  showText?: boolean;
}

const sizeClasses = {
  icon: {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-2.5",
  },
  button: {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  },
};

const iconSizes = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

export function WishlistButton({
  productId,
  variant = "icon",
  size = "md",
  className = "",
  showText = false,
}: WishlistButtonProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist, isLoading } = useWishlist();
  const [isToggling, setIsToggling] = useState(false);

  const inWishlist = isInWishlist(productId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate("/auth/signin", {
        state: { from: window.location.pathname },
        replace: true,
      });
      smartToast({ message: "Please login to add items to wishlist" });
      return;
    }

    setIsToggling(true);
    try {
      await toggleWishlist(productId);
      smartToast({
        message: inWishlist ? "Removed from wishlist" : "Added to wishlist",
      });
    } catch (error) {
      smartToast({ error: "Failed to update wishlist" });
    } finally {
      setIsToggling(false);
    }
  };

  if (variant === "button") {
    return (
      <button
        onClick={handleClick}
        disabled={isToggling || isLoading}
        className={`inline-flex items-center justify-center rounded-lg transition-colors ${
          inWishlist
            ? "bg-red-600 text-white hover:bg-red-700"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        } ${sizeClasses.button[size]} ${className}`}
      >
        {isToggling ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : inWishlist ? (
          <HeartSolid className={`${iconSizes[size]} mr-2`} />
        ) : (
          <HeartOutline className={`${iconSizes[size]} mr-2`} />
        )}
        {showText && (inWishlist ? "Saved" : "Save to Wishlist")}
      </button>
    );
  }

  // Icon variant (default)
  return (
    <button
      onClick={handleClick}
      disabled={isToggling || isLoading}
      className={`rounded-full transition-colors ${
        inWishlist
          ? "bg-red-50 text-red-600 hover:bg-red-100"
          : "bg-white text-gray-600 hover:bg-gray-100"
      } ${sizeClasses.icon[size]} ${className}`}
      title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      {isToggling ? (
        <Loader2 className={`animate-spin ${iconSizes[size]}`} />
      ) : inWishlist ? (
        <HeartSolid className={iconSizes[size]} />
      ) : (
        <HeartOutline className={iconSizes[size]} />
      )}
    </button>
  );
}
