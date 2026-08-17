import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminSiteContent() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    hero_text: "",
    profile_image: "",
    about: "",
    skills: [],
    social_links: [],
  });

  const [newSkill, setNewSkill] = useState("");

  const [newSocial, setNewSocial] = useState({
    name: "",
    url: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* =========================================================
     LOAD SITE CONTENT
  ========================================================= */

  useEffect(() => {
    const token = localStorage.getItem("admin_token");

    if (!token) {
      navigate("/admin/login");
      return;
    }

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

        const content = data.data || {};

        setFormData({
          name: content.name || "",
          title: content.title || "",
          hero_text: content.hero_text || "",
          profile_image: content.profile_image || "",
          about: content.about || "",
          skills: Array.isArray(content.skills)
            ? content.skills
            : [],
          social_links: Array.isArray(content.social_links)
            ? content.social_links
            : [],
        });

        setImagePreview(content.profile_image || "");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSiteContent();
  }, [API_URL, navigate]);

  /* =========================================================
     HELPERS
  ========================================================= */

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const updateField = (field, value) => {
    setFormData((previousData) => ({
      ...previousData,
      [field]: value,
    }));

    clearMessages();
  };

  /* =========================================================
     SAVE ONE SECTION ONLY
  ========================================================= */

  const saveSection = async (
    sectionName,
    payload,
    successMessage
  ) => {
    const token = localStorage.getItem("admin_token");

    if (!token) {
      navigate("/admin/login");
      return false;
    }

    setSavingSection(sectionName);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API_URL}/api/site-content`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const validationErrors = Object.values(
            data.errors
          )
            .flat()
            .join(" ");

          throw new Error(validationErrors);
        }

        throw new Error(
          data.message || "Failed to save changes."
        );
      }

      setFormData((previousData) => ({
        ...previousData,
        ...data.data,
      }));

      setSuccess(
        successMessage ||
          `${sectionName} updated successfully.`
      );

      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setSavingSection("");
    }
  };

  /* =========================================================
     PROFILE IMAGE
  ========================================================= */

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

    if (
      imagePreview &&
      imagePreview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(imagePreview);
    }

    const preview = URL.createObjectURL(file);

    setImageFile(file);
    setImagePreview(preview);

    clearMessages();
  };

  const saveProfileImage = async () => {
    if (!imageFile) {
      setError("Choose a new profile image first.");
      return;
    }

    const token = localStorage.getItem("admin_token");

    if (!token) {
      navigate("/admin/login");
      return;
    }

    setSavingSection("profile_image");
    clearMessages();

    try {
      /* GET IMAGEKIT AUTH */

      const authResponse = await fetch(
        `${API_URL}/api/imagekit-auth`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
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

      const authData = authResult.data;

      if (
        !authData?.token ||
        !authData?.signature ||
        !authData?.expire ||
        !authData?.publicKey
      ) {
        throw new Error(
          "ImageKit authentication data is incomplete."
        );
      }

      /* UPLOAD IMAGE */

      const imageData = new FormData();

      imageData.append("file", imageFile);

      imageData.append(
        "fileName",
        `profile-${Date.now()}-${imageFile.name}`
      );

      imageData.append(
        "publicKey",
        authData.publicKey
      );

      imageData.append(
        "token",
        authData.token
      );

      imageData.append(
        "signature",
        authData.signature
      );

      imageData.append(
        "expire",
        String(authData.expire)
      );

      imageData.append(
        "folder",
        "/portfolio-profile"
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

      const uploadResult =
        await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(
          uploadResult.message ||
            "Profile image upload failed."
        );
      }

      if (!uploadResult.url) {
        throw new Error(
          "ImageKit did not return an image URL."
        );
      }

      /* SAVE URL TO FIRESTORE */

      const saveResponse = await fetch(
        `${API_URL}/api/site-content`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            profile_image: uploadResult.url,
          }),
        }
      );

      const saveData = await saveResponse.json();

      if (!saveResponse.ok) {
        throw new Error(
          saveData.message ||
            "Could not save profile image."
        );
      }

      setFormData((previousData) => ({
        ...previousData,
        profile_image: uploadResult.url,
      }));

      setImagePreview(uploadResult.url);
      setImageFile(null);

      setSuccess(
        "Profile image updated successfully."
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingSection("");
    }
  };

  /* =========================================================
     SKILLS
  ========================================================= */

  const addSkill = () => {
    const skill = newSkill.trim();

    if (!skill) {
      setError("Enter a skill first.");
      return;
    }

    const alreadyExists =
      formData.skills.some(
        (existingSkill) =>
          existingSkill.toLowerCase() ===
          skill.toLowerCase()
      );

    if (alreadyExists) {
      setError("This skill already exists.");
      return;
    }

    setFormData((previousData) => ({
      ...previousData,
      skills: [
        ...previousData.skills,
        skill,
      ],
    }));

    setNewSkill("");

    clearMessages();
  };

  const updateSkill = (index, value) => {
    const updatedSkills = [
      ...formData.skills,
    ];

    updatedSkills[index] = value;

    updateField(
      "skills",
      updatedSkills
    );
  };

  const deleteSkill = (index) => {
    const updatedSkills =
      formData.skills.filter(
        (_, skillIndex) =>
          skillIndex !== index
      );

    updateField(
      "skills",
      updatedSkills
    );
  };

  const saveSkills = async () => {
    const cleanedSkills =
      formData.skills
        .map((skill) => skill.trim())
        .filter(Boolean);

    const uniqueSkills = Array.from(
      new Map(
        cleanedSkills.map((skill) => [
          skill.toLowerCase(),
          skill,
        ])
      ).values()
    );

    setFormData((previousData) => ({
      ...previousData,
      skills: uniqueSkills,
    }));

    await saveSection(
      "skills",
      {
        skills: uniqueSkills,
      },
      "Skills updated successfully."
    );
  };

  /* =========================================================
     SOCIAL LINKS
  ========================================================= */

  const addSocialLink = () => {
    const name = newSocial.name.trim();
    const url = newSocial.url.trim();

    if (!name || !url) {
      setError(
        "Enter both platform name and link."
      );
      return;
    }

    const alreadyExists =
      formData.social_links.some(
        (link) =>
          link.name.toLowerCase() ===
          name.toLowerCase()
      );

    if (alreadyExists) {
      setError(
        "This social link already exists."
      );
      return;
    }

    setFormData((previousData) => ({
      ...previousData,

      social_links: [
        ...previousData.social_links,
        {
          name,
          url,
        },
      ],
    }));

    setNewSocial({
      name: "",
      url: "",
    });

    clearMessages();
  };

  const updateSocialLink = (
    index,
    field,
    value
  ) => {
    const updatedLinks = [
      ...formData.social_links,
    ];

    updatedLinks[index] = {
      ...updatedLinks[index],
      [field]: value,
    };

    updateField(
      "social_links",
      updatedLinks
    );
  };

  const deleteSocialLink = (index) => {
    const updatedLinks =
      formData.social_links.filter(
        (_, linkIndex) =>
          linkIndex !== index
      );

    updateField(
      "social_links",
      updatedLinks
    );
  };

  const saveSocialLinks = async () => {
    const cleanedLinks =
      formData.social_links
        .map((link) => ({
          name: link.name.trim(),
          url: link.url.trim(),
        }))
        .filter(
          (link) =>
            link.name && link.url
        );

    setFormData((previousData) => ({
      ...previousData,
      social_links: cleanedLinks,
    }));

    await saveSection(
      "social_links",
      {
        social_links: cleanedLinks,
      },
      "Social links updated successfully."
    );
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="site-admin-page">
        <div className="site-admin-container">
          <p className="admin-loading">
            Loading Home settings...
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="site-admin-page">
      <div className="site-admin-container">

        {/* HEADER */}

        <div className="site-admin-heading">
          <button
            type="button"
            className="site-back-button"
            onClick={() =>
              navigate("/admin/projects")
            }
          >
            ← Back
          </button>

          <div>
            <span className="site-admin-eyebrow">
              HOME SETTINGS
            </span>

            <h1>
              Edit Home
            </h1>

            <p>
              Manage each section of your
              portfolio separately.
            </p>
          </div>
        </div>

        {/* MESSAGES */}

        {error && (
          <div className="site-message site-error">
            {error}
          </div>
        )}

        {success && (
          <div className="site-message site-success">
            {success}
          </div>
        )}

        {/* =================================================
            PROFILE IMAGE
        ================================================= */}

        <section className="site-setting-card">
          <div className="setting-info">
            <span className="setting-number">
              01
            </span>

            <div>
              <h2>
                Profile Image
              </h2>

              <p>
                Change the image shown in
                the Home hero section.
              </p>
            </div>
          </div>

          <div className="setting-control">
            <div className="site-profile-layout">

              <div className="site-profile-preview">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile preview"
                  />
                ) : (
                  <div className="site-image-placeholder">
                    No Image
                  </div>
                )}
              </div>

              <div className="site-image-actions">

                <label className="site-browse-button">
                  Browse Image

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleImageChange}
                  />
                </label>

                <button
                  type="button"
                  className="site-save-button"
                  disabled={
                    savingSection ===
                    "profile_image"
                  }
                  onClick={saveProfileImage}
                >
                  {savingSection ===
                  "profile_image"
                    ? "Uploading..."
                    : "Save Image"}
                </button>

                <small>
                  JPG, PNG or WEBP. Maximum 5 MB.
                </small>

                {imageFile && (
                  <span className="site-file-name">
                    {imageFile.name}
                  </span>
                )}

              </div>

            </div>
          </div>
        </section>

        {/* =================================================
            NAME
        ================================================= */}

        <section className="site-setting-card">
          <div className="setting-info">
            <span className="setting-number">
              02
            </span>

            <div>
              <h2>
                Name
              </h2>

              <p>
                Your name shown in the hero
                and About section.
              </p>
            </div>
          </div>

          <div className="setting-control">
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                updateField(
                  "name",
                  e.target.value
                )
              }
              placeholder="Firas Mostafa"
            />

            <button
              type="button"
              className="site-save-button"
              disabled={
                savingSection === "name"
              }
              onClick={() =>
                saveSection(
                  "name",
                  {
                    name: formData.name,
                  },
                  "Name updated successfully."
                )
              }
            >
              {savingSection === "name"
                ? "Saving..."
                : "Save Name"}
            </button>
          </div>
        </section>

        {/* =================================================
            PROFESSIONAL TITLE
        ================================================= */}

        <section className="site-setting-card">
          <div className="setting-info">
            <span className="setting-number">
              03
            </span>

            <div>
              <h2>
                Professional Title
              </h2>

              <p>
                Your main professional role
                displayed on the Home page.
              </p>
            </div>
          </div>

          <div className="setting-control">
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                updateField(
                  "title",
                  e.target.value
                )
              }
              placeholder="Full-Stack Developer"
            />

            <button
              type="button"
              className="site-save-button"
              disabled={
                savingSection === "title"
              }
              onClick={() =>
                saveSection(
                  "title",
                  {
                    title: formData.title,
                  },
                  "Professional title updated."
                )
              }
            >
              {savingSection === "title"
                ? "Saving..."
                : "Save Title"}
            </button>
          </div>
        </section>

        {/* =================================================
            HERO TEXT
        ================================================= */}

        <section className="site-setting-card">
          <div className="setting-info">
            <span className="setting-number">
              04
            </span>

            <div>
              <h2>
                Hero Text
              </h2>

              <p>
                Main introduction displayed
                beside your profile image.
              </p>
            </div>
          </div>

          <div className="setting-control">
            <textarea
              rows="5"
              value={formData.hero_text}
              onChange={(e) =>
                updateField(
                  "hero_text",
                  e.target.value
                )
              }
              placeholder="Write your introduction..."
            />

            <button
              type="button"
              className="site-save-button"
              disabled={
                savingSection ===
                "hero_text"
              }
              onClick={() =>
                saveSection(
                  "hero_text",
                  {
                    hero_text:
                      formData.hero_text,
                  },
                  "Hero text updated successfully."
                )
              }
            >
              {savingSection ===
              "hero_text"
                ? "Saving..."
                : "Save Hero Text"}
            </button>
          </div>
        </section>

        {/* =================================================
            ABOUT
        ================================================= */}

        <section className="site-setting-card">
          <div className="setting-info">
            <span className="setting-number">
              05
            </span>

            <div>
              <h2>
                About Me
              </h2>

              <p>
                Edit the personal description
                shown in your About section.
              </p>
            </div>
          </div>

          <div className="setting-control">
            <textarea
              rows="7"
              value={formData.about}
              onChange={(e) =>
                updateField(
                  "about",
                  e.target.value
                )
              }
              placeholder="Tell visitors about yourself..."
            />

            <button
              type="button"
              className="site-save-button"
              disabled={
                savingSection === "about"
              }
              onClick={() =>
                saveSection(
                  "about",
                  {
                    about: formData.about,
                  },
                  "About section updated successfully."
                )
              }
            >
              {savingSection === "about"
                ? "Saving..."
                : "Save About"}
            </button>
          </div>
        </section>

        {/* =================================================
            SKILLS
        ================================================= */}

        <section className="site-setting-card">
          <div className="setting-info">
            <span className="setting-number">
              06
            </span>

            <div>
              <h2>
                Skills
              </h2>

              <p>
                Add, edit or remove technologies
                displayed in Tech Stack.
              </p>
            </div>
          </div>

          <div className="setting-control">

            <div className="site-add-row">
              <input
                type="text"
                value={newSkill}
                onChange={(e) =>
                  setNewSkill(
                    e.target.value
                  )
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                placeholder="New skill..."
              />

              <button
                type="button"
                className="site-add-button"
                onClick={addSkill}
              >
                + Add Skill
              </button>
            </div>

            <div className="site-skills-editor">
              {formData.skills.length === 0 ? (
                <p className="site-empty">
                  No skills added yet.
                </p>
              ) : (
                formData.skills.map(
                  (skill, index) => (
                    <div
                      className="site-skill-editor-item"
                      key={index}
                    >
                      <span className="site-item-number">
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <input
                        type="text"
                        value={skill}
                        onChange={(e) =>
                          updateSkill(
                            index,
                            e.target.value
                          )
                        }
                      />

                      <button
                        type="button"
                        className="site-delete-button"
                        onClick={() =>
                          deleteSkill(index)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  )
                )
              )}
            </div>

            <button
              type="button"
              className="site-save-button"
              disabled={
                savingSection === "skills"
              }
              onClick={saveSkills}
            >
              {savingSection === "skills"
                ? "Saving..."
                : "Save Skills"}
            </button>

          </div>
        </section>

        {/* =================================================
            SOCIAL LINKS
        ================================================= */}

        <section className="site-setting-card">
          <div className="setting-info">
            <span className="setting-number">
              07
            </span>

            <div>
              <h2>
                Social Links
              </h2>

              <p>
                Manage links used by your
                Header and Footer.
              </p>
            </div>
          </div>

          <div className="setting-control">

            <div className="site-social-add">
              <input
                type="text"
                value={newSocial.name}
                onChange={(e) =>
                  setNewSocial(
                    (previous) => ({
                      ...previous,
                      name: e.target.value,
                    })
                  )
                }
                placeholder="Platform"
              />

              <input
                type="text"
                value={newSocial.url}
                onChange={(e) =>
                  setNewSocial(
                    (previous) => ({
                      ...previous,
                      url: e.target.value,
                    })
                  )
                }
                placeholder="https://..."
              />

              <button
                type="button"
                className="site-add-button"
                onClick={addSocialLink}
              >
                + Add Link
              </button>
            </div>

            <div className="site-social-editor">

              {formData.social_links.length === 0 ? (
                <p className="site-empty">
                  No social links added yet.
                </p>
              ) : (
                formData.social_links.map(
                  (link, index) => (
                    <div
                      className="site-social-editor-item"
                      key={index}
                    >
                      <span className="site-item-number">
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <input
                        type="text"
                        value={link.name}
                        onChange={(e) =>
                          updateSocialLink(
                            index,
                            "name",
                            e.target.value
                          )
                        }
                        placeholder="Platform"
                      />

                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) =>
                          updateSocialLink(
                            index,
                            "url",
                            e.target.value
                          )
                        }
                        placeholder="URL"
                      />

                      <button
                        type="button"
                        className="site-delete-button"
                        onClick={() =>
                          deleteSocialLink(
                            index
                          )
                        }
                      >
                        Delete
                      </button>
                    </div>
                  )
                )
              )}

            </div>

            <button
              type="button"
              className="site-save-button"
              disabled={
                savingSection ===
                "social_links"
              }
              onClick={saveSocialLinks}
            >
              {savingSection ===
              "social_links"
                ? "Saving..."
                : "Save Social Links"}
            </button>

          </div>
        </section>

      </div>
    </div>
  );
}

export default AdminSiteContent;