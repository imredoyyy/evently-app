import Container from "@/components/layout/container";

import HeroBg from "@/assets/hero.webp";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const Hero = () => {
  return (
    <Container id="hero">
      <div className="relative rounded-xl h-full w-full min-h-[90svh] overflow-hidden flex justify-center items-center md:min-h-[75svh] shadow-sm shadow-muted-foreground/15">
        {/* Hero Bg Image */}
        <div
          style={{ backgroundImage: `url(${HeroBg.src})` }}
          className="after:content-[''] before:content-[''] hero-overlay"
        />

        {/* Hero Content */}
        <div className="flex flex-col relative gap-y-8">
          <div className="flex flex-col items-center h-full text-center gap-y-5 px-4">
            <h1 className="text-3xl font-bold text-white md:text-5xl lg:text-7xl">
              Front Row or Backstage?
              <span className="block">
                The <span className="text-primary">Choice is Yours!</span>
              </span>
            </h1>
            <p className="max-w-lg lg:text-lg text-white">
              Explore and secure the best seats in town. Whether you&apos;re
              here to buy or sell, we&apos;re here to make it seamless.
            </p>
          </div>

          <Button
            asChild
            size="lg"
            className="w-full hover:bg-primary hover:brightness-105 max-w-[200px] mx-auto"
          >
            <Link href="/events">Explore Events</Link>
          </Button>
        </div>
      </div>
    </Container>
  );
};
