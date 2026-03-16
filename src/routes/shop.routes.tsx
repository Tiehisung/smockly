// src/routes/shop.routes.ts
import type { RouteObject } from "react-router-dom";
import { ShopPage } from "../pages/shop/Shop";
import { CategoryPage } from "../pages/category/CategoryPage";
import { SearchResults } from "../pages/product/Search";
import { CartPage } from "../pages/cart/CartPage";
import { CategoriesPage } from "../pages/category/CategoriesPage";
import { NewArrivals } from "../pages/NewArrivals";
import { Bestsellers } from "../pages/BestSellers";
import { ProductDetails } from "../pages/product/ProductDetailsPage";
import { Wishlist } from "../pages/account/Wishlist";

 
export const shopRoutes: RouteObject[] = [
  {
    path: "shop",
    element: <ShopPage />,
  },
  {
    path: "new-arrivals",
    element: <NewArrivals />,
  },
  {
    path: "best-sellers",
    element: <Bestsellers />,
  },
  
  {
    path: "product/:slug",
    element: <ProductDetails />,
  },
  {
    path: "categories",
    element: <CategoriesPage />,
  },
  {
    path: "category/:categorySlug",
    element: <CategoryPage />,
  },
  {
    path: "search",
    element: <SearchResults />,
  },
  {
    path: "cart",
    element: <CartPage />,
  },
  {
    path: "wishlist",
    element: <Wishlist />,
  },
];
