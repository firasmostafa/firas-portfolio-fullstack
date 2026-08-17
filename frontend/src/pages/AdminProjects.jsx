import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");

    if (!token) {
      navigate("/admin/login");
      return;
    }

    async function fetchProjects() {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/projects"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load projects."
          );
        }

        if (data.success) {
          setProjects(data.data);
        }
      } catch (error) {
        console.error("FETCH PROJECTS ERROR:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [navigate]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) return;

    const token = localStorage.getItem("admin_token");

    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/projects/${id}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message || "Failed to delete project."
        );
        return;
      }

      setProjects((prevProjects) =>
        prevProjects.filter(
          (project) => project.id !== id
        )
      );
    } catch (error) {
      console.error("DELETE PROJECT ERROR:", error);

      alert("Something went wrong while deleting the project.");
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("admin_token");

    try {
      if (token) {
        await fetch(
          "http://127.0.0.1:8000/api/logout",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
    } finally {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");

      navigate("/admin/login");
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <p className="admin-loading">
          Loading projects...
        </p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-topbar">
        <div>
          <h1>Project Management</h1>

          <p>
            Manage the projects displayed on your portfolio.
          </p>
        </div>

        <div className="admin-topbar-actions">
          <button
            type="button"
            className="admin-add-btn"
            onClick={() =>
              navigate("/admin/projects/create")
            }
          >
            + Add Project
          </button>

          <button
            type="button"
            className="admin-logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="admin-project-grid">
        {projects.length === 0 ? (
          <p>No projects found.</p>
        ) : (
          projects.map((project) => (
            <div
              className="admin-project-card"
              key={project.id}
            >
              {project.image_url && (
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="admin-project-image"
                />
              )}

              <div className="admin-project-content">
                <h2>{project.title}</h2>

                <p>{project.description}</p>

                {project.technologies && (
                  <span className="admin-tech">
                    {project.technologies}
                  </span>
                )}

                <div className="admin-project-actions">
                  <button
                    type="button"
                    className="admin-edit-btn"
                    onClick={() =>
                      navigate(
                        `/admin/projects/${project.id}/edit`
                      )
                    }
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="admin-delete-btn"
                    onClick={() =>
                      handleDelete(project.id)
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminProjects;