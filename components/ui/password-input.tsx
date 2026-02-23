"use client";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { ComponentProps, useState } from "react";

type Props = Omit<ComponentProps<typeof Input>, "type">;

export default function PasswordInput(props: Props) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input type={showPassword ? "text" : "password"} {...props} />
      <button
        type="button"
        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
