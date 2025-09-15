import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart3,
  Shield,
  Zap,
  Play,
  Send,
  MapPin,
  Menu,
  X,
  Users,
  Clock,
  HeadphonesIcon,
  Check,
  Star,
  MessageCircle,
  Mail,
  Phone,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "react-router-dom";
// Import your logo and title images
import Logo from "@/assets/logo.jpg";
import Title from "@/assets/flowpane.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Footer } from "@/components/layout/Footer";
const Contact = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/contact",
        formData
      );
      toast({
        title: "Message sent!",
        description: res.data.message,
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      toast({
        title: "Error",
        description:
          err.response?.data?.message ||
          "Failed to send message. Try again later.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      let section = document.getElementById(id);

      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      } else {
        // in case it renders late
        const timer = setTimeout(() => {
          section = document.getElementById(id);
          if (section) {
            section.scrollIntoView({ behavior: "smooth" });
          }
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-20 sticky top-0">
        <div className="container mx-auto px-6 py-2 flex items-center justify-between">
          {/* Logo + Title */}
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src={Logo}
              alt="Logo"
              className="h-10 w-10 rounded-lg object-cover"
            />
            <img
              src={Title}
              alt="FlowBoostPanel"
              className="h-12 md:h-16 object-contain"
            />
          </div>

          {/* Hamburger for mobile */}
          <div className="sm:hidden">
            <button onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Desktop Nav */}
          {/* Desktop Nav */}
          <div className="hidden sm:flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate("/#home")}>
              Home
            </Button>
            <Button variant="ghost" onClick={() => navigate("/#features")}>
              Features
            </Button>

            <Button variant="ghost" onClick={() => navigate("/#pricing")}>
              Pricing
            </Button>

            <Button
              variant="ghost"
              onClick={() => navigate("/pages/contact/#contact")}
            >
              Contact Us
            </Button>

            <Button
              className="primary-gradient hover-glow"
              onClick={() => navigate("/login")}
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30">
          {/* Background overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          ></div>

          {/* Sidebar */}
          <div className="absolute right-0 top-0 h-full w-64 bg-background shadow-xl p-6 flex flex-col space-y-4 overflow-y-auto">
            <button className="self-end" onClick={() => setSidebarOpen(false)}>
              <X className="h-6 w-6" />
            </button>

            <Button variant="ghost" onClick={() => navigate("/#home")}>
              Home
            </Button>

            <Button
              variant="ghost"
              className="w-full"
              onClick={() => navigate("/#features")}
            >
              Features
            </Button>

            <Button
              variant="ghost"
              className="w-full"
              onClick={() => navigate("/#pricing")}
            >
              Pricing
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                navigate("/pages/contact/#contact");
                setSidebarOpen(false);
              }}
            >
              Contact Us
            </Button>

            <Button
              className="primary-gradient hover-glow w-full"
              onClick={() => {
                navigate("/login");
                setSidebarOpen(false);
              }}
            >
              Get Started
            </Button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section id="contact" className="container mx-auto px-6 py-20">
        <div className="text-center space-y-8 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            <span className="hero-gradient bg-clip-text text-transparent">
              Get in Touch
            </span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Have questions about our services? Need help with your account? Our
            expert team is here to help you grow your social media presence.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="container mx-auto px-6 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl">Send us a Message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="What can we help you with?"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us more about your needs..."
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full primary-gradient hover-glow"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <div className="space-y-6">
                <Card className="glass-card border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Email Support</h3>
                        <p className="text-muted-foreground">
                          support@flowboostpanel.com
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Response within 1 hour
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card border-success/20">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                        <MessageCircle className="h-6 w-6 text-success" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Live Chat</h3>
                        <p className="text-muted-foreground">Available 24/7</p>
                        <p className="text-sm text-muted-foreground">
                          Instant support
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold"> - Coming soon!</h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card border-accent/20">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                        <Phone className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Phone Support</h3>
                        <p className="text-muted-foreground">
                          +233 (546) 253-473
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Mon-Fri, 9AM-6PM UTC
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Business Hours */}
            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Business Hours</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monday - Friday</span>
                  <span>9:00 AM - 6:00 PM UTC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Saturday</span>
                  <span>Closed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sunday</span>
                  <span>13:00 PM - 4:00 PM UTC</span>
                </div>
                <div className="pt-3 border-t border-border/50">
                  <div className="flex items-center space-x-2 text-sm text-primary">
                    <MessageCircle className="h-4 w-4" />
                    <span>Live chat available 24/7 - Coming soon!</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Office Location */}
            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Office Location</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">FlowBoostPanel Headquarters</p>
                  <p className="text-muted-foreground">
                    AA 32 Asamankam Street
                    <br />
                    A7-0024-7871
                    <br />
                    Offinso, Ashanti Region
                    <br />
                    Ghana
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="container mx-auto px-6 py-20 bg-muted/20">
        <div className="text-center space-y-8 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            Frequently Asked{" "}
            <span className="hero-gradient bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="glass-card border-border/50">
            <CardContent className="p-6 space-y-3">
              <h3 className="font-semibold">How fast will I see results?</h3>
              <p className="text-muted-foreground">
                Most clients see initial results within 1-24 hours. Full
                campaigns typically show significant growth within the first
                week.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-border/50">
            <CardContent className="p-6 space-y-3">
              <h3 className="font-semibold">Is it safe for my account?</h3>
              <p className="text-muted-foreground">
                Absolutely! We use only organic growth methods that comply with
                all platform guidelines. Your account safety is our top
                priority.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-border/50">
            <CardContent className="p-6 space-y-3">
              <h3 className="font-semibold">Can I cancel anytime?</h3>
              <p className="text-muted-foreground">
                Yes, you can cancel your subscription at any time. No long-term
                contracts or cancellation fees.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-border/50">
            <CardContent className="p-6 space-y-3">
              <h3 className="font-semibold">Do you offer refunds?</h3>
              <p className="text-muted-foreground">
                We offer a 30-day money-back guarantee if you're not satisfied
                with our services. No questions asked.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Contact;
