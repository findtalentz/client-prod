"use client";
import usePackages from "@/hooks/usePackages";
import useSession from "@/hooks/useSession";
import { cn } from "@/lib/utils";
import Service from "@/schemas/Service";
import Image from "next/image";
import Link from "next/link";
import { FiEdit } from "react-icons/fi";
import { DeleteDialog } from "./delete-dialog";
import ServiceDetailsDialog from "./service-details-dialog";
import { Check } from "lucide-react";

interface Props {
  service: Service;
}

function ServiceCard({ service }: Props) {
  const { data: packages } = usePackages(service._id);
  const { data: session } = useSession();
  const isEditable = session && service.userId === session.data._id;

  const basicPackage = packages?.data.find((p) => p.label === "Basic");

  return (
    <div
      className={cn(
        "bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group",
        isEditable && "relative"
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={service.image}
          alt={service.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <div className="p-4 space-y-3">
        <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">
          {service.title}
        </h4>
        <ul className="space-y-1.5">
          {service.details.slice(0, 3).map((detail, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
              <Check className="w-3 h-3 text-green-500 mt-0.5 shrink-0" />
              <span className="line-clamp-1">{detail}</span>
            </li>
          ))}
        </ul>
        {basicPackage && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-50">
            <div>
              <p className="text-xs text-gray-400">Starting at</p>
              <span className="text-lg font-bold text-gray-900">${basicPackage.price}</span>
            </div>
            <ServiceDetailsDialog id={service._id} />
          </div>
        )}
      </div>
      {isEditable && (
        <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link
            href={`/profile/seller/services/${service._id}`}
            className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
          >
            <FiEdit className="w-3.5 h-3.5 text-gray-700" />
          </Link>
          <div className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors">
            <DeleteDialog id={service._id} path="services" />
          </div>
        </div>
      )}
    </div>
  );
}

export default ServiceCard;
