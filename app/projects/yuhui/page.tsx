import type { Metadata } from "next"
import { ProjectCaseStudyPage } from "@/components/project-case-study-page"
import { yuhuiProject } from "@/lib/projects/yuhui"

export const metadata: Metadata = {
  title: `${yuhuiProject.title} | Case Study`,
  description: yuhuiProject.description,
}

export default function YuhuiProjectPage() {
  return <ProjectCaseStudyPage project={yuhuiProject} />
}
