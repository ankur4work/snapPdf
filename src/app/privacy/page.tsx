import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — SnapPDF",
  description: "SnapPDF privacy policy. Your images never leave your browser.",
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-violet-50/40 via-white to-white">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10">
            <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">Legal</span>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900">Privacy Policy</h1>
            <p className="mt-2 text-slate-500">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
          </div>

          <div className="prose prose-slate max-w-none space-y-8 text-slate-600">

            <section className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
              <h2 className="text-lg font-bold text-emerald-800">🔒 The short version</h2>
              <p className="mt-2 text-emerald-700">
                <strong>Your images and documents never leave your device.</strong> All OCR and PDF processing
                happens entirely in your browser. We do not collect, store, or transmit your files to any server.
              </p>
            </section>

            <Section title="1. Who we are">
              <p>SnapPDF ("we", "our", "us") is an online tool that converts images to searchable PDFs.
              The service is accessible at this website.</p>
            </Section>

            <Section title="2. Data we do NOT collect">
              <ul>
                <li>We do <strong>not</strong> upload your images or documents to any server.</li>
                <li>We do <strong>not</strong> store the content of your files.</li>
                <li>We do <strong>not</strong> require you to create an account.</li>
                <li>We do <strong>not</strong> track your usage beyond what is described below.</li>
              </ul>
            </Section>

            <Section title="3. Data stored locally on your device">
              <p>We store the following data in your browser's <strong>localStorage</strong> only:</p>
              <ul>
                <li>Number of free conversions remaining</li>
                <li>Number of paid credits remaining</li>
                <li>Total lifetime conversion count</li>
              </ul>
              <p>This data never leaves your browser and can be cleared by clearing your browser data.</p>
            </Section>

            <Section title="4. Payment processing">
              <p>Payments are processed by <strong>PayPal</strong>. When you make a purchase:</p>
              <ul>
                <li>You are redirected to PayPal's secure checkout.</li>
                <li>PayPal collects your payment information — we never see your card or bank details.</li>
                <li>PayPal shares only a transaction confirmation with us to grant your credits.</li>
                <li>PayPal's privacy policy applies to payment data: <a href="https://www.paypal.com/us/legalhub/privacy-full" target="_blank" rel="noopener noreferrer" className="text-violet-600 underline">paypal.com/privacy</a></li>
              </ul>
            </Section>

            <Section title="5. Analytics and cookies">
              <p>We do not use any third-party analytics, advertising cookies, or tracking pixels.
              We do not use Google Analytics or any similar service.</p>
              <p>Vercel (our hosting provider) may collect standard server logs including IP addresses
              for security and performance purposes. See <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-violet-600 underline">Vercel's privacy policy</a>.</p>
            </Section>

            <Section title="6. Children's privacy">
              <p>SnapPDF is not directed at children under 13. We do not knowingly collect
              any personal information from children.</p>
            </Section>

            <Section title="7. Changes to this policy">
              <p>We may update this privacy policy from time to time. Changes will be posted
              on this page with an updated date. Continued use of the service after changes
              constitutes acceptance.</p>
            </Section>

            <Section title="8. Contact">
              <p>If you have questions about this privacy policy, please contact us through
              the GitHub repository linked in the footer.</p>
            </Section>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-xl font-bold text-slate-800">{title}</h2>
      <div className="space-y-3 leading-relaxed [&_a]:text-violet-600 [&_a]:underline [&_li]:ml-4 [&_li]:list-disc [&_ul]:space-y-1">
        {children}
      </div>
    </section>
  );
}
