import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5FFF] disabled:opacity-50 disabled:pointer-events-none active:scale-95',
  {
    variants: {
      variant: {
        default: 'bg-[#0B5FFF] text-white hover:bg-[#0842CC] hover:shadow-lg',
        secondary:
          'bg-[#FF7A00] text-white hover:bg-[#CC6200] hover:shadow-lg',
        outline:
          'border-2 border-[#0B5FFF] text-[#0B5FFF] hover:bg-[#0B5FFF] hover:text-white',
        ghost: 'hover:bg-gray-100 hover:text-gray-900',
        success: 'bg-[#22C55E] text-white hover:bg-[#16A34A] hover:shadow-lg',
        danger: 'bg-red-500 text-white hover:bg-red-600 hover:shadow-lg',
      },
      size: {
        default: 'h-12 px-6 py-3',
        sm: 'h-9 px-4 py-2 text-sm',
        lg: 'h-14 px-8 py-4 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }