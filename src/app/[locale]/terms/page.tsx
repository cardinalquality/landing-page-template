import Image from 'next/image'
import { Link } from '@/i18n/navigation'

export const dynamic = 'force-dynamic'

export default function TermsOfServicePage() {

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href={"/" as any} className="inline-block">
            <Image
              src="/assets/eonlife/logos/eon logo 1000px.png"
              alt="EonLife"
              width={180}
              height={60}
              className="h-14 w-auto"
            />
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6 text-gray-700">
          <p className="text-sm text-gray-500">
            <strong>Effective Date:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. Agreement to Terms</h2>
            <p>
              Welcome to EonLife Global LLC (&quot;EonLife,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). By accessing or using our website and purchasing our products, you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, please do not use our website or services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">2. Product Information</h2>
            <p>
              EonLife is the exclusive authorized distributor of ReLuma skincare products in designated territories. We make every effort to display product information accurately, including descriptions, pricing, and availability. However, we reserve the right to correct any errors or inaccuracies and to change or update information at any time without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">3. Orders and Payments</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Order Acceptance:</strong> All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order for any reason.</li>
              <li><strong>Pricing:</strong> All prices are listed in USD and are subject to change without notice. You will be charged the price displayed at the time of purchase.</li>
              <li><strong>Payment:</strong> We accept payment via credit card, debit card, and other payment methods processed through Shopify Payments. Payment is due at the time of purchase.</li>
              <li><strong>Order Confirmation:</strong> You will receive an email confirmation once your order has been placed and another when it ships.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">4. Shipping and Delivery</h2>
            <p className="mb-3">
              We ship to addresses within the United States and select international locations. Shipping costs and estimated delivery times are provided during checkout. Please note:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Delivery times are estimates and not guaranteed</li>
              <li>We are not responsible for delays caused by shipping carriers or customs</li>
              <li>Risk of loss transfers to you upon delivery to the carrier</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">5. Returns and Refunds</h2>
            <p>
              Please refer to our <Link href={"/return-policy" as any} className="text-teal-600 hover:underline">Return Policy</Link> for detailed information about returns, exchanges, and refunds.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">6. Product Use and Safety</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Our products are intended for topical cosmetic use only</li>
              <li>Discontinue use if irritation occurs and consult a healthcare professional</li>
              <li>Keep products out of reach of children</li>
              <li>Results may vary by individual</li>
              <li>Products are not intended to diagnose, treat, cure, or prevent any disease</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">7. Intellectual Property</h2>
            <p>
              All content on this website, including text, graphics, logos, images, and software, is the property of EonLife Global LLC or its licensors and is protected by copyright, trademark, and other intellectual property laws. You may not use, reproduce, or distribute any content without our express written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">8. Account Responsibility</h2>
            <p>
              If you create an account on our website, you are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">9. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, EonLife Global LLC shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of our website or products, even if we have been advised of the possibility of such damages. Our total liability shall not exceed the amount you paid for the product.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">10. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless EonLife Global LLC and its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses arising out of your use of our website or products, or your violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">11. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of Florida, United States, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be resolved in the courts of Florida.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">12. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting to the website. Your continued use of our website and services after changes are posted constitutes your acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">13. Contact Information</h2>
            <p className="mb-3">
              If you have questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p><strong>EonLife Global LLC</strong></p>
              <p>Email: <a href="mailto:eonlifeglobal@gmail.com" className="text-teal-600 hover:underline">eonlifeglobal@gmail.com</a></p>
              <p>Phone: <a href="tel:4077430079" className="text-teal-600 hover:underline">407 743 0079</a></p>
            </div>
          </section>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link
            href={"/" as any}
            className="inline-block px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} EonLife Global LLC. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
