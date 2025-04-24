import { useState } from 'react';
import { useFormBuilder } from '@/hooks/useFormBuilder';
import { FormField, FieldType } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  PlusCircle, 
  Settings, 
  PenSquare, 
  LayoutList,
} from 'lucide-react';
import FormBuilderField from './FormBuilderField';
import FieldPropertyPanel from './FieldPropertyPanel';
import QuestionTypePanel from './QuestionTypePanel';
import FormSettings from './FormSettings';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

const FormBuilder = () => {
  const { 
    formSchema, 
    setFormTitle, 
    setFormDescription, 
    addField,
    updateField,
    removeField,
    reorderFields
  } = useFormBuilder();
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [activePanelTab, setActivePanelTab] = useState<string>('fields');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleFieldSelect = (id: string) => {
    setSelectedFieldId(id);
    setActivePanelTab('properties');
  };

  const handleFieldDeselect = () => {
    setSelectedFieldId(null);
    setActivePanelTab('fields');
  };

  const handleAddField = (type: FieldType) => {
    const newFieldId = addField(type);
    setSelectedFieldId(newFieldId);
    setActivePanelTab('properties');
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = formSchema.fields.findIndex((field) => field.id === active.id);
    const newIndex = formSchema.fields.findIndex((field) => field.id === over.id);
    
    if (oldIndex !== -1 && newIndex !== -1) {
      const newFields = arrayMove(formSchema.fields, oldIndex, newIndex);
      reorderFields(newFields);
    }
  };

  const selectedField = selectedFieldId 
    ? formSchema.fields.find(field => field.id === selectedFieldId)
    : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left Panel - Field Types or Properties */}
      <div className="md:col-span-1">
        <Card className="sticky top-6 border-none shadow-none bg-transparent">
          <CardHeader className="p-4 pb-0">
            <CardTitle className="text-base font-medium">
              {activePanelTab === 'fields' ? 'Question Types' : 
               activePanelTab === 'properties' ? 'Field Properties' : 'Form Settings'}
            </CardTitle>
          </CardHeader>
          
          <Tabs value={activePanelTab} onValueChange={setActivePanelTab}>
            <TabsList className="grid grid-cols-3 mx-4 mt-2 mb-0 bg-muted/50">
              <TabsTrigger value="fields" className="text-xs data-[state=active]:bg-background">
                <LayoutList className="h-4 w-4 mr-1" />
                Types
              </TabsTrigger>
              <TabsTrigger value="properties" disabled={!selectedFieldId} className="text-xs data-[state=active]:bg-background">
                <PenSquare className="h-4 w-4 mr-1" />
                Properties
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-xs data-[state=active]:bg-background">
                <Settings className="h-4 w-4 mr-1" />
                Settings
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="fields" className="m-0">
              <CardContent className="p-4">
                <QuestionTypePanel onAddField={handleAddField} />
              </CardContent>
            </TabsContent>
            
            <TabsContent value="properties" className="m-0">
              <CardContent className="p-4">
                {selectedField && (
                  <FieldPropertyPanel 
                    field={selectedField}
                    onUpdateField={(field) => updateField(selectedField.id, field)}
                    onRemoveField={() => {
                      removeField(selectedField.id);
                      handleFieldDeselect();
                    }}
                    formFields={formSchema.fields}
                  />
                )}
              </CardContent>
            </TabsContent>
            
            <TabsContent value="settings" className="m-0">
              <CardContent className="p-4">
                <FormSettings />
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
      
      {/* Right Panel - Form Builder Canvas */}
      <div className="md:col-span-2">
        <Card className="border-none shadow-none bg-transparent">
          <CardHeader className="p-6 pb-4 border-b border-border/40">
            <div className="space-y-4">
              <Input
                value={formSchema.title}
                onChange={(e) => setFormTitle(e.target.value)}
                className="text-xl font-medium border-none p-0 h-auto focus-visible:ring-0 bg-transparent"
                placeholder="Form Title"
              />
              <Textarea
                value={formSchema.description}
                onChange={(e) => setFormDescription(e.target.value)}
                className="resize-none border-none p-0 focus-visible:ring-0 bg-transparent text-muted-foreground"
                placeholder="Form Description"
              />
            </div>
          </CardHeader>
          
          <CardContent className="p-6 pt-8">
            {formSchema.fields.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <h3 className="text-lg font-medium text-muted-foreground">No fields added yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">Click on a question type to add it to your form</p>
                <Button 
                  variant="outline" 
                  onClick={() => handleAddField('text')} 
                  className="mt-4"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Text Question
                </Button>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={formSchema.fields.map(f => f.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4">
                    {formSchema.fields.map((field) => (
                      <FormBuilderField
                        key={field.id}
                        field={field}
                        isSelected={field.id === selectedFieldId}
                        onClick={() => handleFieldSelect(field.id)}
                        onDeselect={handleFieldDeselect}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FormBuilder;