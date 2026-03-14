"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { handleApiError } from "@/lib/handle-api-error";
import ApiResponse from "@/schemas/ApiRespose";
import User from "@/schemas/User";
import apiClient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";
import { Avatar } from "@radix-ui/themes";
import {
  Gift,
  Mail,
  Clock,
  CheckCircle,
  Users,
  DollarSign,
  Send,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";
import { z } from "zod";

interface Referral {
  _id: string;
  refereeEmail: string;
  referee?: Pick<User, "firstName" | "lastName" | "image">;
  status: "PENDING" | "COMPLETED" | "REWORDED";
  rewardAmount: number;
  completedAt?: string;
  createdAt: string;
}

interface ReferralData {
  referrals: Referral[];
  stats: {
    total: number;
    pending: number;
    completed: number;
    rewarded: number;
    totalEarned: number;
  };
}

const emailSchema = z.string().email("Please enter a valid email address");

export default function ReferralsSection() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const { data, isLoading, refetch } = useQuery<ApiResponse<ReferralData>>({
    queryKey: ["my-referrals"],
    queryFn: () => apiClient.get("/refers/my").then((r) => r.data),
  });

  const stats = data?.data?.stats;
  const referrals = data?.data?.referrals || [];

  const handleSendReferral = async () => {
    try {
      emailSchema.parse(email);
    } catch {
      toast.error("Please enter a valid email address");
      return;
    }

    setSending(true);
    try {
      await apiClient.post("/refers", { refereeEmail: email });
      toast.success("Referral sent successfully!");
      setEmail("");
      refetch();
    } catch (error) {
      handleApiError(error, "Failed to send referral");
    } finally {
      setSending(false);
    }
  };

  const statusConfig = {
    PENDING: {
      label: "Pending",
      className: "bg-yellow-100 text-yellow-700",
      icon: Clock,
    },
    COMPLETED: {
      label: "Signed Up",
      className: "bg-blue-100 text-blue-700",
      icon: CheckCircle,
    },
    REWORDED: {
      label: "Rewarded",
      className: "bg-green-100 text-green-700",
      icon: Gift,
    },
  };

  return (
    <div className="space-y-6">
      {/* Referral invite card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            Refer a Friend & Earn $100
          </CardTitle>
          <CardDescription>
            They get 10% off their first order and you earn up to $100 per
            referral (max $500 total).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="friend@example.com"
              className="flex-1 h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              onKeyDown={(e) => e.key === "Enter" && handleSendReferral()}
            />
            <Button
              onClick={handleSendReferral}
              disabled={sending}
              className="gap-2"
            >
              {sending ? (
                <BeatLoader size={8} color="white" />
              ) : (
                <>
                  <Send className="h-4 w-4" /> Send Invite
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats cards */}
      {!isLoading && stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border rounded-xl p-4 flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-gray-500">Total Referrals</p>
            </div>
          </div>
          <div className="bg-white border rounded-xl p-4 flex items-center gap-3">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.pending}</p>
              <p className="text-xs text-gray-500">Pending</p>
            </div>
          </div>
          <div className="bg-white border rounded-xl p-4 flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <CheckCircle className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.completed}</p>
              <p className="text-xs text-gray-500">Signed Up</p>
            </div>
          </div>
          <div className="bg-white border rounded-xl p-4 flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">${stats.totalEarned}</p>
              <p className="text-xs text-gray-500">Total Earned</p>
            </div>
          </div>
        </div>
      )}

      {/* Referral list */}
      <Card>
        <CardHeader>
          <CardTitle>Referral History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <BeatLoader color="hsl(var(--primary))" />
            </div>
          ) : referrals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Mail className="h-10 w-10 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No referrals yet</p>
              <p className="text-sm mt-1">
                Start inviting friends to earn rewards!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {referrals.map((referral) => {
                const config = statusConfig[referral.status];
                const StatusIcon = config.icon;
                return (
                  <div
                    key={referral._id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {referral.referee ? (
                        <Avatar
                          src={referral.referee.image ?? undefined}
                          fallback={referral.referee.firstName?.[0] ?? "?"}
                          size="3"
                          radius="full"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <Mail className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium">
                          {referral.referee
                            ? `${referral.referee.firstName} ${referral.referee.lastName}`
                            : referral.refereeEmail}
                        </p>
                        <p className="text-xs text-gray-500">
                          Sent{" "}
                          {new Date(referral.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.className}`}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {config.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
