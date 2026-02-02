import { buttonVariants } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { formatDate } from "@/lib/utils";
import ApiResponse from "@/schemas/ApiRespose";
import BlogSchema from "@/schemas/Blog";
import apiClient from "@/services/api-client";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

export const dynamic = "force-dynamic";

async function OthersBlog() {
  const { data } = await apiClient.get<ApiResponse<BlogSchema[]>>("/blog", {
    params: {
      pageSize: 3,
    },
  });

  const blog = data.data;
  return (
    <div className="px-4 flex items-center justify-center flex-col pb-16">
      <div className="text-center mb-10">
        <h1>Other Blog And News</h1>
        <p>Learn and know about the industry</p>
      </div>

      <Container>
        <div className="w-full flex items-center justify-between gap-6 flex-col md:flex-row">
          {blog.map((blog) => (
            <div className="w-full" key={blog._id}>
              <div className="w-full max-h-[200px] rounded-2xl overflow-hidden">
                <Image
                  src={blog.thumbnail}
                  width={300}
                  height={280}
                  alt="blog"
                  className="w-full h-auto"
                />
              </div>
              <div className="mt-2 mb-6">
                <p className="!text-[12px]">
                  {blog.category.name} . {formatDate(blog.createdAt)} . 5 Mins
                  Read
                </p>
                <h4>{blog.title}</h4>
              </div>
              <Link
                href={`/blog/${blog._id}`}
                className="group flex items-center gap-2"
              >
                <p className="!text-black">Read More</p>
                <FaArrowRight className="group-hover:ms-1 transition-all" />
              </Link>
            </div>
          ))}
        </div>
        <div className="w-full flex items-center justify-center mt-16">
          <Link
            className={buttonVariants({ variant: "outline", size: "lg" })}
            href="/blog"
          >
            More Blogs
          </Link>
        </div>
      </Container>
    </div>
  );
}

export default OthersBlog;
