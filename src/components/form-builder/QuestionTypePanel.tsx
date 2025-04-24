import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FieldType } from "@/lib/types";
import { 
  AlignLeft, 
  ListPlus, 
  FileText, 
  BarChartBig, 
  CalendarDays, 
  Mail, 
  Hash, 
  CircleDot, 
  FormInput, 
  List, 
  Layers, 
  Type,
  CheckSquare,
  Image,
  Paperclip
} from "lucide-react";

interface QuestionTypePanelProps {
  onAddField: (type: FieldType) => void;
}

interface QuestionTypeItem {
  type: FieldType;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const questionTypes: QuestionTypeItem[] = [
  {
    type: 'text',
    label: 'Text',
    icon: <Type className="h-4 w-4" />,
    description: 'Short answer text field'
  },
  {
    type: 'textarea',
    label: 'Long Text',
    icon: <AlignLeft className="h-4 w-4" />,
    description: 'Multiple line text input'
  },
  {
    type: 'number',
    label: 'Number',
    icon: <Hash className="h-4 w-4" />,
    description: 'Numeric input field'
  },
  {
    type: 'email',
    label: 'Email',
    icon: <Mail className="h-4 w-4" />,
    description: 'Email address input'
  },
  {
    type: 'select',
    label: 'Dropdown',
    icon: <FormInput className="h-4 w-4" />,
    description: 'Dropdown select menu'
  },
  {
    type: 'multiSelect',
    label: 'Multi-Select',
    icon: <ListPlus className="h-4 w-4" />,
    description: 'Multiple selection dropdown'
  },
  {
    type: 'checkbox',
    label: 'Checkboxes',
    icon: <CheckSquare className="h-4 w-4" />,
    description: 'Multiple checkbox options'
  },
  {
    type: 'radio',
    label: 'Radio',
    icon: <CircleDot className="h-4 w-4" />,
    description: 'Single select radio buttons'
  },
  {
    type: 'date',
    label: 'Date',
    icon: <CalendarDays className="h-4 w-4" />,
    description: 'Date picker calendar'
  },
  {
    type: 'file',
    label: 'File Upload',
    icon: <FileText className="h-4 w-4" />,
    description: 'Single file upload'
  },
  {
    type: 'image',
    label: 'Image Upload',
    icon: <Image className="h-4 w-4" />,
    description: 'Image upload with preview'
  },
  {
    type: 'attachment',
    label: 'Attachments',
    icon: <Paperclip className="h-4 w-4" />,
    description: 'Multiple file attachments'
  },
  {
    type: 'rating',
    label: 'Rating',
    icon: <BarChartBig className="h-4 w-4" />,
    description: 'Rating scale for feedback'
  },
  {
    type: 'matrix',
    label: 'Matrix',
    icon: <List className="h-4 w-4" />,
    description: 'Grid of questions and answers'
  },
  {
    type: 'repeatable',
    label: 'Repeatable',
    icon: <Layers className="h-4 w-4" />,
    description: 'Repeatable section of fields'
  }
];

const QuestionTypePanel = ({ onAddField }: QuestionTypePanelProps) => {
  return (
    <ScrollArea className="h-[calc(100vh-12rem)] pr-4 -mr-4">
      <div className="space-y-2 pb-4">
        <div className="text-sm font-medium mb-2 text-muted-foreground">Basic Fields</div>
        <div className="grid grid-cols-1 gap-2">
          {questionTypes.slice(0, 4).map((question) => (
            <Button
              key={question.type}
              variant="outline"
              className="justify-start h-auto py-2.5 px-3 border-border/40 bg-card/40 hover:bg-card/60"
              onClick={() => onAddField(question.type)}
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-muted/50 rounded-md">{question.icon}</div>
                <div className="text-left">
                  <div className="text-sm font-medium">{question.label}</div>
                  <div className="text-xs text-muted-foreground">{question.description}</div>
                </div>
              </div>
            </Button>
          ))}
        </div>

        <Separator className="my-4 bg-border/40" />

        <div className="text-sm font-medium mb-2 text-muted-foreground">Choice Fields</div>
        <div className="grid grid-cols-1 gap-2">
          {questionTypes.slice(4, 8).map((question) => (
            <Button
              key={question.type}
              variant="outline"
              className="justify-start h-auto py-2.5 px-3 border-border/40 bg-card/40 hover:bg-card/60"
              onClick={() => onAddField(question.type)}
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-muted/50 rounded-md">{question.icon}</div>
                <div className="text-left">
                  <div className="text-sm font-medium">{question.label}</div>
                  <div className="text-xs text-muted-foreground">{question.description}</div>
                </div>
              </div>
            </Button>
          ))}
        </div>

        <Separator className="my-4 bg-border/40" />

        <div className="text-sm font-medium mb-2 text-muted-foreground">File Upload Fields</div>
        <div className="grid grid-cols-1 gap-2">
          {questionTypes.slice(9, 12).map((question) => (
            <Button
              key={question.type}
              variant="outline"
              className="justify-start h-auto py-2.5 px-3 border-border/40 bg-card/40 hover:bg-card/60"
              onClick={() => onAddField(question.type)}
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-muted/50 rounded-md">{question.icon}</div>
                <div className="text-left">
                  <div className="text-sm font-medium">{question.label}</div>
                  <div className="text-xs text-muted-foreground">{question.description}</div>
                </div>
              </div>
            </Button>
          ))}
        </div>

        <Separator className="my-4 bg-border/40" />

        <div className="text-sm font-medium mb-2 text-muted-foreground">Advanced Fields</div>
        <div className="grid grid-cols-1 gap-2">
          {questionTypes.slice(12).map((question) => (
            <Button
              key={question.type}
              variant="outline"
              className="justify-start h-auto py-2.5 px-3 border-border/40 bg-card/40 hover:bg-card/60"
              onClick={() => onAddField(question.type)}
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-muted/50 rounded-md">{question.icon}</div>
                <div className="text-left">
                  <div className="text-sm font-medium">{question.label}</div>
                  <div className="text-xs text-muted-foreground">{question.description}</div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};

export default QuestionTypePanel;