import { Grid } from './Grid/config'
import { Row } from './Row/config'
import { Column } from './Column/config'
import { contentBlocks } from './contentBlocks'

export const layoutBlocks = [Column, Grid, Row]

export const allBlocks = [...layoutBlocks, ...contentBlocks]
