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
      <h2 className="glitchd-legal-heading">Automated Content Curation</h2>
      <p className="glitchd-legal-text">
        Glitch'd may use automated tools to curate fashion trends and product listings. However:
      </p>
      <ul className="glitchd-legal-text">
        <li>We do not claim ownership of third-party content.</li>
        <li>We strive to ensure all listed products comply with fair use and legal guidelines.</li>
        <li>If any brand or content owner has concerns regarding our listings, they can contact us at <a href="mailto:legal@glitchd.in">legal@glitchd.in</a> for prompt resolution.</li>
        <li>We respect intellectual property rights and will promptly remove any unauthorized content upon valid request.</li>
      </ul>
    </section>

    <section className="glitchd-legal-section">
      <h2 className="glitchd-legal-heading">External Links Disclaimer</h2>
      <p className="glitchd-legal-text">
        The Service may contain links to external websites that are not provided or maintained by or in any way affiliated with us. Please note that we do not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites. We are not responsible for any content, privacy policies, or practices of third-party sites.
      </p>
    </section>

    <section className="glitchd-legal-section">
      <h2 className="glitchd-legal-heading">No Responsibility Disclaimer</h2>
      <p className="glitchd-legal-text">
        In no event shall Glitch'd be liable for any special, direct, indirect, consequential, or incidental damages or any damages whatsoever, whether in an action of contract, negligence, or other tort, arising out of or in connection with the use of the Service or the contents of the Service.
      </p>
    </section>

    <section className="glitchd-legal-section">
      <h2 className="glitchd-legal-heading">"Use at Your Own Risk" Disclaimer</h2>
      <p className="glitchd-legal-text">
        All information in the Service is provided "as is", with no guarantee of completeness, accuracy, timeliness, or of the results obtained from the use of this information, and without warranty of any kind, express or implied, including but not limited to warranties of performance, merchantability, and fitness for a particular purpose.
      </p>
      <p className="glitchd-legal-text">
        You are using the Service at your own risk, and you agree that we shall have no liability to you for any loss or damage of any kind incurred as a result of the use of the Service or reliance on any information provided on the Service.
      </p>
    </section>

    <section className="glitchd-legal-section">
      <h2 className="glitchd-legal-heading">Contact Us</h2>
      <p className="glitchd-legal-text">
        If you have any questions about this Disclaimer, please contact us at: {" "}
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
  )
}

export default Disclaimer;