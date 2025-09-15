// -----------------------------------------------------------------------------
// File: src/pages/Tickets.tsx
// Purpose: small updates to the existing admin Tickets page to add a "View"
// button that opens the ticket messages modal. The layout is unchanged — only
// the button and modal wiring are added.
// -----------------------------------------------------------------------------

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Clock, CheckCircle } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
//import { TicketMessagesModal } from "@/components/TicketMessagesModal";
import { TicketMessagesModal } from "@/components/support/src/components/support/TicketMessagesModal";
// Utility functions (same as your original file)
const getStatusColor = (status: string) => {
  switch (status) {
    case "open":
      return "destructive";
    case "pending":
      return "secondary";
    case "closed":
      return "default";
    default:
      return "outline";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "destructive";
    case "medium":
      return "secondary";
    case "low":
      return "outline";
    default:
      return "outline";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "open":
      return MessageCircle;
    case "pending":
      return Clock;
    case "closed":
      return CheckCircle;
    default:
      return MessageCircle;
  }
};

export default function Tickets() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch all tickets (admin)
  const fetchTickets = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tickets", {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      setTickets(res.data);
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
      setTickets([]);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // open modal and fetch detailed ticket (with messages)
  const openTicketModal = async (ticket: any) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/tickets/${ticket.id}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );
      setSelectedTicket(res.data);
    } catch (err) {
      console.error(
        "Failed to fetch single ticket, falling back to summary object",
        err
      );
      // fallback to use the smaller ticket object we already have — modal will fall back to ticket.messages or mock
      setSelectedTicket(ticket);
    } finally {
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTicket(null);
  };

  // Filter and search helpers (unchanged)
  const filterTicketsByStatus = (status: string) => {
    return status === "all"
      ? tickets
      : tickets.filter((t) => t.status === status);
  };

  const filteredTickets = (status: string) =>
    filterTicketsByStatus(status).filter(
      (ticket) =>
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.id.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Support Tickets (Admin)</h1>
          <p className="text-muted-foreground">
            Manage and monitor all user support requests
          </p>
        </div>

        {/* Search bar */}
        <Input
          placeholder="Search tickets by ID, subject, or user email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />

        {/* Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            {["all", "open", "pending", "closed"].map((status) => (
              <TabsTrigger key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          {["all", "open", "pending", "closed"].map((status) => (
            <TabsContent key={status} value={status} className="space-y-4">
              {filteredTickets(status).map((ticket) => {
                const StatusIcon = getStatusIcon(ticket.status);
                return (
                  <Card
                    key={ticket.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardHeader className="pb-3 flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">
                          {ticket.subject}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Ticket #{ticket.id} - {ticket.user_email}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusColor(ticket.status)}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {ticket.status}
                        </Badge>

                        <Badge variant={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>

                        {/* VIEW button added here — opens the modal for this ticket */}
                        <Button
                          onClick={() => openTicketModal(ticket)}
                          className="ml-2"
                        >
                          View
                        </Button>
                      </div>
                    </CardHeader>

                    {/* First message just below the badges */}
                    <CardContent>
                      <div className="p-3 rounded-md bg-muted/40">
                        <p className="text-sm text-foreground">
                          {ticket.first_message || "No description provided"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Submitted by: {ticket.user_email}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground mt-3">
                        <span>Created: {ticket.created_at}</span>
                        <span>Last reply: {ticket.updated_at}</span>
                        <span>
                          <MessageCircle className="inline w-4 h-4 mr-1" />
                          {ticket.messages_count || 0} messages
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>
          ))}
        </Tabs>

        {/* Ticket messages modal — wired to the selectedTicket state. When admin posts a message we refresh the tickets list */}
        <TicketMessagesModal
          ticket={selectedTicket}
          isOpen={isModalOpen}
          onClose={closeModal}
          isAdminView={true}
          onMessageSent={() => fetchTickets()}
        />
      </div>
    </DashboardLayout>
  );
}
