# FormCrafter

[![npm version](https://img.shields.io/npm/v/formcrafter.svg)](https://www.npmjs.com/package/formcrafter)
[![npm downloads](https://img.shields.io/npm/dm/formcrafter.svg)](https://www.npmjs.com/package/formcrafter)
[![License](https://img.shields.io/npm/l/formcrafter.svg)](https://github.com/mangzee/FormCrafter/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/mangzee/FormCrafter.svg)](https://github.com/mangzee/FormCrafter/stargazers)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/mangzee/FormCrafter/pulls)

A powerful and flexible form builder and renderer library built with React, TypeScript, and Tailwind CSS. Create dynamic forms with advanced features like conditional logic, validation, and repeatable sections.

[View Demo](https://idyllic-puffpuff-98b974.netlify.app/)

## Features

- 🎨 Modern, responsive design with dark mode support
- 🧩 13+ field types including text, select, matrix, and repeatable sections
- ✨ Drag-and-drop form builder interface
- 🔄 Real-time form preview
- ⚡ Conditional logic for dynamic form behavior
- ✅ Built-in validation with Zod
- 📱 Mobile-friendly and accessible
- 🎯 Comprehensive field customization options
- 🌙 Dark mode support out of the box
- 🎭 Customizable themes
- 🔒 Type-safe with full TypeScript support
- 📦 Zero configuration required

## Installation

```bash
npm install formcrafter
```

## Quick Start

```tsx
import { FormBuilder, FormRenderer, FormBuilderProvider, ThemeProvider } from 'formcrafter';

function App() {
  const handleSubmit = (data: Record<string, any>) => {
    console.log('Form submitted:', data);
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="theme">
      <FormBuilderProvider>
        <div className="container mx-auto">
          <FormBuilder />
          <FormRenderer onSubmit={handleSubmit} />
        </div>
      </FormBuilderProvider>
    </ThemeProvider>
  );
}
```

## Field Types

### Basic Fields
- **Text**: Single-line text input with optional validation
- **Long Text**: Multi-line text area with resizable input
- **Number**: Numeric input with min/max validation
- **Email**: Email input with format validation

### Choice Fields
- **Dropdown**: Single-select dropdown menu with search
- **Multi-Select**: Multiple selection dropdown with tags
- **Checkboxes**: Multiple choice checkboxes with min/max selections
- **Radio**: Single-select radio buttons with custom styling

### File Upload Fields
- **File Upload**: Single file upload with type restrictions
- **Image Upload**: Image upload with preview and size limits
- **Attachments**: Multiple file attachments with drag-and-drop

### Advanced Fields
- **Rating**: Star rating or numeric scale (1-5)
- **Matrix**: Grid of questions and answers for surveys
- **Repeatable**: Dynamic repeatable sections with sub-fields

## Form Schema

The form schema defines the structure and behavior of your form:

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

interface FieldValidation {
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  customMessage?: string;
  allowedFileTypes?: string[];
  maxFileSize?: number;
  maxFiles?: number;
}
```

## Validation

Built-in validation using Zod with support for:

```typescript
// Text field validation
const textValidation = {
  minLength: 3,
  maxLength: 100,
  pattern: '^[A-Za-z0-9]+$',
  customMessage: 'Please enter alphanumeric characters only'
};

// Number field validation
const numberValidation = {
  min: 0,
  max: 100,
  customMessage: 'Please enter a number between 0 and 100'
};

// File upload validation
const fileValidation = {
  maxFileSize: 5000000, // 5MB
  allowedFileTypes: ['.jpg', '.png', '.pdf'],
  maxFiles: 3
};
```

## Conditional Logic

Show or hide fields based on other field values:

```typescript
const conditions = [
  {
    sourceFieldId: 'question1',
    operator: 'equals',
    value: 'yes'
  },
  {
    sourceFieldId: 'age',
    operator: 'greaterThan',
    value: 18
  }
];
```

Supported operators:
- `equals`
- `notEquals`
- `contains`
- `notContains`
- `greaterThan`
- `lessThan`
- `isEmpty`
- `isNotEmpty`

## Styling

FormCrafter uses Tailwind CSS with a fully customizable theme:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        // Add custom colors
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    }
  }
};
```

## Advanced Usage

### Custom Field Validation

```typescript
import { z } from 'zod';

const customValidation = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});
```

### Repeatable Sections

Create dynamic form sections:

```typescript
const repeatableField = {
  id: 'contacts',
  type: 'repeatable',
  label: 'Contact Information',
  subFields: [
    {
      id: 'name',
      type: 'text',
      label: 'Name',
      required: true
    },
    {
      id: 'email',
      type: 'email',
      label: 'Email',
      required: true
    }
  ],
  validations: {
    min: 1,
    max: 5
  }
};
```

### Matrix Questions

Create grid-based survey questions:

```typescript
const matrixField = {
  id: 'satisfaction',
  type: 'matrix',
  label: 'Satisfaction Survey',
  options: [
    { id: '1', value: 'row1', label: 'Service Quality' },
    { id: '2', value: 'row2', label: 'Response Time' },
    { id: '3', value: 'col1', label: 'Poor', isColumn: true },
    { id: '4', value: 'col2', label: 'Fair', isColumn: true },
    { id: '5', value: 'col3', label: 'Good', isColumn: true }
  ]
};
```

## Best Practices

### Field Design
- Use clear, descriptive labels
- Add helpful placeholder text
- Provide context with help text
- Group related fields together
- Use appropriate field types

### Validation
- Set reasonable validation rules
- Provide clear error messages
- Use custom validation for complex rules
- Consider field dependencies

### Conditional Logic
- Keep conditions simple
- Test all combinations
- Consider default states
- Handle edge cases

### Performance
- Minimize number of conditions
- Use appropriate field types
- Optimize file upload settings
- Test with large datasets

### Accessibility
- Use semantic HTML
- Provide ARIA labels
- Ensure keyboard navigation
- Test with screen readers

## Browser Support

FormCrafter supports all modern browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Submit a pull request

## License

FormCrafter is [MIT licensed](./LICENSE).

## Support

- [GitHub Issues](https://github.com/mangzee/FormCrafter/issues)
- [Documentation](https://github.com/mangzee/FormCrafter#readme)
- [Demo](https://idyllic-puffpuff-98b974.netlify.app/)