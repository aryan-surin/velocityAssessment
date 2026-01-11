import { PipelineToolbar, PipelineUI, SubmitButton } from './components';
import { BiNetworkChart } from 'react-icons/bi';

function App() {
  return (
    <div className="h-screen w-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4 flex items-center gap-3">
          <BiNetworkChart className="text-3xl text-blue-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">Workflow Pipeline Builder</h1>
            <p className="text-xs text-gray-500">Drag and drop nodes to create your workflow</p>
          </div>
        </div>
      </header>
      
      {/* Toolbar */}
      <PipelineToolbar />
      
      {/* Main Canvas Area */}
      <div className="flex-1 overflow-hidden">
        <PipelineUI />
      </div>
      
      {/* Submit Button */}
      <SubmitButton />
    </div>
  );
}

export default App;
