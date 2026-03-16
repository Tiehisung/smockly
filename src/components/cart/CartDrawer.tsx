// src/components/cart/CartDrawer.tsx
import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { formatAmount } from "../../utils/amount";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { SELECT } from "../input/Select";
import { Drawer } from "../headlessUI/Drawer";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, itemCount, updateQuantity, removeItem } = useCart();
  const data = cart?.data;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Shopping Cart (${itemCount})`}
      size="md"
      position="right"
      footer={
        data?.items && data.items.length > 0 ? (
          <div className="px-4 py-6 sm:px-6">
            {/* Subtotal */}
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>Subtotal</p>
              <p>{formatAmount(data?.subtotal || 0)}</p>
            </div>

            {/* Shipping */}
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <p>Shipping</p>
              <p>
                {data?.shipping === 0
                  ? "Free"
                  : formatAmount(data?.shipping || 0)}
              </p>
            </div>

            {/* Tax */}
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <p>Tax</p>
              <p>{formatAmount(data?.tax || 0)}</p>
            </div>

            {/* Discount */}
            {(data?.discount || 0) > 0 && (
              <div className="flex justify-between text-sm text-green-600 mt-1">
                <p>Discount</p>
                <p>-{formatAmount(data?.discount || 0)}</p>
              </div>
            )}

            {/* Total */}
            <div className="flex justify-between text-lg font-bold text-gray-900 mt-4 pt-4 border-t border-gray-200">
              <p>Total</p>
              <p>{formatAmount(data?.total || 0)}</p>
            </div>

            {/* Shipping Note */}
            <p className="mt-0.5 text-sm text-gray-500">
              Shipping and taxes calculated at checkout.
            </p>

            {/* Checkout Button */}
            <div className="mt-6">
              <Link
                to="/checkout"
                onClick={onClose}
                className="flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
              >
                Proceed to Checkout
              </Link>
            </div>

            {/* Continue Shopping Link */}
            <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
              <p>
                or{" "}
                <button
                  type="button"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                  onClick={onClose}
                >
                  Continue Shopping
                  <span aria-hidden="true"> →</span>
                </button>
              </p>
            </div>
          </div>
        ) : null
      }
    >
      <div className="px-4 py-6 sm:px-6">
        {!data?.items || data.items.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <ShoppingBagIcon className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-4">Your cart is empty</p>
            <Link
              to="/shop"
              onClick={onClose}
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <ul role="list" className="-my-6 divide-y divide-gray-200">
            {data.items.map((item) => (
              <li key={item._id} className="flex py-6">
                {/* Product Image */}
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover object-center"
                  />
                </div>

                {/* Product Details */}
                <div className="ml-4 flex flex-1 flex-col">
                  <div>
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <h3>
                        <Link
                          to={`/product/${item.slug}`}
                          onClick={onClose}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {item.name}
                        </Link>
                      </h3>
                      <p className="ml-4">{formatAmount(item.price)}</p>
                    </div>

                    {/* Variant Info */}
                    {item.variant && (
                      <p className="mt-1 text-sm text-gray-500">
                        {item.variant.size && `Size: ${item.variant.size} `}
                        {item.variant.color && `Color: ${item.variant.color}`}
                      </p>
                    )}
                  </div>

                  {/* Quantity & Remove */}
                  <div className="flex flex-1 items-end justify-between text-sm">
                    <div className="flex items-center">
                      <SELECT
                        name={`quantity-${item._id}`}
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item._id, parseInt(e.target.value))
                        }
                        options={Array.from({
                          length: item.maxQuantity || 1,
                        }).map((_, i) => ({
                          label: `${i + 1}`,
                          value: `${i + 1}`,
                        }))}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item._id)}
                      className="font-medium text-red-600 hover:text-red-800 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Drawer>
  );
}
