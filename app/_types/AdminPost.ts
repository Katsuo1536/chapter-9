export interface AdminPost {
  id: string
  title: string
  content: string
  thumbnailImageKey: string
  createdAt: string
  updatedAt: string
  postCategories: {
    category: {
      id: string
      name: string
    }
  }[]
}