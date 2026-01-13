import React from 'react';

export const metadata = {
  title: 'Terms & Conditions | Pirate Mobile - eSIM Travel Services',
  description: 'Read our terms and conditions for using Pirate Mobile eSIM services. Understand your rights and obligations when using our travel connectivity solutions.',
  keywords: 'terms and conditions, eSIM terms, travel services agreement, user agreement, service terms, legal terms',
  openGraph: {
    title: 'Terms & Conditions | Pirate Mobile',
    description: 'Read our terms and conditions for using Pirate Mobile eSIM services.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-[#FFF6BA] to-white pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
              Terms & <span className="text-green-600">Conditions</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700">
              Please read these terms carefully before using our eSIM services.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Last updated: December 15, 2024
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          
          {/* Introduction */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              These Terms and Conditions (&quot;Terms&quot;) govern your use of Pirate Mobile&apos;s eSIM services, website, and mobile applications (&quot;Services&quot;). By accessing or using our Services, you agree to be bound by these Terms.
            </p>
            <p className="text-gray-700 leading-relaxed">
              If you do not agree to these Terms, please do not use our Services. We reserve the right to modify these Terms at any time, and such modifications will be effective immediately upon posting.
            </p>
          </section>

          {/* Service Description */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Service Description</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Pirate Mobile provides eSIM (embedded SIM) services that allow you to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>Connect to mobile networks in various countries without physical SIM cards</li>
              <li>Access mobile data services for internet connectivity</li>
              <li>Use voice and messaging services (where available)</li>
              <li>Manage your eSIM profiles through our platform</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              Our Services are provided on a prepaid basis and are subject to availability and network coverage in your destination country.
            </p>
          </section>

          {/* Eligibility */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Eligibility and Account Registration</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To use our Services, you must:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>Be at least 18 years old or have parental consent</li>
              <li>Have a compatible device that supports eSIM technology</li>
              <li>Provide accurate and complete information during registration</li>
              <li>Maintain the security of your account credentials</li>
              <li>Use the Services in compliance with applicable laws</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              You are responsible for all activities that occur under your account. Notify us immediately of any unauthorized use.
            </p>
          </section>

          {/* Payment Terms */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Payment Terms</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">4.1 Pricing and Billing</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              All prices are displayed in the currency selected and are subject to change without notice. Payment is required at the time of purchase.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">4.2 Refund Policy</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Refunds may be available under the following conditions:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>eSIM not activated within 30 days of purchase</li>
              <li>Technical issues preventing activation (subject to verification)</li>
              <li>Service not available in your destination country</li>
              <li>Duplicate purchases (within 24 hours)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">4.3 Payment Methods</h3>
            <p className="text-gray-700 leading-relaxed">
              We accept major credit cards, debit cards, PayPal, and other payment methods as displayed on our website. All payments are processed securely through encrypted channels.
            </p>
          </section>

          {/* Service Usage */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Acceptable Use Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You agree not to use our Services for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>Illegal activities or violation of local laws</li>
              <li>Spam, phishing, or fraudulent activities</li>
              <li>Excessive data usage that may impact network performance</li>
              <li>Reselling or redistributing our Services without authorization</li>
              <li>Attempting to hack, disrupt, or damage our systems</li>
              <li>Violating intellectual property rights</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to suspend or terminate your account for violations of this policy.
            </p>
          </section>

          {/* Service Availability */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Service Availability and Limitations</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">6.1 Network Coverage</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Service availability depends on local network coverage and partnerships. We do not guarantee service in all areas and are not responsible for network outages or coverage gaps.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">6.2 Data Limits</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Data plans have usage limits as specified at purchase. Exceeding these limits may result in service suspension or additional charges.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">6.3 Device Compatibility</h3>
            <p className="text-gray-700 leading-relaxed">
              You are responsible for ensuring your device is compatible with eSIM technology. We provide compatibility information but cannot guarantee functionality on all devices.
            </p>
          </section>

          {/* Intellectual Property */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              All content, trademarks, logos, and intellectual property on our website and Services are owned by Pirate Mobile or our licensors. You may not:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>Copy, modify, or distribute our content without permission</li>
              <li>Use our trademarks or logos without authorization</li>
              <li>Reverse engineer or attempt to extract our proprietary information</li>
              <li>Create derivative works based on our Services</li>
            </ul>
          </section>

          {/* Privacy */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Privacy and Data Protection</h2>
            <p className="text-gray-700 leading-relaxed">
              Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference. By using our Services, you consent to the collection and use of your information as described in our Privacy Policy.
            </p>
          </section>

          {/* Disclaimers */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Disclaimers and Limitations</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">9.1 Service Disclaimers</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our Services are provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind. We do not guarantee:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>Uninterrupted or error-free service</li>
              <li>Specific network speeds or performance levels</li>
              <li>Compatibility with all devices or applications</li>
              <li>Availability in all geographic locations</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">9.2 Limitation of Liability</h3>
            <p className="text-gray-700 leading-relaxed">
              To the maximum extent permitted by law, Pirate Mobile shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use, arising from your use of our Services.
            </p>
          </section>

          {/* Indemnification */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Indemnification</h2>
            <p className="text-gray-700 leading-relaxed">
              You agree to indemnify and hold harmless Pirate Mobile, its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from your use of our Services, violation of these Terms, or infringement of any rights of another party.
            </p>
          </section>

          {/* Termination */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Termination</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may terminate or suspend your account and access to our Services at any time, with or without cause, with or without notice. You may also terminate your account at any time by contacting our support team.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Upon termination, your right to use the Services will cease immediately, but provisions regarding intellectual property, disclaimers, and limitations of liability will survive.
            </p>
          </section>

          {/* Governing Law */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Governing Law and Dispute Resolution</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              These Terms are governed by the laws of [Jurisdiction], without regard to conflict of law principles. Any disputes arising from these Terms or your use of our Services will be resolved through:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>Good faith negotiations between the parties</li>
              <li>Mediation through a mutually agreed mediator</li>
              <li>Binding arbitration if mediation fails</li>
              <li>Court proceedings as a last resort</li>
            </ul>
          </section>

          {/* Changes to Terms */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these Terms at any time. We will notify you of material changes by posting the updated Terms on our website and updating the &quot;Last updated&quot; date. Your continued use of our Services after such changes constitutes acceptance of the modified Terms.
            </p>
          </section>

          {/* Severability */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Severability</h2>
            <p className="text-gray-700 leading-relaxed">
              If any provision of these Terms is found to be unenforceable or invalid, the remaining provisions will continue to be valid and enforceable to the fullest extent permitted by law.
            </p>
          </section>

          {/* Contact Information */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about these Terms and Conditions, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-2"><strong>Email:</strong> legal@piratemobile.com</p>
              <p className="text-gray-700 mb-2"><strong>Phone:</strong> +34 655 87 75 79</p>
              <p className="text-gray-700 mb-2"><strong>Address:</strong> Pirate Mobile, Legal Department</p>
              <p className="text-gray-700"><strong>Support:</strong> support@piratemobile.com</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
