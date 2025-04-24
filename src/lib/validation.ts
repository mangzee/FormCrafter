import { z } from 'zod';
import { FormSchema, FormField, FieldValidation } from './types';

export const generateValidationSchema = (schema: FormSchema): z.ZodObject<any> => {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of schema.fields) {
    shape[field.id] = createFieldValidation(field);
  }

  return z.object(shape);
};

const createFieldValidation = (field: FormField): z.ZodTypeAny => {
  const { required, validations = {}, type } = field;
  
  // Start with base schema based on field type
  let baseSchema: z.ZodTypeAny;
  
  switch (type) {
    case 'text':
    case 'textarea':
      baseSchema = z.string();
      break;
    case 'email':
      baseSchema = z.string().email(validations.customMessage || 'Invalid email address');
      break;
    case 'number':
      baseSchema = z.number().or(z.string().transform(val => {
        const parsed = parseFloat(val);
        if (isNaN(parsed)) return undefined;
        return parsed;
      }));
      break;
    case 'select':
    case 'radio':
      baseSchema = z.string();
      break;
    case 'multiSelect':
    case 'checkbox':
      baseSchema = z.array(z.string());
      break;
    case 'date':
      baseSchema = z.string().or(z.date());
      break;
    case 'file':
      baseSchema = z.any(); // File validations handled separately
      break;
    case 'rating':
      baseSchema = z.number();
      break;
    case 'matrix':
      baseSchema = z.record(z.string()); // Matrix is a record of row id to selected value
      break;
    case 'repeatable':
      // Repeatable should be an array of objects
      return z.array(z.any());
    default:
      baseSchema = z.any();
  }

  // Apply common validations
  let schema = applyCommonValidations(baseSchema, validations, type);
  
  // Make optional if not required
  if (!required) {
    if (type === 'number') {
      schema = schema.nullable().optional();
    } else if (['multiSelect', 'checkbox'].includes(type)) {
      schema = schema.optional().default([]);
    } else if (type === 'matrix') {
      schema = schema.optional().default({});
    } else {
      schema = schema.optional();
    }
  }

  return schema;
};

const applyCommonValidations = (
  schema: z.ZodTypeAny, 
  validations: FieldValidation,
  type: string
): z.ZodTypeAny => {
  let result = schema;

  if (type === 'text' || type === 'textarea' || type === 'email') {
    if (validations.minLength !== undefined) {
      result = result.min(
        validations.minLength,
        validations.customMessage || `Must be at least ${validations.minLength} characters`
      );
    }
    
    if (validations.maxLength !== undefined) {
      result = result.max(
        validations.maxLength,
        validations.customMessage || `Must be at most ${validations.maxLength} characters`
      );
    }
    
    if (validations.pattern) {
      result = result.regex(
        new RegExp(validations.pattern),
        validations.customMessage || 'Invalid format'
      );
    }
  }
  
  if (type === 'number') {
    if (validations.min !== undefined) {
      result = result.min(
        validations.min,
        validations.customMessage || `Must be at least ${validations.min}`
      );
    }
    
    if (validations.max !== undefined) {
      result = result.max(
        validations.max,
        validations.customMessage || `Must be at most ${validations.max}`
      );
    }
  }
  
  if (['multiSelect', 'checkbox'].includes(type)) {
    if (validations.min !== undefined) {
      result = result.min(
        validations.min,
        validations.customMessage || `Please select at least ${validations.min} options`
      );
    }
    
    if (validations.max !== undefined) {
      result = result.max(
        validations.max,
        validations.customMessage || `Please select at most ${validations.max} options`
      );
    }
  }

  return result;
};