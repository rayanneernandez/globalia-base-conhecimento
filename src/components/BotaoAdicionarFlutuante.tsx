import { Plus } from "lucide-react";

interface FloatingAddButtonProps {
  onClick: () => void;
}

export const FloatingAddButton = ({ onClick }: FloatingAddButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 z-50 h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent shadow-[0_0_40px_rgba(139,92,246,0.5)] transition-all duration-300 hover:scale-110 hover:shadow-[0_0_50px_rgba(139,92,246,0.7)] active:scale-95"
      aria-label="Adicionar novo vídeo"
    >
      <Plus className="h-8 w-8 text-white m-auto" />
    </button>
  );
};
