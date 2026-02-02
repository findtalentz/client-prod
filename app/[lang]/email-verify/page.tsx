import { Flex } from "@radix-ui/themes";
import { InputOTPForm } from "./input-otp";

function Verify() {
  return (
    <Flex align="center" justify="center" className="h-dvh">
      <div className="flex items-center justify-center flex-col gap-6">
        <InputOTPForm />
      </div>
    </Flex>
  );
}

export default Verify;
