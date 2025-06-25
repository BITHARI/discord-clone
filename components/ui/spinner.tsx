import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const spinnerVariants = cva(
    "animate-spin rounded-full border-solid border-current",
    {
        variants: {
            size: {
                "3xs": "h-2 w-2 border-[1px]",
                "2xs": "h-3 w-3 border-[1px]",
                xs: "h-4 w-4 border-[1px]",
                sm: "h-5 w-5 border-[1.5px]",
                md: "h-6 w-6 border-2",
                lg: "h-8 w-8 border-2",
                xl: "h-10 w-10 border-[2.5px]",
                "2xl": "h-12 w-12 border-[3px]",
                "3xl": "h-16 w-16 border-4",
            },
            variant: {
                default: "border-t-transparent border-r-transparent",
                dots: "border-t-transparent border-r-current border-b-current border-l-current",
                pulse: "border-t-current border-r-transparent border-b-current border-l-transparent",
            },
        },
        defaultVariants: {
            size: "md",
            variant: "default",
        },
    }
)

export interface SpinnerProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
    /**
     * Screen reader text for accessibility
     */
    srText?: string
}
const Spinner = ({ className, size, variant, srText = "Loading...", ...props }: SpinnerProps) => {
    return (
        <div
            className={cn(spinnerVariants({ size, variant }), className)}
            role="status"
            aria-label={srText}
            {...props}
        >
            <span className="sr-only">{srText}</span>
        </div>
    )
}


export default Spinner