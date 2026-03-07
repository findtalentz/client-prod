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
    <div className="space-y-4">
      <h3 className="text-primary font-medium">Skills</h3>
      <div className="border border-gray-300 rounded-xl overflow-hidden flex items-center focus-within:border-primary transition-colors">
        <input
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
          className="flex-1 border-none focus:outline-none py-2.5 px-4 text-sm"
          placeholder="Type a skill and press Enter or click Add"
        />
        <button
          onClick={handleAddSkill}
          className="px-5 py-2.5 bg-primary border-none outline-none text-white text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Add
        </button>
      </div>
      <div>
        <Text size="small" className="text-gray-500">Suggested Skills</Text>
        <div className="flex items-center gap-2 py-2 flex-wrap">
          {suggestedSkills.map((skillItem) => (
            <Button
              onClick={() => setSkill(skillItem.value)}
              size="sm"
              key={skillItem._id}
              variant="light"
              className="text-xs"
            >
              {skillItem.value} <IoAdd />
            </Button>
          ))}
        </div>
      </div>
      {user.data.skills && user.data.skills.length >= 1 && (
        <div>
          <Text size="small" className="text-gray-500">Added Skills</Text>
          <div className="flex items-center gap-2 py-2 flex-wrap">
            {user.data.skills.map((skill, i) => (
              <Button
                onClick={() => handleRemoveSkill(skill)}
                size="sm"
                key={i}
                variant="secondary"
                className="text-xs"
              >
                {skill} <IoClose />
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
