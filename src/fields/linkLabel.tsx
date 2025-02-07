'use client'

import { useRowLabel } from '@payloadcms/ui'

export default function ArrayRowLabel() {
  const { data } = useRowLabel<{ link?: { label?: string } }>()

  const customLabel = `${data.link?.label || 'Slide'}`

  return <div>{customLabel}</div>
}
