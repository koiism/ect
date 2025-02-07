import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import { getPayload } from 'payload';
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import type { Page } from '@/payload-types'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { Tracker } from '@/tracking'
import payloadConfig from '@/payload.config';

export async function generateStaticParams() {
  const payload = await getPayload({config: payloadConfig})
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    select: {
      slug: true,
    },
  })

  const params = pages.docs
    ?.filter((doc) => {
      return doc.slug !== 'home'
    })
    .map(({ slug }) => {
      return { slug }
    })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { slug = 'home' } = await paramsPromise
  const url = '/' + slug

  let page: Page | null

  page = await queryPageBySlug({
    slug,
  })

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout, hideSearchInput } = page

  return (
    <Tracker
      params={{
        pageName: slug,
        pageType: 'page',
        title: page.title,
      }}
    >
      <article className="pt-16 pb-24">
        <PageClient hideSearchInput={hideSearchInput || false} />
        {/* Allows redirects for valid pages too */}
        <PayloadRedirects disableNotFound url={url} />

        <RenderHero {...hero} />
        <RenderBlocks blocks={layout} />
      </article>
    </Tracker>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise
  const page = await queryPageBySlug({
    slug,
  })

  return generateMeta({ doc: page })
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({config: payloadConfig})

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    depth: 5,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
