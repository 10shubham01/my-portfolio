import { CANVAS_ITEMS } from "@/lib/canvas-config"
import { SITE } from "@/lib/canvas-data"
import { PROJECTS, getProjectById, type ProjectEntry } from "@/lib/projects"

const AUTHOR = {
  "@type": "Person",
  name: SITE.name,
  url: SITE.url,
}

// Deeplink for a project's canvas card (ids are "project-<projectId>").
function projectCanvasUrl(project: ProjectEntry): string {
  return `${SITE.url}/?to=project-${project.id}`
}

function softwareApplication(project: ProjectEntry) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.name,
    description: project.description,
    url: project.href,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    author: AUTHOR,
    ...(project.media ? { screenshot: `${SITE.url}${project.media}` } : {}),
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  }
}

// Given the focused canvas item id (or null for the root), return the JSON-LD
// object to embed on the page:
//  - a project card  -> that project's SoftwareApplication
//  - the root / other -> an ItemList of every project (helps discovery)
export function buildCanvasItemJsonLd(id: string | null): object | null {
  if (id) {
    const item = CANVAS_ITEMS.find((entry) => entry.id === id)
    if (item?.type === "project") {
      const project = getProjectById(item.projectId ?? "")
      if (project) return softwareApplication(project)
    }
    // Non-project cards: no extra structured data (Person schema lives in layout).
    return null
  }

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${SITE.name} — Projects`,
    itemListElement: PROJECTS.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: projectCanvasUrl(project),
      name: project.name,
    })),
  }
}
