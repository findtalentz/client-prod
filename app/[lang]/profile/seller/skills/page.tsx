import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import AddLanguages from "./add-languages";
import AddSkills from "./add-skills";

export default function SkillsLanguages() {
  return (
    <div className="pb-20">
      <h2 className="mb-5 text-primary font-semibold">Skills & Languages</h2>
      <div className="space-y-8">
        <AddSkills />
        <AddLanguages />
      </div>
      <div className="flex justify-end mt-8">
        <Link
          className={buttonVariants()}
          href="/profile/seller/educations"
        >
          Next
        </Link>
      </div>
    </div>
  );
}
