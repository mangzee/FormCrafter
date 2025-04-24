# FormCrafter - Form Builder Library

A powerful and flexible form builder and renderer library built with React, TypeScript, and Tailwind CSS. Create dynamic forms with advanced features like conditional logic, validation, and repeatable sections.

## Features

- 🎨 Modern, responsive design with dark mode support
- 🧩 13+ field types including text, select, matrix, and repeatable sections
- ✨ Drag-and-drop form builder interface
- 🔄 Real-time form preview
- ⚡ Conditional logic for dynamic form behavior
- ✅ Built-in validation with Zod
- 📱 Mobile-friendly and accessible
- 🎯 Comprehensive field customization options

## Field Types

### Basic Fields
- **Text**: Single-line text input
- **Long Text**: Multi-line text area
- **Number**: Numeric input with validation
- **Email**: Email input with format validation

### Choice Fields
- **Dropdown**: Single-select dropdown menu
- **Multi-Select**: Multiple selection dropdown
- **Checkboxes**: Multiple choice checkboxes
- **Radio**: Single-select radio buttons

### File Upload Fields
- **File Upload**: Single file upload
- **Image Upload**: Image upload with preview
- **Attachments**: Multiple file attachments

### Advanced Fields
- **Rating**: Star rating or numeric scale
- **Matrix**: Grid of questions and answers
- **Repeatable**: Dynamic repeatable sections with sub-fields

## Form Builder Features

### Field Properties
- Label customization
- Help text
- Placeholder text
- Required field toggle
- Field-specific validation rules
- Conditional display logic

### Validation Options
- Min/max length for text
- Min/max value for numbers
- Required field validation
- Email format validation
- File type restrictions
- Custom validation messages

### Conditional Logic
Configure fields to show/hide based on:
- Other field values
- Multiple conditions
- Complex logic operators

## Usage Example

```tsx
import { FormBuilder, FormRenderer } from '@/components/form-builder';

// Form Builder Component
function FormBuilderExample() {
  const handleSubmit = (data: Record<string, any>) => {
    console.log('Form submitted:', data);
  };

  return (
    <div className="container mx-auto">
      <FormBuilder />
      <FormRenderer onSubmit={handleSubmit} />
    </div>
  );
}
```

## Form Schema

The form schema is a JSON structure that defines the form's fields and properties:

```typescript
interface FormSchema {
  title: string;
  description: string;
  fields: FormField[];
  settings: {
    showProgressBar: boolean;
    showPageTitles: boolean;
    confirmationMessage: string;
  };
}

interface FormField {
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
```

## Validation

The library uses Zod for form validation. Each field type has its own validation rules:

```typescript
// Example validation schema for a text field
const textFieldValidation = z.string()
  .min(3, "Must be at least 3 characters")
  .max(100, "Must be less than 100 characters");

// Example validation for a number field
const numberFieldValidation = z.number()
  .min(0, "Must be positive")
  .max(100, "Must be less than 100");
```

## Conditional Logic

Fields can be shown or hidden based on other field values:

```typescript
interface Condition {
  sourceFieldId: string;
  operator: ConditionalOperator;
  value: any;
}

type ConditionalOperator = 
  | 'equals' 
  | 'notEquals' 
  | 'contains' 
  | 'notContains'
  | 'greaterThan'
  | 'lessThan'
  | 'isEmpty'
  | 'isNotEmpty';
```

## Repeatable Sections

Create dynamic form sections that users can add multiple times:

```typescript
const repeatableField: FormField = {
  id: "contacts",
  type: "repeatable",
  label: "Contact Information",
  subFields: [
    {
      id: "name",
      type: "text",
      label: "Name",
      required: true
    },
    {
      id: "email",
      type: "email",
      label: "Email",
      required: true
    }
  ],
  validations: {
    min: 1,
    max: 5
  }
};
```

## Matrix Questions

Create grid-based questions with rows and columns:

```typescript
const matrixField: FormField = {
  id: "satisfaction",
  type: "matrix",
  label: "Satisfaction Survey",
  options: [
    { id: "1", value: "row1", label: "Service Quality" },
    { id: "2", value: "row2", label: "Response Time" },
    { id: "3", value: "col1", label: "Poor", isColumn: true },
    { id: "4", value: "col2", label: "Fair", isColumn: true },
    { id: "5", value: "col3", label: "Good", isColumn: true }
  ]
};
```

## File Upload Fields

Three types of file upload fields are available:

1. **File Upload**: Single file upload with type restrictions
2. **Image Upload**: Specialized for image files with preview
3. **Attachments**: Multiple file uploads with count limits

```typescript
const imageField: FormField = {
  id: "profile",
  type: "image",
  label: "Profile Picture",
  validations: {
    allowedFileTypes: [".jpg", ".png", ".gif"],
    maxFileSize: 5000 // 5MB
  }
};

const attachmentsField: FormField = {
  id: "documents",
  type: "attachment",
  label: "Supporting Documents",
  validations: {
    maxFiles: 5,
    allowedFileTypes: [".pdf", ".doc", ".docx"]
  }
};
```

## Styling

The library uses Tailwind CSS with a customizable theme. Override the default styles by modifying the `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {...},
        secondary: {...},
        // Add custom colors
      },
      borderRadius: {
        // Customize border radius
      },
      // Add other theme customizations
    }
  }
};
```

## Best Practices

1. **Field Labels**
   - Use clear, concise labels
   - Add help text for complex fields
   - Consider accessibility in your label text

2. **Validation**
   - Set appropriate validation rules
   - Provide clear error messages
   - Use custom validation messages when needed

3. **Conditional Logic**
   - Keep conditions simple and logical
   - Test all possible combinations
   - Consider the user experience

4. **File Uploads**
   - Set appropriate file size limits
   - Restrict file types as needed
   - Consider server-side storage limits

5. **Repeatable Sections**
   - Set reasonable min/max limits
   - Keep sub-fields focused
   - Consider data structure implications

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to our repository.

## License

This project is licensed under the MIT License - see the LICENSE file for details.