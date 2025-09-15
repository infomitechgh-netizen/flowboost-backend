// src/types/documentation.ts
import { ReactNode } from "react";

// ================================
// Article type
// ================================
export type ArticleContent = {
  id: string;
  title: string;
  categoryId: string; // links article to a category
  type: "article" | "video"; // ✅ allow both
  views: number;
  content: ReactNode;
};

// ================================
// Category type
// ================================
export type CategoryContent = {
  id: string;
  title: string;
  type: "category";
  children: string[]; // list of article IDs inside this category
};

// ================================
// Union type
// ================================
export type DocumentationContent = ArticleContent | CategoryContent;
