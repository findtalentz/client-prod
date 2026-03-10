"use client";
import { queryClient } from "@/app/[lang]/query-client-provider";
import { Button } from "@/components/ui/button";
import useSession from "@/hooks/useSession";
import apiClient from "@/services/api-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { IoAdd, IoClose } from "react-icons/io5";
import { Wrench } from "lucide-react";

const suggestedSkills = [
  { _id: "1", value: "Figma" },
  { _id: "2", value: "UX Design" },
  { _id: "3", value: "UI Design" },
  { _id: "4", value: "Visual Design" },
  { _id: "5", value: "Interaction Design" },
];

export default function AddSkills() {
  const [skill, setSkill] = useState("");
  const { data: user } = useSession();
  const router = useRouter();

  if (!user) return null;

  const handleAddSkill = async () => {
    if (!skill.trim()) {
      toast.error("Skill cannot be empty.");
      return;
    }

    if (user.data.skills && user.data.skills.includes(skill)) {
      toast.error("Skill already added.");
      return;
    }

    try {
      await apiClient.put(`/users/${user.data._id}`, {
        skills: user.data.skills ? [...user.data.skills, skill] : [skill],
      });
      setSkill("");
      queryClient.invalidateQueries({ queryKey: ["session"] });
      router.refresh();
      toast.success("Skill added successfully.");
    } catch (error) {
      toast.error("Failed to add skill.");
      console.error("Error adding skill:", error);
    }
  };

  const handleRemoveSkill = async (skillToRemove: string) => {
    try {
      await apiClient.put(`/users/${user.data._id}`, {
        skills: user.data.skills?.filter((s) => s !== skillToRemove),
      });
      queryClient.invalidateQueries({ queryKey: ["session"] });
      router.refresh();
      toast.success("Skill removed successfully.");
    } catch (error) {
      toast.error("Failed to remove skill.");
      console.error("Error removing skill:", error);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <Wrench className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-gray-900">Skills</h3>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <input
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
            className="w-full border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400"
            placeholder="Type a skill and press Enter"
          />
        </div>
        <Button onClick={handleAddSkill} size="sm" className="h-[42px] px-5 rounded-xl">
          <IoAdd className="mr-1" /> Add
        </Button>
      </div>

      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Suggestions</p>
        <div className="flex items-center gap-2 flex-wrap">
          {suggestedSkills.map((skillItem) => (
            <button
              onClick={() => setSkill(skillItem.value)}
              key={skillItem._id}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-primary/5 text-primary hover:bg-primary/10 border border-primary/10 transition-colors cursor-pointer"
            >
              {skillItem.value} <IoAdd className="w-3 h-3" />
            </button>
          ))}
        </div>
      </div>

      {user.data.skills && user.data.skills.length >= 1 && (
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
            Added Skills ({user.data.skills.length})
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {user.data.skills.map((skill, i) => (
              <button
                onClick={() => handleRemoveSkill(skill)}
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600 border border-gray-200 hover:border-red-200 transition-colors group cursor-pointer"
              >
                {skill}
                <IoClose className="w-3 h-3 text-gray-400 group-hover:text-red-500" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
