import Navbar from "@/components/navbar";
import Container from "@/components/ui/container";
import { capitalizeFirstLetter, formatDate } from "@/lib/utils";
import ApiResponse from "@/schemas/ApiRespose";
import BlogSchema from "@/schemas/Blog";
import apiClient from "@/services/api-client";
import { Avatar, Grid } from "@radix-ui/themes";
import Image from "next/image";
import Link from "next/link";
import {
  FaArrowLeftLong,
  FaFacebookF,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import OthersBlog from "./others";
import TranslateButton from "./translate-button";
import { Suspense } from "react";
import Loading from "./loading";

interface Props {
  searchParams: Promise<{
    language: "en" | "ch";
  }>;
  params: Promise<{
    id: string;
  }>;
}

export const dynamic = "force-dynamic";

async function BlogDetails({ params, searchParams }: Props) {
  const { id } = await params;
  const { language } = await searchParams;

  const { data } = await apiClient.get<ApiResponse<BlogSchema>>(`/blog/${id}`, {
    params: {
      language,
    },
  });

  const blog = data.data;

  return (
    <Suspense fallback={<Loading />}>
      <Navbar />
      <Container>
        <div className="py-10 flex items-center justify-between">
          <Link
            href="/blog"
            className="cursor-pointer flex items-center gap-1 gorup"
          >
            <FaArrowLeftLong /> <span>Back</span>
          </Link>
          <TranslateButton />
        </div>
        <Grid columns={{ initial: "1", md: "2" }} gap="6">
          <div className="col-span-2">
            <p className="!text-sm">
              Trending. {formatDate(blog.createdAt)}. 5 Mins Read{" "}
            </p>
            <h2> {blog.title} </h2>
          </div>
          <div className="space-y-2 w-full">
            <div className="flex items-center gap-3">
              <Avatar
                size="2"
                radius="full"
                src={blog.author.image}
                fallback="U"
              />
              <div>
                <p className="!font-semibold !text-black">
                  {" "}
                  {blog.author.firstName}{" "}
                </p>
                <p className="!text-sm">
                  {capitalizeFirstLetter(blog.author.role)}, Talentz
                </p>
              </div>
            </div>
          </div>
          <div className="flex h-full justify-end">
            <div className="space-y-2">
              <p>Share</p>
              <div className="flex items-center gap-4">
                <div className="cursor-pointer flex items-center justify-center w-10 h-10 rounded-full border-2 border-black">
                  <FaFacebookF />
                </div>
                <div className="cursor-pointer flex items-center justify-center w-10 h-10 rounded-full border-2 border-black">
                  <FaLinkedinIn />
                </div>
                <div className="cursor-pointer flex items-center justify-center w-10 h-10 rounded-full border-2 border-black">
                  <FaXTwitter />
                </div>
              </div>
            </div>
          </div>
        </Grid>
        <div className="my-10 w-full max-h-[550px] rounded-3xl overflow-hidden">
          <Image
            src={blog.thumbnail}
            width={990}
            height={550}
            alt="blog_image"
            className="w-full h-auto object-cover"
          />
        </div>
        <div className="space-y-10 mb-20 max-w-3xl">
          <Markdown remarkPlugins={[remarkGfm]}>{blog.body}</Markdown>
        </div>
        <OthersBlog />
      </Container>
    </Suspense>
  );
}

export default BlogDetails;
