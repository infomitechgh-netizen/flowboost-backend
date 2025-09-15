// src/components/DocumentationModal.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { documentationContent } from "@/data/documentationContent";
import { DocumentationArticle } from "@/types/documentation";

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  articleId: string | null;
}

const DocumentationModal = ({
  isOpen,
  onClose,
  articleId,
}: DocumentationModalProps) => {
  if (!articleId) return null;

  const item = documentationContent[articleId];

  // Only render if the item exists and is not a category
  if (!item || item.type === "category") return null;

  const article = item as DocumentationArticle;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl ">
        <DialogHeader>
          <DialogTitle>{article?.title ?? "Article"}</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {article?.content ?? (
            <p className="text-sm">Content coming soon...</p>
          )}
        </div>

        <div className="mt-4 text-xs text-muted-foreground">
          Views: {article?.views ?? 0}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentationModal;
