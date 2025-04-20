import React from 'react'

function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
      
      <div className="space-y-8 text-gray-600">
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Information We Collect</h2>
          <p className="mb-4">
            We collect information that you provide directly to us, including but not limited to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Name and contact information</li>
            <li>Account credentials</li>
            <li>Course participation and progress data</li>
            <li>Communications with us</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. How We Use Your Information</h2>
          <p className="mb-4">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide, maintain, and improve our services</li>
            <li>Process your transactions</li>
            <li>Send you technical notices and support messages</li>
            <li>Respond to your comments and questions</li>
            <li>Monitor and analyze trends and usage</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Data Security</h2>
          <p className="mb-4">
            We implement appropriate technical and organizational security measures to protect your personal data against accidental or unlawful destruction, loss, alteration, unauthorized disclosure, or access.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Data Retention</h2>
          <p className="mb-4">
            We retain personal data for as long as necessary to provide our services and fulfill the purposes outlined in this privacy policy. When we no longer need to use your information, we will securely delete or anonymize it.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Your Rights</h2>
          <p className="mb-4">
            You have the right to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to data processing</li>
            <li>Request data portability</li>
          </ul>
        </section>

        {/* <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p>Email: legal@cubite.io</p>
          </div>
        </section> */}

        <section className="border-t pt-8">
          <p className="text-sm text-gray-500">
            Last updated: 1/7/2025
          </p>
        </section>
      </div>
    </div>
  )
}

export default PrivacyPolicy