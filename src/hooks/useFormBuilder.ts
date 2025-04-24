import { useFormBuilderContext } from '@/contexts/FormBuilderContext';
import { FormField, FormSchema, FieldType, FieldOption } from '@/lib/types';
import { generateId } from '@/lib/utils';

export const useFormBuilder = () => {
  const { formSchema, dispatch } = useFormBuilderContext();

  const setFormTitle = (title: string) => {
    dispatch({ type: 'SET_FORM_TITLE', payload: title });
  };

  const setFormDescription = (description: string) => {
    dispatch({ type: 'SET_FORM_DESCRIPTION', payload: description });
  };

  const addField = (type: FieldType) => {
    const newField: FormField = {
      id: generateId(),
      type,
      label: getDefaultLabel(type),
      required: false,
      placeholder: type === 'file' ? '' : 'Enter your answer',
      helpText: '',
      options: getDefaultOptions(type),
      validations: {},
      conditions: [],
      subFields: type === 'repeatable' ? [] : undefined,
    };

    dispatch({ type: 'ADD_FIELD', payload: newField });
    return newField.id;
  };

  const updateField = (id: string, field: Partial<FormField>) => {
    dispatch({ type: 'UPDATE_FIELD', payload: { id, field } });
  };

  const removeField = (id: string) => {
    dispatch({ type: 'REMOVE_FIELD', payload: id });
  };

  const reorderFields = (fields: FormField[]) => {
    dispatch({ type: 'REORDER_FIELDS', payload: fields });
  };

  const updateFormSettings = (settings: Partial<FormSchema['settings']>) => {
    dispatch({ type: 'UPDATE_FORM_SETTINGS', payload: settings });
  };

  const resetFormBuilder = () => {
    dispatch({ type: 'RESET_FORM' });
  };

  const importFormSchema = (schema: FormSchema) => {
    dispatch({ type: 'IMPORT_FORM', payload: schema });
  };

  return {
    formSchema,
    setFormTitle,
    setFormDescription,
    addField,
    updateField,
    removeField,
    reorderFields,
    updateFormSettings,
    resetFormBuilder,
    importFormSchema,
  };
};

function getDefaultLabel(type: FieldType): string {
  switch (type) {
    case 'text':
      return 'Text Question';
    case 'textarea':
      return 'Long Answer Question';
    case 'number':
      return 'Number Question';
    case 'email':
      return 'Email Address';
    case 'select':
      return 'Dropdown Question';
    case 'multiSelect':
      return 'Multi-Select Question';
    case 'checkbox':
      return 'Checkbox Question';
    case 'radio':
      return 'Multiple Choice Question';
    case 'date':
      return 'Date Question';
    case 'file':
      return 'File Upload';
    case 'rating':
      return 'Rating Question';
    case 'matrix':
      return 'Matrix Question';
    case 'repeatable':
      return 'Repeatable Section';
    default:
      return 'New Question';
  }
}

function getDefaultOptions(type: FieldType): FieldOption[] {
  switch (type) {
    case 'select':
    case 'multiSelect':
    case 'checkbox':
    case 'radio':
      return [
        { id: generateId(), value: 'option1', label: 'Option 1' },
        { id: generateId(), value: 'option2', label: 'Option 2' },
        { id: generateId(), value: 'option3', label: 'Option 3' },
      ];
    case 'matrix':
      return [
        { id: generateId(), value: 'row1', label: 'Row 1' },
        { id: generateId(), value: 'row2', label: 'Row 2' },
        { id: generateId(), value: 'column1', label: 'Column 1', isColumn: true },
        { id: generateId(), value: 'column2', label: 'Column 2', isColumn: true },
        { id: generateId(), value: 'column3', label: 'Column 3', isColumn: true },
      ];
    default:
      return [];
  }
}