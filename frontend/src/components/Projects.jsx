import { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://127.0.0.1:8000/api/projects",
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to fetch projects."
          );
        }

        setProjects(result.data || []);
      } catch (error) {
        console.error("PROJECTS ERROR:", error);

        setError("Unable to load projects.");
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <section className="projects">
        <div className="projects-container">
          <p>Loading projects...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="projects">
        <div className="projects-container">
          <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="projects">
      <div className="projects-container">
        <h2>My Projects</h2>

        <p className="projects-intro">
          Explore some of the projects I've built using modern
          front-end and back-end technologies.
        </p>

        <div className="projects-grid">
          {projects.length === 0 ? (
            <p>No projects available yet.</p>
          ) : (
            projects.map((project) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                description={project.description}
                image={project.image_url}
                link={project.github_url}
                liveUrl={project.live_url}
                technologies={project.technologies}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default Projects;