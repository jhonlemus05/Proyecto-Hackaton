
import React, { useState } from 'react';
import { Header } from './components/Header';
import { FileUploader } from './components/FileUploader';
import { ChatInterface } from './components/ChatInterface';
import { CompanyInfo } from './components/CompanyInfo';
import { UploadedFile } from './types';
import { MessageCircle, FileText, LayoutGrid } from 'lucide-react';

type ViewState = 'chat' | 'info';
type MobileTab = 'files' | 'chat' | 'info';

function App() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [currentView, setCurrentView] = useState<ViewState>('chat');
  const [mobileTab, setMobileTab] = useState<MobileTab>('files');

  const handleViewChange = (view: ViewState) => {
    setCurrentView(view);
    if (view === 'info') setMobileTab('info');
    else setMobileTab('chat');
  };

  const handleMobileTabChange = (tab: MobileTab) => {
    setMobileTab(tab);
    if (tab === 'info') setCurrentView('info');
    else setCurrentView('chat');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <Header currentView={currentView} onViewChange={handleViewChange} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 mb-20 lg:mb-0">
        {currentView === 'info' ? (
          <div className="h-[calc(100vh-9rem)] min-h-[600px]">
            <CompanyInfo />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-9rem)] min-h-[600px]">
            
            {/* Left Column: Context & Files */}
            <div className={`
              lg:col-span-4 flex flex-col gap-6 h-full
              ${mobileTab === 'files' ? 'flex' : 'hidden lg:flex'}
            `}>
              {/* Brand Card */}
              <div className="bg-brand-gradient rounded-2xl p-6 text-white shadow-xl shadow-kognia-blue/20 relative overflow-hidden shrink-0">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                  <h2 className="text-xl font-heading font-bold mb-2 relative z-10">Contexto Documental</h2>
                  <p className="text-blue-100 text-sm leading-relaxed relative z-10 font-medium">
                      Sube contratos o documentación corporativa. Kognia razonará sobre ellos para ofrecerte respuestas precisas.
                  </p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex-1 flex flex-col min-h-0">
                  <FileUploader files={files} setFiles={setFiles} />
              </div>
            </div>

            {/* Right Column: Chat Interface */}
            <div className={`
              lg:col-span-8 h-full
              ${mobileTab === 'chat' ? 'flex' : 'hidden lg:flex'}
            `}>
              <ChatInterface files={files} />
            </div>

          </div>
        )}
      </main>

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 flex justify-around z-50 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button 
            onClick={() => handleMobileTabChange('files')}
            className={`flex flex-col items-center p-2 rounded-lg w-full transition-colors ${mobileTab === 'files' ? 'text-kognia-blue bg-blue-50' : 'text-gray-400 hover:bg-gray-50'}`}
        >
            <FileText size={20} />
            <span className="text-[10px] font-bold mt-1">Data</span>
        </button>
        <button 
            onClick={() => handleMobileTabChange('chat')}
            className={`flex flex-col items-center p-2 rounded-lg w-full transition-colors ${mobileTab === 'chat' ? 'text-kognia-pink bg-pink-50' : 'text-gray-400 hover:bg-gray-50'}`}
        >
            <MessageCircle size={20} />
            <span className="text-[10px] font-bold mt-1">Chat</span>
        </button>
        <button 
            onClick={() => handleMobileTabChange('info')}
            className={`flex flex-col items-center p-2 rounded-lg w-full transition-colors ${mobileTab === 'info' ? 'text-kognia-purple bg-purple-50' : 'text-gray-400 hover:bg-gray-50'}`}
        >
            <LayoutGrid size={20} />
            <span className="text-[10px] font-bold mt-1">Info</span>
        </button>
      </div>
    </div>
  );
}

export default App;
