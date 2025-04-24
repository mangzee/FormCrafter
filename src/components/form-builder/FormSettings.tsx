import { useFormBuilder } from '@/hooks/useFormBuilder';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

const FormSettings = () => {
  const { formSchema, updateFormSettings } = useFormBuilder();
  const { settings } = formSchema;

  return (
    <ScrollArea className="h-[400px] pr-4 -mr-4">
      <div className="space-y-4 pb-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="show-progress">Show Progress Bar</Label>
            <Switch
              id="show-progress"
              checked={settings.showProgressBar}
              onCheckedChange={(checked) => 
                updateFormSettings({ showProgressBar: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="show-page-titles">Show Page Titles</Label>
            <Switch
              id="show-page-titles"
              checked={settings.showPageTitles}
              onCheckedChange={(checked) => 
                updateFormSettings({ showPageTitles: checked })
              }
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <Label htmlFor="confirmation-message">Confirmation Message</Label>
          <Textarea
            id="confirmation-message"
            value={settings.confirmationMessage}
            onChange={(e) => 
              updateFormSettings({ confirmationMessage: e.target.value })
            }
            placeholder="Thank you for your submission!"
            className="resize-none"
            rows={3}
          />
        </div>
      </div>
    </ScrollArea>
  );
};

export default FormSettings;