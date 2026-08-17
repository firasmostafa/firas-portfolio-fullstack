import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();

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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("admin_token");

    if (!token) {
      navigate("/admin/login");
      return;
    }

    async function fetchProject() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://127.0.0.1:8000/api/projects/${id}`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Project not found.");
        }

        setFormData({
          title: data.data.title || "",
          description: data.data.description || "",
          image_url: data.data.image_url || "",
          github_url: data.data.github_url || "",
          live_url: data.data.live_url || "",
          technologies: data.data.technologies || "",
        });

        setPreview(data.data.image_url || "");
      } catch (err) {
        console.error("FETCH PROJECT ERROR:", err);
        setError(err.message || "Could not load project.");
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5 MB.");
      return;
    }

    setError("");
    setImageFile(file);

    const imagePreview = URL.createObjectURL(file);
    setPreview(imagePreview);
  };

  const uploadImage = async () => {
    if (!imageFile) {
      return formData.image_url;
    }

    const adminToken = localStorage.getItem("admin_token");

    if (!adminToken) {
      navigate("/admin/login");
      throw new Error("Please login again.");
    }

    setUploadingImage(true);

    try {
      const authResponse = await fetch(
        "http://127.0.0.1:8000/api/imagekit-auth",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      const authResult = await authResponse.json();

      console.log("IMAGEKIT AUTH RESPONSE:", authResult);

      if (!authResponse.ok) {
        throw new Error(
          authResult.message || "Could not get ImageKit authentication."
        );
      }

      const authData = authResult.data;

      if (!authData?.token || !authData?.signature || !authData?.expire) {
        throw new Error("ImageKit authentication data is incomplete.");
      }

   const {
  token: uploadToken,
  signature,
  expire,
  publicKey,
} = authData;

const imageData = new FormData();

imageData.append("file", imageFile);
imageData.append(
  "fileName",
  `${Date.now()}-${imageFile.name}`
);

imageData.append("publicKey", publicKey);

imageData.append("token", uploadToken);
imageData.append("signature", signature);
imageData.append("expire", String(expire));

imageData.append(
  "folder",
  "/portfolio-projects"
);

imageData.append(
  "useUniqueFileName",
  "true"
);

      const uploadResponse = await fetch(
        "https://upload.imagekit.io/api/v1/files/upload",
        {
          method: "POST",
          body: imageData,
        }
      );

      const uploadResult = await uploadResponse.json();

      console.log("IMAGEKIT UPLOAD RESPONSE:", uploadResult);

      if (!uploadResponse.ok) {
        throw new Error(
          uploadResult.message ||
            uploadResult.error ||
            "Image upload failed."
        );
      }

      if (!uploadResult.url) {
        throw new Error("ImageKit did not return an image URL.");
      }

      return uploadResult.url;
    } catch (err) {
      console.error("IMAGEKIT UPLOAD ERROR:", err);
      throw err;
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

    setSaving(true);
    setError("");

    try {
      const imageUrl = await uploadImage();

      const updatedProject = {
        ...formData,
        image_url: imageUrl || "",
      };

      const response = await fetch(
        `http://127.0.0.1:8000/api/projects/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedProject),
        }
      );

      const data = await response.json();

      console.log("UPDATE PROJECT RESPONSE:", data);

      if (!response.ok) {
        if (data.errors) {
          const validationErrors = Object.values(data.errors)
            .flat()
            .join(" ");

          throw new Error(validationErrors);
        }

        throw new Error(data.message || "Failed to update project.");
      }

      navigate("/admin/projects");
    } catch (err) {
      console.error("UPDATE PROJECT ERROR:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-form-page">
        <div className="admin-form-card">
          <p className="admin-loading">Loading project...</p>
        </div>
      </div>
    );
  }

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

          <h1>Edit Project</h1>
          <p>Update your project information and image.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="admin-field">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Project title"
              required
            />
          </div>

          <div className="admin-field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
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
                <img src={preview} alt="Project preview" />
              </div>
            )}

            <label className="admin-file-button">
              Choose New Image
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleImageChange}
              />
            </label>

            <small className="admin-file-help">
              Choose an image from your laptop or phone. Maximum 5 MB.
            </small>

            {imageFile && (
              <p className="admin-selected-file">
                Selected: {imageFile.name}
              </p>
            )}
          </div>

          <div className="admin-field">
            <label htmlFor="github_url">GitHub URL</label>
            <input
              id="github_url"
              type="url"
              name="github_url"
              value={formData.github_url}
              onChange={handleChange}
              placeholder="https://github.com/..."
            />
          </div>

          <div className="admin-field">
            <label htmlFor="live_url">Live URL</label>
            <input
              id="live_url"
              type="url"
              name="live_url"
              value={formData.live_url}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <div className="admin-field">
            <label htmlFor="technologies">Technologies</label>
            <input
              id="technologies"
              type="text"
              name="technologies"
              value={formData.technologies}
              onChange={handleChange}
              placeholder="React, Laravel, Firebase..."
            />
          </div>

          {error && <p className="admin-error">{error}</p>}

          <div className="admin-form-actions">
            <button
              type="button"
              className="admin-cancel-btn"
              disabled={saving || uploadingImage}
              onClick={() => navigate("/admin/projects")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="admin-save-btn"
              disabled={saving || uploadingImage}
            >
              {uploadingImage
                ? "Uploading Image..."
                : saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProject;
