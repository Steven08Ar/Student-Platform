import * as React from "react"
import { cn } from "@/lib/utils"

// Fixed Switch component

const Switch = React.forwardRef(({ className, ...props }, ref) => (
    <div className="inline-flex items-center">
        <input
            type="checkbox"
            className={cn(
                "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
                // Using native checkbox styling for simplicity without radix
                "appearance-none bg-gray-200 checked:bg-black relative",
                "after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all checked:after:translate-x-4",
                className
            )}
            ref={ref}
            {...props}
        />
    </div>
))
Switch.displayName = "Switch"

export { Switch }
