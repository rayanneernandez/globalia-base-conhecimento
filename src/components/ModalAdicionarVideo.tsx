import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, Upload, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AddVideoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (video: {
    title: string;
    description: string;
    duration: string;
    category: string;
    media: string[];
    steps: string[];
  }) => Promise<void>;
}

export const AddVideoModal = ({ open, onOpenChange, onAdd }: AddVideoModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [media, setMedia] = useState<string[]>([]);
  const [stepInput, setStepInput] = useState("");
  const [steps, setSteps] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        // Validate file type
        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');
        
        if (!isImage && !isVideo) {
          toast({
            title: "Tipo de arquivo inválido",
            description: "Apenas imagens e vídeos são permitidos",
            variant: "destructive",
          });
          continue;
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from('knowledge-media')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          throw error;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('knowledge-media')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      setMedia([...media, ...uploadedUrls]);
      toast({
        title: "Upload concluído!",
        description: `${uploadedUrls.length} arquivo(s) enviado(s) com sucesso`,
      });
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: "Erro no upload",
        description: "Não foi possível enviar os arquivos. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset input
      event.target.value = '';
    }
  };

  const handleAddMedia = () => {
    if (mediaUrl.trim()) {
      setMedia([...media, mediaUrl.trim()]);
      setMediaUrl("");
    }
  };

  const handleRemoveMedia = (index: number) => {
    setMedia(media.filter((_, i) => i !== index));
  };

  const handleAddStep = () => {
    if (stepInput.trim()) {
      setSteps([...steps, stepInput.trim()]);
      setStepInput("");
    }
  };

  const handleRemoveStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !category.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha título, descrição e categoria",
        variant: "destructive",
      });
      return;
    }

    await onAdd({
      title: title.trim(),
      description: description.trim(),
      duration: duration.trim() || "N/A",
      category: category.trim(),
      media,
      steps,
    });

    // Reset form
    setTitle("");
    setDescription("");
    setDuration("");
    setCategory("");
    setMedia([]);
    setSteps([]);
    setMediaUrl("");
    setStepInput("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur-md border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Adicionar Novo Vídeo
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título do vídeo"
              className="bg-background/50"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o conteúdo do vídeo"
              className="bg-background/50 min-h-[80px]"
            />
          </div>

          {/* Category and Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ex: Introdução"
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duração</Label>
              <Input
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Ex: 15 min"
                className="bg-background/50"
              />
            </div>
          </div>

          {/* Media Upload and URLs */}
          <div className="space-y-2">
            <Label>Mídia (Vídeo/Imagem)</Label>
            
            {/* File Upload */}
            <div className="flex gap-2">
              <label className="flex-1">
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled={isUploading}
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Anexar do Computador
                    </>
                  )}
                </Button>
              </label>
            </div>

            {/* URL Input */}
            <div className="flex gap-2">
              <Input
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="Ou cole a URL da imagem ou vídeo"
                className="bg-background/50"
                onKeyPress={(e) => e.key === "Enter" && handleAddMedia()}
                disabled={isUploading}
              />
              <Button onClick={handleAddMedia} size="icon" variant="outline" disabled={isUploading}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {media.length > 0 && (
              <div className="space-y-2 mt-2">
                {media.map((url, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-secondary/50 rounded-lg">
                    <span className="flex-1 text-sm truncate">{url}</span>
                    <Button
                      onClick={() => handleRemoveMedia(index)}
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Steps */}
          <div className="space-y-2">
            <Label>Passo a Passo (Opcional)</Label>
            <div className="flex gap-2">
              <Input
                value={stepInput}
                onChange={(e) => setStepInput(e.target.value)}
                placeholder="Adicione um passo"
                className="bg-background/50"
                onKeyPress={(e) => e.key === "Enter" && handleAddStep()}
              />
              <Button onClick={handleAddStep} size="icon" variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {steps.length > 0 && (
              <ol className="space-y-2 mt-2">
                {steps.map((step, index) => (
                  <li key={index} className="flex items-start gap-2 p-2 bg-secondary/50 rounded-lg">
                    <span className="flex-shrink-0 font-semibold text-primary">{index + 1}.</span>
                    <span className="flex-1 text-sm">{step}</span>
                    <Button
                      onClick={() => handleRemoveStep(index)}
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="bg-gradient-to-r from-primary to-accent">
            Adicionar Vídeo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
