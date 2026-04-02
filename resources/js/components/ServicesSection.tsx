import { Link } from "@inertiajs/react";
import { Users, Car, MapPin, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const services = [
  {
    icon: Users,
    title: "Shared Airport Transfer",
    description: "Cost-effective shared rides to and from Auckland Airport. Perfect for solo travelers and small groups.",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop",
  },
  {
    icon: Car,
    title: "Private Airport Transfer",
    description: "Exclusive door-to-door service with flexible scheduling. Your personal chauffeur awaits.",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop",
  },
  {
    icon: MapPin,
    title: "City to City Transfer",
    description: "Comfortable travel between Hamilton and surrounding areas including Cambridge, Te Awamutu, and more.",
    image: "https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?q=80&w=2072&auto=format&fit=crop",
  },
  {
    icon: Calendar,
    title: "Event Transport",
    description: "Reliable group transport for weddings, corporate events, and special occasions.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop",
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-20 gradient-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our <span className="text-primary">Services</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From airport transfers to event transport, we have you covered
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={cn(
                "group relative overflow-hidden rounded-2xl bg-card border border-border card-hover",
                "opacity-0 animate-fade-in-up"
              )}
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                <div className="absolute top-4 left-4 w-12 h-12 rounded-lg gradient-teal flex items-center justify-center">
                  <service.icon className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {service.description}
                </p>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 text-primary font-medium text-sm hover:gap-3 transition-all duration-300"
                >
                  Learn More <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="teal" size="lg" asChild>
            <Link href="/services">
              View All Services <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
