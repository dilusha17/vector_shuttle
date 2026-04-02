import { useState } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import { Plus, Pencil, Trash2, Shield, UserCog } from "lucide-react";
import AdminLayout from "@/components/Admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import type { AdminUser, PageProps } from "@/types/admin";

interface Props {
  users: AdminUser[];
}

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  manager: "Manager",
};
const ROLE_COLORS: Record<string, string> = {
  admin: "bg-red-500/15 text-red-400 border-red-500/30",
  manager: "bg-blue-500/15 text-blue-400 border-blue-500/30",
};

// Create User Dialog
const CreateUserDialog = () => {
  const [open, setOpen] = useState(false);
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "manager",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("admin.users.store"), {
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
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Admin User</DialogTitle>
            <DialogDescription>
              Add a new admin or manager account.
            </DialogDescription>
          </DialogHeader>

          <div className="my-5 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="create-name">Name</Label>
              <Input
                id="create-name"
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                placeholder="Full name"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="create-email">Email</Label>
              <Input
                id="create-email"
                type="email"
                value={data.email}
                onChange={(e) => setData("email", e.target.value)}
                placeholder="email@vectorshuttle.co.nz"
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="create-role">Role</Label>
              <Select
                value={data.role}
                onValueChange={(val) => setData("role", val)}
              >
                <SelectTrigger
                  id="create-role"
                  className={errors.role ? "border-destructive" : ""}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-xs text-destructive">{errors.role}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="create-password">Password</Label>
              <Input
                id="create-password"
                type="password"
                value={data.password}
                onChange={(e) => setData("password", e.target.value)}
                placeholder="Minimum 8 characters"
                className={errors.password ? "border-destructive" : ""}
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="create-password-confirm">Confirm Password</Label>
              <Input
                id="create-password-confirm"
                type="password"
                value={data.password_confirmation}
                onChange={(e) =>
                  setData("password_confirmation", e.target.value)
                }
                placeholder="Repeat password"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={processing} className="gap-2">
              <Plus className="h-4 w-4" />
              {processing ? "Creating…" : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Edit User Dialog
const EditUserDialog = ({ user }: { user: AdminUser }) => {
  const [open, setOpen] = useState(false);
  const { data, setData, put, processing, errors } = useForm({
    name: user.name,
    email: user.email,
    role: user.role,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route("admin.users.update", user.id), {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user details for {user.name}.</DialogDescription>
          </DialogHeader>

          <div className="my-5 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor={`edit-name-${user.id}`}>Name</Label>
              <Input
                id={`edit-name-${user.id}`}
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor={`edit-email-${user.id}`}>Email</Label>
              <Input
                id={`edit-email-${user.id}`}
                type="email"
                value={data.email}
                onChange={(e) => setData("email", e.target.value)}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select
                value={data.role}
                onValueChange={(val) => setData("role", val as AdminUser["role"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-xs text-destructive">{errors.role}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={processing}>
              {processing ? "Saving…" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Delete confirmation
const DeleteUserDialog = ({ user }: { user: AdminUser }) => {
  const [open, setOpen] = useState(false);
  const { delete: destroy, processing } = useForm({});

  const handleDelete = () => {
    destroy(route("admin.users.destroy", user.id), {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-xs text-destructive hover:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-medium text-foreground">{user.name}</span>?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={processing}
          >
            {processing ? "Deleting…" : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function UsersIndex({ users }: Props) {
  const { auth } = usePage<PageProps>().props;

  return (
    <AdminLayout title="User Management">
      <Head title="User Management" />

      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Manage admin and manager accounts.
          </p>
        </div>
        <CreateUserDialog />
      </div>

      <Card className="border-border bg-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="pl-5 text-xs">Name</TableHead>
                <TableHead className="text-xs">Email</TableHead>
                <TableHead className="text-xs">Role</TableHead>
                <TableHead className="text-xs">Created</TableHead>
                <TableHead className="text-xs"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-16 text-center text-muted-foreground"
                  >
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} className="border-border">
                    <TableCell className="pl-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20">
                          <span className="text-sm font-semibold text-primary">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          {user.id === auth.user.id && (
                            <p className="text-xs text-muted-foreground">
                              You
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`border text-xs ${ROLE_COLORS[user.role] ?? ""}`}
                        variant="outline"
                      >
                        {user.role === "admin" ? (
                          <Shield className="mr-1 h-3 w-3" />
                        ) : (
                          <UserCog className="mr-1 h-3 w-3" />
                        )}
                        {ROLE_LABELS[user.role] ?? user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell className="pr-4">
                      <div className="flex items-center justify-end gap-1">
                        <EditUserDialog user={user} />
                        {user.id !== auth.user.id && (
                          <DeleteUserDialog user={user} />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
