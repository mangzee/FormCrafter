import { createContext, useContext, useReducer, ReactNode } from 'react';
import { FormSchema, FormField, FieldType } from '@/lib/types';

// Initial state
const initialFormSchema: FormSchema = {
  title: 'Untitled Form',
  description: 'Form description',
  fields: [],
  settings: {
    showProgressBar: true,
    showPageTitles: true,
    confirmationMessage: 'Thank you for your submission!',
  }
};

// Action types
type FormBuilderAction =
  | { type: 'SET_FORM_TITLE'; payload: string }
  | { type: 'SET_FORM_DESCRIPTION'; payload: string }
  | { type: 'ADD_FIELD'; payload: FormField }
  | { type: 'UPDATE_FIELD'; payload: { id: string; field: Partial<FormField> } }
  | { type: 'REMOVE_FIELD'; payload: string }
  | { type: 'REORDER_FIELDS'; payload: FormField[] }
  | { type: 'UPDATE_FORM_SETTINGS'; payload: Partial<FormSchema['settings']> }
  | { type: 'RESET_FORM' }
  | { type: 'IMPORT_FORM'; payload: FormSchema };

// Reducer
const formBuilderReducer = (state: FormSchema, action: FormBuilderAction): FormSchema => {
  switch (action.type) {
    case 'SET_FORM_TITLE':
      return { ...state, title: action.payload };
    case 'SET_FORM_DESCRIPTION':
      return { ...state, description: action.payload };
    case 'ADD_FIELD':
      return {
        ...state,
        fields: [...state.fields, action.payload]
      };
    case 'UPDATE_FIELD':
      return {
        ...state,
        fields: state.fields.map(field => 
          field.id === action.payload.id 
            ? { ...field, ...action.payload.field } 
            : field
        )
      };
    case 'REMOVE_FIELD':
      return {
        ...state,
        fields: state.fields.filter(field => field.id !== action.payload)
      };
    case 'REORDER_FIELDS':
      return {
        ...state,
        fields: action.payload
      };
    case 'UPDATE_FORM_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
    case 'RESET_FORM':
      return initialFormSchema;
    case 'IMPORT_FORM':
      return action.payload;
    default:
      return state;
  }
};

// Context
type FormBuilderContextType = {
  formSchema: FormSchema;
  dispatch: React.Dispatch<FormBuilderAction>;
};

const FormBuilderContext = createContext<FormBuilderContextType | undefined>(undefined);

// Provider
export const FormBuilderProvider = ({ children }: { children: ReactNode }) => {
  const [formSchema, dispatch] = useReducer(formBuilderReducer, initialFormSchema);

  return (
    <FormBuilderContext.Provider value={{ formSchema, dispatch }}>
      {children}
    </FormBuilderContext.Provider>
  );
};

// Hook
export const useFormBuilderContext = () => {
  const context = useContext(FormBuilderContext);
  if (context === undefined) {
    throw new Error('useFormBuilderContext must be used within a FormBuilderProvider');
  }
  return context;
};