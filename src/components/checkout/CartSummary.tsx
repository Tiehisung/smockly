// src/components/checkout/CartSummary.tsx
import { Link } from "react-router-dom";
import type { ICart } from "../../types/cart.types";
import { formatAmount } from "../../utils/amount";

interface CartSummaryProps {
  cart?: ICart;
}

export function CartSummary({ cart }: CartSummaryProps) {
  return (
    <div className="space-y-4">
      {/* Items List */}
      <div className="space-y-3 max-h-60 overflow-y-auto">
        {cart?.items?.map((item) => (
          <div key={item?._id} className="flex items-center space-x-3">
            <img
              src={item?.image}
              alt={item?.name}
              className="w-12 h-12 object-cover rounded"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {item?.name}
              </p>
              {item?.variant && (
                <p className="text-xs text-gray-500">
                  {item?.variant.size && `Size: ${item?.variant.size} `}
                  {item?.variant.color && `Color: ${item?.variant.color}`}
                </p>
              )}
              <p className="text-xs text-gray-500">Qty: {item?.quantity}</p>
            </div>
            <p className="text-sm font-medium text-gray-900">
              {item?.price * item?.quantity}
            </p>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="border-t border-gray-200 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-900">{formatAmount(cart?.subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="text-gray-900">
            {cart?.shipping === 0 ? "Free" : `${formatAmount(cart?.shipping)}`}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax</span>
          <span className="text-gray-900">{formatAmount(cart?.tax)}</span>
        </div>
        {(cart?.discount ?? 0) > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount</span>
            <span>-{formatAmount(cart?.discount)}</span>
          </div>
        )}
        <div className="border-t border-gray-200 pt-2 mt-2">
          <div className="flex justify-between font-semibold">
            <span className="text-gray-900">Total</span>
            <span className="text-blue-600">{formatAmount(cart?.total)}</span>
          </div>
        </div>
      </div>

      {/* Edit Cart Link */}
      <div className="text-center">
        <Link to="/cart" className="text-sm text-blue-600 hover:text-blue-800">
          Edit Cart
        </Link>
      </div>
    </div>
  );
}
