import { GoogleGenAI } from "@google/genai";
import { Message, UploadedFile } from "../types";

// Initialize the Google GenAI client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateResponse = async (
  history: Message[],
  userQuery: string,
  files: UploadedFile[]
): Promise<{ text: string; citations?: string[] }> => {
    
  // Filter for valid files that are ready
  const readyFiles = files.filter(f => f.status === 'ready' && f.content);
  const hasContext = readyFiles.length > 0;

  try {
    // Use Gemini 2.5 Flash for speed and long context window
    const modelId = 'gemini-2.5-flash';

    // Construct the parts for the message.
    const contentParts: any[] = [{ text: userQuery }];

    // Attach files to the prompt if available
    if (hasContext) {
        readyFiles.forEach((file, index) => {
            if (file.content) {
                contentParts.push({
                    text: `\n--- INICIO DOCUMENTO ADJUNTO #${index + 1}: ${file.name} ---\n`
                });
                contentParts.push({
                    inlineData: {
                        mimeType: file.mimeType || 'text/plain',
                        data: file.content
                    }
                });
                contentParts.push({
                    text: `\n--- FIN DOCUMENTO #${index + 1} ---\n`
                });
            }
        });
    }

    // Transform previous chat history for the API
    // Limit history to last 6 turns to save context window for documents
    const validHistory = history
        .filter(m => m.role !== 'system' && !m.isTyping && m.content !== userQuery)
        .slice(-12);
    
    const contents = [
        ...validHistory.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
        })),
        {
            role: 'user',
            parts: contentParts
        }
    ];

    // Strict Legal System Instruction updated for high fidelity per user request
    const systemInstruction = `Eres Kognia, un asistente legal inteligente especializado en análisis documental (RAG).

    ESTADO DEL CONTEXTO:
    ${hasContext ? `✅ El usuario ha cargado ${readyFiles.length} documento(s) para análisis.` : '❌ NO hay documentos cargados.'}

    INSTRUCCIONES DE COMPORTAMIENTO:

    1. **SI NO HAY DOCUMENTOS CARGADOS (CASO PRIORITARIO)**:
       - Si el usuario te saluda (ej. "Hola"), responde cortésmente e indícale que necesitas documentos.
       - Si el usuario hace CUALQUIER pregunta o solicitud de análisis, DEBES responder con la siguiente plantilla (sin inventar respuestas):
       
       " **Documentación requerida**
       
       Para poder ofrecerte una respuesta precisa, necesito que cargues los documentos legales sobre los que deseas consultar (Contratos, Estatutos, Acuerdos, etc.).
       
       Por favor, utiliza el panel de carga para subir tus archivos PDF o TXT. Una vez procesados, podré fundamentar mis respuestas estrictamente en su contenido."

    2. **SI HAY DOCUMENTOS CARGADOS**:
       - **PRECISIÓN ABSOLUTA**: Tus respuestas deben estar 100% fundamentadas en el texto de los documentos.
       - **CERO ALUCINACIONES**: Si la respuesta no está en el documento, indica explícitamente: "La información solicitada no se encuentra en los documentos proporcionados". No inventes datos.
       - **CITAS**: Siempre que sea posible, menciona la cláusula, sección o página de donde extraes la información.

    Tu tono es profesional, objetivo y directo.`;

    const response = await ai.models.generateContent({
        model: modelId,
        contents: contents,
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.0, // Zero temperature for maximum determinism
            topP: 0.1, // Low topP for focused responses
            topK: 1,   // Strict token selection
        }
    });

    const text = response.text || "No pude generar una respuesta.";
    
    // Smart Citation Extraction (Regex looking for legal citation patterns)
    const citationRegex = /(?:Cláusula|Artículo|Sección|Punto|Anexo)\s+\d+(?:\.\d+)*|[A-Z]+-\d+/gi;
    let uniqueCitations: string[] = [];
    
    if (hasContext) {
        const matches = (text.match(citationRegex) || []) as string[];
        // Deduplicate and clean
        uniqueCitations = Array.from(new Set(matches.map(m => m.trim()))).slice(0, 5);
        
        // If specific clauses aren't found but file names are mentioned, use those
        if (uniqueCitations.length === 0) {
             readyFiles.forEach(f => {
                if (text.includes(f.name)) uniqueCitations.push(f.name);
             });
        }
    }

    return {
        text: text,
        citations: uniqueCitations
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
        text: "Error de conexión con Kognia AI. Por favor verifica tu conexión a internet.",
        citations: []
    };
  }
};