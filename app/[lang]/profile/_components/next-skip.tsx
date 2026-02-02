import { buttonVariants } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Props {
  next?: string;
  preview?: string;
}

export default function NextSkip({ next, preview }: Props) {
  return (
    <>
      <div className="shadow-2xl shadow-dark w-full bg-secondary fixed left-0 bottom-0">
        <Container
          className={cn(
            "flex items-center h-20",
            next ? "justify-between" : "justify-end"
          )}
        >
          {!preview && next && (
            <Link href={next} className={buttonVariants({ variant: "link" })}>
              Skip For Now
            </Link>
          )}
          {!preview && next && (
            <Link
              href={next}
              className={cn(buttonVariants({ variant: "outline" }), "px-12")}
            >
              Next
            </Link>
          )}
          {preview && (
            <Link
              href={preview}
              className={cn(buttonVariants({ variant: "outline" }), "px-12")}
            >
              Preview
            </Link>
          )}
        </Container>
      </div>
    </>
  );
}
