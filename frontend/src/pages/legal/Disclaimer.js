import React, { useEffect, useState } from "react";
import "./LegalPages.scss"; // Import SCSS file

const Disclaimer = () => {
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
        <h1 className="glitchd-legal-title">Disclaimer</h1>
        <p className="glitchd-last-updated">Last Updated: {new Date().toLocaleDateString()}</p>
        
        <section className="glitchd-legal-section">
          <h2 className="glitchd-legal-heading">Website Disclaimer</h2>
          <p className="glitchd-legal-text">
            The information provided by Glitch'd ("we," "us," or "our") on our website and mobile application (the "Service") is for general informational purposes only. All information on the Service is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Service.
          </p>
        </section>

        <section className="glitchd-legal-section">
          <h2 className="glitchd-legal-heading">External Links Disclaimer</h2>
          <p className="glitchd-legal-text">
            The Service may contain links to external websites that are not provided or maintained by or in any way affiliated with us. Please note that we do not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.
          </p>
        </section>

        <section className="glitchd-legal-section">
          <h2 className="glitchd-legal-heading">Product Disclaimer</h2>
          <p className="glitchd-legal-text">
            We strive to display our products as accurately as possible. However, we cannot guarantee that your computer or mobile device's display of any product or color will be accurate. Product information, including pricing, descriptions, availability, and promotions may change at any time without notice.
          </p>
          <p className="glitchd-legal-text">
            We do not warrant that any description, pricing, availability information, reviews, or other content is accurate, complete, reliable, current, or error-free. In the event of any errors relating to the pricing or availability of products, we reserve the right to cancel any orders containing such errors.
          </p>
        </section>

        <section className="glitchd-legal-section">
          <h2 className="glitchd-legal-heading">Professional Disclaimer</h2>
          <p className="glitchd-legal-text">
            The Service cannot and does not contain professional advice. The information is provided for general informational and educational purposes only and is not a substitute for professional advice. Accordingly, before taking any actions based upon such information, we encourage you to consult with the appropriate professionals.
          </p>
        </section>

        <section className="glitchd-legal-section">
          <h2 className="glitchd-legal-heading">Testimonials Disclaimer</h2>
          <p className="glitchd-legal-text">
            The Service may contain testimonials by users of our products and/or services. These testimonials reflect the real-life experiences and opinions of such users. However, the experiences are personal to those particular users, and may not necessarily be representative of all users of our products and/or services. We do not claim, and you should not assume, that all users will have the same experiences.
          </p>
        </section>

        <section className="glitchd-legal-section">
          <h2 className="glitchd-legal-heading">Errors and Omissions Disclaimer</h2>
          <p className="glitchd-legal-text">
            While we have made every attempt to ensure that the information contained in this Service has been obtained from reliable sources, Glitch'd is not responsible for any errors or omissions, or for the results obtained from the use of this information. All information in this Service is provided "as is", with no guarantee of completeness, accuracy, timeliness or of the results obtained from the use of this information.
          </p>
        </section>

        <section className="glitchd-legal-section">
          <h2 className="glitchd-legal-heading">Fair Use Disclaimer</h2>
          <p className="glitchd-legal-text">
            This Service may contain copyrighted material the use of which has not always been specifically authorized by the copyright owner. We are making such material available in our efforts to advance understanding of environmental, political, human rights, economic, democracy, scientific, and social justice issues, etc. We believe this constitutes a 'fair use' of any such copyrighted material as provided for in section 107 of the US Copyright Law.
          </p>
        </section>

        <section className="glitchd-legal-section">
          <h2 className="glitchd-legal-heading">Views Expressed Disclaimer</h2>
          <p className="glitchd-legal-text">
            The views and opinions expressed in this Service are those of the authors and do not necessarily reflect the official policy or position of any other agency, organization, employer or company. Assumptions made in the analysis are not reflective of the position of any entity other than the author(s).
          </p>
        </section>

        <section className="glitchd-legal-section">
          <h2 className="glitchd-legal-heading">No Responsibility Disclaimer</h2>
          <p className="glitchd-legal-text">
            In no event shall Glitch'd be liable for any special, direct, indirect, consequential, or incidental damages or any damages whatsoever, whether in an action of contract, negligence or other tort, arising out of or in connection with the use of the Service or the contents of the Service. We reserve the right to make additions, deletions, or modifications to the contents on the Service at any time without prior notice.
          </p>
        </section>

        <section className="glitchd-legal-section">
          <h2 className="glitchd-legal-heading">"Use at Your Own Risk" Disclaimer</h2>
          <p className="glitchd-legal-text">
            All information in the Service is provided "as is", with no guarantee of completeness, accuracy, timeliness or of the results obtained from the use of this information, and without warranty of any kind, express or implied, including, but not limited to warranties of performance, merchantability, and fitness for a particular purpose.
          </p>
          <p className="glitchd-legal-text">
            You are using the Service at your own risk and you agree that we shall have no liability to you for any loss or damage of any kind incurred as a result of the use of the Service or reliance on any information provided on the Service.
          </p>
        </section>

        <section className="glitchd-legal-section">
          <h2 className="glitchd-legal-heading">Contact Us</h2>
          <p className="glitchd-legal-text">
            If you have any questions about this Disclaimer, please contact us at:{" "}
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

export default Disclaimer;