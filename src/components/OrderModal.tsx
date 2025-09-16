// src/components/OrderModal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import axios from "axios";
const BASE_URL = process.env.REACT_APP_BACKEND_URL;

export default function OrderModal({ open, onClose, serviceId }: { open: boolean; onClose: () => void; serviceId: number }) {
  const [quantity, setQuantity] = useState("");

  const handleOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${BASE_URL}/api//orders",
        { serviceId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Order placed successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to place order");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Place Order</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Quantity</Label>
            <Input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          </div>
          <Button onClick={handleOrder}>Confirm Order</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
