"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, Gift, Star } from "lucide-react";
import AccountSection from "./account-section";
import ReferralsSection from "./referrals-section";
import MyReviewsSection from "./my-reviews-section";

function Settings() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      <Tabs defaultValue="account">
        <TabsList className="mb-6">
          <TabsTrigger value="account" className="gap-2">
            <SettingsIcon className="h-4 w-4" />
            Account
          </TabsTrigger>
          <TabsTrigger value="referrals" className="gap-2">
            <Gift className="h-4 w-4" />
            Referrals
          </TabsTrigger>
          <TabsTrigger value="reviews" className="gap-2">
            <Star className="h-4 w-4" />
            My Reviews
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <AccountSection />
        </TabsContent>

        <TabsContent value="referrals">
          <ReferralsSection />
        </TabsContent>

        <TabsContent value="reviews">
          <MyReviewsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Settings;
