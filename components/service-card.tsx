"use client";
import usePackages from "@/hooks/usePackages";
import useSession from "@/hooks/useSession";
import { cn } from "@/lib/utils";
import Service from "@/schemas/Service";
import Image from "next/image";
import Link from "next/link";
import { FiEdit } from "react-icons/fi";
import { GoDotFill } from "react-icons/go";
import { DeleteDialog } from "./delete-dialog";
import ServiceDetailsDialog from "./service-details-dialog";

interface Props {
  service: Service;
}

function ServiceCard({ service }: Props) {
  const { data: packages } = usePackages(service._id);
  const { data: session } = useSession();
  const isEditable = session && service.userId === session.data._id;

  return (
    <div
      className={cn(
        "border rounded-2xl overflow-hidden shadow-2xl",
        isEditable && "relative pb-10"
      )}
    >
      <Image
        src={service.image}
        alt={service.title}
        width={350}
        height={200}
        className="object-cover w-full! h-[250px] shadow"
      />
      <div className="px-2 py-4 space-y-3">
        <h4 className="text-xl font-semibold text-primary">{service.title}</h4>
        <ul className="space-y-1">
          {service.details.slice(0, 3).map((detail, i) => (
            <li key={i} className="flex items-center gap-1 text-gray-500">
              <GoDotFill size={10} /> {detail}
            </li>
          ))}
        </ul>
        {packages &&
          packages.data.map((p) => {
            if (p.label === "Basic")
              return (
                <div key={p._id} className="flex flex-col gap-3">
                  <span className="text-3xl font-semibold"> ${p.price} </span>
                  <ServiceDetailsDialog id={service._id} />
                </div>
              );
          })}
      </div>
      {isEditable && (
        <div className="absolute bottom-3 right-3 flex items-center gap-4">
          <Link href={`/profile/seller/services/${service._id}`}>
            <FiEdit />
          </Link>
          <DeleteDialog id={service._id} path="services" />
        </div>
      )}
    </div>
  );
}

export default ServiceCard;
