import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { generateMeta } from '@/utilities/generateMeta'
import { getPayload } from 'payload'
import config from '@/payload.config'
import ProductPageClient from './page.client'
import AboutThisTour from '@/components/products/AboutThisTour'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { Media, Category, City } from '@/payload-types'
import { Title } from '@/components/ui/title'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Icon } from '@/components/Icon'
import { Tracker } from '@/tracking'
import { DescriptionSection } from '@/components/products/DescriptionSection'

const queryProductBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'products',
    draft,
    limit: 1,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})

export async function generateStaticParams() {
  const payloadClient = await getPayload({ config })
  const products = await payloadClient.find({
    collection: 'products',
    draft: false,
    limit: 1000,
  })

  return products.docs.map(({ slug }) => ({ slug }))
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Product({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const product = await queryProductBySlug({ slug })

  if (!product) return <PayloadRedirects url={'/products/' + slug} />

  return (
    <Tracker
      params={{
        pageName: product.title,
        pageType: 'product',
        title: product.title,
      }}
      pageLoad={{
        pageView: true,
      }}
    >
      <article className="pb-[72px] md:pb-16 md:pt-24">
        {/* 图片轮播 - 移动端通顶显示 */}
        <div className="md:hidden">
          <Carousel>
            <CarouselContent>
              {product.images?.map((item) => (
                <CarouselItem key={(item as Media).url}>
                  <div
                    className="relative aspect-[4/3] bg-center bg-cover bg-no-repeat w-full"
                    style={{
                      backgroundImage: `url(${(item as Media).url})`,
                    }}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        <div className="container max-w-7xl mx-auto px-4">
          {/* 桌面端图片轮播 */}
          <div className="hidden md:block mb-8 rounded-lg overflow-hidden">
            <Carousel className="w-full">
              <CarouselContent>
                {product.images?.map((item) => (
                  <CarouselItem key={(item as Media).url}>
                    <div
                      className="relative aspect-[21/9] rounded-lg bg-center bg-cover bg-no-repeat w-full"
                      style={{
                        backgroundImage: `url(${(item as Media).url})`,
                      }}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>

          {/* 面包屑导航 */}
          <div className="py-4 hidden md:block">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator />

                {product.city && typeof product.city !== 'string' && (
                  <>
                    <BreadcrumbItem>
                      <BreadcrumbLink href={`/cities/${(product.city as City).slug}`}>
                        {(product.city as City).title}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                  </>
                )}

                {product.categories &&
                  product.categories.length > 0 &&
                  typeof product.categories[0] !== 'string' && (
                    <>
                      <BreadcrumbItem>
                        <BreadcrumbLink
                        // href={`/categories/${(product.categories[0] as Category).id}`}
                        >
                          <div className="flex items-center gap-1">
                            <Icon name={(product.categories[0] as Category).icon} />
                            {(product.categories[0] as Category).title}
                          </div>
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                    </>
                  )}

                <BreadcrumbItem>
                  <BreadcrumbPage>{product.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* 标题和摘要 */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">{product.title}</h1>
            <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg">{product.summary}</p>
          </div>

          {/* 主要内容区域 */}
          <ProductPageClient product={product}>
            <div className="flex flex-col gap-8 flex-1">
              {/* 亮点 */}
              {product.highlights && product.highlights.length > 0 && (
                <section className="flex flex-col md:gap-4 gap-2">
                  <Title title="Highlights" variant="left" size="sm" weight="bold" color="primary" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.highlights.map((highlight, index) => (
                      <div key={highlight.id} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                          {index + 1}
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">{highlight.text}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* About This Tour */}
              <section className="flex flex-col md:gap-4 gap-2">
                <Title title="About This Tour" variant="left" size="sm" weight="bold" color="primary" />
                <AboutThisTour product={product} />
              </section>

              {/* 详细描述 */}
              {product.description && (
                <DescriptionSection description={product.description} />
              )}

              {/* 包含和不包含项目 */}
              {Boolean(product.includes?.length || product.excludes?.length) && (
                <section className="flex flex-col md:gap-4 gap-2">
                  <Title title="What's Included" variant="left" size="sm" weight="bold" color="primary" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.includes?.map((item) => (
                      <div key={item.id} className="flex items-center gap-2">
                        <Icon name="HiCheck" className="text-green-500" />
                        <span>{item.text}</span>
                      </div>
                    ))}
                    {product.excludes?.map((item) => (
                      <div key={item.id} className="flex items-center gap-2">
                        <Icon name="HiX" className="text-red-500" />
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* 重要信息 */}
              {product.importantInfo && product.importantInfo.length > 0 && (
                <section className="flex flex-col md:gap-4 gap-2">
                  <Title title="Important Information" variant="left" size="sm" weight="bold" color="primary" />
                  <div className="space-y-6">
                    {product.importantInfo.map((info) => (
                      <div key={info.id} className="bg-muted p-4 rounded-lg">
                        <h3 className="font-semibold text-lg mb-2">{info.title}</h3>
                        {info.content && (
                          <ul className="space-y-2">
                            {info.content.map((item) => (
                              <li key={item.id} className="flex items-start gap-2">
                                <Icon name="HiInformationCircle" className="mt-1 flex-shrink-0" />
                                <span>{item.text}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </ProductPageClient>
        </div>
      </article>
    </Tracker>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const product = await queryProductBySlug({ slug })
  return generateMeta({ doc: product })
}
