import type { BeforeSync } from '@payloadcms/plugin-search/types'
import { baseBeforeSync } from './base'

export const cityBeforeSync: BeforeSync = (args) => {
  const baseDoc = baseBeforeSync(args)
  const { originalDoc } = args
  return {
    ...baseDoc,
    collectionLabel: 'cities',
    slug: originalDoc.slug,
  }
}
