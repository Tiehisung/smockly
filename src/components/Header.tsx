// src/components/layout/Header.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
 
import {
  ShoppingCartIcon,
  UserIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
 
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../hooks/useCart";
import { CartDrawer } from "./cart/CartDrawer";

export function Header() {
  const { user } = useAuth();
  const { itemCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold text-blue-600">
             GH Smockly
            </Link>

            {/* Navigation */}
            <div className="hidden md:flex space-x-8">
              <Link to="/shop" className="text-gray-700 hover:text-blue-600">
                Shop
              </Link>
              
              <Link
                to="/categories"
                className="text-gray-700 hover:text-blue-600"
              >
                Categories
              </Link>
              <Link
                to="/new-arrivals"
                className="text-gray-700 hover:text-blue-600"
              >
                New Arrivals
              </Link>
              <Link to="/sale" className="text-gray-700 hover:text-blue-600">
                Sale
              </Link>
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-4">
              {/* Wishlist */}
              <Link to="/wishlist" className="relative">
                <HeartIcon className="h-6 w-6 text-gray-700 hover:text-blue-600" />
              </Link>

              {/* Cart */}
              <button onClick={() => setIsCartOpen(true)} className="relative">
                <ShoppingCartIcon className="h-6 w-6 text-gray-700 hover:text-blue-600" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* User Menu */}
              {user ? (
                <Link to="/profile">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || ""}
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <UserIcon className="h-5 w-5 text-gray-600" />
                    )}
                  </div>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </nav>
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
