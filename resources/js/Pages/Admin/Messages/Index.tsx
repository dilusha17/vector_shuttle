import { useEffect, useRef, useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import { Search, Mail, MailOpen, MessageSquare, SlidersHorizontal, Eye } from "lucide-react";
import AdminLayout from "@/components/Admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
import type { ContactInquiry, PaginatedData } from "@/types/admin";

interface Props {
  inquiries: PaginatedData<ContactInquiry>;
  filters: { search?: string; filter?: string };
  unreadCount: number;
}

export default function MessagesIndex({ inquiries, filters, unreadCount }: Props) {
  const [search, setSearch] = useState(filters.search ?? "");
  const [filter, setFilter] = useState(filters.filter ?? "all");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const applyFilters = (overrides: Record<string, string>) => {
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (filter !== "all") params.filter = filter;
    Object.assign(params, overrides);
    router.get(route("admin.messages.index"), params, { preserveState: true, replace: true });
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => applyFilters({}), 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  const handleFilterChange = (val: string) => {
    setFilter(val);
    applyFilters({ filter: val === "all" ? "" : val });
  };

  return (
    <AdminLayout title="Messages">
      <Head title="Client Messages" />

      {/* Header stat */}
      {unreadCount > 0 && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-2.5 text-sm text-yellow-400">
          <Mail className="h-4 w-4 shrink-0" />
          <span>{unreadCount} unread {unreadCount === 1 ? "message" : "messages"}</span>
        </div>
      )}

      {/* Filters */}
      <Card className="mb-5 border-border bg-card">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative min-w-[200px] flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email or message…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <Select value={filter} onValueChange={handleFilterChange}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="replied">Replied</SelectItem>
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
                <TableHead className="w-5 pl-5 text-xs"></TableHead>
                <TableHead className="text-xs">Sender</TableHead>
                <TableHead className="text-xs">Service</TableHead>
                <TableHead className="text-xs">Message</TableHead>
                <TableHead className="text-xs">Received</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-16 text-center text-muted-foreground">
                    No messages found.
                  </TableCell>
                </TableRow>
              ) : (
                inquiries.data.map((m) => (
                  <TableRow
                    key={m.id}
                    className={`border-border hover:bg-secondary/40 ${!m.is_read ? "bg-primary/[0.03]" : ""}`}
                  >
                    <TableCell className="pl-5">
                      {!m.is_read ? (
                        <Mail className="h-3.5 w-3.5 text-primary" />
                      ) : (
                        <MailOpen className="h-3.5 w-3.5 text-muted-foreground opacity-40" />
                      )}
                    </TableCell>
                    <TableCell>
                      <p className={`text-sm ${!m.is_read ? "font-semibold" : "font-medium"}`}>
                        {m.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{m.email}</p>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{m.service_type}</TableCell>
                    <TableCell className="max-w-[220px]">
                      <p className="truncate text-sm text-muted-foreground">{m.message}</p>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(m.created_at).toLocaleDateString("en-NZ", {
                        day: "numeric", month: "short", year: "numeric",
                        timeZone: "Pacific/Auckland",
                      })}
                    </TableCell>
                    <TableCell>
                      {m.admin_reply ? (
                        <Badge className="border border-green-500/30 bg-green-500/15 text-green-400 text-xs" variant="outline">
                          Replied
                        </Badge>
                      ) : m.is_read ? (
                        <Badge className="border border-border bg-secondary text-muted-foreground text-xs" variant="outline">
                          Read
                        </Badge>
                      ) : (
                        <Badge className="border border-primary/30 bg-primary/10 text-primary text-xs" variant="outline">
                          New
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="pr-4">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={route("admin.messages.show", m.id)}>
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
      {inquiries.last_page > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>Showing {inquiries.from}–{inquiries.to} of {inquiries.total}</span>
          <div className="flex gap-1">
            {inquiries.links.map((link, i) => (
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
