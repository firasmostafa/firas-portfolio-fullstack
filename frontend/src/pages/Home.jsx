import { Link } from "react-router-dom";

function Home() {
  const skills = [
    { name: "React", type: "Frontend" },
    { name: "JavaScript", type: "Language" },
    { name: "HTML", type: "Frontend" },
    { name: "CSS", type: "Frontend" },
    { name: "PHP", type: "Backend" },
    { name: "Laravel", type: "Backend" },
    { name: "MySQL", type: "Database" },
    { name: "Git", type: "Tool" },
    { name: "GitHub", type: "Tool" },
    { name: "REST API", type: "Backend" },
  ];

  return (
    <main className="home-page">
      {/* ================= HERO ================= */}
      <section className="dev-hero">
        <div className="dev-hero-bg">
          <span className="floating-code code-one">&lt;/&gt;</span>
          <span className="floating-code code-two">{"{ }"}</span>
          <span className="floating-code code-three">API</span>
        </div>

        <div className="dev-hero-content">
          <div className="dev-badge">
            <span className="dev-badge-dot"></span>
            Full-Stack Developer
          </div>

          <h1>
            Building digital
            <span> experiences with code.</span>
          </h1>

          <p className="dev-hero-description">
            Hi, I'm <strong>Firas Mostafa</strong>. I build modern,
            responsive, and maintainable web applications using React,
            Laravel, PHP, MySQL, and modern web technologies.
          </p>

          <div className="dev-actions">
            <Link to="/projects" className="dev-primary-btn">
              <span>View Projects</span>
              <span className="btn-arrow">→</span>
            </Link>

            <Link to="/contact" className="dev-secondary-btn">
              Contact Me
            </Link>
          </div>

          <div className="dev-status">
            <span className="status-dot"></span>

            <div>
              <strong>Available for opportunities</strong>
              <small>Open to development projects and junior roles</small>
            </div>
          </div>
        </div>

        {/* PHOTO */}
        <div className="dev-photo-area">
          <div className="dev-photo-ring">
            <img src="/my.jpeg" alt="Firas Mostafa" />
          </div>

          <div className="floating-card floating-card-react">
            <span>&lt;/&gt;</span>
            React
          </div>

          <div className="floating-card floating-card-api">
            <span>{"{ }"}</span>
            REST API
          </div>

          <div className="floating-card floating-card-db">
            <span>01</span>
            MySQL
          </div>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section className="dev-about">
        <div className="dev-section-title">
          <span className="dev-section-number">01</span>

          <div>
            <p>ABOUT ME</p>

            <h2>
              I turn ideas into
              <span> working products.</span>
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

            <span>about-me.js</span>
          </div>

          <div className="code-window-content">
            <p className="code-line">
              <span className="code-keyword">const</span>{" "}
              <span className="code-variable">developer</span> = {"{"}
            </p>

            <p className="code-property">
              <span>focus:</span>
              <strong>"Full-Stack Development",</strong>
            </p>

            <p className="code-property">
              <span>frontend:</span>
              <strong>"React + JavaScript",</strong>
            </p>

            <p className="code-property">
              <span>backend:</span>
              <strong>"Laravel + PHP",</strong>
            </p>

            <p className="code-property">
              <span>goal:</span>
              <strong>"Build useful digital products"</strong>
            </p>

            <p className="code-line">{"};"}</p>
          </div>

          <div className="about-description">
            <p>
              I'm focused on creating clean and responsive user interfaces,
              developing APIs, working with databases, and building complete
              applications from front end to back end.
            </p>
          </div>
        </div>
      </section>

      {/* ================= TECH STACK ================= */}
      <section className="dev-stack">
        <div className="dev-stack-header">
          <div className="dev-section-title">
            <span className="dev-section-number">02</span>

            <div>
              <p>TECH STACK</p>

              <h2>
                Tools behind
                <span> my code.</span>
              </h2>
            </div>
          </div>

          <p className="dev-stack-description">
            Technologies I use to design, build, connect, and maintain
            modern web applications.
          </p>
        </div>

        <div className="dev-stack-grid">
          {skills.map((skill, index) => (
            <div className="dev-skill-card" key={skill.name}>
              <div className="skill-top">
                <span className="skill-code">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="skill-type">{skill.type}</span>
              </div>

              <div className="skill-bottom">
                <h3>{skill.name}</h3>
                <span className="skill-arrow">↗</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;