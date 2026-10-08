import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";
import { ThemeProvider } from "./app/components/theme-provider";

// After a deploy, an open tab may ask for a page chunk that no longer exists: reload once to get the new build.
window.addEventListener("vite:preloadError", (event) => {
  try {
    if (sessionStorage.getItem("strativu:reloaded") === location.pathname) return;
    sessionStorage.setItem("strativu:reloaded", location.pathname);
  } catch {
    return;
  }
  event.preventDefault();
  location.reload();
});

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
    <App />
  </ThemeProvider>
);