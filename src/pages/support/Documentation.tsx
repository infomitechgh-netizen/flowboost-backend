// src/pages/Documentation.tsx
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  FileText,
  Video,
  BookOpen,
  HelpCircle,
  Notebook,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import DocumentationModal from "@/components/DocumentationModal";
import { documentationContent } from "@/data/documentationContent";
import {
  DocumentationContent,
  ArticleContent,
  CategoryContent,
} from "@/types/documentation";

const Documentation = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(
    null
  );

  // Categories metadata
  const categoriesMeta = [
    { id: "getting-started", title: "Getting Started", icon: BookOpen },
    { id: "orders-services", title: "Orders & Services", icon: FileText },
    { id: "payments-billing", title: "Payments & Billing", icon: HelpCircle },
    { id: "account-management", title: "Account Management", icon: Video },
  ];

  // Build categories dynamically from documentationContent
  const categories = useMemo(() => {
    return categoriesMeta.map((meta) => {
      const category = documentationContent[meta.id] as
        | CategoryContent
        | undefined;

      // ✅ Ensure it's a category
      if (!category || category.type !== "category") {
        return { ...meta, articles: [] as ArticleContent[] };
      }

      const articles: ArticleContent[] =
        category.children
          .map((childId) => documentationContent[childId])
          .filter(
            (a): a is ArticleContent =>
              !!a &&
              (a.type === "article" || a.type === "video") &&
              a.title.toLowerCase().includes(searchTerm.toLowerCase())
          ) || [];

      return { ...meta, articles };
    });
  }, [searchTerm]);

  // Compute Popular Articles dynamically (top 5 by views)
  const popularArticles = useMemo(() => {
    return Object.values(documentationContent)
      .filter(
        (item): item is ArticleContent =>
          item.type === "article" || item.type === "video"
      )
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);
  }, []);

  // Utility functions
  const getTypeIcon = (type: ArticleContent["type"]) => {
    if (type === "video") return <Video className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  const getTypeColor = (type: ArticleContent["type"]) => {
    return type === "video" ? "secondary" : "outline";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Notebook className="w-8 h-8 text-primary " />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Documentation</h1>
            <p className="text-muted-foreground">
              Find answers and learn how to use our platform
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documentation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Categories */}
        <div className="grid gap-6 md:grid-cols-2">
          {categories.map((category) => (
            <Card key={category.id} className="glass-card ">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 ">
                  <category.icon className="w-6 h-6 text-primary " />
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 ">
                {category.articles.length > 0 ? (
                  category.articles.map((article) => (
                    <div
                      key={article.id}
                      onClick={() => setSelectedArticleId(article.id)}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-primary/20 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3 ">
                        {getTypeIcon(article.type)}
                        <div>
                          <p className="font-medium">{article.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant={getTypeColor(article.type)}
                              className="text-xs"
                            >
                              {article.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {article.views} views
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No articles found.
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Popular Articles */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Popular Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {popularArticles.map((article, index) => (
                <div
                  key={article.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-primary/20 transition-colors cursor-pointer"
                  onClick={() => setSelectedArticleId(article.id)}
                >
                  <div className="flex items-center gap-3">
                    {getTypeIcon(article.type)}
                    <div>
                      <p className="font-medium">{article.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant={getTypeColor(article.type)}
                          className="text-xs"
                        >
                          {article.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {article.views} views
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-medium">#{index + 1}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Article Modal */}
      <DocumentationModal
        isOpen={!!selectedArticleId}
        onClose={() => setSelectedArticleId(null)}
        articleId={selectedArticleId}
      />
    </DashboardLayout>
  );
};

export default Documentation;
