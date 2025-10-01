/**
 * 📄 Procesadores de Archivos para PresentationMind AI
 * 
 * Utilidades para extraer texto de diferentes tipos de archivos
 * subidos por los usuarios.
 */

// Función para leer archivos de texto plano
export const readTextFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const text = event.target?.result as string;
      resolve(text);
    };
    
    reader.onerror = () => {
      reject(new Error('Error leyendo el archivo'));
    };
    
    reader.readAsText(file, 'UTF-8');
  });
};

// Función simplificada para extraer texto de PDFs (usando texto copiado)
export const extractTextFromPDF = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    // Para esta implementación inicial, pedimos al usuario que copie el texto
    // En el futuro se puede integrar pdf-parse o similar
    resolve(`[PDF] ${file.name} - Por favor, copia y pega el texto del PDF en el campo de texto`);
  });
};

// Función para procesar diferentes tipos de archivo
export const processFile = async (file: File): Promise<{ text: string; success: boolean; message: string }> => {
  try {
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();
    
    // Verificar tamaño de archivo (máximo 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return {
        text: '',
        success: false,
        message: 'El archivo es demasiado grande. Máximo permitido: 10MB'
      };
    }
    
    let extractedText = '';
    
    // Archivos de texto plano
    if (fileType.includes('text/plain') || fileName.endsWith('.txt')) {
      extractedText = await readTextFile(file);
    }
    // PDFs (implementación básica)
    else if (fileType.includes('pdf') || fileName.endsWith('.pdf')) {
      return {
        text: '',
        success: false,
        message: 'Para archivos PDF, por favor copia y pega el texto directamente en el campo de texto. El soporte completo de PDF estará disponible pronto.'
      };
    }
    // Archivos Word (implementación básica)
    else if (fileType.includes('msword') || 
             fileType.includes('wordprocessingml') ||
             fileName.endsWith('.doc') || 
             fileName.endsWith('.docx')) {
      return {
        text: '',
        success: false,
        message: 'Para archivos Word, por favor copia y pega el texto directamente en el campo de texto. El soporte completo de Word estará disponible pronto.'
      };
    }
    // Tipo de archivo no soportado
    else {
      return {
        text: '',
        success: false,
        message: `Tipo de archivo no soportado: ${fileType}. Por favor usa archivos .txt o copia y pega el texto directamente.`
      };
    }
    
    // Verificar que el texto no esté vacío
    if (!extractedText || extractedText.trim().length < 50) {
      return {
        text: extractedText,
        success: false,
        message: 'El archivo parece estar vacío o contiene muy poco texto. Necesitas al menos 50 caracteres.'
      };
    }
    
    return {
      text: extractedText.trim(),
      success: true,
      message: `Texto extraído exitosamente (${extractedText.length.toLocaleString()} caracteres)`
    };
    
  } catch (error) {
    console.error('Error processing file:', error);
    return {
      text: '',
      success: false,
      message: 'Error procesando el archivo. Intenta copiando y pegando el texto directamente.'
    };
  }
};

// Validar que el texto cumple con los requisitos mínimos
export const validateText = (text: string, maxLength: number = 50000): { valid: boolean; message: string } => {
  if (!text || text.trim().length === 0) {
    return {
      valid: false,
      message: 'El texto no puede estar vacío'
    };
  }
  
  if (text.trim().length < 100) {
    return {
      valid: false,
      message: 'El texto debe tener al menos 100 caracteres para crear una presentación significativa'
    };
  }
  
  if (text.length > maxLength) {
    return {
      valid: false,
      message: `El texto es demasiado largo. Máximo permitido: ${maxLength.toLocaleString()} caracteres`
    };
  }
  
  return {
    valid: true,
    message: 'Texto válido para generar presentación'
  };
};