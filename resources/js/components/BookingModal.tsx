import { useRef, useState } from "react";
import { useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import ReCAPTCHA from "react-google-recaptcha";
import { X, Users, Car, MapPin, Calendar as CalendarIcon, ArrowRight, ArrowLeft, Clock, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TimePicker } from "@/components/ui/time-picker";

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string;

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ServiceType = "shared" | "private" | "cityToCity" | "event" | null;

const services = [
  {
    id: "shared" as const,
    icon: Users,
    title: "Shared Airport Transfer",
    description: "Cost-effective shared rides to Auckland Airport",
  },
  {
    id: "private" as const,
    icon: Car,
    title: "Private Airport Transfer",
    description: "Exclusive door-to-door service",
  },
  {
    id: "cityToCity" as const,
    icon: MapPin,
    title: "City to City Transfer",
    description: "Travel between Hamilton and surrounding areas",
  },
  {
    id: "event" as const,
    icon: CalendarIcon,
    title: "Event Transport",
    description: "Group transport for special occasions",
  },
];

const countryCodes = [
  { code: "+64", country: "NZ", flag: "🇳🇿" },
  { code: "+61", country: "AU", flag: "🇦🇺" },
  { code: "+1", country: "US", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
];

const formatTimeDisplay = (time: string) => {
  if (!time) return "";
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const ampm = hour < 12 ? "AM" : "PM";
  return `${hour12}:${minutes} ${ampm}`;
};

const BookingModal = ({ isOpen, onClose }: BookingModalProps) => {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<ServiceType>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const { data, setData, post, processing, errors, reset } = useForm({
    service: "" as string,
    firstName: "",
    lastName: "",
    countryCode: "+64",
    phone: "",
    email: "",
    pickupLocation: "",
    dropoffLocation: "",
    date: "",
    time: "",
    passengers: "1",
    flightNumber: "",
    message: "",
    recaptcha: "",
    _honey: "",
  });

  const handleServiceSelect = (serviceId: ServiceType) => {
    setSelectedService(serviceId);
    setData("service", serviceId ?? "");
    setStep(2);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(name as keyof typeof data, value);
  };

  const handleSelectChange = (name: string, value: string) => {
    setData(name as keyof typeof data, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }
    if (!data.time) {
      toast.error("Please select a time");
      return;
    }
    if (!data.recaptcha) {
      toast.error("Please complete the reCAPTCHA verification.");
      return;
    }
    post(route("booking.store"), {
      onSuccess: () => {
        toast.success("Booking request submitted!", {
          description: "We'll contact you shortly to confirm your booking.",
        });
        handleClose();
      },
      onError: () => {
        recaptchaRef.current?.reset();
        setData("recaptcha", "");
      },
    });
  };

  const handleBack = () => {
    setStep(1);
    setSelectedService(null);
  };

  const handleClose = () => {
    onClose();
    setStep(1);
    setSelectedService(null);
    setSelectedDate(undefined);
    recaptchaRef.current?.reset();
    reset();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card border border-border rounded-2xl shadow-soft animate-fade-in-up">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-card border-b border-border rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {step === 1 ? "Select Your Service" : "Booking Details"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {step === 1
                ? "Choose the service that best fits your needs"
                : `${services.find((s) => s.id === selectedService)?.title}`}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 ? (
            /* Step 1: Service Selection */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => handleServiceSelect(service.id)}
                  className="group p-6 rounded-xl bg-secondary/50 border border-border text-left hover:border-primary hover:bg-secondary transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-lg gradient-teal flex items-center justify-center mb-4 group-hover:glow-teal transition-all duration-300">
                    <service.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {service.description}
                  </p>
                </button>
              ))}
            </div>
          ) : (
            /* Step 2: Booking Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Honeypot */}
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

              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to services
              </button>

              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={data.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full h-12 px-4 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    placeholder="John"
                  />
                  {errors.firstName && <p className="mt-1 text-xs text-red-400">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={data.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full h-12 px-4 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    placeholder="Doe"
                  />
                  {errors.lastName && <p className="mt-1 text-xs text-red-400">{errors.lastName}</p>}
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone Number *
                </label>
                <div className="flex gap-2">
                  <Select
                    value={data.countryCode}
                    onValueChange={(value) => handleSelectChange("countryCode", value)}
                  >
                    <SelectTrigger className="w-[120px] h-12 bg-secondary border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {countryCodes.map((cc) => (
                        <SelectItem key={cc.code} value={cc.code} className="cursor-pointer">
                          <span className="flex items-center gap-2">
                            <span>{cc.flag}</span>
                            <span>{cc.code}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <input
                    type="tel"
                    name="phone"
                    value={data.phone}
                    onChange={handleInputChange}
                    required
                    className="flex-1 h-12 px-4 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    placeholder="21 123 4567"
                  />
                </div>
                {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone}</p>}
              </div>

              {/* Email */}
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
                  className="w-full h-12 px-4 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  placeholder="john@example.com"
                />
                {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
              </div>

              {/* Locations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Pick-up Location *
                  </label>
                  <input
                    type="text"
                    name="pickupLocation"
                    value={data.pickupLocation}
                    onChange={handleInputChange}
                    required
                    className="w-full h-12 px-4 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    placeholder="e.g., Hamilton CBD"
                  />
                  {errors.pickupLocation && <p className="mt-1 text-xs text-red-400">{errors.pickupLocation}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Drop-off Location *
                  </label>
                  <input
                    type="text"
                    name="dropoffLocation"
                    value={data.dropoffLocation}
                    onChange={handleInputChange}
                    required
                    className="w-full h-12 px-4 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    placeholder="e.g., Auckland Airport"
                  />
                  {errors.dropoffLocation && <p className="mt-1 text-xs text-red-400">{errors.dropoffLocation}</p>}
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Date *
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-12 justify-start text-left font-normal bg-secondary border-border hover:bg-secondary/80",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                        {selectedDate ? format(selectedDate, "EEE, MMM d, yyyy") : "Select date"}
                        <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          setSelectedDate(date);
                          setData("date", date ? format(date, "yyyy-MM-dd") : "");
                        }}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.date && <p className="mt-1 text-xs text-red-400">{errors.date}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Time *
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-12 justify-start text-left font-normal bg-secondary border-border hover:bg-secondary/80",
                          !data.time && "text-muted-foreground"
                        )}
                      >
                        <Clock className="mr-2 h-4 w-4 text-primary" />
                        {data.time ? formatTimeDisplay(data.time) : "Select time"}
                        <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
                      <TimePicker
                        value={data.time}
                        onChange={(time) => handleSelectChange("time", time)}
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.time && <p className="mt-1 text-xs text-red-400">{errors.time}</p>}
                </div>
              </div>

              {/* Passengers & Flight */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Number of Passengers *
                  </label>
                  <Select
                    value={data.passengers}
                    onValueChange={(value) => handleSelectChange("passengers", value)}
                  >
                    <SelectTrigger className="w-full h-12 bg-secondary border-border">
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4 text-primary" />
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <SelectItem key={num} value={num.toString()} className="cursor-pointer">
                          {num} {num === 1 ? "Passenger" : "Passengers"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {(selectedService === "shared" || selectedService === "private") && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Flight Number (optional)
                    </label>
                    <input
                      type="text"
                      name="flightNumber"
                      value={data.flightNumber}
                      onChange={handleInputChange}
                      className="w-full h-12 px-4 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      placeholder="e.g., NZ123"
                    />
                  </div>
                )}
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Additional Notes (optional)
                </label>
                <textarea
                  name="message"
                  value={data.message}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                  placeholder="Any special requirements..."
                />
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
                  <p className="mt-1 text-xs text-red-400">{errors.recaptcha}</p>
                )}
              </div>

              {/* Submit */}
              <Button type="submit" variant="hero" size="xl" className="w-full" disabled={processing}>
                {processing ? "Submitting..." : <>Submit Booking Request <ArrowRight className="w-5 h-5 ml-2" /></>}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
