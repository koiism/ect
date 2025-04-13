import OpenAI from 'openai'
import { Product } from '@/payload-types'

export interface ICommonPromptParams {
  locale: string
  type: keyof typeof generatePromptMap
}

export interface IProductPromptParams extends ICommonPromptParams {
  seedContent: string
  title?: Product['title']
  summary?: Product['summary']
  description?: Product['description']
  highlights?: Product['highlights']
  includes?: Product['includes']
  excludes?: Product['excludes']
  importantInfo?: Product['importantInfo']
  meta?: Product['meta']
}

function generateProductPrompts(params: IProductPromptParams) {
  const { title, summary, description, highlights, includes, excludes, importantInfo, meta, locale, seedContent } = params
  if (!seedContent) {
    throw new Error('缺少必要的描述参数')
  }

  const prompts: OpenAI.Chat.ChatCompletionCreateParams = {
    model: 'deepseek-chat',
    messages: [
      {
        role: 'system',
        content: `你是一个专业的旅游产品文案专家。请根据提供的产品信息，生成以下内容：

          1. 产品标题：
          - 简洁有力的产品名称
          - 突出产品特色和价值
          - 当前标题(如有)：${title}

          2. 产品简介：
          - 200字以内的简要介绍
          - 概括产品核心价值和特点
          - 吸引用户兴趣
          - 当前简介(如有)：${summary}

          3. 产品详细描述：
          - 至少500字的详细描述
          - 包含产品的主要特点、行程安排、体验价值等
          - 使用专业但易懂的语言
          - 注重实用信息和体验描述
          - 当前描述(如有)：${description}

          4. 产品亮点：
          - 3-5个产品的主要亮点
          - 每个亮点应简洁明了
          - 突出独特卖点和价值主张
          - 当前亮点(如有)：${highlights}

          5. 包含内容：
          - 列出产品包含的所有服务和项目
          - 清晰明确的表述
          - 避免模糊描述
          - 当前包含内容(如有)：${includes}

          6. 不包含内容：
          - 列出产品不包含的重要项目
          - 帮助用户了解额外费用
          - 避免误解和纠纷
          - 当前不包含内容(如有)：${excludes}

          7. 重要信息：
          - 2-3个重要信息类别
          - 每个类别包含相关的具体说明
          - 涵盖预订须知、使用说明等关键信息
          - 当前重要信息(如有)：${importantInfo}

          8. SEO优化内容：
          - Meta标题: 30-60字符,包含主要关键词
          - Meta描述: 50-160字符,概括产品价值,吸引点击
          - 关键词: 3-5个重要关键词,反映产品特点和目标用户搜索意图
          - 当前SEO内容(如有)：${meta}

          !!!!!请使用ISO-2代码"${locale}"指定的语言编写!!!!!
          !!!!!请使用ISO-2代码"${locale}"指定的语言编写!!!!!
          !!!!!请使用ISO-2代码"${locale}"指定的语言编写!!!!!
          请以JSON格式返回，格式如下，除了返回的JSON之外不要返回其他任何内容：
          {
            "title": "产品标题",
            "summary": "产品简介",
            "description": "产品详细描述文本",
            "highlights": [
              { "text": "亮点1" },
              { "text": "亮点2" }
            ],
            "includes": [
              { "text": "包含项目1" },
              { "text": "包含项目2" }
            ],
            "excludes": [
              { "text": "不包含项目1" },
              { "text": "不包含项目2" }
            ],
            "importantInfo": [
              {
                "title": "类别1",
                "content": [
                  { "text": "说明1" },
                  { "text": "说明2" }
                ]
              }
            ],
            "meta": {
              "title": "SEO标题",
              "description": "SEO描述",
              "keywords": [
                { "keyword": "关键词1" },
                { "keyword": "关键词2" }
              ]
            }
          }`,
      },
      {
        role: 'user',
        content: seedContent,
      },
    ],
    stream: false,
  }
  return prompts
}

export const generatePromptMap = {
  product: generateProductPrompts,
}
