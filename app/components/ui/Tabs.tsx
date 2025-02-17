"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const tabsVariants = cva("inline-flex flex-col shrink-0", {
  variants: {
    orientation: {
      horizontal: "flex-row",
      vertical: "flex-col",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
})

const tabsListVariants = cva("flex flex-wrap", {
  variants: {
    orientation: {
      horizontal: "flex-row",
      vertical: "flex-col",
    },
  },
})

const tabsTriggerVariants = cva(
  "flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-700",
  {
    variants: {
      selected: {
        true: "bg-indigo-600 text-white dark:bg-indigo-500",
      },
    },
  },
)

const tabsContentVariants = cva("p-4", {
  variants: {
    selected: {
      true: "block",
      false: "hidden",
    },
  },
})

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof tabsVariants> {
  defaultValue?: string
  children: React.ReactNode
}

export interface TabsListProps extends React.HTMLAttributes<HTMLUListElement>, VariantProps<typeof tabsListVariants> {}

export interface TabsTriggerProps
  extends React.HTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof tabsTriggerVariants> {
  value: string
}

export interface TabsContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tabsContentVariants> {
  value: string
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(({ className, defaultValue, children, ...props }, ref) => {
  const [selectedValue, setSelectedValue] = React.useState(defaultValue)

  const handleSelect = (value: string) => {
    setSelectedValue(value)
  }

  return (
    <div ref={ref} className={cn(tabsVariants({ className }))} {...props}>
      <ul className={cn(tabsListVariants({ orientation: props.orientation }))}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === TabsTrigger) {
            return React.cloneElement(child, {
              selected: child.props.value === selectedValue,
              onClick: () => handleSelect(child.props.value),
            })
          }
          return null
        })}
      </ul>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === TabsContent) {
          return React.cloneElement(child, { selected: child.props.value === selectedValue })
        }
        return null
      })}
    </div>
  )
})
Tabs.displayName = "Tabs"

const TabsList = React.forwardRef<HTMLUListElement, TabsListProps>(({ className, ...props }, ref) => (
  <ul ref={ref} className={cn(tabsListVariants(props), className)} {...props} />
))
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(({ className, selected, ...props }, ref) => (
  <button ref={ref} className={cn(tabsTriggerVariants({ selected }), className)} {...props} />
))
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(({ className, selected, ...props }, ref) => (
  <div ref={ref} className={cn(tabsContentVariants({ selected }), className)} {...props} />
))
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }

