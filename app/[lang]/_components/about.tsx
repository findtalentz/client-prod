import Container from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid } from "@radix-ui/themes";
import Image from "next/image";
import { getDictionary } from "../dictionaries";

interface Props {
  lang: "en" | "ch";
}

async function About({ lang }: Props) {
  const dict = await getDictionary(lang);
  const content = dict.landingPage.about;
  const tabsData = content.dashboard.tabs;

  return (
    <Container className="mt-16">
      <h1 className="text-center"> {content.title} </h1>
      <p className="text-center">{content.subtitle}</p>

      <Grid className="mt-10" columns={{ initial: "1", md: "2" }} gap="6">
        <div className="shadow p-6 rounded-2xl">
          <div className="mb-6">
            <h3>{content.pick.title}</h3>
            <p>{content.pick.subtitle}</p>
          </div>
          <Image src={content.pick.img} width={600} height={500} alt="labout" />
        </div>

        <div className="shadow p-6 rounded-2xl">
          <div className="mb-6">
            <h3> {content.collaboration.title} </h3>
            <p>{content.collaboration.subtitle}</p>
          </div>
          <Image
            src={content.collaboration.img}
            width={600}
            height={500}
            alt="labout"
          />
        </div>

        <div className="shadow p-6 rounded-2xl">
          <div className="mb-6">
            <h3>{content.seamlessClient.title}</h3>
            <p>{content.seamlessClient.subtitle}</p>
          </div>
          <Image
            src={content.seamlessClient.img}
            width={600}
            height={500}
            alt="labout"
          />
        </div>

        <div className="space-y-6">
          <div className="shadow p-6 rounded-2xl">
            <div className="mb-4">
              <h3>{content.revisions.title}</h3>
              <p>{content.revisions.subtitle}</p>
            </div>
            <Image
              src={content.revisions.img}
              width={600}
              height={250}
              alt="labout"
            />
          </div>

          <div className="shadow p-6 rounded-2xl">
            <div className="mb-4">
              <h3>{content.protecting.title}</h3>
              <p>{content.protecting.subtitle}</p>
            </div>
            <Image
              src={content.protecting.img}
              width={600}
              height={250}
              alt="labout"
            />
          </div>
        </div>

        <div className="shadow p-6 rounded-2xl md:col-span-2">
          <Grid gap="6" columns={{ initial: "1", md: "2" }}>
            <div>
              <h2> {content.dashboard.title} </h2>
              <Tabs defaultValue={Object.keys(tabsData)[0]} className="w-full">
                <TabsList className="w-full rounded-full">
                  {Object.keys(tabsData).map((key) => (
                    <TabsTrigger className="rounded-full" key={key} value={key}>
                      {key}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {Object.entries(tabsData).map(([key, value]) => (
                  <TabsContent key={key} value={key}>
                    {value}
                  </TabsContent>
                ))}
              </Tabs>
            </div>
            <Image
              src={content.dashboard.img}
              width={600}
              height={500}
              alt="labout"
            />
          </Grid>
        </div>
      </Grid>
    </Container>
  );
}

export default About;
