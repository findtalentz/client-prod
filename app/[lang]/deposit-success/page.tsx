"use client";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import apiClient from "@/services/api-client";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

export default function DepositSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureError, setCaptureError] = useState<string | null>(null);

  const paymentGateway = searchParams.get("payment_gateway") || "stripe";
  const orderId = searchParams.get("token") || searchParams.get("PayerID"); // PayPal order ID (token) or PayerID
  const transactionId = searchParams.get("transaction_id");
  const sessionId = searchParams.get("session_id"); // Stripe session ID

  const capturePayPalPayment = useCallback(async () => {
    const currentOrderId = orderId || searchParams.get("token") || searchParams.get("PayerID");
    const currentTransactionId = transactionId || searchParams.get("transaction_id");

    if (!currentOrderId || !currentTransactionId) {
      setCaptureError("Missing payment information");
      return;
    }

    setIsCapturing(true);
    setCaptureError(null);

    try {
      const response = await apiClient.post("/paypal/capture", {
        orderId: currentOrderId,
        transactionId: currentTransactionId,
      });

      if (response.data.success) {
        toast.success("Payment captured successfully!");
        const timer = setTimeout(() => {
          router.push("/dashboard/client/jobs");
        }, 3000);
        return () => clearTimeout(timer);
      } else {
        setCaptureError(response.data.message || "Failed to capture payment");
      }
    } catch (error) {
      console.error("PayPal capture error:", error);
      let errorMessage = "Failed to capture payment. Please try again.";
      
      if (error instanceof AxiosError && error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      }
      
      setCaptureError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsCapturing(false);
    }
  }, [orderId, transactionId, searchParams, router]);

  useEffect(() => {
    // Handle PayPal capture
    if (paymentGateway === "paypal" && orderId && transactionId) {
      capturePayPalPayment();
    } else if (paymentGateway === "stripe" && sessionId) {
      // Stripe payment is handled by webhook, just show success
      // Success state will be shown automatically (no error, not capturing)
      const timer = setTimeout(() => {
        router.push("/dashboard/client/jobs");
      }, 3000);
      return () => clearTimeout(timer);
    } else if (paymentGateway === "paypal" && !orderId) {
      // Missing PayPal order ID - might be in different parameter
      // PayPal sometimes uses different parameter names
      const altOrderId = searchParams.get("PayerID") || searchParams.toString().match(/token=([^&]+)/)?.[1];
      if (altOrderId && transactionId) {
        // Retry with alternative order ID
        setTimeout(() => {
          capturePayPalPayment();
        }, 100);
      } else {
        setCaptureError("Missing payment information. Please contact support.");
      }
    } else if (paymentGateway !== "stripe" && paymentGateway !== "paypal") {
      setCaptureError("Invalid payment gateway. Please contact support.");
    }
  }, [paymentGateway, orderId, transactionId, sessionId, router, capturePayPalPayment, searchParams]);

  // Show loading state during PayPal capture
  if (paymentGateway === "paypal" && isCapturing) {
    return (
      <div className="w-full h-dvh bg-linear-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-8 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="flex justify-center mb-6"
            >
              <Loader2 className="w-16 h-16 text-primary-dark" />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Processing Payment...
            </h1>
            <p className="text-gray-600">
              Please wait while we confirm your PayPal payment.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Show error state
  if (captureError) {
    return (
      <div className="w-full h-dvh bg-linear-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <XCircle className="w-20 h-20 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Payment Error
            </h1>
            <p className="text-gray-600 mb-6">{captureError}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push("/dashboard/client/jobs")}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Go to Jobs
              </button>
              {paymentGateway === "paypal" && (
                <button
                  onClick={capturePayPalPayment}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
                >
                  Retry
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Show success state
  return (
    <div className="w-full h-dvh bg-linear-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2,
            }}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <CheckCircle2 className="w-20 h-20 text-primary-dark" />
              <motion.div
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.2 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="absolute inset-0 bg-primary rounded-full -z-10"
              />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold text-gray-800 mb-2"
          >
            Checkout Successful!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-gray-600 mb-6"
          >
            Your order has been placed successfully.
            {paymentGateway === "paypal" && " PayPal payment confirmed."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="w-full bg-gray-200 rounded-full h-2.5"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.5, ease: "linear" }}
              className="bg-primary-dark h-2.5 rounded-full"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-sm text-gray-500 mt-4"
          >
            Redirecting to jobs...
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
