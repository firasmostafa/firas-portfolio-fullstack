import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaPhoneAlt,
  FaWhatsapp,
  FaGlobe,
} from "react-icons/fa";

import { FaArrowRight } from "react-icons/fa6";

function Footer() {
  const API_URL = import.meta.env.VITE_API_URL;
  const currentYear = new Date().getFullYear();

  // لمعرفة الصفحة الحالية
  const location = useLocation();

  // هل نحن داخل صفحة Contact؟
  const isContactPage =
    location.pathname === "/contact";

  /*
  |--------------------------------------------------------------------------
  | DEFAULT SOCIAL LINKS
  |--------------------------------------------------------------------------
  */

  const defaultSocialLinks = [
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/firas-mostafa-b71843345",
    },
    {
      name: "GitHub",
      url: "https://github.com/firasmostafa",
    },
    {
      name: "Email",
      url: "mailto:frasm688@gmail.com",
    },
    {
      name: "Call",
      url: "tel:+96179360988",
    },
    {
      name: "WhatsApp",
      url: "https://wa.me/96179360988",
    },
  ];

  const [socialLinks, setSocialLinks] =
    useState(defaultSocialLinks);

  /*
  |--------------------------------------------------------------------------
  | LOAD SOCIAL LINKS FROM API
  |--------------------------------------------------------------------------
  */

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

        const savedLinks =
          data.data?.social_links;

        // إذا لم توجد روابط محفوظة
        // نبقي الروابط الافتراضية
        if (
          !Array.isArray(savedLinks) ||
          savedLinks.length === 0
        ) {
          return;
        }

        /*
         * دمج الروابط المحفوظة
         * مع الروابط الموجودة أصلًا.
         */

        const mergedLinks = [
          ...defaultSocialLinks,
        ];

        savedLinks.forEach((savedLink) => {
          const existingIndex =
            mergedLinks.findIndex(
              (link) =>
                link.name.toLowerCase() ===
                savedLink.name.toLowerCase()
            );

          // إذا كان الرابط موجودًا
          // نحدّثه
          if (existingIndex !== -1) {
            mergedLinks[existingIndex] = {
              ...mergedLinks[existingIndex],
              ...savedLink,
            };
          }

          // إذا كان رابطًا جديدًا
          // نضيفه
          else {
            mergedLinks.push(savedLink);
          }
        });

        setSocialLinks(mergedLinks);
      } catch (error) {
        console.error(
          "FOOTER SOCIAL LINKS ERROR:",
          error
        );
      }
    }

    fetchSocialLinks();
  }, [API_URL]);

  /*
  |--------------------------------------------------------------------------
  | SOCIAL ICON
  |--------------------------------------------------------------------------
  */

  const getSocialIcon = (name) => {
    const normalizedName =
      name.toLowerCase();

    if (
      normalizedName.includes("github")
    ) {
      return <FaGithub />;
    }

    if (
      normalizedName.includes("linkedin")
    ) {
      return <FaLinkedin />;
    }

    if (
      normalizedName.includes("email") ||
      normalizedName.includes("mail")
    ) {
      return <FaEnvelope />;
    }

    if (
      normalizedName.includes("phone") ||
      normalizedName.includes("call")
    ) {
      return <FaPhoneAlt />;
    }

    if (
      normalizedName.includes("whatsapp")
    ) {
      return <FaWhatsapp />;
    }

    // أي رابط جديد غير معروف
    return <FaGlobe />;
  };

  /*
  |--------------------------------------------------------------------------
  | CHECK EXTERNAL LINK
  |--------------------------------------------------------------------------
  */

  const isExternalLink = (url) => {
    return (
      url?.startsWith("http://") ||
      url?.startsWith("https://")
    );
  };

  return (
    <footer className="footer">
      <div className="footer-content">

        {/* ================= ADMIN ================= */}

        <Link
          to="/admin/login"
          className="footer-admin-link"
        >
          Admin
        </Link>

        {/* ================= BRAND ================= */}

        <div className="footer-brand">
          <h3>
            Firas.dev
          </h3>

          <p>
            Full-Stack Developer
          </p>
        </div>

        {/* ================= SOCIAL LINKS ================= */}

        <div className="footer-socials">

          {socialLinks.map(
            (link, index) => (
              <a
                key={`${link.name}-${index}`}
                href={link.url}
                target={
                  isExternalLink(link.url)
                    ? "_blank"
                    : undefined
                }
                rel={
                  isExternalLink(link.url)
                    ? "noopener noreferrer"
                    : undefined
                }
              >
                <span className="footer-icon">
                  {getSocialIcon(
                    link.name
                  )}
                </span>

                <span>
                  {link.name}
                </span>
              </a>
            )
          )}

          {/* ================= CONTACT ME ================= */}
          {/* يظهر في كل الصفحات إلا Contact */}

          {!isContactPage && (
            <Link to="/contact">
              <span>
                Contact Me
              </span>

              <FaArrowRight
                className="footer-icon arrow-icon"
              />
            </Link>
          )}

        </div>

        {/* ================= BOTTOM ================= */}

        <div className="footer-bottom">
          <p>
            © {currentYear} Firas.
            All rights reserved.
          </p>

          <p>
            Designed & Developed by{" "}
            <strong>
              Firas
            </strong>
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer; 