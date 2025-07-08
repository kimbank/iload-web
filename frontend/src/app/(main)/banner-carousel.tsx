"use client";

import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

import MembershipBanner from "./_banner/membership";
import ApplicationBanner from "./_banner/application";

const Banners = [
  MembershipBanner,
  ApplicationBanner
]

export default function BannerCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  // Auto-scroll functionality
  useEffect(() => {
    if (!api) {
      return;
    }

    const interval = setInterval(() => {
      if (current === count) {
        api.scrollTo(0);
      } else {
        api.scrollNext();
      }
    }, 10000); // 10 초마다 자동 전환

    return () => clearInterval(interval);
  }, [api, current, count]);

  // Keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      api?.scrollTo(index);
    }
  };

  return (
    <section className="flex flex-col items-center w-full">
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          {Banners.map((Element, index) => (
            <CarouselItem key={index}>
              <div className="w-full aspect-[2.18]">
                <Element />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Dots indicator */}
      <div className="flex space-x-2 mt-2" role="tablist" aria-label="Carousel navigation">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            role="tab"
            tabIndex={0}
            className={`w-2 h-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent ${
              index === current - 1 ? "bg-gray-300" : "bg-gray-400"
            }`}
            onClick={() => api?.scrollTo(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-selected={index === current - 1}
          />
        ))}
      </div>
    </section>
  );
}
