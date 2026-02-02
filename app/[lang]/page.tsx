import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import ApiResponse from "@/schemas/ApiRespose";
import Category from "@/schemas/Category";
import apiClient from "@/services/api-client";
import About from "./_components/about";
import BlogNews from "./_components/blog-news";
import CategorySlide from "./_components/categorys-slide";
import Hero from "./_components/hero";
import HowTtWorks from "./_components/how-it-works";
import Partner from "./_components/partner";
import Testimonials from "./_components/testimonials";
import Tools from "./_components/tools";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{
    lang: "en" | "ch";
  }>;
}

export default async function Home({ params }: Props) {
  const { lang } = await params;
  const { data: categoryData } = await apiClient.get<ApiResponse<Category[]>>(
    "/categorys/job"
  );
  return (
    <div className="bg-[#e7e7e7]">
      <Navbar />
      <Hero lang={lang} />
      {categoryData && <CategorySlide categorys={categoryData.data} />}
      <HowTtWorks lang={lang} />
      <About lang={lang} />
      <Partner lang={lang} />
      <Tools lang={lang} />
      <Testimonials lang={lang} />
      <BlogNews lang={lang} />
      <Footer lang={lang} />
    </div>
  );
}
