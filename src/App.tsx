import { FormBuilderProvider } from '@/contexts/FormBuilderContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import FormBuilderDemo from '@/pages/FormBuilderDemo';
import './App.css';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <FormBuilderProvider>
        <div className="min-h-screen bg-background">
          <FormBuilderDemo />
        </div>
      </FormBuilderProvider>
    </ThemeProvider>
  );
}

export default App;