import { Link } from "react-router-dom";

function Landing() {
  const technologies = [
    "React",
    "JavaScript",
    "Laravel",
    "PHP",
    "MySQL",
  ];

  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <p className="hero-intro">
            <span className="hero-wave">👋</span>
            Hello, I'm
          </p>

          <h1>
            Firas <span>Mostafa</span>
          </h1>

          <h2>Full-Stack Developer</h2>

          <p className="hero-description">
            I build modern, responsive, and scalable web applications
            using React, JavaScript, PHP, Laravel, and MySQL. I enjoy
            transforming ideas into complete digital experiences, from
            user interfaces to back-end systems.
          </p>

          <div className="hero-tech">
            {technologies.map((technology) => (
              <span key={technology}>{technology}</span>
            ))}
          </div>

          <div className="hero-buttons">
            <Link to="/projects" className="primary-btn">
              View Projects
              <span>→</span>
            </Link>

            <Link to="/contact" className="secondary-btn">
              Contact Me
            </Link>
          </div>

          <div className="hero-status-mobile">
            <span className="status-dot"></span>
            Available for opportunities
          </div>
        </div>

        <div className="hero-image-wrapper">
          <div className="hero-image-glow"></div>

          <div className="hero-image-border">
            <img
              src="/my.jpeg"
              alt="Firas Mostafa"
              className="hero-image"
            />
          </div>

          <div className="available-badge">
            <span className="status-dot"></span>
            Available for opportunities
          </div>
        </div>
      </div>
    </section>
  );
}

export default Landing;