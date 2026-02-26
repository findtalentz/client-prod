"use client";
import { queryClient } from "@/app/[lang]/query-client-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useSession from "@/hooks/useSession";
import apiClient from "@/services/api-client";
import { AxiosError } from "axios";
import { Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";

interface Props {
  jobId: string;
}

export function ExtendDeadlineDialog({ jobId }: Props) {
  const [isOpen, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [reqTime, setReqTime] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: user } = useSession();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !jobId) return;
    setLoading(true);
    setError("");

    try {
      await apiClient.post("/comments", {
        job: jobId,
        reqType: "TIME_REQUEST",
        message,
        reqTime,
        seller: user.data._id,
      });

      queryClient.invalidateQueries({ queryKey: ["comments"] });
      toast.success("Deadline extension request submitted");
      setMessage("");
      setReqTime("");
      router.refresh();
      setOpen(false);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        setError(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Clock className="h-4 w-4" />
          Extend Deadline
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Request Deadline Extension
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium leading-none">
              New Delivery Date
            </label>
            <Input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={reqTime}
              onChange={(e) => setReqTime(e.target.value)}
              className="rounded-lg"
              required
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium leading-none">
              Reason for Extension
            </label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Explain why you need more time..."
              rows={4}
              className="rounded-lg"
              required
            />
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                setMessage("");
                setReqTime("");
                setError("");
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !reqTime || !message.trim()}
            >
              {isLoading ? (
                <BeatLoader size={8} color="#ffffff" />
              ) : (
                "Request Extension"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
