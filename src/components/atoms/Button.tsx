import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                foreground:
                    "bg-hms-primary text-primary-foreground shadow hover:bg-hms-primary/80",
                background:
                    "bg-hms-accent text-white shadow-sm hover:bg-hms-accent/80",
                slatePrimary:
                    "bg-slate-50 shadow-sm hover:bg-accent hover:text-accent-foreground",
                slateSecondary:
                    "bg-slate-200 text-secondary-foreground shadow-sm hover:bg-secondary/80",
                negative:
                    "bg-primary text-primary-foreground hover:bg-primary-foreground hover:text-primary border hover:border-primary",
                primaryOutline:
                    "border border-hms-primary text-hms-primary hover:bg-hms-primary hover:text-white shadow-xs hover:shadow-sm focus-visible:ring-2 focus-visible:ring-hms-primary/20 dark:focus-visible:ring-hms-primary/40 dark:bg-hms-primary/10 dark:text-hms-primary",
                secondaryOutline:
                    "border border-hms-accent text-hms-accent hover:bg-hms-primary hover:text-white shadow-xs hover:shadow-sm focus-visible:ring-2 focus-visible:ring-hms-primary/20 dark:focus-visible:ring-hms-primary/40 dark:bg-hms-primary/10 dark:text-hms-primary",
                defaultLint:
                    "text-hms-primary cursor-pointer hover:text-hms-primary/70 transition-all duration-200 ",
                default:
                    "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
                destructive:
                    "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
                outline:
                    "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
                secondary:
                    "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
                ghost:
                    "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
                link:
                    "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-9 px-4 py-2",
                sm: "h-8 rounded-md px-3 text-xs",
                lg: "h-10 rounded-md px-8",
                icon: "h-9 w-9",
            },
        },
        defaultVariants: {
            variant: "foreground",
            size: "default",
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
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
