import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import { Shield, Award, Users, MapPin, Wifi, Briefcase, Car, Clock } from "lucide-react";

const vehicles = [
  {
    name: "Luxury Shuttle Van",
    capacity: "Up to 11 passengers",
    features: ["Wi-Fi", "Air Conditioning", "Spacious Luggage", "Reclining Seats"],
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop",
  },
  {
    name: "Executive Sedan",
    capacity: "Up to 4 passengers",
    features: ["Premium Interior", "Wi-Fi", "Privacy Glass", "Leather Seats"],
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop",
  },
];

const destinations = [
  { name: "Hamilton", description: "Our home base and primary service area" },
  { name: "Auckland Airport", description: "Direct transfers to domestic & international terminals" },
  { name: "Te Awamutu", description: "Regular service to the Rose Town" },
  { name: "Cambridge", description: "Serving the Town of Trees" },
  { name: "Morrinsville", description: "Connecting the dairy capital" },
  { name: "Huntly", description: "Waikato's northern gateway" },
  { name: "Raglan", description: "Surf coast transfers" },
  { name: "Matamata", description: "Hobbiton country coverage" },
];

const About = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onBookNow={() => setIsBookingOpen(true)} />

      {/* Hero */}
      <section className="pt-32 pb-20 gradient-dark">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              About Us
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mt-2 mb-6">
              Your Trusted Partner in <span className="text-primary">Waikato Transport</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Vector Shuttle has been proudly serving the Waikato region for over a decade, 
              providing reliable, comfortable, and affordable transport services.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="p-8 rounded-2xl bg-card border border-border">
              <div className="w-14 h-14 rounded-lg gradient-teal flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                To provide the Waikato region with safe, reliable, and comfortable transport 
                services that exceed expectations. We believe every journey should be stress-free, 
                allowing our passengers to relax and enjoy the ride.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-card border border-border">
              <div className="w-14 h-14 rounded-lg gradient-teal flex items-center justify-center mb-6">
                <Award className="w-7 h-7 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed">
                To be the most trusted and preferred shuttle service in the Waikato region, 
                known for our commitment to safety, punctuality, and exceptional customer 
                service. We strive to set the standard for ground transportation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Commitment */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Commitment to <span className="text-primary">Safety</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Safety is our top priority. Every aspect of our service is designed with your well-being in mind.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                title: "Licensed Drivers",
                description: "All drivers are fully licensed, background-checked, and trained in defensive driving.",
              },
              {
                icon: Car,
                title: "Maintained Vehicles",
                description: "Our fleet undergoes regular maintenance and safety inspections to ensure reliability.",
              },
              {
                icon: Clock,
                title: "Real-time Tracking",
                description: "GPS tracking on all vehicles for your peace of mind and accurate ETAs.",
              },
            ].map((item, index) => (
              <div key={index} className="p-6 rounded-xl bg-card border border-border text-center">
                <div className="w-14 h-14 rounded-lg gradient-teal flex items-center justify-center mb-4 mx-auto">
                  <item.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Fleet */}
      <section className="py-20 gradient-dark">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our <span className="text-primary">Fleet</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Modern, comfortable vehicles equipped with everything you need for a pleasant journey.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {vehicles.map((vehicle, index) => (
              <div key={index} className="rounded-2xl bg-card border border-border overflow-hidden group">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">{vehicle.name}</h3>
                  <p className="text-primary font-medium mb-4">{vehicle.capacity}</p>
                  <div className="flex flex-wrap gap-2">
                    {vehicle.features.map((feature, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full bg-secondary text-sm text-muted-foreground"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Areas We <span className="text-primary">Serve</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive coverage across the Waikato region and direct routes to Auckland Airport.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {destinations.map((dest, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-card border border-border hover:border-primary transition-colors"
              >
                <MapPin className="w-5 h-5 text-primary mb-2" />
                <h3 className="font-semibold text-foreground">{dest.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{dest.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-20 h-20 rounded-full gradient-teal flex items-center justify-center mb-6 mx-auto">
              <Users className="w-10 h-10 text-primary-foreground" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Professional <span className="text-primary">Team</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Behind every great journey is a team of dedicated professionals. Our drivers are not 
              just employees – they're ambassadors of the Vector Shuttle experience. Each team member 
              is carefully selected for their driving expertise, local knowledge, and commitment to 
              customer service excellence.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              With an average of 10+ years of professional driving experience, our team knows every 
              route, every shortcut, and every way to make your journey comfortable and efficient. 
              They're friendly, punctual, and always ready to go the extra mile for our passengers.
            </p>
          </div>
        </div>
      </section>

      <Footer />
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </div>
  );
};

export default About;
