import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Video {
  id: string;
  title: string;
  description: string;
  duration: string | null;
  category: string;
  media: string[];
  steps: string[];
  thumbnail: string | null;
  created_at: string;
  updated_at: string;
}

export const useVideos = () => {
  const queryClient = useQueryClient();

  // Fetch all videos
  const { data: videos = [], isLoading, error } = useQuery({
    queryKey: ["videos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      return (data || []).map((video) => ({
        ...video,
        media: Array.isArray(video.media) ? video.media : [],
        steps: Array.isArray(video.steps) ? video.steps : [],
      })) as Video[];
    },
  });

  // Add video
  const addVideo = useMutation({
    mutationFn: async (newVideo: Omit<Video, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("videos")
        .insert([{
          title: newVideo.title,
          description: newVideo.description,
          duration: newVideo.duration,
          category: newVideo.category,
          media: newVideo.media,
          steps: newVideo.steps,
          thumbnail: newVideo.thumbnail,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      toast({
        title: "Vídeo adicionado!",
        description: "O vídeo foi salvo com sucesso no banco de dados.",
      });
    },
    onError: (error) => {
      console.error("Error adding video:", error);
      toast({
        title: "Erro ao adicionar vídeo",
        description: "Não foi possível salvar o vídeo. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Delete video
  const deleteVideo = useMutation({
    mutationFn: async (videoId: string) => {
      const { error } = await supabase
        .from("videos")
        .delete()
        .eq("id", videoId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      toast({
        title: "Vídeo excluído!",
        description: "O vídeo foi removido com sucesso.",
      });
    },
    onError: (error) => {
      console.error("Error deleting video:", error);
      toast({
        title: "Erro ao excluir vídeo",
        description: "Não foi possível remover o vídeo. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  return {
    videos,
    isLoading,
    error,
    addVideo: addVideo.mutateAsync,
    deleteVideo: deleteVideo.mutateAsync,
  };
};
