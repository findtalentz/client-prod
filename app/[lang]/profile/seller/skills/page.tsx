import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import AddLanguages from "./add-languages";
import AddSkills from "./add-skills";

export default function SkillsLanguages() {
  return (
    <div className="mb-30">
      <h2 className="mb-5">Skills & Languages</h2>
      <AddSkills />
      <AddLanguages />
      <div className="flex justify-end mt-6">
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
