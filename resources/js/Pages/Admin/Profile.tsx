import { Head, useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import { User, Lock, Save } from "lucide-react";
import AdminLayout from "@/components/Admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Props {
  user: AuthUser;
}

export default function Profile({ user }: Props) {
  const profileForm = useForm({
    name: user.name,
    email: user.email,
  });

  const passwordForm = useForm({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    profileForm.put(route("admin.profile.update"));
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    passwordForm.put(route("admin.profile.password"), {
      onSuccess: () => passwordForm.reset(),
    });
  };

  return (
    <AdminLayout title="Profile">
      <Head title="Profile" />

      <div className="mx-auto max-w-2xl space-y-6">
        {/* Profile header */}
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20">
            <span className="text-2xl font-bold text-primary">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{user.email}</span>
              <Badge variant="outline" className="border-primary/30 bg-primary/10 text-xs capitalize text-primary">
                {user.role}
              </Badge>
            </div>
          </div>
        </div>

        <Separator className="bg-border" />

        {/* General Info */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="profile-name">Full Name</Label>
                <Input
                  id="profile-name"
                  value={profileForm.data.name}
                  onChange={(e) => profileForm.setData("name", e.target.value)}
                  className={profileForm.errors.name ? "border-destructive" : ""}
                />
                {profileForm.errors.name && (
                  <p className="text-xs text-destructive">
                    {profileForm.errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="profile-email">Email Address</Label>
                <Input
                  id="profile-email"
                  type="email"
                  value={profileForm.data.email}
                  onChange={(e) =>
                    profileForm.setData("email", e.target.value)
                  }
                  className={
                    profileForm.errors.email ? "border-destructive" : ""
                  }
                />
                {profileForm.errors.email && (
                  <p className="text-xs text-destructive">
                    {profileForm.errors.email}
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={profileForm.processing}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  {profileForm.processing ? "Saving…" : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Lock className="h-4 w-4" />
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={passwordForm.data.current_password}
                  onChange={(e) =>
                    passwordForm.setData("current_password", e.target.value)
                  }
                  placeholder="••••••••"
                  className={
                    passwordForm.errors.current_password
                      ? "border-destructive"
                      : ""
                  }
                />
                {passwordForm.errors.current_password && (
                  <p className="text-xs text-destructive">
                    {passwordForm.errors.current_password}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={passwordForm.data.password}
                  onChange={(e) =>
                    passwordForm.setData("password", e.target.value)
                  }
                  placeholder="Minimum 8 characters"
                  className={
                    passwordForm.errors.password ? "border-destructive" : ""
                  }
                />
                {passwordForm.errors.password && (
                  <p className="text-xs text-destructive">
                    {passwordForm.errors.password}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={passwordForm.data.password_confirmation}
                  onChange={(e) =>
                    passwordForm.setData("password_confirmation", e.target.value)
                  }
                  placeholder="Repeat new password"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={passwordForm.processing}
                  variant="outline"
                  className="gap-2"
                >
                  <Lock className="h-4 w-4" />
                  {passwordForm.processing ? "Updating…" : "Update Password"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
