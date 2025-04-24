import { useState } from 'react';
import { FormSchema, FormField } from '@/lib/types';
import { useFormRenderer } from '@/hooks/useFormRenderer';
import { Button } from '@/components/ui/button';
import { FormProvider } from 'react-hook-form';
import FormFieldRenderer from './FormFieldRenderer';
import { Loader2, CheckCircle2 } from 'lucide-react';

interface FormRendererProps {
  schema: FormSchema;
  onSubmit: (data: Record<string, any>) => void;
}

const FormRenderer = ({ schema, onSubmit }: FormRendererProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { form, isFieldVisible } = useFormRenderer(schema);

  const handleSubmit = async (data: Record<string, any>) => {
    setIsSubmitting(true);
    
    try {
      // Process form data before submission
      const processedData = processFormData(data, schema.fields);
      
      // Submit the form data
      await onSubmit(processedData);
      
      // Mark as submitted
      setIsSubmitted(true);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-12">
        <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
        <h3 className="text-2xl font-semibold mb-2">{schema.settings.confirmationMessage}</h3>
        <p className="text-muted-foreground">Your response has been recorded.</p>
        <Button 
          className="mt-8" 
          onClick={() => {
            form.reset();
            setIsSubmitted(false);
          }}
        >
          Submit Another Response
        </Button>
      </div>
    );
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">{schema.title}</h1>
          {schema.description && (
            <p className="mt-2 text-muted-foreground">{schema.description}</p>
          )}
        </div>

        <div className="space-y-6">
          {schema.fields.map((field) => (
            isFieldVisible(field.id) && (
              <FormFieldRenderer 
                key={field.id} 
                field={field} 
                form={form} 
              />
            )
          ))}
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full sm:w-auto"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit
        </Button>
      </form>
    </FormProvider>
  );
};

// Helper function to process form data before submission
const processFormData = (data: Record<string, any>, fields: FormField[]): Record<string, any> => {
  const result: Record<string, any> = {};
  
  fields.forEach(field => {
    // Skip fields that weren't actually in the form (due to conditions)
    if (!(field.id in data)) return;
    
    // Add field label as a key in the result
    result[field.label] = data[field.id];
    
    // Special handling for file uploads
    if (field.type === 'file' && data[field.id]) {
      const fileData = data[field.id];
      if (fileData) {
        result[field.label] = {
          name: fileData.name,
          type: fileData.type,
          size: fileData.size,
        };
      }
    }
  });
  
  return result;
};

export default FormRenderer;