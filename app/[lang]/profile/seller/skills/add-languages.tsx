"use client";
import { queryClient } from "@/app/[lang]/query-client-provider";
import { Button } from "@/components/ui/button";
import useSession from "@/hooks/useSession";
import apiClient from "@/services/api-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { IoAdd, IoClose } from "react-icons/io5";
import { Globe } from "lucide-react";

const suggestedLanguages = [
  { _id: "1", value: "English" },
  { _id: "2", value: "Spanish" },
  { _id: "3", value: "Hindi" },
  { _id: "4", value: "Bangla" },
  { _id: "5", value: "Latin" },
];

export default function AddLanguages() {
  const router = useRouter();
  const [language, setLanguage] = useState("");
  const { data: user } = useSession();

  if (!user) return null;

  const handleAddLanguage = async () => {
    if (!language.trim()) {
      toast.error("Language cannot be empty.");
      return;
    }

    if (user.data.languages?.includes(language)) {
      toast.error("Language already added.");
      return;
    }

    try {
      await apiClient.put(`/users/${user.data._id}`, {
        languages: user.data.languages
          ? [...user.data.languages, language]
          : [language],
      });
      setLanguage("");
      queryClient.invalidateQueries({ queryKey: ["session"] });
      router.refresh();
      toast.success("Language added successfully.");
    } catch (error) {
      toast.error("Failed to add language.");
      console.error("Error adding language:", error);
    }
  };

  const handleRemoveLanguage = async (languageToRemove: string) => {
    try {
      await apiClient.put(`/users/${user.data._id}`, {
        languages: user.data.languages?.filter(
          (lang) => lang !== languageToRemove
        ),
      });
      queryClient.invalidateQueries({ queryKey: ["session"] });
      router.refresh();
      toast.success("Language removed successfully.");
    } catch (error) {
      toast.error("Failed to remove language.");
      console.error("Error removing language:", error);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <Globe className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-gray-900">Languages</h3>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1">
          <input
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddLanguage())}
            className="w-full border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400"
            placeholder="Type a language and press Enter"
          />
        </div>
        <Button onClick={handleAddLanguage} size="sm" className="h-[42px] px-5 rounded-xl">
          <IoAdd className="mr-1" /> Add
        </Button>
      </div>

      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Suggestions</p>
        <div className="flex items-center gap-2 flex-wrap">
          {suggestedLanguages.map((languageItem) => (
            <button
              onClick={() => setLanguage(languageItem.value)}
              key={languageItem._id}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-primary/5 text-primary hover:bg-primary/10 border border-primary/10 transition-colors cursor-pointer"
            >
              {languageItem.value} <IoAdd className="w-3 h-3" />
            </button>
          ))}
        </div>
      </div>

      {user.data.languages && user.data.languages.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
            Added Languages ({user.data.languages.length})
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {user.data.languages.map((lang) => (
              <button
                onClick={() => handleRemoveLanguage(lang)}
                key={lang}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600 border border-gray-200 hover:border-red-200 transition-colors group cursor-pointer"
              >
                {lang}
                <IoClose className="w-3 h-3 text-gray-400 group-hover:text-red-500" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
