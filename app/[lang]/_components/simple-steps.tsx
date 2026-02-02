import Container from "@/components/ui/container";
import Image from "next/image";
import Steps from "./steps";

const stepsFreelancer = [
  {
    id: 1,
    title: "Create Your Profile",
    description: "Showcase your skills and experience with a standout profile.",
  },
  {
    id: 2,
    title: "Browse Jobs",
    description: "Explore exciting projects that match your expertise.",
  },
  {
    id: 3,
    title: "Submit Proposals",
    description: "Pitch your skills and win projects that inspire you!",
  },
];

const stepsEmployers = [
  {
    id: 1,
    title: "Post Your Project",
    description: "Share your project details and requirements.",
  },
  {
    id: 2,
    title: "Review Proposals",
    description: "Browse through talented freelancers and their proposals.",
  },
  {
    id: 3,
    title: "Choose Your Match",
    description:
      "Select the best fit for your project and start collaborating!",
  },
];

const boxClasses =
  "flex flex-col md:flex-row items-center justify-between w-full max-w-4xl border border-gray-300 rounded-2xl shadow-sm px-6 md:py-4";
const imageBoxClasses = "flex-3 flex justify-center md:justify-start md:mt-10";
const imageClasses = "w-48 md:w-64 h-auto -mt-16 md:mt-0";

export default function SimpleSteps() {
  return (
    <Container className="my-16 md:my-32">
      <h1 className="text-center text-3xl md:text-4xl font-bold md:mb-16 mb-26">
        Simple Steps to Get Started
      </h1>
      <div className="flex flex-col md:flex-row items-center justify-center md:gap-6 gap-32">
        <div className={boxClasses}>
          <div className={imageBoxClasses}>
            <Image
              src="/signup_client.png"
              alt="Employer Steps"
              width={264}
              height={282}
              className={imageClasses}
            />
          </div>
          <Steps
            className="flex-5 md:ml-8"
            title="For Freelancers"
            steps={stepsFreelancer}
          />
        </div>
        <div className={boxClasses}>
          <div className={imageBoxClasses}>
            <Image
              src="/signup_seller.png"
              alt="Employer Steps"
              width={264}
              height={282}
              className={imageClasses}
            />
          </div>
          <Steps
            className="flex-5 md:ml-8"
            title="For Employers"
            steps={stepsEmployers}
          />
        </div>
      </div>
    </Container>
  );
}
