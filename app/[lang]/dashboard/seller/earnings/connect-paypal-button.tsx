"use client";

import apiClient from "@/services/api-client";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { SiPaypal } from "react-icons/si";

export default function ConnectPaypalButton() {
  const [loading, setLoading] = useState(false);

  const connect = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/payment-methods/connect-paypal");

      window.location.href = res.data.url;
    } catch (err) {
      console.error(err);
      const message =
        err instanceof AxiosError
          ? err.response?.data?.message || "Failed to connect PayPal account. Please try again."
          : "Failed to connect PayPal account. Please try again.";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={connect} disabled={loading} variant="outline" className="gap-2">
      <SiPaypal className="h-4 w-4 text-blue-500" />
      {loading ? "Loading..." : "Connect PayPal"}
    </Button>
  );
}
