import { GenerateDescription } from '@payloadcms/plugin-seo/types'
import OpenAI from 'openai'
import { Config, SanitizedConfig } from 'payload'
import { PageContext } from '../types/PageContext'
import { SeoPluginConfig } from '../types/SeoPluginConfig'
import { generateOpenAIChatCompletion } from './generateOpenAIChatCompletion'
import { lexicalToPlainText } from './lexicalToPlainText'

/** Wrapper function which returns the generateMetaDescription function which can be passed to the official seo plugin. */
export const getGenerateMetaDescription = (
  pluginConfig: SeoPluginConfig,
  payloadConfig: Config,
) => {
  const generateMetaDescription: GenerateDescription = async ({ doc, locale, collectionSlug }) => {
    if (!collectionSlug) {
      throw new Error('Collection slug is required')
    }

    const transformerFunction = pluginConfig.documentContentTransformers[collectionSlug]

    if (!transformerFunction) {
      throw new Error(
        `No document content transformer found for collection slug: ${collectionSlug}`,
      )
    }

    // TODO: Sanitize the payload config and pass it to lexicalToPlainText
    // const sanitizedPayloadConfig = await sanitizeConfig(payloadConfig)

    const content = await transformerFunction(doc, (field: any) =>
      lexicalToPlainText(field, {} as SanitizedConfig),
    )

    const pageContext: PageContext = {
      title: doc?.title,
      type: collectionSlug,
      keywords: doc?.meta?.keywords?.map(
        (keywordArrayItem: { keyword: string }) => keywordArrayItem.keyword,
      ),
    }

    // the real max value is 150, but this leaves a bit more room for the inaccuracies of the LLM
    const lengthLimit = 140

    const body: OpenAI.Chat.ChatCompletionCreateParams = {
      model: pluginConfig.llmModel ?? 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: `
        你是一个SEO专家。请根据以下信息创建一个SEO优化的元描述：

        **网站上下文**:
        - 网站主题: ${pluginConfig.websiteContext.topic}

        **页面上下文**:
        - 页面标题: ${pageContext.title}
        - 页面类型: ${pageContext.type}
        - 重点关键词: ${pageContext.keywords?.at(0) ?? 'N/A'}
        - 页面关键词: ${pageContext.keywords ? pageContext.keywords.slice(1).join(', ') : 'N/A'}

        **指南**:

        - 编写一个简洁且吸引人的页面内容摘要。
        - 描述应该吸引用户访问页面。
        - 重点关键词必须包含在描述中。
        - 尽可能自然地将关键词融入文本中。
        - 保持专业和信息丰富的语气。使用中性语言。
        - 避免直接称呼如"发现"或"了解"。
        - 将长度限制在最多${lengthLimit}个字符。
        - 使用ISO-2代码"${locale}"指定的语言编写。

        重要：检查你的结果并计算使用的字符数（包括空格）。如果描述超过${lengthLimit}个字符，请调整描述以符合所有指南。
        不要输出字符数。

        页面内容将在下一步提供。`,
        },
        {
          role: 'user',
          content: JSON.stringify(content),
        },
      ],
      max_completion_tokens: 100,
    }

    const result = await generateOpenAIChatCompletion(body)

    if (!result) {
      throw new Error('No description generated')
    }

    // Remove any quotes that OpenAI might have added around the description
    return result.trim().replace(/^["']|["']$/g, '')
  }

  return generateMetaDescription
}
