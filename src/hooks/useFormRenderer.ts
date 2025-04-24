import { useState, useEffect } from 'react';
import { FormSchema, FormField, ConditionalOperator } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { generateValidationSchema } from '@/lib/validation';

export const useFormRenderer = (schema: FormSchema) => {
  const [visibleFields, setVisibleFields] = useState<string[]>([]);
  const [currentValues, setCurrentValues] = useState<Record<string, any>>({});

  // Generate validation schema from form schema
  const validationSchema = generateValidationSchema(schema);

  // Initialize form
  const form = useForm<Record<string, any>>({
    resolver: zodResolver(validationSchema),
    defaultValues: schema.fields.reduce((acc, field) => {
      acc[field.id] = getDefaultValue(field);
      return acc;
    }, {} as Record<string, any>),
  });

  // Update visible fields whenever values change
  useEffect(() => {
    const subscription = form.watch((values) => {
      if (values) {
        setCurrentValues(values as Record<string, any>);
        updateVisibleFields(schema.fields, values as Record<string, any>);
      }
    });

    // Initialize visible fields
    updateVisibleFields(schema.fields, form.getValues());

    return () => subscription.unsubscribe();
  }, [form, schema.fields]);

  // Update visible fields based on conditions
  const updateVisibleFields = (fields: FormField[], values: Record<string, any>) => {
    const visibleFieldIds = fields.filter(field => {
      // If there are no conditions, field is always visible
      if (!field.conditions || field.conditions.length === 0) return true;

      // Check if all conditions are met
      return field.conditions.every(condition => {
        const sourceField = fields.find(f => f.id === condition.sourceFieldId);
        if (!sourceField) return false;

        const sourceValue = values[condition.sourceFieldId];
        return evaluateCondition(sourceValue, condition.operator, condition.value);
      });
    }).map(field => field.id);

    setVisibleFields(visibleFieldIds);
  };

  // Evaluate a single condition
  const evaluateCondition = (
    sourceValue: any, 
    operator: ConditionalOperator, 
    targetValue: any
  ): boolean => {
    switch (operator) {
      case 'equals':
        return sourceValue === targetValue;
      case 'notEquals':
        return sourceValue !== targetValue;
      case 'contains':
        return Array.isArray(sourceValue) 
          ? sourceValue.includes(targetValue)
          : String(sourceValue).includes(String(targetValue));
      case 'notContains':
        return Array.isArray(sourceValue)
          ? !sourceValue.includes(targetValue)
          : !String(sourceValue).includes(String(targetValue));
      case 'greaterThan':
        return Number(sourceValue) > Number(targetValue);
      case 'lessThan':
        return Number(sourceValue) < Number(targetValue);
      case 'isEmpty':
        return sourceValue === undefined || sourceValue === null || sourceValue === '' || 
               (Array.isArray(sourceValue) && sourceValue.length === 0);
      case 'isNotEmpty':
        return !(sourceValue === undefined || sourceValue === null || sourceValue === '' || 
                (Array.isArray(sourceValue) && sourceValue.length === 0));
      default:
        return false;
    }
  };

  // Check if a field should be visible
  const isFieldVisible = (fieldId: string): boolean => {
    return visibleFields.includes(fieldId);
  };

  return {
    form,
    isFieldVisible,
    currentValues,
  };
};

// Helper to get default values for each field type
function getDefaultValue(field: FormField): any {
  switch (field.type) {
    case 'text':
    case 'textarea':
    case 'email':
    case 'date':
      return '';
    case 'number':
      return null;
    case 'select':
      return '';
    case 'multiSelect':
    case 'checkbox':
      return [];
    case 'radio':
      return '';
    case 'file':
      return null;
    case 'rating':
      return 0;
    case 'matrix':
      return {};
    case 'repeatable':
      return [];
    default:
      return null;
  }
}