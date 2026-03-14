"use client";

import { ChangePasswordForm } from "@/app/[lang]/dashboard/_components/change-password";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useSession from "@/hooks/useSession";
import { Avatar } from "@radix-ui/themes";
import {
  User,
  Mail,
  MapPin,
  DollarSign,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";

export default function AccountSection() {
  const { data: session } = useSession();
  const user = session?.data;

  return (
    <div className="space-y-6">
      {/* Profile overview */}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Profile Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-5">
              <Avatar
                src={user.image ?? undefined}
                fallback={user.firstName?.[0] ?? "U"}
                size="6"
                radius="full"
              />
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-lg font-semibold">
                    {user.firstName} {user.lastName}
                  </h3>
                  {user.title && (
                    <p className="text-sm text-gray-500">{user.title}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </div>
                  {user.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      {user.location}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats & Verification */}
      {user && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border rounded-xl p-4 flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                ${user.totalSpend?.toFixed(2) || "0.00"}
              </p>
              <p className="text-xs text-gray-500">Total Spent</p>
            </div>
          </div>
          <div className="bg-white border rounded-xl p-4 flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                user.emailStatus === "VERIFIED" ? "bg-green-100" : "bg-red-100"
              }`}
            >
              {user.emailStatus === "VERIFIED" ? (
                <ShieldCheck className="h-5 w-5 text-green-600" />
              ) : (
                <ShieldAlert className="h-5 w-5 text-red-500" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold">{user.emailStatus}</p>
              <p className="text-xs text-gray-500">Email Status</p>
            </div>
          </div>
          <div className="bg-white border rounded-xl p-4 flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                user.identityStatus === "VERIFIED"
                  ? "bg-green-100"
                  : user.identityStatus === "PENDING"
                    ? "bg-yellow-100"
                    : "bg-red-100"
              }`}
            >
              {user.identityStatus === "VERIFIED" ? (
                <ShieldCheck className="h-5 w-5 text-green-600" />
              ) : (
                <ShieldAlert className="h-5 w-5 text-yellow-600" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold">{user.identityStatus}</p>
              <p className="text-xs text-gray-500">Identity Status</p>
            </div>
          </div>
        </div>
      )}

      {/* Change password */}
      <ChangePasswordForm />
    </div>
  );
}
