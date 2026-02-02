import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import SearchBox from "@/components/search-box";
import Container from "@/components/ui/container";
import ApiResponse from "@/schemas/ApiRespose";
import BlogSchema from "@/schemas/Blog";
import apiClient from "@/services/api-client";
import { Grid } from "@radix-ui/themes";
import { getDictionary } from "../dictionaries";
import BlogCard from "./_components/blog-card";
import TrendingBlog from "./_components/trending-blog";

interface Props {
  searchParams: Promise<{
    search: string;
    orderBy: string;
  }>;
  params: Promise<{
    lang: "en" | "ch";
  }>;
}

export const dynamic = "force-dynamic";

async function BlogsPage({ searchParams, params }: Props) {
  const paramsSearch = await searchParams;
  const langParams = await params;
  const search = paramsSearch.search ? paramsSearch.search : null;
  const { data } = await apiClient.get<ApiResponse<BlogSchema[]>>("/blog", {
    params: {
      pageSize: 6,
      search,
    },
  });
  const { data: trending } = await apiClient.get<ApiResponse<BlogSchema[]>>(
    "/blog",
    {
      params: {
        pageSize: 4,
      },
    }
  );

  const dict = await getDictionary(langParams.lang);

  return (
    <>
      <Navbar />
      <Container>
        <div className="pt-26 pb-10 flex items-center justify-center flex-col gap-4">
          <div className="flex items-center justify-center flex-col max-w-[500px]">
            <h1 className="text-center"> {dict.blogPage.title} </h1>
            <p className="text-center">{dict.blogPage.subtitle}</p>
            <div className="w-full mt-6">
              <SearchBox />
            </div>
          </div>
        </div>
        <Grid columns={{ initial: "1", md: "3" }} gap="6" className="pb-16">
          {data.data.map((blog) => (
            <BlogCard blog={blog} key={blog._id} />
          ))}
        </Grid>
        <div className="flex items-center justify-center pb-20">
          <button className="bg-gray-50 !px-6 !py-4 rounded-xl !border-gray-200 border font-[500]">
            {dict.blogPage.button}
          </button>
        </div>

        <div className="mb-26 flex items-center justify-center">
          <h1>{dict.blogPage.trending}</h1>
        </div>

        <Grid columns={{ initial: "1", md: "2" }} gap="6" className="mb-26">
          {trending.data.map((blog) => (
            <TrendingBlog key={blog._id} blog={blog} />
          ))}
        </Grid>
      </Container>
      <Footer lang={langParams.lang} />
    </>
  );
}

export default BlogsPage;
