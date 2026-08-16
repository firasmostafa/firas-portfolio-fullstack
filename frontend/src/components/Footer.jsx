import { Link } from "react-router-dom";
import {
  FaGithub,
 FaLinkedin,
  FaEnvelope,
  FaPhoneAlt,
  FaWhatsapp,
} from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">

        <div className="footer-brand">
          <h3>Firas.dev</h3>
          <p>Full-Stack Developer</p>
        </div>

        <div className="footer-socials">
<a
  href="https://www.linkedin.com/in/firas-mostafa-b71843345"
  target="_blank"
  rel="noopener noreferrer"
>
  <FaLinkedin className="footer-icon" />
  LinkedIn
</a>
          <a
            href="https://github.com/firasmostafa"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub className="footer-icon" />
            <span>GitHub</span>
          </a>

          <a href="mailto:frasm688@gmail.com">
            <FaEnvelope className="footer-icon" />
            <span>Email</span>
          </a>

          <a href="tel:+96179360988">
            <FaPhoneAlt className="footer-icon" />
            <span>Call</span>
          </a>

          <a
            href="https://wa.me/96179360988"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp className="footer-icon" />
            <span>WhatsApp</span>
          </a>

          <Link to="/contact">
            <span>Contact Me</span>
            <FaArrowRight className="footer-icon arrow-icon" />
          </Link>

        </div>

        <div className="footer-bottom">
          <p>
            © {currentYear} Firas. All rights reserved.
          </p>

          <p>
            Designed & Developed by <strong>Firas</strong>
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;             