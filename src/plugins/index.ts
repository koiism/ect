import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import { Plugin } from 'payload'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

import { Page, Post, Product } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'
import { translator, copyResolver, googleResolver } from '@payload-enchants/translator'
import { s3Storage } from '@payloadcms/storage-s3'

import { productSearchFields } from '@/search/fields/product'
import { postSearchFields } from '@/search/fields/post'
import { citySearchFields } from '@/search/fields/city'
import { productBeforeSync } from '@/search/sync/product'
import { postBeforeSync } from '@/search/sync/post'
import { cityBeforeSync } from '@/search/sync/city'
import { sentryPlugin } from '@payloadcms/plugin-sentry'
import * as Sentry from '@sentry/nextjs'

const generateTitle: GenerateTitle<Post | Page | Product> = ({ doc }) => {
  return doc?.title ? `${doc.title} | Explore China Tour` : 'Explore China Tour'
}

const generateURL: GenerateURL<Post | Page | Product> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  sentryPlugin({
    options: {
      captureErrors: [400, 403],
      context: ({ defaultContext, req }) => {
        return {
          ...defaultContext,
          tags: {
            locale: req.locale,
          },
        }
      },
      debug: true,
    },
    Sentry,
    enabled: process.env.NODE_ENV === 'production',
  }),
  redirectsPlugin({
    collections: ['pages', 'posts'],
    overrides: {
      admin: {
        group: '全局设置',
      },
      // @ts-expect-error
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'You will need to rebuild the website when changing this field.',
              },
            }
          }
          return field
        })
      },
      labels: {
        singular: '重定向',
        plural: '重定向',
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  nestedDocsPlugin({
    collections: ['categories'],
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    formOverrides: {
      admin: {
        group: '全局设置',
      },
      labels: {
        singular: '表单',
        plural: '表单',
      },
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  ]
                },
              }),
            }
          }
          return field
        })
      },
    },
    formSubmissionOverrides: {
      admin: {
        group: '用户数据',
      },
      labels: {
        singular: '表单提交',
        plural: '表单提交',
      },
    },
  }),
  searchPlugin({
    collections: ['products'],
    beforeSync: productBeforeSync,
    searchOverrides: {
      slug: 'product-search',
      admin: {
        group: '搜索结果',
      },
      labels: {
        singular: '产品搜索',
        plural: '产品搜索',
      },
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...productSearchFields]
      },
    },
  }),
  searchPlugin({
    collections: ['posts'],
    beforeSync: postBeforeSync,
    searchOverrides: {
      slug: 'post-search',
      admin: {
        group: '搜索结果',
      },
      labels: {
        singular: '文章搜索',
        plural: '文章搜索',
      },
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...postSearchFields]
      },
    },
  }),
  searchPlugin({
    collections: ['cities'],
    beforeSync: cityBeforeSync,
    searchOverrides: {
      slug: 'city-search',
      admin: {
        group: '搜索结果',
      },
      labels: {
        singular: '城市搜索',
        plural: '城市搜索',
      },
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...citySearchFields]
      },
    },
  }),
  payloadCloudPlugin(),
  translator({
    // collections with the enabled translator in the admin UI
    collections: ['posts', 'pages', 'categories', 'cities', 'media', 'products', 'product-options'],
    // globals with the enabled translator in the admin UI
    globals: [],
    // add resolvers that you want to include, examples on how to write your own in ./plugin/src/resolvers
    resolvers: [
      copyResolver(),
      googleResolver({
        apiKey: process.env.GOOGLE_API_KEY!,
      }),
    ],
  }),
  s3Storage({
    collections: {
      media: true,
    },
    bucket: process.env.S3_BUCKET || '',
    config: {
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
      },
      region: process.env.S3_REGION || '',
    },
  }),
]
