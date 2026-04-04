import { useState } from "react";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Users,
  Plane,
  PlaneLanding,
  MessageSquare,
  DollarSign,
  User,
  CheckCircle,
  XCircle,
  Send,
  Truck,
  Flag,
  ShieldCheck,
  RotateCcw,
  History,
} from "lucide-react";
import AdminLayout from "@/components/Admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { STATUS_LABELS, STATUS_COLORS } from "@/types/admin";
import type { Booking, BookingHistoryEntry } from "@/types/admin";

interface Props {
  booking: Booking;
}

const DetailRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-start gap-3 py-3">
    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
      <Icon className="h-4 w-4 text-muted-foreground" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 text-sm text-foreground">{value || "—"}</p>
    </div>
  </div>
);

// Accept with Quotation Dialog
const AcceptDialog = ({ booking }: { booking: Booking }) => {
  const [open, setOpen] = useState(false);
  const { data, setData, post, processing, errors, reset } = useForm({
    quoted_amount: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("admin.bookings.accept", booking.id), {
      onSuccess: () => {
        setOpen(false);
        reset();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Send className="h-4 w-4" />
          Accept & Send Quotation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Accept Booking & Send Quotation</DialogTitle>
            <DialogDescription>
              Enter the service charge to send a quotation email to{" "}
              <span className="font-medium text-foreground">
                {booking.client?.first_name ?? booking.full_name}
              </span>
              . The booking status will be updated to{" "}
              <em>Awaiting Confirmation</em>.
            </DialogDescription>
          </DialogHeader>

          <div className="my-5 space-y-4">
            <div className="rounded-lg border border-border bg-secondary/40 p-4">
              <p className="text-xs text-muted-foreground">
                {booking.service_name}
              </p>
              <p className="text-sm font-medium">
                {booking.pickup_location} → {booking.dropoff_location}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {new Date(booking.date).toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' })} at {booking.time} · {booking.passengers}{" "}
                passenger(s)
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="quoted_amount">Quoted Amount (NZD)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  $
                </span>
                <Input
                  id="quoted_amount"
                  type="number"
                  step="0.01"
                  min="0"
                  max="99999"
                  placeholder="0.00"
                  value={data.quoted_amount}
                  onChange={(e) => setData("quoted_amount", e.target.value)}
                  className={`pl-7 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${errors.quoted_amount ? "border-destructive" : ""}`}
                  autoFocus
                />
              </div>
              {errors.quoted_amount && (
                <p className="text-xs text-destructive">
                  {errors.quoted_amount}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={processing} className="gap-2">
              <Send className="h-4 w-4" />
              {processing ? "Sending…" : "Send Quotation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Reject confirmation dialog
const RejectDialog = ({ booking }: { booking: Booking }) => {
  const [open, setOpen] = useState(false);
  const { post, processing } = useForm({});

  const handleReject = () => {
    post(route("admin.bookings.reject", booking.id), {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="gap-2">
          <XCircle className="h-4 w-4" />
          Reject
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Reject Booking</DialogTitle>
          <DialogDescription>
            Are you sure you want to reject this booking for{" "}
            <span className="font-medium text-foreground">
              {booking.full_name}
            </span>
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={processing}
          >
            {processing ? "Rejecting…" : "Yes, Reject"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Generic action button (confirm, start, complete)
const ActionButton = ({
  label,
  icon: Icon,
  routeName,
  bookingId,
  variant = "default",
  className,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  routeName: string;
  bookingId: number;
  variant?: "default" | "outline" | "secondary";
  className?: string;
}) => {
  const { post, processing } = useForm({});

  return (
    <Button
      variant={variant}
      disabled={processing}
      onClick={() => post(route(routeName, bookingId))}
      className={`gap-2 ${className ?? ""}`}
    >
      <Icon className="h-4 w-4" />
      {processing ? "Updating…" : label}
    </Button>
  );
};

export default function BookingShow({ booking }: Props) {
  const isPending = booking.status === "pending";
  const isAwaiting = booking.status === "awaiting_confirmation";
  const isConfirmed = booking.status === "confirmed";
  const isOngoing = booking.status === "ongoing";
  const isTerminal =
    booking.status === "completed" || booking.status === "rejected";
  const canReject =
    !isTerminal && booking.status !== "ongoing" && booking.status !== "completed";

  return (
    <AdminLayout title={`Booking ${booking.booking_number}`}>
      <Head title={`Booking ${booking.booking_number}`} />

      {/* Top bar */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href={route("admin.bookings.index")}>
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            All Bookings
          </Link>
        </Button>
        <Separator orientation="vertical" className="h-5" />
        <span className="font-mono text-sm text-muted-foreground">{booking.booking_number}</span>
        <Badge
          className={`border text-xs ${STATUS_COLORS[booking.status]}`}
          variant="outline"
        >
          {STATUS_LABELS[booking.status]}
        </Badge>
        <span className="ml-auto text-xs text-muted-foreground">
          Submitted{" "}
          {new Date(booking.created_at).toLocaleString("en-NZ", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            timeZone: "Pacific/Auckland",
          })}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left — Booking Details */}
        <div className="space-y-5 lg:col-span-2">
          {/* Customer Details */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-0">
              <CardTitle className="text-sm font-semibold">
                Customer Details
              </CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-border">
              <DetailRow
                icon={User}
                label="Full Name"
                value={booking.full_name}
              />
              <DetailRow icon={Mail} label="Email" value={booking.client?.email} />
              <DetailRow icon={Phone} label="Phone" value={booking.client?.phone} />
            </CardContent>
          </Card>

          {/* Trip Details */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-0">
              <CardTitle className="text-sm font-semibold">
                Trip Details
              </CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-border">
              <DetailRow
                icon={MapPin}
                label="Service"
                value={booking.service_name}
              />
              {booking.trip_type && (
                <DetailRow
                  icon={PlaneLanding}
                  label="Trip Type"
                  value={booking.trip_type.name}
                />
              )}
              <DetailRow
                icon={MapPin}
                label="Pick-up Location"
                value={booking.pickup_location}
              />
              <DetailRow
                icon={MapPin}
                label="Drop-off Location"
                value={booking.dropoff_location}
              />
              <DetailRow
                icon={Calendar}
                label="Date"
                value={new Date(booking.date).toLocaleDateString('en-NZ', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              />
              <DetailRow icon={Clock} label="Time" value={booking.time} />
              <DetailRow
                icon={Users}
                label="Passengers"
                value={`${booking.passengers} passenger(s)`}
              />
              {booking.flight_number && (
                <DetailRow
                  icon={Plane}
                  label="Flight Number"
                  value={booking.flight_number}
                />
              )}
              {booking.return_date && (
                <>
                  <div className="pt-2 pb-1">
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider">Return Trip</p>
                  </div>
                  <DetailRow
                    icon={MapPin}
                    label="Return Pick-up"
                    value={booking.return_pickup_location}
                  />
                  <DetailRow
                    icon={MapPin}
                    label="Return Drop-off"
                    value={booking.return_dropoff_location}
                  />
                  <DetailRow
                    icon={Calendar}
                    label="Return Date"
                    value={new Date(booking.return_date).toLocaleDateString('en-NZ', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  />
                  <DetailRow icon={Clock} label="Return Time" value={booking.return_time} />
                </>
              )}
              {booking.message && (
                <DetailRow
                  icon={MessageSquare}
                  label="Additional Notes"
                  value={booking.message}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right — Actions & Status */}
        <div className="space-y-5">
          {/* Actions Card */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {isPending && (
                <div className="flex flex-wrap gap-2">
                  <AcceptDialog booking={booking} />
                  <RejectDialog booking={booking} />
                </div>
              )}

              {isAwaiting && (
                <div className="flex flex-wrap gap-2">
                  <ActionButton
                    label="Mark as Confirmed"
                    icon={ShieldCheck}
                    routeName="admin.bookings.confirm"
                    bookingId={booking.id}
                  />
                  <RejectDialog booking={booking} />
                </div>
              )}

              {isConfirmed && (
                <ActionButton
                  label="Start Trip (Ongoing)"
                  icon={Truck}
                  routeName="admin.bookings.start"
                  bookingId={booking.id}
                  className="bg-orange-500 text-white hover:bg-orange-600 border-0"
                />
              )}

              {isOngoing && (
                <ActionButton
                  label="Mark as Completed"
                  icon={Flag}
                  routeName="admin.bookings.complete"
                  bookingId={booking.id}
                />
              )}

              {isTerminal && (
                <p className="text-sm text-muted-foreground">
                  This booking is{" "}
                  <span className="font-medium text-foreground capitalize">
                    {booking.status}
                  </span>
                  . No further actions are available.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Quotation Card */}
          {booking.quoted_amount && (
            <Card className="border-primary/30 bg-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">
                  Quoted Amount
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      NZD ${parseFloat(booking.quoted_amount).toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Quotation sent to client
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Admin Processor */}
          {booking.processor && (
            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">
                  Processed By
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                    <span className="text-sm font-semibold text-primary">
                      {booking.processor.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {booking.processor.name}
                    </p>
                    <p className="text-xs capitalize text-muted-foreground">
                      {booking.processor.role}
                    </p>
                  </div>
                </div>
                {booking.processed_at && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Updated: {new Date(booking.processed_at).toLocaleString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Pacific/Auckland' })}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Status Flow Guide */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">
                Status Flow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2 text-xs text-muted-foreground">
                {[
                  { status: "pending", label: "Pending" },
                  {
                    status: "awaiting_confirmation",
                    label: "Quotation Sent",
                  },
                  { status: "confirmed", label: "Client Confirmed" },
                  { status: "ongoing", label: "Trip Ongoing" },
                  { status: "completed", label: "Completed" },
                ].map((step, i) => (
                  <li key={step.status} className="flex items-center gap-2">
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                        booking.status === step.status
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span
                      className={
                        booking.status === step.status
                          ? "font-medium text-foreground"
                          : ""
                      }
                    >
                      {step.label}
                    </span>
                    {booking.status === step.status && (
                      <CheckCircle className="h-3 w-3 text-primary" />
                    )}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Booking History — full width below grid */}
      {booking.history && booking.history.length > 0 && (
        <div className="mt-6">
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <History className="h-4 w-4 text-primary" />
                Booking History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="relative border-l border-border ml-3 space-y-0">
                {booking.history.map((entry, i) => (
                  <li key={entry.id} className="mb-6 ml-6 last:mb-0">
                    <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-secondary ring-4 ring-card">
                      <span className="h-2 w-2 rounded-full bg-primary" />
                    </span>
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{entry.action}</p>
                        {(entry.from_status || entry.to_status) && (
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {entry.from_status && (
                              <span className="capitalize">{entry.from_status.replace(/_/g, ' ')}</span>
                            )}
                            {entry.from_status && entry.to_status && " → "}
                            {entry.to_status && (
                              <span className={`font-medium capitalize ${STATUS_COLORS[entry.to_status as keyof typeof STATUS_COLORS]?.split(' ')[1] ?? 'text-foreground'}`}>
                                {entry.to_status.replace(/_/g, ' ')}
                              </span>
                            )}
                          </p>
                        )}
                        {entry.note && (
                          <p className="mt-1 text-xs text-muted-foreground italic">{entry.note}</p>
                        )}
                        <p className="mt-1 text-xs text-muted-foreground">
                          {entry.performer
                            ? <>By <span className="font-medium text-foreground">{entry.performer.name}</span></>
                            : <span className="italic">Customer</span>}
                        </p>
                      </div>
                      <time className="shrink-0 text-xs text-muted-foreground">
                        {new Date(entry.created_at).toLocaleString('en-NZ', {
                          day: '2-digit', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit', hour12: true,
                          timeZone: 'Pacific/Auckland',
                        })}
                      </time>
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      )}
    </AdminLayout>
  );
}
