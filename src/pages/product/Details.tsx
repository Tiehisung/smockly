// src/pages/ProductDetails.tsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  HeartIcon,
  HeartIcon as HeartIconSolid,
  ShoppingBagIcon,
  TruckIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  ShareIcon,
  ChevronLeftIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { ProductCard } from "../../components/products/ProductCard";
import { ProductGallery } from "../../components/products/ProductGallery";
import { ProductTabs } from "../../components/products/ProductTabs";
import { ProductVariants } from "../../components/products/ProductVariants";
import { QuantitySelector } from "../../components/products/QuantitySelector";
import { allProducts, getRelatedProducts } from "../../data/products";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";
import { useGetProductBySlugQuery } from "../../store/api/productsApi";
import type { IProduct } from "../../types/product.types";

export function ProductDetails() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const { data: productData, isLoading } = useGetProductBySlugQuery(slug!);

  // Load product data
  useEffect(() => {
    setLoading(true);
    // Find product by slug from dummy data

    const foundProduct = productData || allProducts.find((p) => p.slug == slug);

    if (foundProduct) {
      setProduct(foundProduct);

      // Get related products
      const related = getRelatedProducts(foundProduct._id, 4);
      setRelatedProducts(related);

      // Update recently viewed
      const viewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
      const updatedViewed = [
        foundProduct._id,
        ...viewed.filter((id: string) => id !== foundProduct._id),
      ].slice(0, 6);
      localStorage.setItem("recentlyViewed", JSON.stringify(updatedViewed));

      // Load recently viewed products
      const recentlyViewedProducts = updatedViewed
        .map((id: string) => allProducts.find((p) => p._id === id))
        .filter(Boolean);
      setRecentlyViewed(recentlyViewedProducts);
    }

    setLoading(false);
  }, [slug]);

  // Reset quantity when product changes
  useEffect(() => {
    setQuantity(1);
    setSelectedVariant(null);
    setActiveImage(0);
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      product,
      quantity,
      variant: product.variants?.find((v) => v._id === selectedVariant),
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => {
      navigate("/checkout");
    }, 500);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: product?.shortDescription,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
    setShowShareMenu(false);
  };

  const handleVariantChange = (variantId: string) => {
    setSelectedVariant(variantId);
    const variant = product?.variants?.find((v: any) => v._id === variantId);
    if (variant) {
      toast.success(`Selected: ${variant.name}`);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
            <ShoppingBagIcon className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <div className="space-y-3">
            <Link
              to="/shop"
              className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse All Products
            </Link>
            <Link
              to="/"
              className="block w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const inWishlist = isInWishlist(product._id);
  const discount = product.compareAtPrice
    ? Math.round(
        ((product.compareAtPrice.amount - product.price.amount) /
          product.compareAtPrice.amount) *
          100,
      )
    : 0;
  const isOutOfStock = product.inventory.quantity === 0;
  const maxQuantity = Math.min(product.inventory.quantity, 10);

  if (isLoading) return <LoadingSpinner />;
  return (
    <div className="bg-white">
      {/* Breadcrumb Navigation */}
      <nav className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-700">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link to="/shop" className="text-gray-500 hover:text-gray-700">
              Shop
            </Link>
            <span className="text-gray-400">/</span>
            <Link
              to={`/category/${product.category}`}
              className="text-gray-500 hover:text-gray-700"
            >
              {product.category}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium truncate">
              {product.name}
            </span>
          </div>
        </div>
      </nav>

      {/* Back to Shop Link (Mobile) */}
      <div className="lg:hidden px-4 py-3 border-b border-gray-200">
        <Link
          to="/shop"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ChevronLeftIcon className="h-4 w-4 mr-1" />
          Back to shop
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Product Gallery */}
          <div>
            <ProductGallery
              images={product.images}
              name={product.name}
              defIndex={activeImage}
              onImageChange={setActiveImage}
            />
          </div>

          {/* Right Column - Product Info */}
          <div>
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {product.bestseller && (
                <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-3 py-1 rounded-full">
                  Bestseller
                </span>
              )}
              {product.newArrival && (
                <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full">
                  New Arrival
                </span>
              )}
              {discount > 0 && (
                <span className="bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
                  {discount}% OFF
                </span>
              )}
              {!product.inventory.trackQuantity &&
                product.inventory.quantity <= 5 &&
                product.inventory.quantity > 0 && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full">
                    Low Stock: {product.inventory.quantity} left
                  </span>
                )}
            </div>

            {/* Product Name */}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>

            {/* SKU */}
            <p className="text-sm text-gray-500 mb-4">SKU: {product.sku}</p>

            {/* Rating */}
            <div className="flex items-center space-x-3 mb-6">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) =>
                  star <= Math.round(product.ratings.average) ? (
                    <StarIconSolid
                      key={star}
                      className="w-5 h-5 text-yellow-400"
                    />
                  ) : (
                    <StarIcon key={star} className="w-5 h-5 text-gray-300" />
                  ),
                )}
              </div>
              <span className="text-sm text-gray-600">
                {product.ratings.average} ({product.ratings.count} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-gray-900">
                  ${product.price.amount}
                </span>
                {product.compareAtPrice && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      ${product.compareAtPrice.amount}
                    </span>
                    <span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
                      Save $
                      {(
                        product.compareAtPrice.amount - product.price.amount
                      ).toFixed(2)}
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Free shipping on orders over $100
              </p>
            </div>

            {/* Short Description */}
            <div className="prose prose-sm mb-6">
              <p className="text-gray-700">{product.shortDescription}</p>
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <ProductVariants
                  variants={product.variants}
                  selectedVariant={selectedVariant}
                  onSelectVariant={handleVariantChange}
                />
              </div>
            )}

            {/* Stock Status */}
            <div className="mb-6">
              {isOutOfStock ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 font-medium">Out of Stock</p>
                  <p className="text-sm text-red-500 mt-1">
                    This item is currently unavailable. Check back later or
                    browse similar items.
                  </p>
                </div>
              ) : product.inventory.quantity <= 5 ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 font-medium">
                    Only {product.inventory.quantity} left in stock!
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Order soon to avoid disappointment.
                  </p>
                </div>
              ) : (
                <div className="flex items-center text-green-600">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                  <span>In Stock</span>
                </div>
              )}
            </div>

            {/* Quantity and Actions */}
            {!isOutOfStock && (
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700">
                    Quantity:
                  </span>
                  <QuantitySelector
                    quantity={quantity}
                    maxQuantity={maxQuantity}
                    onChange={setQuantity}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <ShoppingBagIcon className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    Buy Now
                  </button>
                  <button
                    onClick={() => toggleWishlist(product._id)}
                    className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    title={
                      inWishlist ? "Remove from wishlist" : "Add to wishlist"
                    }
                  >
                    {inWishlist ? (
                      <HeartIconSolid className="w-5 h-5 text-red-500" />
                    ) : (
                      <HeartIcon className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setShowShareMenu(!showShareMenu)}
                      className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      title="Share"
                    >
                      <ShareIcon className="w-5 h-5 text-gray-600" />
                    </button>
                    {showShareMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                        <button
                          onClick={handleShare}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Share via...
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            toast.success("Link copied!");
                            setShowShareMenu(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Copy link
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Trust Badges */}
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <TruckIcon className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">Free Shipping</p>
                  <p className="text-xs text-gray-400">On orders $100+</p>
                </div>
                <div className="text-center">
                  <ArrowPathIcon className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">Easy Returns</p>
                  <p className="text-xs text-gray-400">30-day returns</p>
                </div>
                <div className="text-center">
                  <ShieldCheckIcon className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">Secure Checkout</p>
                  <p className="text-xs text-gray-400">SSL encrypted</p>
                </div>
              </div>
            </div>

            {/* Product Meta */}
            <div className="border-t border-gray-200 mt-6 pt-6 space-y-2">
              {product.category && (
                <div className="flex items-center text-sm">
                  <span className="text-gray-500 w-24">Category:</span>
                  <Link
                    to={`/category/${product.category}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {product.category}
                  </Link>
                </div>
              )}
              {product.tags && product.tags.length > 0 && (
                <div className="flex items-start text-sm">
                  <span className="text-gray-500 w-24">Tags:</span>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag: string) => (
                      <Link
                        key={tag}
                        to={`/shop?tag=${tag}`}
                        className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs hover:bg-gray-200"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Tabs (Description, Reviews, Shipping) */}
        <ProductTabs product={product} />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* Recently Viewed */}
        {recentlyViewed.length > 0 &&
          recentlyViewed[0]?._id !== product._id && (
            <div className="mt-12">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Recently Viewed
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {recentlyViewed.slice(0, 6).map((product) => (
                  <Link
                    key={product._id}
                    to={`/product/${product.slug}`}
                    className="group"
                  >
                    <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 mb-2">
                      <img
                        src={product.images[0]?.url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      ${product.price.amount}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
