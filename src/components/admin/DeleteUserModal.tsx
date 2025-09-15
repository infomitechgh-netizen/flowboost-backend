// components/admin/DeleteUserModal.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleteUser: (userId: number) => void;
  user: any; // user object to display
}

export const DeleteUserModal = ({
  isOpen,
  onClose,
  onDeleteUser,
  user,
}: DeleteUserModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDeleteUser(user.id);
      onClose();
    } catch (error) {
      console.error("Failed to delete user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader className="flex flex-col items-center gap-2 text-center">
          <Trash2 className="w-12 h-12 text-red-600" />
          <DialogTitle className="text-xl font-bold">Delete User</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <span className="font-semibold">{user.name}</span>?<br />
            This action cannot be undone and will permanently remove all user data.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-2 p-4 bg-gray-50 rounded-md">
          <p><span className="font-semibold">Name:</span> {user.name}</p>
          <p><span className="font-semibold">Status:</span> {user.status}</p>
          <p><span className="font-semibold">Email:</span> {user.email}</p>
          <p><span className="font-semibold">Balance:</span> ₵{Number(user.balance).toFixed(2)}</p>
          <p><span className="font-semibold">Orders:</span> {user.orders || 0}</p>
        </div>

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
