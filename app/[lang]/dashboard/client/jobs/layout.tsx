import { PropsWithChildren } from "react";
import JobBar from "./job-bar";

export default function JobManagemnetLayout({ children }: PropsWithChildren) {
  return (
    <div>
      <JobBar />
      <div className="py-4">{children}</div>
    </div>
  );
}
