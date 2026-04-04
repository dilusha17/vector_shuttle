import { useEffect, useRef, useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import { Search, SlidersHorizontal, ArrowUpDown, Eye } from "lucide-react";
import AdminLayout from "@/components/Admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { STATUS_LABELS, STATUS_COLORS } from "@/types/admin";
import type { Booking, BookingStatus, PaginatedData } from "@/types/admin";

interface Filters {
  search?: string;
  status?: string;
  service?: string;
  sort_by?: string;
  sort_dir?: string;
}

interface Props {
  bookings: PaginatedData<Booking>;
  filters: Filters;
  statuses: BookingStatus[];
}

const SERVICE_OPTIONS = [
  "Shared Airport Transfer",
  "Private Airport Transfer",
  "City to City Transfer",
  "Event Transport",
];

export default function BookingsIndex({ bookings, filters, statuses }: Props) {
  const [search, setSearch] = useState(filters.search ?? "");
  const [status, setStatus] = useState(filters.status ?? "all");
  const [service, setService] = useState(filters.service ?? "all");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const applyFilters = (overrides: Partial<Filters>) => {
    const params: Record<string, string> = {};
    const merged = {
      search,
      status: status === "all" ? "" : status,
      service: service === "all" ? "" : service,
      sort_by: filters.sort_by ?? "",
      sort_dir: filters.sort_dir ?? "",
      ...overrides,
    };
    Object.entries(merged).forEach(([k, v]) => {
      if (v) params[k] = v;
    });
    router.get(route("admin.bookings.index"), params, {
      preserveState: true,
      replace: true,
    });
  };

  // Debounce search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      applyFilters({ search });
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  const handleStatusChange = (val: string) => {
    setStatus(val);
    applyFilters({ status: val === "all" ? "" : val });
  };

  const handleServiceChange = (val: string) => {
    setService(val);
    applyFilters({ service: val === "all" ? "" : val });
  };

  const toggleSort = (column: string) => {
    const newDir =
      filters.sort_by === column && filters.sort_dir === "asc" ? "desc" : "asc";
    applyFilters({ sort_by: column, sort_dir: newDir });
  };

  const SortButton = ({ column }: { column: string }) => (
    <button onClick={() => toggleSort(column)} className="inline-flex items-center gap-1 hover:text-foreground">
      <ArrowUpDown className="h-3 w-3" />
    </button>
  );

  return (
    <AdminLayout title="Bookings">
      <Head title="Manage Bookings" />

      {/* Filters */}
      <Card className="mb-5 border-border bg-card">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative min-w-[200px] flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email or phone…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <Select value={status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {statuses.map((s) => (
                    <SelectItem key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={service} onValueChange={handleServiceChange}>
                <SelectTrigger className="w-52">
                  <SelectValue placeholder="All services" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  {SERVICE_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-border bg-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="pl-5 text-xs">
                  #
                </TableHead>
                <TableHead className="text-xs">Customer</TableHead>
                <TableHead className="text-xs">Service</TableHead>
                <TableHead className="text-xs">
                  <div className="flex items-center gap-1">
                    Date <SortButton column="date" />
                  </div>
                </TableHead>
                <TableHead className="text-xs">Passengers</TableHead>
                <TableHead className="text-xs">
                  <div className="flex items-center gap-1">
                    Status <SortButton column="status" />
                  </div>
                </TableHead>
                <TableHead className="text-xs">
                  <div className="flex items-center gap-1">
                    Submitted <SortButton column="created_at" />
                  </div>
                </TableHead>
                <TableHead className="text-xs"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-16 text-center text-muted-foreground"
                  >
                    No bookings found.
                  </TableCell>
                </TableRow>
              ) : (
                bookings.data.map((b) => (
                  <TableRow
                    key={b.id}
                    className="cursor-pointer border-border hover:bg-secondary/40"
                  >
                    <TableCell className="pl-5 text-sm font-mono text-muted-foreground">
                      {b.booking_number}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{b.full_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {b.client?.email ?? ''}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[150px]">
                      <span className="truncate text-sm">{b.service_name}</span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(b.date).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {b.passengers}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`border text-xs ${STATUS_COLORS[b.status]}`}
                        variant="outline"
                      >
                        {STATUS_LABELS[b.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(b.created_at).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Pacific/Auckland' })}
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

      {/* Pagination */}
      {bookings.last_page > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {bookings.from}–{bookings.to} of {bookings.total}
          </span>
          <div className="flex gap-1">
            {bookings.links.map((link, i) => (
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
