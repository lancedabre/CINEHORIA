// src/utils/pdfExporter.ts
import { ScreenplayType } from '@/types/screenplay';
import { TDocumentDefinitions, Content } from 'pdfmake/interfaces';

// Helper: Fetch a file from public folder and convert to Base64
const getBase64FromUrl = async (url: string): Promise<string> => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1]; 
      resolve(base64);
    };
    reader.readAsDataURL(blob);
  });
};

// ✅ FIX: Return type 'any' to stop TypeScript from over-analyzing the nested structure
const mapSlateToPdf = (children: any[], forceUppercase: boolean = false): any => {
  return children.map((child) => {
    const textContent = forceUppercase ? (child.text || "").toUpperCase() : (child.text || "");

    return {
      text: textContent,
      bold: child.bold || false,
      italics: child.italic || false, 
      decoration: child.underline ? 'underline' : undefined,
    };
  });
};

export const exportToPdf = async (slateNodes: any[]) => {
  const pdfMake = (await import('pdfmake/build/pdfmake')).default;
  
  // Load Fonts
  const vfs: Record<string, string> = {};
  // ⚠️ Make sure these fonts exist in your /public/fonts/ folder!
  try {
      vfs['CourierPrime-Regular.ttf'] = await getBase64FromUrl('/fonts/CourierPrime-Regular.ttf');
      vfs['CourierPrime-Bold.ttf']    = await getBase64FromUrl('/fonts/CourierPrime-Bold.ttf');
      vfs['CourierPrime-Italic.ttf']  = await getBase64FromUrl('/fonts/CourierPrime-Italic.ttf');
      vfs['CourierPrime-BoldItalic.ttf'] = await getBase64FromUrl('/fonts/CourierPrime-BoldItalic.ttf');
  } catch (e) {
      console.warn("Could not load local fonts. PDF might fail or use defaults.");
  }

  const fonts = {
    CourierPrime: {
      normal: 'CourierPrime-Regular.ttf',
      bold: 'CourierPrime-Bold.ttf',
      italics: 'CourierPrime-Italic.ttf',
      bolditalics: 'CourierPrime-BoldItalic.ttf',
    }
  };

  // Map Slate Nodes to PDF Structure
  const content: Content[] = slateNodes.map((node: any) => {
    const type = node.type as ScreenplayType;
    const children = node.children || [];

    // ✅ FIX: Cast each return object 'as Content' so the array is valid
    switch (type) {
      case 'scene-heading':
        return { 
          text: mapSlateToPdf(children, true), 
          margin: [0, 24, 0, 12], 
          style: 'scene' 
        } as Content;

      case 'action':
        return { 
          text: mapSlateToPdf(children), 
          margin: [0, 0, 0, 12] 
        } as Content;

      case 'character':
        return { 
          text: mapSlateToPdf(children, true), 
          margin: [158, 12, 0, 0], 
          keepWithNext: true 
        } as Content;

      case 'dialogue':
        return { 
          text: mapSlateToPdf(children), 
          margin: [72, 0, 72, 0] 
        } as Content;

      case 'parenthetical':
        return { 
          text: [
            { text: '(', italics: true },
            ...mapSlateToPdf(children),
            { text: ')', italics: true } 
          ],
          margin: [115, 0, 0, 0] 
        } as Content;

      case 'transition':
        return {
            text: mapSlateToPdf(children, true), 
            alignment: 'right',
            margin: [0, 12, 0, 12]
        } as Content;
        
      default:
        return { 
          text: mapSlateToPdf(children), 
          margin: [0, 0, 0, 12] 
        } as Content;
    }
  });

  const docDefinition: TDocumentDefinitions = {
    pageSize: 'LETTER',
    pageMargins: [108, 72, 72, 72], 
    content: content,
    defaultStyle: {
      font: 'CourierPrime',
      fontSize: 12,
      lineHeight: 1,
      alignment: 'left'
    },
    footer: function(currentPage, pageCount) {
      return { 
        text: currentPage.toString() + '.', 
        alignment: 'right',
        margin: [0, 0, 50, 0],
        color: 'gray'
      };
    }
  };

  pdfMake.createPdf(docDefinition, undefined, fonts, vfs).download('screenplay.pdf');
};