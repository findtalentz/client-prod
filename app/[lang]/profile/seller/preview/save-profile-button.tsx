"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SaveProfileButton() {
  const router = useRouter();

  const handleSave = () => {
    toast.success("Profile setup completed!");
    router.push("/dashboard/seller");
  };

  return (
    <div className="flex justify-end mt-6">
      <Button onClick={handleSave} size="lg">
        Save & Finish
      </Button>
    </div>
  );
}
