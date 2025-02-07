import React from 'react';
import { cn } from '@/utilities/cn';
import { type VariantProps, cva } from 'class-variance-authority';

const titleVariants = cva(
  'relative w-full mx-auto font-sans tracking-tight',
  {
    defaultVariants: {
      variant: 'center',
      color: 'foreground',
      size: 'default',
      weight: 'medium',
      textTransform: 'normal',
    },
    variants: {
      textTransform: {
        uppercase: 'uppercase',
        lowercase: 'lowercase',
        capitalize: 'capitalize',
        normal: 'normal',
      },
      size: {
        xs: 'text-sm leading-tight',
        sm: 'text-2xl leading-tight',
        default: 'text-3xl leading-tight',
        lg: 'text-4xl md:text-5xl leading-[1.1]',
        xl: 'text-5xl md:text-6xl leading-[1.1]',
      },
      weight: {
        light: 'font-light',
        normal: 'font-normal',
        medium: 'font-medium',
        bold: 'font-bold',
      },
      color: {
        primary: [
          'bg-gradient-to-r from-gradient-start to-gradient-end',
          'bg-clip-text text-transparent inline',
        ].join(' '),
        secondary: 'text-secondary',
        muted: 'text-muted',
        foreground: 'text-foreground',
        mutedForeground: 'text-muted-foreground',
      },
      variant: {
        center: 'text-center',
        left: 'text-left',
        right: 'text-right',
      },
    },
  },
);

type TitleVariantsProps = VariantProps<typeof titleVariants>;

export interface TitleProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {
  title: string;
  subtitle?: string;
  textTransform?: TitleVariantsProps['textTransform'];
  variant?: TitleVariantsProps['variant'];
  color?: TitleVariantsProps['color'];
  size?: TitleVariantsProps['size'];
  weight?: TitleVariantsProps['weight'];
}

const Title: React.FC<TitleProps> = ({
  variant,
  color,
  size,
  weight,
  title,
  subtitle,
  className,
  textTransform,
  ...props
}) => {
  return (
    <div className={cn('space-y-2', className)} {...props}>
      <h1 className={cn(titleVariants({ variant, color, size, weight, textTransform }))}>
        {title}
      </h1>
      {subtitle && (
        <p className="text-muted-foreground text-center text-base md:text-lg font-normal tracking-tight">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export { Title, titleVariants };
