import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";

const Layout = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();

    return (
        <div className={cn(
            "grid min-h-screen w-full transition-all duration-300",
            isCollapsed ? "lg:grid-cols-[80px_1fr]" : "lg:grid-cols-[280px_1fr]"
        )}>
            {/* Sidebar Column */}
            <div className="hidden border-r bg-[#1A4D3E] lg:block relative group transition-all">
                {/* Collapse Toggle Button */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-6 z-20 h-6 w-6 rounded-full border bg-white flex items-center justify-center text-gray-400 hover:text-[#1A4D3E] shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <Menu className="h-3 w-3" />
                </button>

                <Sidebar isCollapsed={isCollapsed} />
            </div>

            {/* Main Content Column */}
            <div className="flex flex-col h-screen overflow-hidden bg-[#F2F6F5]"> {/* Pale Mint-Grey Background */}
                {/* TopBar - Hidden on Settings page */}
                {location.pathname !== '/settings' && <TopBar />}

                {/* Mobile Header */}
                <header className="flex h-14 items-center gap-4 border-b bg-white px-6 lg:hidden">
                    <span className="font-bold text-[#1A4D3E]">Schoolastica.</span>
                </header>

                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
