
import React from 'react';
import { Sparkles, Cpu, LayoutGrid, MessageSquareText, Info } from 'lucide-react';
import { APP_NAME, HACKATHON_NAME } from '../constants';

interface HeaderProps {
  currentView: 'chat' | 'info';
  onViewChange: (view: 'chat' | 'info') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  return (
    <header className="bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo Area */}
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => onViewChange('chat')}
        >
          <div className="w-10 h-10 bg-brand-gradient rounded-lg flex items-center justify-center text-white shadow-lg shadow-kognia-pink/20 group-hover:scale-105 transition-transform duration-300">
             {/* Abstract K logo representation */}
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <path d="M4 4v16" />
                <path d="M20 4L4 12" />
                <path d="M4 12l16 8" />
             </svg>
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-heading font-bold text-gray-900 tracking-tighter leading-none">
              {APP_NAME}
            </h1>
            <span className="text-[10px] text-transparent bg-clip-text bg-brand-gradient font-bold tracking-widest uppercase mt-0.5">
              {HACKATHON_NAME}
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex gap-6">
            <button
              onClick={() => onViewChange('chat')}
              className={`flex items-center gap-2 text-sm font-semibold transition-all relative py-2
                ${currentView === 'chat' ? 'text-kognia-blue' : 'text-gray-500 hover:text-gray-800'}
              `}
            >
              <MessageSquareText size={18} />
              Asistente Virtual
              {currentView === 'chat' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-gradient rounded-full"></span>}
            </button>
            <button
              onClick={() => onViewChange('info')}
              className={`flex items-center gap-2 text-sm font-semibold transition-all relative py-2
                ${currentView === 'info' ? 'text-kognia-blue' : 'text-gray-500 hover:text-gray-800'}
              `}
            >
              <Info size={18} />
              Información
              {currentView === 'info' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-gradient rounded-full"></span>}
            </button>
          </nav>

          <div className="flex items-center gap-4 pl-6 border-l border-gray-200">
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-full text-xs font-bold border border-gray-200">
              <Cpu size={14} className="text-kognia-purple" />
              <span>Kognia Systems Active</span>
            </div>
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 p-[2px]">
              <div className="h-full w-full rounded-full bg-white overflow-hidden">
                 <img src="https://picsum.photos/100/100" alt="User" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Placeholder */}
        <div className="md:hidden">
            <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
              <img src="https://picsum.photos/100/100" alt="User" className="h-full w-full object-cover" />
            </div>
        </div>
      </div>
    </header>
  );
};
