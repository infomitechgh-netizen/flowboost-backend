import { useState } from "react";
import { Hero } from "@/components/landing/Hero";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Dashboard } from "./Dashboard";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleViewDemo = () => {
    setIsAuthenticated(true);
  };

  const handleBackToLanding = () => {
    setIsAuthenticated(false);
  };

  if (isAuthenticated) {
    return (
      <DashboardLayout>
        <Dashboard onBackToLanding={handleBackToLanding} />
      </DashboardLayout>
    );
  }

  return <Hero onViewDemo={handleViewDemo} />;
};

export default Index;
