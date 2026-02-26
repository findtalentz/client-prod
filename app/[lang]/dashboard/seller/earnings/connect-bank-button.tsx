"use client";

import apiClient from "@/services/api-client";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ConnectBankButton() {
  const [loading, setLoading] = useState(false);

  const connect = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/stripe/connect-bank");

      window.location.href = res.data.url;
    } catch (err) {
      console.error(err);
      const message =
        err instanceof AxiosError
          ? err.response?.data?.message || "Failed to connect bank account. Please try again."
          : "Failed to connect bank account. Please try again.";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={connect} disabled={loading}>
      {loading ? "Loading..." : "Add Bank Account"}
    </Button>
  );
}
