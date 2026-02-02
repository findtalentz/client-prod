import Navbar from "@/components/navbar";
import Container from "@/components/ui/container";

export default function Loading() {
  return (
    <>
      <Navbar />
      <Container>
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-1/3 bg-gray-300 rounded" />
          <div className="h-8 w-2/3 bg-gray-300 rounded" />
          <div className="h-[300px] w-full bg-gray-300 rounded-3xl" />
          <div className="space-y-3">
            <div className="h-4 w-full bg-gray-300 rounded" />
            <div className="h-4 w-5/6 bg-gray-300 rounded" />
            <div className="h-4 w-2/3 bg-gray-300 rounded" />
          </div>
        </div>
      </Container>
    </>
  );
}
