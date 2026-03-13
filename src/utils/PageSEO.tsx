// src/components/SEO/PageSEO.tsx
import { Helmet } from "react-helmet";
 
import { useLocation } from "react-router-dom";
import { APP_INFO } from "../data/appinfo";

interface IPageSEOProps {
  page?:
    | "home"
    | "shop"
    | "product"
    | "category"
    | "cart"
    | "checkout"
    | "account"
    | "about"
    | "contact"
    | "faq"
    | "wishlist"
    | "orders"
    | "admin";
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  keywords?: string[];
  product?: any; // For product pages
  category?: any; // For category pages
}

const pageConfig = {
  home: {
    title: "Home",
    description: APP_INFO.description,
    keywords: [
      "african smocks",
      "traditional wear",
      "handmade smocks",
      "Ghana smocks",
      "African fashion",
    ],
  },
  shop: {
    title: "Shop",
    description: `Browse our collection of authentic African smocks, accessories, and more. Find the perfect traditional attire for any occasion.`,
    keywords: [
      "shop smocks",
      "buy smocks",
      "African clothing",
      "traditional attire",
    ],
  },
  product: {
    title: "Product Details",
    description: `View detailed information about our handcrafted smocks, including sizing, materials, and care instructions.`,
    keywords: ["product details", "smock sizing", "handmade details"],
  },
  category: {
    title: "Category",
    description: `Explore our collection of traditional African smocks and accessories by category.`,
    keywords: ["smocks category", "traditional wear", "African fashion"],
  },
  cart: {
    title: "Shopping Cart",
    description: `Review your items and proceed to checkout. Secure shopping cart for your traditional African smocks.`,
    keywords: ["shopping cart", "checkout", "buy smocks"],
  },
  checkout: {
    title: "Checkout",
    description: `Complete your purchase securely. Multiple payment options including mobile money and card payments.`,
    keywords: ["checkout", "payment", "secure shopping"],
  },
  account: {
    title: "My Account",
    description: `Manage your account, view orders, update addresses, and manage your wishlist.`,
    keywords: ["account", "profile", "orders", "wishlist"],
  },
  about: {
    title: "About Us",
    description: `Learn about our story, mission, and the artisans behind our authentic African smocks.`,
    keywords: ["about us", "our story", "artisans", "handmade"],
  },
  contact: {
    title: "Contact Us",
    description: `Get in touch with our team. We're here to help with any questions about our products or services.`,
    keywords: ["contact", "customer service", "support", "inquiries"],
  },
  faq: {
    title: "FAQ",
    description: `Find answers to frequently asked questions about sizing, shipping, returns, and more.`,
    keywords: ["faq", "help", "questions", "shipping", "returns"],
  },
  wishlist: {
    title: "Wishlist",
    description: `View and manage your saved items. Create your perfect collection of African smocks.`,
    keywords: ["wishlist", "saved items", "favorites"],
  },
  orders: {
    title: "Order History",
    description: `View your order history, track shipments, and manage returns.`,
    keywords: ["orders", "order history", "tracking", "returns"],
  },
  admin: {
    title: "Admin Dashboard",
    description: `Manage products, orders, customers, and inventory.`,
    keywords: ["admin", "management", "dashboard"],
  },
};

export const PageSEO = ({
  page = "home",
  title: customTitle,
  description: customDescription,
  image,
  url: customUrl,
  keywords: customKeywords,
  product,
  category,
}: IPageSEOProps) => {
  const location = useLocation();
  const config = pageConfig[page as keyof typeof pageConfig] || pageConfig.home;

  // Generate dynamic titles based on page type
  let dynamicTitle = customTitle || config.title;
  let dynamicDescription = customDescription || config.description;
  let dynamicKeywords = customKeywords || config.keywords;
  let canonicalUrl = customUrl || `${APP_INFO.website.url}${location.pathname}`;
  let ogImage = image || APP_INFO.seo.defaultImage;

  // Customize for product pages
  if (page === "product" && product) {
    dynamicTitle = product.name;
    dynamicDescription =
      product.shortDescription || product.description.substring(0, 160);
    dynamicKeywords = [...(config.keywords || []), ...(product.tags || [])];
    ogImage = product.images?.[0]?.url || ogImage;
  }

  // Customize for category pages
  if (page === "category" && category) {
    dynamicTitle = `${category.name} Smocks`;
    dynamicDescription =
      category.description ||
      `Browse our collection of ${category.name} smocks and accessories.`;
    dynamicKeywords = [...(config.keywords || []), category.name.toLowerCase()];
    ogImage = category.image || ogImage;
  }

  const fullTitle = `${dynamicTitle} | ${APP_INFO.name}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={dynamicDescription} />
      <meta name="keywords" content={dynamicKeywords?.join(", ")} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={dynamicDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={APP_INFO.name} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={APP_INFO.seo.twitterHandle} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={dynamicDescription} />
      <meta name="twitter:image" content={ogImage} />

      {/* Product-specific meta for rich snippets */}
      {page === "product" && product && (
        <>
          <meta
            property="product:price:amount"
            content={product.price?.amount}
          />
          <meta
            property="product:price:currency"
            content={product.price?.currency || "GHS"}
          />
          <meta
            property="product:availability"
            content={
              product.inventory?.quantity > 0 ? "in stock" : "out of stock"
            }
          />
          <meta property="product:condition" content="new" />
        </>
      )}

      {/* Additional meta tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content={APP_INFO.name} />

      {/* Favicon */}
      <link rel="icon" type="image/x-icon" href={APP_INFO.favicon} />
      <link rel="shortcut icon" type="image/x-icon" href={APP_INFO.favicon} />
    </Helmet>
  );
};
