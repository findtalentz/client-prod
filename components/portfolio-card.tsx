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
        "bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group",
        isEditable && "relative"
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={portfolio.thumbnail}
          alt={portfolio.title || "Portfolio"}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <div className="p-4">
        <PortfolioDetailsDialog portfolio={portfolio} />
        {portfolio.skills && portfolio.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {portfolio.skills.slice(0, 3).map((skill, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-50 text-gray-500 border border-gray-100"
              >
                {skill}
              </span>
            ))}
            {portfolio.skills.length > 3 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-50 text-gray-500 border border-gray-100">
                +{portfolio.skills.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
      {isEditable && (
        <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link
            href={`/profile/seller/portfolios/${portfolio._id}`}
            className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
          >
            <FiEdit className="w-3.5 h-3.5 text-gray-700" />
          </Link>
          <div className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors">
            <DeleteDialog id={portfolio._id} path="portfolios" />
          </div>
        </div>
      )}
    </div>
  );
}

export default PortfolioCard;
