import { getDictionary } from "@/app/[lang]/dictionaries";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQProps {
  lang: "en" | "ch";
}

async function FAQ({ lang }: FAQProps) {
  const dict = await getDictionary(lang);
  const content = dict.faq;
  return (
    <div className="my-20">
      <div className="w-full flex items-center justify-center flex-col">
        <h1 className="text-center"> {content.title} </h1>
        <p>{content.subtitle}</p>
      </div>
      <div className="py-10 space-y-4">
        <Accordion
          type="single"
          collapsible
          className="bg-gray-50 p-4 rounded-2xl"
        >
          {content.items.map((item) => (
            <AccordionItem key={item.id} value={`item-${item.id}`}>
              <AccordionTrigger className="md:text-xl">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="md:text-[17px]">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}

export default FAQ;
