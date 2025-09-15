// src/components/admin/ViewUserModal.tsx
import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

interface ViewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

export const ViewUserModal = ({ isOpen, onClose, user }: ViewUserModalProps) => {
  if (!user) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="w-full max-w-sm sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>View User</AlertDialogTitle>
          <AlertDialogDescription>
            Details for <strong>{user.name}</strong>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="my-4 p-4 bg-muted/50 rounded-lg space-y-2 text-sm">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Status:</strong> {user.status}</p>
          <p><strong>Balance:</strong> ₵{Number(user.balance).toFixed(2)}</p>
          <p><strong>Orders:</strong> {user.orders}</p>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
