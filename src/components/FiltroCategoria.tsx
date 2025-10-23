import { Button } from "@/components/ui/button";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryFilter = ({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          onClick={() => onSelectCategory(category)}
          className={
            selectedCategory === category
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "border-border/50 hover:border-primary/50 hover:bg-card/50"
          }
        >
          {category}
        </Button>
      ))}
    </div>
  );
};
