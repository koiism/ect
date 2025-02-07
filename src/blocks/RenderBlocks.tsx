import React, { Fragment } from 'react'
import { cn } from '@/utilities/cn'

import type { Page } from '@/payload-types'

import { allBlocksMap, layoutBlocksMap } from './components'

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in allBlocksMap) {
            const Block = allBlocksMap[blockType]
            const isLayoutBlock = blockType in layoutBlocksMap

            if (Block) {
              return (
                <div key={index} className={cn(!isLayoutBlock && 'md:my-4 my-2', 'flex items-center justify-center')}>
                  {/* @ts-ignore */}
                  <Block {...block} />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
