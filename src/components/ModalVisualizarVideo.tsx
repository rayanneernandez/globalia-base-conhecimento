import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface VideoViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  video: {
    title: string;
    description: string;
    duration?: string;
    category: string;
    media: string[];
    steps?: string[];
  } | null;
}

export const VideoViewModal = ({ open, onOpenChange, video }: VideoViewModalProps) => {
  if (!video) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto overflow-x-hidden bg-card/95 backdrop-blur-md border-primary/20">
        <DialogHeader>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {video.title}
            </DialogTitle>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="border-primary/50 text-primary">
                {video.category}
              </Badge>
              {video.duration && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{video.duration}</span>
                </div>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4 overflow-x-hidden">
          {/* Media Carousel */}
          {video.media.length > 0 && (
            <div className="relative">
              <Carousel className="w-full">
                <CarouselContent>
                  {video.media.map((mediaUrl, index) => (
                    <CarouselItem key={index}>
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-secondary/50">
                        {mediaUrl.endsWith('.mp4') || mediaUrl.includes('youtube') || mediaUrl.includes('vimeo') ? (
                          <video
                            src={mediaUrl}
                            controls
                            className="w-full h-full object-cover"
                          >
                            Seu navegador não suporta vídeo.
                          </video>
                        ) : (
                          <img
                            src={mediaUrl || "/placeholder.svg"}
                            alt={`${video.title} - ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {video.media.length > 1 && (
                  <>
                    <CarouselPrevious className="left-4" />
                    <CarouselNext className="right-4" />
                  </>
                )}
              </Carousel>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Descrição</h3>
            <p className="text-muted-foreground break-words">{video.description}</p>
          </div>

          {/* Steps */}
          {video.steps && video.steps.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Passo a Passo</h3>
              <ol className="space-y-3">
                {video.steps.map((step, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-semibold">
                      {index + 1}
                    </span>
                    <p className="text-muted-foreground pt-1 break-words">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
