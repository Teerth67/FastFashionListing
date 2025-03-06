import React, { useEffect, useState } from "react";
import "./LegalPages.scss"; // Import SCSS file

const TermsOfService = () => {
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    // Function to get and set the header height
    const updateHeaderHeight = () => {
      // Replace '.header' with your actual header class or id
      const header = document.querySelector('header') || document.querySelector('nav');
      if (header) {
        setHeaderHeight(header.offsetHeight);
      }
    };

    // Set initial height
    updateHeaderHeight();

    // Update on resize
    window.addEventListener('resize', updateHeaderHeight);

    // Cleanup
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, []);

  return (
    <div className="container">
      <div 
        className="glitchd-legal-wrapper" 
        style={{ paddingTop: `${headerHeight + 40}px` }} // Dynamic padding based on header height
      >
        <h1 className="glitchd-legal-title">Terms of Service</h1>
        <p className="glitchd-last-updated">Last Updated: {new Date().toLocaleDateString()}</p>
        
        <section className="glitchd-legal-section">
          <h2 className="glitchd-legal-heading">Acceptance of Terms</h2>
          <p className="glitchd-legal-text">
            By accessing or using the Glitch'd website, mobile application, or any services provided by Glitch'd ("we", "our", or "us"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        <section className="glitchd-legal-section">
          <h2 className="glitchd-legal-heading">Eligibility</h2>
          <p className="glitchd-legal-text">
            By using our services, you represent and warrant that:
          </p>
          <ul className="glitchd-legal-list">
            <li className="glitchd-legal-list-item">You are at least 18 years of age, or the legal age of majority in your jurisdiction, whichever is greater</li>
            <li className="glitchd-legal-list-item">You have the legal capacity to enter into binding contracts</li>
            <li className="glitchd-legal-list-item">You are not prohibited from using our services under applicable law</li>
          </ul>
          <p className="glitchd-legal-text">
            If you are using the service on behalf of a business or other entity, you represent that you have the authority to bind such entity to these Terms of Service.
          </p>
        </section>

        <section className="glitchd-legal-section">
          <h2 className="glitchd-legal-heading">User Accounts</h2>
          <p className="glitchd-legal-text">
            To access certain features of our service, you may be required to create an account. You are responsible for:
          </p>
          <ul className="glitchd-legal-list">
            <li className="glitchd-legal-list-item">Providing accurate and current information during the registration process</li>
            <li className="glitchd-legal-list-item">Maintaining the confidentiality of your account password</li>
            <li className="glitchd-legal-list-item">All activities that occur under your account</li>
          </ul>
          <p className="glitchd-legal-text">
            You agree to notify us immediately of any unauthorized use of your account or any other breach of security.
          </p>
        </section>

        <section className="glitchd-legal-section">
          <h2 className="glitchd-legal-heading">Products and Services</h2>
          <p className="glitchd-legal-text">
            All product descriptions, specifications, images, and prices are subject to change without notice. We reserve the right to discontinue any product at any time.
          </p>
          <p className="glitchd-legal-text">
            We make every effort to display the accurate color and image of our products, but we cannot guarantee that your computer or mobile device's display will accurately reflect the actual color of the product.
          </p>
        </section>

        <section className="glitchd-legal-section">
          <h2 className="glitchd-legal-heading">Ordering and Payment</h2>
          <p className="glitchd-legal-text">
            When you place an order, you agree to provide current, complete, and accurate purchase and account information. We reserve the right to refuse or cancel your order if fraud or an unauthorized transaction is suspected.
          </p>
          <p className="glitchd-legal-text">
            Payment must be received prior to the acceptance of an order. By providing a payment method, you represent that you are authorized to use the designated payment method and authorize us to charge your payment method for the total amount of your order (including taxes, shipping, and handling).
          </p>
        </section>

        <section className="glitchd-legal-section">
          <h2 className="glitchd-legal-heading">Shipping and Delivery</h2>
          <p className="glitchd-legal-text">
            Shipping and delivery dates are estimates only and cannot be guaranteed. We are not liable for delivery delays due to circumstances beyond our reasonable control.
          </p>
        </section>

        <section className="glitchd-legal-section">
          <h2 className="glitchd-legal-heading">Returns and Refunds</h2>
          <p className="glitchd-legal-text">
            Our return and refund policy is outlined in a separate document. By making a purchase, you agree to the terms of our return and refund policy.
          </p>
        </section>

        <section className="glitchd-legal-section">
          <h2 className="glitchd-legal-heading">Intellectual Property</h2>
          <p className="glitchd-legal-text">
            The service and its original content, features, and functionality are and will remain the exclusive property of Glitch'd and its licensors. Our trademarks, service marks, designs, logos, and trade names may not be used without our prior written consent.
          </p>
        </section>

        <section className="glitchd-legal-section">
          <h2 className="glitchd-legal-heading">User Content</h2>
          <p className="glitchd-legal-text">
            You retain ownership of any content that you post, upload, or submit to our service. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display such content in connection with our service.
          </p>
          <p className="glitchd-legal-text">
            You agree not to post content that is illegal, defamatory, harassing, abusive, fraudulent, obscene, or otherwise objectionable.
          </p>
        </section>

        <section className="glitchd-legal-section">
          <h2 className="glitchd-legal-heading">Prohibited Activities</h2>
          <p className="glitchd-legal-text">
            You agree not to engage in any of the following prohibited activities:
          </p>
          <ul className="glitchd-legal-list">
            <li className="glitchd-legal-list-item">Using our service for any illegal purpose</li>
            <li className="glitchd-legal-list-item">Violating any laws in your jurisdiction</li>
            <li className="glitchd-legal-list-item">Infringing upon the intellectual property rights of others</li>
            <li className="glitchd-legal-list-item">Interfering with or disrupting our service</li>
            <li className="glitchd-legal-list-item">Attempting to gain unauthorized access to any part of our service</li>
            <li className="glitchd-legal-list-item">Using any data mining, robots, or similar data gathering methods</li>
          </ul>
        </section>

        <section className="glitchd-legal-section">
          <h2 className="glitchd-legal-heading">Termination</h2>
          <p className="glitchd-legal-text">
            We may terminate or suspend your account and access to our service immediately, without prior notice or liability, for any reason whatsoever, including, without limitation, if you breach these Terms of Service.
          </p>
        </section>

        <section className="glitchd-legal-section">
          <h2 className="glitchd-legal-heading">Limitation of Liability</h2>
          <p className="glitchd-legal-text">
            To the maximum extent permitted by law, in no event shall Glitch'd, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
          </p>
        </section>

        <section className="glitchd-legal-section">
          <h2 className="glitchd-legal-heading">Disclaimer</h2>
          <p className="glitchd-legal-text">
            Your use of our service is at your sole risk. The service is provided on an "AS IS" and "AS AVAILABLE" basis. We expressly disclaim all warranties of any kind, whether express or implied, including but not limited to the implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
          </p>
        </section>

        <section className="glitchd-legal-section">
          <h2 className="glitchd-legal-heading">Governing Law</h2>
          <p className="glitchd-legal-text">
            These Terms shall be governed and construed in accordance with the laws of [your jurisdiction], without regard to its conflict of law provisions.
          </p>
        </section>

        <section className="glitchd-legal-section">
          <h2 className="glitchd-legal-heading">Changes to Terms</h2>
          <p className="glitchd-legal-text">
            We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
          </p>
        </section>

        <section className="glitchd-legal-section">
          <h2 className="glitchd-legal-heading">Contact Us</h2>
          <p className="glitchd-legal-text">
            If you have any questions about these Terms, please contact us at:{" "}
            <a 
              className="glitchd-legal-link"
              href="https://mail.google.com/mail/?view=cm&fs=1&to=teerthmittal05@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              teerthmittal05@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;