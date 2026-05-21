
export type AboutSnapSection =
  | { id: string; label: string; kind: "profile" }
  | { id: string; label: string; kind: "education" }
  | { id: string; label: string; kind: "stack" }
  | { id: string; label: string; kind: "achievements" }
  | { id: string; label: string; kind: "contributions" };

export function buildAboutSnapSections(): AboutSnapSection[] {
  const sections: AboutSnapSection[] = [
    { id: "profile", label: "HELLO", kind: "profile" },
    { id: "stack", label: "STACK", kind: "stack" },
    { id: "achievements", label: "AWARDS", kind: "achievements" },
    { id: "contributions", label: "CONTRI", kind: "contributions" },
    { id: "education", label: "EDU", kind: "education" },
  ];

  return sections;
}

export function getAboutSectionLabels(sections: AboutSnapSection[]): string[] {
  return sections.map((s) => s.label);
}
