import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FaMoneyCheck } from "react-icons/fa";
import { FaServicestack } from "react-icons/fa";
import { BoxIcon } from "lucide-react";
import { Package } from "lucide-react";
import { Search, RefreshCcw, ServerIcon } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  FaYoutube,
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaTiktok,
  FaSpotify,
} from "react-icons/fa";
import {
  SiTelegram,
  SiThreads,
  SiDiscord,
  SiTwitch,
  SiLinkedin,
  SiSoundcloud,
  SiReddit,
} from "react-icons/si";
const BASE_URL = process.env.REACT_APP_BACKEND_URL;
interface Service {
  id: number;
  name: string;
  category: string;
  user_price: number;
  api_price: number;
  min_quantity: number;
  max_quantity: number;
  delivery_time: string;
  status: string;
}

const CATEGORIES = [
  { name: "YouTube", icon: <FaYoutube size={20} color="#FF0000" /> },
  { name: "Instagram", icon: <FaInstagram size={20} color="#C13584" /> },
  { name: "Facebook", icon: <FaFacebook size={20} color="#1877F2" /> },
  { name: "Twitter", icon: <FaTwitter size={20} color="#1DA1F2" /> },
  { name: "TikTok", icon: <FaTiktok size={20} color="#000000" /> },
  { name: "Spotify", icon: <FaSpotify size={20} color="#1DB954" /> },
  { name: "Telegram", icon: <SiTelegram size={20} color="#0088CC" /> },
  { name: "Threads", icon: <SiThreads size={20} color="#000000" /> },
  { name: "Discord", icon: <SiDiscord size={20} color="#5865F2" /> },
  { name: "Twitch", icon: <SiTwitch size={20} color="#9146FF" /> },
  { name: "LinkedIn", icon: <SiLinkedin size={20} color="#0A66C2" /> },
  { name: "SoundCloud", icon: <SiSoundcloud size={20} color="#FF8800" /> },
  { name: "Reddit", icon: <SiReddit size={20} color="#FF4500" /> },
];

const Services = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedServiceForOrder, setSelectedServiceForOrder] =
    useState<Service | null>(null);
  const [orderLink, setOrderLink] = useState("");
  const [orderQuantity, setOrderQuantity] = useState(0);
  const [orderCharge, setOrderCharge] = useState(0);

  useEffect(() => {
    const fetchUserRole = async () => {
      const savedRole = localStorage.getItem("role");
      if (savedRole) {
        setUserRole(savedRole);
        return;
      }
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await axios.get(`${BASE_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserRole(res.data.role);
        localStorage.setItem("role", res.data.role);
      } catch {
        setUserRole("user");
      }
    };
    fetchUserRole();
  }, []);

  const fetchServices = async (
    pageNumber = 1,
    category: string | null = null,
    search: string = ""
  ) => {
    try {
      const token = localStorage.getItem("token");
      let url = `${BASE_URL}/api/services?page=${pageNumber}&limit=${limit}`;
      if (category) url += `&category=${category}`;
      if (search) url += `&search=${search}`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(res.data.services);
      setPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchServices(page, selectedCategory, searchTerm);
  }, []);
  useEffect(() => {
    setPage(1);
    fetchServices(1, selectedCategory, searchTerm);
  }, [selectedCategory, searchTerm]);

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

  if (userRole === null) return <DashboardLayout>Loading...</DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="p-3 sm:p-6 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Package className="w-8 h-8 text-primary" />

            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Services</h1>
              <p className="text-muted-foreground text-sm md:text-base">
                Browse and manage available services
              </p>
            </div>
          </div>
        </div>

        {/* Category Buttons */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`flex items-center p-2 text-sm md:text-base transition ${
                selectedCategory === cat.name
                  ? "bg-primary text-white"
                  : "bg-white text-gray-800"
              }`}
            >
              {cat.icon} <span className="ml-1">{cat.name}</span>
            </Button>
          ))}
          <Button
            variant="outline"
            className="flex items-center text-sm md:text-base"
            onClick={() => setSelectedCategory(null)}
          >
            <RefreshCcw className="w-4 h-4 mr-1" /> Reset
          </Button>
        </div>

        {/* Search */}
        <div className="relative w-full mt-2">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>

        {/* Services Table - Responsive */}
        <div className="glass-card rounded-lg overflow-x-auto">
          <Table className="min-w-full md:min-w-[700px]">
            <TableHeader className="hidden md:table-header-group">
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Min/Max</TableHead>
                <TableHead>Delivery</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id} className="border-b md:border-none">
                  {/* Desktop cells hidden on mobile */}
                  <TableCell className="hidden md:table-cell font-medium">
                    {service.name}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {service.category}
                  </TableCell>
                  <TableCell className="hidden md:table-cell font-medium">
                    {new Intl.NumberFormat("en-GH", {
                      style: "currency",
                      currency: "GHS",
                    }).format(service.user_price)}
                    /1000
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {service.min_quantity}-{service.max_quantity}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {service.delivery_time}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge
                      variant={
                        service.status === "active" ? "default" : "secondary"
                      }
                    >
                      {service.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-right">
                    <Button
                      size="sm"
                      className="primary-gradient hover-glow"
                      disabled={service.status !== "active"}
                      onClick={() => {
                        setSelectedServiceForOrder(service);
                        setOrderQuantity(service.min_quantity);
                        setOrderCharge(
                          (service.user_price * service.min_quantity) / 1000
                        );
                        setOrderLink("");
                        setOrderModalOpen(true);
                      }}
                    >
                      Order Now
                    </Button>
                  </TableCell>

                  {/* Mobile stacked layout */}
                  <TableCell className="md:hidden py-2">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{service.name}</span>
                        <Badge
                          variant={
                            service.status === "active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {service.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm gap-2">
                        <span>Category:</span> <span>{service.category}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Price:</span>{" "}
                        <span>
                          {new Intl.NumberFormat("en-GH", {
                            style: "currency",
                            currency: "GHS",
                          }).format(service.user_price)}
                          /1000
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Min/Max:</span>{" "}
                        <span>
                          {service.min_quantity}-{service.max_quantity}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Delivery:</span>{" "}
                        <span>{service.delivery_time}</span>
                      </div>
                      <Button
                        size="sm"
                        className="primary-gradient mt-2 mb-2"
                        disabled={service.status !== "active"}
                        onClick={() => {
                          setSelectedServiceForOrder(service);
                          setOrderQuantity(service.min_quantity);
                          setOrderCharge(
                            (service.user_price * service.min_quantity) / 1000
                          );
                          setOrderLink("");
                          setOrderModalOpen(true);
                        }}
                      >
                        Order Now
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination - Updated like Orders page */}
        <div className="flex justify-center items-center gap-3 mt-4">
          <Button
            size="sm"
            variant="outline"
            disabled={page === 1}
            onClick={() => {
              if (page > 1) {
                setPage((prev) => prev - 1);
                fetchServices(page - 1, selectedCategory, searchTerm);
              }
            }}
          >
            Previous
          </Button>

          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>

          <Button
            size="sm"
            variant="outline"
            disabled={page === totalPages}
            onClick={() => {
              if (page < totalPages) {
                setPage((prev) => prev + 1);
                fetchServices(page + 1, selectedCategory, searchTerm);
              }
            }}
          >
            Next
          </Button>
        </div>

        {/* Order Modal */}
        <Dialog open={orderModalOpen} onOpenChange={setOrderModalOpen}>
          <DialogContent className="w-full max-w-sm sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Place Order</DialogTitle>
            </DialogHeader>
            {selectedServiceForOrder && (
              <div className="space-y-4">
                <p>
                  <strong>Service:</strong> {selectedServiceForOrder.name}
                </p>
                <p>
                  <strong>Price (per 1000):</strong>{" "}
                  {selectedServiceForOrder.user_price}
                </p>
                <div>
                  <Label htmlFor="link">Link</Label>
                  <Input
                    id="link"
                    value={orderLink}
                    onChange={(e) => setOrderLink(e.target.value)}
                    placeholder="Enter link"
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min={selectedServiceForOrder.min_quantity}
                    max={selectedServiceForOrder.max_quantity}
                    value={orderQuantity}
                    onChange={(e) => {
                      const qty = Number(e.target.value);
                      setOrderQuantity(qty);
                      setOrderCharge(
                        (selectedServiceForOrder.user_price * qty) / 1000
                      );
                    }}
                  />
                </div>
                <p className="text-sm font-medium">
                  Charge: {orderCharge.toFixed(2)}
                </p>
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setOrderModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="primary-gradient"
                    onClick={async () => {
                      try {
                        const token = localStorage.getItem("token");
                        const payload = {
                          service_id: selectedServiceForOrder.id,
                          link: orderLink,
                          quantity: orderQuantity,
                          price:
                            (selectedServiceForOrder.api_price *
                              orderQuantity) /
                            1000,
                        };
                        await axios.post(`${BASE_URL}/api/orders`, payload, {
                          headers: { Authorization: `Bearer ${token}` },
                        });
                        alert("Order placed successfully!");
                        setOrderModalOpen(false);
                      } catch (err: any) {
                        alert(
                          "Failed to place order: " +
                            (err.response?.data?.message || err.message)
                        );
                      }
                    }}
                  >
                    Place Order
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Services;
