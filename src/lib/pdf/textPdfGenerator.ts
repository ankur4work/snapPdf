import { PDFDocument, rgb, StandardFonts, type PDFFont } from "pdf-lib";

const A4_W      = 595.28;
const A4_H      = 841.89;
const MARGIN    = 60;
const BODY_SIZE = 11;
const LINE_H    = BODY_SIZE * 1.6;
const MAX_W     = A4_W - MARGIN * 2;

/** Word-wrap a paragraph into lines that fit maxWidth */
function wrapParagraph(para: string, font: PDFFont, size: number, maxWidth: number): string[] {
  if (!para.trim()) return [""];
  const words = para.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(test, size) > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/**
 * Converts plain text to a nicely formatted A4 PDF.
 * Supports an optional title (rendered bold + larger).
 */
export async function buildTextPdf(text: string, title?: string): Promise<Uint8Array> {
  const pdfDoc   = await PDFDocument.create();
  const bodyFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  // Collect all lines to render
  const renderLines: Array<{ text: string; font: PDFFont; size: number; extraGap?: number }> = [];

  if (title?.trim()) {
    const titleSize = 20;
    const wrapped   = wrapParagraph(title.trim(), boldFont, titleSize, MAX_W);
    for (const l of wrapped) {
      renderLines.push({ text: l, font: boldFont, size: titleSize });
    }
    renderLines.push({ text: "", font: bodyFont, size: BODY_SIZE, extraGap: 8 }); // spacer
  }

  const paragraphs = text.split(/\r?\n/);
  for (const para of paragraphs) {
    const wrapped = wrapParagraph(para, bodyFont, BODY_SIZE, MAX_W);
    for (const l of wrapped) {
      renderLines.push({ text: l, font: bodyFont, size: BODY_SIZE });
    }
  }

  // Paginate
  let page  = pdfDoc.addPage([A4_W, A4_H]);
  let curY  = A4_H - MARGIN;

  const newPage = () => {
    page = pdfDoc.addPage([A4_W, A4_H]);
    curY = A4_H - MARGIN;
  };

  for (const line of renderLines) {
    const step = line.size * 1.6 + (line.extraGap ?? 0);
    if (curY - step < MARGIN) newPage();

    if (line.text) {
      page.drawText(line.text, {
        x:    MARGIN,
        y:    curY - line.size,
        size: line.size,
        font: line.font,
        color: rgb(0.1, 0.1, 0.1),
      });
    }

    curY -= step;
  }

  return pdfDoc.save();
}
