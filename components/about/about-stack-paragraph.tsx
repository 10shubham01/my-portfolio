import { aboutProseClass } from "@/components/about/about-section-panel";
import { StackIconToken } from "@/components/about/stack-icon-token";
import type { TechId } from "@/lib/about-content";

function Skill({ id }: { id: TechId }) {
  return <StackIconToken id={id} />;
}

export function AboutStackParagraph() {
  return (
    <p className={`${aboutProseClass} select-none`}>
      Full-stack, loud edition — <Skill id="react" /> & <Skill id="nextjs" />, sometimes{" "}
      <Skill id="vue" /> / <Skill id="nuxt" />, always <Skill id="typescript" /> +{" "}
      <Skill id="javascript" />. <Skill id="tailwind" /> + <Skill id="framer" /> up front;{" "}
      <Skill id="node" />, <Skill id="express" />, <Skill id="adonis" /> behind; data in{" "}
      <Skill id="postgresql" /> / <Skill id="mysql" /> on <Skill id="aws" />. Daily:{" "}
      <Skill id="vite" />, <Skill id="webpack" />, <Skill id="redux" />, <Skill id="pinia" />,{" "}
      <Skill id="zod" />.
    </p>
  );
}
