import * as React from "react"
import { type VariantProps, cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const selectVariants = cva(
  "relative flex w-full items-center rounded-md border border-input bg-background py-2 pl-3 pr-10 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        default: "h-10",
        sm: "h-9",
        lg: "h-11",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
)

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement>,
    VariantProps<typeof selectVariants> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, size, ...props }, ref) => (
  <div className={cn(selectVariants({ size, className }))}>
    <select ref={ref} {...props} />
  </div>
))
Select.displayName = "Select"

export { Select, selectVariants }

