// src/components/checkout/PaymentForm.tsx
import { useState } from "react";  
import { CreditCardIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import type { IPaymentDetails } from "../../types/payment.types";
 
interface PaymentFormProps {
  initialData: IPaymentDetails | null;
  onSubmit: (data: IPaymentDetails) => void;
  onBack: () => void;
  total: number;
  email: string;
  onPayWithPaystack: () => void;
  isInitializing: boolean;
}

export function PaymentForm({
  initialData,
  onSubmit,
  onBack,
  total,
}: PaymentFormProps) {
  const [formData, setFormData] = useState<IPaymentDetails>(
    initialData || {
      cardNumber: "",
      cardName: "",
      expiryDate: "",
      cvv: "",
      savePayment: false,
    },
  );

  const [errors, setErrors] = useState<Partial<IPaymentDetails>>({});
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card");

  const validate = () => {
    const newErrors: Partial<IPaymentDetails> = {};

    if (paymentMethod === "card") {
      if (!formData.cardNumber)
        newErrors.cardNumber = "Card number is required";
      else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ""))) {
        newErrors.cardNumber = "Invalid card number";
      }

      if (!formData.cardName) newErrors.cardName = "Name on card is required";

      if (!formData.expiryDate)
        newErrors.expiryDate = "Expiry date is required";
      else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = "Invalid format (MM/YY)";
      }

      if (!formData.cvv) newErrors.cvv = "CVV is required";
      else if (!/^\d{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = "Invalid CVV";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    // Format card number
    if (name === "cardNumber") {
      const formatted = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
        .slice(0, 19);
      setFormData((prev) => ({ ...prev, [name]: formatted }));
    }
    // Format expiry date
    else if (name === "expiryDate") {
      const formatted = value
        .replace(/\//g, "")
        .replace(/(\d{2})(\d{0,2})/, "$1/$2")
        .slice(0, 5);
      setFormData((prev) => ({ ...prev, [name]: formatted }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }

    // Clear error for this field
    if (errors[name as keyof IPaymentDetails]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Payment Method
      </h2>

      {/* Payment Method Selection */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              checked={paymentMethod === "card"}
              onChange={() => setPaymentMethod("card")}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">
              Credit / Debit Card
            </span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              checked={paymentMethod === "paypal"}
              onChange={() => setPaymentMethod("paypal")}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">PayPal</span>
          </label>
        </div>

        {paymentMethod === "card" ? (
          <div className="space-y-4">
            {/* Card Number */}
            <div>
              <label
                htmlFor="cardNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Card Number
              </label>
              <div className="relative">
                <CreditCardIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.cardNumber ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {errors.cardNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
              )}
            </div>

            {/* Name on Card */}
            <div>
              <label
                htmlFor="cardName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name on Card
              </label>
              <input
                type="text"
                id="cardName"
                name="cardName"
                value={formData.cardName}
                onChange={handleChange}
                placeholder="John Doe"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.cardName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.cardName && (
                <p className="mt-1 text-sm text-red-600">{errors.cardName}</p>
              )}
            </div>

            {/* Expiry Date and CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="expiryDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Expiry Date
                </label>
                <input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  placeholder="MM/YY"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.expiryDate ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.expiryDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.expiryDate}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="cvv"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  CVV
                </label>
                <input
                  type="password"
                  id="cvv"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  placeholder="123"
                  maxLength={4}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.cvv ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.cvv && (
                  <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
                )}
              </div>
            </div>

            {/* Save Payment Method */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="savePayment"
                name="savePayment"
                checked={formData.savePayment}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="savePayment"
                className="ml-2 block text-sm text-gray-700"
              >
                Save this card for future purchases
              </label>
            </div>

            {/* Security Message */}
            <div className="bg-blue-50 rounded-lg p-4 flex items-start">
              <LockClosedIcon className="h-5 w-5 text-blue-600 mr-2 shrink-0 mt-0.5" />
              <p className="text-sm text-blue-700">
                Your payment information is encrypted and secure. We never store
                your full card details.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <p className="text-gray-600 mb-4">
              You'll be redirected to PayPal to complete your payment.
            </p>
            <button
              type="button"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              Continue with PayPal
            </button>
          </div>
        )}
      </div>

      {/* Order Total */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total to pay:</span>
          <span className="text-xl font-bold text-gray-900">
            ${total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Continue to Review
        </button>
      </div>
    </form>
  );
}
