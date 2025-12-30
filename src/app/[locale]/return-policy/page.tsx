import Image from 'next/image'
import { Link } from '@/i18n/navigation'

export const dynamic = 'force-dynamic'

export default function ReturnPolicyPage() {

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
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Return Policy</h1>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6 text-gray-700">
          <p className="text-sm text-gray-500">
            <strong>Effective Date:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Our Commitment to Quality</h2>
            <p>
              At EonLife Global, we stand behind the quality of our ReLuma products. We want you to be completely satisfied with your purchase. This Return Policy outlines the circumstances under which we accept returns and issue refunds.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Defective or Damaged Products</h2>
            <p className="mb-3">
              We accept returns and offer full refunds or replacements for products that are:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Defective:</strong> Products with manufacturing defects or quality issues</li>
              <li><strong>Damaged in Transit:</strong> Products that arrive damaged or broken</li>
              <li><strong>Incorrect Items:</strong> If you receive the wrong product or quantity</li>
            </ul>
            <p className="mt-3">
              Please contact us within <strong>7 days of delivery</strong> with photos of the defective or damaged product and packaging. We will arrange for a return and provide a full refund or replacement at no additional cost.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Non-Returnable Items</h2>
            <p className="mb-3">
              Due to the nature of our skincare products and for hygiene and safety reasons, we <strong>cannot accept returns</strong> for:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Opened or used products</li>
              <li>Products with broken or removed seals</li>
              <li>Products purchased more than 30 days ago</li>
              <li>Products showing signs of use or tampering</li>
              <li>Change of mind or buyer's remorse</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">How to Initiate a Return</h2>
            <p className="mb-3">
              If you received a defective or damaged product, please follow these steps:
            </p>
            <ol className="list-decimal pl-6 space-y-3">
              <li>
                <strong>Contact Us:</strong> Email us at <a href="mailto:eonlifeglobal@gmail.com" className="text-teal-600 hover:underline">eonlifeglobal@gmail.com</a> or call <a href="tel:4077430079" className="text-teal-600 hover:underline">407 743 0079</a> within 7 days of delivery
              </li>
              <li>
                <strong>Provide Details:</strong> Include your order number, photos of the product and packaging showing the defect or damage, and a description of the issue
              </li>
              <li>
                <strong>Await Authorization:</strong> Our team will review your request and provide a return authorization and instructions if approved
              </li>
              <li>
                <strong>Ship the Product:</strong> Follow the provided return instructions. We will provide a prepaid return label for defective or damaged items
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Refund Process</h2>
            <p className="mb-3">
              Once we receive and inspect your returned product:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>We will notify you by email of the approval or rejection of your refund</li>
              <li>If approved, your refund will be processed within 5-7 business days</li>
              <li>The refund will be credited to your original payment method</li>
              <li>Please allow additional time for your bank or credit card company to process the refund</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Exchanges</h2>
            <p>
              If you received a defective or incorrect product and would like an exchange rather than a refund, please indicate this when contacting us. We will ship the replacement product at no additional cost once we receive the returned item.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Shipping Costs</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Defective/Damaged Products:</strong> We cover all return shipping costs and provide a prepaid label</li>
              <li><strong>Incorrect Items:</strong> We cover all return and replacement shipping costs</li>
              <li><strong>Non-Defective Returns:</strong> Not applicable as we do not accept returns for opened or used products</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Product Satisfaction</h2>
            <p>
              While we cannot accept returns for opened products, we are committed to your satisfaction. If you experience any adverse reactions or are unsatisfied with your unopened product, please contact us. We will work with you to address your concerns and may offer alternative solutions on a case-by-case basis.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Contact Information</h2>
            <p className="mb-3">
              For return requests or questions about our Return Policy, please contact:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p><strong>EonLife Global LLC</strong></p>
              <p>Email: <a href="mailto:eonlifeglobal@gmail.com" className="text-teal-600 hover:underline">eonlifeglobal@gmail.com</a></p>
              <p>Phone: <a href="tel:4077430079" className="text-teal-600 hover:underline">407 743 0079</a></p>
            </div>
          </section>

          <section className="bg-teal-50 border-l-4 border-teal-500 p-4 rounded-r-lg">
            <p className="font-semibold text-teal-900 mb-2">Important Note:</p>
            <p className="text-teal-800">
              We strongly recommend reviewing product descriptions, ingredients, and usage instructions before opening any product. This helps ensure the product is suitable for your needs and reduces the likelihood of dissatisfaction.
            </p>
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
