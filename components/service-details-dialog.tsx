"use client";
import MessageSentButton from "@/components/message-sent-button";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import usePackages from "@/hooks/usePackages";
import useService from "@/hooks/useService";
import useSession from "@/hooks/useSession";
import { Grid } from "@radix-ui/themes";
import Image from "next/image";
import { useState } from "react";
import { GoDotFill } from "react-icons/go";

interface Props {
  id: string;
}

const ServiceDetailsDialog = ({ id }: Props) => {
  const { data: service } = useService(id);
  const { data: packages } = usePackages(id);
  const [isOpen, setIsOpen] = useState(false);
  const { data: user } = useSession();

  if (!service || !packages) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>View Details</Button>
      </DialogTrigger>
      <DialogContent className="space-y-6 pt-12 min-w-[90vw] max-h-[90vh] overflow-hidden">
        <Grid columns={{ initial: "1", md: "1fr 350px" }} style={{ gap: 20 }}>
          <div className="max-h-[90dvh] overflow-y-scroll space-y-8 px-6">
            <div className="space-y-8">
              <div className="text-center md:text-left">
                <h2>{service.data.title}</h2>
              </div>
              <div className="w-full h-[250px] sm:h-[350px] lg:h-[650px] rounded-3xl overflow-hidden relative transition-transform duration-500 ease-out">
                <Image
                  src={service.data.image}
                  fill
                  alt={service.data.title}
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  priority
                />
                <div className="absolute inset-0 bg-black/15 group-hover:bg-black/5 transition-colors duration-300" />
              </div>

              <Grid
                columns={{ initial: "1", sm: "2", md: "3" }}
                style={{ gap: "4" }}
                className="gap-4 sm:gap-6"
              >
                {/* Details Card */}
                <div className="p-5 sm:p-6 rounded-2xl border border-gray-200 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-7 bg-primary rounded-full"></div>
                    <h4 className="font-bold text-lg sm:text-xl text-gray-800">
                      Details
                    </h4>
                  </div>
                  <ul className="space-y-2 text-sm sm:text-base">
                    {service.data.details.map((item, key) => (
                      <li
                        key={key}
                        className="flex items-start gap-2 text-gray-600"
                      >
                        <GoDotFill className="text-primary mt-1 shrink-0 text-sm sm:text-base" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tools Card */}
                <div className="p-5 sm:p-6 rounded-2xl border border-gray-200 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-7 bg-blue-500 rounded-full"></div>
                    <h4 className="font-bold text-lg sm:text-xl text-gray-800">
                      Tools
                    </h4>
                  </div>
                  <ul className="space-y-2 text-sm sm:text-base">
                    {service.data.tools.map((item, key) => (
                      <li
                        key={key}
                        className="flex items-start gap-2 text-gray-600"
                      >
                        <GoDotFill className="text-blue-500 mt-1 shrink-0 text-sm sm:text-base" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Features Card */}
                <div className="p-5 sm:p-6 rounded-2xl border border-gray-200 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center gap-2 mb-4">
                    <h4 className="font-bold text-lg sm:text-xl text-gray-800">
                      Features
                    </h4>
                  </div>
                  <ul className="space-y-2 text-sm sm:text-base">
                    {service.data.features.map((item, key) => (
                      <li
                        key={key}
                        className="flex items-start gap-2 text-gray-600"
                      >
                        <GoDotFill className="text-green-500 mt-1 shrink-0 text-sm sm:text-base" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Grid>

              {/* Description */}
              <div className="p-5 sm:p-6 rounded-2xl border border-gray-200 bg-white">
                <h3 className="font-bold text-xl sm:text-2xl text-gray-800 mb-4">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
                  {service.data.description}
                </p>
              </div>
            </div>
            <div className="h-16" />
          </div>

          {/* Packages Sidebar */}
          <div className="max-h-[90dvh] overflow-y-scroll space-y-8">
            <div className="space-y-8 py-6">
              {packages.data.map((d) => (
                <div
                  key={d._id}
                  className="border p-6 rounded-2xl relative transition-all duration-300 hover:shadow hover:-translate-y-1"
                >
                  <div className="flex w-full items-center justify-between mb-4">
                    <h4 className="text-xl sm:text-2xl font-bold">{d.label}</h4>
                    <div className="text-right">
                      <span className="text-2xl sm:text-3xl font-bold">
                        ${d.price}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-3 text-sm sm:text-base">
                    {d.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-2.5 h-2.5 bg-primary rounded-full mt-2 shrink-0"></div>
                        <span className="leading-relaxed">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {user && user.data.role === "CLIENT" && (
                <MessageSentButton
                  seller={service.data.userId}
                  label={"Get Started"}
                  className="w-full"
                  size="lg"
                />
              )}
            </div>
            <div className="h-10" />
          </div>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceDetailsDialog;
