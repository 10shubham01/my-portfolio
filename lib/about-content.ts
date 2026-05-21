export type TechId =
  | "react"
  | "nextjs"
  | "vue"
  | "nuxt"
  | "typescript"
  | "javascript"
  | "tailwind"
  | "framer"
  | "node"
  | "express"
  | "adonis"
  | "postgresql"
  | "mysql"
  | "aws"
  | "vite"
  | "webpack"
  | "redux"
  | "pinia"
  | "zod"
  | "remotion";

export const TECH_LABELS: Record<TechId, string> = {
  react: "React",
  nextjs: "Next.js",
  vue: "Vue",
  nuxt: "Nuxt",
  typescript: "TypeScript",
  javascript: "JavaScript",
  tailwind: "Tailwind",
  framer: "Framer Motion",
  node: "Node.js",
  express: "Express",
  adonis: "Adonis.js",
  postgresql: "PostgreSQL",
  mysql: "MySQL",
  aws: "AWS",
  vite: "Vite",
  webpack: "Webpack",
  redux: "Redux",
  pinia: "Pinia",
  zod: "Zod",
  remotion: "Remotion",
};

export type SkillGroup = {
  label: string;
  techs: { id: TechId; label: string }[];
};

export type ExperienceEntry = {
  company: string;
  role: string;
  period: string;
  highlights: string[];
  techStack: TechId[];
  /** Key projects delivered during this role (per resume). */
  projects?: ProjectEntry[];
};

export type ProjectEntry = {
  name: string;
  summary: string;
  role: string;
  impact: string;
  techStack: TechId[];
};

export type AchievementEntry = {
  title: string;
  org: string;
  year: string;
  description: string;
};

export const ABOUT_HELLO = {
  headline: "PLOT, NOT TRAILER.",
  summary:
    "Senior full-stack engineer with six years of experience designing, building, and operating production web applications — from UI and component libraries to APIs, data stores, and AWS infrastructure.",
  background:
    "Currently at WebMD, working on internal health-tech tooling. Previously at Credilio Financial Technologies, leading delivery on regulated fintech products: credit and lending journeys, platform architecture, and engineering mentorship.",
} as const;

export const ABOUT_EDUCATION = {
  school: "Lovely Professional University",
  degree: "Bachelor of Computer Applications",
  period: "2018 – 2021",
  coursework:
    "Operating Systems, Databases, C, C++, HTML5, CSS, Ionic, React Native",
};

export const SKILL_GROUPS: SkillGroup[] = [
  {
    label: "Frontend",
    techs: [
      { id: "react", label: "React" },
      { id: "nextjs", label: "Next.js" },
      { id: "vue", label: "Vue" },
      { id: "nuxt", label: "Nuxt" },
      { id: "typescript", label: "TypeScript" },
      { id: "javascript", label: "JavaScript" },
      { id: "tailwind", label: "Tailwind" },
      { id: "framer", label: "Framer Motion" },
    ],
  },
  {
    label: "Backend",
    techs: [
      { id: "node", label: "Node.js" },
      { id: "express", label: "Express" },
      { id: "adonis", label: "Adonis.js" },
    ],
  },
  {
    label: "Database",
    techs: [
      { id: "postgresql", label: "PostgreSQL" },
      { id: "mysql", label: "MySQL" },
    ],
  },
  {
    label: "DevOps & Cloud",
    techs: [{ id: "aws", label: "AWS" }],
  },
  {
    label: "Tools",
    techs: [
      { id: "vite", label: "Vite" },
      { id: "webpack", label: "Webpack" },
      { id: "redux", label: "Redux" },
      { id: "pinia", label: "Pinia" },
      { id: "zod", label: "Zod" },
    ],
  },
];

export const EXPERIENCE_ENTRIES: ExperienceEntry[] = [
  {
    company: "WebMD",
    role: "Senior Software Engineer",
    period: "Mar 2026 – Present",
    highlights: [
      "Re-architected the internal tool page builder with TypeScript and Vite for performance and scalability.",
      "Created a centralized component library to manage and reuse micro-components efficiently.",
    ],
    techStack: ["vue", "typescript", "tailwind", "pinia", "vite"],
  },
  {
    company: "Credilio Financial Technologies",
    role: "Senior Software Engineer",
    period: "Dec 2022 – Mar 2026",
    highlights: [
      "Led engineers through code reviews and mentoring; onboarded 5+ developers with training and knowledge transfer.",
      "Designed end-to-end AWS architectures from scratch — scalable, reliable, and cost-optimized in production.",
      "Delivered credit card and personal loan journeys with web SDKs, KYC providers, and lender APIs.",
      "Integrated New Relic for observability and Singular for attribution across regulated onboarding flows.",
      "Led AI adoption initiatives to improve code quality and accelerate delivery.",
    ],
    techStack: ["react", "nextjs", "typescript", "aws", "node", "postgresql"],
    projects: [
      {
        name: "Bureau wrap video",
        summary: "Next.js credit score visualization platform with Remotion video generation.",
        role: "Implemented a full-stack system for dynamic credit score videos from bureau reports.",
        impact:
          "Enabled automated creation of personalized credit score presentation videos, improving client engagement.",
        techStack: ["nextjs", "remotion", "tailwind", "aws", "adonis", "postgresql"],
      },
      {
        name: "Customer Portal",
        summary: "White-label customer platform for credit card and personal loan journeys.",
        role: "Built and scaled end-to-end journeys integrating bank APIs; re-architected frontend with composable, multi-partner patterns.",
        impact:
          "Partners launch branded credit journeys without code changes — better performance and conversion reliability.",
        techStack: ["react", "nextjs", "typescript", "tailwind", "vite", "zod", "redux"],
      },
      {
        name: "Advisor Portal",
        summary: "White-label advisory platform with multi-tenant workflows.",
        role: "Designed and owned scalable, accessibility-compliant form infrastructure; integrated web content libraries into native mobile apps.",
        impact:
          "Reduced duplication across partners with secure, consistent advisor experiences.",
        techStack: ["react", "nextjs", "typescript", "tailwind", "vite", "zod", "redux"],
      },
      {
        name: "Admin Portal",
        summary: "Centralized admin system for multi-tenant access control.",
        role: "Architected role- and policy-driven authorization across white-label administrative workflows.",
        impact: "Improved operational safety and partner isolation with consistent permission enforcement.",
        techStack: ["nuxt", "vue", "typescript", "tailwind", "pinia"],
      },
    ],
  },
  {
    company: "Mountblue",
    role: "Software Engineer / Trainee",
    period: "Aug 2021 – Nov 2022",
    highlights: [
      "Built full-stack apps with Vue.js, React.js, and Node.js; APIs with Express.js and PostgreSQL/MySQL.",
      "Full-stack consulting for Credilio Financial Technologies.",
      "Migrated a Nuxt 2 project to Nuxt 3 with a scalable architecture and stronger performance.",
    ],
    techStack: ["vue", "nuxt", "typescript", "adonis", "node", "postgresql"],
  },
];

export const ACHIEVEMENT_ENTRIES: AchievementEntry[] = [
  {
    title: "True Soldier Award",
    org: "Credilio Financial Technologies",
    year: "2025",
    description:
      "outstanding performance, ownership, and high-impact technical contributions",
  },
  {
    title: "Strive for Excellence Award",
    org: "Credilio Financial Technologies",
    year: "2024",
    description:
      "consistently exceeding expectations, high-quality delivery, and continuous improvement",
  },
];

