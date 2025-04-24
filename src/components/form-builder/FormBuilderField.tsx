import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { FormField } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Grip, CopyIcon, Trash } from 'lucide-react';
import { useFormBuilder } from '@/hooks/useFormBuilder';
import { getFormFieldPreview } from './field-previews';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface FormBuilderFieldProps {
  field: FormField;
  isSelected: boolean;
  onClick: () => void;
  onDeselect: () => void;
}

const FormBuilderField = ({
  field,
  isSelected,
  onClick,
  onDeselect,
}: FormBuilderFieldProps) => {
  const { removeField } = useFormBuilder();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 2 : 1,
  };

  const handleCardClick = () => {
    if (isSelected) {
      return;
    }
    onClick();
  };

  const handleBackgroundClick = () => {
    if (isSelected) {
      onDeselect();
    }
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Duplicate functionality would be implemented here
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeField(field.id);
    if (isSelected) {
      onDeselect();
    }
  };

  const formattedFieldType = field.type
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());

  return (
    <div 
      onClick={handleBackgroundClick} 
      className="relative" 
      ref={setNodeRef} 
      style={style}
    >
      <Card 
        className={cn(
          "transition-all duration-200 hover:shadow-sm border border-border/40 bg-card/40",
          isSelected && "ring-2 ring-primary shadow-sm",
          isDragging && "opacity-50"
        )}
        onClick={handleCardClick}
      >
        <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <div 
              className="cursor-move p-1 text-muted-foreground touch-none hover:text-foreground transition-colors"
              {...attributes}
              {...listeners}
            >
              <Grip className="h-5 w-5" />
            </div>
            <Badge variant="secondary" className="text-xs font-normal bg-muted/50">
              {formattedFieldType}
            </Badge>
            {field.required && (
              <Badge variant="outline" className="text-xs font-normal border-primary/20 text-primary">
                Required
              </Badge>
            )}
          </div>
          {isSelected && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={handleDuplicate}
              >
                <CopyIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={handleDelete}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="p-4">
          {getFormFieldPreview(field)}
        </CardContent>
        {field.helpText && (
          <CardFooter className="px-4 py-2 text-sm text-muted-foreground border-t border-border/40">
            {field.helpText}
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default FormBuilderField;