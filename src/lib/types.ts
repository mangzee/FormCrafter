export type FieldType = 
  | 'text'
  | 'textarea'
  | 'number'
  | 'email'
  | 'select'
  | 'multiSelect'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'file'
  | 'image'
  | 'attachment'
  | 'rating'
  | 'matrix'
  | 'repeatable';

// Field validation options
export interface FieldValidation {
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  customMessage?: string;
  allowedFileTypes?: string[];
  maxFileSize?: number;
  maxFiles?: number;
}

// Field options (for multiple choice fields)
export interface FieldOption {
  id: string;
  value: string;
  label: string;
  isColumn?: boolean; // For matrix questions
}

// Conditional logic operators
export type ConditionalOperator = 
  | 'equals' 
  | 'notEquals' 
  | 'contains' 
  | 'notContains'
  | 'greaterThan'
  | 'lessThan'
  | 'isEmpty'
  | 'isNotEmpty';

// Condition for conditional display/logic
export interface Condition {
  sourceFieldId: string;
  operator: ConditionalOperator;
  value: any;
}

// Form field
export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  placeholder?: string;
  helpText?: string;
  options?: FieldOption[];  
  validations?: FieldValidation;
  conditions?: Condition[];
  subFields?: FormField[]; // For repeatable sections
}

// Form schema
export interface FormSchema {
  title: string;
  description: string;
  fields: FormField[];
  settings: {
    showProgressBar: boolean;
    showPageTitles: boolean;
    confirmationMessage: string;
  };
}