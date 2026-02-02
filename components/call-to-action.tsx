import { getDictionary } from "@/app/[lang]/dictionaries";
import ActionButtons from "@/components/action-buttons";
import Container from "@/components/ui/container";

interface Props {
  lang: "en" | "ch";
}

export default async function CallToAction({ lang }: Props) {
  const dict = await getDictionary(lang);
  const content = dict.hirePage;
  return (
    <Container>
      <div className="bg-[url('/call_to_action_bg.png')] bg-cover bg-no-repeat bg-center h-auto md:h-[351px] w-full flex items-center justify-center rounded-4xl md:my-32 px-4 py-8">
        <div className="flex items-center justify-center flex-col gap-8">
          <div className="flex items-center justify-center flex-col gap-4 md:gap-1">
            <h1 className="!text-yellow text-center">{content.title}</h1>
            <p className="!text-white text-center max-w-[700px]">
              {content.subtitle}
            </p>
          </div>
          <ActionButtons isAllSecondary={true} className="justify-center" />
        </div>
      </div>
    </Container>
  );
}
