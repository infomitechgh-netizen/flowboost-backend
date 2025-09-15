// src/hooks/useAuth.ts
import { useState, useEffect } from "react";
import jwtDecode from "jwt-decode";

interface DecodedToken {
  id: number;
  email: string;
  name: string;
  role: string;
  exp: number;
}

export function useAuth() {
  const [user, setUser] = useState<DecodedToken | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setUser(decoded);
        } else {
          localStorage.removeItem("token"); // expired
        }
      } catch {
        localStorage.removeItem("token");
      }
    }
  }, []);

  return user;
}
