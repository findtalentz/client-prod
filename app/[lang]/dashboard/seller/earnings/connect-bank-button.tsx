"use client";

import apiClient from "@/services/api-client";
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
      alert("Something went wrong");
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
