import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Clock, Trash2 } from "lucide-react";

interface KnowledgeCardProps {
  title: string;
  description: string;
  duration?: string;
  category: string;
  thumbnail?: string;
  onClick?: () => void;
  onDelete?: () => void;
}

export const KnowledgeCard = ({
  title,
  description,
  duration,
  category,
  thumbnail,
  onClick,
  onDelete,
}: KnowledgeCardProps) => {
  return (
    <Card
      className="group relative overflow-hidden border-border/50 bg-gradient-to-br from-card/60 to-card/40 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] cursor-pointer"
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden bg-secondary/50">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
            <Play className="h-16 w-16 text-primary" />
          </div>
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
        
        {/* Video badge and delete button */}
        <div className="absolute top-3 right-3 flex gap-2">
          {onDelete && (
            <Button
              size="icon"
              variant="destructive"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          <Badge variant="secondary" className="bg-primary/90 text-primary-foreground">
            Vídeo
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="border-primary/50 text-primary">
            {category}
          </Badge>
          {duration && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{duration}</span>
            </div>
          )}
        </div>

        <h3 className="text-xl font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
      </div>

      {/* Glow effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5" />
      </div>
    </Card>
  );
};
