// src/routes/checkout.routes.ts
import type { RouteObject } from "react-router-dom";
import { ProtectedRoute } from "../components/layout/ProtectedRoute";
// import { Checkout } from "../pages/Checkout";
// import { CheckoutShipping } from "../pages/checkout/CheckoutShipping";
// import { CheckoutPayment } from "../pages/checkout/CheckoutPayment";
// import { CheckoutReview } from "../pages/checkout/CheckoutReview";
// import { OrderConfirmation } from "../pages/OrderConfirmation";

export const checkoutRoutes: RouteObject = {
  path: "checkout",
  element: <ProtectedRoute requireVerified={true} />,
  children: [
    // {
    //   index: true,
    //   element: <Checkout />,
    // },
    // {
    //   path: "shipping",
    //   element: <CheckoutShipping />,
    // },
    // {
    //   path: "payment",
    //   element: <CheckoutPayment />,
    // },
    // {
    //   path: "review",
    //   element: <CheckoutReview />,
    // },
  ],
};

export const orderRoutes: RouteObject = {
  path: "order-confirmation/:orderId",
  element: <ProtectedRoute />,
  children: [
    // {
    //   index: true,
    //   element: <OrderConfirmation />,
    // },
  ],
};
