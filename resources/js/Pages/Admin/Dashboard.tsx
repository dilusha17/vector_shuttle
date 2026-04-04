import { Head, Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import {
  CalendarCheck,
  Clock,
  CheckCircle,
  Bell,
  ShieldCheck,
  Truck,
  CheckSquare,
  XCircle,
  ArrowRight,
  Inbox,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import AdminLayout from "@/components/Admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { STATUS_LABELS, STATUS_COLORS } from "@/types/admin";
import type { BookingStatus } from "@/types/admin";

interface Stats {
  total: number;
  pending: number;
  accepted: number;
  awaiting_confirmation: number;
  confirmed: number;
  ongoing: number;
  completed: number;
  rejected: number;
  unread_messages: number;
}

interface RecentBooking {
  id: number;
  full_name: string;
  service: string;
  date: string;
  status: BookingStatus;
  created_at: string;
}

interface Props {
  stats: Stats;
  recentBookings: RecentBooking[];
  statusBreakdown: Partial<Record<BookingStatus, number>>;
}

const statCards = [
  {
    key: "total" as const,
    label: "Total Bookings",
    icon: CalendarCheck,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    key: "pending" as const,
    label: "Pending",
    icon: Clock,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
  },
  {
    key: "accepted" as const,
    label: "Accepted",
    icon: CheckCircle,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    key: "awaiting_confirmation" as const,
    label: "Awaiting Confirmation",
    icon: Bell,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    key: "confirmed" as const,
    label: "Confirmed",
    icon: ShieldCheck,
    color: "text-teal-400",
    bg: "bg-teal-500/10",
  },
  {
    key: "ongoing" as const,
    label: "Ongoing",
    icon: Truck,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
  },
  {
    key: "completed" as const,
    label: "Completed",
    icon: CheckSquare,
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
  {
    key: "rejected" as const,
    label: "Rejected",
    icon: XCircle,
    color: "text-red-400",
    bg: "bg-red-500/10",
  },
  {
    key: "unread_messages" as const,
    label: "Unread Messages",
    icon: Inbox,
    color: "text-sky-400",
    bg: "bg-sky-500/10",
  },
];

const PIE_COLORS: Record<string, string> = {
  pending: "#eab308",
  accepted: "#3b82f6",
  awaiting_confirmation: "#a855f7",
  confirmed: "#14b8a6",
  ongoing: "#f97316",
  completed: "#22c55e",
  rejected: "#ef4444",
};

export default function Dashboard({
  stats,
  recentBookings,
  statusBreakdown,
}: Props) {
  const chartData = Object.entries(statusBreakdown)
    .filter(([, v]) => v > 0)
    .map(([status, count]) => ({
      name: STATUS_LABELS[status as BookingStatus] ?? status,
      value: count,
      color: PIE_COLORS[status] ?? "#64748b",
    }));

  return (
    <AdminLayout title="Dashboard">
      <Head title="Admin Dashboard" />

      {/* Stat Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(({ key, label, icon: Icon, color, bg }) => (
          <Card key={key} className="border-border bg-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    {label}
                  </p>
                  <p className="mt-1 text-3xl font-bold text-foreground">
                    {stats[key as keyof Stats]}
                  </p>
                </div>
                <div className={`rounded-xl p-3 ${bg}`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart + Recent Bookings */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Status Breakdown Chart */}
        <Card className="border-border bg-card lg:col-span-2">
          <CardHeader className="pb-0">
            <CardTitle className="text-sm font-semibold">
              Booking Status Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={3}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(0,0%,8%)",
                      border: "1px solid hsl(0,0%,25%)",
                      borderRadius: "8px",
                      color: "#f1f5f9",
                    }}
                    itemStyle={{ color: "#f1f5f9" }}
                    labelStyle={{ color: "#94a3b8" }}
                  />
                  <Legend
                    formatter={(value) => (
                      <span style={{ color: "#94a3b8", fontSize: 12 }}>
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
                No booking data yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card className="border-border bg-card lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold">
              Recent Bookings
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href={route("admin.bookings.index")}>
                View all <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {recentBookings.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-xs">Customer</TableHead>
                    <TableHead className="text-xs">Service</TableHead>
                    <TableHead className="text-xs">Date</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentBookings.map((b) => (
                    <TableRow
                      key={b.id}
                      className="cursor-pointer border-border hover:bg-secondary/50"
                    >
                      <TableCell
                        className="font-medium"
                        onClick={() =>
                          (window.location.href = route(
                            "admin.bookings.show",
                            b.id,
                          ))
                        }
                      >
                        {b.full_name}
                      </TableCell>
                      <TableCell
                        className="max-w-[120px] truncate text-sm text-muted-foreground"
                        onClick={() =>
                          (window.location.href = route(
                            "admin.bookings.show",
                            b.id,
                          ))
                        }
                      >
                        {b.service}
                      </TableCell>
                      <TableCell
                        className="text-sm text-muted-foreground"
                        onClick={() =>
                          (window.location.href = route(
                            "admin.bookings.show",
                            b.id,
                          ))
                        }
                      >
                        {new Date(b.date).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`border text-xs ${STATUS_COLORS[b.status]}`}
                          variant="outline"
                        >
                          {STATUS_LABELS[b.status]}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
                No bookings yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
