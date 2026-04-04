import { Head, Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import { ArrowLeft, Mail, Phone, Calendar, MapPin, Eye } from "lucide-react";
import AdminLayout from "@/components/Admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { STATUS_LABELS, STATUS_COLORS } from "@/types/admin";
import type { Client } from "@/types/admin";

interface Props {
  client: Client;
}

export default function ClientShow({ client }: Props) {
  return (
    <AdminLayout title={`Client — ${client.full_name}`}>
      <Head title={`Client — ${client.full_name}`} />

      {/* Top bar */}
      <div className="mb-5 flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href={route("admin.clients.index")}>
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            All Clients
          </Link>
        </Button>
        <Separator orientation="vertical" className="h-5" />
        <span className="text-sm text-muted-foreground">#{client.id}</span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Client Details */}
        <Card className="border-border bg-card lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15">
                <span className="text-lg font-bold text-primary">
                  {client.first_name.charAt(0)}{client.last_name.charAt(0)}
                </span>
              </div>
              <div>
                <CardTitle className="text-base">{client.full_name}</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Client since{" "}
                  {new Date(client.created_at).toLocaleDateString("en-NZ", {
                    day: "numeric", month: "long", year: "numeric",
                    timeZone: "Pacific/Auckland",
                  })}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <Separator />
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
              <a href={`mailto:${client.email}`} className="text-primary hover:underline">
                {client.email}
              </a>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="text-foreground">{client.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="text-muted-foreground">
                {client.bookings?.length ?? 0} booking(s)
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Booking History */}
        <div className="lg:col-span-2">
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Booking History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="pl-5 text-xs">#</TableHead>
                    <TableHead className="text-xs">Service</TableHead>
                    <TableHead className="text-xs">Trip Type</TableHead>
                    <TableHead className="text-xs">Date</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-xs"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(!client.bookings || client.bookings.length === 0) ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                        No bookings yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    client.bookings.map((b) => (
                      <TableRow key={b.id} className="border-border hover:bg-secondary/40">
                        <TableCell className="pl-5 text-sm text-muted-foreground">#{b.id}</TableCell>
                        <TableCell className="text-sm">{b.service_name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {b.trip_type?.name ?? "—"}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(b.date).toLocaleDateString("en-NZ", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`border text-xs ${STATUS_COLORS[b.status]}`}
                            variant="outline"
                          >
                            {STATUS_LABELS[b.status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="pr-4">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={route("admin.bookings.show", b.id)}>
                              <Eye className="mr-1.5 h-3.5 w-3.5" />
                              View
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
