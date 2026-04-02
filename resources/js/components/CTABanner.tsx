import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CTABannerProps {
  onBookNow: () => void;
}

const CTABanner = ({ onBookNow }: CTABannerProps) => {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-teal opacity-90" />
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?q=80&w=2070&auto=format&fit=crop)`,
        }}
      />

      {/* Content */}
      <div className="relative container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
          Ready to Book Your Stress-Free Ride?
        </h2>
        <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
          Experience the comfort and reliability of Vector Shuttle. Book now and let us take care of your journey.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="xl"
            onClick={onBookNow}
            className="bg-background text-foreground hover:bg-background/90 font-bold"
          >
            Book Now <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button
            variant="outline"
            size="xl"
            className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            asChild
          >
            <a href="tel:+6421123456">Call Us: +64 21 123 456</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
