// src/components/cart/AddToCartButton.tsx
import { useState } from "react";
import { useCart } from "../../hooks/useCart";
import { ShoppingBagIcon, CheckIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import type { IProduct, IProductVariant } from "../../types/product.types";

interface AddToCartButtonProps {
  product: IProduct;
  quantity?: number;
  variant?: IProductVariant;
  className?: string;
  showIcon?: boolean;
  children?: React.ReactNode;
}

export function AddToCartButton({
  product,
  quantity = 1,
  variant,
  className = "",
  showIcon = true,
  
  children,
}: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if user is logged in
    if (!user) {
      toast.error("Please login to add items to cart");
      navigate("/auth/login", { state: { from: window.location.pathname } });
      return;
    }

    // Check if product is in stock
    if (product.inventory?.quantity === 0) {
      toast.error("This product is out of stock");
      return;
    }

    setIsAdding(true);

    try {
      await addToCart({
        productId: product._id,
        quantity,
        variant,
      });

      // Show success animation
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1500);
    } catch (error) {
      toast.error("Failed to add item to cart");
    } finally {
      setIsAdding(false);
    }
  };

  const buttonContent = children || (
    <span className="flex items-center justify-center">
      {showIcon &&
        (isAdded ? (
          <CheckIcon className="w-5 h-5 mr-2" />
        ) : (
          <ShoppingBagIcon className="w-5 h-5 mr-2" />
        ))}
      {isAdded ? "Added!" : isAdding ? "Adding..." : "Add to Cart"}
    </span>
  );

  return (
    <button
      onClick={handleClick}
      disabled={isAdding || product.inventory?.quantity === 0}
      className={`
                
                px-6 py-3 rounded-lg font-semibold transition-all duration-200
                ${
                  product.inventory?.quantity === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : isAdded
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                }
                disabled:opacity-50 disabled:cursor-not-allowed
                ${className}
            `}
    >
      {buttonContent}
    </button>
  );
}
