import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works — SnapPDF",
  description: "Learn how SnapPDF converts images to searchable PDFs entirely in your browser.",
};

const steps = [
  {
    number: "01",
    icon: "🖼️",
    title: "Drop your images",
    desc: "Drag and drop screenshots, photos, or any images (PNG, JPG, WEBP, GIF, BMP). Select multiple files for a multi-page PDF.",
  },
  {
    number: "02",
    icon: "🔍",
    title: "OCR runs in your browser",
    desc: "Tesseract.js (a WebAssembly OCR engine) reads the text in each image — entirely on your device. Nothing is uploaded to any server.",
  },
  {
    number: "03",
    icon: "📄",
    title: "PDF is generated client-side",
    desc: "pdf-lib assembles a proper A4 PDF with your images centered and an invisible text layer added — making the PDF fully searchable and copy-pasteable.",
  },
  {
    number: "04",
    icon: "⬇️",
    title: "Instant download",
    desc: "Your PDF is ready in seconds. Click Download and it saves directly to your device. No email, no account, no waiting.",
  },
];

const features = [
  { icon: "🔒", title: "100% Private", desc: "Your files never touch our servers. All processing happens in your browser using WebAssembly." },
  { icon: "🔍", title: "OCR Searchable", desc: "Text from your images is extracted and embedded invisibly, so you can search, copy, and paste from the PDF." },
  { icon: "📐", title: "A4 Centered", desc: "Every image is scaled and centered on a standard A4 page with consistent margins, regardless of original size." },
  { icon: "📝", title: "Text to PDF", desc: "Paste any text and instantly convert it to a properly formatted, paginated A4 PDF." },
  { icon: "⚡", title: "Fast", desc: "The OCR engine loads once and is reused for all images, making multi-image batches significantly faster." },
  { icon: "💳", title: "Pay once, no subscription", desc: "2 free conversions to try. Then $5 for 50 credits — no monthly fees, no expiry." },
];

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-violet-50/40 via-white to-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">

          {/* Hero */}
          <div className="mb-16 text-center">
            <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">How it works</span>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Screenshots → Perfect PDFs
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-500">
              Everything runs in your browser. No uploads, no accounts, no waiting.
            </p>
          </div>

          {/* Steps */}
          <div className="mb-20 grid gap-6 sm:grid-cols-2">
            {steps.map((step) => (
              <div key={step.number} className="relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-2xl">{step.icon}</span>
                  <span className="text-xs font-bold tracking-widest text-violet-400">{step.number}</span>
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-800">{step.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Features grid */}
          <div className="mb-16">
            <h2 className="mb-8 text-center text-2xl font-bold text-slate-900">Everything you need</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <div key={f.title} className="rounded-xl border border-gray-100 bg-gray-50/60 p-5">
                  <div className="mb-2 text-2xl">{f.icon}</div>
                  <h3 className="mb-1 font-semibold text-slate-800">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-500">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-600 p-10 text-center text-white shadow-xl">
            <h2 className="text-2xl font-bold">Ready to try it?</h2>
            <p className="mt-2 text-violet-200">2 free conversions — no account required.</p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-violet-700 shadow transition hover:bg-violet-50"
            >
              Start converting →
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
