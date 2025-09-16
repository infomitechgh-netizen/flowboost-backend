import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Send, Shield } from "lucide-react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
const BASE_URL = process.env.REACT_APP_BACKEND_URL;

interface UserMessagesModalProps {
  ticket: any | null;
  onClose: () => void;
}

export default function UserMessagesModal({
  ticket,
  onClose,
}: UserMessagesModalProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  const { toast } = useToast();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("user_id");

  // fetch messages
  const fetchMessages = async () => {
    if (!ticket) return;
    try {
      const res = await axios.get(
        `${BASE_URL}/api/tickets/${ticket.id}/messages`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch messages:", err);
      toast({
        title: "Error",
        description: "Could not load messages.",
        variant: "destructive",
      });
    }
  };

  // send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !ticket) return;

    try {
      setSending(true);
      await axios.post(
       `${BASE_URL}/api/tickets/${ticket.id}/messages`,
        {
          message: newMessage,
          user_id: userId,
          sender_type: "user", // 👈 important
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewMessage("");
      fetchMessages();
    } catch (err) {
      console.error("❌ Failed to send message:", err);
      toast({
        title: "Error",
        description: "Message not sent.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (ticket) fetchMessages();
  }, [ticket]);

  return (
    <Dialog open={!!ticket} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl flex flex-col">
        <DialogHeader>
          <DialogTitle>
            Ticket #{ticket?.id} - {ticket?.subject}
          </DialogTitle>
          <DialogDescription>
            Conversation between you and support
          </DialogDescription>
        </DialogHeader>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto space-y-4 p-2 border rounded-md bg-muted/30 max-h-[400px]">
          {messages.length === 0 ? (
            <p className="text-muted-foreground">No messages yet.</p>
          ) : (
            messages.map((msg) => {
              const isUser = msg.sender_type === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isUser && (
                    <Avatar>
                      <AvatarImage
                        src={msg.user_avatar || ""}
                        alt={msg.user_email}
                      />
                      <AvatarFallback>
                        {msg.user_email
                          ? msg.user_email.charAt(0).toUpperCase()
                          : "A"}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`p-3 rounded-xl shadow-sm max-w-[75%] ${
                      isUser
                        ? "bg-primary text-primary-foreground ml-auto"
                        : "bg-secondary text-secondary-foreground mr-auto"
                    }`}
                  >
                    <p className="text-sm flex items-center gap-1">
                      {msg.message}
                      {!isUser && <Shield className="w-3 h-3 text-blue-500" />}
                    </p>
                    <span className="text-xs opacity-70 block mt-1">
                      {new Date(msg.created_at).toLocaleString()}
                    </span>
                  </div>

                  {isUser && (
                    <Avatar>
                      <AvatarImage
                        src={msg.user_avatar || ""}
                        alt={msg.user_email}
                      />
                      <AvatarFallback>
                        {msg.user_email
                          ? msg.user_email.charAt(0).toUpperCase()
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Reply box */}
        <div className="mt-3 space-y-2">
          <Input
            placeholder="Type your reply..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
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
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sending}
            >
              <Send className="w-4 h-4 mr-2" />
              {sending ? "Sending..." : "Send"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
