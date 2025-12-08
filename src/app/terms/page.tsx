import { Metadata } from 'next'
import { getTenantConfig } from '@/tenants/config'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms and conditions for using our services',
}

export default function TermsOfServicePage() {
  const tenant = getTenantConfig('eonlife')!
  const companyName = tenant.name
  const lastUpdated = 'December 8, 2024'

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold mb-4" style={{ color: tenant.theme.primaryColor }}>
          Terms of Service
        </h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: {lastUpdated}</p>

        <div className="space-y-8 text-gray-700">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: tenant.theme.primaryColor }}>
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using this website, you accept and agree to be bound by the terms and conditions of this agreement. If you do not agree to these terms, please do not use our website or services.
            </p>
          </section>

          {/* Use of Service */}
          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: tenant.theme.primaryColor }}>
              2. Use of Service
            </h2>
            <p className="mb-4">You agree to use our service only for lawful purposes. You must not:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Transmit harmful or malicious code</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use our service for fraudulent purposes</li>
            </ul>
          </section>

          {/* Product Information */}
          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: tenant.theme.primaryColor }}>
              3. Product Information and Availability
            </h2>
            <p className="mb-4">
              We strive to provide accurate product information, but we do not warrant that product descriptions, pricing, or other content is accurate, complete, or error-free. We reserve the right to correct errors and update information at any time without prior notice.
            </p>
            <p>
              Product availability is subject to change. We reserve the right to limit quantities or discontinue products at any time.
            </p>
          </section>

          {/* Orders and Payment */}
          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: tenant.theme.primaryColor }}>
              4. Orders and Payment
            </h2>
            <p className="mb-4">
              By placing an order, you represent that you are at least 18 years old and legally capable of entering into binding contracts.
            </p>
            <p className="mb-4">
              All prices are in USD and include applicable taxes. Payment must be received before order fulfillment. We accept payment through Shopify and Stripe payment processors.
            </p>
            <p>
              We reserve the right to refuse or cancel any order at our discretion.
            </p>
          </section>

          {/* Shipping and Delivery */}
          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: tenant.theme.primaryColor }}>
              5. Shipping and Delivery
            </h2>
            <p className="mb-4">
              Shipping times are estimates and not guaranteed. We are not responsible for delays caused by shipping carriers or customs.
            </p>
            <p>
              Risk of loss and title for items purchased pass to you upon delivery to the carrier.
            </p>
          </section>

          {/* Returns and Refunds */}
          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: tenant.theme.primaryColor }}>
              6. Returns and Refunds
            </h2>
            <p className="mb-4">
              We accept returns within 30 days of delivery for unopened products in original packaging. Refunds will be issued to the original payment method within 5-10 business days of receiving the returned item.
            </p>
            <p>
              Customer is responsible for return shipping costs unless the product is defective or we made an error.
            </p>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: tenant.theme.primaryColor }}>
              7. Intellectual Property
            </h2>
            <p>
              All content on this website, including text, images, logos, and trademarks, is the property of {companyName} or its licensors and is protected by copyright and trademark laws. You may not use, reproduce, or distribute any content without our express written permission.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: tenant.theme.primaryColor }}>
              8. Limitation of Liability
            </h2>
            <p className="mb-4">
              To the fullest extent permitted by law, {companyName} shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or other intangible losses.
            </p>
            <p>
              Our total liability for any claim arising out of or relating to these terms shall not exceed the amount you paid for the product in question.
            </p>
          </section>

          {/* Indemnification */}
          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: tenant.theme.primaryColor }}>
              9. Indemnification
            </h2>
            <p>
              You agree to indemnify and hold {companyName} harmless from any claims, damages, or expenses arising from your use of our service or violation of these terms.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: tenant.theme.primaryColor }}>
              10. Governing Law
            </h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: tenant.theme.primaryColor }}>
              11. Changes to Terms
            </h2>
            <p>
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the service after changes constitutes acceptance of the modified terms.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: tenant.theme.primaryColor }}>
              12. Contact Information
            </h2>
            <p className="mb-4">For questions about these Terms of Service, please contact us:</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold">{companyName}</p>
              <p>Email: support@{tenant.domain}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
