import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FormBuilder from '@/components/form-builder/FormBuilder';
import FormRenderer from '@/components/form-renderer/FormRenderer';
import { useFormBuilder } from '@/hooks/useFormBuilder';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Eye, PenSquare } from 'lucide-react';
import { toast } from 'sonner';

const FormBuilderDemo = () => {
  const { formSchema, resetFormBuilder } = useFormBuilder();
  const [activeTab, setActiveTab] = useState('build');
  const [formResponses, setFormResponses] = useState<Record<string, any>>({});

  const handleSubmit = (data: Record<string, any>) => {
    setFormResponses(data);
    console.log('Form submitted:', data);
    toast.success('Form submitted successfully!');
    setActiveTab('results');
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(formSchema, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'form-schema.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    toast.success('Form schema exported successfully!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">FormCrafter</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExport}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Schema
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="build" className="flex items-center gap-2">
            <PenSquare className="h-4 w-4" />
            Builder
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="build" className="mt-0">
          <FormBuilder />
        </TabsContent>

        <TabsContent value="preview" className="mt-0">
          <div className="max-w-3xl mx-auto bg-card rounded-lg shadow-sm p-8">
            {formSchema.fields.length > 0 ? (
              <FormRenderer 
                schema={formSchema} 
                onSubmit={handleSubmit} 
              />
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium text-muted-foreground">No form fields added yet</h3>
                <p className="mt-2 text-muted-foreground">Go to the Builder tab to create your form.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="results" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Form Responses</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(formResponses).length > 0 ? (
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  {JSON.stringify(formResponses, null, 2)}
                </pre>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium text-muted-foreground">No responses yet</h3>
                  <p className="mt-2 text-muted-foreground">Preview and submit the form to see responses here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FormBuilderDemo;