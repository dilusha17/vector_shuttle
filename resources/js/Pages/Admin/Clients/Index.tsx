import { useEffect, useRef, useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import { Search, Users, Eye, Calendar } from "lucide-react";
import AdminLayout from "@/components/Admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Client, PaginatedData } from "@/types/admin";

interface Props {
  clients: PaginatedData<Client>;
  filters: { search?: string };
}

export default function ClientsIndex({ clients, filters }: Props) {
  const [search, setSearch] = useState(filters.search ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      router.get(
        route("admin.clients.index"),
        search ? { search } : {},
        { preserveState: true, replace: true },
      );
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  return (
    <AdminLayout title="Clients">
      <Head title="Client Management" />

      {/* Search */}
      <Card className="mb-5 border-border bg-card">
        <CardContent className="p-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, email or phone…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-border bg-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="pl-5 text-xs">#</TableHead>
                <TableHead className="text-xs">Name</TableHead>
                <TableHead className="text-xs">Email</TableHead>
                <TableHead className="text-xs">Phone</TableHead>
                <TableHead className="text-xs">Bookings</TableHead>
                <TableHead className="text-xs">Joined</TableHead>
                <TableHead className="text-xs"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-16 text-center text-muted-foreground">
                    No clients found.
                  </TableCell>
                </TableRow>
              ) : (
                clients.data.map((c) => (
                  <TableRow key={c.id} className="border-border hover:bg-secondary/40">
                    <TableCell className="pl-5 text-sm text-muted-foreground">#{c.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15">
                          <span className="text-xs font-bold text-primary">
                            {c.first_name.charAt(0)}{c.last_name.charAt(0)}
                          </span>
                        </div>
                        <p className="text-sm font-medium">{c.full_name}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{c.email}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{c.phone}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {c.bookings_count ?? 0}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(c.created_at).toLocaleDateString("en-NZ", {
                        day: "numeric", month: "short", year: "numeric",
                        timeZone: "Pacific/Auckland",
                      })}
                    </TableCell>
                    <TableCell className="pr-4">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={route("admin.clients.show", c.id)}>
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
      {clients.last_page > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>Showing {clients.from}–{clients.to} of {clients.total}</span>
          <div className="flex gap-1">
            {clients.links.map((link, i) => (
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
