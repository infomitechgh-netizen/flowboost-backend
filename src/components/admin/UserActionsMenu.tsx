import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Eye, Edit, Trash2, User, Shield, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  balance: number;
  orders: number;
  status: string;
  joined: string;
}

interface UserActionsMenuProps {
  user: User;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (userId: number) => void;
}

export const UserActionsMenu = ({
  user,
  onView,
  onEdit,
  onDelete,
}: UserActionsMenuProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <ShieldCheck className="w-4 h-4" />;
      case "reseller":
        return <Shield className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "transparent";
      case "suspended":
        return "text-red-600";
      case "pending":
        return "text-amber-600";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <>
      {/* Inline Action Buttons */}
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => onView(user)}>
          <Eye className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="outline" onClick={() => onEdit(user)}>
          <Edit className="w-4 h-4 hover:bg-primary" />
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => setShowDeleteDialog(true)}
        >
          <Trash2 className="w-4 h-4 hover:bg-primary" />
        </Button>
      </div>

      {/* Delete Modal */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="w-full max-w-sm sm:max-w-md">
          <AlertDialogHeader className="flex flex-col gap-2">
            {/* Icon + Title row */}
            <div className="flex items-center justify-start gap-2 w-full">
              <Trash2 className="w-8 h-8 text-red-600" />
              <AlertDialogTitle className="text-xl font-bold">
                Delete User
              </AlertDialogTitle>
            </div>

            {/* Description stays below */}
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{user.name}</strong>? This
              action cannot be undone and will permanently remove all user data.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* User Info */}
          <div className="my-4 p-4 bg-muted/50 rounded-lg space-y-2 text-sm">
            <div className="flex items-center gap-2">
              {getRoleIcon(user.role)}
              <span className="font-medium">{user.name}</span>
              <Badge className={getStatusColor(user.status)}>
                {user.status}
              </Badge>
            </div>
            <p className="text-primary">{user.email}</p>
            <div className="flex gap-4">
              <span>
                Balance: <strong>₵{Number(user.balance).toFixed(2)}</strong>
              </span>
              <span>
                Orders: <strong>{user.orders}</strong>
              </span>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel className="hover:bg-primary">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(user.id)}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
