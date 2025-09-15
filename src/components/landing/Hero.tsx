import { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Shield,
  Zap,
  Play,
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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import heroDashboard from "@/assets/hero-dashboard.jpg";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Footer } from "../layout/Footer";

// Import your logo and title images
import Logo from "@/assets/logo.jpg";
import Title from "@/assets/flowpane.png";


interface HeroProps {
  onViewDemo?: () => void;
}

interface HeroProps {
  onViewDemo?: () => void;
}

export const Hero = ({ onViewDemo }: HeroProps) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");

      // Try immediately
      let section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      } else {
        // Try again after DOM is painted
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
    <div className="min-h-screen bg-background relative">
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-20  sticky top-0">
        <div className="container mx-auto px-6 py-4 sm:py-3 flex items-center justify-between">
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

            <Button variant="ghost" onClick={() => navigate("/pages/contact/#contact")}>
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
              onClick={() => {
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" });
                setSidebarOpen(false);
              }}
            >
              Features
            </Button>

            <Button
              variant="ghost"
              className="w-full"
              onClick={() => {
                document
                  .getElementById("pricing")
                  ?.scrollIntoView({ behavior: "smooth" });
                setSidebarOpen(false);
              }}
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
      <section id="home" className="container mx-auto px-6 py-20">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight animate-fade-in">
              <span className="hero-gradient bg-clip-text text-transparent">
                Grow Your Social
              </span>
              <br />
              Media Presence
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in">
              Professional social media marketing services with advanced
              automation, real-time analytics, and guaranteed results. Boost
              your followers, likes, and engagement across all platforms.
            </p>
          </div>

          {/* Hero Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4">
            <Button
              size="lg"
              className="primary-gradient hover-glow text-lg px-8 py-6 w-full sm:w-auto"
              onClick={() => navigate("/login")}
            >
              Start Growing Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 w-full sm:w-auto"
              onClick={() => navigate("/signup")}
            >
              Join us Today
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm text-muted-foreground pt-8">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>100% Safe & Secure</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <span>Instant Delivery</span>
            </div>
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Real-Time Analytics</span>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Professional Dashboard
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Manage your campaigns, track performance, and scale your social
              media presence with our intuitive dashboard designed for
              professionals.
            </p>
          </div>

          <div className="relative group cursor-pointer" onClick={onViewDemo}>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <img
              src={heroDashboard}
              alt="DripPanel Dashboard Interface"
              className="relative rounded-2xl shadow-2xl border border-border/50 hover-lift w-full max-w-5xl mx-auto"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent rounded-2xl"></div>
            <Button
              size="lg"
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 primary-gradient hover-glow"
            >
              <Play className="mr-2 h-5 w-5" />
              Try Live Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-20">
        <div className="text-center space-y-8 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            Powerful Features for{" "}
            <span className="hero-gradient bg-clip-text text-transparent">
              Social Growth
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to grow your social media presence with
            professional tools and automation
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="glass-card hover-lift border-primary/20">
            <CardContent className="p-8 text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Lightning Fast Delivery</h3>
              <p className="text-muted-foreground">
                Get results within minutes. Our automated system ensures rapid
                delivery of all services with real-time tracking and instant
                notifications.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card hover-lift border-success/20">
            <CardContent className="p-8 text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                <Shield className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold">100% Safe & Secure</h3>
              <p className="text-muted-foreground">
                Your account safety is our priority. All services are delivered
                through secure methods with money-back guarantee and SSL
                encryption.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card hover-lift border-accent/20">
            <CardContent className="p-8 text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                <BarChart3 className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Advanced Analytics</h3>
              <p className="text-muted-foreground">
                Track your progress with detailed analytics, growth metrics,
                order history, and performance insights in real-time dashboard.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="glass-card hover-lift border-primary/20">
            <CardContent className="p-8 text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Multi-Platform Support</h3>
              <p className="text-muted-foreground">
                Instagram, TikTok, YouTube, Facebook, Twitter, and more. Manage
                all your social media accounts from one dashboard.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card hover-lift border-success/20">
            <CardContent className="p-8 text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                <Clock className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold">24/7 Automation</h3>
              <p className="text-muted-foreground">
                Set it and forget it. Our automation tools work around the clock
                to grow your audience while you focus on content creation.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card hover-lift border-accent/20">
            <CardContent className="p-8 text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                <HeadphonesIcon className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Expert Support</h3>
              <p className="text-muted-foreground">
                Get help when you need it. Our expert support team is available
                24/7 via live chat, email, and phone support.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="container mx-auto px-6 py-20 bg-muted/20"
      >
        <div className="text-center space-y-8 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            Simple, Transparent{" "}
            <span className="hero-gradient bg-clip-text text-transparent">
              Pricing
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your social media growth needs. No
            hidden fees, cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Starter Plan */}
          <Card className="glass-card hover-lift border-border/50 relative">
            <CardContent className="p-8 space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold">Starter</h3>
                <p className="text-muted-foreground">Perfect for beginners</p>
                <div className="space-y-1">
                  <span className="text-4xl font-bold">$29</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </div>

              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Up to 2 social accounts</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span>10K followers/month</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Basic analytics</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Email support</span>
                </li>
              </ul>

              <Button className="w-full" variant="outline">
                Get Started
              </Button>
            </CardContent>
          </Card>

          {/* Professional Plan */}
          <Card className="glass-card hover-lift border-primary/50 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>
            <CardContent className="p-8 space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold">Professional</h3>
                <p className="text-muted-foreground">For growing businesses</p>
                <div className="space-y-1">
                  <span className="text-4xl font-bold">$79</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </div>

              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Up to 5 social accounts</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span>50K followers/month</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Custom automation</span>
                </li>
              </ul>

              <Button className="w-full primary-gradient hover-glow">
                Get Started
              </Button>
            </CardContent>
          </Card>

          {/* Enterprise Plan */}
          <Card className="glass-card hover-lift border-accent/50 relative">
            <CardContent className="p-8 space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold">Enterprise</h3>
                <p className="text-muted-foreground">For large organizations</p>
                <div className="space-y-1">
                  <span className="text-4xl font-bold">$199</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </div>

              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Unlimited accounts</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Unlimited followers</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span>White-label solution</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Dedicated manager</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span>24/7 phone support</span>
                </li>
              </ul>

              <Button className="w-full" variant="outline">
                Contact Sales
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Testimonials */}
        <div className="mt-20">
          <div className="text-center space-y-8 mb-12">
            <h3 className="text-2xl md:text-3xl font-bold">
              Trusted by{" "}
              <span className="hero-gradient bg-clip-text text-transparent">
                10,000+
              </span>{" "}
              Creators
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="glass-card border-border/50">
              <CardContent className="p-6 space-y-4">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-primary text-primary"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground">
                  "FlowBoostPanel helped me grow from 1K to 100K followers in
                  just 3 months. The results are incredible!"
                </p>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-primary/20"></div>
                  <div>
                    <p className="font-semibold">Anyamesem Priscilla</p>
                    <p className="text-sm text-muted-foreground">
                      Content Creator
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-border/50">
              <CardContent className="p-6 space-y-4">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-primary text-primary"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground">
                  "The analytics and automation features are game-changing.
                  Saved me hours every week!"
                </p>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-primary/20"></div>
                  <div>
                    <p className="font-semibold">Obeng Abrefa Lamech</p>
                    <p className="text-sm text-muted-foreground">
                      Digital Marketer
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-border/50">
              <CardContent className="p-6 space-y-4">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-primary text-primary"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground">
                  "Best investment for my business. Professional service and
                  amazing support team!"
                </p>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-primary/20"></div>
                  <div>
                    <p className="font-semibold">Afriyie Michael</p>
                    <p className="text-sm text-muted-foreground">Brand Owner</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer/>
    {/*  <footer className="border-t border-border/50 py-12">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4">
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
            <p className="text-sm text-muted-foreground">
              Professional social media growth services. Safe, fast, and
              reliable.
            </p>
            <p className="text-sm text-muted-foreground">
              Copyright © 2025 | <strong>FlowBoostPanel</strong> - Powered by{" "}
              <strong> aFiMiTech Solutions.</strong>{" "}
            </p>
          </div>
        </div>
      </footer> */}
    </div>
  );
};
