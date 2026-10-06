import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CoursesProvider } from "./context/CoursesContext.jsx";
import { NotesProvider } from "./context/NotesContext.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
<StrictMode>  
  <BrowserRouter>
    <AuthProvider>
      <CoursesProvider>
        <NotesProvider>
          <App />
        </NotesProvider>
      </CoursesProvider>
    </AuthProvider>
  </BrowserRouter>
</StrictMode>
);