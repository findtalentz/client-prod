"use client";
import { queryClient } from "@/app/[lang]/query-client-provider";
import { Button } from "@/components/ui/button";
import Text from "@/components/ui/text";
import useSession from "@/hooks/useSession";
import apiClient from "@/services/api-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { IoAdd, IoClose } from "react-icons/io5";

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
    <div>
      <h3 className="text-primary mb-2">Languages</h3>
      <div className="border border-primary rounded-xl overflow-hidden flex items-center justify-between">
        <input
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddLanguage()}
          className="flex-1 border-none focus:outline-none py-2 ps-3"
          placeholder="Search languages..."
        />
        <button
          onClick={handleAddLanguage}
          className="w-20 py-2 bg-primary border-none outline-none text-white flex items-center justify-center gap-1"
        >
          Add
        </button>
      </div>

      <div className="py-4">
        <Text size="small">Suggested Languages</Text>
        <div className="flex items-center gap-4 py-3 flex-wrap">
          {suggestedLanguages.map((languageItem) => (
            <Button
              onClick={() => setLanguage(languageItem.value)}
              size="sm"
              variant="light"
              key={languageItem._id}
            >
              {languageItem.value} <IoAdd className="text-xs" />
            </Button>
          ))}
        </div>
      </div>

      {user.data.languages && user.data.languages.length > 0 && (
        <div className="py-4">
          <Text size="small">Added Languages</Text>
          <div className="flex items-center gap-4 py-3 flex-wrap">
            {user.data.languages.map((lang) => (
              <Button
                onClick={() => handleRemoveLanguage(lang)}
                size="sm"
                variant="secondary"
                key={lang}
              >
                {lang} <IoClose className="text-xs" />
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
