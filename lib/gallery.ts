export type GalleryCategory = "All" | "VI / 品牌" | "海报" | "包装" | "书籍" | "Web"

export type GalleryItem = {
  id: string
  title: string
  meta: string
  category: Exclude<GalleryCategory, "All">
  src: string
  alt: string
  aspect: "portrait" | "landscape" | "square"
}

export const galleryFilters: GalleryCategory[] = [
  "All",
  "VI / 品牌",
  "海报",
  "包装",
  "书籍",
  "Web",
]

export const galleryItems: GalleryItem[] = [
  {
    id: "cultural-poster",
    title: "文化海报系列",
    meta: "海报 / 2024",
    category: "海报",
    src: "/images/gallery-1.jpg",
    alt: "文化海报系列作品预览",
    aspect: "portrait",
  },
  {
    id: "book-jacket",
    title: "书籍装帧",
    meta: "书籍 / 2023",
    category: "书籍",
    src: "/images/gallery-2.jpg",
    alt: "书籍装帧设计封面预览",
    aspect: "portrait",
  },
  {
    id: "brand-vi",
    title: "某品牌视觉系统",
    meta: "VI / 品牌 / 2023",
    category: "VI / 品牌",
    src: "/images/gallery-3.jpg",
    alt: "品牌视觉系统设计预览",
    aspect: "landscape",
  },
  {
    id: "web-visual",
    title: "Web 视觉设计",
    meta: "UI 网页 / 2024",
    category: "Web",
    src: "/images/gallery-4.jpg",
    alt: "Web 视觉设计横幅预览",
    aspect: "landscape",
  },
  {
    id: "packaging",
    title: "产品包装设计",
    meta: "包装 / 2024",
    category: "包装",
    src: "/images/gallery-5.jpg",
    alt: "产品包装设计展开图预览",
    aspect: "square",
  },
  {
    id: "brand-guideline",
    title: "品牌规范手册",
    meta: "VI / 品牌 / 2023",
    category: "VI / 品牌",
    src: "/images/gallery-6.jpg",
    alt: "品牌规范手册内页预览",
    aspect: "portrait",
  },
  {
    id: "poster-grid",
    title: "展览海报组图",
    meta: "海报 / 2023",
    category: "海报",
    src: "/images/gallery-7.jpg",
    alt: "展览海报组图预览",
    aspect: "portrait",
  },
  {
    id: "editorial-cover",
    title: "编辑书封视觉",
    meta: "书籍 / 2024",
    category: "书籍",
    src: "/images/gallery-9.jpg",
    alt: "编辑书封视觉设计预览",
    aspect: "portrait",
  },
]
