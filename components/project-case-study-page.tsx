import Image from "@/components/site-image"
import Link from "next/link"
import { ArrowLeft, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { CaseStudyLightbox } from "@/components/case-study-lightbox"
import { getCaseStudySections, projects, type Project, type ProblemStatement } from "@/lib/projects"

type ProjectCaseStudyPageProps = {
  project: Project
}

export function ProjectCaseStudyPage({ project }: ProjectCaseStudyPageProps) {
  const currentIndex = projects.findIndex((item) => item.slug === project.slug)
  const nextProject = projects[(currentIndex + 1) % projects.length]
  const sections = getCaseStudySections(project)
  const isYuhui = project.slug === "yuhui"
  const isCangjingyou = project.slug === "cangjingyou"
  const usesYuhuiFramework = project.slug === "yuhui" || project.slug === "cangjingyou"
  const architectureBranches = isCangjingyou
    ? [
        { title: "首页", items: ["门票预约", "景区导览", "文化体验", "精品线路"] },
        { title: "行程", items: ["近期活动", "行程规划", "我的计划"] },
        { title: "发现", items: ["官方活动", "发布帖子", "文化问答"] },
        { title: "我的", items: ["订单管理", "成就奖励", "帮助中心", "设置"] },
      ]
    : [
        { title: "首页", items: ["教务系统", "学习组队", "记忆卡片", "今日热门", "课程推荐"] },
        { title: "课程", items: ["今日课程", "院校课程", "待办任务", "个性化推荐"] },
        { title: "AI", items: ["AI 对话", "绘画创作", "作业批改", "文档助手"] },
        { title: "消息", items: ["系统通知", "回复我的", "私聊消息", "通讯录", "添加好友"] },
        { title: "我的", items: ["账号设置", "实用工具", "校园服务", "帮助中心"] },
      ]

  const isStructuredProblemStatement = (
    statement: string | ProblemStatement,
  ): statement is ProblemStatement => typeof statement !== "string"

  return (
    <main className="min-h-screen bg-[#fcfbf8] text-[#17181c]">
      <header className="sticky top-0 z-40 border-b border-black/8 bg-[rgba(252,251,248,0.88)] backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-sm text-[#4d535e] transition-colors hover:text-[#17181c]"
          >
            <ArrowLeft className="h-4 w-4" />
            返回项目列表
          </Link>
          <div className="hidden items-center gap-2 md:flex">
            <span className="font-serif text-base italic">{project.shortTitle}</span>
            <span className="text-xs uppercase tracking-[0.22em] text-[#7f8794]">Case Study</span>
          </div>
        </div>
      </header>

      <section className="border-b border-black/8">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end lg:py-14">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {project.categories.map((category) => (
                <Badge
                  key={category}
                  variant="secondary"
                  className="rounded-full border border-black/10 bg-white/70 px-3 py-1 text-[11px] tracking-[0.04em] text-[#4d535e]"
                >
                  {category}
                </Badge>
              ))}
              <Badge
                variant="secondary"
                className="rounded-full border border-black/10 bg-white/70 px-3 py-1 text-[11px] tracking-[0.04em] text-[#4d535e]"
              >
                {project.year}
              </Badge>
            </div>
            <div className="space-y-5">
              <p className="text-sm uppercase tracking-[0.2em] text-[#8d7b6b]">Featured Case Study</p>
              <h1 className="max-w-2xl font-serif text-5xl leading-[1.08] tracking-[-0.03em] sm:text-6xl sm:leading-[1.04]">
                {project.title}
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[#4d535e]">{project.heroSummary}</p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[18px] border border-black/10 bg-[#f3f0ea] shadow-[0_18px_60px_rgba(16,18,22,0.08)]">
            <div className="relative aspect-[16/10]">
              <Image src={project.imageUrl} alt={project.title} fill priority className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-3 rounded-[18px] border border-black/8 bg-white/70 p-4 shadow-[0_18px_60px_rgba(16,18,22,0.05)] sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Role", value: project.role },
            { label: "Platform", value: project.platform },
            { label: "Tools", value: project.tools },
            { label: "Duration", value: project.duration },
          ].map((item) => (
            <div key={item.label} className="rounded-[14px] bg-[#fcfbf8] px-4 py-4">
              <div className="text-xs uppercase tracking-[0.18em] text-[#7f8794]">{item.label}</div>
              <div className="mt-2 text-lg font-medium text-[#17181c]">{item.value}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-4 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-[18px] border border-black/8 bg-white/65 p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-[#8d7b6b]">On this page</p>
            <nav className="mt-4">
              <ul className="space-y-3">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="text-sm text-[#4d535e] transition-colors hover:text-[#17181c]"
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>

        <div className="space-y-16">
          <section id="context" className="scroll-mt-24 space-y-6">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.18em] text-[#8d7b6b]">Context</p>
              <h2 className="font-serif text-3xl leading-[1.24] tracking-[-0.02em]">{project.overview}</h2>
            </div>
            <div className="space-y-4 text-base leading-8 text-[#4d535e]">
              {project.context.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>

          <section id="discovery" className="scroll-mt-24 space-y-5">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.18em] text-[#8d7b6b]">Discovery</p>
              <h2 className="font-serif text-3xl leading-[1.18] tracking-[-0.02em]">
                {isYuhui ? "用户调研" : "理解用户如何判断与行动"}
              </h2>
            </div>
            {isYuhui ? (
              <div className="space-y-5">
                <blockquote className="rounded-[14px] border-l-2 border-black/20 bg-white/70 px-5 py-4 text-base italic leading-7 text-[#4d535e]">
                  "我想学 UI 设计，但不知道从哪开始，课程太多了看不过来。"
                  <span className="mt-2 block text-sm not-italic text-[#7f8794]">- 用户访谈节选</span>
                </blockquote>
                <div className="grid gap-4 sm:grid-cols-2">
                  <article className="rounded-[14px] border border-black/8 bg-white/70 px-5 py-4">
                    <div className="text-lg font-medium text-[#17181c]">应届生小林</div>
                    <p className="mt-2 text-sm leading-7 text-[#4d535e]">刚毕业，想转行 UI，缺乏系统路径指引。</p>
                  </article>
                  <article className="rounded-[14px] border border-black/8 bg-white/70 px-5 py-4">
                    <div className="text-lg font-medium text-[#17181c]">在职者阿明</div>
                    <p className="mt-2 text-sm leading-7 text-[#4d535e]">
                      有基础但时间碎片化，需要更高效的进阶内容筛选。
                    </p>
                  </article>
                </div>
                <CaseStudyLightbox
                  src={project.discovery.image.src}
                  alt={project.discovery.image.alt}
                  caption="核心情绪曲线 + 痛点标注（Journey Map）"
                  priority
                />
              </div>
            ) : (
              <>
                <p className="text-base leading-8 text-[#4d535e]">{project.discovery.summary}</p>
                {project.discovery.images?.length ? (
                  <div className="grid gap-5 sm:grid-cols-2">
                    {project.discovery.images.map((item, index) => (
                      <CaseStudyLightbox
                        key={`${item.src}-${index}`}
                        src={item.src}
                        alt={item.alt}
                        caption={item.caption}
                        priority={index === 0}
                      />
                    ))}
                  </div>
                ) : (
                  <CaseStudyLightbox
                    src={project.discovery.image.src}
                    alt={project.discovery.image.alt}
                    caption={project.discovery.image.caption}
                    priority
                  />
                )}
              </>
            )}
          </section>

          <section id="problem" className="scroll-mt-24 space-y-5">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.18em] text-[#8d7b6b]">Problem Framing</p>
              <h2 className="font-serif text-3xl leading-[1.18] tracking-[-0.02em]">我们要真正解决什么问题</h2>
            </div>
            <div className="space-y-3">
              {project.problemStatements.map((statement) => (
                <div
                  key={typeof statement === "string" ? statement : `${statement.primary}-${statement.secondary}`}
                  className="rounded-[14px] border border-black/8 bg-white/70 px-5 py-4"
                >
                  {isStructuredProblemStatement(statement) ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4">
                        <p className="text-xl font-medium leading-7 text-[#17181c]">{statement.primary}</p>
                        <p className="text-sm text-[#7f8794]">{statement.secondary}</p>
                      </div>
                      <p className="text-base leading-7 text-[#4d535e]">{statement.supporting}</p>
                    </div>
                  ) : (
                    <p className="text-base leading-7 text-[#17181c]">{statement}</p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {!isYuhui && project.designGoals?.length ? (
            <section id="goals" className="scroll-mt-24 space-y-5">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.18em] text-[#8d7b6b]">Design Goals</p>
                <h2 className="font-serif text-3xl leading-[1.18] tracking-[-0.02em]">设计目标</h2>
              </div>
              <div className="space-y-4">
                {project.designGoals.map((goal) => (
                  <article
                    key={`${goal.audience}-${goal.goal}`}
                    className="rounded-[16px] border border-black/8 bg-white/70 px-5 py-5 shadow-[0_18px_60px_rgba(16,18,22,0.04)]"
                  >
                    <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px] md:items-start">
                      <div className="space-y-3">
                        <div className="text-xl leading-[1.25] font-medium text-[#17181c]">{goal.goal}</div>
                        <div className="flex flex-wrap gap-2 text-sm leading-7 text-[#4d535e]">
                          {goal.details.map((detail) => (
                            <span
                              key={detail}
                              className="rounded-full border border-black/8 bg-[#fcfbf8] px-3 py-1.5"
                            >
                              {detail}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-sm text-[#7f8794] md:justify-self-end md:text-right">
                        {goal.audience}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {usesYuhuiFramework ? (
            <>
              <section id="architecture" className="scroll-mt-24 space-y-5">
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#8d7b6b]">Product Architecture</p>
                  <h2 className="font-serif text-3xl leading-[1.18] tracking-[-0.02em]">产品架构</h2>
                </div>
                <p className="text-base leading-8 text-[#4d535e]">
                  {isCangjingyou
                    ? "围绕“文化探索 + 行程规划 + 在地互动”的核心旅程，重构为「首页、行程、发现、我的」四大一级模块，兼顾内容种草、路线决策与出行服务闭环。"
                    : "围绕学习与创作主链路，重构为「首页、课程、AI、消息、我的」五大一级模块，兼顾内容获取、创作反馈与社交协同。"}
                </p>
                <div className="rounded-[16px] border border-black/8 bg-white/70 p-5 shadow-[0_18px_60px_rgba(16,18,22,0.04)]">
                  <div className="mb-4 border-b border-black/8 pb-3 text-lg font-medium text-[#17181c]">
                    {project.shortTitle} App IA
                  </div>
                  <div className={`grid gap-4 sm:grid-cols-2 ${isCangjingyou ? "xl:grid-cols-4" : "xl:grid-cols-5"}`}>
                    {architectureBranches.map((branch) => (
                      <article key={branch.title} className="rounded-[12px] border border-black/8 bg-[#fcfbf8] px-4 py-3">
                        <h3 className="text-sm font-medium text-[#17181c]">{branch.title}</h3>
                        <ul className="mt-2 space-y-1 text-sm text-[#4d535e]">
                          {branch.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </article>
                    ))}
                  </div>
                </div>
              </section>

              <section id="prototype" className="scroll-mt-24 space-y-5">
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#8d7b6b]">
                    {isCangjingyou ? "Component Showcase" : "Prototype"}
                  </p>
                  <h2 className="font-serif text-3xl leading-[1.18] tracking-[-0.02em]">
                    {isCangjingyou ? "组件展示" : "产品原型"}
                  </h2>
                </div>
                <div className="grid gap-5 sm:grid-cols-1">
                  {(project.prototypeImage ? [project.prototypeImage] : project.deliverables.slice(0, 1)).map(
                    (item, index) => (
                    <CaseStudyLightbox
                      key={`${item.src}-${index}`}
                      src={item.src}
                      alt={item.alt}
                      caption={isCangjingyou ? item.caption : `${item.caption} · Lo-fi to Hi-fi`}
                    />
                    ),
                  )}
                </div>
              </section>

              {isYuhui ? (
                <>
                  <section id="interaction" className="scroll-mt-24 space-y-5">
                    <div className="space-y-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-[#8d7b6b]">Interaction Design</p>
                      <h2 className="font-serif text-3xl leading-[1.18] tracking-[-0.02em]">交互设计</h2>
                    </div>
                    <div className="grid gap-4 lg:grid-cols-2">
                      <article className="rounded-[14px] border border-black/8 bg-white/70 px-4 py-4">
                        <h3 className="text-xl leading-7 font-medium text-[#17181c]">拇指热区分析</h3>
                        <div className="mt-3">
                          <CaseStudyLightbox
                            src="/images/yuhui-touch hot area.png"
                            alt="语绘拇指热区分析图"
                            caption="拇指热区分析"
                          />
                        </div>
                        <p className="mt-3 text-sm leading-8 text-[#4d535e]">
                          核心操作落在拇指自然触达区，减少单手操作负担
                        </p>
                      </article>
                      <article className="rounded-[14px] border border-black/8 bg-white/70 px-4 py-4">
                        <h3 className="text-xl leading-7 font-medium text-[#17181c]">F 型浏览动线</h3>
                        <div className="mt-3">
                          <CaseStudyLightbox
                            src="/images/yuhui-F visual line.png"
                            alt="语绘 F 型浏览动线图"
                            caption="F 型浏览动线"
                          />
                        </div>
                        <p className="mt-3 text-sm leading-8 text-[#4d535e]">
                          首屏信息优先级排布遵循 F 型扫视规律，关键内容靠左上对齐
                        </p>
                      </article>
                    </div>
                  </section>

                  <section id="aigc" className="scroll-mt-24 space-y-5">
                    <div className="space-y-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-[#8d7b6b]">AIGC Integration</p>
                      <h2 className="font-serif text-3xl leading-[1.18] tracking-[-0.02em]">AIGC 融入</h2>
                    </div>
                    <p className="text-base leading-8 text-[#4d535e]">
                      本章节展示 AIGC 在产品中的核心价值路径，包含输入策略、生成迭代与品牌化落地三个环节。
                    </p>
                    <div className="grid gap-5 sm:grid-cols-1">
                      <CaseStudyLightbox
                        src="/images/yuhui-IP design.png"
                        alt="语绘 IP 设计图"
                        caption="AIGC 融入 · IP Design"
                      />
                    </div>
                  </section>
                </>
              ) : null}

              <section id="showcase" className="scroll-mt-24 space-y-5">
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#8d7b6b]">Final UI</p>
                  <h2 className="font-serif text-3xl leading-[1.18] tracking-[-0.02em]">界面展示</h2>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  {project.deliverables.map((item, index) => (
                    <CaseStudyLightbox
                      key={`${item.src}-${index}`}
                      src={item.src}
                      alt={item.alt}
                      caption={item.caption}
                    />
                  ))}
                </div>
                <p className="text-center text-sm text-[#7f8794]">Click any image to enlarge. 点击放大查看细节</p>
              </section>
            </>
          ) : (
            <>
              <section id="decisions" className="scroll-mt-24 space-y-10">
                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#8d7b6b]">Design Decisions</p>
                  <h2 className="font-serif text-3xl leading-[1.18] tracking-[-0.02em]">为什么要这样设计</h2>
                </div>
                <div className="space-y-12">
                  {project.designDecisions.map((decision) => (
                    <article key={decision.title} className="space-y-7">
                      <div className="space-y-4">
                        <h3 className="text-xl leading-[1.28] font-medium text-[#17181c]">
                          {decision.title}
                        </h3>
                        <p className="text-base leading-8 text-[#4d535e]">{decision.summary}</p>
                      </div>
                      <div className="grid gap-5 lg:grid-cols-2">
                        <div className="space-y-3">
                          <CaseStudyLightbox
                            src={decision.before.src}
                            alt={decision.before.alt}
                            caption={decision.before.caption}
                          />
                          <p className="text-sm uppercase tracking-[0.18em] text-[#7f8794]">Before</p>
                        </div>
                        <div className="space-y-3">
                          <CaseStudyLightbox
                            src={decision.after.src}
                            alt={decision.after.alt}
                            caption={decision.after.caption}
                          />
                          <p className="text-sm uppercase tracking-[0.18em] text-[#587a80]">After</p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section id="deliverables" className="scroll-mt-24 space-y-5">
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#8d7b6b]">Deliverables</p>
                  <h2 className="font-serif text-3xl leading-[1.18] tracking-[-0.02em]">关键方案输出</h2>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  {project.deliverables.map((item, index) => (
                    <CaseStudyLightbox
                      key={`${item.src}-${index}`}
                      src={item.src}
                      alt={item.alt}
                      caption={item.caption}
                    />
                  ))}
                </div>
                <p className="text-center text-sm text-[#7f8794]">Click any image to enlarge. 点击放大查看细节</p>
              </section>
            </>
          )}

          <section id="reflection" className="scroll-mt-24 space-y-5 border-t border-black/8 pt-10">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.18em] text-[#8d7b6b]">Reflection</p>
              <h2 className="font-serif text-3xl leading-[1.18] tracking-[-0.02em]">项目复盘</h2>
            </div>
            <div className="space-y-4 text-base leading-8 text-[#4d535e]">
              {project.reflection.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>

          <div className="flex flex-col gap-4 border-t border-black/8 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm text-[#4d535e] transition-colors hover:border-black/20 hover:text-[#17181c]"
            >
              <ArrowLeft className="h-4 w-4" />
              返回项目列表
            </Link>
            <Link
              href={`/projects/${nextProject.slug}`}
              className="inline-flex items-center gap-2 text-sm text-[#17181c] transition-opacity hover:opacity-70"
            >
              Next Project
              <span className="font-medium">{nextProject.shortTitle}</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
