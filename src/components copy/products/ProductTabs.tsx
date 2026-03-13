// src/components/products/ProductTabs.tsx
import { useState } from "react";
import { useGetProductReviewsQuery } from "../../store/api/reviewsApi";
import { formatDistanceToNow } from "date-fns";
import type { IProduct } from "../../types/product.types";

interface ProductTabsProps {
  product: IProduct;
}

export function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<
    "description" | "reviews" | "shipping"
  >("description");

  const { data: reviewsData } = useGetProductReviewsQuery({
    productId: product._id,
    page: 1,
    limit: 5,
    sortBy: "recent",
  });

  return (
    <div className="mt-12">
      {/* Tab Headers */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("description")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "description"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "reviews"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Reviews ({product.ratings.count})
          </button>
          <button
            onClick={() => setActiveTab("shipping")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "shipping"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Shipping & Returns
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="py-6">
        {activeTab === "description" && (
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-line">
              {product.description}
            </p>

            {/* Product Attributes */}
            {product.attributes && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Details
                </h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.attributes.materials && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Materials
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {product.attributes.materials.join(", ")}
                      </dd>
                    </div>
                  )}
                  {product.attributes.styles && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Styles
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {product.attributes.styles.join(", ")}
                      </dd>
                    </div>
                  )}
                  {product.attributes.occasion && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Occasion
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {product.attributes.occasion.join(", ")}
                      </dd>
                    </div>
                  )}
                  {product.attributes.cultural && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Cultural
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {product.attributes.cultural.join(", ")}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div>
            {/* Reviews Summary */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="text-4xl font-bold text-gray-900">
                {product.ratings.average.toFixed(1)}
              </div>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(product.ratings.average)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <div className="text-sm text-gray-500">
                Based on {product.ratings.count} reviews
              </div>
            </div>

            {/* Reviews List */}
            {reviewsData?.items.length === 0 ? (
              <p className="text-gray-500">
                No reviews yet. Be the first to review this product!
              </p>
            ) : (
              <div className="space-y-6">
                {reviewsData?.items.map((review) => (
                  <div
                    key={review._id}
                    className="border-b border-gray-200 pb-6"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="font-medium text-gray-900">
                          {review.userId}
                        </div>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(review.createdAt), {
                          addSuffix: true,
                        })}
                      </div>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">
                      {review.title}
                    </h4>
                    <p className="text-gray-700">{review.content}</p>
                    {review.images && review.images.length > 0 && (
                      <div className="flex space-x-2 mt-3">
                        {review.images.map((image, index) => (
                          <img
                            key={index}
                            src={image.url}
                            alt="Review"
                            className="w-16 h-16 object-cover rounded"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "shipping" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Shipping Information
              </h3>
              <p className="text-gray-700">
                Free shipping on orders over $100. Standard shipping takes 3-5
                business days. Express shipping available at checkout for 1-2
                business days.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Returns
              </h3>
              <p className="text-gray-700">
                We accept returns within 30 days of delivery. Items must be
                unworn and in original condition. Return shipping is free for
                exchanges, otherwise a small fee may apply.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Size Guide
              </h3>
              <p className="text-gray-700">
                Our smocks are traditionally fitted. Check our size guide for
                measurements and fitting advice.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
