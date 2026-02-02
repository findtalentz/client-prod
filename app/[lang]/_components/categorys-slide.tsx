"use client";
import Category from "@/schemas/Category";
import Image from "next/image";
import Link from "next/link";
import { CgArrowTopRight } from "react-icons/cg";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 6,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 3,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 2,
  },
};

interface Props {
  categorys: Category[];
}

const CategorysSlide = ({ categorys }: Props) => {
  return (
    <div className="my-20 relative">
      <div className="h-full w-20 md:w-40 bg-gradient-to-l from-transparent to-white absolute z-50 left-0" />
      <div className="h-full w-20 md:w-40 bg-gradient-to-r from-transparent to-white absolute z-50 right-0" />
      <Carousel
        responsive={responsive}
        swipeable={true}
        ssr={true}
        infinite={true}
        autoPlaySpeed={1000}
        customTransition="all .5"
        transitionDuration={500}
        containerClass="carousel-container"
        arrows={false}
        dotListClass="custom-dot-list-style"
        itemClass="carousel-item-padding-40-px mx-3"
      >
        {categorys.map((category) => (
          <div
            key={category._id}
            className="rounded-2xl overflow-hidden relative"
          >
            <Image
              src={category.image}
              width={400}
              height={400}
              alt="categoy"
              className="w-full h-full"
            />
            <div className="w-full h-full absolute top-0 left-0 bg-black/10" />
            <div className="absolute bottom-3 w-full px-3 flex items-center justify-between">
              <span className=" text-white text-sm md:text-xl">
                {category.name}
              </span>
              <Link
                href={`/jobs?category=${category._id}`}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white text-black flex items-center justify-center"
              >
                <CgArrowTopRight className="md:text-2xl text-xl" />
              </Link>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default CategorysSlide;
