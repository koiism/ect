import * as HiIcons from 'react-icons/hi'
import * as CiIcons from 'react-icons/ci'
export const Icons = {
  ...CiIcons,
  ...HiIcons,
} as const
export const iconOptions: Record<string, string> = Object.keys(Icons).reduce((acc, key) => {
  acc[key] = key
  return acc
}, {} as Record<string, string>)

export type IconType = keyof typeof Icons
