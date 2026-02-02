import ActionButtons from "@/components/action-buttons";
import Container from "@/components/ui/container";
import Text from "@/components/ui/text";
import Image from "next/image";
import { FaCheckCircle } from "react-icons/fa";

const items = [
  {
    id: 1,
    title: "Diverse Talent Pool",
    description:
      "Access a wide range of freelancers across various fields, from design to programming.",
  },
  {
    id: 2,
    title: "Secure Payments",
    description:
      "Enjoy peace of mind with our secure payment system and escrow services.",
  },
  {
    id: 3,
    title: "Real-Time Collaboration",
    description:
      "Utilize our platform's tools for seamless communication and project management.",
  },
  {
    id: 4,
    title: "Flexible Contracts",
    description:
      "Whether you need a one-time project or ongoing support, we’ve got you covered.",
  },
];

export default function WhyChooseUs() {
  return (
    <section id="why-choose-us">
      <Container className="flex flex-col md:flex-row items-center justify-between gap-10 my-16">
        <div>
          <Image
            src="/login_page_illustration.png"
            width={495}
            height={617}
            alt="why_choose_us"
          />
        </div>
        <div>
          <h1 className="mb-4">Why Choose Us?</h1>
          <div className="flex flex-col gap-6">
            {items.map((item) => (
              <div key={item.id}>
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-primary text-xl" />
                  <h4 className="text-primary">{item.title}</h4>
                </div>
                <Text> {item.description} </Text>
              </div>
            ))}
          </div>
          <ActionButtons className="mt-7" />
        </div>
      </Container>
    </section>
  );
}
