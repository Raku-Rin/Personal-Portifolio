export type CaseStudySection = {
  id: string
  label: string
  title: string
}

export type CaseStudyImage = {
  src: string
  alt: string
  caption: string
}

export type DesignGoal = {
  audience: string
  goal: string
  details: string[]
}

export type ProblemStatement = {
  primary: string
  secondary: string
  supporting: string
}

export type Project = {
  slug: string
  title: string
  shortTitle: string
  description: string
  tags: string[]
  imageUrl: string
  year: string
  role: string
  platform: string
  tools: string
  duration: string
  categories: string[]
  heroSummary: string
  overview: string
  context: string[]
  discovery: {
    summary: string
    image: CaseStudyImage
    images?: CaseStudyImage[]
  }
  problemStatements: (string | ProblemStatement)[]
  designGoals?: DesignGoal[]
  designDecisions: {
    title: string
    summary: string
    before: CaseStudyImage
    after: CaseStudyImage
  }[]
  prototypeImage?: CaseStudyImage
  deliverables: CaseStudyImage[]
  reflection: string[]
}
