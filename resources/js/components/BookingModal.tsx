import { useRef, useState } from "react";
import { useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import ReCAPTCHA from "react-google-recaptcha";
import { X, Users, Car, MapPin, Calendar as CalendarIcon, ArrowRight, ArrowLeft, ChevronDown, PlaneLanding, PlaneTakeoff, Route, RotateCcw } from "lucide-react";
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
import { PhoneCountrySelect } from "@/components/ui/phone-country-select";
import { TimePicker24h } from "@/components/ui/time-picker-24h";

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string;

const AIRPORTS = [
  "Auckland Airport",
  "Ardmore Airport",
  "Hamilton Airport",
  "Tauranga Airport",
];

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ServiceType = "shared" | "private" | "cityToCity" | "event" | null;
type TripDirection = "arrival" | "departure" | null;
type TripType = "one_way" | "two_way" | null;

const services = [
  {
    id: "shared" as const,
    icon: Users,
    title: "Shared Airport Transfer",
    description: "Cost-effective scheduled rides to/from Auckland Airport — shared with other passengers",
  },
  {
    id: "private" as const,
    icon: Car,
    title: "Private Airport Transfer",
    description: "Exclusive door-to-door service to/from Auckland Airport with flexible timing",
  },
  {
    id: "cityToCity" as const,
    icon: MapPin,
    title: "City to City Transfer",
    description: "Travel between Hamilton and surrounding towns — Te Awamutu, Cambridge, Morrinsville, Huntly, Raglan and Matamata",
  },
  {
    id: "event" as const,
    icon: CalendarIcon,
    title: "Event Transport",
    description: "Group transport for weddings, corporate events and special occasions",
  },
];

const BookingModal = ({ isOpen, onClose }: BookingModalProps) => {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<ServiceType>(null);
  const [selectedDirection, setSelectedDirection] = useState<TripDirection>(null);
  const [selectedTripType, setSelectedTripType] = useState<TripType>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedReturnDate, setSelectedReturnDate] = useState<Date | undefined>(undefined);
  const [dateOpen, setDateOpen] = useState(false);
  const [returnDateOpen, setReturnDateOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);
  const [returnTimeOpen, setReturnTimeOpen] = useState(false);
  const [countryKey, setCountryKey] = useState("+64||New Zealand");
  const [selectedAirport, setSelectedAirport] = useState(AIRPORTS[0]);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const { data, setData, post, processing, errors, reset } = useForm({
    service: "" as string,
    tripDirection: "" as string,
    tripType: "" as string,
    firstName: "",
    lastName: "",
    countryCode: "+64",
    phone: "",
    email: "",
    pickupLocation: "",
    dropoffLocation: "",
    date: "",
    time: "",
    returnDate: "",
    returnTime: "",
    returnPickupLocation: "",
    returnDropoffLocation: "",
    passengers: "1",
    flightNumber: "",
    message: "",
    recaptcha: "",
    _honey: "",
  });

  const needsDirection = (s: ServiceType) => s === "shared" || s === "private";
  const needsTripType  = (s: ServiceType) => s === "cityToCity" || s === "event";

  const handleServiceSelect = (serviceId: ServiceType) => {
    setSelectedService(serviceId);
    setData("service", serviceId ?? "");
    if (needsDirection(serviceId)) {
      setStep(2);
    } else if (needsTripType(serviceId)) {
      setStep(2);
    } else {
      setSelectedDirection(null);
      setSelectedTripType(null);
      setData("tripDirection", "");
      setData("tripType", "");
      setStep(3);
    }
  };

  const handleDirectionSelect = (dir: TripDirection) => {
    setSelectedDirection(dir);
    setData("tripDirection", dir ?? "");
    if (dir === "arrival") {
      setData("pickupLocation", selectedAirport);
      setData("dropoffLocation", "");
    } else if (dir === "departure") {
      setData("pickupLocation", "");
      setData("dropoffLocation", selectedAirport);
    }
    setStep(3);
  };

  const handleTripTypeSelect = (type: TripType) => {
    setSelectedTripType(type);
    setData("tripType", type ?? "");
    setStep(3);
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
      toast.error("Please select a travel date.");
      return;
    }
    if (!data.time) {
      toast.error("Please select a departure time.");
      return;
    }
    if (selectedTripType === "two_way") {
      if (!selectedReturnDate) {
        toast.error("Please select a return date.");
        return;
      }
      if (!data.returnTime) {
        toast.error("Please select a return time.");
        return;
      }
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
    if (step === 3 && (needsDirection(selectedService) || needsTripType(selectedService))) {
      setStep(2);
    } else if (step === 3) {
      setStep(1);
      setSelectedService(null);
    } else if (step === 2) {
      setStep(1);
      setSelectedService(null);
      setSelectedDirection(null);
      setSelectedTripType(null);
    }
  };

  const handleClose = () => {
    onClose();
    setStep(1);
    setSelectedService(null);
    setSelectedDirection(null);
    setSelectedTripType(null);
    setSelectedDate(undefined);
    setSelectedReturnDate(undefined);
    setDateOpen(false);
    setReturnDateOpen(false);
    setTimeOpen(false);
    setReturnTimeOpen(false);
    setCountryKey("+64||New Zealand");
    setSelectedAirport(AIRPORTS[0]);
    recaptchaRef.current?.reset();
    reset();
  };

  const isAirportPickup  = selectedDirection === "arrival";
  const isAirportDropoff = selectedDirection === "departure";
  const isTwoWay = selectedTripType === "two_way";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-card border border-border rounded-2xl shadow-soft animate-fade-in-up overflow-hidden">
        <div className="h-full max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/20 hover:[&::-webkit-scrollbar-thumb]:bg-white/30">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-card border-b border-border rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {step === 1 && "Select Your Service"}
              {step === 2 && needsDirection(selectedService) && "Select Direction"}
              {step === 2 && needsTripType(selectedService) && "One Way or Two Way?"}
              {step === 3 && "Booking Details"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {step === 1 && "Choose the service that best fits your needs"}
              {step === 2 && services.find((s) => s.id === selectedService)?.title}
              {step === 3 && services.find((s) => s.id === selectedService)?.title}
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
          {step === 1 && (
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
          )}

          {step === 2 && needsDirection(selectedService) && (
            /* Step 2a: Arrival / Departure (shared/private) */
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => { setStep(1); setSelectedService(null); }}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to services
              </button>
              <p className="text-sm text-muted-foreground">Are you flying in or flying out?</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleDirectionSelect("arrival")}
                  className="group p-6 rounded-xl bg-secondary/50 border border-border text-left hover:border-primary hover:bg-secondary transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-lg gradient-teal flex items-center justify-center mb-4 group-hover:glow-teal transition-all duration-300">
                    <PlaneLanding className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Arrival</h3>
                  <p className="text-sm text-muted-foreground">Flying in — we pick you up from the airport</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleDirectionSelect("departure")}
                  className="group p-6 rounded-xl bg-secondary/50 border border-border text-left hover:border-primary hover:bg-secondary transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-lg gradient-teal flex items-center justify-center mb-4 group-hover:glow-teal transition-all duration-300">
                    <PlaneTakeoff className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Departure</h3>
                  <p className="text-sm text-muted-foreground">Flying out — we drop you off at the airport</p>
                </button>
              </div>
            </div>
          )}

          {step === 2 && needsTripType(selectedService) && (
            /* Step 2b: One Way / Two Way (cityToCity/event) */
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => { setStep(1); setSelectedService(null); }}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to services
              </button>
              <p className="text-sm text-muted-foreground">How would you like to travel?</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleTripTypeSelect("one_way")}
                  className="group p-6 rounded-xl bg-secondary/50 border border-border text-left hover:border-primary hover:bg-secondary transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-lg gradient-teal flex items-center justify-center mb-4 group-hover:glow-teal transition-all duration-300">
                    <Route className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">One Way</h3>
                  <p className="text-sm text-muted-foreground">Single trip from pick-up to drop-off</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleTripTypeSelect("two_way")}
                  className="group p-6 rounded-xl bg-secondary/50 border border-border text-left hover:border-primary hover:bg-secondary transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-lg gradient-teal flex items-center justify-center mb-4 group-hover:glow-teal transition-all duration-300">
                    <RotateCcw className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Two Way</h3>
                  <p className="text-sm text-muted-foreground">Return trip included — go and come back</p>
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            /* Step 3: Booking Form */
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
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">First Name *</label>
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
                  <label className="block text-sm font-medium text-foreground mb-2">Last Name *</label>
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
                <label className="block text-sm font-medium text-foreground mb-2">WhatsApp Number *</label>
                <div className="flex gap-2">
                  <PhoneCountrySelect
                    value={countryKey}
                    onChange={(key) => {
                      setCountryKey(key);
                      handleSelectChange("countryCode", key.split("||")[0]);
                    }}
                    className="w-[130px]"
                  />
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
                <label className="block text-sm font-medium text-foreground mb-2">Email Address *</label>
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

              {/* ─── Outbound Trip ─── */}
              {isTwoWay && (
                <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 pt-3 pb-1">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">Outbound Trip</p>
                </div>
              )}

              {/* Locations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Pick-up Location *</label>
                  {isAirportPickup ? (
                    <Select
                      value={selectedAirport}
                      onValueChange={(v) => { setSelectedAirport(v); setData("pickupLocation", v); }}
                    >
                      <SelectTrigger className="w-full h-12 bg-secondary border-border">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary shrink-0" />
                          <SelectValue />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        {AIRPORTS.map((airport) => (
                          <SelectItem key={airport} value={airport} className="cursor-pointer">{airport}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <input
                      type="text"
                      name="pickupLocation"
                      value={data.pickupLocation}
                      onChange={handleInputChange}
                      required
                      className="w-full h-12 px-4 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      placeholder="ex: Hamilton CBD"
                    />
                  )}
                  {errors.pickupLocation && <p className="mt-1 text-xs text-red-400">{errors.pickupLocation}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Drop-off Location *</label>
                  {isAirportDropoff ? (
                    <Select
                      value={selectedAirport}
                      onValueChange={(v) => { setSelectedAirport(v); setData("dropoffLocation", v); }}
                    >
                      <SelectTrigger className="w-full h-12 bg-secondary border-border">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary shrink-0" />
                          <SelectValue />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        {AIRPORTS.map((airport) => (
                          <SelectItem key={airport} value={airport} className="cursor-pointer">{airport}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <input
                      type="text"
                      name="dropoffLocation"
                      value={data.dropoffLocation}
                      onChange={handleInputChange}
                      required
                      className="w-full h-12 px-4 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      placeholder="ex: Auckland CBD"
                    />
                  )}
                  {errors.dropoffLocation && <p className="mt-1 text-xs text-red-400">{errors.dropoffLocation}</p>}
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{isTwoWay ? "Departure Date *" : "Date *"}</label>
                  <Popover open={dateOpen} onOpenChange={setDateOpen}>
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
                    <PopoverContent className="w-auto p-0 bg-card border-border" align="center">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          setSelectedDate(date);
                          setData("date", date ? format(date, "yyyy-MM-dd") : "");
                          setDateOpen(false);
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
                  <label className="block text-sm font-medium text-foreground mb-2">{isTwoWay ? "Departure Time *" : "Time *"}</label>
                  <Popover open={timeOpen} onOpenChange={setTimeOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-12 justify-start text-left font-normal bg-secondary border-border hover:bg-secondary/80",
                          !data.time && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                        {data.time || "Select time"}
                        <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-4 bg-card border-border" align="center">
                      <TimePicker24h value={data.time} onChange={(t) => setData("time", t)} />
                    </PopoverContent>
                  </Popover>
                  {errors.time && <p className="mt-1 text-xs text-red-400">{errors.time}</p>}
                </div>
              </div>

              {/* ─── Return Trip (Two Way only) ─── */}
              {isTwoWay && (
                <div className="space-y-4 rounded-xl border border-border bg-secondary/30 p-4">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider">Return Trip</p>

                  {/* Return Locations */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Return Pick-up Location *</label>
                      <input
                        type="text"
                        name="returnPickupLocation"
                        value={data.returnPickupLocation}
                        onChange={handleInputChange}
                        required={isTwoWay}
                        className="w-full h-12 px-4 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        placeholder="ex: Auckland CBD"
                      />
                      {errors.returnPickupLocation && <p className="mt-1 text-xs text-red-400">{errors.returnPickupLocation}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Return Drop-off Location *</label>
                      <input
                        type="text"
                        name="returnDropoffLocation"
                        value={data.returnDropoffLocation}
                        onChange={handleInputChange}
                        required={isTwoWay}
                        className="w-full h-12 px-4 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        placeholder="ex: Hamilton CBD"
                      />
                      {errors.returnDropoffLocation && <p className="mt-1 text-xs text-red-400">{errors.returnDropoffLocation}</p>}
                    </div>
                  </div>

                  {/* Return Date & Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Return Date *</label>
                      <Popover open={returnDateOpen} onOpenChange={setReturnDateOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full h-12 justify-start text-left font-normal bg-secondary border-border hover:bg-secondary/80",
                              !selectedReturnDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                            {selectedReturnDate ? format(selectedReturnDate, "EEE, MMM d, yyyy") : "Select return date"}
                            <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-card border-border" align="center">
                          <Calendar
                            mode="single"
                            selected={selectedReturnDate}
                            onSelect={(date) => {
                              setSelectedReturnDate(date);
                              setData("returnDate", date ? format(date, "yyyy-MM-dd") : "");
                              setReturnDateOpen(false);
                            }}
                            disabled={(date) => {
                              const minDate = selectedDate ?? new Date(new Date().setHours(0, 0, 0, 0));
                              return date < minDate;
                            }}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      {errors.returnDate && <p className="mt-1 text-xs text-red-400">{errors.returnDate}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Return Time *</label>
                      <Popover open={returnTimeOpen} onOpenChange={setReturnTimeOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full h-12 justify-start text-left font-normal bg-secondary border-border hover:bg-secondary/80",
                              !data.returnTime && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                            {data.returnTime || "Select time"}
                            <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-4 bg-card border-border" align="center">
                          <TimePicker24h value={data.returnTime} onChange={(t) => setData("returnTime", t)} />
                        </PopoverContent>
                      </Popover>
                      {errors.returnTime && <p className="mt-1 text-xs text-red-400">{errors.returnTime}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Passengers & Flight */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Number of Passengers *</label>
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
                    <label className="block text-sm font-medium text-foreground mb-2">Flight Number (optional)</label>
                    <input
                      type="text"
                      name="flightNumber"
                      value={data.flightNumber}
                      onChange={handleInputChange}
                      className="w-full h-12 px-4 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      placeholder="ex: NZ123"
                    />
                  </div>
                )}
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Additional Notes (optional)</label>
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

              <p className="text-xs text-center text-muted-foreground">
                By submitting you agree to our{" "}
                <a href="/terms" className="underline hover:text-foreground" target="_blank" rel="noopener noreferrer">
                  Terms &amp; Conditions
                </a>.
              </p>
            </form>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
