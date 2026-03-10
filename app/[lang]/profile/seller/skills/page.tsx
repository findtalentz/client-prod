import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import AddLanguages from "./add-languages";
import AddSkills from "./add-skills";

export default function SkillsLanguages() {
  return (
    <div className="pb-20 space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold text-gray-900">Skills & Languages</h2>
        </div>
        <p className="text-sm text-gray-500">
          Add your expertise and languages to help clients find you
        </p>
      </div>
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <AddSkills />
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <AddLanguages />
        </div>
      </div>
      <div className="flex justify-end">
        <Link
          className={buttonVariants({ size: "lg" }) + " gap-2"}
          href="/profile/seller/educations"
        >
          Continue <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
