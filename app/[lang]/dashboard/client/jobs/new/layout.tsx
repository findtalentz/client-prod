import { Grid } from "@radix-ui/themes";
import { PropsWithChildren } from "react";
import JopPostSteps from "./steps";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <Grid columns={{ initial: "1", md: "300px 1fr" }}>
      <JopPostSteps />
      <div>{children}</div>
    </Grid>
  );
};

export default Layout;
