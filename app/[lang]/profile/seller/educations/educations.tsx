"use client";

import { DeleteDialog } from "@/components/delete-dialog";
import { formatDate } from "@/lib/utils";
import EducationSchema from "@/schemas/Education";
import { GraduationCap, Calendar } from "lucide-react";
import { EditEducation } from "./edit-education";

interface Props {
  educations: EducationSchema[];
}

export default function Educations({ educations }: Props) {
  return (
    <div className="space-y-3">
      {educations.map((education) => (
        <div
          key={education._id}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4 group hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5 text-primary" />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900">
              {education.degree}
            </h4>
            <p className="text-sm text-gray-500 mt-0.5">{education.institution}</p>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-400">
              <Calendar className="w-3 h-3" />
              <span>
                {formatDate(education.startDate, true)}
                {education.endDate && ` - ${formatDate(education.endDate, true)}`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <EditEducation education={education} />
            <DeleteDialog id={education._id} path="educations" />
          </div>
        </div>
      ))}
    </div>
  );
}
