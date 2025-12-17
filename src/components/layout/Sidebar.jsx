import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { LogOut, LayoutDashboard, Settings, ClipboardList, GraduationCap, Home, FileQuestion, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const Sidebar = ({ isCollapsed }) => {
    const { userData, logout } = useAuth();
    const location = useLocation();

    // Determine links based on role
    const links = userData?.role === 'teacher' ? [
        { name: "Dashboard", path: "/", icon: LayoutDashboard, view: null }, // Default view
        { name: "Teachers", path: "/?view=teachers", icon: Users, view: 'teachers' }, // Mock view
        { name: "Students", path: "/?view=students", icon: GraduationCap, view: 'students' },
        { name: "Classes", path: "/?view=courses", icon: BookOpen, view: 'courses' },
        { name: "Examinations", path: "/?view=exams", icon: FileQuestion, view: 'exams' },
        { name: "Settings", path: "/settings", icon: Settings },
    ] : [
        { name: "Dashboard", path: "/", icon: Home, view: 'home' },
        { name: "Course Sessions", path: "/?view=courses", icon: BookOpen, view: 'courses' },
        { name: "Tasks", path: "/?view=tasks", icon: ClipboardList, view: 'tasks' },
        { name: "Grades", path: "/?view=grades", icon: GraduationCap, view: 'grades' },
    ];

    // Check Active State
    const isActive = (link) => {
        const params = new URLSearchParams(location.search);
        const currentView = params.get("view");

        // Exact match for view param
        if (link.view && currentView === link.view) return true;
        // Default match (Dashboard)
        if (!link.view && !currentView && location.pathname === '/') return true;

        return false;
    };

    return (
        <div className="flex h-full w-full flex-col bg-[#1A4D3E] text-white transition-all duration-300">
            {/* Logo Area */}
            <div className={cn(
                "flex h-20 items-center px-6 font-bold text-2xl tracking-tight text-white",
                isCollapsed ? "justify-center" : "justify-start"
            )}>
                {isCollapsed ? "Sc." : "Schoolastica."}
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-auto py-4 px-4 space-y-1">
                {links.map((link) => {
                    const active = isActive(link);
                    return (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={cn(
                                "flex items-center rounded-full transition-all duration-200 group text-sm font-medium",
                                isCollapsed ? "justify-center px-2 py-3" : "gap-3 px-6 py-3",
                                active
                                    ? "bg-white text-[#1A4D3E] shadow-sm font-bold"
                                    : "text-emerald-100/80 hover:bg-emerald-800/50 hover:text-white"
                            )}
                            title={isCollapsed ? link.name : ""}
                        >
                            <link.icon className={cn("h-5 w-5", active ? "text-[#1A4D3E]" : "text-emerald-100")} />
                            {!isCollapsed && <span>{link.name}</span>}
                        </Link>
                    );
                })}
            </div>

            {/* Footer / Logout */}
            <div className="p-6">
                <Button
                    variant="ghost"
                    className={cn(
                        "w-full text-emerald-100/70 hover:text-white hover:bg-emerald-800/50 rounded-full",
                        isCollapsed ? "justify-center px-0" : "justify-start pl-4"
                    )}
                    onClick={logout}
                    title="Log out"
                >
                    <LogOut className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
                    {!isCollapsed && "Log out"}
                </Button>
            </div>
        </div>
    );
};

export default Sidebar;
