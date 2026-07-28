export interface AdminPost {
  id: string
  title: string
  content: string
  thumbnailUrl: string
  createdAt: string
  updatedAt: string
  postCategories: {
    category: {
      id: string
      name: string
    }[]
  }
}