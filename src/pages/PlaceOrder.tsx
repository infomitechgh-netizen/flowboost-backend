// src/pages/PlaceOrder.tsx
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Calculator, Search } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import axios from "axios";
import { useServices, Service } from "@/context/ServicesContext";
import { ShoppingBasketIcon } from "lucide-react";
const MAX_RENDER = 500; // limit items rendered in dropdown to avoid freezing; increase if your UI handles it
const BASE_URL = process.env.REACT_APP_BACKEND_URL;
const PlaceOrder = () => {
  const { toast } = useToast();
  const {
    services: ctxServices,
    categories: ctxCategories,
    loading: ctxLoading,
    error: ctxError,
    refresh,
  } = useServices();

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [serviceSearch, setServiceSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [formData, setFormData] = useState({
    service: "",
    link: "",
    quantity: "",
    description: "",
  });

  // Debounce search (300ms)
  useEffect(() => {
    const t = setTimeout(
      () => setDebouncedSearch(serviceSearch.trim().toLowerCase()),
      300
    );
    return () => clearTimeout(t);
  }, [serviceSearch]);

  // Derive categories (prefer backend categories; fallback to services-derived)
  const derivedCategories = useMemo(() => {
    return Array.from(
      new Set(
        ctxServices.map((s) => (s.category || "").toString()).filter(Boolean)
      )
    );
  }, [ctxServices]);

  const categories =
    Array.isArray(ctxCategories) && ctxCategories.length > 0
      ? ctxCategories
      : derivedCategories;

  // Filter services client-side
  const filteredServices = useMemo(() => {
    let list: Service[] = ctxServices;
    if (selectedCategory) {
      list = list.filter(
        (s) => (s.category || "").toString() === selectedCategory
      );
    }
    if (debouncedSearch) {
      list = list.filter((s) =>
        (s.name || "").toLowerCase().includes(debouncedSearch)
      );
    }
    return list;
  }, [ctxServices, selectedCategory, debouncedSearch]);

  // Slice to avoid massive DOM work
  const limitedServices = filteredServices.slice(0, MAX_RENDER);

  // Find selected service (from full ctx services)
  const selectedService = ctxServices.find(
    (s) => s.id === Number(formData.service)
  );
  const totalPrice =
    selectedService && formData.quantity
      ? (
          (selectedService.user_price * parseInt(formData.quantity)) /
          1000
        ).toFixed(2)
      : "0.00";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.service || !formData.link || !formData.quantity) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (selectedService) {
      const qty = parseInt(formData.quantity);
      if (
        qty < (selectedService.min_quantity ?? 0) ||
        qty > (selectedService.max_quantity ?? 1000000)
      ) {
        toast({
          title: "Invalid Quantity",
          description: `Quantity must be between ${
            selectedService.min_quantity ?? 0
          } and ${selectedService.max_quantity ?? 1000000}`,
          variant: "destructive",
        });
        return;
      }
    }

    try {
      const token = localStorage.getItem("token");
      const payload = {
        service_id: Number(formData.service),
        link: formData.link,
        quantity: parseInt(formData.quantity),
      };
      await axios.post( `${BASE_URL}/api/orders`, payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      toast({
        title: "Order Placed Successfully!",
        description: `Your order for ${selectedService?.name} has been submitted.`,
      });
      setFormData({ service: "", link: "", quantity: "", description: "" });
      setServiceSearch("");
    } catch (err: any) {
      toast({
        title: "Failed to place order",
        description: err.response?.data?.message || err.message,
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-3 sm:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <ShoppingBasketIcon className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Place New Order</h1>
            <p className="text-muted-foreground">
              Create a new social media boost order
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Order Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Category Dropdown */}
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    {ctxLoading && !categories.length ? (
                      <div className="p-2 text-sm text-muted-foreground">
                        Loading categories…
                      </div>
                    ) : (
                      <Select
                        value={selectedCategory}
                        onValueChange={(value) => {
                          setSelectedCategory(value);
                          setFormData((prev) => ({ ...prev, service: "" }));
                          setServiceSearch("");
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.length > 0 ? (
                            categories.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))
                          ) : (
                            <div className="p-2 text-sm text-muted-foreground">
                              No categories available
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  {/* Service Search */}
                  <div>
                    <Label htmlFor="serviceSearch">Search Service</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="serviceSearch"
                        type="text"
                        placeholder="Search for a service..."
                        value={serviceSearch}
                        onChange={(e) => setServiceSearch(e.target.value)}
                      />
                      <Search className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>

                  {/* Service Dropdown */}
                  <div>
                    <Label htmlFor="service">Service *</Label>
                    {ctxLoading && !ctxServices.length ? (
                      <div className="p-2 text-sm text-muted-foreground">
                        Loading services…
                      </div>
                    ) : (
                      <Select
                        value={formData.service}
                        onValueChange={(val) =>
                          setFormData((prev) => ({ ...prev, service: val }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                          {limitedServices.length > 0 ? (
                            limitedServices.map((s) => (
                              <SelectItem key={s.id} value={s.id.toString()}>
                                {s.name} - GHS {s.user_price}/1000
                              </SelectItem>
                            ))
                          ) : (
                            <div className="p-2 text-sm text-muted-foreground">
                              {filteredServices.length > 0
                                ? `Showing first ${MAX_RENDER} results. Narrow your search.`
                                : "No services found"}
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                    )}
                    {filteredServices.length > MAX_RENDER && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Showing first {MAX_RENDER} results — narrow your search
                        for more precise results.
                      </p>
                    )}
                  </div>

                  {/* Link & Quantity */}
                  <div>
                    <Label htmlFor="link">Link *</Label>
                    <Input
                      id="link"
                      type="url"
                      placeholder="https://instagram.com/username"
                      value={formData.link}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          link: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="quantity">Quantity *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          quantity: e.target.value,
                        }))
                      }
                      min={selectedService?.min_quantity ?? 0}
                      max={selectedService?.max_quantity ?? 1000000}
                    />
                    {selectedService && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Min: {selectedService.min_quantity} - Max:{" "}
                        {selectedService.max_quantity}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="description">Additional Notes</Label>
                    <Textarea
                      id="description"
                      placeholder="Any special instructions..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      rows={3}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full primary-gradient hover-glow"
                  >
                    Place Order - GHS {totalPrice}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Service:</span>
                    <span>{selectedService?.name || "Not selected"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Quantity:</span>
                    <span>{formData.quantity || "0"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Rate:</span>
                    <span>
                      GHS {selectedService?.user_price || "0.00"}/1000
                    </span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span className="text-primary">GHS {totalPrice}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Important Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>• Some orders typically start within 1-24 hours</p>
                <p>• Make sure your profile/post is public</p>
                <p>• Don't change your username until completion</p>
                <p>• Refill guarantee for 30 days</p>
                <p>• No password required for any service</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PlaceOrder;
