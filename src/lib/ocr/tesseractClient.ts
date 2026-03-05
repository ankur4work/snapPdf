/**
 * Tesseract.js OCR client — singleton worker for speed.
 *
 * The worker (WASM + traineddata) is loaded ONCE per browser session.
 * Subsequent images skip the ~5-10 s init and go straight to recognition.
 * Dynamic import ensures this never runs during SSR.
 */

export interface OcrWord {
  text: string;
  bbox: { x0: number; y0: number; x1: number; y1: number };
  confidence: number;
}

export interface OcrResult {
  text: string;
  words: OcrWord[];
  imageWidth: number;
  imageHeight: number;
}

type ProgressCallback = (progress: number) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TesseractWorker = any;

let workerPromise: Promise<TesseractWorker> | null = null;

// Routes progress events to whoever is currently calling runOcr()
let activeProgressCb: ProgressCallback | null = null;

function getWorker(): Promise<TesseractWorker> {
  if (workerPromise) return workerPromise;

  workerPromise = (async () => {
    const { createWorker } = await import("tesseract.js");
    const w = await createWorker("eng", 1, {
      workerPath: "/tesseract/tesseract-worker.min.js",
      logger: (m: { status: string; progress: number }) => {
        if (m.status === "recognizing text" && activeProgressCb) {
          activeProgressCb(Math.round(m.progress * 100));
        }
      },
    });
    return w;
  })();

  // Terminate cleanly on page unload
  if (typeof window !== "undefined") {
    window.addEventListener("beforeunload", () => {
      workerPromise?.then((w) => w.terminate()).catch(() => {});
      workerPromise = null;
    });
  }

  return workerPromise;
}

/**
 * Eagerly starts loading the Tesseract worker before the user clicks Convert.
 * Call this as soon as the first file is dropped/selected.
 */
export function warmUpWorker(): void {
  if (typeof window === "undefined") return;
  getWorker().catch(() => {}); // fire and forget
}

export async function runOcr(file: File, onProgress?: ProgressCallback): Promise<OcrResult> {
  const worker = await getWorker();

  activeProgressCb = onProgress ?? null;

  try {
    const url = URL.createObjectURL(file);
    const { data } = await worker.recognize(url);
    URL.revokeObjectURL(url);

    // Get actual image dimensions
    const dims = await getImageDimensions(file);
    let imageWidth  = dims.width;
    let imageHeight = dims.height;

    // Fallback: derive from block bboxes
    if (!imageWidth || !imageHeight) {
      (data.blocks as Array<{ bbox: { x1: number; y1: number } }> ?? []).forEach((b) => {
        imageWidth  = Math.max(imageWidth,  b.bbox.x1);
        imageHeight = Math.max(imageHeight, b.bbox.y1);
      });
      imageWidth  = imageWidth  || 1;
      imageHeight = imageHeight || 1;
    }

    const words: OcrWord[] = (data.words ?? []).map(
      (w: { text: string; bbox: { x0: number; y0: number; x1: number; y1: number }; confidence: number }) => ({
        text: w.text,
        bbox: { x0: w.bbox.x0, y0: w.bbox.y0, x1: w.bbox.x1, y1: w.bbox.y1 },
        confidence: w.confidence,
      })
    );

    return { text: data.text ?? "", words, imageWidth, imageHeight };
  } finally {
    activeProgressCb = null;
  }
}

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { resolve({ width: img.naturalWidth, height: img.naturalHeight }); URL.revokeObjectURL(url); };
    img.onerror = () => { resolve({ width: 0, height: 0 }); URL.revokeObjectURL(url); };
    img.src = url;
  });
}
