import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#0B5FFF] focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-[#0B5FFF] text-white hover:bg-[#0842CC]',
        secondary: 'bg-[#FF7A00] text-white hover:bg-[#CC6200]',
        success: 'bg-[#22C55E] text-white hover:bg-[#16A34A]',
        danger: 'bg-red-500 text-white hover:bg-red-600',
        outline: 'border border-gray-200 text-gray-700 hover:bg-gray-100',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }