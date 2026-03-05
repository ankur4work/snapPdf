import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div className="sm:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-base font-bold text-white">SnapPDF</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed">
              Turn screenshots into perfect, searchable PDFs — entirely in your browser. No server uploads, no account required.
            </p>
            {/* Privacy badge */}
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-xs font-medium text-slate-300">
              <svg className="h-3.5 w-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Private by design
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Product</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "How it works", href: "/how-it-works" },
                { label: "Pricing", href: "/pricing" },
                { label: "Privacy policy", href: "/privacy" },
                { label: "Terms of service", href: "/terms" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="transition-colors hover:text-slate-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech stack */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Built with</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "Next.js 14 (App Router)", href: "https://nextjs.org" },
                { label: "Tesseract.js — WASM OCR", href: "https://tesseract.projectnaptha.com" },
                { label: "pdf-lib — PDF generation", href: "https://pdf-lib.js.org" },
                { label: "PayPal Smart Buttons", href: "https://developer.paypal.com" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-slate-200"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 sm:flex-row">
          <p className="text-xs">
            © {new Date().getFullYear()} SnapPDF. All rights reserved.
          </p>
          <p className="text-xs">
            Made with{" "}
            <span className="text-red-400">♥</span>
            {" "}using open-source tools · Zero data collection
          </p>
        </div>
      </div>
    </footer>
  );
}
