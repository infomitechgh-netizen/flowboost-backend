import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
const BASE_URL = process.env.REACT_APP_BACKEND_URL;
const SyncServicesUI = ({
  markup,
  setMarkup,
}: {
  markup: number;
  setMarkup: (value: number) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSyncServices = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      // Start syncing
      const res = await fetch(`${BASE_URL}/api/services/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ markupPercentage: markup }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Sync failed");

      // Show toast on completion
      let description = data.message;
      if (data.errors && data.errors.length) {
        description += "\n\nSome services failed:\n" + data.errors.join("\n");
      }

      toast({
        title: "Sync completed",
        description,
        variant: "success",
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Sync failed",
        description: err.message || "Error syncing services",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col space-y-2">
        <label htmlFor="markup" className="font-bold">
          Markup Percentage (%)
        </label>
        <Input
          id="markup"
          type="number"
          value={markup}
          onChange={(e) => setMarkup(parseFloat(e.target.value))}
          min={0}
        />
      </div>

      <Button
        className="w-full bg-green-600 hover:bg-green-700 text-white"
        onClick={handleSyncServices}
        disabled={loading}
      >
        {loading ? "Syncing..." : "Sync DripFeedPanel Services"}
      </Button>

      {/* Modal + Progress during syncing */}
      <Dialog open={loading}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Syncing Services</DialogTitle>
          </DialogHeader>
          <Progress className="h-2" />
          <p className="mt-2 text-sm text-muted-foreground">
            Please wait while DripFeedPanel services are being synced...
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SyncServicesUI;
