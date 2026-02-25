import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import Container from "@/components/ui/container";
import { getDictionary } from "../dictionaries";

interface Props {
  params: Promise<{
    lang: "en" | "ch";
  }>;
}

async function PrivacyPolicy({ params }: Props) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const { title, lastUpdated, sections } = dict.privacyPage;

  return (
    <>
      <Navbar />
      <Container>
        <div className="mx-auto max-w-4xl py-16">
          <h1 className="mb-2 text-4xl font-bold">{title}</h1>
          <p className="mb-10 text-sm text-muted-foreground">{lastUpdated}</p>

          <div className="space-y-8">
            {sections.map(
              (
                section: {
                  heading: string;
                  content?: string;
                  items?: string[];
                  contactInfo?: string[];
                },
                index: number
              ) => (
                <section key={index}>
                  <h2 className="mb-3 text-xl font-semibold">
                    {section.heading}
                  </h2>
                  {section.content && (
                    <p className="leading-7 text-muted-foreground">
                      {section.content}
                    </p>
                  )}
                  {section.items && (
                    <ul className="mt-2 list-disc space-y-1 pl-6 text-muted-foreground">
                      {section.items.map((item: string, i: number) => (
                        <li key={i} className="leading-7">
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.contactInfo && (
                    <ul className="mt-2 space-y-1 text-muted-foreground">
                      {section.contactInfo.map((info: string, i: number) => (
                        <li key={i} className="leading-7">
                          {info}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              )
            )}
          </div>
        </div>
      </Container>
      <Footer lang={lang} />
    </>
  );
}

export default PrivacyPolicy;
