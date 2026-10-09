import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripHorizontal, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardWidgetProps {
  id: string;
  isEditMode: boolean;
  isVisible: boolean;
  onToggleVisibility: (id: string) => void;
  className?: string;
  children: React.ReactNode;
}

export function DashboardWidget({ 
  id, 
  isEditMode, 
  isVisible, 
  onToggleVisibility, 
  className,
  children 
}: DashboardWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  // If not edit mode and not visible, render nothing
  if (!isEditMode && !isVisible) {
    return null;
  }

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={cn(
        "relative rounded-2xl transition-all h-full flex flex-col", 
        className,
        isEditMode && "border-2 border-dashed border-zinc-300 dark:border-zinc-700/50 p-2 min-h-[100px]",
        !isVisible && isEditMode && "opacity-40 grayscale"
      )}
    >
      {isEditMode && (
        <div className="absolute top-0 left-0 w-full z-10 flex items-center justify-between p-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-t-xl opacity-0 hover:opacity-100 transition-opacity">
          <button 
            type="button"
            className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white cursor-grab active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripHorizontal size={16} />
          </button>
          
          <button 
            type="button"
            onClick={() => onToggleVisibility(id)}
            className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-[var(--color-rd-cyan)] transition-colors"
          >
            {isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </div>
      )}
      
      <div className={cn("flex-1 h-full", isEditMode && "pointer-events-none")}>
        {children}
      </div>
    </div>
  );
}
