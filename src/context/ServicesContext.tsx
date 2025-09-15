// src/context/ServicesContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import axios from "axios";

export interface Service {
  id: number;
  name: string;
  category: string;
  user_price: number;
  api_price?: number;
  min_quantity?: number;
  max_quantity?: number;
  // add more fields if your API returns them
}

type ServicesContextType = {
  services: Service[];
  categories: string[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const ServicesContext = createContext<ServicesContextType | undefined>(undefined);

export const ServicesProvider = ({ children }: { children: ReactNode }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = "http://localhost:5000"; // change if needed

  const doFetch = useCallback(async () => {
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // Fetch both endpoints in parallel
      const [svcRes, catRes] = await Promise.allSettled([
        axios.get(`${baseUrl}/api/services`, { headers, params: { forOrderPage: true } }),
        axios.get(`${baseUrl}/api/categories`, { headers }),
      ]);

      // Normalize services response
      let servicesData: Service[] = [];
      if (svcRes.status === "fulfilled") {
        const d = svcRes.value.data;
        servicesData = Array.isArray(d) ? d : Array.isArray(d?.services) ? d.services : [];
      }

      // Normalize categories response
      let categoriesData: string[] = [];
      if (catRes.status === "fulfilled") {
        const cd = catRes.value.data;
        categoriesData = Array.isArray(cd) ? cd : Array.isArray(cd?.categories) ? cd.categories : [];
      }

      // If categories not returned, derive from services
      if (!categoriesData.length && servicesData.length) {
        categoriesData = Array.from(new Set(servicesData.map((s) => (s.category || "").toString()).filter(Boolean)));
      }

      // Update state + localStorage cache
      setServices(servicesData);
      setCategories(categoriesData);
      try {
        localStorage.setItem("services_cache", JSON.stringify(servicesData));
        localStorage.setItem("categories_cache", JSON.stringify(categoriesData));
      } catch (e) {
        // ignore storage errors
      }
      setLoading(false);
      console.log(`ServicesContext: fetched ${servicesData.length} services, ${categoriesData.length} categories`);
    } catch (err: any) {
      console.error("ServicesContext fetch error", err);
      setError(err?.message || "Failed to fetch services/categories");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    // Load from cache immediately (if any) so UI is instant
    try {
      const cachedServices = localStorage.getItem("services_cache");
      const cachedCategories = localStorage.getItem("categories_cache");
      if (cachedServices && mounted) {
        const parsed = JSON.parse(cachedServices) as Service[];
        setServices(Array.isArray(parsed) ? parsed : []);
        if (cachedCategories) {
          const parsedCats = JSON.parse(cachedCategories);
          setCategories(Array.isArray(parsedCats) ? parsedCats : []);
        }
        setLoading(false);
        console.log("ServicesContext: loaded from cache");
      }
    } catch (e) {
      console.warn("ServicesContext: failed to load cache", e);
    }

    // Always fetch fresh data in background (keeps cache fresh)
    doFetch();

    return () => { mounted = false; };
  }, [doFetch]);

  const refresh = useCallback(async () => {
    setLoading(true);
    await doFetch();
  }, [doFetch]);

  return (
    <ServicesContext.Provider value={{ services, categories, loading, error, refresh }}>
      {children}
    </ServicesContext.Provider>
  );
};

export const useServices = (): ServicesContextType => {
  const ctx = useContext(ServicesContext);
  if (!ctx) throw new Error("useServices must be used within a ServicesProvider");
  return ctx;
};
