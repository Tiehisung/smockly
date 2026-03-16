// src/pages/PaymentVerify.tsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { useProcessPaymentMutation, useLazyVerifyPaystackPaymentQuery } from "../../store/api/ordersApi";
import type { IPaystackVerificationResponse } from "../../types/payment.types";


export function PaymentVerify() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "failed">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [paymentDetails, setPaymentDetails] = useState<
    IPaystackVerificationResponse["data"] | null
  >(null);

  const reference = searchParams.get("reference");
  const trxref = searchParams.get("trxref");

  const [processPayment, { isLoading: processing }] =
    useProcessPaymentMutation(); console.log(processing)
  const [verifyPayment] = useLazyVerifyPaystackPaymentQuery();

  useEffect(() => {
    const verifyAndProcessPayment = async () => {
      if (!reference) {
        setStatus("failed");
        setErrorMessage("No payment reference found");
        return;
      }

      try {
        // Step 1: Verify with Paystack
        const verifyResult = await verifyPayment(reference).unwrap();
        console.log("Payment verified:", verifyResult);

        if (verifyResult.status && verifyResult.data.status === "success") {
          setPaymentDetails(verifyResult.data);

          // Step 2: Process payment in your system
          const processResult = await processPayment({
            reference,
            trxref: trxref || undefined,
            amount: verifyResult.data.amount / 100, // Convert from pesewas/kobo
            status: "success",
            metadata: verifyResult.data.metadata,
          }).unwrap();

          if (processResult.success) {
            setStatus("success");

            // Redirect to order confirmation after 3 seconds
            setTimeout(() => {
              navigate("/order-confirmation/success", {
                state: {
                  reference,
                  orderId: processResult.orderId,
                  paymentDetails: verifyResult.data,
                },
              });
            }, 3000);
          } else {
            throw new Error("Failed to process order");
          }
        } else {
          setStatus("failed");
          setErrorMessage(
            verifyResult.message || "Payment verification failed",
          );
        }
      } catch (error: any) {
        console.error("Payment processing failed:", error);
        setStatus("failed");
        setErrorMessage(
          error?.data?.message || error?.message || "Payment processing failed",
        );
      }
    };

    verifyAndProcessPayment();
  }, [reference, trxref, navigate, processPayment, verifyPayment]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {status === "loading" && (
          <>
            <LoadingSpinner />
            <h2 className="text-xl font-semibold text-gray-900 mt-4">
              Verifying your payment...
            </h2>
            <p className="text-gray-600 mt-2">
              Please do not close this window.
            </p>
          </>
        )}

        {status === "success" && paymentDetails && (
          <>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600 mb-2">
              Transaction reference:{" "}
              <span className="font-mono">{reference}</span>
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-4 text-left">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Amount:</span> ₵
                {(paymentDetails.amount / 100).toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Paid via:</span>{" "}
                {paymentDetails.channel.replace("_", " ")}
              </p>
              {paymentDetails.authorization?.last4 && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Card:</span> **** **** ****{" "}
                  {paymentDetails.authorization.last4}
                </p>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Redirecting to order confirmation...
            </p>
          </>
        )}

        {status === "failed" && (
          <>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <XCircleIcon className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Failed
            </h2>
            <p className="text-gray-600 mb-4">
              {errorMessage || "Something went wrong with your payment."}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/checkout")}
                className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="w-full border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50"
              >
                Contact Support
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
