import React, { useEffect } from 'react';

const Termsandcondition = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className='my-1'>
    <div className="bg-white text-black px-4 md:px-20 py-12 max-w-5xl mx-auto leading-relaxed !font-poppins border border-gray-100 shadow-xs rounded-[5px]">
      <h1 className="text-2xl font-bold text-center ">Jewel Craft Hub - Terms and Conditions</h1>
      <p className="text-center mb-10 text-gray-700">
        Please read these terms carefully before using our platform. By accessing or using Jewel Craft Hub, you agree to be bound by these terms.
        </p>

      <section className="mb-6">
        <h2 className="font-bold text-lg mb-1">Effective Date</h2>
        <p>23/04/2025</p>
      </section>

      <section className="mb-6">
        <h2 className="font-bold text-lg mb-1">Platform Purpose</h2>
        <p>
          Jewel Craft Hub is a digital marketplace where manual jewelry designers can Design, Upload, Earn, and Repeat.
          Our mission is to provide a fair, secure, and rewarding environment for jewelry creatives to monetize their
          original designs.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="font-bold text-lg mb-1">Eligibility</h2>
        <p>To use Jewel Craft Hub:</p>
        <ul className="list-disc ml-6">
          <li>You must be at least 18 years of age.</li>
          <li>You must have the legal right to sell or license the designs you upload.</li>
          <li>You must provide accurate personal, contact, and payment details during registration.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="font-bold text-lg mb-1">Account Registration and Use</h2>
        <p>
          Designers must create an account with valid credentials. You are responsible for maintaining the
          confidentiality of your login credentials. You agree to notify us immediately of any unauthorized use of your
          account.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="font-bold text-lg mb-1">Submission of Designs</h2>
        <p>
          By uploading a design, you confirm that you are the original creator and own full rights to the work. Your
          design must not infringe any intellectual property rights, be plagiarized, or violate any applicable law. All
          uploads will go through a review and selection process before they are eligible for monetization.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="font-bold text-lg mb-1">Payment Terms</h2>
        <p>
          Designers will receive payment for selected and purchased designs. Payments are processed every month between
          the 7th and 10th. Any transaction finalized after the 10th of the month will be rolled over to the next
          payment cycle. Payments will be made through the selected mode (e.g., bank transfer, UPI, etc.), as chosen in
          your profile settings. You are solely responsible for any taxes applicable to the income earned via the
          platform.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="font-bold text-lg mb-1">Intellectual Property Rights</h2>
        <p>
          Designers retain ownership of their original works. By uploading, you grant us a non-exclusive, royalty-free
          license to use, display, and promote your design for marketing and sales purposes. If a design is sold, the
          ownership terms will be governed by the purchase agreement (exclusive/non-exclusive), as applicable.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="font-bold text-lg mb-1">Prohibited Conduct</h2>
        <ul className="list-disc ml-6">
          <li>Upload copyrighted work that you do not own.</li>
          <li>Engage in fraudulent activities or misrepresent your identity.</li>
          <li>Attempt to bypass the platform’s commission/payment system.</li>
          <li>Harass, abuse, or threaten other users or platform staff.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="font-bold text-lg mb-1">Termination of Account</h2>
        <p>
          We reserve the right to suspend or terminate your account if you breach these terms, your conduct harms the
          reputation or integrity of the platform, or we are required to do so by law.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="font-bold text-lg mb-1">Limitation of Liability</h2>
        <p>
          Jewel Craft Hub is not liable for any direct, indirect, incidental, or consequential damages resulting from
          the use of or inability to use the platform. We do not guarantee that your designs will be selected or sold.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="font-bold text-lg mb-1">Changes to Terms</h2>
        <p>
          We may update these terms from time to time. All changes will be communicated via email or platform
          notification. Continued use after such changes constitutes your acceptance of the updated terms.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="font-bold text-lg mb-1">Governing Law</h2>
        <p>
          These Terms and Conditions shall be governed by and construed in accordance with the laws of India. Any
          disputes shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.
        </p>
      </section>

      <section>
        <h2 className="font-bold text-lg mb-1">Contact Us</h2>
        <p>
          For questions regarding these Terms, you may reach out to us at:
          <br />
          Email: <a
            href="mailto:privacy@jewelcrafthub.com"
            target="_blank"
            rel="noopener noreferrer"
            className="pl-1 font-medium text-blue-600 hover:underline hover:cursor-pointer"
            >
            support@jewelcrafthub.com
            </a>
          <br />
          Address: [Insert Registered Address of the Company]
        </p>
      </section>
    </div>
    </div>

  );
};

export default Termsandcondition;
