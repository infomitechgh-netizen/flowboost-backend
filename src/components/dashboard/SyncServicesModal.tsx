"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
const BASE_URL = process.env.REACT_APP_BACKEND_URL;
interface SyncServicesModalProps {
  markup: number;
  setMarkup: (value: number) => void;
}

const SyncServicesModal: React.FC<SyncServicesModalProps> = ({ markup, setMarkup }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Preparing sync...");

  const handleSync = async () => {
    setLoading(true);
    setProgress(0);
    setStatusMessage("Syncing services...");
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      setProgress(10);

      const res = await fetch( `${BASE_URL}/api/services/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ markupPercentage: markup }),
      });

      setProgress(50);

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Sync failed");

      setProgress(100);
      setStatusMessage(data.message || "Sync completed successfully!");

      // Wait a moment so user sees the completion
      setTimeout(() => {
        setOpen(false);
        setLoading(false);
        setProgress(0);
      }, 1500);
    } catch (err: any) {
      setStatusMessage(err.message || "Error syncing services");
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={() => setOpen(true)}>
        Sync DripFeedPanel Services
      </Button>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Sync DripFeedPanel Services</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">
          <label className="font-bold">Markup Percentage (%)</label>
          <Input
            type="number"
            value={markup}
            onChange={(e) => setMarkup(parseFloat(e.target.value))}
            min={0}
            disabled={loading}
          />

          <Progress value={progress} className="w-full" />

          <p className="text-sm text-muted-foreground">{statusMessage}</p>

          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleSync}
            disabled={loading}
          >
            {loading ? "Syncing..." : "Start Sync"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SyncServicesModal;
