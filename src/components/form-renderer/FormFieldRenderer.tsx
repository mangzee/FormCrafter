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
import { PlusCircle, Trash, Image as ImageIcon, Paperclip, X } from 'lucide-react';
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
      case 'image':
      case 'attachment':
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
                  <div className="space-y-4">
                    <div className="border-2 border-dashed rounded-md p-6 text-center">
                      {fieldType === 'image' && (
                        <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground/60" />
                      )}
                      {fieldType === 'attachment' && (
                        <Paperclip className="h-8 w-8 mx-auto mb-2 text-muted-foreground/60" />
                      )}
                      <Input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          const files = e.target.files;
                          if (fieldType === 'attachment') {
                            formField.onChange(Array.from(files || []));
                          } else {
                            const file = files?.[0] || null;
                            formField.onChange(file);
                            
                            // Create preview URL for images
                            if (file && fieldType === 'image') {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                if (typeof reader.result === 'string') {
                                  formField.onChange({ file, preview: reader.result });
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }
                        }}
                        multiple={fieldType === 'attachment'}
                        accept={fieldType === 'image' ? 'image/*' : undefined}
                        id={`file-upload-${field.id}`}
                      />
                      <label
                        htmlFor={`file-upload-${field.id}`}
                        className="cursor-pointer"
                      >
                        <div className="text-sm">
                          {fieldType === 'image' ? (
                            <>Drop image here or click to upload</>
                          ) : fieldType === 'attachment' ? (
                            <>Drop files here or click to upload</>
                          ) : (
                            <>Drop file here or click to upload</>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {fieldType === 'image' ? (
                            <>Supported formats: JPG, PNG, GIF</>
                          ) : (
                            <>Maximum file size: {field.validations?.maxFileSize || '5MB'}</>
                          )}
                        </div>
                      </label>
                    </div>

                    {/* Preview section */}
                    {formField.value && (
                      <div className="space-y-2">
                        {fieldType === 'image' && formField.value.preview && (
                          <div className="relative w-40 h-40 mx-auto">
                            <img
                              src={formField.value.preview}
                              alt="Preview"
                              className="w-full h-full object-cover rounded-md"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute -top-2 -right-2 h-6 w-6"
                              onClick={() => formField.onChange(null)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                        
                        {fieldType === 'attachment' && Array.isArray(formField.value) && (
                          <div className="space-y-2">
                            {formField.value.map((file: File, index: number) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-2 bg-muted rounded-md"
                              >
                                <div className="flex items-center space-x-2">
                                  <Paperclip className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm truncate max-w-[200px]">
                                    {file.name}
                                  </span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-destructive"
                                  onClick={() => {
                                    const newFiles = [...formField.value];
                                    newFiles.splice(index, 1);
                                    formField.onChange(newFiles);
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {fieldType === 'file' && formField.value && (
                          <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                            <div className="flex items-center space-x-2">
                              <Paperclip className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm truncate max-w-[200px]">
                                {formField.value.name}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-destructive"
                              onClick={() => formField.onChange(null)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
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