"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, Star } from "lucide-react";
import AccountSection from "./account-section";
import ReviewsReceivedSection from "./reviews-received-section";

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
          <TabsTrigger value="reviews" className="gap-2">
            <Star className="h-4 w-4" />
            Reviews Received
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <AccountSection />
        </TabsContent>

        <TabsContent value="reviews">
          <ReviewsReceivedSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Settings;
