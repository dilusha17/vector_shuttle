import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeroCarouselProps {
  onBookNow: () => void;
}

const slides = [
  {
    id: 1,
    title: "Your Reliable Transport Service",
    subtitle: "in the Waikato Region",
    description: "Experience seamless airport transfers and city-to-city travel with Vector Shuttle",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Hamilton to Auckland Airport",
    subtitle: "Direct & Comfortable",
    description: "Professional drivers, luxury vehicles, and on-time service guaranteed",
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Event & Group Transport",
    subtitle: "For Every Occasion",
    description: "Weddings, corporate events, and group travel made easy",
    image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=2071&auto=format&fit=crop",
  },
];

const HeroCarousel = ({ onBookNow }: HeroCarouselProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            index === currentSlide ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/40" />
          </div>

          {/* Content */}
          <div className="relative h-full container mx-auto px-4 flex items-center">
            <div className="max-w-2xl">
              <h1
                className={cn(
                  "text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 hero-text-shadow",
                  index === currentSlide && "animate-fade-in-up"
                )}
              >
                {slide.title}
                <span className="block text-primary">{slide.subtitle}</span>
              </h1>
              <p
                className={cn(
                  "text-lg md:text-xl text-silver mb-8 hero-text-shadow",
                  index === currentSlide && "animate-fade-in-up delay-200"
                )}
                style={{ animationDelay: "200ms" }}
              >
                {slide.description}
              </p>
              <div
                className={cn(
                  "flex flex-col sm:flex-row gap-4",
                  index === currentSlide && "animate-fade-in-up delay-400"
                )}
                style={{ animationDelay: "400ms" }}
              >
                <Button variant="hero" size="xl" onClick={onBookNow}>
                  Book Your Ride
                </Button>
                <Button variant="heroOutline" size="xl" asChild>
                  <a href="#services">Our Services</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/30 backdrop-blur-sm border border-border text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/30 backdrop-blur-sm border border-border text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 z-10"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              index === currentSlide
                ? "bg-primary w-8"
                : "bg-foreground/30 hover:bg-foreground/50"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
