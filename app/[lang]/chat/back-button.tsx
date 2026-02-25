import { ArrowLeft } from "lucide-react";
import Link from "next/link";

function BackButton() {
  return (
    <Link
      href="/"
      className="absolute top-4 left-4 z-20 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-all duration-200 group"
    >
      <ArrowLeft className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
    </Link>
  );
}

export default BackButton;
