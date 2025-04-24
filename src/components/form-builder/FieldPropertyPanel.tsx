import { useState } from 'react';
import { FormField, FieldOption, FormField as FormFieldType, Condition, ConditionalOperator, FieldType } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlusCircle, Trash, Settings, Code, HelpCircle, SlidersHorizontal, Grip } from 'lucide-react';
import { generateId } from '@/lib/utils';
import { getFormFieldPreview } from './field-previews';
import { Card } from '@/components/ui/card';

interface FieldPropertyPanelProps {
  field: FormFieldType;
  onUpdateField: (field: Partial<FormFieldType>) => void;
  onRemoveField: () => void;
  formFields: FormFieldType[];
}

const FieldPropertyPanel = ({ 
  field, 
  onUpdateField, 
  onRemoveField,
  formFields 
}: FieldPropertyPanelProps) => {
  const [showSubFieldPanel, setShowSubFieldPanel] = useState(false);
  const [selectedSubField, setSelectedSubField] = useState<string | null>(null);

  const addSubField = (type: FieldType) => {
    const newSubField: FormField = {
      id: generateId(),
      type,
      label: `Sub Field ${(field.subFields?.length || 0) + 1}`,
      required: false,
      options: type === 'select' || type === 'radio' || type === 'checkbox' ? [
        { id: generateId(), value: 'option1', label: 'Option 1' },
        { id: generateId(), value: 'option2', label: 'Option 2' }
      ] : [],
    };

    onUpdateField({
      subFields: [...(field.subFields || []), newSubField]
    });
  };

  const updateSubField = (id: string, updates: Partial<FormField>) => {
    onUpdateField({
      subFields: field.subFields?.map(subField => 
        subField.id === id ? { ...subField, ...updates } : subField
      )
    });
  };

  const removeSubField = (id: string) => {
    onUpdateField({
      subFields: field.subFields?.filter(subField => subField.id !== id)
    });
    if (selectedSubField === id) {
      setSelectedSubField(null);
    }
  };

  const basicFieldTypes: FieldType[] = ['text', 'textarea', 'number', 'email', 'select', 'radio', 'checkbox'];

  return (
    <ScrollArea className="h-[calc(100vh-12rem)] pr-4 -mr-4">
      <div className="space-y-4 pb-4">
        {/* Basic Properties */}
        <div>
          <div className="space-y-3">
            <div>
              <Label htmlFor="field-label">Question Text</Label>
              <Input
                id="field-label"
                value={field.label}
                onChange={(e) => onUpdateField({ label: e.target.value })}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="field-helpText">Help Text</Label>
              <Textarea
                id="field-helpText"
                value={field.helpText || ''}
                onChange={(e) => onUpdateField({ helpText: e.target.value })}
                className="mt-1 resize-none"
                placeholder="Add help text for respondents"
                rows={2}
              />
            </div>
            
            {['text', 'textarea', 'email', 'number', 'select'].includes(field.type) && (
              <div>
                <Label htmlFor="field-placeholder">Placeholder</Label>
                <Input
                  id="field-placeholder"
                  value={field.placeholder || ''}
                  onChange={(e) => onUpdateField({ placeholder: e.target.value })}
                  className="mt-1"
                  placeholder="Enter a placeholder text"
                />
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Label htmlFor="field-required">Required</Label>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </div>
              <Switch
                id="field-required"
                checked={field.required}
                onCheckedChange={(checked) => onUpdateField({ required: checked })}
              />
            </div>
          </div>
        </div>
        
        <Separator className="bg-border/40" />
        
        {/* Sub Fields for Repeatable Section */}
        {field.type === 'repeatable' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Min Entries</Label>
                <Input
                  type="number"
                  min={0}
                  value={field.validations?.min || 0}
                  onChange={(e) => onUpdateField({
                    validations: {
                      ...field.validations,
                      min: parseInt(e.target.value) || 0
                    }
                  })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Max Entries</Label>
                <Input
                  type="number"
                  min={0}
                  value={field.validations?.max || 0}
                  onChange={(e) => onUpdateField({
                    validations: {
                      ...field.validations,
                      max: parseInt(e.target.value) || 0
                    }
                  })}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label>Sub Fields</Label>
              <Select
                value={showSubFieldPanel ? "add" : ""}
                onValueChange={(value) => {
                  if (value !== "add") {
                    addSubField(value as FieldType);
                  }
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Add Sub Field" />
                </SelectTrigger>
                <SelectContent>
                  {basicFieldTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      Add {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              {field.subFields?.map((subField) => (
                <Card 
                  key={subField.id}
                  className={`p-4 ${selectedSubField === subField.id ? 'ring-2 ring-primary' : ''}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Grip className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{subField.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setSelectedSubField(
                          selectedSubField === subField.id ? null : subField.id
                        )}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => removeSubField(subField.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {selectedSubField === subField.id && (
                    <div className="space-y-4 mt-4 pt-4 border-t">
                      <div>
                        <Label>Label</Label>
                        <Input
                          value={subField.label}
                          onChange={(e) => updateSubField(subField.id, { 
                            label: e.target.value 
                          })}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label>Help Text</Label>
                        <Textarea
                          value={subField.helpText || ''}
                          onChange={(e) => updateSubField(subField.id, { 
                            helpText: e.target.value 
                          })}
                          className="mt-1"
                          rows={2}
                        />
                      </div>

                      {['text', 'textarea', 'email', 'number', 'select'].includes(subField.type) && (
                        <div>
                          <Label>Placeholder</Label>
                          <Input
                            value={subField.placeholder || ''}
                            onChange={(e) => updateSubField(subField.id, { 
                              placeholder: e.target.value 
                            })}
                            className="mt-1"
                          />
                        </div>
                      )}

                      {['select', 'radio', 'checkbox'].includes(subField.type) && (
                        <OptionsList
                          options={subField.options || []}
                          onChange={(options) => updateSubField(subField.id, { options })}
                        />
                      )}

                      <div className="flex items-center justify-between">
                        <Label>Required</Label>
                        <Switch
                          checked={subField.required}
                          onCheckedChange={(checked) => updateSubField(subField.id, { 
                            required: checked 
                          })}
                        />
                      </div>
                    </div>
                  )}

                  <div className="mt-4">
                    {getFormFieldPreview(subField)}
                  </div>
                </Card>
              ))}

              {(!field.subFields || field.subFields.length === 0) && (
                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                  <p className="text-sm text-muted-foreground">No sub-fields added yet</p>
                  <Button
                    variant="outline"
                    onClick={() => addSubField('text')}
                    className="mt-2"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Text Field
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Choice Options */}
        {['select', 'multiSelect', 'checkbox', 'radio'].includes(field.type) && (
          <OptionsList
            options={field.options || []}
            onChange={(options) => onUpdateField({ options })}
          />
        )}
        
        {/* Matrix Options */}
        {field.type === 'matrix' && (
          <MatrixOptionsList
            options={field.options || []}
            onChange={(options) => onUpdateField({ options })}
          />
        )}
        
        {/* Advanced Settings */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="validations">
            <AccordionTrigger className="py-2">
              <div className="flex items-center">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                <span>Validations</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ValidationSettings 
                field={field} 
                onUpdateField={onUpdateField} 
              />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="conditions">
            <AccordionTrigger className="py-2">
              <div className="flex items-center">
                <Code className="h-4 w-4 mr-2" />
                <span>Conditions</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ConditionSettings 
                field={field} 
                formFields={formFields.filter(f => f.id !== field.id)} 
                onUpdateField={onUpdateField} 
              />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="advanced">
            <AccordionTrigger className="py-2">
              <div className="flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                <span>Advanced</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="w-full"
                  onClick={onRemoveField}
                >
                  <Trash className="h-4 w-4 mr-2" /> 
                  Remove Question
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </ScrollArea>
  );
};

interface OptionsListProps {
  options: FieldOption[];
  onChange: (options: FieldOption[]) => void;
}

const OptionsList = ({ options, onChange }: OptionsListProps) => {
  const addOption = () => {
    const newOption: FieldOption = {
      id: generateId(),
      value: `option${options.length + 1}`,
      label: `Option ${options.length + 1}`,
    };
    onChange([...options, newOption]);
  };

  const updateOption = (id: string, updates: Partial<FieldOption>) => {
    onChange(
      options.map((opt) => (opt.id === id ? { ...opt, ...updates } : opt))
    );
  };

  const removeOption = (id: string) => {
    onChange(options.filter((opt) => opt.id !== id));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Options</Label>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={addOption}
          className="h-7 text-xs"
        >
          <PlusCircle className="h-3 w-3 mr-1" /> Add
        </Button>
      </div>
      
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.id} className="flex items-center gap-2">
            <Input
              value={option.label}
              onChange={(e) => updateOption(option.id, { label: e.target.value, value: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
              placeholder="Option label"
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeOption(option.id)}
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

const MatrixOptionsList = ({ options, onChange }: OptionsListProps) => {
  const rows = options.filter(opt => !opt.isColumn);
  const columns = options.filter(opt => opt.isColumn);

  const addRow = () => {
    const newRow: FieldOption = {
      id: generateId(),
      value: `row${rows.length + 1}`,
      label: `Row ${rows.length + 1}`,
      isColumn: false,
    };
    onChange([...options, newRow]);
  };

  const addColumn = () => {
    const newColumn: FieldOption = {
      id: generateId(),
      value: `column${columns.length + 1}`,
      label: `Column ${columns.length + 1}`,
      isColumn: true,
    };
    onChange([...options, newColumn]);
  };

  const updateOption = (id: string, updates: Partial<FieldOption>) => {
    onChange(
      options.map((opt) => (opt.id === id ? { ...opt, ...updates } : opt))
    );
  };

  const removeOption = (id: string) => {
    onChange(options.filter((opt) => opt.id !== id));
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Rows</Label>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={addRow}
            className="h-7 text-xs"
          >
            <PlusCircle className="h-3 w-3 mr-1" /> Add Row
          </Button>
        </div>
        
        <div className="space-y-2">
          {rows.map((row) => (
            <div key={row.id} className="flex items-center gap-2">
              <Input
                value={row.label}
                onChange={(e) => updateOption(row.id, { label: e.target.value, value: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                placeholder="Row label"
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeOption(row.id)}
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
      
      <Separator className="bg-border/40" />
      
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Columns</Label>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={addColumn}
            className="h-7 text-xs"
          >
            <PlusCircle className="h-3 w-3 mr-1" /> Add Column
          </Button>
        </div>
        
        <div className="space-y-2">
          {columns.map((column) => (
            <div key={column.id} className="flex items-center gap-2">
              <Input
                value={column.label}
                onChange={(e) => updateOption(column.id, { label: e.target.value, value: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                placeholder="Column label"
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeOption(column.id)}
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface ValidationSettingsProps {
  field: FormFieldType;
  onUpdateField: (field: Partial<FormFieldType>) => void;
}

const ValidationSettings = ({ field, onUpdateField }: ValidationSettingsProps) => {
  const validations = field.validations || {};
  
  const updateValidation = (key: keyof typeof validations, value: any) => {
    onUpdateField({
      validations: {
        ...validations,
        [key]: value,
      },
    });
  };

  const renderValidationFields = () => {
    switch (field.type) {
      case 'text':
      case 'textarea':
      case 'email':
        return (
          <>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Min Length</Label>
                <Input
                  type="number"
                  value={validations.minLength || ''}
                  onChange={(e) => updateValidation('minLength', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="mt-1"
                  min={0}
                />
              </div>
              <div>
                <Label>Max Length</Label>
                <Input
                  type="number"
                  value={validations.maxLength || ''}
                  onChange={(e) => updateValidation('maxLength', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="mt-1"
                  min={0}
                />
              </div>
            </div>
            {field.type === 'text' && (
              <div>
                <Label>Pattern (RegEx)</Label>
                <Input
                  value={validations.pattern || ''}
                  onChange={(e) => updateValidation('pattern', e.target.value)}
                  className="mt-1"
                  placeholder="e.g. ^[A-Za-z0-9]+$"
                />
              </div>
            )}
          </>
        );
      
      case 'number':
        return (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Min Value</Label>
              <Input
                type="number"
                value={validations.min || ''}
                onChange={(e) => updateValidation('min', e.target.value ? parseInt(e.target.value) : undefined)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Max Value</Label>
              <Input
                type="number"
                value={validations.max || ''}
                onChange={(e) => updateValidation('max', e.target.value ? parseInt(e.target.value) : undefined)}
                className="mt-1"
              />
            </div>
          </div>
        );
      
      case 'checkbox':
      case 'multiSelect':
        return (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Min Selections</Label>
              <Input
                type="number"
                value={validations.min || ''}
                onChange={(e) => updateValidation('min', e.target.value ? parseInt(e.target.value) : undefined)}
                className="mt-1"
                min={0}
              />
            </div>
            <div>
              <Label>Max Selections</Label>
              <Input
                type="number"
                value={validations.max || ''}
                onChange={(e) => updateValidation('max', e.target.value ? parseInt(e.target.value) : undefined)}
                className="mt-1"
                min={0}
              />
            </div>
          </div>
        );
      
      case 'file':
        return (
          <>
            <div>
              <Label>Allowed File Types</Label>
              <Input
                value={validations.allowedFileTypes?.join(', ') || ''}
                onChange={(e) => updateValidation('allowedFileTypes', e.target.value ? e.target.value.split(',').map(t => t.trim()) : undefined)}
                className="mt-1"
                placeholder="e.g. .pdf, .jpg, .png"
              />
            </div>
            <div className="mt-2">
              <Label>Max File Size (KB)</Label>
              <Input
                type="number"
                value={validations.maxFileSize || ''}
                onChange={(e) => updateValidation('maxFileSize', e.target.value ? parseInt(e.target.value) : undefined)}
                className="mt-1"
                min={0}
              />
            </div>
          </>
        );
      
      default:
        return <p className="text-sm text-muted-foreground">No validation options for this field type.</p>;
    }
  };

  return (
    <div className="space-y-3">
      {renderValidationFields()}
      
      <div className="mt-4">
        <Label>Custom Error Message</Label>
        <Input
          value={validations.customMessage || ''}
          onChange={(e) => updateValidation('customMessage', e.target.value)}
          className="mt-1"
          placeholder="Custom error message"
        />
      </div>
    </div>
  );
};

interface ConditionSettingsProps {
  field: FormFieldType;
  formFields: FormFieldType[];
  onUpdateField: (field: Partial<FormFieldType>) => void;
}

const ConditionSettings = ({ field, formFields, onUpdateField }: ConditionSettingsProps) => {
  const conditions = field.conditions || [];
  
  const addCondition = () => {
    if (formFields.length === 0) return;
    
    const newCondition: Condition = {
      sourceFieldId: formFields[0].id,
      operator: 'equals',
      value: '',
    };
    
    onUpdateField({
      conditions: [...conditions, newCondition],
    });
  };
  
  const updateCondition = (index: number, updates: Partial<Condition>) => {
    const updatedConditions = [...conditions];
    updatedConditions[index] = { ...updatedConditions[index], ...updates };
    onUpdateField({ conditions: updatedConditions });
  };
  
  const removeCondition = (index: number) => {
    const updatedConditions = [...conditions];
    updatedConditions.splice(index, 1);
    onUpdateField({ conditions: updatedConditions });
  };
  
  const renderOperatorOptions = (sourceFieldType: string) => {
    const operatorMap: Record<string, ConditionalOperator[]> = {
      text: ['equals', 'notEquals', 'contains', 'notContains', 'isEmpty', 'isNotEmpty'],
      textarea: ['equals', 'notEquals', 'contains', 'notContains', 'isEmpty', 'isNotEmpty'],
      number: ['equals', 'notEquals', 'greaterThan', 'lessThan', 'isEmpty', 'isNotEmpty'],
      email: ['equals', 'notEquals', 'contains', 'notContains', 'isEmpty', 'isNotEmpty'],
      select: ['equals', 'notEquals', 'isEmpty', 'isNotEmpty'],
      multiSelect: ['contains', 'notContains', 'isEmpty', 'isNotEmpty'],
      checkbox: ['contains', 'notContains', 'isEmpty', 'isNotEmpty'],
      radio: ['equals', 'notEquals', 'isEmpty', 'isNotEmpty'],
      date: ['equals', 'notEquals', 'isEmpty', 'isNotEmpty'],
      file: ['isEmpty', 'isNotEmpty'],
      rating: ['equals', 'notEquals', 'greaterThan', 'lessThan'],
      matrix: ['isEmpty', 'isNotEmpty'],
      repeatable: ['isEmpty', 'isNotEmpty'],
    };
    
    return operatorMap[sourceFieldType] || ['equals', 'notEquals'];
  };
  
  const operatorLabels: Record<ConditionalOperator, string> = {
    equals: 'Equals',
    notEquals: 'Does not equal',
    contains: 'Contains',
    notContains: 'Does not contain',
    greaterThan: 'Greater than',
    lessThan: 'Less than',
    isEmpty: 'Is empty',
    isNotEmpty: 'Is not empty',
  };
  
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground mb-2">
        Add conditions to control when this question appears.
      </p>
      
      {formFields.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">
          Add other questions to create conditions.
        </p>
      ) : (
        <>
          {conditions.length === 0 ? (
            <p className="text-sm text-muted-foreground italic mb-2">
              No conditions added yet. This question will always be visible.
            </p>
          ) : (
            <div className="space-y-3 mb-3">
              {conditions.map((condition, index) => {
                const sourceField = formFields.find(f => f.id === condition.sourceFieldId);
                const sourceFieldType = sourceField?.type || 'text';
                const operators = renderOperatorOptions(sourceFieldType);
                
                return (
                  <div key={index} className="space-y-2 p-2 border rounded-md bg-muted/30">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium">Condition {index + 1}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCondition(index)}
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <div>
                      <Label className="text-xs">If Question</Label>
                      <Select
                        value={condition.sourceFieldId}
                        onValueChange={(value) => updateCondition(index, { sourceFieldId: value })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select a question" />
                        </SelectTrigger>
                        <SelectContent>
                          {formFields.map((field) => (
                            <SelectItem key={field.id} value={field.id}>
                              {field.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="text-xs">Operator</Label>
                      <Select
                        value={condition.operator}
                        onValueChange={(value) => updateCondition(index, { operator: value as ConditionalOperator })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select an operator" />
                        </SelectTrigger>
                        <SelectContent>
                          {operators.map((op) => (
                            <SelectItem key={op} value={op}>
                              {operatorLabels[op]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {!['isEmpty', 'isNotEmpty'].includes(condition.operator) && (
                      <div>
                        <Label className="text-xs">Value</Label>
                        <Input
                          value={condition.value || ''}
                          onChange={(e) => updateCondition(index, { value: e.target.value })}
                          className="mt-1"
                          placeholder="Enter value"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={addCondition}
            className="w-full text-xs"
          >
            <PlusCircle className="h-3 w-3 mr-1" /> Add Condition
          </Button>
        </>
      )}
    </div>
  );
};

export default FieldPropertyPanel;