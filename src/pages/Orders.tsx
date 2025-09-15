import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Eye, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import axios from "axios";
import { ShoppingCart, Calculator, Search } from "lucide-react";

interface Order {
  id: number;
  service?: string | null;
  link?: string | null;
  quantity?: number | null;
  start_count?: number | null;
  remains?: number | null;
  status?: string | null;
  price?: string | null;
  created_at?: string | null;
  refill_count?: number | null;
  user_name?: string | null;
}

const TABS = [
  "all",
  "pending",
  "processing",
  "completed",
  "canceled",
  "refunded",
];

const Orders = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [refillModalOpen, setRefillModalOpen] = useState(false);
  const [refillResultModalOpen, setRefillResultModalOpen] = useState(false);
  const [refillResultMessage, setRefillResultMessage] = useState("");
  const [expandedOrders, setExpandedOrders] = useState<number[]>([]);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const isAdmin = role === "admin";

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setOrders(data);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load orders. Ensure backend and token are valid.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (
    status?: string | null
  ): "default" | "secondary" | "outline" | "destructive" => {
    switch (status) {
      case "completed":
        return "default";
      case "processing":
        return "secondary";
      case "pending":
        return "outline";
      case "canceled":
        return "destructive";
      case "refunded":
        return "destructive"; // mapped
      default:
        return "secondary";
    }
  };

  const handleView = (order: Order) => {
    setSelectedOrder(order);
    setViewModalOpen(true);
  };

  const handleRefillClick = (order: Order) => {
    setSelectedOrder(order);
    setRefillModalOpen(true);
  };

  const handleReorderClick = async (order: Order) => {
    try {
      await axios.post(
        `http://localhost:5000/api/orders/${order.id}/reorder`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
      toast({
        title: "Order Reordered",
        description: "Order reordered successfully!",
        variant: "success",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description:
          "Failed to reorder: " + (err.response?.data?.message || err.message),
        variant: "destructive",
      });
    }
  };

  const handleConfirmRefill = async () => {
    if (!selectedOrder) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/orders/${selectedOrder.id}/refill`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Refill failed");
      setRefillResultMessage(
        `${data.message} (Refill count: ${data.refillCount})`
      );
      setRefillResultModalOpen(true);
      setRefillModalOpen(false);
      setTimeout(() => setRefillResultModalOpen(false), 3000);
      fetchOrders();
      toast({
        title: "Refill Success",
        description: `${data.message} (Refill count: ${data.refillCount})`,
        variant: "success",
      });
    } catch (err: any) {
      setRefillResultMessage("Refill failed: " + err.message);
      setRefillResultModalOpen(true);
      setRefillModalOpen(false);
      setTimeout(() => setRefillResultModalOpen(false), 3000);
      toast({
        title: "Refill Failed",
        description: "Refill failed: " + err.message,
        variant: "destructive",
      });
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedOrders((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const truncateText = (text?: string | null, length: number = 25) => {
    if (!text) return ""; // ✅ null-safe
    return text.length > length ? text.slice(0, length) + "…" : text;
  };

  // 🔹 CHANGE: pagination for table view
  const renderOrdersTable = (filter?: string) => {
    const filtered =
      filter && filter !== "all"
        ? orders.filter((o) => o.status === filter)
        : orders;
    const paginatedOrders = filtered.slice(
      (page - 1) * pageSize,
      page * pageSize
    );

    if (!filtered.length)
      return (
        <p className="text-center py-6 text-muted-foreground">
          No orders found.
        </p>
      );

    return (
      <div className="overflow-x-auto hidden md:block">
        <table className="min-w-full md:min-w-[700px]">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-4 py-2 text-left">Order ID</th>
              <th className="px-4 py-2 text-left">Service</th>
              {isAdmin && <th className="px-4 py-2 text-left">User</th>}
              <th className="px-4 py-2 text-left">Quantity</th>
              <th className="px-4 py-2 text-left">Start</th>
              <th className="px-4 py-2 text-left">Remains</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Created</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((order) => (
              <tr
                key={order.id}
                className="border-t border-border hover:bg-muted/20"
              >
                <td className="px-4 py-2">
                  ORD-{order.id.toString().padStart(3, "0")}
                </td>
                <td className="px-4 py-2">{truncateText(order.service, 30)}</td>
                {isAdmin && (
                  <td className="px-4 py-2">{order.user_name || "-"}</td>
                )}
                <td className="px-4 py-2">{order.quantity ?? "-"}</td>
                <td className="px-4 py-2">{order.start_count ?? "-"}</td>
                <td className="px-4 py-2">{order.remains ?? "-"}</td>
                <td className="px-4 py-2">{order.price ?? "-"}</td>
                <td className="px-4 py-2">
                  <Badge variant={getStatusColor(order.status)}>
                    {order.status || "-"}
                  </Badge>
                </td>
                <td className="px-4 py-2">
                  {order.created_at
                    ? new Date(order.created_at).toLocaleString()
                    : "-"}
                </td>
                <td className="px-4 py-2 flex flex-wrap gap-2 items-center">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleView(order)}
                  >
                    <Eye className="w-4 h-4 mr-1" /> View
                  </Button>
                  {order.status === "processing" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRefillClick(order)}
                    >
                      <RotateCcw className="w-4 h-4 mr-1" /> Refill
                    </Button>
                  )}
                  {order.status === "completed" && (
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleReorderClick(order)}
                    >
                      <Plus className="w-4 h-4 mr-1" /> Reorder
                    </Button>
                  )}
                  {isAdmin && (
                    <Select
                      value={order.status || ""}
                      onValueChange={async (newStatus) => {
                        try {
                          await axios.patch(
                            `http://localhost:5000/api/orders/${order.id}/status`,
                            { status: newStatus },
                            { headers: { Authorization: `Bearer ${token}` } }
                          );
                          fetchOrders();
                          toast({
                            title: "Order Status Updated",
                            description: `Order status updated to ${newStatus}`,
                            variant: "success",
                          });
                        } catch (err: any) {
                          toast({
                            title: "Error",
                            description:
                              "Failed to update status: " +
                              (err.response?.data?.message || err.message),
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      <SelectTrigger className="w-[120px] text-xs">
                        <SelectValue placeholder="Change Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="canceled">Canceled</SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length > pageSize && (
          <div className="flex justify-center items-center gap-3 mt-4">
            <Button
              size="sm"
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {Math.ceil(filtered.length / pageSize)}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={page === Math.ceil(filtered.length / pageSize)}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    );
  };

  // 🔹 CHANGE: pagination for mobile cards
  const renderOrdersCards = (filter?: string) => {
    const filtered =
      filter && filter !== "all"
        ? orders.filter((o) => o.status === filter)
        : orders;
    const paginatedOrders = filtered.slice(
      (page - 1) * pageSize,
      page * pageSize
    );

    if (!filtered.length) return null;

    return (
      <div className="md:hidden space-y-3 container mx-auto px-3">
        {paginatedOrders.map((order) => {
          const isExpanded = expandedOrders.includes(order.id);
          return (
            <div
              key={order.id}
              className="border rounded-lg p-3 shadow-sm bg-background"
            >
              <div className="flex justify-between items-center">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">
                    ORD-{order.id.toString().padStart(3, "0")}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {truncateText(order.service, 25)}
                  </p>
                  {isAdmin && (
                    <p className="text-xs text-muted-foreground truncate">
                      User: {order.user_name || "-"}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusColor(order.status)}>
                    {order.status || "-"}
                  </Badge>
                  <button onClick={() => toggleExpand(order.id)}>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <p>Quantity: {order.quantity ?? "-"}</p>
                  <p>Start Count: {order.start_count ?? "-"}</p>
                  <p>Remains: {order.remains ?? "-"}</p>
                  <p>Price: {order.price ?? "-"}</p>
                  <p>Refill Count: {order.refill_count ?? 0}</p>
                  <p>
                    Created:{" "}
                    {order.created_at
                      ? new Date(order.created_at).toLocaleString()
                      : "-"}
                  </p>
                  <p>
                    Link:{" "}
                    {order.link ? (
                      <a
                        href={order.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline break-all"
                      >
                        {order.link}
                      </a>
                    ) : (
                      "-"
                    )}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-2 items-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleView(order)}
                    >
                      <Eye className="w-4 h-4 mr-1" /> View
                    </Button>
                    {order.status === "processing" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRefillClick(order)}
                      >
                        <RotateCcw className="w-4 h-4 mr-1" /> Refill
                      </Button>
                    )}
                    {order.status === "completed" && (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleReorderClick(order)}
                      >
                        <Plus className="w-4 h-4 mr-1" /> Reorder
                      </Button>
                    )}

                    {isAdmin && (
                      <Select
                        value={order.status || ""}
                        onValueChange={async (newStatus) => {
                          try {
                            await axios.patch(
                              `http://localhost:5000/api/orders/${order.id}/status`,
                              { status: newStatus },
                              { headers: { Authorization: `Bearer ${token}` } }
                            );
                            fetchOrders();
                            toast({
                              title: "Order Status Updated",
                              description: `Order status updated to ${newStatus}`,
                              variant: "success",
                            });
                          } catch (err: any) {
                            toast({
                              title: "Error",
                              description:
                                "Failed to update status: " +
                                (err.response?.data?.message || err.message),
                              variant: "destructive",
                            });
                          }
                        }}
                      >
                        <SelectTrigger className="w-[120px] text-xs">
                          <SelectValue placeholder="Change Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="canceled">Canceled</SelectItem>
                          <SelectItem value="refunded">Refunded</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length > pageSize && (
          <div className="flex justify-center items-center gap-3 mt-4">
            <Button
              size="sm"
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {Math.ceil(filtered.length / pageSize)}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={page === Math.ceil(filtered.length / pageSize)}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderOrders = (filter?: string) => {
    if (loading) return <p className="text-center py-6">Loading orders...</p>;
    if (error) return <p className="text-center py-6 text-red-500">{error}</p>;
    return (
      <>
        {renderOrdersTable(filter)}
        {renderOrdersCards(filter)}
      </>
    );
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-3 sm:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start  sm:items-center gap-3">
          <ShoppingCart className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Orders</h1>
            <p className="text-muted-foreground">
              Track and manage your orders
            </p>
          </div>

          <div className="ml-auto">
            <Button
              className="primary-gradient hover-glow flex items-center"
              onClick={() => navigate("/placeorder")}
            >
              {" "}
              <Plus className="w-4 h-4 mr-2" /> New Order
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <div className="overflow-x-auto sm:overflow-x-visible mb-3">
            <TabsList className="grid grid-cols-3 gap-2 px-2 w-full sm:flex sm:flex-wrap sm:justify-start sm:gap-2">
              {TABS.map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="text-center py-2 rounded-lg font-medium bg-muted hover:bg-muted/70 transition-all duration-150"
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {TABS.map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-4">
              {renderOrders(tab)}
            </TabsContent>
          ))}
        </Tabs>

        {/* View Modal */}
        <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
              <DialogClose />
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Order ID:</strong> ORD-
                  {selectedOrder.id.toString().padStart(3, "0")}
                </p>
                <p>
                  <strong>Service:</strong> {selectedOrder.service || "-"}
                </p>
                <p>
                  <strong>Quantity:</strong> {selectedOrder.quantity ?? "-"}
                </p>
                <p>
                  <strong>Start Count:</strong>{" "}
                  {selectedOrder.start_count ?? "-"}
                </p>
                <p>
                  <strong>Remains:</strong> {selectedOrder.remains ?? "-"}
                </p>
                <p>
                  <strong>Price:</strong> {selectedOrder.price ?? "-"}
                </p>
                <p>
                  <strong>Status:</strong> {selectedOrder.status || "-"}
                </p>
                <p>
                  <strong>Refill Count:</strong>{" "}
                  {selectedOrder.refill_count ?? 0}
                </p>
                <p>
                  <strong>Created:</strong>{" "}
                  {selectedOrder.created_at
                    ? new Date(selectedOrder.created_at).toLocaleString()
                    : "-"}
                </p>
                <p>
                  <strong>Link:</strong>{" "}
                  {selectedOrder.link ? (
                    <a
                      href={selectedOrder.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      {selectedOrder.link}
                    </a>
                  ) : (
                    "-"
                  )}
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Refill Modal */}
        <Dialog open={refillModalOpen} onOpenChange={setRefillModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Refill</DialogTitle>
              <DialogClose />
            </DialogHeader>
            <p className="py-4">
              Are you sure you want to refill order{" "}
              <strong>
                ORD-{selectedOrder?.id.toString().padStart(3, "0")}
              </strong>
              ?
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setRefillModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleConfirmRefill}>Confirm</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Orders;
