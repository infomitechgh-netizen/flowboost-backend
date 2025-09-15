// -----------------------------------------------------------------------------
// File: src/components/TicketMessagesModal.tsx
// Admin side fixes: correct alignment, reload after send, safe date format.
// -----------------------------------------------------------------------------

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Send, User, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string | number;
  message: string;
  sender: "user" | "admin";
  user_email: string;
  created_at: string;
  replyToId?: string | null;
}

interface Ticket {
  id: number | string;
  subject: string;
  status: string;
  priority: string;
}

interface TicketMessagesModalProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
  isAdminView?: boolean;
  onMessageSent?: () => void; // <--- Add this line
}

export function TicketMessagesModal({
  ticket,
  isOpen,
  onClose,
  isAdminView = false,
}: TicketMessagesModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ Safe date formatter
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleString();
  };

  // ✅ Memoized fetch
  const fetchMessages = useCallback(async () => {
    if (!ticket) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/tickets/${ticket.id}/messages`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );

      const formatted = res.data.map((m: any) => ({
        id: m.id,
        message: m.message,
        created_at: m.created_at,
        user_email: m.user_email,
        sender: m.sender_type,
        replyToId: m.replyToId || null,
      }));

      setMessages(formatted);
    } catch (err) {
      console.error("❌ Failed to fetch messages:", err);
    } finally {
      setLoading(false);
    }
  }, [ticket]);

  // 🔹 Load messages when modal opens
  useEffect(() => {
    if (ticket && isOpen) fetchMessages();
  }, [ticket, isOpen, fetchMessages]);

  // 🔹 Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !ticket) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/tickets/${ticket.id}/messages`,
        {
          message: newMessage,
          sender_type: isAdminView ? "admin" : "user",
          replyToId: replyTo?.id || null,
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );

      // ✅ Refetch so message displays correctly
      fetchMessages();
      setNewMessage("");
      setReplyTo(null);
    } catch (err) {
      console.error("❌ Failed to send message:", err);
    }
  };

  const handleReplyClick = (m: Message) => {
    setReplyTo(m);
  };

  if (!ticket) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col">
        {/* Header */}
        <DialogHeader className="flex-shrink-0">
          <div className="space-y-2">
            <DialogTitle className="flex items-center gap-2">
              <span>Ticket #{ticket.id}</span>
              <Badge variant="outline">{ticket.status}</Badge>
              <Badge variant="secondary">{ticket.priority}</Badge>
            </DialogTitle>
            <p className="text-sm text-muted-foreground">{ticket.subject}</p>
          </div>
        </DialogHeader>

        {/* Messages */}
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4 p-2">
            {loading ? (
              <p className="text-sm text-muted-foreground">
                Loading messages...
              </p>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 items-start ${
                    message.sender === "admin" ? "flex-row-reverse" : ""
                  }`}
                >
                  {/* Avatar */}
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback
                      className={
                        message.sender === "admin"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary"
                      }
                    >
                      {message.sender === "admin" ? (
                        <Shield className="w-4 h-4" />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>

                  {/* Content */}
                  <div
                    className={`flex-1 space-y-1 ${
                      message.sender === "admin" ? "text-right" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {message.user_email}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(message.created_at)}
                      </span>
                      {isAdminView && message.sender === "user" && (
                        <button
                          onClick={() => handleReplyClick(message)}
                          className="text-xs ml-2 underline text-muted-foreground hover:text-foreground"
                        >
                          Reply
                        </button>
                      )}
                    </div>

                    <div
                      className={`p-3 rounded-lg max-w-[80%] ${
                        message.sender === "admin"
                          ? "bg-primary text-primary-foreground ml-auto"
                          : "bg-muted"
                      }`}
                    >
                      {message.replyToId && (
                        <div className="text-xs text-muted-foreground mb-1 italic">
                          In reply to message #{message.replyToId}
                        </div>
                      )}
                      <p className="text-sm">{message.message}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="flex-shrink-0 space-y-2 pt-4 border-t">
          {replyTo && (
            <div className="flex items-center justify-between p-2 rounded-md bg-muted/30">
              <div className="text-sm">
                Replying to <strong>{replyTo.user_email}</strong>:{" "}
                <span className="italic">
                  "{replyTo.message.slice(0, 120)}"
                </span>
              </div>
              <button
                onClick={() => setReplyTo(null)}
                className="text-xs underline text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
            </div>
          )}

          <Textarea
            placeholder="Type your response..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="min-h-[60px] resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />

          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
              Press Enter to send, Shift+Enter for new line
            </p>
            <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
              <Send className="w-4 h-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
