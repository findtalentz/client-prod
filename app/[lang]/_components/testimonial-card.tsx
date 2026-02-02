import Text from "@/components/ui/text";
import { Avatar } from "@radix-ui/themes";

export default function TestimonialCard() {
  return (
    <div className="border border-gray-300 p-4 md:p-2 rounded-2xl space-y-2">
      <div className="flex items-center gap-2">
        <Avatar src="/me.jpg" fallback="Me" />
        <div className="-space-y-1">
          <h4>Herdoy Almamun</h4>
          <Text variant="gray">Web Developer</Text>
        </div>
      </div>
      <p>
        Lorem ipsum dolor sit amet consectetur. Mattis vulputate aenean ornare
        sed ultricies arcu varius sed dictum. Augue duis mi quam senectus.
        Rhoncus vitae elit elementum amet aliquam. Fames leo justo condimentum
        ut tincidunt bibendum.
      </p>
    </div>
  );
}
