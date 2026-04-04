import { Head, Link, useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import {
  ArrowLeft,
  Mail,
  Phone,
  User,
  Tag,
  MessageSquare,
  Send,
  CheckCircle,
  Clock,
} from "lucide-react";
import AdminLayout from "@/components/Admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import type { ContactInquiry } from "@/types/admin";

interface Props {
  inquiry: ContactInquiry;
}

export default function MessagesShow({ inquiry }: Props) {
  const { data, setData, post, processing, errors, reset } = useForm({
    reply: inquiry.admin_reply ?? "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("admin.messages.reply", inquiry.id), {
      onSuccess: () => reset(),
      preserveScroll: true,
    });
  };

  const receivedAt = new Date(inquiry.created_at).toLocaleString("en-NZ", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Pacific/Auckland",
  });

  return (
    <AdminLayout title="Message">
      <Head title={`Message from ${inquiry.name}`} />

      {/* Top bar */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href={route("admin.messages.index")}>
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            All Messages
          </Link>
        </Button>
        <Separator orientation="vertical" className="h-5" />
        {inquiry.admin_reply ? (
          <Badge className="border border-green-500/30 bg-green-500/15 text-green-400 text-xs" variant="outline">
            Replied
          </Badge>
        ) : inquiry.is_read ? (
          <Badge className="border border-border bg-secondary text-muted-foreground text-xs" variant="outline">
            Read
          </Badge>
        ) : (
          <Badge className="border border-primary/30 bg-primary/10 text-primary text-xs" variant="outline">
            New
          </Badge>
        )}
        <span className="ml-auto text-xs text-muted-foreground">{receivedAt}</span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left — message + reply */}
        <div className="space-y-5 lg:col-span-2">
          {/* Message card */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                {inquiry.message}
              </p>
            </CardContent>
          </Card>

          {/* Previous reply (if any) */}
          {inquiry.admin_reply && (
            <Card className="border-green-500/20 bg-green-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  Your Previous Reply
                  {inquiry.admin_reply_at && (
                    <span className="ml-auto text-xs font-normal text-muted-foreground">
                      {new Date(inquiry.admin_reply_at).toLocaleString("en-NZ", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                        timeZone: "Pacific/Auckland",
                      })}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                  {inquiry.admin_reply}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Reply form */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Send className="h-4 w-4 text-muted-foreground" />
                {inquiry.admin_reply ? "Update Reply" : "Send Reply"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="reply">
                    Reply to {inquiry.name}
                  </Label>
                  <Textarea
                    id="reply"
                    rows={6}
                    placeholder={`Write your reply to ${inquiry.name}…`}
                    value={data.reply}
                    onChange={(e) => setData("reply", e.target.value)}
                    className={errors.reply ? "border-destructive" : ""}
                  />
                  {errors.reply && (
                    <p className="text-xs text-destructive">{errors.reply}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    This reply will be emailed to{" "}
                    <span className="font-medium">{inquiry.email}</span>.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button type="submit" disabled={processing} className="gap-2">
                    <Send className="h-4 w-4" />
                    {processing ? "Sending…" : inquiry.admin_reply ? "Update & Resend" : "Send Reply"}
                  </Button>
                  <Button type="button" variant="ghost" asChild>
                    <Link href={route("admin.messages.index")}>
                      Cancel
                    </Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right — contact details */}
        <div>
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Contact Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="text-sm font-medium">{inquiry.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <a
                    href={`mailto:${inquiry.email}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {inquiry.email}
                  </a>
                </div>
              </div>
              {inquiry.phone && (
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm">{inquiry.phone}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Service Enquiry</p>
                  <p className="text-sm">{inquiry.service_type}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Received</p>
                  <p className="text-sm">{receivedAt}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
