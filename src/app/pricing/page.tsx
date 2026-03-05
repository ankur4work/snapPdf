import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — SnapPDF",
  description: "Simple, one-time pricing. 2 free conversions, then $5 for 50 credits.",
};

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-violet-50/40 via-white to-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">

          {/* Hero */}
          <div className="mb-16 text-center">
            <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">Pricing</span>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900">
              Simple, honest pricing
            </h1>
            <p className="mt-3 text-lg text-slate-500">No subscriptions. No hidden fees. Pay once, use anytime.</p>
          </div>

          {/* Plans */}
          <div className="mx-auto grid max-w-2xl gap-6 sm:grid-cols-2">

            {/* Free */}
            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Free</p>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold text-slate-900">$0</span>
                </div>
                <p className="mt-1 text-sm text-slate-500">No credit card required</p>
              </div>
              <ul className="mb-8 space-y-3 text-sm text-slate-600">
                {[
                  "2 free conversions",
                  "Image → searchable PDF",
                  "Text → PDF",
                  "A4 centered layout",
                  "OCR text layer",
                  "Instant download",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <svg className="h-4 w-4 flex-shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/"
                className="block w-full rounded-xl border border-violet-200 bg-violet-50 py-3 text-center text-sm font-semibold text-violet-700 transition hover:bg-violet-100"
              >
                Start for free →
              </Link>
            </div>

            {/* Paid */}
            <div className="relative rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-600 p-8 text-white shadow-xl shadow-violet-200">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-amber-900 shadow">
                  Most Popular
                </span>
              </div>
              <div className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-wide text-violet-200">Credit Pack</p>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold">$5</span>
                  <span className="text-violet-300">one-time</span>
                </div>
                <p className="mt-1 text-sm text-violet-200">50 conversion credits</p>
              </div>
              <ul className="mb-8 space-y-3 text-sm text-violet-100">
                {[
                  "50 conversion credits",
                  "Everything in Free",
                  "Credits never expire",
                  "No subscription",
                  "Stored in your browser",
                  "Instant access after payment",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <svg className="h-4 w-4 flex-shrink-0 text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/"
                className="block w-full rounded-xl bg-white py-3 text-center text-sm font-bold text-violet-700 shadow transition hover:bg-violet-50"
              >
                Get 50 credits →
              </Link>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-20">
            <h2 className="mb-8 text-center text-2xl font-bold text-slate-900">Common questions</h2>
            <div className="space-y-4">
              {[
                {
                  q: "Do credits expire?",
                  a: "No. Credits are stored in your browser's localStorage and never expire. However, clearing your browser data will remove them."
                },
                {
                  q: "Can I use credits on multiple devices?",
                  a: "Credits are tied to the browser they were purchased on. They don't sync across devices."
                },
                {
                  q: "What payment methods are accepted?",
                  a: "We accept all payment methods supported by PayPal including credit cards, debit cards, and PayPal balance."
                },
                {
                  q: "Is there a refund policy?",
                  a: "Due to the digital nature of the product, all sales are final once credits are granted. See our Terms of Service for details."
                },
                {
                  q: "How many images can I convert per credit?",
                  a: "One credit = one conversion batch. A batch can include multiple images, all compiled into a single PDF."
                },
              ].map(({ q, a }) => (
                <div key={q} className="rounded-2xl border border-gray-100 bg-white p-6">
                  <h3 className="font-semibold text-slate-800">{q}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{a}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
