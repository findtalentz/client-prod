"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SaveProfileButton() {
  const { lang } = useParams();
  const router = useRouter();

  const handleSave = () => {
    toast.success("Profile setup completed!");
    router.push(`/${lang}/dashboard/seller`);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
          <CheckCircle className="w-5 h-5 text-green-500" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">Ready to go!</p>
          <p className="text-xs text-gray-500">
            Your profile looks great. Save and start getting clients.
          </p>
        </div>
      </div>
      <Button onClick={handleSave} size="lg" className="w-full sm:w-auto">
        Save & Finish
      </Button>
    </div>
  );
}
