import { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";

const sections = [
  {
    title: "1. Shared Passenger Service",
    content: [
      "The Shared Passenger service is a scheduled, communal shuttle that runs between Hamilton and Auckland Airport. Passengers share the vehicle with others travelling in the same direction.",
      "Vector Shuttle operates on fixed departure times. Passengers must be ready at the agreed pick-up point at the scheduled time. The driver will not wait more than 5 minutes past the scheduled departure time.",
      "Pick-up and drop-off points are limited to agreed locations. Door-to-door service is not guaranteed on the shared service unless pre-arranged and confirmed.",
      "Shared services may be subject to minor route adjustments to accommodate other passengers. Journey times are approximate and may vary due to traffic, weather, or other conditions.",
    ],
  },
  {
    title: "2. Private Shuttle Service",
    content: [
      "The Private Shuttle service provides exclusive use of a vehicle for one booking party. This service is door-to-door and operates at a time mutually agreed between the customer and Vector Shuttle.",
      "The agreed pick-up time is the time the driver will arrive. Customers should be fully prepared and ready to depart at that time. A grace period of up to 10 minutes may be observed at the driver's discretion.",
      "For airport departures, Vector Shuttle recommends allowing sufficient time for traffic, check-in, baggage drop, and security screening. Vector Shuttle accepts no liability for missed flights due to insufficient time allowances by the customer.",
    ],
  },
  {
    title: "3. Payments",
    content: [
      "All fares are payable in full at the time of booking or as otherwise agreed in writing with Vector Shuttle.",
      "Accepted payment methods include bank transfer, cash, and any other methods confirmed in writing by Vector Shuttle at the time of booking.",
      "Prices are quoted in New Zealand Dollars (NZD) and include GST where applicable.",
      "Vector Shuttle reserves the right to adjust its pricing at any time. Price changes will not affect confirmed bookings where payment has been received.",
    ],
  },
  {
    title: "4. Booking Changes & Cancellations",
    content: [
      "All booking changes and cancellation requests must be submitted in writing (email or WhatsApp message) and confirmed by Vector Shuttle.",
      "Cancellations made more than 48 hours before the scheduled departure: full refund.",
      "Cancellations made between 24 and 48 hours before the scheduled departure: 50% refund.",
      "Cancellations made less than 24 hours before the scheduled departure: no refund.",
      "No-shows (failure to be present at the agreed pick-up location at the scheduled time) will be treated as a cancellation with no refund.",
      "Vector Shuttle reserves the right to cancel or reschedule any booking in the event of unforeseen circumstances, vehicle failure, or safety concerns. In such cases, customers will be notified as soon as practicable, and a full refund will be provided if an acceptable alternative cannot be arranged.",
    ],
  },
  {
    title: "5. Meeting Point — Arrival at Auckland Airport",
    content: [
      "For passengers arriving at Auckland Airport, Vector Shuttle will confirm a designated meeting point at the time of booking.",
      "Passengers are responsible for contacting the driver upon landing to confirm their arrival and estimated wait time.",
      "Vector Shuttle will make every reasonable effort to accommodate flight delays. However, if a passenger fails to make contact within a reasonable time after arrival, the driver may depart. In such cases, no refund will be issued.",
      "Passengers should proceed through customs, collect their baggage, and contact the driver before exiting the arrivals hall.",
    ],
  },
  {
    title: "6. Luggage",
    content: [
      "Each passenger is permitted to travel with a reasonable amount of luggage (standard airline-sized checked bag and carry-on item). Additional or oversized luggage must be declared at the time of booking.",
      "Vector Shuttle will make every effort to accommodate additional luggage, subject to vehicle capacity. Vector Shuttle reserves the right to refuse excess luggage if it cannot be safely accommodated.",
      "Passengers are responsible for loading and unloading their own luggage. Vector Shuttle drivers may assist at their own discretion.",
      "Vector Shuttle accepts no liability for loss or damage to luggage, personal items, or property during transit.",
    ],
  },
];

export default function Terms() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  return (
    <>
      <Head title="Terms & Conditions — Vector Shuttle" />
      <Navbar onBookNow={() => setIsBookingOpen(true)} />

      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />

      <main className="min-h-screen bg-background pt-36 pb-16">
        <div className="container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Terms &amp; Conditions
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Please read these terms carefully before booking with Vector Shuttle.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Effective date: January 2025
            </p>
          </div>

          <div className="rounded-xl bg-secondary/40 border border-border p-6 mb-10 text-sm text-muted-foreground leading-relaxed">
            By making a booking with Vector Shuttle, you agree to be bound by these Terms &amp; Conditions.
            These terms cover service descriptions, payments, and cancellation policies.
            For passenger conduct, child, animal and special assistance policies, see our{" "}
            <Link href="/policy" className="text-primary hover:underline">Policies page</Link>.
          </div>

          {/* Sections */}
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

          {/* Footer note */}
          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>
              Questions about these terms?{" "}
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
