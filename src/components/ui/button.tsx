import { cn } from 'src/utilities/cn'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'
import { HTMLMotionProps, motion } from 'motion/react'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
    variants: {
      size: {
        clear: '',
        default: 'h-10 px-4 py-2',
        icon: 'h-10 w-10',
        lg: 'md:h-11 rounded-xl md:px-8 px-4 h-10',
        sm: 'h-9 rounded-xl px-3',
        rounded: 'h-11 rounded-full px-8 font-bold text-lg',
      },
      variant: {
        default: 'bg-gradient-to-tr from-gradient-start to-gradient-end text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        ghost: 'hover:bg-card hover:text-accent-foreground',
        link: 'text-primary items-start justify-start underline-offset-4 hover:underline',
        outline: 'border border-border bg-background hover:bg-card hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      },
    },
  },
)

type ButtonBaseProps = Omit<HTMLMotionProps<"button">, keyof VariantProps<typeof buttonVariants>>

export interface ButtonProps extends ButtonBaseProps, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild = false, className, size, variant, ...props }, ref) => {
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ className, size, variant }))}
          ref={ref}
          {...(props as any)}
        />
      )
    }

    const motionProps = (!variant || variant === 'default') ? {
      whileHover: { scale: 1.02 },
      whileTap: { scale: 0.98 },
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30
      }
    } : {}

    return (
      <motion.button
        className={cn(buttonVariants({ className, size, variant }))}
        ref={ref}
        {...motionProps}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
