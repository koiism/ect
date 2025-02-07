import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  return (
    /* eslint-disable @next/next/no-img-element */
    <>
      <img
        alt="Explore China Tour Logo"
        width={127}
        height={18}
        loading={loading}
        fetchPriority={priority}
        decoding="async"
        className={clsx('hidden md:block max-w-[9.375rem] w-full h-[34px]', className)}
        src="/logo.svg"
      />
      <img
        alt="Explore China Tour Logo"
        width={127}
        height={18}
        loading={loading}
        fetchPriority={priority}
        decoding="async"
        className={clsx('block md:hidden max-w-[9.375rem] w-[24px] h-[24px]', className)}
        src="/favicon.svg"
      />
    </>
  )
}
