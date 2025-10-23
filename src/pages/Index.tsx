import { useState } from "react";
import { KnowledgeCard } from "@/components/CartaoConhecimento";
import { SearchBar } from "@/components/BarraPesquisa";
import { CategoryFilter } from "@/components/FiltroCategoria";
import { FloatingAddButton } from "@/components/BotaoAdicionarFlutuante";
import { VideoViewModal } from "@/components/ModalVisualizarVideo";
import { AddVideoModal } from "@/components/ModalAdicionarVideo";
import { useVideos } from "@/hooks/useVideos";
import { Video, Sparkles, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Index = () => {
  const { videos, isLoading, addVideo, deleteVideo } = useVideos();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedVideo, setSelectedVideo] = useState<typeof videos[0] | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState<string | null>(null);

  const categories = ["Todos", ...Array.from(new Set(videos.map(v => v.category)))];

  const filteredVideos = videos.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Todos" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleVideoClick = (video: typeof videos[0]) => {
    setSelectedVideo(video);
    setIsViewModalOpen(true);
  };

  const handleAddVideo = async (newVideo: {
    title: string;
    description: string;
    duration: string;
    category: string;
    media: string[];
    steps: string[];
  }) => {
    await addVideo({
      ...newVideo,
      duration: newVideo.duration || null,
      thumbnail: newVideo.media[0] || null,
    });
  };

  const handleDeleteVideo = async () => {
    if (videoToDelete) {
      await deleteVideo(videoToDelete);
      setVideoToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Global IA
              </h1>
              <p className="text-sm text-muted-foreground">Base de Conhecimento</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center space-y-6 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Video className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-medium">Base de Conhecimento</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Aprenda e domine a
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {" "}Global IA
            </span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Acesse vídeos e guias passo a passo para aproveitar ao máximo nossa plataforma
          </p>
        </div>

        {/* Search */}
        <div className="flex justify-center mb-8">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-12">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-card/60 to-card/40 backdrop-blur-sm border border-border/50">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/20">
                <Video className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">
                  {videos.length}
                </p>
                <p className="text-sm text-muted-foreground">Vídeos</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-card/60 to-card/40 backdrop-blur-sm border border-border/50">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-accent/20">
                <Video className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">
                  {videos.reduce((sum, v) => sum + (v.media?.length || 0), 0)}
                </p>
                <p className="text-sm text-muted-foreground">Mídias</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-card/60 to-card/40 backdrop-blur-sm border border-border/50">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/20">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">{categories.length - 1}</p>
                <p className="text-sm text-muted-foreground">Categorias</p>
              </div>
            </div>
          </div>
        </div>

        {/* Videos Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((item) => (
                <KnowledgeCard
                  key={item.id}
                  title={item.title}
                  description={item.description}
                  duration={item.duration || undefined}
                  category={item.category}
                  thumbnail={item.thumbnail || undefined}
                  onClick={() => handleVideoClick(item)}
                  onDelete={() => setVideoToDelete(item.id)}
                />
              ))}
            </div>

            {filteredVideos.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  Nenhum resultado encontrado para sua busca.
                </p>
              </div>
            )}
          </>
        )}
      </section>

      {/* Floating Add Button */}
      <FloatingAddButton onClick={() => setIsAddModalOpen(true)} />

      {/* Modals */}
      <VideoViewModal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        video={selectedVideo}
      />

      <AddVideoModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onAdd={handleAddVideo}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!videoToDelete} onOpenChange={() => setVideoToDelete(null)}>
        <AlertDialogContent className="bg-card/95 backdrop-blur-md border-primary/20">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este vídeo? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteVideo}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
