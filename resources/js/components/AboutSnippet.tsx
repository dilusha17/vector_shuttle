import { Link } from "@inertiajs/react";
import { ArrowRight } from "lucide-react";

const AboutSnippet = () => {
  return (
    <section className="py-20 gradient-dark">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop"
                alt="Vector Shuttle service"
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
            </div>
            {/* Stats Card */}
            <div className="absolute -bottom-6 -right-6 bg-card border border-border rounded-xl p-6 shadow-soft">
              <div className="text-4xl font-bold text-primary mb-1">10+</div>
              <div className="text-sm text-muted-foreground">Years of Excellence</div>
            </div>
          </div>

          {/* Content */}
          <div>
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              About Us
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
              Your Trusted Partner in <span className="text-primary">Waikato Transport</span>
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Vector Shuttle has been proudly serving the Waikato region for over a decade. 
              We specialize in providing reliable, comfortable, and affordable transport services 
              between Hamilton and Auckland Airport, as well as surrounding towns including 
              Te Awamutu, Cambridge, Morrinsville, Huntly, Raglan, and Matamata.
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Our fleet of modern vehicles and team of professional drivers ensure that every 
              journey with us is safe, comfortable, and stress-free. Whether you're traveling 
              for business or pleasure, we're here to get you there on time, every time.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all duration-300"
            >
              Learn More About Us <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSnippet;
