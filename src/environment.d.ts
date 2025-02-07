declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // 基础配置
      PAYLOAD_SECRET: string
      DATABASE_URI: string
      NEXT_PUBLIC_SERVER_URL: string
      VERCEL_PROJECT_PRODUCTION_URL: string

      // Google API 配置
      GOOGLE_API_KEY: string

      // PayPal 配置
      NEXT_PUBLIC_PAYPAL_CLIENT_ID: string
      PAYPAL_CLIENT_SECRET: string
      PAYPAL_MODE: 'sandbox' | 'live'
      PAYPAL_API_URL: string

      // AWS S3 配置
      S3_BUCKET: string
      S3_ACCESS_KEY_ID: string
      S3_SECRET_ACCESS_KEY: string
      S3_REGION: string

      // Resend 配置
      RESEND_API_KEY: string
      NEXT_PUBLIC_RESEND_FROM_EMAIL: string
      NEXT_PUBLIC_RESEND_FROM_NAME: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
