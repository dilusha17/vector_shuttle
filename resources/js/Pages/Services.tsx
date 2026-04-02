import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import { Button } from "@/components/ui/button";
import { Users, Car, MapPin, Calendar, Check, ArrowRight } from "lucide-react";

const services = [
  {
    id: "shared",
    icon: Users,
    title: "Shared Airport Transfer",
    subtitle: "Cost-Effective Travel",
    description: "Share your journey with fellow travelers and enjoy affordable rates to Auckland Airport. Perfect for solo travelers and small groups looking for budget-friendly options without compromising on comfort.",
    features: [
      "Scheduled departures from Hamilton",
      "Door-to-door pickup available",
      "Comfortable seating with luggage space",
      "Wi-Fi and charging ports",
      "Flight monitoring for arrivals",
      "Up to 50% cheaper than private transfers",
    ],
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop",
    areas: ["Hamilton", "Te Awamutu", "Cambridge", "Morrinsville"],
  },
  {
    id: "private",
    icon: Car,
    title: "Private Airport Transfer",
    subtitle: "Exclusive & Flexible",
    description: "Enjoy the luxury of having a vehicle all to yourself. Our private transfer service offers door-to-door convenience with flexible timing to match your schedule perfectly.",
    features: [
      "Exclusive vehicle for your party",
      "Flexible departure times",
      "Direct route - no stops",
      "Meet & greet at airport",
      "Child seats available on request",
      "Premium vehicle options",
    ],
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop",
    areas: ["All Waikato Region", "Auckland Airport", "Hamilton Airport"],
  },
  {
    id: "cityToCity",
    icon: MapPin,
    title: "City to City Transfer",
    subtitle: "Regional Connectivity",
    description: "Travel comfortably between Hamilton and the surrounding Waikato towns. Whether it's a business trip or a day out, we make regional travel convenient and stress-free.",
    features: [
      "Flexible pickup locations",
      "Competitive regional rates",
      "Multiple vehicle sizes",
      "Same-day booking available",
      "Regular route discounts",
      "Corporate accounts welcome",
    ],
    image: "https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?q=80&w=2072&auto=format&fit=crop",
    areas: ["Hamilton", "Te Awamutu", "Cambridge", "Morrinsville", "Huntly", "Raglan", "Matamata"],
  },
  {
    id: "event",
    icon: Calendar,
    title: "Event Transport",
    subtitle: "Group & Special Occasions",
    description: "From weddings to corporate events, we provide reliable group transport that ensures your guests arrive on time and in style. Let us handle the logistics while you focus on your event.",
    features: [
      "Large group capacity",
      "Multiple vehicle coordination",
      "Dedicated event coordinator",
      "Custom pickup schedules",
      "Wedding packages available",
      "Corporate event expertise",
    ],
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop",
    areas: ["Weddings", "Corporate Events", "Sports Teams", "School Groups", "Tours"],
  },
];

const Services = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onBookNow={() => setIsBookingOpen(true)} />

      {/* Hero */}
      <section className="pt-32 pb-20 gradient-dark">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Our Services
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mt-2 mb-6">
              Transport Solutions for <span className="text-primary">Every Need</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              From airport transfers to event transport, we offer a comprehensive range of 
              services designed to get you where you need to be, comfortably and on time.
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="space-y-24">
            {services.map((service, index) => (
              <div
                key={service.id}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Image */}
                <div className={`relative ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                  <div className="relative rounded-2xl overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-[400px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                  </div>
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-xl gradient-teal flex items-center justify-center shadow-teal">
                    <service.icon className="w-12 h-12 text-primary-foreground" />
                  </div>
                </div>

                {/* Content */}
                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                    {service.subtitle}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
                    {service.title}
                  </h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-3 mb-6">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Areas */}
                  <div className="mb-8">
                    <p className="text-sm font-medium text-foreground mb-2">Service Areas:</p>
                    <div className="flex flex-wrap gap-2">
                      {service.areas.map((area, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full bg-secondary text-sm text-muted-foreground"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant="hero"
                    size="lg"
                    onClick={() => setIsBookingOpen(true)}
                  >
                    Book This Service <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-teal">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Not Sure Which Service You Need?
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Contact us and our team will help you find the perfect transport solution for your needs.
          </p>
          <Button
            size="xl"
            className="bg-background text-foreground hover:bg-background/90 font-bold"
            onClick={() => setIsBookingOpen(true)}
          >
            Get in Touch <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      <Footer />
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </div>
  );
};

export default Services;
