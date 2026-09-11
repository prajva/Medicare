import { FileText, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 md:p-12">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/40 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">TERMS AND CONDITIONS</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">MediCare Plus – Online Pharmacy Web Application | Last Updated: 11 September 2026</p>
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">1. ACCEPTANCE OF TERMS</h2>
            <p>
              By accessing or using the MediCare Plus website and web application (the "Service"), you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree with these Terms, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">2. ELIGIBILITY</h2>
            <p>
              You must be at least 18 years old, or have the consent of a parent or legal guardian, to create an account and place orders on the Service.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">3. ACCOUNT REGISTRATION</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>You must provide accurate, current, and complete information (name, email, phone number, and password) when creating an account.</li>
              <li>You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account.</li>
              <li>You agree to notify us immediately of any unauthorised use of your account.</li>
              <li>We reserve the right to suspend or terminate accounts that provide false information or violate these Terms.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">4. PRODUCT LISTINGS AND PRICING</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Medicines and other products listed on the Service are displayed with their name, price, and description for your convenience.</li>
              <li>Product images may be for illustration purposes only.</li>
              <li>We make reasonable efforts to ensure prices and product information are accurate, but errors may occur. In case of a pricing error, we reserve the right to cancel or correct the affected order before dispatch.</li>
              <li>Availability of products is not guaranteed and may change without notice.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">5. ORDERS AND CHECKOUT</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Placing an order through the Service constitutes an offer to purchase the selected items, which we may accept or decline.</li>
              <li>At checkout, you must provide accurate delivery details (name, address, and phone number).</li>
              <li>Currently, the only supported payment method is Cash on Delivery (COD). Payment is due to the delivery personnel at the time of delivery.</li>
              <li>Once placed, an order is recorded in our system and will be visible in your order history. Cancellations or changes after an order is placed may not always be possible.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">6. DELIVERY</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>We aim to deliver orders in a timely manner, but delivery timelines are estimates only and are not guaranteed.</li>
              <li>Risk of loss and title for products pass to you upon delivery.</li>
              <li>You are responsible for ensuring someone is available to receive the order and make payment (for COD orders) at the delivery address provided.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">7. MEDICAL DISCLAIMER</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>MediCare Plus is an online storefront for browsing and ordering medicines and healthcare products; it does not provide medical advice, diagnosis, or treatment.</li>
              <li>Always read product labels and consult a qualified doctor or pharmacist before taking any medication, especially prescription medicines.</li>
              <li>We are not responsible for misuse of any product ordered through the Service.</li>
              <li>In case of a medical emergency, contact your local emergency services immediately rather than relying on this Service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">8. CANCELLATIONS, RETURNS, AND REFUNDS</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Requests for cancellation, return, or refund must be raised through our support contact as soon as possible after the order is placed.</li>
              <li>Due to the nature of pharmaceutical products, certain items (e.g. opened medicines) may not be eligible for return once delivered, except where required by law or in case of a genuine defect or wrong item delivered.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">9. USER CONDUCT</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li>Use the Service for any unlawful purpose</li>
              <li>Attempt to gain unauthorised access to any part of the Service, other user accounts, or our database</li>
              <li>Interfere with or disrupt the security or performance of the Service</li>
              <li>Upload or transmit any harmful code, viruses, or malicious content</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">10. INTELLECTUAL PROPERTY</h2>
            <p>
              All content on the Service, including but not limited to the logo, design, text, and graphics (excluding third-party or placeholder images used for demonstration), is the property of MediCare Plus or its licensors and may not be copied, reproduced, or used without permission.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">11. LIMITATION OF LIABILITY</h2>
            <p>
              To the fullest extent permitted by law, MediCare Plus and its team shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service, including but not limited to delays in delivery, product unavailability, or data loss, except where such liability cannot be excluded by law.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">12. TERMINATION</h2>
            <p>
              We reserve the right to suspend or terminate your access to the Service at our discretion, including for violation of these Terms, without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">13. CHANGES TO THESE TERMS</h2>
            <p>
              We may revise these Terms from time to time. Updated Terms will be posted on this page with a revised "Last Updated" date. Continued use of the Service after changes are posted constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">14. GOVERNING LAW</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India, without regard to conflict of law principles, unless otherwise required by applicable local law.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">15. CONTACT US</h2>
            <p>For any questions regarding these Terms and Conditions, please contact us at:</p>
            <p className="font-semibold text-indigo-600 dark:text-indigo-400 mt-1">Email: medicaresupport1@gmail.com</p>
          </section>

          <div className="mt-8 p-4 bg-indigo-50 dark:bg-gray-700/50 rounded-2xl border border-indigo-100 dark:border-gray-600 text-xs text-gray-500 dark:text-gray-400">
            <strong>NOTE:</strong> This document is a general-purpose Terms and Conditions template prepared for a student/hackathon project (VTAPP 2026 – Reverse Engineer). It is provided for demonstration purposes and does not constitute legal advice. Before operating a real pharmacy e-commerce platform, consult a qualified legal professional, as pharmacies and medicine sales are often subject to specific regulatory requirements (e.g. drug licensing rules) beyond generic e-commerce terms.
          </div>
        </div>
      </div>
    </div>
  )
}
