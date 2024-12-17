import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

export default function CategoryListing() {
  return (
    <Card className="border-0 py-10 px-4 shadow-none">
      <CardHeader>
        <CardTitle>Loading Categories...</CardTitle>
      </CardHeader>
      <CardContent>
        <Carousel
          opts={{
            align: "start",
            slidesToScroll: 2,
          }}
          className="w-full animate-pulse"
        >
          <CarouselContent>
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem
                key={index}
                className="md:basis-1/4 lg:basis-1/5 my-5"
              >
                <div className="w-full h-36 bg-gray-200 rounded-lg" />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </CardContent>
    </Card>
  );
}
