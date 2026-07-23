export interface Principle {
  id: string
  num: string
  label: string
  body?: string
}

// The principles on the manifesto card — shared with the MCP server and
// llms.txt so agents and crawlers get the same answer the canvas shows.
export const PRINCIPLES: Principle[] = [
  {
    id: "01",
    num: "01",
    label: "the system",
    body: "Architecture isn't just structure. It shapes experience.",
  },
  {
    id: "02",
    num: "02",
    label: "the details",
    body: "2px matters. Easing matters. Rhythm matters.",
  },
  {
    id: "03",
    num: "03",
    label: "the product",
    body: "Every technical decision becomes a user experience decision.",
  },
  {
    id: "04",
    num: "04",
    label: "the motion",
    body: "Transitions should guide, not perform.",
  },
  {
    id: "05",
    num: "05",
    label: "the restraint",
    body: "Complexity should stay behind the interface.",
  },
]
