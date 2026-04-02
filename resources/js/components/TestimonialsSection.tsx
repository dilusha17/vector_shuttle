import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    id: 1,
    name: "Sarah Mitchell",
    location: "Hamilton",
    rating: 5,
    text: "Exceptional service! The driver was punctual, professional, and made my early morning airport run stress-free. Will definitely use Vector Shuttle again.",
    source: "Google Review",
  },
  {
    id: 2,
    name: "James Thompson",
    location: "Cambridge",
    rating: 5,
    text: "Used their event transport for our wedding. The team coordinated everything perfectly. Our guests were impressed with the luxury vehicles and professional service.",
    source: "Google Review",
  },
  {
    id: 3,
    name: "Emily Chen",
    location: "Te Awamutu",
    rating: 5,
    text: "Best shuttle service in the Waikato! Clean vehicles, friendly drivers, and very reasonable prices. Highly recommend for anyone traveling to Auckland Airport.",
    source: "Google Review",
  },
  {
    id: 4,
    name: "Michael Roberts",
    location: "Morrinsville",
    rating: 5,
    text: "I use Vector Shuttle weekly for business trips. Their reliability and professionalism are unmatched. The Wi-Fi in the vehicles is a great touch for working on the go.",
    source: "Google Review",
  },
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, nextSlide]);

  return (
    <section className="py-20 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Our <span className="text-primary">Customers Say</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it – hear from our satisfied customers
          </p>
        </div>

        <div
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Testimonial Card */}
          <div className="relative overflow-hidden rounded-2xl bg-card border border-border p-8 md:p-12">
            <Quote className="absolute top-6 right-6 w-16 h-16 text-primary/10" />
            
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={cn(
                  "transition-all duration-500",
                  index === currentIndex
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 absolute inset-0 translate-x-8"
                )}
              >
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-lg md:text-xl text-foreground mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full gradient-teal flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-lg">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.location} • {testimonial.source}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prevSlide}
              className="p-2 rounded-full bg-card border border-border text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all duration-300",
                    index === currentIndex
                      ? "bg-primary w-6"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  )}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="p-2 rounded-full bg-card border border-border text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
