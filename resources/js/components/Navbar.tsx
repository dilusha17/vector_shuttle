import { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import { Menu, X, Phone } from "lucide-react";
import logo from "@/assets/logo-text.png";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavbarProps {
  onBookNow: () => void;
}

const Navbar = ({ onBookNow }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { url } = usePage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl transition-colors duration-300",
        isScrolled || isMobileMenuOpen
          ? "bg-background/60"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-24 md:h-32">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img src={logo} alt="Vector Shuttle" className="h-12 md:h-16 w-auto drop-shadow-md" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={cn(
                  "text-sm font-medium transition-colors duration-200 hover:text-primary",
                  url === link.path
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="tel:+6421123456"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>+64 21 123 456</span>
            </a>
            <Button variant="hero" size="lg" onClick={onBookNow}>
              Book Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Menu — inside header so it shares the same blur layer, no seam */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-6 flex flex-col gap-4 animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "text-base font-medium py-2 transition-colors",
                  url === link.path
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {link.name}
              </Link>
            ))}
            <Button
              variant="hero"
              size="lg"
              className="mt-4"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onBookNow();
              }}
            >
              Book Now
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
