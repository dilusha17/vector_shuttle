import { Clock, Shield, Star, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const factors = [
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Round-the-clock service for early flights and late arrivals",
  },
  {
    icon: Shield,
    title: "Reliable & Safe",
    description: "Licensed drivers with impeccable safety records",
  },
  {
    icon: Star,
    title: "Premium Comfort",
    description: "Modern vehicles with Wi-Fi and spacious seating",
  },
  {
    icon: Users,
    title: "Experienced Team",
    description: "Professional drivers who know every route",
  },
];

const KeyFactors = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose <span className="text-primary">Vector Shuttle</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We pride ourselves on delivering exceptional transport experiences across the Waikato region
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {factors.map((factor, index) => (
            <div
              key={factor.title}
              className={cn(
                "group p-6 rounded-xl bg-card border border-border card-hover",
                "opacity-0 animate-fade-in-up"
              )}
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
            >
              <div className="w-14 h-14 rounded-lg gradient-teal flex items-center justify-center mb-4 group-hover:glow-teal transition-all duration-300">
                <factor.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {factor.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {factor.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyFactors;
