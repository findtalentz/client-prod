import ContactForm from "@/components/contact-form";
import FAQ from "@/components/faq";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import Container from "@/components/ui/container";
import { GoMail } from "react-icons/go";
import { getDictionary } from "../dictionaries";

interface Props {
  params: Promise<{
    lang: "en" | "ch";
  }>;
}

async function ContactPage({ params }: Props) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const content = dict.contact;
  return (
    <div className="bg-[#F4F6F6]">
      <Navbar />
      <Container>
        <div className="py-20 w-full flex items-center justify-center">
          <div className="max-w-[650px]">
            <h1 className="text-center">{content.title}</h1>
            <p className="text-center">{content.subtitle}</p>
          </div>
        </div>
        <div className="w-full flex items-center justify-center">
          <div className="w-[650px] bg-white p-5 rounded-2xl ">
            <ContactForm />
          </div>
        </div>
        <div className="bg-gray-50 py-10 flex items-center justify-center md:mt-30 mt-10 rounded-2xl">
          <div className="w-full md:w-[650px] flex md:items-center items-start gap-10 justify-between flex-col md:flex-row">
            <div className="flex-1 flex items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                <GoMail className="text-3xl text-white" />
              </div>
              <div>
                <h4>Enquires</h4>
                <p>support@findtalentz.com</p>
              </div>
            </div>

            <div className="flex-1 flex items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                <GoMail className="text-3xl text-white" />
              </div>
              <div>
                <h4>Business Enquires </h4>
                <p>info@findtalentz.com</p>
              </div>
            </div>
          </div>
        </div>
        <FAQ lang={lang} />
      </Container>
      <Footer lang={lang} />
    </div>
  );
}

export default ContactPage;
