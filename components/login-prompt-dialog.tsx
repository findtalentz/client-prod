"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LoginPromptDialog({ open, onOpenChange }: Props) {
  const { lang } = useParams();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader className="items-center">
          <Image
            src="/logo_icon.png"
            alt="Talentz"
            width={60}
            height={60}
            className="mx-auto mb-2"
          />
          <DialogTitle>Login Required</DialogTitle>
          <DialogDescription>
            You need to be logged in to perform this action. Please log in or
            create an account to continue.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-4">
          <Button asChild>
            <Link href={`/${lang}/log-in`}>Log In</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/${lang}/sign-up`}>Create Account</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
