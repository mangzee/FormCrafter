import { FormField } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { PlusCircle, Image as ImageIcon, Paperclip } from 'lucide-react';

// Helper function to get a preview component for each field type
export const getFormFieldPreview = (field: FormField) => {
  const { type, label, placeholder, options = [] } = field;

  switch (type) {
    case 'text':
    case 'email':
    case 'number': 
      return (
        <div className="space-y-2">
          <Label>{label}</Label>
          <Input disabled placeholder={placeholder} />
        </div>
      );

    case 'textarea':
      return (
        <div className="space-y-2">
          <Label>{label}</Label>
          <Textarea 
            disabled 
            placeholder={placeholder} 
            className="resize-none"
          />
        </div>
      );

    case 'select':
      return (
        <div className="space-y-2">
          <Label>{label}</Label>
          <Select disabled>
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map(option => (
                <SelectItem 
                  key={option.id} 
                  value={option.value}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );

    case 'radio':
      return (
        <div className="space-y-2">
          <Label>{label}</Label>
          <RadioGroup disabled defaultValue="option1">
            {options.map(option => (
              <div className="flex items-center space-x-2" key={option.id}>
                <RadioGroupItem value={option.value} id={option.id} />
                <Label htmlFor={option.id}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      );

    case 'checkbox':
      return (
        <div className="space-y-2">
          <Label>{label}</Label>
          <div className="space-y-2">
            {options.map(option => (
              <div className="flex items-center space-x-2" key={option.id}>
                <Checkbox id={option.id} disabled />
                <Label htmlFor={option.id}>{option.label}</Label>
              </div>
            ))}
          </div>
        </div>
      );

    case 'date':
      return (
        <div className="space-y-2">
          <Label>{label}</Label>
          <div className="border rounded-md p-2 opacity-70 pointer-events-none">
            <Calendar mode="single" disabled />
          </div>
        </div>
      );

    case 'file':
      return (
        <div className="space-y-2">
          <Label>{label}</Label>
          <div className="border-2 border-dashed rounded-md p-4 text-center text-muted-foreground">
            <p>Drop file here or click to upload</p>
          </div>
        </div>
      );

    case 'image':
      return (
        <div className="space-y-2">
          <Label>{label}</Label>
          <div className="border-2 border-dashed rounded-md p-6 text-center text-muted-foreground">
            <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground/60" />
            <p>Drop image here or click to upload</p>
            <p className="text-xs mt-1">Supported formats: JPG, PNG, GIF</p>
          </div>
        </div>
      );

    case 'attachment':
      return (
        <div className="space-y-2">
          <Label>{label}</Label>
          <div className="border-2 border-dashed rounded-md p-6 text-center text-muted-foreground">
            <Paperclip className="h-8 w-8 mx-auto mb-2 text-muted-foreground/60" />
            <p>Drop files here or click to upload</p>
            <p className="text-xs mt-1">Max {field.validations?.maxFiles || 5} files</p>
          </div>
        </div>
      );

    case 'rating':
      return (
        <div className="space-y-2">
          <Label>{label}</Label>
          <Slider
            disabled
            defaultValue={[3]}
            max={5}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground pt-1">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
          </div>
        </div>
      );

    case 'matrix':
      const rows = options.filter(opt => !opt.isColumn);
      const columns = options.filter(opt => opt.isColumn);
      
      return (
        <div className="space-y-2">
          <Label>{label}</Label>
          <div className="border rounded-md overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr>
                  <th className="py-2 px-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"></th>
                  {columns.map(col => (
                    <th key={col.id} className="py-2 px-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-background divide-y divide-border">
                {rows.map(row => (
                  <tr key={row.id}>
                    <td className="py-2 px-3 text-sm font-medium text-foreground">
                      {row.label}
                    </td>
                    {columns.map(col => (
                      <td key={col.id} className="py-2 px-3 text-center">
                        <RadioGroupItem disabled value="" className="opacity-50" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

    case 'repeatable':
      return (
        <div className="space-y-2">
          <Label>{label}</Label>
          <div className="p-4 border rounded-md">
            <div className="text-sm text-muted-foreground mb-2">
              {field.validations?.min || field.validations?.max ? (
                <span>
                  Users can add {field.validations.min ? `at least ${field.validations.min}` : 'any number of'} 
                  {field.validations.max ? ` and up to ${field.validations.max}` : ''} entries
                </span>
              ) : (
                'Users can add multiple entries'
              )}
            </div>
            <div className="border border-dashed rounded-md p-3 bg-muted/30">
              {field.subFields && field.subFields.length > 0 ? (
                <div className="space-y-3">
                  {field.subFields.map(subField => (
                    <div key={subField.id} className="text-sm">
                      {getFormFieldPreview(subField)}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-2 text-sm text-muted-foreground">
                  No sub-fields added yet
                </div>
              )}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-3 opacity-50"
              disabled
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </div>
        </div>
      );

    default:
      return <div>{label}</div>;
  }
};