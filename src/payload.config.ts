// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { resendAdapter } from '@payloadcms/email-resend'
import sharp from 'sharp' // sharp-import
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'
import { zh } from '@payloadcms/translations/languages/zh'
import { en } from '@payloadcms/translations/languages/en'
import { Cities } from './collections/Cities'
import { ProductOptions } from './collections/ProductOptions'
import { Products } from './collections/Products'
import { Orders } from './collections/Orders'
import { OrderFields } from './collections/OrderFields'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  i18n: {
    fallbackLanguage: 'zh',
    supportedLanguages: {
      en,
      zh,
    },
  },
  localization: {
    locales: ['en', 'zh'], // required
    defaultLocale: 'en', // required
  },
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
    components: {
      providers: [
        '@payloadcms/plugin-sentry/client#AdminErrorBoundary'
      ]
    }
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  plugins: [
    ...plugins,
    // storage-adapter-placeholder
  ],
  collections: [
    Pages,
    Posts,
    Products,
    Categories,
    Cities,
    ProductOptions,
    Orders,
    OrderFields,
    Users,
    Media,
  ],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  email: resendAdapter({
    apiKey: process.env.RESEND_API_KEY,
    defaultFromAddress: process.env.NEXT_PUBLIC_RESEND_FROM_EMAIL,
    defaultFromName: process.env.NEXT_PUBLIC_RESEND_FROM_NAME,
  }),
})
