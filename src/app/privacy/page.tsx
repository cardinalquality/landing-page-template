import { Metadata } from 'next'
import { getTenantConfig } from '@/tenants/config'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Our commitment to protecting your privacy and personal data',
}

export default function PrivacyPolicyPage() {
  const tenant = getTenantConfig('eonlife')!
  const companyName = tenant.name
  const lastUpdated = 'December 8, 2024'

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold mb-4" style={{ color: tenant.theme.primaryColor }}>
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: {lastUpdated}</p>

        <div className="space-y-8 text-gray-700">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: tenant.theme.primaryColor }}>
              1. Introduction
            </h2>
            <p className="mb-4">
              {companyName} ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
            </p>
            <p>
              By using our website, you consent to the data practices described in this policy. If you do not agree with this policy, please do not use our website.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: tenant.theme.primaryColor }}>
              2. Information We Collect
            </h2>

            <h3 className="text-xl font-semibold mb-2">2.1 Personal Information</h3>
            <p className="mb-4">We may collect personal information that you voluntarily provide, including:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Name and contact information (email address, phone number, shipping address)</li>
              <li>Payment information (processed securely through Shopify and Stripe)</li>
              <li>Account credentials (username and password)</li>
              <li>Order history and purchase information</li>
              <li>Communication preferences</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2">2.2 Automatically Collected Information</h3>
            <p className="mb-4">When you visit our website, we automatically collect:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>IP address and browser type</li>
              <li>Device information and operating system</li>
              <li>Pages visited and time spent on our site</li>
              <li>Referring website addresses</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: tenant.theme.primaryColor }}>
              3. How We Use Your Information
            </h2>
            <p className="mb-4">We use your information to:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about your orders and account</li>
              <li>Provide customer support</li>
              <li>Send you marketing communications (with your consent)</li>
              <li>Improve our website and services</li>
              <li>Detect and prevent fraud</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          {/* Cookies and Tracking */}
          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: tenant.theme.primaryColor }}>
              4. Cookies and Tracking Technologies
            </h2>
            <p className="mb-4">
              We use cookies and similar tracking technologies to enhance your experience on our website. Cookies are small data files stored on your device.
            </p>

            <h3 className="text-xl font-semibold mb-2">Types of Cookies We Use:</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Essential Cookies:</strong> Required for the website to function (e.g., shopping cart)</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
              <li><strong>Marketing Cookies:</strong> Used to show you relevant advertisements</li>
            </ul>

            <p className="mb-4">
              You can control cookies through your browser settings. However, disabling cookies may limit your ability to use certain features of our website.
            </p>
          </section>

          {/* Data Sharing */}
          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: tenant.theme.primaryColor }}>
              5. How We Share Your Information
            </h2>
            <p className="mb-4">We may share your information with:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Service Providers:</strong> Shopify (e-commerce platform), Stripe (payment processing), shipping carriers</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, sale, or acquisition</li>
            </ul>
            <p>
              We do not sell your personal information to third parties for their marketing purposes.
            </p>
          </section>

          {/* GDPR Rights */}
          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: tenant.theme.primaryColor }}>
              6. Your Rights Under GDPR (EU/UK Residents)
            </h2>
            <p className="mb-4">If you are located in the European Union or United Kingdom, you have the following rights:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
              <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your personal data ("right to be forgotten")</li>
              <li><strong>Right to Restrict Processing:</strong> Limit how we use your data</li>
              <li><strong>Right to Data Portability:</strong> Receive your data in a machine-readable format</li>
              <li><strong>Right to Object:</strong> Object to processing of your data for certain purposes</li>
              <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for data processing at any time</li>
            </ul>
            <p className="mb-4">
              To exercise these rights, please contact us at the email address provided below. We will respond within 30 days.
            </p>
          </section>

          {/* CCPA Rights */}
          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: tenant.theme.primaryColor }}>
              7. Your Rights Under CCPA (California Residents)
            </h2>
            <p className="mb-4">If you are a California resident, you have the following rights:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Right to Know:</strong> Request information about personal data we've collected</li>
              <li><strong>Right to Delete:</strong> Request deletion of your personal data</li>
              <li><strong>Right to Opt-Out:</strong> Opt-out of the sale of personal data (we do not sell personal data)</li>
              <li><strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising your rights</li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: tenant.theme.primaryColor }}>
              8. Data Security
            </h2>
            <p className="mb-4">
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, loss, or misuse. This includes:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>SSL encryption for data transmission</li>
              <li>Secure payment processing through PCI-compliant providers</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication</li>
            </ul>
            <p>
              However, no method of transmission over the internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
            </p>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: tenant.theme.primaryColor }}>
              9. Data Retention
            </h2>
            <p>
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law. Order information is typically retained for 7 years for tax and accounting purposes.
            </p>
          </section>

          {/* International Transfers */}
          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: tenant.theme.primaryColor }}>
              10. International Data Transfers
            </h2>
            <p className="mb-4">
              Your information may be transferred to and processed in countries outside your country of residence, including the United States. These countries may have different data protection laws.
            </p>
            <p>
              When we transfer your data internationally, we ensure appropriate safeguards are in place, such as Standard Contractual Clauses approved by the European Commission.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: tenant.theme.primaryColor }}>
              11. Children's Privacy
            </h2>
            <p>
              Our website is not intended for children under 16 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
            </p>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: tenant.theme.primaryColor }}>
              12. Changes to This Privacy Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. Continued use of our website after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Contact Us */}
          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: tenant.theme.primaryColor }}>
              13. Contact Us
            </h2>
            <p className="mb-4">
              If you have questions about this Privacy Policy or wish to exercise your rights, please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold">{companyName}</p>
              <p>Email: privacy@{tenant.domain}</p>
              <p>Response Time: Within 30 days</p>
            </div>
            <p className="mt-4">
              For GDPR-related inquiries, you also have the right to lodge a complaint with your local data protection authority.
            </p>
          </section>

          {/* Legal Basis */}
          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: tenant.theme.primaryColor }}>
              14. Legal Basis for Processing (GDPR)
            </h2>
            <p className="mb-4">We process your personal data based on the following legal grounds:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Contract:</strong> To fulfill our contract with you (process orders)</li>
              <li><strong>Consent:</strong> When you've given explicit consent (marketing communications)</li>
              <li><strong>Legitimate Interests:</strong> To improve our services and prevent fraud</li>
              <li><strong>Legal Obligation:</strong> To comply with applicable laws</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
