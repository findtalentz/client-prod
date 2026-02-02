"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { JobSkills, useJobSkillsStore, useStepStore } from "@/store";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";

// ✅ Joi validation schema
const SkillSchema = Joi.object({
  requiredExperienceLevel: Joi.string()
    .valid("entry", "intermediate", "expert")
    .required()
    .messages({
      "string.empty": "Please select experience level",
      "any.only": "Invalid experience level",
    }),
  requiredSkills: Joi.array()
    .items(Joi.string().trim().min(1))
    .min(1)
    .required()
    .messages({
      "array.min": "Please add at least one skill",
      "any.required": "Skills are required",
    }),
});

function Skills() {
  const setStep = useStepStore((s) => s.setStep);
  const { saveSkills, jobSkills } = useJobSkillsStore();
  const router = useRouter();
  const [skillInput, setSkillInput] = useState("");

  const form = useForm<JobSkills>({
    resolver: joiResolver(SkillSchema),
    defaultValues: {
      requiredExperienceLevel: jobSkills?.requiredExperienceLevel ?? "",
      requiredSkills: jobSkills?.requiredSkills ?? [],
    },
  });

  const skills = form.watch("requiredSkills");

  // ✅ Add skill
  const addSkill = () => {
    const newSkill = skillInput.trim();
    if (!newSkill) return;

    if (skills.includes(newSkill)) {
      form.setError("requiredSkills", { message: "Skill already exists" });
      return;
    }

    form.setValue("requiredSkills", [...skills, newSkill]);
    setSkillInput("");
    form.clearErrors("requiredSkills");
  };

  // ✅ Remove skill
  const removeSkill = (skill: string) => {
    const updated = skills.filter((s) => s !== skill);
    form.setValue("requiredSkills", updated);
    if (updated.length === 0) {
      form.setError("requiredSkills", {
        message: "Please add at least one skill",
      });
    }
  };

  // ✅ Handle form submit
  const onSubmit = async (data: JobSkills) => {
    try {
      saveSkills({ ...data, requiredSkills: skills });
      router.push("/dashboard/client/jobs/new/scope-budget");
    } catch (error) {
      console.error("Failed to save skills:", error);
      form.setError("root", {
        message: "Failed to save skills. Please try again.",
      });
    }
  };
  useEffect(() => {
    setStep(2);
  }, [setStep]);

  return (
    <Form {...form}>
      <form className="space-y-6 p-4">
        <h2 className="text-xl font-semibold mb-4">Skills Overview</h2>

        <FormField
          control={form.control}
          name="requiredExperienceLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Required Experience Level *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full border-primary">
                    <SelectValue placeholder="Select Required Experience Level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Required Experience Level</SelectLabel>
                    <SelectItem value="entry">Entry</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Skills Field */}
        <div>
          <FormLabel>Skills *</FormLabel>
          <div className="border border-primary rounded-md flex items-center overflow-hidden mt-2">
            <Input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill();
                }
              }}
              placeholder="Type a skill and press Add"
              className="flex-1 border-none focus-visible:ring-0"
            />
            <Button
              type="button"
              onClick={addSkill}
              className="rounded-none w-20"
            >
              Add
            </Button>
          </div>

          {skills.length > 0 && (
            <div className="pt-4">
              <p className="font-medium mb-2">Added Skills</p>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center gap-1 bg-secondary px-3 py-1 rounded-md text-sm"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="hover:text-destructive transition-colors"
                    >
                      <IoClose />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {form.formState.errors.requiredSkills && (
            <p className="text-destructive text-sm mt-1">
              {form.formState.errors.requiredSkills.message}
            </p>
          )}
        </div>

        {form.formState.errors.root && (
          <p className="text-destructive text-sm">
            {form.formState.errors.root.message}
          </p>
        )}

        <div className="flex items-center justify-between">
          <Link
            onClick={() => saveSkills(form.getValues())}
            href="/dashboard/client/jobs"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Save draft and exit
          </Link>
          <Button onClick={form.handleSubmit(onSubmit)}>Save & Next</Button>
        </div>
      </form>
    </Form>
  );
}

export default Skills;
