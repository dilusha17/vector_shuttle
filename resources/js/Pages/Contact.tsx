import { useRef, useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import ReCAPTCHA from "react-google-recaptcha";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { toast } from "sonner";

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string;

const countryCodes = [
  { code: "+64", country: "NZ" },
  { code: "+61", country: "AU" },
  { code: "+1", country: "US" },
  { code: "+44", country: "UK" },
];

const serviceTypes = [
  "Shared Airport Transfer",
  "Private Airport Transfer",
  "City to City Transfer",
  "Event Transport",
  "General Inquiry",
];

const Contact = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const { props } = usePage<{ flash?: { success?: string } }>();

  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    email: "",
    countryCode: "+64",
    phone: "",
    serviceType: "",
    message: "",
    recaptcha: "",
    _honey: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setData(name as keyof typeof data, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.recaptcha) {
      toast.error("Please complete the reCAPTCHA verification.");
      return;
    }

    post(route("contact.send"), {
      onSuccess: () => {
        toast.success("Message sent successfully!", {
          description: "We'll get back to you as soon as possible.",
        });
        reset();
        recaptchaRef.current?.reset();
      },
      onError: () => {
        recaptchaRef.current?.reset();
        setData("recaptcha", "");
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onBookNow={() => setIsBookingOpen(true)} />

      {/* Hero */}
      <section className="pt-32 pb-20 gradient-dark">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Contact Us
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mt-2 mb-6">
              Get in <span className="text-primary">Touch</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Have questions or ready to book? We're here to help. Reach out to us
              through any of the channels below.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-8">Contact Information</h2>

              <div className="space-y-6 mb-12">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg gradient-teal flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Phone Numbers</h3>
                    <p className="text-muted-foreground">+64 21 123 456 (Mobile)</p>
                    <p className="text-muted-foreground">+64 7 123 4567 (Office)</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg gradient-teal flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Email</h3>
                    <a
                      href="mailto:contact@vectorshuttle.co.nz"
                      className="text-primary hover:underline"
                    >
                      contact@vectorshuttle.co.nz
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg gradient-teal flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Location</h3>
                    <p className="text-muted-foreground">Hamilton, New Zealand</p>
                    <p className="text-muted-foreground text-sm">Serving the entire Waikato region</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg gradient-teal flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Operating Hours</h3>
                    <p className="text-muted-foreground">24/7 Service Available</p>
                    <p className="text-muted-foreground text-sm">Office: Mon-Fri 8am-6pm</p>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="rounded-xl overflow-hidden border border-border">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d100598.04099824366!2d175.20869784374997!3d-37.78791439999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6d6d22e671a435c5%3A0x500ef6143a29903!2sHamilton%2C%20New%20Zealand!5e0!3m2!1sen!2sus!4v1702000000000!5m2!1sen!2sus"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Vector Shuttle Location"
                />
              </div>
            </div>

            {/* Contact Form */}
            <div className="p-8 rounded-2xl bg-card border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-2">Send Us a Message</h2>
              <p className="text-muted-foreground mb-8">
                Fill out the form below and we'll get back to you shortly.
              </p>

              {props.flash?.success && (
                <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
                  {props.flash.success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Honeypot – hidden from humans, traps bots */}
                <input
                  type="text"
                  name="_honey"
                  value={data._honey}
                  onChange={handleInputChange}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={data.name}
                    onChange={handleInputChange}
                    required
                    className="w-full h-12 px-4 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                    placeholder="John Doe"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={data.email}
                    onChange={handleInputChange}
                    required
                    className="w-full h-12 px-4 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number *
                  </label>
                  <div className="flex gap-2">
                    <select
                      name="countryCode"
                      value={data.countryCode}
                      onChange={handleInputChange}
                      className="h-12 px-3 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:border-primary transition-colors"
                    >
                      {countryCodes.map((cc) => (
                        <option key={cc.code} value={cc.code}>
                          {cc.country} {cc.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      name="phone"
                      value={data.phone}
                      onChange={handleInputChange}
                      required
                      className="flex-1 h-12 px-4 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                      placeholder="21 123 4567"
                    />
                  </div>
                  {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Service Type *
                  </label>
                  <select
                    name="serviceType"
                    value={data.serviceType}
                    onChange={handleInputChange}
                    required
                    className="w-full h-12 px-4 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="">Select a service...</option>
                    {serviceTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.serviceType && <p className="mt-1 text-sm text-red-400">{errors.serviceType}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Message / Inquiry *
                  </label>
                  <textarea
                    name="message"
                    value={data.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                    placeholder="Tell us about your transport needs..."
                  />
                  {errors.message && <p className="mt-1 text-sm text-red-400">{errors.message}</p>}
                </div>

                {/* reCAPTCHA */}
                <div>
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={RECAPTCHA_SITE_KEY}
                    theme="dark"
                    onChange={(token) => setData("recaptcha", token ?? "")}
                    onExpired={() => setData("recaptcha", "")}
                  />
                  {errors.recaptcha && (
                    <p className="mt-1 text-sm text-red-400">{errors.recaptcha}</p>
                  )}
                </div>

                <Button type="submit" variant="hero" size="xl" className="w-full" disabled={processing}>
                  {processing ? "Sending..." : <>Send Message <Send className="w-5 h-5 ml-2" /></>}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </div>
  );
};

export default Contact;

