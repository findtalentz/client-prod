import { Grid } from "@radix-ui/themes";
import { PropsWithChildren } from "react";
import JopPostSteps from "./steps";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <Grid columns={{ initial: "1", md: "260px 1fr" }} gap="6">
      <div className="rounded-xl border bg-card p-6 h-fit sticky top-6 shadow-sm">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-5">
          Post a Job
        </h2>
        <JopPostSteps />
      </div>
      <div className="rounded-xl border bg-card p-6 shadow-sm">{children}</div>
    </Grid>
  );
};

export default Layout;
