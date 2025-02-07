import { Category } from '@/payload-types'
import type { BeforeSync } from '@payloadcms/plugin-search/types'

export const baseBeforeSync: BeforeSync = ({ originalDoc, searchDoc }) => {
  return {
    ...searchDoc,
    title: originalDoc.title,
    priority: originalDoc.priority || 0,
    categories: originalDoc.categories?.map((cat: Category) => ({
      id: cat.id,
      title: cat.title,
    })),
  }
}
