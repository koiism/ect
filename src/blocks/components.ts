import { FormBlock as FormBlockClient } from './Form/Component'
import { BannerBlock as BannerClient } from './Banner/Component'
import { MediaBlock as MediaBlockClient } from './MediaBlock/Component'
import { GridBlock as GridBlockClient } from './Grid/Component'
import { RowBlock as RowBlockClient } from './Row/Component'
import { ColumnBlock as ColumnBlockClient } from './Column/Component'
import { SearchBlock as SearchBlockClient } from './Search/Component'
import { ProductCardBlock as ProductBlockClient } from './ProductCardBlock/Component'
import { RecommendationBlock as RecommendationBlockClient } from './Recommendation/Component'
import { SloganBlock as SloganBlockClient } from './Slogan/Component'
import { TitleBlock as TitleBlockClient } from './Title/Component'
import { TrendingTagsBlock as TrendingTagsBlockClient } from './TrendingTags/Component'
import { CallToActionBlock as CallToActionBlockClient } from './CallToAction/Component'
import { BlockType } from './constants'

export { RenderBlocks } from './RenderBlocks'

export const layoutBlocksMap = {
  [BlockType.GridBlock]: GridBlockClient,
  [BlockType.RowBlock]: RowBlockClient,
  [BlockType.ColumnBlock]: ColumnBlockClient,
}

export const contentBlocksMap = {
  [BlockType.FormBlock]: FormBlockClient,
  [BlockType.MediaBlock]: MediaBlockClient,
  [BlockType.BannerBlock]: BannerClient,
  [BlockType.SearchBlock]: SearchBlockClient,
  [BlockType.ProductCardBlock]: ProductBlockClient,
  [BlockType.RecommendationBlock]: RecommendationBlockClient,
  [BlockType.SloganBlock]: SloganBlockClient,
  [BlockType.TitleBlock]: TitleBlockClient,
  [BlockType.TrendingTagsBlock]: TrendingTagsBlockClient,
  [BlockType.CallToActionBlock]: CallToActionBlockClient,
}

export const allBlocksMap = {
  ...layoutBlocksMap,
  ...contentBlocksMap,
}

