"use client";
import Education from "@/schemas/Education";
import { EducationFormDialog } from "./education-form-dialog";

interface EditEducationProps {
  education: Education;
}

export function EditEducation({ education }: EditEducationProps) {
  return <EducationFormDialog education={education} />;
}
