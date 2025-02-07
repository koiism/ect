import type { BeforeSync } from '@payloadcms/plugin-search/types'
import { baseBeforeSync } from './base'

export const postBeforeSync: BeforeSync = (args) => {
  const baseDoc = baseBeforeSync(args)
  return {
    ...baseDoc,
    collectionLabel: 'posts',
  }
}
