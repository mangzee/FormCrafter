import { z } from 'zod';
import { FormSchema, FormField } from './types';

export const generateValidationSchema = (schema: FormSchema): z.ZodObject<any> => {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of schema.fields) {
    shape[field.id] = createFieldValidation(field);
  }

  return z.object(shape);
};

const createFieldValidation = (field: FormField): z.ZodTypeAny => {
  const { required, validations = {}, type } = field;
  
  let baseSchema: z.ZodTypeAny;
  
  switch (type) {
    case 'text':
    case 'textarea': {
      let schema = z.string();
      if (validations.minLength !== undefined) {
        schema = schema.min(validations.minLength, validations.customMessage || `Must be at least ${validations.minLength} characters`);
      }
      if (validations.maxLength !== undefined) {
        schema = schema.max(validations.maxLength, validations.customMessage || `Must be at most ${validations.maxLength} characters`);
      }
      if (validations.pattern) {
        schema = schema.regex(new RegExp(validations.pattern), validations.customMessage || 'Invalid format');
      }
      baseSchema = schema;
      break;
    }
    case 'email':
      baseSchema = z.string().email(validations.customMessage || 'Invalid email address');
      break;
    case 'number': {
      let schema = z.coerce.number();
      if (validations.min !== undefined) {
        schema = schema.gte(validations.min, validations.customMessage || `Must be at least ${validations.min}`);
      }
      if (validations.max !== undefined) {
        schema = schema.lte(validations.max, validations.customMessage || `Must be at most ${validations.max}`);
      }
      baseSchema = schema;
      break;
    }
    case 'select':
    case 'radio':
      baseSchema = z.string();
      break;
    case 'multiSelect':
    case 'checkbox': {
      let schema = z.array(z.string());
      if (validations.min !== undefined) {
        schema = schema.min(validations.min, validations.customMessage || `Please select at least ${validations.min} options`);
      }
      if (validations.max !== undefined) {
        schema = schema.max(validations.max, validations.customMessage || `Please select at most ${validations.max} options`);
      }
      baseSchema = schema;
      break;
    }
    case 'date':
      baseSchema = z.string().or(z.date());
      break;
    case 'file':
      baseSchema = z.any();
      break;
    case 'rating':
      baseSchema = z.number();
      break;
    case 'matrix':
      baseSchema = z.record(z.string());
      break;
    case 'repeatable':
      return z.array(z.any());
    default:
      baseSchema = z.any();
  }

  // Make optional if not required
  if (!required) {
    if (type === 'number') {
      baseSchema = baseSchema.nullable().optional();
    } else if (['multiSelect', 'checkbox'].includes(type)) {
      baseSchema = baseSchema.optional().default([]);
    } else if (type === 'matrix') {
      baseSchema = baseSchema.optional().default({});
    } else {
      baseSchema = baseSchema.optional();
    }
  }

  return baseSchema;
};