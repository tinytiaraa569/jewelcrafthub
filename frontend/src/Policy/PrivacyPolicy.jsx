import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="my-1">
      <div className="bg-white text-black px-4 md:px-20 py-12 max-w-5xl mx-auto leading-relaxed font-poppins border border-gray-200 rounded-md">
        <h1 className="text-2xl font-bold text-center ">Jewel Craft Hub - Privacy Policy</h1>
        <p className="text-center mb-10 text-gray-700">
          We are committed to protecting your personal information and your right to privacy. This Privacy Policy outlines how we collect, use, store, and safeguard your data when you use Jewel Craft Hub.
        </p>

        <div className="space-y-6">
          <div>
            <h3 className="font-bold mb-1">Effective Date: 23/04/2025</h3>
            <p>
              At Jewel Craft Hub, your privacy is of utmost importance to us. This Privacy Policy explains how we collect, use, protect, and disclose personal information from users (referred to as "you" or "designers") who access and use our platform.
            </p>
          </div>

          <div>
            <h3 className="font-bold ">1. Information We Collect</h3>
            <p className='mb-1'>We may collect the following types of information:</p>
            <p><span className="font-semibold">a. Personal Information:</span> Full Name, Email Address, Mobile Number, Bank Details / UPI ID for payments, Government ID proof (if applicable), Address and location details.</p>
            <p><span className="font-semibold">b. Design and Content Information:</span> Uploaded jewelry designs, file metadata (submission date, file types, design category).</p>
            <p><span className="font-semibold">c. Technical Information:</span> IP address, browser type, operating system, usage behavior, cookies, and analytics data.</p>
          </div>

          <div>
            <h3 className="font-bold ">2. How We Use Your Information</h3>
            <p className='mb-1'>We use your information for the following purposes: </p>

            <ul className="list-disc list-inside">
              <li>To create and manage your account</li>
              <li>To process design submissions and payments</li>
              <li>To communicate with you about platform updates, changes, or offers</li>
              <li>To display your designs on the platform (if approved)</li>
              <li>To detect fraud or misuse of the platform</li>
              <li>To comply with legal obligations</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold ">3. How We Share Your Information</h3>
            <p className='mb-1'>We do not sell your personal information. We may share your data: </p>

            <ul className="list-disc list-inside">
              <li>With payment gateways and banks for processing payouts</li>
              <li>With third-party service providers who help us operate the platform</li>
              <li>When legally required (e.g., in response to court orders or government
                requests)</li>
              <li>With buyers, only when a design is sold and necessary for fulfillment</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-1">4. Cookies and Tracking Technologies</h3>
            <p>We use cookies and similar technologies to improve your experience on our
            platform by:</p>
            <ul className="list-disc list-inside">
              <li>Remembering your preferences</li>
              <li>Analyzing platform usage</li>
              <li>Ensuring platform security</li>
            </ul>
            <p>You may choose to disable cookies in your browser settings, but this could
            affect certain functionalities.</p>
          </div>

          <div>
            <h3 className="font-bold ">5. Data Security</h3>
            <p className='mb-1'> We implement industry-standard security measures to protect your personal
            data, including:</p>

            <ul className="list-disc list-inside">
              <li>SSL encryption</li>
              <li>Secure storage practices</li>
              <li>Access control and limited permissions</li>
            </ul>
            <p>However, no platform is completely immune to risks. You are responsible for
            keeping your password and login details secure.</p>

          </div>

          <div>
            <h3 className="font-bold ">6. Your Rights</h3>
            <p className='mb-1'>You have the right to:</p>
            <ul className="list-disc list-inside">
              <li>Access the personal data we hold about you</li>
              <li>Correct inaccuracies in your information</li>
              <li>Request deletion of your account and associated data</li>
              <li>Opt out of non-essential communications</li>
            </ul>
            <p>Requests can be sent to: <span className="font-medium"><a
            href="mailto:privacy@jewelcrafthub.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 hover:underline hover:cursor-pointer"
            >
            privacy@jewelcrafthub.com
            </a></span></p>
          </div>

          <div>
            <h3 className="font-bold mb-1">7. Data Retention</h3>
            <p>We retain your personal data as long as your account is active or as required to
            provide services and comply with legal obligations. After deactivation, your
            data will be securely archived or deleted within 90 days.</p>
          </div>

          <div>
            <h3 className="font-bold mb-1">8. Children’s Privacy</h3>
            <p>Jewel Craft Hub is not intended for individuals under the age of 18. We do not
            knowingly collect data from minors.</p>
          </div>

          <div>
            <h3 className="font-bold mb-1">9. Changes to This Policy</h3>
            <p>We may update this Privacy Policy from time to time. Changes will be notified
            via email or a platform announcement. Continued use after changes means you
            agree to the updated terms.</p>
          </div>

          <div>
            <h3 className="font-bold mb-1">10. Contact Us</h3>
            <p>If you have any questions or concerns, please reach out at:  
            <a
            href="mailto:privacy@jewelcrafthub.com"
            target="_blank"
            rel="noopener noreferrer"
            className="pl-1 font-medium text-blue-600 hover:underline hover:cursor-pointer"
            >
            privacy@jewelcrafthub.com
            </a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
