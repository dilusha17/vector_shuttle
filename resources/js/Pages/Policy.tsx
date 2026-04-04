import { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";

const sections = [
  {
    title: "1. Passenger Conduct",
    content: [
      "Passengers are expected to behave in a respectful and courteous manner towards the driver and other passengers at all times.",
      "Consumption of food is permitted at the driver's discretion. Alcohol consumption is not permitted in the vehicle.",
      "Smoking, vaping, or the use of any tobacco or nicotine product is strictly prohibited in all Vector Shuttle vehicles.",
      "Passengers who are visibly intoxicated or whose behaviour poses a risk to the safety or comfort of others may be refused travel or asked to leave the vehicle. No refund will be provided in such circumstances.",
      "Any damage caused to the vehicle by a passenger will be the sole responsibility of that passenger and will be billed accordingly.",
    ],
  },
  {
    title: "2. Child Policy",
    content: [
      "Children are welcome on Vector Shuttle services. Parents or guardians are responsible for ensuring appropriate child restraints are used in accordance with New Zealand law.",
      "Customers travelling with young children should notify Vector Shuttle at the time of booking so that appropriate seating arrangements can be made.",
      "Vector Shuttle is not responsible for providing child car seats. Customers must supply their own child restraints if required.",
    ],
  },
  {
    title: "3. Special Assistance",
    content: [
      "Customers requiring special assistance (e.g., wheelchair access, mobility aids, or other accessibility needs) must notify Vector Shuttle at the time of booking.",
      "Vector Shuttle will make every reasonable effort to accommodate passengers with specific needs, subject to vehicle suitability and availability.",
      "Vector Shuttle cannot guarantee that all vehicles are wheelchair accessible. Please contact us directly to discuss your requirements before booking.",
    ],
  },
  {
    title: "4. Animal Policy",
    content: [
      "Animals are not permitted in Vector Shuttle vehicles unless they are certified assistance animals (e.g., guide dogs or hearing dogs).",
      "Guide dogs and certified assistance animals are always welcome. Please notify Vector Shuttle at the time of booking.",
      "Customers travelling with an assistance animal are responsible for ensuring the animal is appropriately restrained and does not pose a risk to the driver or other passengers.",
    ],
  },
  {
    title: "5. Personal Items & Liability",
    content: [
      "Vector Shuttle accepts no responsibility for personal items, valuables, or electronic devices left in vehicles.",
      "If a lost item is found in a Vector Shuttle vehicle, we will make reasonable efforts to notify the owner and arrange for its return at the owner's cost.",
      "Items not claimed within 14 days may be disposed of.",
    ],
  },
  {
    title: "6. Unforeseen Circumstances",
    content: [
      "Vector Shuttle will not be held liable for delays, service disruptions, or cancellations caused by events beyond its reasonable control, including but not limited to: adverse weather conditions, road closures, accidents, natural disasters, or mechanical breakdown.",
      "In such circumstances, Vector Shuttle will notify affected customers as soon as practicable and will endeavour to offer alternative arrangements where possible.",
    ],
  },
];

export default function Policy() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <>
      <Head title="Policies — Vector Shuttle" />
      <Navbar onBookNow={() => setIsBookingOpen(true)} />

      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />

      <main className="min-h-screen bg-background pt-36 pb-16">
        <div className="container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Policies
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Our commitment to safe, respectful, and reliable travel for everyone.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Effective date: January 2025
            </p>
          </div>

          <div className="rounded-xl bg-secondary/40 border border-border p-6 mb-10 text-sm text-muted-foreground leading-relaxed">
            These policies apply to all passengers travelling with Vector Shuttle. By booking a service
            you agree to comply with these policies. For payment, cancellation, and service terms, see our{" "}
            <Link href="/terms" className="text-primary hover:underline">Terms &amp; Conditions</Link>.
          </div>

          <div className="space-y-10">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2">
                  {section.title}
                </h2>
                <ul className="space-y-3">
                  {section.content.map((para, i) => (
                    <li key={i} className="flex gap-3 text-muted-foreground text-sm leading-relaxed">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      <span>{para}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>
              Questions about these policies?{" "}
              <Link href="/contact" className="text-primary hover:underline">
                Contact us
              </Link>
              .
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
