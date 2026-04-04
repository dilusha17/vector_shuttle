import { useEffect, useRef, useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import { Search, History } from "lucide-react";
import AdminLayout from "@/components/Admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { STATUS_COLORS } from "@/types/admin";
import type { BookingHistoryEntry, PaginatedData } from "@/types/admin";

interface Props {
  history: PaginatedData<BookingHistoryEntry>;
  filters: { search?: string; booking_id?: string };
}

export default function HistoryIndex({ history, filters }: Props) {
  const [search, setSearch] = useState(filters.search ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (filters.booking_id) params.booking_id = filters.booking_id;
      router.get(route("admin.history.index"), params, { preserveState: true, replace: true });
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  return (
    <AdminLayout title="Booking History">
      <Head title="Booking Activity Log" />

      {/* Search */}
      <Card className="mb-5 border-border bg-card">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[240px] flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by booking #, action, note or staff name…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            {filters.booking_id && (
              <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-1.5 text-sm text-primary">
                <span>Booking #{filters.booking_id}</span>
                <button
                  onClick={() => router.get(route("admin.history.index"))}
                  className="ml-1 text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      {history.data.length === 0 ? (
        <Card className="border-border bg-card">
          <CardContent className="py-16 text-center text-muted-foreground">
            No history entries found.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {history.data.map((entry) => (
            <Card key={entry.id} className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
                      <History className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">{entry.action}</p>
                        {entry.booking && (
                          <Link
                            href={route("admin.bookings.show", entry.booking_id)}
                            className="text-xs text-primary hover:underline"
                          >
                            {entry.booking.booking_number ?? `#${entry.booking_id}`}
                          </Link>
                        )}
                      </div>

                      {entry.booking && (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {entry.booking.full_name} · {entry.booking.service_name}
                        </p>
                      )}

                      {(entry.from_status || entry.to_status) && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {entry.from_status && (
                            <span className="capitalize">{entry.from_status.replace(/_/g, " ")}</span>
                          )}
                          {entry.from_status && entry.to_status && " → "}
                          {entry.to_status && (
                            <span
                              className={`font-medium capitalize ${
                                STATUS_COLORS[entry.to_status as keyof typeof STATUS_COLORS]?.split(" ")[1] ?? "text-foreground"
                              }`}
                            >
                              {entry.to_status.replace(/_/g, " ")}
                            </span>
                          )}
                        </p>
                      )}

                      {entry.note && (
                        <p className="mt-1 text-xs italic text-muted-foreground">{entry.note}</p>
                      )}

                      <p className="mt-1.5 text-xs text-muted-foreground">
                        {entry.performer ? (
                          <>By <span className="font-medium text-foreground">{entry.performer.name}</span></>
                        ) : (
                          <span className="italic">Customer</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <time className="shrink-0 text-xs text-muted-foreground">
                    {new Date(entry.created_at).toLocaleString("en-NZ", {
                      day: "2-digit", month: "short", year: "numeric",
                      hour: "2-digit", minute: "2-digit", hour12: true,
                      timeZone: "Pacific/Auckland",
                    })}
                  </time>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {history.last_page > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>Showing {history.from}–{history.to} of {history.total}</span>
          <div className="flex gap-1">
            {history.links.map((link, i) => (
              <Button
                key={i}
                variant={link.active ? "default" : "ghost"}
                size="sm"
                disabled={!link.url}
                onClick={() => link.url && router.get(link.url)}
                dangerouslySetInnerHTML={{ __html: link.label }}
                className="h-8 min-w-8 text-xs"
              />
            ))}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
