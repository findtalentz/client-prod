"use client";

import { DeleteDialog } from "@/components/delete-dialog";
import { formatDate } from "@/lib/utils";
import EducationSchema from "@/schemas/Education";
import { EditEducation } from "./edit-education";

interface Props {
  educations: EducationSchema[];
}

export default function Educations({ educations }: Props) {
  return (
    <div>
      <h3 className="text-primary mb-2">Added education</h3>
      <div className="flex items-center flex-wrap gap-3">
        {educations.map((education) => (
          <div
            key={education._id}
            className="px-4 w-full md:w-[450px] border border-gray-200 rounded-2xl relative my-3"
          >
            <div className="py-8">
              <h4 className="text-primary"> {education.degree} </h4>
              <p className="text-gray-500">{education.institution} </p>
              <div className="flex items-center justify-between w-full">
                {education.endDate && (
                  <p className="mt-3 text-gray-500">
                    Finished: {formatDate(education.endDate, true)}
                  </p>
                )}
              </div>
            </div>
            <div className="absolute top-0 right-0 flex items-center">
              <EditEducation education={education} />
              <DeleteDialog id={education._id} path="educations" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
