import React, { useEffect, useState } from "react";
import "./LegalPages.scss"; // Import SCSS file

const PrivacyPolicy = () => {
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
        <h1 className="glitchd-legal-title">Privacy Policy</h1>
        <p className="glitchd-last-updated">Last Updated: {new Date().toLocaleDateString()}</p>
        
        <section className="glitchd-legal-section">
          <h2 className="glitchd-legal-heading">Introduction</h2>
          <p className="glitchd-legal-text">
            Glitch'd ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website or use our services.
          </p>
          <p className="glitchd-legal-text">
            By accessing or using our service, you agree to the collection and use of information in accordance with this policy.
          </p>
        </section>

        <section className="glitchd-legal-section">
          <h2 className="glitchd-legal-heading">Information We Collect</h2>
          <h3 className="glitchd-legal-subheading">Personal Information</h3>
          <p className="glitchd-legal-text">
            We may collect personal information that you voluntarily provide to us when you:
          </p>
          <ul className="glitchd-legal-list">
            <li className="glitchd-legal-list-item">Create an account or profile</li>
            <li className="glitchd-legal-list-item">Place an order</li>
            <li className="glitchd-legal-list-item">Subscribe to our newsletter</li>
            <li className="glitchd-legal-list-item">Contact our customer service</li>
            <li className="glitchd-legal-list-item">Participate in surveys or promotions</li>
          </ul>
          <p className="glitchd-legal-text">This information may include your name, email address, postal address, phone number, and payment information.</p>
          
          <h3 className="glitchd-legal-subheading">Usage Information</h3>
          <p className="glitchd-legal-text">
            We automatically collect certain information about your device and how you interact with our website, including:
          </p>
          <ul className="glitchd-legal-list">
            <li className="glitchd-legal-list-item">IP address</li>
            <li className="glitchd-legal-list-item">Browser type</li>
            <li className="glitchd-legal-list-item">Operating system</li>
            <li className="glitchd-legal-list-item">Pages visited</li>
            <li className="glitchd-legal-list-item">Time spent on pages</li>
            <li className="glitchd-legal-list-item">Referring website</li>
            <li className="glitchd-legal-list-item">Other browsing information</li>
          </ul>
        </section>
        
        <section className="glitchd-legal-section">
          <h2 className="glitchd-legal-heading">How We Use Your Information</h2>
          <p className="glitchd-legal-text">We use the information we collect to:</p>
          <ul className="glitchd-legal-list">
            <li className="glitchd-legal-list-item">Process and fulfill your orders</li>
            <li className="glitchd-legal-list-item">Communicate with you about your orders or account</li>
            <li className="glitchd-legal-list-item">Send you marketing communications (if you've opted in)</li>
            <li className="glitchd-legal-list-item">Improve our website and services</li>
            <li className="glitchd-legal-list-item">Detect and prevent fraudulent transactions</li>
            <li className="glitchd-legal-list-item">Comply with legal obligations</li>
          </ul>
        </section>

        <section className="glitchd-legal-section">
          <h2 className="glitchd-legal-heading">Cookies and Tracking Technologies</h2>
          <p className="glitchd-legal-text">
            We use cookies and similar tracking technologies to collect information about your browsing activities. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
          </p>
        </section>

        <section className="glitchd-legal-section">
          <h2 className="glitchd-legal-heading">Sharing Your Information</h2>
          <p className="glitchd-legal-text">We may share your information with:</p>
          <ul className="glitchd-legal-list">
            <li className="glitchd-legal-list-item">Service providers who help us operate our business</li>
            <li className="glitchd-legal-list-item">Partner brands to fulfill orders</li>
            <li className="glitchd-legal-list-item">Legal authorities when required by law</li>
            <li className="glitchd-legal-list-item">Successor entities in the event of a merger, acquisition, or business transfer</li>
          </ul>
        </section>

        <section className="glitchd-legal-section">
          <h2 className="glitchd-legal-heading">Your Rights</h2>
          <p className="glitchd-legal-text">Depending on your location, you may have the right to:</p>
          <ul className="glitchd-legal-list">
            <li className="glitchd-legal-list-item">Access the personal information we have about you</li>
            <li className="glitchd-legal-list-item">Correct inaccurate or incomplete information</li>
            <li className="glitchd-legal-list-item">Request deletion of your personal information</li>
            <li className="glitchd-legal-list-item">Object to or restrict certain processing activities</li>
            <li className="glitchd-legal-list-item">Data portability</li>
          </ul>
        </section>

        <section className="glitchd-legal-section">
          <h2 className="glitchd-legal-heading">Security</h2>
          <p className="glitchd-legal-text">
            We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.
          </p>
        </section>

        <section className="glitchd-legal-section">
          <h2 className="glitchd-legal-heading">Changes to This Policy</h2>
          <p className="glitchd-legal-text">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
          </p>
        </section>

        <section className="glitchd-legal-section">
          <h2 className="glitchd-legal-heading">Contact Us</h2>
          <p className="glitchd-legal-text">
            If you have any questions about this Privacy Policy, please contact us at:{" "}
            <a 
              className="glitchd-legal-link"
              href="https://mail.google.com/mail/?view=cm&fs=1&to=legal@glitchd.in"
              target="_blank"
              rel="noopener noreferrer"
            >
              legal@glitchd.in
            </a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;