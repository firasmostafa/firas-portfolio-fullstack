import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";

function Header() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [showHeader, setShowHeader] = useState(true);

  const [socialLinks, setSocialLinks] = useState([]);
    


  /* =========================================
     HEADER SCROLL
  ========================================= */

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (
        currentScrollY > lastScrollY &&
        currentScrollY > 100
      ) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  /* =========================================
     LOAD SOCIAL LINKS
  ========================================= */

  useEffect(() => {
    async function fetchSocialLinks() {
      try {
        const response = await fetch(
          `${API_URL}/api/site-content`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load social links."
          );
        }

        if (
          Array.isArray(data.data?.social_links)
        ) {
          setSocialLinks(
            data.data.social_links
          );
        }
      } catch (error) {
        console.error(
          "SOCIAL LINKS ERROR:",
          error
        );
      }
    }

    fetchSocialLinks();
  }, [API_URL]);

  return (
    <header
      className={`header ${
        showHeader ? "show" : "hide"
      }`}
    >
      <nav className="navbar">

        {/* LOGO */}

        <Link to="/" className="logo">
          Firas.dev
        </Link>

        {/* NAVIGATION */}

        <div className="nav-links">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/projects"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Projects
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Contact
          </NavLink>
        </div>

        {/* SOCIAL LINKS */}

        <div className="social-links">
          {socialLinks.map((link, index) => (
            <a
              key={`${link.name}-${index}`}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.name}
            </a>
          ))}
        </div>

      </nav>
    </header>
  );
}

export default Header;