import { Message, UploadedFile } from "../types";

// Configuration for API URL
// The backend is deployed on Render at the URL below.
const API_URL = 
  (typeof process !== 'undefined' && process.env.REACT_APP_API_URL) || 
  (import.meta as any).env?.VITE_API_URL || 
  'https://backendproyectohackaton-1.onrender.com/api/chat'; 

export const generateResponse = async (
  history: Message[],
  userQuery: string,
  files: UploadedFile[]
): Promise<{ text: string; citations?: string[] }> => {
  
  // Filter only necessary file data to send to backend to minimize payload
  const readyFiles = files
    .filter(f => f.status === 'ready' && f.content)
    .map(f => ({
        name: f.name,
        mimeType: f.mimeType,
        content: f.content, // Base64 string
        status: f.status
    }));

  try {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            history,
            userQuery,
            files: readyFiles
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Server Error ${response.status}: ${errorData.error || 'Unknown error'}`);
    }

    const data = await response.json();

    return {
      text: data.text,
      citations: data.citations || [],
    };

  } catch (error: any) {
    console.error("API Request Error:", error);
    return {
      text: `Error de conexión con el servidor Kognia. \n\nPor favor intenta de nuevo en unos momentos.`,
      citations: [],
    };
  }
};