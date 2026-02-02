"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { FaWallet } from "react-icons/fa6";
import WithdrawForm from "./withdraw-form";

function WithdrawFund() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="mt-4 border bg-transparent text-primary p-2!"
          variant="outline"
        >
          <FaWallet className="mr-2 h-4 w-4" /> Withdraw
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:min-w-[800px]">
        <DialogHeader>
          <DialogTitle>Withdraw Funds</DialogTitle>
        </DialogHeader>

        <WithdrawForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

export default WithdrawFund;
