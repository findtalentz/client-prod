"use client";
import { queryClient } from "@/app/[lang]/query-client-provider";
import { Button } from "@/components/ui/button";
import apiClient from "@/services/api-client";
import useSession from "@/hooks/useSession";
import { AxiosError } from "axios";
import { Check, Clock, DollarSign, RefreshCw, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface OfferData {
  _id: string;
  description: string;
  price: number;
  deliveryDays: number;
  revisions: number;
  status: "pending" | "accepted" | "declined" | "withdrawn";
  seller: string;
  buyer: string;
}

interface OfferCardProps {
  offer: OfferData;
  isOwn: boolean;
}

export default function OfferCard({ offer, isOwn }: OfferCardProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<string | null>(null);

  const userId = session?.data._id;
  const isBuyer = userId === offer.buyer?.toString();
  const isSeller = userId === offer.seller?.toString();

  const handleStatusUpdate = async (status: string) => {
    setLoading(status);
    try {
      await apiClient.patch(`/offers/${offer._id}/status`, { status });
      toast.success(
        status === "accepted"
          ? "Offer accepted!"
          : status === "declined"
            ? "Offer declined"
            : "Offer withdrawn"
      );
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Action failed");
      } else {
        toast.error("Action failed");
      }
    } finally {
      setLoading(null);
    }
  };

  const statusColors = {
    pending: "border-amber-200 bg-amber-50",
    accepted: "border-green-200 bg-green-50",
    declined: "border-red-200 bg-red-50",
    withdrawn: "border-gray-200 bg-gray-50",
  };

  const statusBadges = {
    pending: "bg-amber-100 text-amber-700",
    accepted: "bg-green-100 text-green-700",
    declined: "bg-red-100 text-red-700",
    withdrawn: "bg-gray-100 text-gray-500",
  };

  return (
    <div
      className={`w-72 rounded-xl border-2 ${statusColors[offer.status]} overflow-hidden shadow-sm`}
    >
      {/* Header */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Custom Offer
        </span>
        <span
          className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${statusBadges[offer.status]}`}
        >
          {offer.status}
        </span>
      </div>

      {/* Description */}
      <div className="px-4 pb-3">
        <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
          {offer.description}
        </p>
      </div>

      {/* Details grid */}
      <div className="px-4 pb-3 grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center p-2 bg-white/60 rounded-lg">
          <DollarSign className="w-3.5 h-3.5 text-gray-400 mb-0.5" />
          <span className="text-sm font-bold text-gray-900">
            ${offer.price}
          </span>
          <span className="text-[10px] text-gray-400">Price</span>
        </div>
        <div className="flex flex-col items-center p-2 bg-white/60 rounded-lg">
          <Clock className="w-3.5 h-3.5 text-gray-400 mb-0.5" />
          <span className="text-sm font-bold text-gray-900">
            {offer.deliveryDays}
          </span>
          <span className="text-[10px] text-gray-400">
            {offer.deliveryDays === 1 ? "Day" : "Days"}
          </span>
        </div>
        <div className="flex flex-col items-center p-2 bg-white/60 rounded-lg">
          <RefreshCw className="w-3.5 h-3.5 text-gray-400 mb-0.5" />
          <span className="text-sm font-bold text-gray-900">
            {offer.revisions}
          </span>
          <span className="text-[10px] text-gray-400">
            {offer.revisions === 1 ? "Revision" : "Revisions"}
          </span>
        </div>
      </div>

      {/* Actions */}
      {offer.status === "pending" && (
        <div className="px-4 pb-3">
          {isBuyer && (
            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1 h-8 text-xs bg-green-600 hover:bg-green-700 cursor-pointer"
                onClick={() => handleStatusUpdate("accepted")}
                disabled={loading !== null}
              >
                {loading === "accepted" ? (
                  "..."
                ) : (
                  <>
                    <Check className="w-3 h-3 mr-1" /> Accept
                  </>
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 h-8 text-xs border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
                onClick={() => handleStatusUpdate("declined")}
                disabled={loading !== null}
              >
                {loading === "declined" ? (
                  "..."
                ) : (
                  <>
                    <X className="w-3 h-3 mr-1" /> Decline
                  </>
                )}
              </Button>
            </div>
          )}
          {isSeller && isOwn && (
            <Button
              size="sm"
              variant="outline"
              className="w-full h-8 text-xs text-gray-500 cursor-pointer"
              onClick={() => handleStatusUpdate("withdrawn")}
              disabled={loading !== null}
            >
              {loading === "withdrawn" ? "..." : "Withdraw Offer"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
