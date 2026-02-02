import { formatDate } from "@/lib/utils";
import BlogSchema from "@/schemas/Blog";
import { Avatar } from "@radix-ui/themes";
import Image from "next/image";
import Link from "next/link";
import { GoArrowUpRight } from "react-icons/go";

interface Props {
  blog: BlogSchema;
}

function TrendingBlog({ blog }: Props) {
  return (
    <div className="p-1 rounded-3xl shadow border border-gray-100 flex items-center justify-between gap-2">
      <div className="w-full h-full rounded-3xl overflow-hidden">
        <Image
          src={blog.thumbnail}
          width={300}
          height={200}
          alt="Image"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <p className="!text-sm mb-3"> {formatDate(blog.createdAt)} </p>
        <h4 className="mb-1">2024 Design Trends to Watch</h4>
        <p className="mb-2 !text-[15px]">{blog.title}</p>
        <hr />
        <div className="w-full py-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Avatar
              size="2"
              radius="full"
              src={blog.author.image}
              fallback="U"
            />
            <p className="!font-semibold !text-black">
              {blog.author.firstName}
            </p>
          </div>
          <Link
            href={`/blog/${blog._id}`}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 text-xl"
          >
            <GoArrowUpRight />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TrendingBlog;
