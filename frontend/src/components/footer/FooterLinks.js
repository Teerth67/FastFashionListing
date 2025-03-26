import React, { useState } from "react";
import "./FooterLinks.scss";
import { FaInstagram } from "react-icons/fa";
import logoImg from "../../assets/f_logo.png"
import { useLocation, useNavigate } from "react-router-dom";
const brandLinks = [
  { name: "Jaywalking", path: "/collections/Jaywalking" },
  { name: "Veloce", path: "/collections/Veloce" },
  { name: "Huemn", path: "/collections/huemn" },
  { name: "Almost Gods", path: "/collections/AlmostGods" },
  { name: "TurntUp", path: "/collections/TurntUp" },
  { name: "Outcasts", path: "/collections/Outcasts" },
  { name: "BluOrng", path: "/collections/BluOrng" },
  { name: "SpaceBiskit", path: "/collections/SpaceBiskit" },
  { name: "WtFlex", path: "/collections/WtFlex" },
  { name: "Six5Six", path: "/collections/Six5Six" },
  { name: "Drip Project", path: "/collections/DripProject" },
  
  { name: "Bomaachi", path: "/collections/Bomaachi" },
  { name: "Blck Orchid", path: "/collections/BlckOrchid" },
  { name: "Future Saints", path: "/collections/FutureSaints" },
  { name: "Warping Theories", path: "/collections/WarpingTheories" },
  { name: "DeadBear", path: "/collections/DeadBear" },
  { name: "Evemen", path: "/collections/Evemen" },
  { name: "Genrage", path: "/collections/Genrage" },
  { name: "Beeglee", path: "/collections/Beeglee" },
  { name: "Merche", path: "/collections/themerche" },
  { name: "It-Girl", path: "/collections/ItGirl" },
  { name: "The Dapper Lady", path: "/collections/TheDapperLady" },
  { name: "Crayyheads", path: "/collections/Crayyheads" },
  { name: "Bluer", path: "/collections/Bluer" }


];
const FooterLinks = () => {
  const navigate=useNavigate()
  const location=useLocation()
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [showInput, setShowInput] = useState(false);
  const goToHome = () => {
    if (location.pathname === "/") {
      // If already on home page, reload the page
      window.location.reload();
    } else {
      // Navigate to home page
      navigate("/");
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setMessage("Please enter your name.");
      return;
    }

    if (!email || !email.includes("@")) {
      setMessage("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/newsletter/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
        signal: AbortSignal.timeout(8000),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Hey ${name}, check your inbox for a verification email!`);
        setName("");
        setEmail("");
        setTimeout(() => setShowInput(false), 3000);
      } else {
        setMessage(data.message || "Something went wrong. Try again later.");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      setMessage("Connection issue. Try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSubscribeForm = () => {
    setShowInput(!showInput);
    if (!showInput) {
      setMessage("");
    }
  };

  return (
    <>
      <section className="contact-section">
        <div className="container contact">
          <div className="contact-icons">
            <a href="https://www.instagram.com/glitchd.in?igsh=eGgwb29yb2Q5eDNz&utm_source=qr" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="icon" />
            </a>
          </div>
          <h2>Join the Street Movement</h2>
          <div className="newsletter-form">
          {!showInput ? (
  <button className="btn btn-dark" onClick={toggleSubscribeForm}>
    Get Underground Updates
  </button>
) : (
  <form onSubmit={handleSubscribe} className="subscribe-form">
    <div className="input-container">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        className="name-input"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        className="email-input"
        required
      />
    </div>
    <button type="submit" className="submit-btn" disabled={isSubmitting}>
      {isSubmitting ? "Joining..." : "Join"}
    </button>
    {message && <p className="message">{message}</p>}
  </form>
)}
          </div>
        </div>
      </section>

      <section className="footer-section">
        <div className="container footer">
          {/* Rest of the component stays the same */}
          <div className="footer-brand">
            <img src={logoImg} alt="Glitch'd Streetwear Logo" className="footer-logo" 
            onClick={goToHome}
            style={{ cursor: "pointer" }}/>
            
            {/* <div className="footer-social-icons">
              <a href="https://www.instagram.com/glitchd.in?igsh=eGgwb29yb2Q5eDNz&utm_source=qr " target="_blank" rel="noopener noreferrer">
                <FaInstagram className="social-icon" />
              </a>
            </div> */}
          </div>

          <div className="footer-menus-container">
          <div className="footer-menus-container">
      <div className="footer-menu brands-menu">
        <h3 className="menu-heading">Brands</h3>
        <ul className="footer-links brand-list">
          {brandLinks.map((brand) => (
            <li key={brand.name} className="brand-item">
              <a href={brand.path}>{brand.name}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>

          
            <div className="footer-menu-group">
  <div className="footer-menu">
    <h3 className="menu-heading">Support</h3>
    <ul className="footer-links">
      <li>
      <a
  href="https://mail.google.com/mail/?view=cm&fs=1&to=info@glitchd.in"
  target="_blank"
  rel="noopener noreferrer"
>
  Contact Us
</a>

      </li>
      <li><span>Shipping, Returns & Exchanges: coming soon as we onboard sellers!</span></li>
      {/* <li><a href="#faq">FAQ</a></li> */}
    </ul>
  </div>


  <div className="footer-menu">
  <h3 className="menu-heading">About</h3>
  <ul className="footer-links">
    <li><a href="/about-us">About Us</a></li>
  </ul>
</div>

            </div>
          </div>

          <div className="footer-legal">
            <p className="copyright">&copy; {new Date().getFullYear()} Glitch'd. All rights reserved.</p>
            <div className="legal-links">
              <a href="/privacy-policy">Privacy Policy</a>
              <span className="divider">|</span>
              <a href="/terms-of-service">Terms of Service</a>
              <span className="divider">|</span>
              <a href="/disclaimer">Disclaimer</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FooterLinks;