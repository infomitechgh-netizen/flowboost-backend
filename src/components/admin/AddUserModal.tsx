import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
const BASE_URL = process.env.REACT_APP_BACKEND_URL;
interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (user: any) => void;
}

interface UserFormData {
  name: string;
  email: string;
  role: "user" | "reseller" | "admin";
  balance: number;
}

export const AddUserModal = ({
  isOpen,
  onClose,
  onAddUser,
}: AddUserModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");
  const { toast } = useToast();

  const form = useForm<UserFormData>({
    defaultValues: {
      name: "",
      email: "",
      role: "user",
      balance: 0,
    },
  });

  const onSubmit = async (data: UserFormData) => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/api/users`,
        { ...data },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onAddUser(res.data); // add new user to parent
      toast({
        title: "User Added",
        description: `${res.data.name} has been added successfully.`,
      });
      form.reset();
      onClose();
    } catch (error: any) {
      console.error("Failed to add user:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add user.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-sm sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New User
          </DialogTitle>
          <DialogDescription>
            Create a new user account. Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              rules={{ required: "Name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter email address"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="reseller">Reseller</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="balance"
              rules={{
                required: "Initial balance is required",
                min: { value: 0, message: "Balance cannot be negative" },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Initial Balance (₵)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="0.00"
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="primary-gradient hover-glow"
              >
                {isLoading ? "Adding..." : "Add User"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
