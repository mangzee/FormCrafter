import { FormField as FormFieldType } from '@/lib/types';
import { useFormContext, Controller } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { PlusCircle, Trash } from 'lucide-react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from '../ui/form';

interface FormFieldRendererProps {
  field: FormFieldType;
  form: any;
}

const FormFieldRenderer = ({ field, form }: FormFieldRendererProps) => {
  const fieldType = field.type;
  const { control } = useFormContext();

  const renderFieldByType = () => {
    switch (fieldType) {
      case 'text':
      case 'email':
        return (
          <Controller
            name={field.id}
            control={control}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel className={field.required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''}>
                  {field.label}
                </FormLabel>
                <FormControl>
                  <Input
                    {...formField}
                    type={fieldType === 'email' ? 'email' : 'text'}
                    placeholder={field.placeholder}
                  />
                </FormControl>
                {field.helpText && <FormDescription>{field.helpText}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        );
        
      case 'textarea':
        return (
          <Controller
            name={field.id}
            control={control}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel className={field.required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''}>
                  {field.label}
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...formField}
                    placeholder={field.placeholder}
                    className="resize-y min-h-[100px]"
                  />
                </FormControl>
                {field.helpText && <FormDescription>{field.helpText}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        );
        
      case 'number':
        return (
          <Controller
            name={field.id}
            control={control}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel className={field.required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''}>
                  {field.label}
                </FormLabel>
                <FormControl>
                  <Input
                    {...formField}
                    type="number"
                    placeholder={field.placeholder}
                    onChange={(e) => {
                      const value = e.target.value === '' ? null : Number(e.target.value);
                      formField.onChange(value);
                    }}
                  />
                </FormControl>
                {field.helpText && <FormDescription>{field.helpText}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        );
        
      case 'select':
        return (
          <Controller
            name={field.id}
            control={control}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel className={field.required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''}>
                  {field.label}
                </FormLabel>
                <Select
                  onValueChange={formField.onChange}
                  defaultValue={formField.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={field.placeholder || 'Select an option'} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option.id} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {field.helpText && <FormDescription>{field.helpText}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'multiSelect':
        return (
          <Controller
            name={field.id}
            control={control}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel className={field.required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''}>
                  {field.label}
                </FormLabel>
                <div className="space-y-2">
                  {field.options?.map((option) => (
                    <div className="flex items-center space-x-2" key={option.id}>
                      <Checkbox
                        id={option.id}
                        checked={(formField.value || []).includes(option.value)}
                        onCheckedChange={(checked) => {
                          const currentValues = [...(formField.value || [])];
                          if (checked) {
                            if (!currentValues.includes(option.value)) {
                              formField.onChange([...currentValues, option.value]);
                            }
                          } else {
                            formField.onChange(
                              currentValues.filter((value) => value !== option.value)
                            );
                          }
                        }}
                      />
                      <Label htmlFor={option.id}>{option.label}</Label>
                    </div>
                  ))}
                </div>
                {field.helpText && <FormDescription>{field.helpText}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        );
        
      case 'radio':
        return (
          <Controller
            name={field.id}
            control={control}
            render={({ field: formField }) => (
              <FormItem className="space-y-3">
                <FormLabel className={field.required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''}>
                  {field.label}
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={formField.onChange}
                    defaultValue={formField.value}
                    className="space-y-1"
                  >
                    {field.options?.map((option) => (
                      <div className="flex items-center space-x-2" key={option.id}>
                        <RadioGroupItem value={option.value} id={option.id} />
                        <Label htmlFor={option.id}>{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                {field.helpText && <FormDescription>{field.helpText}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        );
        
      case 'checkbox':
        return (
          <Controller
            name={field.id}
            control={control}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel className={field.required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''}>
                  {field.label}
                </FormLabel>
                <div className="space-y-2">
                  {field.options?.map((option) => (
                    <div className="flex items-center space-x-2" key={option.id}>
                      <Checkbox
                        id={option.id}
                        checked={(formField.value || []).includes(option.value)}
                        onCheckedChange={(checked) => {
                          const currentValues = [...(formField.value || [])];
                          if (checked) {
                            if (!currentValues.includes(option.value)) {
                              formField.onChange([...currentValues, option.value]);
                            }
                          } else {
                            formField.onChange(
                              currentValues.filter((value) => value !== option.value)
                            );
                          }
                        }}
                      />
                      <Label htmlFor={option.id}>{option.label}</Label>
                    </div>
                  ))}
                </div>
                {field.helpText && <FormDescription>{field.helpText}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        );
        
      case 'date':
        return (
          <Controller
            name={field.id}
            control={control}
            render={({ field: formField }) => (
              <FormItem className="flex flex-col">
                <FormLabel className={field.required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''}>
                  {field.label}
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !formField.value && "text-muted-foreground"
                        )}
                      >
                        {formField.value ? (
                          format(new Date(formField.value), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formField.value ? new Date(formField.value) : undefined}
                      onSelect={(date) => formField.onChange(date?.toISOString() || null)}
                      disabled={(date) => date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {field.helpText && <FormDescription>{field.helpText}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        );
        
      case 'file':
        return (
          <Controller
            name={field.id}
            control={control}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel className={field.required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''}>
                  {field.label}
                </FormLabel>
                <FormControl>
                  <div className="grid w-full items-center gap-1.5">
                    <Input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        formField.onChange(file);
                      }}
                    />
                  </div>
                </FormControl>
                {field.helpText && <FormDescription>{field.helpText}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        );
        
      case 'rating':
        return (
          <Controller
            name={field.id}
            control={control}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel className={field.required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''}>
                  {field.label}
                </FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <Slider
                      defaultValue={[formField.value || 0]}
                      max={5}
                      step={1}
                      onValueChange={(vals) => formField.onChange(vals[0])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>1</span>
                      <span>2</span>
                      <span>3</span>
                      <span>4</span>
                      <span>5</span>
                    </div>
                  </div>
                </FormControl>
                {field.helpText && <FormDescription>{field.helpText}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        );
        
      case 'matrix':
        const rows = field.options?.filter(opt => !opt.isColumn) || [];
        const columns = field.options?.filter(opt => opt.isColumn) || [];
        
        return (
          <Controller
            name={field.id}
            control={control}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel className={field.required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''}>
                  {field.label}
                </FormLabel>
                <FormControl>
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
                                <RadioGroup
                                  orientation="horizontal"
                                  onValueChange={(value) => {
                                    const currentValues = { ...(formField.value || {}) };
                                    currentValues[row.value] = value;
                                    formField.onChange(currentValues);
                                  }}
                                  value={(formField.value || {})[row.value]}
                                >
                                  <RadioGroupItem value={col.value} id={`${row.id}-${col.id}`} />
                                </RadioGroup>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </FormControl>
                {field.helpText && <FormDescription>{field.helpText}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'repeatable':
        return (
          <Controller
            name={field.id}
            control={control}
            render={({ field: formField }) => {
              const entries = formField.value || [];
              const canAddMore = !field.validations?.max || entries.length < field.validations.max;
              const canRemove = !field.validations?.min || entries.length > field.validations.min;

              const addEntry = () => {
                const newEntry = field.subFields?.reduce((acc, subField) => {
                  acc[subField.id] = null;
                  return acc;
                }, {} as Record<string, any>);
                
                formField.onChange([...entries, newEntry]);
              };

              const removeEntry = (index: number) => {
                const newEntries = [...entries];
                newEntries.splice(index, 1);
                formField.onChange(newEntries);
              };

              return (
                <FormItem>
                  <FormLabel className={field.required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''}>
                    {field.label}
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {entries.map((_: any, index: number) => (
                        <div 
                          key={index} 
                          className="p-4 border rounded-md relative bg-muted/10"
                        >
                          <div className="absolute right-2 top-2">
                            {canRemove && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeEntry(index)}
                                className="h-8 w-8 text-destructive"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          <div className="space-y-4 pt-2">
                            {field.subFields?.map((subField) => (
                              <Controller
                                key={subField.id}
                                name={`${field.id}.${index}.${subField.id}`}
                                control={control}
                                render={() => (
                                  <FormFieldRenderer
                                    field={subField}
                                    form={form}
                                  />
                                )}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                      
                      {canAddMore && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addEntry}
                          className="w-full"
                        >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Add {field.label}
                        </Button>
                      )}
                    </div>
                  </FormControl>
                  {field.helpText && <FormDescription>{field.helpText}</FormDescription>}
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        );
        
      default:
        return (
          <div>
            <Label>{field.label}</Label>
            <p>Unsupported field type: {fieldType}</p>
          </div>
        );
    }
  };

  return (
    <div className="p-4 border rounded-md bg-card">
      {renderFieldByType()}
    </div>
  );
};

export default FormFieldRenderer;