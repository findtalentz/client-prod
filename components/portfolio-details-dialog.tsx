import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Portfolio from "@/schemas/Portfolio";
import { Grid } from "@radix-ui/themes";
import Image from "next/image";

interface Props {
  portfolio: Portfolio;
}

const PortfolioDetailsDialog = ({ portfolio }: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild className="bg-none cursor-pointer">
        <p className="text-xl font-semibold text-primary">{portfolio.title}</p>
      </DialogTrigger>
      <DialogContent className="space-y-6 pt-12 min-w-[90vw] max-h-[90vh] overflow-hidden">
        <Grid columns={{ initial: "1", md: "2fr 3fr" }} style={{ gap: 20 }}>
          <div className="max-h-[90dvh] overflow-y-scroll space-y-8">
            <h2> {portfolio.title} </h2>
            <div>
              <h4 className="mb-2">Skills</h4>
              <ul className="flex items-center gap-4 flex-wrap">
                {portfolio.skills.map((item, key) => (
                  <li key={key}>
                    <Badge variant="outline">{item}</Badge>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-2">Details</h4>
              <p> {portfolio.description} </p>
            </div>
            <div className="h-10" />
          </div>
          <div className="space-y-10 max-h-[90dvh] overflow-y-scroll">
            <div className="w-full max-h-[600px] shadow-xl rounded-2xl overflow-hidden">
              <Image
                src={portfolio.thumbnail}
                width={700}
                height={400}
                alt="Img"
                className="w-full h-full object-cover"
              />
            </div>
            {portfolio.images.map((image, key) => (
              <div
                key={key}
                className="w-full max-h-[600px] shadow-xl rounded-2xl overflow-hidden"
              >
                <Image
                  src={image}
                  width={800}
                  height={600}
                  alt="Img"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            <div className="h-10" />
          </div>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default PortfolioDetailsDialog;
