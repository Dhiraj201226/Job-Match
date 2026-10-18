import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Configure the worker URL for local offline parsing
if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
}

/**
 * Extracts plain text from a PDF File or ArrayBuffer
 * @param {File | Blob | ArrayBuffer} fileOrBuffer
 * @returns {Promise<{ text: string, pages: number }>}
 */
export async function extractTextFromPDF(fileOrBuffer) {
  try {
    let arrayBuffer;
    if (fileOrBuffer instanceof File || fileOrBuffer instanceof Blob) {
      arrayBuffer = await fileOrBuffer.arrayBuffer();
    } else {
      arrayBuffer = fileOrBuffer;
    }

    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useSystemFonts: true
    });

    const pdfDoc = await loadingTask.promise;
    const numPages = pdfDoc.numPages;
    const pageTexts = [];

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      const pageLines = [];
      let lastY = null;
      let currentLine = [];

      for (const item of textContent.items) {
        if (!item.str) continue;
        
        // Group words on similar Y coordinates
        if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
          pageLines.push(currentLine.join(' '));
          currentLine = [item.str];
        } else {
          currentLine.push(item.str);
        }
        lastY = item.transform[5];
      }

      if (currentLine.length > 0) {
        pageLines.push(currentLine.join(' '));
      }

      pageTexts.push(pageLines.join('\n'));
    }

    const fullText = pageTexts.join('\n\n').trim();
    if (!fullText) {
      throw new Error('No readable text found in PDF. It might be a scanned image or protected document.');
    }

    return {
      text: fullText,
      pages: numPages
    };
  } catch (err) {
    console.error('PDF extraction failed:', err);
    throw new Error(err.message || 'Failed to extract text from PDF.');
  }
}

/**
 * Universally extract text from any uploaded resume file (.pdf, .txt, .md)
 * @param {File} file
 * @returns {Promise<{ text: string, pages?: number, filename: string }>}
 */
export async function extractResumeFile(file) {
  if (!file) {
    throw new Error('No file provided.');
  }

  const isPDF = file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf';

  if (isPDF) {
    const result = await extractTextFromPDF(file);
    return {
      text: result.text,
      pages: result.pages,
      filename: file.name
    };
  }

  // Text/Markdown files
  const text = await file.text();
  return {
    text: text.trim(),
    pages: 1,
    filename: file.name
  };
}
