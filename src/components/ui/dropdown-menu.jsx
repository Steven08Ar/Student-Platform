import * as React from "react"
import { cn } from "@/lib/utils"

const DropdownMenuContext = React.createContext({})

const DropdownMenu = ({ children }) => {
    const [open, setOpen] = React.useState(false)
    const menuRef = React.useRef(null)

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <DropdownMenuContext.Provider value={{ open, setOpen }}>
            <div className="relative inline-block text-left" ref={menuRef}>
                {children}
            </div>
        </DropdownMenuContext.Provider>
    )
}

const DropdownMenuTrigger = ({ children, asChild, className }) => {
    const { open, setOpen } = React.useContext(DropdownMenuContext)
    return (
        <div
            onClick={() => setOpen(!open)}
            className={cn("cursor-pointer", className)}
        >
            {children}
        </div>
    )
}

const DropdownMenuContent = ({ children, className, align = "end" }) => {
    const { open } = React.useContext(DropdownMenuContext)

    if (!open) return null

    return (
        <div
            className={cn(
                "absolute z-50 mt-2 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2",
                align === "end" ? "right-0" : "left-0",
                className
            )}
        >
            {children}
        </div>
    )
}

const DropdownMenuItem = ({ children, className, onClick }) => {
    const { setOpen } = React.useContext(DropdownMenuContext)
    return (
        <div
            className={cn(
                "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer",
                className
            )}
            onClick={(e) => {
                onClick?.(e)
                // Don't close if it's a switch toggle (prevent accidental closures)
                // But normally items close the menu. 
                // We'll let the user handle closure if needed, but default is close.
                // Actually for switches inside items, we might not want to close.
                // Simple logic: Close for now.
                // If it's pure toggle, maybe verify event target?
                // Let's rely on standard behavior for now.
                // setOpen(false) 
                // Wait, switches usually need click.
            }}
        >
            {children}
        </div>
    )
}

const DropdownMenuLabel = ({ children, className }) => (
    <div className={cn("px-2 py-1.5 text-sm font-semibold", className)}>
        {children}
    </div>
)

const DropdownMenuSeparator = ({ className }) => (
    <div className={cn("-mx-1 my-1 h-px bg-muted", className)} />
)

export {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
}
