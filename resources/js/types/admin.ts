export type UserRole = "admin" | "manager" | "user";

export type BookingStatus =
  | "pending"
  | "accepted"
  | "awaiting_confirmation"
  | "confirmed"
  | "ongoing"
  | "completed"
  | "rejected";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at?: string;
}

export interface Booking {
  id: number;
  service: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone: string;
  email: string;
  pickup_location: string;
  dropoff_location: string;
  date: string;
  time: string;
  passengers: number;
  flight_number: string | null;
  message: string | null;
  status: BookingStatus;
  quoted_amount: string | null;
  processed_by: number | null;
  processed_at: string | null;
  created_at: string;
  updated_at: string;
  processor?: AdminUser | null;
}

export interface PaginatedData<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
}

export interface PageProps {
  auth: {
    user: AdminUser;
  };
  flash: {
    success?: string;
    error?: string;
  };
  [key: string]: unknown;
}

export const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "Pending",
  accepted: "Accepted",
  awaiting_confirmation: "Awaiting Confirmation",
  confirmed: "Confirmed",
  ongoing: "Ongoing",
  completed: "Completed",
  rejected: "Rejected",
};

export const STATUS_COLORS: Record<BookingStatus, string> = {
  pending: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  accepted: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  awaiting_confirmation: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  confirmed: "bg-teal-500/15 text-teal-400 border-teal-500/30",
  ongoing: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  completed: "bg-green-500/15 text-green-400 border-green-500/30",
  rejected: "bg-red-500/15 text-red-400 border-red-500/30",
};
