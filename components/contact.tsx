import Container from "@/components/ui/container";
import Text from "@/components/ui/text";
import { IoMail } from "react-icons/io5";
import { MdPhone } from "react-icons/md";
import ContactForm from "./contact-form";

export default function Contact() {
  return (
    <section id="contact">
      <Container className="flex flex-col lg:flex-row items-start gap-12 lg:gap-0 justify-between my-32">
        <div className="flex-1 space-y-9">
          <div>
            <h2>Contact Us</h2>
            <Text>Have Questions? We&apos;re Here to Help!</Text>
          </div>
          <div className="flex flex-col items-start gap-3">
            <div className="flex items-center gap-2">
              <IoMail className="text-xl text-primary" />
              <Text>info@talentz.com</Text>
            </div>
            <div className="flex items-center gap-2">
              <MdPhone className="text-xl text-primary" />
              <Text>(+852) 1234 5678</Text>
            </div>
          </div>
        </div>
        <div className="lg:flex-2 flex-1 w-full">
          <ContactForm />
        </div>
      </Container>
    </section>
  );
}
