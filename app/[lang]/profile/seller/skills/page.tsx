import AddLanguages from "./add-languages";
import AddSkills from "./add-skills";

export default function SkillsLanguages() {
  return (
    <div className="mb-30">
      <h2 className="mb-5">Skills & Languages</h2>
      <AddSkills />
      <AddLanguages />
    </div>
  );
}
