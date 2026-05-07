import * as React from "react";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { GettingStartedPage } from "./pages/GettingStartedPage";
import { CalendarPage } from "./pages/CalendarPage";
import { MobileSheetPage } from "./pages/MobileSheetPage";
import { TypesPage } from "./pages/TypesPage";
import { ExamplesPage } from "./pages/ExamplesPage";
import { PlaygroundPage } from "./pages/PlaygroundPage";

export type PageId =
  | "home"
  | "getting-started"
  | "calendar"
  | "mobile-sheet"
  | "types"
  | "examples"
  | "playground";

function getInitialPage(): PageId {
  if (typeof window === "undefined") return "home";
  const hash = window.location.hash.replace("#/", "").replace("#", "");
  const valid: PageId[] = [
    "home",
    "getting-started",
    "calendar",
    "mobile-sheet",
    "types",
    "examples",
    "playground",
  ];
  return (valid as string[]).includes(hash) ? (hash as PageId) : "home";
}

export function App() {
  const [page, setPage] = React.useState<PageId>(getInitialPage);

  React.useEffect(() => {
    const onHash = () => setPage(getInitialPage());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const navigate = React.useCallback((id: PageId) => {
    window.location.hash = `/${id}`;
  }, []);

  return (
    <Layout page={page} onNavigate={navigate}>
      {page === "home" && <HomePage onNavigate={navigate} />}
      {page === "getting-started" && <GettingStartedPage />}
      {page === "calendar" && <CalendarPage />}
      {page === "mobile-sheet" && <MobileSheetPage />}
      {page === "types" && <TypesPage />}
      {page === "examples" && <ExamplesPage />}
      {page === "playground" && <PlaygroundPage />}
    </Layout>
  );
}
