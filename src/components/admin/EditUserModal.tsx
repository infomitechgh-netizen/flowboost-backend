// src/components/admin/EditUserModal.tsx
import React, { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onUpdate: (updatedUser: any) => void;
}

export const EditUserModal = ({
  isOpen,
  onClose,
  user,
  onUpdate,
}: EditUserModalProps) => {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [role, setRole] = useState(user?.role || "user");
  const [status, setStatus] = useState(user?.status || "active");
  const token = localStorage.getItem("token");
  const { toast } = useToast();
  const BASE_URL = process.env.REACT_APP_BACKEND_URL;
  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
    setRole(user?.role || "user");
    setStatus(user?.status || "active");
  }, [user]);

  const handleSubmit = async () => {
    try {
      const res = await axios.put(
        `${BASE_URL}/api/users/${user.id}`,
        { name, email, role, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onUpdate(res.data);
      toast({
        title: "User Updated",
        description: `${res.data.name} has been updated successfully.`,
      });
      onClose();
    } catch (err) {
      console.error("Failed to update user:", err);
      toast({
        title: "Update Failed",
        description: "Could not update user. Try again.",
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="w-full max-w-sm sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Edit User</AlertDialogTitle>
          <AlertDialogDescription>
            Update user details below
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col gap-3 my-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />

          {/* Role Dropdown */}
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="moderator">Moderator</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Dropdown */}
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSubmit}
            className="bg-primary text-white hover:bg-primary/90"
          >
            Save
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
