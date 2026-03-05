import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import type { OcrResult } from "@/lib/ocr/tesseractClient";

// A4 page dimensions in PDF points (1 pt = 1/72 inch)
const A4_WIDTH  = 595.28;
const A4_HEIGHT = 841.89;
const PAGE_MARGIN = 40; // points of white space around the image

/**
 * Builds a searchable PDF from images + OCR results.
 * Every page is A4. Each image is scaled to fit with margin and centered.
 * OCR words are drawn as an invisible text layer so the PDF is searchable.
 */
export async function buildPdf(files: File[], ocrResults: OcrResult[]): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const font   = await pdfDoc.embedFont(StandardFonts.Helvetica);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const ocr  = ocrResults[i];

    // ── 1. Embed image ───────────────────────────────────────────────────────
    const arrayBuffer = await file.arrayBuffer();
    const mimeType    = file.type.toLowerCase();

    let embeddedImage;
    if (mimeType === "image/jpeg" || mimeType === "image/jpg") {
      embeddedImage = await pdfDoc.embedJpg(arrayBuffer);
    } else if (mimeType === "image/png") {
      embeddedImage = await pdfDoc.embedPng(arrayBuffer);
    } else {
      embeddedImage = await embedViaCanvas(pdfDoc, file);
    }

    const { width: imgW, height: imgH } = embeddedImage;

    // ── 2. Scale image to fit inside A4 with margin ──────────────────────────
    const availW = A4_WIDTH  - PAGE_MARGIN * 2;
    const availH = A4_HEIGHT - PAGE_MARGIN * 2;

    const scale  = Math.min(availW / imgW, availH / imgH, 1); // never upscale
    const drawW  = imgW * scale;
    const drawH  = imgH * scale;

    // Center on A4 page
    const offsetX = (A4_WIDTH  - drawW) / 2;
    const offsetY = (A4_HEIGHT - drawH) / 2;

    // ── 3. Add A4 page and draw image ────────────────────────────────────────
    const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);

    // White background (in case image has transparency)
    page.drawRectangle({
      x: 0, y: 0,
      width: A4_WIDTH, height: A4_HEIGHT,
      color: rgb(1, 1, 1),
    });

    page.drawImage(embeddedImage, {
      x: offsetX,
      y: offsetY,
      width:  drawW,
      height: drawH,
    });

    // ── 4. Invisible OCR text overlay ────────────────────────────────────────
    if (ocr?.words?.length) {
      const ocrW = ocr.imageWidth  || imgW;
      const ocrH = ocr.imageHeight || imgH;

      for (const word of ocr.words) {
        if (!word.text.trim()) continue;

        // Map OCR pixel coords → drawn image coords on the page
        const wordDrawX0 = offsetX + (word.bbox.x0 / ocrW) * drawW;
        const wordDrawX1 = offsetX + (word.bbox.x1 / ocrW) * drawW;
        const wordDrawY0 = offsetY + (1 - word.bbox.y1 / ocrH) * drawH; // PDF Y is bottom-up
        const wordDrawY1 = offsetY + (1 - word.bbox.y0 / ocrH) * drawH;

        const wordW = wordDrawX1 - wordDrawX0;
        const wordH = wordDrawY1 - wordDrawY0;
        if (wordW <= 0 || wordH <= 0) continue;

        // Font size to match the word's rendered height, then constrain to width
        const fontSize    = Math.max(1, wordH * 0.9);
        const textWidth   = font.widthOfTextAtSize(word.text, fontSize);
        const scaleText   = textWidth > 0 ? Math.min(1, wordW / textWidth) : 1;
        const finalSize   = fontSize * scaleText;
        if (finalSize < 0.5) continue;

        page.drawText(word.text, {
          x:    wordDrawX0,
          y:    wordDrawY0 + (wordH - finalSize) / 2,
          size: finalSize,
          font,
          color:   rgb(0, 0, 0),
          opacity: 0, // invisible — text layer for search/copy only
        });
      }
    }
  }

  return pdfDoc.save();
}

async function embedViaCanvas(
  pdfDoc: PDFDocument,
  file: File
): Promise<ReturnType<typeof pdfDoc.embedPng>> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = async () => {
      const canvas = document.createElement("canvas");
      canvas.width  = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("Canvas context unavailable")); return; }
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(async (blob) => {
        if (!blob) { reject(new Error("Canvas toBlob failed")); return; }
        const ab       = await blob.arrayBuffer();
        const embedded = await pdfDoc.embedPng(ab);
        URL.revokeObjectURL(url);
        resolve(embedded);
      }, "image/png");
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Image load failed")); };
    img.src = url;
  });
}
