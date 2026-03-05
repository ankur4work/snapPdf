import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — SnapPDF",
  description: "SnapPDF terms of service and usage agreement.",
};

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-violet-50/40 via-white to-white">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10">
            <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">Legal</span>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900">Terms of Service</h1>
            <p className="mt-2 text-slate-500">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
          </div>

          <div className="space-y-8 text-slate-600">

            <Section title="1. Acceptance of terms">
              <p>By accessing or using SnapPDF ("the Service"), you agree to be bound by these
              Terms of Service. If you do not agree, please do not use the Service.</p>
            </Section>

            <Section title="2. Description of service">
              <p>SnapPDF is a browser-based tool that converts images and text to PDF documents.
              All processing occurs client-side in your browser. The Service provides:</p>
              <ul>
                <li>Image to searchable PDF conversion using OCR technology</li>
                <li>Text to PDF conversion</li>
                <li>2 free conversions per browser session</li>
                <li>Additional conversion credits available for purchase</li>
              </ul>
            </Section>

            <Section title="3. Credits and payments">
              <ul>
                <li>New users receive <strong>2 free conversions</strong> at no charge.</li>
                <li>Additional credits are available in packs of <strong>50 credits for $5.00 USD</strong>.</li>
                <li>Credits are stored in your browser's localStorage and are non-transferable.</li>
                <li>Credits do not expire but are tied to your browser/device.</li>
                <li>Clearing your browser data will remove your credits. We cannot restore lost credits.</li>
                <li>All payments are processed by PayPal. By making a purchase you also agree to <a href="https://www.paypal.com/us/legalhub/useragreement-full" target="_blank" rel="noopener noreferrer">PayPal's User Agreement</a>.</li>
              </ul>
            </Section>

            <Section title="4. Refund policy">
              <p>Due to the digital nature of the product, <strong>all sales are final</strong>. We do not
              offer refunds once credits have been granted to your browser. If you experience a
              technical issue where payment was taken but credits were not granted, contact us
              within 7 days with proof of payment and we will resolve it.</p>
            </Section>

            <Section title="5. Acceptable use">
              <p>You agree not to use SnapPDF to:</p>
              <ul>
                <li>Convert illegal, harmful, or infringing content</li>
                <li>Attempt to reverse engineer, scrape, or abuse the service</li>
                <li>Use automated tools to consume credits fraudulently</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>
            </Section>

            <Section title="6. Intellectual property">
              <p>You retain full ownership of all content you convert using SnapPDF. We claim
              no rights over your images or documents. The SnapPDF software, design, and branding
              are our intellectual property.</p>
            </Section>

            <Section title="7. Disclaimer of warranties">
              <p>The Service is provided "as is" without warranties of any kind. We do not guarantee
              that the Service will be uninterrupted, error-free, or that OCR results will be
              perfectly accurate. OCR accuracy depends on image quality and content.</p>
            </Section>

            <Section title="8. Limitation of liability">
              <p>To the maximum extent permitted by law, SnapPDF shall not be liable for any
              indirect, incidental, special, or consequential damages arising from your use of
              the Service, including loss of data or credits due to browser data clearing.</p>
            </Section>

            <Section title="9. Changes to terms">
              <p>We reserve the right to modify these terms at any time. Changes will be posted
              on this page with an updated date. Continued use of the Service after changes
              constitutes your acceptance of the new terms.</p>
            </Section>

            <Section title="10. Contact">
              <p>For questions about these terms, please contact us through the GitHub repository
              linked in the footer.</p>
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
