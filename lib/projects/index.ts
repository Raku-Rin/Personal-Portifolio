import { cangjingyouProject } from "./cangjingyou"
import { tmsProject } from "./tms"
import { yuhuiProject } from "./yuhui"
import type { CaseStudySection, Project } from "./types"

export type { CaseStudySection, DesignGoal, ProblemStatement, Project } from "./types"

export const projects: Project[] = [tmsProject, yuhuiProject, cangjingyouProject]

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug)
}

export function getCaseStudySections(project: Project): CaseStudySection[] {
  if (project.slug === "yuhui") {
    return [
      { id: "context", label: "Context", title: "Context" },
      { id: "discovery", label: "Discovery", title: "User Research" },
      { id: "problem", label: "Problem", title: "Problem Framing" },
      { id: "architecture", label: "Architecture", title: "Product Architecture" },
      { id: "prototype", label: "Prototype", title: "Product Prototype" },
      { id: "interaction", label: "Interaction", title: "Interaction Design" },
      { id: "aigc", label: "AIGC", title: "AIGC Integration" },
      { id: "showcase", label: "Showcase", title: "Interface Showcase" },
      { id: "reflection", label: "Reflection", title: "Reflection" },
    ]
  }
  if (project.slug === "cangjingyou") {
    return [
      { id: "context", label: "Context", title: "Context" },
      { id: "discovery", label: "Discovery", title: "User Research" },
      { id: "problem", label: "Problem", title: "Problem Framing" },
      { id: "architecture", label: "Architecture", title: "Product Architecture" },
      { id: "prototype", label: "Prototype", title: "Component Showcase" },
      { id: "showcase", label: "Showcase", title: "Interface Showcase" },
      { id: "reflection", label: "Reflection", title: "Reflection" },
    ]
  }

  const sections: CaseStudySection[] = [
    { id: "context", label: "Context", title: "Context" },
    { id: "discovery", label: "Discovery", title: "Discovery" },
    { id: "problem", label: "Problem", title: "Problem Framing" },
  ]

  if (project.designGoals?.length) {
    sections.push({ id: "goals", label: "Goals", title: "Design Goals" })
  }

  sections.push(
    { id: "decisions", label: "Decisions", title: "Design Decisions" },
    { id: "deliverables", label: "Deliverables", title: "Deliverables" },
    { id: "reflection", label: "Reflection", title: "Reflection" },
  )

  return sections
}
