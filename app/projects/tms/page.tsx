import type { Metadata } from "next"
import { ProjectCaseStudyPage } from "@/components/project-case-study-page"
import { tmsProject } from "@/lib/projects/tms"

export const metadata: Metadata = {
  title: `${tmsProject.title} | Case Study`,
  description: tmsProject.description,
}

export default function TmsProjectPage() {
  return <ProjectCaseStudyPage project={tmsProject} />
}
