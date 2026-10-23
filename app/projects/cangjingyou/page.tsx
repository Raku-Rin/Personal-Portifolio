import type { Metadata } from "next"
import { ProjectCaseStudyPage } from "@/components/project-case-study-page"
import { cangjingyouProject } from "@/lib/projects/cangjingyou"

export const metadata: Metadata = {
  title: `${cangjingyouProject.title} | Case Study`,
  description: cangjingyouProject.description,
}

export default function CangjingyouProjectPage() {
  return <ProjectCaseStudyPage project={cangjingyouProject} />
}
