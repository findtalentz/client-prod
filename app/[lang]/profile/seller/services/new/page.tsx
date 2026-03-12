import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ServiceFormPage from "../_components/service-form";

interface Props {
  params: Promise<{ lang: string }>;
}

async function NewService({ params }: Props) {
  const { lang } = await params;
  return (
    <div className="pb-20 space-y-6">
      <div>
        <Link
          href={`/${lang}/profile/seller/services`}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to services
        </Link>
        <h2 className="text-xl font-semibold text-gray-900">Add New Service</h2>
        <p className="text-sm text-gray-500 mt-1">
          Describe your service and set up pricing
        </p>
      </div>
      <ServiceFormPage />
    </div>
  );
}

export default NewService;
