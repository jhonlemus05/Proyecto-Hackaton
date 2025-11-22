import React, { useState } from 'react';
import { BrainCircuit, Scale, FileSearch, ChevronRight, ScrollText, ShieldCheck, Rocket, Target } from 'lucide-react';

type TabType = 'mission' | 'function' | 'legal';

export const CompanyInfo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('mission');

  return (
    <div className="h-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
      
      {/* Hero Section */}
      <div className="relative bg-kognia-dark overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-gradient-to-br from-kognia-blue/20 via-transparent to-kognia-pink/20 pointer-events-none"></div>
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-kognia-blue/30 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 px-8 py-10 md:py-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-3xl">
                <span className="text-kognia-pink font-bold tracking-widest uppercase text-xs mb-2 block">Hackathon Caldas 2025</span>
                <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-white mb-4 leading-tight">
                    Hack-Kognia 1.0: <span className="text-transparent bg-clip-text bg-brand-gradient">Asistente Legal</span>
                </h2>
                <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                    Un desafío de Inteligencia Artificial para transformar la forma en que accedemos a la información jurídica mediante el poder del lenguaje natural y el razonamiento automático.
                </p>
            </div>
            <div className="hidden md:block">
               <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-xl">
                    <Scale className="text-white w-8 h-8" />
               </div>
            </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex px-8 gap-8 border-b border-gray-800 overflow-x-auto">
            {[
                { id: 'mission', label: 'Misión y Visión' },
                { id: 'function', label: 'Función del Bot' },
                { id: 'legal', label: 'Datos Legales' }
            ].map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`pb-4 text-xs md:text-sm font-bold tracking-wide uppercase transition-all relative whitespace-nowrap
                        ${activeTab === tab.id ? 'text-white' : 'text-gray-500 hover:text-gray-300'}
                    `}
                >
                    {tab.label}
                    {activeTab === tab.id && (
                        <span className="absolute bottom-0 left-0 w-full h-1 bg-brand-gradient rounded-t-full"></span>
                    )}
                </button>
            ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-6 md:p-10">
        
        {activeTab === 'mission' && (
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-1 h-full bg-brand-gradient"></div>
                     <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4 flex items-center gap-3">
                        <span className="p-2 bg-blue-50 rounded-lg text-kognia-blue"><Rocket size={24} /></span>
                        Misión Corporativa
                     </h3>
                     <p className="text-gray-600 text-lg leading-relaxed">
                        Somos una compañía de tecnología especializada en acelerar la transformación de negocios mediante el poder de la <strong>Inteligencia Artificial de última generación</strong>, impulsada por soluciones basadas en agentes cognitivos.
                     </p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-1 h-full bg-kognia-pink"></div>
                     <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4 flex items-center gap-3">
                        <span className="p-2 bg-pink-50 rounded-lg text-kognia-pink"><Target size={24} /></span>
                        Visión y Modelo (AaaS)
                     </h3>
                     <p className="text-gray-600 text-lg leading-relaxed mb-4">
                        Impulsamos el éxito de nuestros clientes empresariales con sistemas propios, diseñados para minimizar el <em>time to value</em> y maximizar los beneficios.
                     </p>
                     <p className="text-gray-600 text-lg leading-relaxed">
                        Nuestro modelo de negocio <strong>Agent as a Service (AaaS)</strong> permite desplegar soluciones de agentes cognitivos altamente especializados que se adaptan de forma ágil al entorno operativo del cliente con los más altos estándares de seguridad y confidencialidad.
                     </p>
                </div>
            </div>
        )}

        {activeTab === 'function' && (
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-10">
                    <h3 className="text-2xl font-heading font-bold text-gray-900">Funcionalidad del Asistente</h3>
                    <p className="text-gray-500 mt-2">Modelo de Inteligencia Artificial basado en RAG (Retrieval-Augmented Generation)</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Function Card 1 */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-kognia-blue transition-colors group">
                        <div className="w-12 h-12 bg-blue-50 text-kognia-blue rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-gradient group-hover:text-white transition-all">
                            <FileSearch size={24} />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 mb-3">Interpretación Documental</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            El asistente no inventa información. Analiza estrictamente la información existente en los documentos cargados (PDF, TXT) para asegurar fidelidad.
                        </p>
                    </div>

                    {/* Function Card 2 */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-kognia-purple transition-colors group">
                        <div className="w-12 h-12 bg-purple-50 text-kognia-purple rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-gradient group-hover:text-white transition-all">
                            <BrainCircuit size={24} />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 mb-3">Razonamiento Semántico</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Utiliza técnicas de recuperación aumentada (RAG) para entender el contexto de preguntas en lenguaje natural y buscar fragmentos relevantes.
                        </p>
                    </div>

                    {/* Function Card 3 */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-kognia-pink transition-colors group">
                        <div className="w-12 h-12 bg-pink-50 text-kognia-pink rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-gradient group-hover:text-white transition-all">
                            <ShieldCheck size={24} />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 mb-3">Respuesta Fundamentada</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Genera respuestas contextualizadas y precisas, citando la evidencia encontrada en los contratos, estatutos o acuerdos proporcionados.
                        </p>
                    </div>
                </div>

                <div className="mt-8 bg-blue-50 p-6 rounded-xl border border-blue-100 flex gap-4 items-start">
                    <div className="p-2 bg-white rounded-full shadow-sm text-kognia-blue shrink-0">
                        <ScrollText size={20} />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-1">Nota Importante</h4>
                        <p className="text-sm text-gray-700">
                            El asistente no redacta textos nuevos arbitrariamente; su función principal es interpretar y extraer información de la base de conocimiento cargada por el usuario.
                        </p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'legal' && (
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="bg-gray-50 px-8 py-6 border-b border-gray-100">
                        <h3 className="text-xl font-heading font-bold text-gray-900 flex items-center gap-2">
                            Datos del Proyecto y Contexto Legal
                        </h3>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                            <div>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Organización</span>
                                <p className="text-lg font-medium text-gray-900 mt-1">KOGNIA IA</p>
                            </div>
                            <div>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Evento</span>
                                <p className="text-lg font-medium text-gray-900 mt-1">Hackathon Caldas 2025</p>
                            </div>
                            <div>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nombre del Reto</span>
                                <p className="text-lg font-medium text-gray-900 mt-1">Hack-Kognia 1.0</p>
                            </div>
                            <div>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Categoría</span>
                                <p className="text-lg font-medium text-gray-900 mt-1">Nivel Intermedio - Asistente Legal</p>
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        <div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">Objetivo del Reto (MVP)</span>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 text-gray-600 text-sm">
                                    <ChevronRight size={16} className="text-kognia-pink mt-0.5 shrink-0" />
                                    <span>Desarrollar un sistema end-to-end de carga e indexación de documentos.</span>
                                </li>
                                <li className="flex items-start gap-3 text-gray-600 text-sm">
                                    <ChevronRight size={16} className="text-kognia-pink mt-0.5 shrink-0" />
                                    <span>Implementar un módulo de búsqueda y razonamiento (RAG) eficiente.</span>
                                </li>
                                <li className="flex items-start gap-3 text-gray-600 text-sm">
                                    <ChevronRight size={16} className="text-kognia-pink mt-0.5 shrink-0" />
                                    <span>Desplegar una interfaz tipo chat con usabilidad clara y URL pública.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="bg-kognia-dark px-8 py-4 text-center">
                        <p className="text-gray-400 text-xs">
                            © 2025 Kognia IA. Todos los derechos reservados para el Hackathon Caldas.
                        </p>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};