import Landing from "../components/Landing";

function Home() {
  const skills = [
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
  ];

  return (
    <>
      <Landing />

      <section className="about-section">
        <div className="about-container">
          <div className="about-text">
            <p className="section-label">About Me</p>

            <h2>
              Building complete web experiences from
              <span> front end to back end.</span>
            </h2>

            <p>
              I'm Firas, a Full-Stack Developer focused on creating
              responsive, practical, and maintainable web applications.
              I enjoy working with React on the front end and Laravel
              with MySQL on the back end.
            </p>

            <p>
              I like turning ideas into real products, building APIs,
              working with databases, and creating interfaces that are
              simple and easy to use.
            </p>
          </div>

          <div className="skills-box">
            <p className="section-label">My Skills</p>

            <h3>Technologies I work with</h3>

            <div className="skills-grid">
              {skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;