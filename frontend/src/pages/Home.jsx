import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [siteContent, setSiteContent] = useState({
    name: "Firas Mostafa",
    title: "Full-Stack Developer",
    hero_text:
      "I build modern, responsive, and maintainable web applications using React, Laravel, PHP, MySQL, and modern web technologies.",
    profile_image: "/my.jpeg",
    about:
      "I'm focused on creating clean and responsive user interfaces, developing APIs, working with databases, and building complete applications from front end to back end.",
    skills: [
      "React",
      "JavaScript",
      "HTML",
      "CSS",
      "PHP",
      "Laravel",
      "MySQL",
      "Git",
      "GitHub",
      "REST API",
    ],
    social_links: [],
  });

  const [loadingContent, setLoadingContent] = useState(true);

  useEffect(() => {
    async function fetchSiteContent() {
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
            data.message || "Failed to load site content."
          );
        }

        setSiteContent((previous) => ({
          ...previous,
          ...data.data,

          name:
            data.data.name ||
            previous.name,

          title:
            data.data.title ||
            previous.title,

          hero_text:
            data.data.hero_text ||
            previous.hero_text,

          profile_image:
            data.data.profile_image ||
            previous.profile_image,

          about:
            data.data.about ||
            previous.about,

          skills:
            Array.isArray(data.data.skills) &&
            data.data.skills.length > 0
              ? data.data.skills
              : previous.skills,

          social_links:
            Array.isArray(data.data.social_links)
              ? data.data.social_links
              : previous.social_links,
        }));
      } catch (error) {
        console.error(
          "SITE CONTENT ERROR:",
          error
        );
      } finally {
        setLoadingContent(false);
      }
    }

    fetchSiteContent();
  }, [API_URL]);

  const getSkillMeta = (skill) => {
    const skillMeta = {
      React: {
        type: "Frontend",
        icon: "⚛",
      },

      JavaScript: {
        type: "Language",
        icon: "JS",
      },

      HTML: {
        type: "Frontend",
        icon: "5",
      },

      CSS: {
        type: "Frontend",
        icon: "3",
      },

      PHP: {
        type: "Backend",
        icon: "PHP",
      },

      Laravel: {
        type: "Backend",
        icon: "L",
      },

      MySQL: {
        type: "Database",
        icon: "DB",
      },

      Git: {
        type: "Tool",
        icon: "Git",
      },

      GitHub: {
        type: "Tool",
        icon: "GH",
      },

      "REST API": {
        type: "Backend",
        icon: "{ }",
      },
    };

    return (
      skillMeta[skill] || {
        type: "Technology",
        icon: "</>",
      }
    );
  };

  return (
    <main className="home-page">
      {/* ================= HERO ================= */}

      <section className="dev-hero">
        <div className="dev-hero-bg">
          <span className="floating-code code-one">
            &lt;/&gt;
          </span>

          <span className="floating-code code-two">
            {"{ }"}
          </span>

          <span className="floating-code code-three">
            API
          </span>
        </div>

        <div className="dev-hero-content">
          <div className="dev-badge">
            <span className="dev-badge-dot"></span>

            {siteContent.title}
          </div>

          <h1>
            Building digital
            <span> experiences with code.</span>
          </h1>

          <p className="dev-hero-description">
            Hi, I'm{" "}
            <strong>
              {siteContent.name}
            </strong>
            .{" "}
            {siteContent.hero_text}
          </p>

          <div className="dev-actions">
            <Link
              to="/projects"
              className="dev-primary-btn"
            >
              <span>
                View Projects
              </span>

              <span className="btn-arrow">
                →
              </span>
            </Link>

            <Link
              to="/contact"
              className="dev-secondary-btn"
            >
              Contact Me
            </Link>
          </div>

          <div className="dev-status">
            <span className="status-dot"></span>

            <div>
              <strong>
                Available for opportunities
              </strong>

              <small>
                Open to development projects and junior roles
              </small>
            </div>
          </div>
        </div>

        {/* ================= PHOTO ================= */}

        <div className="dev-photo-area">
          <div className="dev-photo-ring">
            <img
              src={siteContent.profile_image}
              alt={siteContent.name}
            />
          </div>

          <div className="floating-card floating-card-react">
            <span>
              &lt;/&gt;
            </span>

            React
          </div>

          <div className="floating-card floating-card-api">
            <span>
              {"{ }"}
            </span>

            REST API
          </div>

          <div className="floating-card floating-card-db">
            <span>
              01
            </span>

            MySQL
          </div>
        </div>
      </section>

      {/* ================= ABOUT ================= */}

      <section className="dev-about">
        <div className="dev-section-title">
          <span className="dev-section-number">
            01
          </span>

          <div>
            <p>
              ABOUT ME
            </p>

            <h2>
              I turn ideas into
              <span>
                {" "}
                working products.
              </span>
            </h2>
          </div>
        </div>

        <div className="dev-about-card">
          <div className="code-window-header">
            <div className="code-window-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <span>
              about-me.js
            </span>
          </div>

          <div className="code-window-content">
            <p className="code-line">
              <span className="code-keyword">
                const
              </span>{" "}

              <span className="code-variable">
                developer
              </span>{" "}

              = {"{"}
            </p>

            <p className="code-property">
              <span>
                name:
              </span>

              <strong>
                "{siteContent.name}",
              </strong>
            </p>

            <p className="code-property">
              <span>
                role:
              </span>

              <strong>
                "{siteContent.title}",
              </strong>
            </p>

            <p className="code-property">
              <span>
                focus:
              </span>

              <strong>
                "Full-Stack Development",
              </strong>
            </p>

            <p className="code-property">
              <span>
                goal:
              </span>

              <strong>
                "Build useful digital products"
              </strong>
            </p>

            <p className="code-line">
              {"};"}
            </p>
          </div>

          <div className="about-description">
            <p>
              {siteContent.about}
            </p>
          </div>
        </div>
      </section>

      {/* ================= TECH STACK ================= */}

      <section className="dev-stack">
        <div className="dev-stack-header">
          <div className="dev-section-title">
            <span className="dev-section-number">
              02
            </span>

            <div>
              <p>
                TECH STACK
              </p>

              <h2>
                Tools behind
                <span>
                  {" "}
                  my code.
                </span>
              </h2>
            </div>
          </div>

          <p className="dev-stack-description">
            Technologies I use to design,
            build, connect, and maintain
            modern web applications.
          </p>
        </div>

        {!loadingContent && (
          <div className="dev-tech-grid">
            {siteContent.skills.map(
              (skill, index) => {
                const meta =
                  getSkillMeta(skill);

                return (
                  <article
                    className="dev-tech-card"
                    key={`${skill}-${index}`}
                  >
                    <span className="dev-tech-number">
                      {String(index + 1).padStart(
                        2,
                        "0"
                      )}
                    </span>

                    <div className="dev-tech-icon">
                      {meta.icon}
                    </div>

                    <h3>
                      {skill}
                    </h3>

                    <span className="dev-tech-type">
                      {meta.type}
                    </span>
                  </article>
                );
              }
            )}
          </div>
        )}


      </section>
    </main>
  );
}

export default Home;