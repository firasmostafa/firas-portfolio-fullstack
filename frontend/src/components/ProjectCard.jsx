import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

function ProjectCard({
  title,
  description,
  image,
  link,
  liveUrl,
  technologies,
}) {
  const techList = technologies
    ? technologies.split(",").map((tech) => tech.trim())
    : [];

  return (
    <article className="project-card">
      <div className="project-image-wrapper">
        <img
          src={image}
          alt={`${title} project`}
          className="project-image"
        />

        <div className="project-overlay">
          <span>Full-Stack Project</span>
        </div>
      </div>

      <div className="project-card-content">
        <h3>{title}</h3>

        <p className="project-description">
          {description}
        </p>

        <div className="project-technologies">
          {techList.map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>

        <div className="project-actions">
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="github-btn"
            >
              <FaGithub />
              GitHub
            </a>
          )}

          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="live-btn"
            >
              <FaExternalLinkAlt />
              Live Demo
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default ProjectCard;