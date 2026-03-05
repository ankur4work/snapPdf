import { PdfToolClient } from "@/components/PdfToolClient";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="relative flex-1 overflow-hidden bg-gradient-to-b from-violet-50/60 via-white to-indigo-50/40">
        {/* Background decoration */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-violet-100/40 blur-3xl" />
          <div className="absolute top-1/3 -right-32 h-[400px] w-[400px] rounded-full bg-indigo-100/30 blur-3xl" />
          <div className="absolute bottom-0 -left-32 h-[400px] w-[400px] rounded-full bg-violet-100/20 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl px-4 pb-20 pt-14 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="mb-12 text-center fade-in-up">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white/80 px-4 py-2 text-xs font-medium text-violet-700 shadow-sm backdrop-blur-sm fade-in-up">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 shadow shadow-emerald-300">
                <span className="h-2 w-2 animate-ping rounded-full bg-emerald-400 opacity-75" />
              </span>
              Free to try · No account · 100% private
            </div>

            <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl fade-in-up fade-in-up-1">
              Turn Screenshots into{" "}
              <span className="gradient-text">Perfect PDFs</span>
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-base text-slate-500 sm:text-lg fade-in-up fade-in-up-2">
              Drag-and-drop your images and get a fully{" "}
              <strong className="text-slate-700">OCR-searchable PDF</strong> in seconds.
              Everything runs in your browser — your files never touch a server.
            </p>

            {/* Feature pills */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 fade-in-up fade-in-up-3">
              {[
                { icon: "🔒", label: "Zero uploads" },
                { icon: "⚡", label: "Instant results" },
                { icon: "🔍", label: "OCR searchable" },
                { icon: "📄", label: "Multi-page PDF" },
              ].map(({ icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white/90 px-3.5 py-1.5 text-sm font-medium text-gray-700 shadow-sm"
                >
                  <span>{icon}</span>
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Converter card */}
          <PdfToolClient />
        </div>
      </main>

      <Footer />
    </div>
  );
}
