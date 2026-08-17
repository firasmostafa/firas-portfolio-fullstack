import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import ProjectsPage from "./pages/ProjectsPage";
import ContactPage from "./pages/ContactPage";

import AdminLogin from "./pages/AdminLogin";
import AdminProjects from "./pages/AdminProjects";
import CreateProject from "./pages/CreateProject";
import EditProject from "./pages/EditProject";
import AdminSiteContent from "./pages/AdminSiteContent";

import "./App.css";

function AppContent() {
  const location = useLocation();

  const isAdminPage =
    location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminPage && <Header />}

      <main>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/projects"
            element={<ProjectsPage />}
          />

          <Route
            path="/contact"
            element={<ContactPage />}
          />

          <Route
            path="/admin/login"
            element={<AdminLogin />}
          />

          <Route
            path="/admin/projects"
            element={<AdminProjects />}
          />

          <Route
            path="/admin/projects/create"
            element={<CreateProject />}
          />

          <Route
            path="/admin/projects/:id/edit"
            element={<EditProject />}
          />

          <Route
            path="/admin/site-content"
            element={<AdminSiteContent />}
          />
        </Routes>
      </main>

      {!isAdminPage && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;