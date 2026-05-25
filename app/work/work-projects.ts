import type { WorkProject } from "./work-project-types";

// Add new projects here.
// `video.src` accepts both local public paths (e.g. "/videos/work/demo.mp4")
// and remote URLs (e.g. "https://cdn.example.com/demo.mp4").
export const WORK_PROJECTS: WorkProject[] = [
  {
    title: "dbspin",
    description: "CLI to connect to PostgreSQL via pgcli or psql.",
    githubUrl: "https://github.com/10shubham01/dbspin",
    spotlightLabel: "DBSPIN",
  },
  {
    title: "Text Command Palette",
    description: "Browser extension for VS Code-style text transforms.",
    githubUrl: "https://github.com/10shubham01/Text-Command-Palette",
    liveUrl:
      "https://chromewebstore.google.com/detail/text-command-palette/gdlldblnpmbnjeildgidppdnoefapajo",
    spotlightLabel: "TEXT COMMAND PALETTE",
  },
];
