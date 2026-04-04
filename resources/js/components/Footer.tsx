import { Link } from "@inertiajs/react";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram } from "lucide-react";
import logo from "@/assets/logo-text.png";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center md:text-left">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center justify-center md:justify-start mb-4">
              <img src={logo} alt="Vector Shuttle" className="h-20 w-auto" />
            </Link>
            <p className="text-muted-foreground text-sm mb-6">
              Your reliable transport service in the Waikato region. Connecting Hamilton
              to Auckland Airport and surrounding towns.
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
              <a
                href="https://www.facebook.com/profile.php?id=61574706634737" target='_blank'
                className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-foreground font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: "Home", path: "/" },
                { name: "About Us", path: "/about" },
                { name: "Services", path: "/services" },
                { name: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-foreground font-semibold mb-6">Our Services</h3>
            <ul className="space-y-3">
              {[
                "Shared Airport Transfer",
                "Private Airport Transfer",
                "City to City Transfer",
                "Event Transport",
              ].map((service) => (
                <li key={service}>
                  <Link
                    href="/services"
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-foreground font-semibold mb-6">Contact Info</h3>
            <ul className="space-y-4 w-full">
              <li className="flex items-start gap-3 justify-center md:justify-start">
                <Phone className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-foreground">+64 21 123 456</p>
                  <p className="text-muted-foreground text-sm">+64 7 123 4567</p>
                </div>
              </li>
              <li className="flex items-start gap-3 justify-center md:justify-start">
                <Mail className="w-5 h-5 text-primary mt-0.5" />
                <a
                  href="mailto:contact@vectorshuttle.co.nz"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  contact@vectorshuttle.co.nz
                </a>
              </li>
              <li className="flex items-start gap-3 justify-center md:justify-start">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <p className="text-muted-foreground">Hamilton, New Zealand</p>
              </li>
              <li className="flex items-start gap-3 justify-center md:justify-start">
                <Clock className="w-5 h-5 text-primary mt-0.5" />
                <p className="text-muted-foreground">24/7 Service Available</p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()} Vector Shuttle.{" "}
              <span className="block sm:inline">
                Design and Developed by{" "}
                <a
                  href="https://www.decreations.lk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  DE Creations
                </a>
                {" "}<sup className="text-[10px]">&reg;</sup>
              </span>
            </p>
            <div className="flex gap-6">
              <Link href="/policy" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                Terms &amp; Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
