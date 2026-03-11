// src/routes/shop.routes.ts
import type { RouteObject } from "react-router-dom";
import { ShopPage } from "../pages/shop/Shop";
import { ProductDetailsPage } from "../pages/product/ProductDetailsPage";
import { CategoryPage } from "../pages/category/CategoryPage";
import { SearchResults } from "../pages/product/Search";
import { CartPage } from "../pages/cart/CartPage";
import { CategoriesPage } from "../pages/category/Categories";
import { NewArrivals } from "../pages/NewArrivals";
 

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
    path: "product/:slug",
    element: <ProductDetailsPage />,
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
];
