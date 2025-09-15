import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa";
import { Mail, Phone, MapPin } from "lucide-react";
// Import your logo and title images
import Logo from "@/assets/logo.jpg";
import Title from "@/assets/flowpane.png";
import { useNavigate } from "react-router-dom";
export const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-auto py-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 px-6 lg:gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div
              className="flex items-center justify-center space-x-2 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <img
                src={Logo}
                alt="Logo"
                className="h-8 w-8 rounded-lg object-cover"
              />
              <img
                src={Title}
                alt="FlowPanel"
                className="h-9 md:h-16 object-contain"
              />
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Supercharge your social media growth with our premium automation
              platform. Get real followers, likes, and engagement instantly.
            </p>

            {/* Newsletter Subscription */}
            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-semibold text-foreground">
                Stay Updated
              </h4>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 h-9 text-sm bg-accent/10 border-border focus:border-primary"
                />
                <Button size="sm" className="primary-gradient hover-glow px-4">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 mt-6 sm:mt-0">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Quick Links
            </h3>
            <nav className="grid grid-cols-2 gap-2 text-sm text-muted-foreground text-left justify-items-start">
              <button
                onClick={() => navigate("/#home")}
                className="hover:text-primary"
              >
                Home
              </button>
              <button
                onClick={() => navigate("/#features")}
                className="hover:text-primary"
              >
                Features
              </button>
              <button
                onClick={() => navigate("/#pricing")}
                className="hover:text-primary"
              >
                Pricing
              </button>
              <button
                onClick={() => navigate("/#pricing")}
                className="hover:text-primary"
              >
                Pricing
              </button>
              <button
                onClick={() => navigate("/pages/contact/#contact")}
                className="hover:text-primary"
              >
                Contact
              </button>
              <button
                onClick={() => navigate("/login")}
                className="hover:text-primary"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/pages/contact/#faq")}
                className="hover:text-primary"
              >
                FAQ
              </button>
              <button
                onClick={() => navigate("/pages/contact/#faq")}
                className="hover:text-primary"
              >
                Help Center
              </button>
              <button
                onClick={() => navigate("/pages/contact/#faq")}
                className="hover:text-primary"
              >
                Terms of Service
              </button>
              <button
                onClick={() => navigate("/pages/contact/#faq")}
                className="hover:text-primary"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => navigate("/pages/contact/#faq")}
                className="hover:text-primary"
              >
                Refund Policy
              </button>
              {/* {[
                { label: "Home", href: "/" },
                { label: "Features", href: "#features" },
                { label: "Pricing", href: "#pricing" },
                { label: "Contact", href: "/contact" },
                { label: "Login", href: "/login" },
                { label: "FAQ", href: "/faq" },
                { label: "Help Center", href: "/help" },
                { label: "Terms of Service", href: "/terms" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Refund Policy", href: "/refunds" },
              ].map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-sm text-muted-foreground hover:text-primary smooth-transition story-link"
                >
                  {link.label}
                </Link>
              ))} */}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 mt-6 sm:mt-0">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Get in Touch
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Email</p>
                  <a
                    href="mailto:support@flowboostpanel.com"
                    className="text-sm text-muted-foreground hover:text-primary smooth-transition"
                  >
                    support@flowboostpanel.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Phone</p>
                  <a
                    href="tel:+233546253473"
                    className="text-sm text-muted-foreground hover:text-primary smooth-transition"
                  >
                    +233 (546) 253-473 |
                  </a>

                  <a
                    href="tel:+233246203161"
                    className="text-sm text-muted-foreground hover:text-primary smooth-transition"
                  >
                    +233 (246) 203-161
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Office</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    A7-0024-7871
                    <br />
                    Offinso, Ashanti Region
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border my-8"></div>

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © 2025 FlowBoostPanel. All Rights Reserved. <br /> | Powered by{" "}
            <a href="www.mitechgh.com">
              <u>aFiMiTech Solutions</u>
            </a>
          </p>

          {/* Social Media Icons */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground mr-2">
              Follow us:
            </span>
            <div className="flex gap-3">
              {[
                {
                  icon: FaTiktok,
                  href: "https://www.tiktok.com/@flowboostpanel",
                  label: "TikTok",
                },
                {
                  icon: FaFacebook,
                  href: "https://facebook.com/profile.php?id=61580511248959",
                  label: "Facebook",
                },
                {
                  icon: FaInstagram,
                  href: "https://www.instagram.com/flowboostpanel",
                  label: "Instagram",
                },
                {
                  icon: FaTwitter,
                  href: "https://x.com/flowboostpanel",
                  label: "Twitter",
                },
                {
                  icon: FaWhatsapp,
                  href: "https://wa.me/233546253473",
                  label: "WhatsApp",
                },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent/50 text-muted-foreground hover:bg-primary hover:text-primary-foreground smooth-transition hover-lift"
                  aria-label={`Follow us on ${social.label}`}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
