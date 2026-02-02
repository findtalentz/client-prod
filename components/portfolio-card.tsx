"use client";
import useSession from "@/hooks/useSession";
import { cn } from "@/lib/utils";
import Portfolio from "@/schemas/Portfolio";
import Image from "next/image";
import Link from "next/link";
import { FiEdit } from "react-icons/fi";
import { DeleteDialog } from "./delete-dialog";
import PortfolioDetailsDialog from "./portfolio-details-dialog";

interface Props {
  portfolio: Portfolio;
}

function PortfolioCard({ portfolio }: Props) {
  const { data: session } = useSession();
  const isEditable = session && portfolio.author._id === session.data._id;
  return (
    <div
      className={cn(
        "border rounded-2xl overflow-hidden",
        isEditable && "relative pb-8"
      )}
    >
      <Image
        width={305}
        height={220}
        src={portfolio.thumbnail}
        alt="Portfolio"
        className="object-cover w-full! h-[250px] shadow"
      />
      <div className="px-2 py-4">
        <PortfolioDetailsDialog portfolio={portfolio} />
      </div>
      {isEditable && (
        <div className="absolute bottom-3 right-3 flex items-center gap-4">
          <Link href={`/profile/seller/portfolios/${portfolio._id}`}>
            <FiEdit />
          </Link>
          <DeleteDialog id={portfolio._id} path="portfolios" />
        </div>
      )}
    </div>
  );
}

export default PortfolioCard;
