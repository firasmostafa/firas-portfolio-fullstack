import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateProject() {
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    github_url: "",
    live_url: "",
    technologies: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const uploadImage = async () => {
    if (!imageFile) {
      return "";
    }

    const adminToken = localStorage.getItem("admin_token");

    setUploadingImage(true);

    try {
      const authResponse = await fetch(
        `${API_URL}/api/imagekit-auth`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      const authResult = await authResponse.json();

      if (!authResponse.ok) {
        throw new Error(
          authResult.message ||
            "Could not get ImageKit authentication."
        );
      }

      const {
        token: uploadToken,
        signature,
        expire,
        publicKey,
      } = authResult.data;

      const imageData = new FormData();

      imageData.append("file", imageFile);
      imageData.append("fileName", imageFile.name);
      imageData.append("publicKey", publicKey);
      imageData.append("token", uploadToken);
      imageData.append("signature", signature);
      imageData.append("expire", expire);
      imageData.append("folder", "/portfolio-projects");

      const uploadResponse = await fetch(
        "https://upload.imagekit.io/api/v1/files/upload",
        {
          method: "POST",
          body: imageData,
        }
      );

      const uploadResult = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(
          uploadResult.message || "Image upload failed."
        );
      }

      return uploadResult.url;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("admin_token");

    if (!token) {
      navigate("/admin/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const imageUrl = await uploadImage();

      const response = await fetch(
        `${API_URL}/api/projects`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            ...formData,
            image_url: imageUrl,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create project"
        );
      }

      navigate("/admin/projects");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-form-page">
      <div className="admin-form-card">
        <div className="admin-form-header">
          <button
            type="button"
            className="admin-back-btn"
            onClick={() => navigate("/admin/projects")}
          >
            ← Back
          </button>

          <h1>Add New Project</h1>

          <p>Add a new project to your portfolio.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="admin-field">
            <label>Title</label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Project title"
              required
            />
          </div>

          <div className="admin-field">
            <label>Description</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your project"
              rows="6"
              required
            />
          </div>

          <div className="admin-field">
            <label>Project Image</label>

            {preview && (
              <div className="admin-image-preview">
                <img
                  src={preview}
                  alt="Project preview"
                />
              </div>
            )}

            <label className="admin-file-button">
              Choose Image

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>

            <small className="admin-file-help">
              Choose an image from your laptop or phone.
            </small>

            {imageFile && (
              <p className="admin-selected-file">
                Selected: {imageFile.name}
              </p>
            )}
          </div>

          <div className="admin-field">
            <label>GitHub URL</label>

            <input
              type="url"
              name="github_url"
              value={formData.github_url}
              onChange={handleChange}
              placeholder="https://github.com/..."
            />
          </div>

          <div className="admin-field">
            <label>Live URL</label>

            <input
              type="url"
              name="live_url"
              value={formData.live_url}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <div className="admin-field">
            <label>Technologies</label>

            <input
              type="text"
              name="technologies"
              value={formData.technologies}
              onChange={handleChange}
              placeholder="React, Laravel, Firebase..."
            />
          </div>

          {error && (
            <p className="admin-error">
              {error}
            </p>
          )}

          <div className="admin-form-actions">
            <button
              type="button"
              className="admin-cancel-btn"
              onClick={() =>
                navigate("/admin/projects")
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="admin-save-btn"
              disabled={loading || uploadingImage}
            >
              {uploadingImage
                ? "Uploading Image..."
                : loading
                ? "Adding Project..."
                : "Add Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProject;