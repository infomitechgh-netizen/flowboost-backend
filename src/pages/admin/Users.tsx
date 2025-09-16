import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Filter, Plus } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import axios from "axios";
import { AddUserModal } from "@/components/admin/AddUserModal";
import { useToast } from "@/hooks/use-toast";
import { UserActionsMenu } from "@/components/admin/UserActionsMenu";
import { ViewUserModal } from "@/components/admin/ViewUserModal";
import { EditUserModal } from "@/components/admin/EditUserModal";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const limit = 10;
  const token = localStorage.getItem("token");
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers(page, searchTerm);
  }, [page, searchTerm]);

  const fetchUsers = async (pageNumber = 1, search = "") => {
    try {
      let url = `${BASE_URL}/api/users?page=${pageNumber}&limit=${limit}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(res.data.users);
      setTotalPages(res.data.totalPages);
      setPage(res.data.currentPage);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const handleAddUser = (newUser: any) => {
    setUsers((prev) => [newUser, ...prev]);
    toast({
      title: "User Added",
      description: `${newUser.name} has been added successfully.`,
    });
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await axios.delete(`${BASE_URL}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers((prev) => prev.filter((u) => u.id !== userId));

      toast({
        title: "User Deleted",
        description: "User has been deleted successfully.",
        variant: "destructive",
      });
    } catch (err) {
      console.error("Failed to delete user:", err);

      toast({
        title: "Delete Failed",
        description: "Could not delete the user. Try again.",
        variant: "destructive",
      });
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "default";
      case "reseller":
        return "secondary";
      case "user":
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "suspended":
        return "destructive";
      case "pending":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 2;
    const left = Math.max(2, page - delta);
    const right = Math.min(totalPages - 1, page + delta);
    pages.push(1);
    if (left > 2) pages.push("…");
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) pages.push("…");
    if (totalPages > 1) pages.push(totalPages);
    return pages;
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground">
              Manage users, roles, and permissions
            </p>
          </div>
          <Button
            className="primary-gradient hover-glow flex items-center"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Users List */}
        <div className="grid gap-6">
          {users.map((user) => (
            <Card key={user.id} className="glass-card">
              <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                {/* User Info */}
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="primary-gradient text-white">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{user.name}</h3>
                    <p className="text-muted-foreground">{user.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                      <Badge variant={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* User Stats */}
                <div className="grid grid-cols-3 gap-4 text-sm text-right">
                  <div>
                    <p className="text-muted-foreground">Balance</p>
                    <p className="font-medium">
                      ₵{Number(user.balance).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Orders</p>
                    <p className="font-medium">{user.orders || 0}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Joined</p>
                    <p className="font-medium">
                      {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Actions - Inline Icons */}
                <div className="flex gap-2 mt-4 md:mt-0">
                  <UserActionsMenu
                    user={user}
                    onView={(u) => {
                      setSelectedUser(u);
                      setIsViewModalOpen(true);
                    }}
                    onEdit={(u) => {
                      setSelectedUser(u);
                      setIsEditModalOpen(true);
                    }}
                    onDelete={handleDeleteUser}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap justify-center items-center gap-2 mt-4">
          <Button
            onClick={() => page > 1 && setPage(page - 1)}
            disabled={page === 1}
            className="primary-gradient px-4 py-2 rounded"
          >
            Prev
          </Button>
          {getPageNumbers().map((num, idx) =>
            num === "…" ? (
              <span key={idx} className="px-3 py-2 text-gray-500">
                …
              </span>
            ) : (
              <Button
                key={num}
                onClick={() => setPage(Number(num))}
                className={`px-4 py-2 rounded border ${
                  num === page
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {num}
              </Button>
            )
          )}
          <Button
            onClick={() => page < totalPages && setPage(page + 1)}
            disabled={page === totalPages}
            className="primary-gradient px-4 py-2 rounded"
          >
            Next
          </Button>
        </div>

        {/* Add User Modal */}
        <AddUserModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddUser={handleAddUser}
        />
      </div>
      {/* View User Modal */}
      {selectedUser && (
        <ViewUserModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          user={selectedUser}
        />
      )}
      {/* Edit User Modal */}
      {selectedUser && (
        <EditUserModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          user={selectedUser}
          onUpdate={(updatedUser) => {
            setUsers((prev) =>
              prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
            );
          }}
        />
      )}
    </DashboardLayout>
  );
};

export default Users;
