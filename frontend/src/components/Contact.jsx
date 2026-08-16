import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

function Contact() {
  const [status, setStatus] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      enquiry: "",
      message: "",
    },

    validationSchema: Yup.object({
      name: Yup.string()
        .required("Name is required."),

      email: Yup.string()
        .email("Please enter a valid email address.")
        .required("Email is required."),

      enquiry: Yup.string()
        .required("Please select an enquiry type."),

      message: Yup.string()
        .min(25, "Message must be at least 25 characters.")
        .required("Message is required."),
    }),

    validateOnChange: true,
    validateOnBlur: true,

    onSubmit: async (values, { resetForm, setSubmitting }) => {
      setStatus(null);

      try {
        const response = await fetch(
          "https://firas-portfolio-fullstack-1.onrender.com/api/messages",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },

            body: JSON.stringify(values),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to send message."
          );
        }

        setStatus({
          type: "success",
          message: "Your message has been sent successfully.",
        });

        resetForm();
      } catch (error) {
        console.error("Contact form error:", error);

        setStatus({
          type: "error",
          message:
            "Something went wrong. Please try again.",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const getInputClass = (field) => {
    if (formik.touched[field] && formik.errors[field]) {
      return "form-input input-error";
    }

    return "form-input";
  };

  return (
    <section id="contact" className="contact">
      <div className="contact-container">

        <h2>Contact Me</h2>

        <p>
          Have a question, project idea, or job opportunity?
          Send me a message.
        </p>

        <form
          className="contact-form"
          onSubmit={formik.handleSubmit}
          noValidate
        >
          <label htmlFor="name">
            Name
          </label>

          <input
            id="name"
            type="text"
            placeholder="Enter your name"
            className={getInputClass("name")}
            {...formik.getFieldProps("name")}
          />

          {formik.touched.name && formik.errors.name && (
            <div className="error-message">
              {formik.errors.name}
            </div>
          )}

          <label htmlFor="email">
            Email
          </label>

          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            className={getInputClass("email")}
            {...formik.getFieldProps("email")}
          />

          {formik.touched.email && formik.errors.email && (
            <div className="error-message">
              {formik.errors.email}
            </div>
          )}

          <label htmlFor="enquiry">
            Enquiry Type
          </label>

          <select
            id="enquiry"
            className={getInputClass("enquiry")}
            {...formik.getFieldProps("enquiry")}
          >
            <option value="">
              Select an enquiry type
            </option>

            <option value="general">
              General Enquiry
            </option>

            <option value="job">
              Job Opportunity
            </option>

            <option value="project">
              Project
            </option>

            <option value="other">
              Other
            </option>
          </select>

          {formik.touched.enquiry &&
            formik.errors.enquiry && (
              <div className="error-message">
                {formik.errors.enquiry}
              </div>
            )}

          <label htmlFor="message">
            Message
          </label>

          <textarea
            id="message"
            rows="7"
            placeholder="Write your message..."
            className={getInputClass("message")}
            {...formik.getFieldProps("message")}
          />

          {formik.touched.message &&
            formik.errors.message && (
              <div className="error-message">
                {formik.errors.message}
              </div>
            )}

          <button
            type="submit"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? (
              <>
                <span className="spinner"></span>
                Sending...
              </>
            ) : (
              "Send Message"
            )}
          </button>

          {status && (
            <div
              className={`form-status ${
                status.type === "success"
                  ? "success-status"
                  : "error-status"
              }`}
              role="alert"
            >
              {status.type === "success" ? "✓ " : "✕ "}
              {status.message}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}

export default Contact;