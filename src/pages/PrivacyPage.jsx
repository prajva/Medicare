import { Shield, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 md:p-12">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">PRIVACY POLICY</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">MediCare Plus – Online Pharmacy Web Application | Last Updated: 11 September 2026</p>
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">1. INTRODUCTION</h2>
            <p>
              MediCare Plus ("we", "us", "our") operates this website and web application (the "Service") that allows customers to browse medicines, place orders, and have them delivered. This Privacy Policy explains what information we collect, how we use it, and the choices you have regarding your data.
            </p>
            <p className="mt-2">
              By creating an account or using the Service, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">2. INFORMATION WE COLLECT</h2>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mt-2">2.1 Information you provide to us</h3>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li>Account details: full name, email address, phone number, and password (stored in encrypted/hashed form, never in plain text)</li>
              <li>Delivery details: shipping address, city, state, pincode, and contact number provided at checkout</li>
              <li>Order information: medicines added to cart, quantities, and order history</li>
            </ul>

            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mt-3">2.2 Information collected automatically</h3>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li>Login sessions and authentication tokens, used to keep you signed in</li>
              <li>Basic usage data such as pages visited and actions taken within the app (e.g. items viewed, cart activity), used only to operate the Service</li>
            </ul>
            <p className="mt-2 text-gray-500 dark:text-gray-400 italic">
              We do not knowingly collect sensitive medical/health records beyond the names of the products you choose to purchase.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">3. HOW WE USE YOUR INFORMATION</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li>Create and manage your account</li>
              <li>Process and fulfil your orders, including delivery</li>
              <li>Show you relevant medicines and maintain your cart and order history</li>
              <li>Communicate with you about your orders, account, or support requests</li>
              <li>Maintain the security of the Service and prevent unauthorised access</li>
              <li>Improve and troubleshoot the Service</li>
            </ul>
            <p className="mt-2 font-medium">We do not sell your personal information to third parties.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">4. HOW WE STORE AND PROTECT YOUR INFORMATION</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Your password is never stored in plain text; it is hashed using industry-standard methods before being saved to our database.</li>
              <li>Your data is stored in a persistent database and is retained as long as your account remains active or as needed to provide the Service.</li>
              <li>We take reasonable technical measures to protect your data from unauthorised access, alteration, or disclosure. However, no method of electronic storage or transmission is 100% secure, and we cannot guarantee absolute security.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">5. COOKIES AND SESSION DATA</h2>
            <p>
              We use session tokens/cookies to keep you logged in and to remember items in your cart. These are necessary for the core functioning of the Service. You may be able to clear cookies through your browser, but this may log you out or clear your cart.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">6. SHARING OF INFORMATION</h2>
            <p>We may share your information only in the following limited circumstances:</p>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li>With service providers who help us operate the Service (e.g. hosting, database, and delivery-related functions), solely for that purpose</li>
              <li>If required by law, regulation, or a valid legal request</li>
              <li>To protect the rights, safety, or property of MediCare Plus, our users, or the public</li>
            </ul>
            <p className="mt-2 font-medium">We do not share your data with advertisers or unrelated third parties.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">7. YOUR RIGHTS AND CHOICES</h2>
            <p>Subject to applicable law, you may:</p>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li>Access, update, or correct your account information</li>
              <li>Request deletion of your account and associated personal data</li>
              <li>Log out of the Service at any time, which ends your active session</li>
            </ul>
            <p className="mt-2">To exercise any of these rights, please contact us using the details in Section 10.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">8. CHILDREN'S PRIVACY</h2>
            <p>
              The Service is not intended for individuals under the age of 18. We do not knowingly collect personal information from minors. If you believe a minor has provided us with personal information, please contact us so we can remove it.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">9. CHANGES TO THIS PRIVACY POLICY</h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with a revised "Last Updated" date. Continued use of the Service after changes are posted constitutes acceptance of the revised policy.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">10. CONTACT US</h2>
            <p>If you have any questions about this Privacy Policy or how your data is handled, please contact us at:</p>
            <p className="font-semibold text-blue-600 dark:text-blue-400 mt-1">Email: support@medicareplus.example.com</p>
          </section>

          <div className="mt-8 p-4 bg-blue-50 dark:bg-gray-700/50 rounded-2xl border border-blue-100 dark:border-gray-600 text-xs text-gray-500 dark:text-gray-400">
            <strong>NOTE:</strong> This document is a general-purpose privacy policy template prepared for a student/hackathon project (VTAPP 2026 – Reverse Engineer). It is provided for demonstration purposes and does not constitute legal advice. Before using this application with real users or real payment/health data, consult a qualified legal professional to ensure compliance with applicable data protection laws (e.g. India's DPDP Act, GDPR, or other regional regulations).
          </div>
        </div>
      </div>
    </div>
  )
}
