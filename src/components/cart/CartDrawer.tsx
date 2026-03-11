// src/components/cart/CartDrawer.tsx
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, itemCount, updateQuantity, removeItem } = useCart();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          Shopping Cart ({itemCount})
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={onClose}
                          >
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          {cart?.items.length === 0 ? (
                            <div className="text-center py-12">
                              <p className="text-gray-500">
                                Your cart is empty
                              </p>
                              <Link
                                to="/shop"
                                onClick={onClose}
                                className="mt-4 inline-block text-blue-600 hover:text-blue-800"
                              >
                                Continue Shopping
                              </Link>
                            </div>
                          ) : (
                            <ul
                              role="list"
                              className="-my-6 divide-y divide-gray-200"
                            >
                              {cart?.items.map((item) => (
                                <li key={item.id} className="flex py-6">
                                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="h-full w-full object-cover object-center"
                                    />
                                  </div>

                                  <div className="ml-4 flex flex-1 flex-col">
                                    <div>
                                      <div className="flex justify-between text-base font-medium text-gray-900">
                                        <h3>
                                          <Link
                                            to={`/product/${item.productSlug}`}
                                            onClick={onClose}
                                          >
                                            {item.name}
                                          </Link>
                                        </h3>
                                        <p className="ml-4">
                                          {formatCurrency(item.price.amount)}
                                        </p>
                                      </div>
                                      {item.variant && (
                                        <p className="mt-1 text-sm text-gray-500">
                                          {item.variant.size &&
                                            `Size: ${item.variant.size} `}
                                          {item.variant.color &&
                                            `Color: ${item.variant.color}`}
                                        </p>
                                      )}
                                    </div>
                                    <div className="flex flex-1 items-end justify-between text-sm">
                                      <div className="flex items-center">
                                        <label
                                          htmlFor={`quantity-${item.id}`}
                                          className="sr-only"
                                        >
                                          Quantity
                                        </label>
                                        <select
                                          id={`quantity-${item.id}`}
                                          value={item.quantity}
                                          onChange={(e) =>
                                            updateQuantity(
                                              item.id,
                                              parseInt(e.target.value),
                                            )
                                          }
                                          className="rounded-md border border-gray-300 text-base"
                                        >
                                          {[...Array(item.maxQuantity)].map(
                                            (_, i) => (
                                              <option key={i + 1} value={i + 1}>
                                                {i + 1}
                                              </option>
                                            ),
                                          )}
                                        </select>
                                      </div>

                                      <div className="flex">
                                        <button
                                          type="button"
                                          onClick={() => removeItem(item.id)}
                                          className="font-medium text-blue-600 hover:text-blue-500"
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>

                    {cart && cart.items.length > 0 && (
                      <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <p>Subtotal</p>
                          <p>{formatCurrency(cart.subtotal.amount)}</p>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500 mt-2">
                          <p>Shipping</p>
                          <p>
                            {cart.shipping.amount === 0
                              ? "Free"
                              : formatCurrency(cart.shipping.amount)}
                          </p>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500 mt-1">
                          <p>Tax</p>
                          <p>{formatCurrency(cart.tax.amount)}</p>
                        </div>
                        {cart.discount.amount > 0 && (
                          <div className="flex justify-between text-sm text-green-600 mt-1">
                            <p>Discount</p>
                            <p>-{formatCurrency(cart.discount.amount)}</p>
                          </div>
                        )}
                        <div className="flex justify-between text-lg font-bold text-gray-900 mt-4 pt-4 border-t">
                          <p>Total</p>
                          <p>{formatCurrency(cart.total.amount)}</p>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">
                          Shipping and taxes calculated at checkout.
                        </p>
                        <div className="mt-6">
                          <Link
                            to="/checkout"
                            onClick={onClose}
                            className="flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700"
                          >
                            Checkout
                          </Link>
                        </div>
                        <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                          <p>
                            or{" "}
                            <button
                              type="button"
                              className="font-medium text-blue-600 hover:text-blue-500"
                              onClick={onClose}
                            >
                              Continue Shopping
                              <span aria-hidden="true"> →</span>
                            </button>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
