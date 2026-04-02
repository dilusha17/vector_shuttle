import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroCarousel from "@/components/HeroCarousel";
import AboutSnippet from "@/components/AboutSnippet";
import KeyFactors from "@/components/KeyFactors";
import ServicesSection from "@/components/ServicesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTABanner from "@/components/CTABanner";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";

const Index = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onBookNow={() => setIsBookingOpen(true)} />
      <HeroCarousel onBookNow={() => setIsBookingOpen(true)} />
      <AboutSnippet />
      <KeyFactors />
      <ServicesSection />
      <TestimonialsSection />
      <CTABanner onBookNow={() => setIsBookingOpen(true)} />
      <Footer />
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </div>
  );
};

export default Index;
