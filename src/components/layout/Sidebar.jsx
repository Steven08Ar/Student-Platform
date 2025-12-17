import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { LogOut, LayoutDashboard, Settings, ClipboardList, GraduationCap, Home, FileQuestion, Users, BookOpen, Video, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MailService } from "@/services/mailService";
import { useEffect } from "react";

const Sidebar = ({ isCollapsed }) => {
    const { userData, logout } = useAuth();
    const location = useLocation();
    const [showComingSoonModal, setShowComingSoonModal] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!userData?.uid) return;
        const unsubscribe = MailService.subscribeToUnreadCount(userData.uid, (count) => {
            setUnreadCount(count);
        });
        return () => unsubscribe();
    }, [userData]);

    // Determine links based on role
    const links = userData?.role === 'teacher' ? [
        { name: "Dashboard", path: "/", icon: LayoutDashboard, view: null }, // Default view
        { name: "Teachers", path: "/?view=teachers", icon: Users, view: 'teachers' }, // Mock view
        { name: "Students", path: "/?view=students", icon: GraduationCap, view: 'students' },
        { name: "Classes", path: "/?view=courses", icon: BookOpen, view: 'courses' },
        { name: "Mensajes", path: "/mail", icon: Mail },
        { name: "Clases Virtuales", path: "#", icon: Video, isComingSoon: true },
        { name: "Examinations", path: "/?view=exams", icon: FileQuestion, view: 'exams' },
        { name: "Settings", path: "/settings", icon: Settings },
    ] : [
        { name: "Dashboard", path: "/", icon: Home, view: null }, // Default view (no query param)
        { name: "Course Sessions", path: "/?view=courses", icon: BookOpen, view: 'courses' },
        { name: "Tasks", path: "/?view=tasks", icon: ClipboardList, view: 'tasks' },
        { name: "Grades", path: "/?view=grades", icon: GraduationCap, view: 'grades' },
        { name: "Mensajes", path: "/mail", icon: Mail },
        { name: "Clases Virtuales", path: "#", icon: Video, isComingSoon: true },
    ];

    // Check Active State
    const isActive = (link) => {
        const params = new URLSearchParams(location.search);
        const currentView = params.get("view");

        // Don't mark coming soon items as active
        if (link.isComingSoon) {
            return false;
        }

        // Exact match for view param
        if (link.view && currentView === link.view) return true;

        // Dashboard match (view is null and no view param in URL)
        if (link.view === null && !currentView && location.pathname === '/') {
            return true;
        }

        // Exact match for path (e.g. /mail)
        if (location.pathname === link.path) return true;

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

                    // Coming Soon items - render as button
                    if (link.isComingSoon) {
                        return (
                            <button
                                key={link.name}
                                onClick={() => setShowComingSoonModal(true)}
                                className={cn(
                                    "flex items-center rounded-full transition-all duration-200 group text-sm font-medium w-full",
                                    isCollapsed ? "justify-center px-2 py-3" : "gap-3 px-6 py-3",
                                    "text-emerald-100/80 hover:bg-emerald-800/50 hover:text-white"
                                )}
                                title={isCollapsed ? link.name : ""}
                            >
                                <link.icon className="h-5 w-5 text-emerald-100" />
                                {!isCollapsed && <span>{link.name}</span>}
                            </button>
                        );
                    }

                    // Regular links
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
                            {!isCollapsed && (
                                <span className={cn("flex-1", active ? "text-[#1A4D3E]" : "")}>{link.name}</span>
                            )}
                            {unreadCount > 0 && link.name === "Mensajes" && (
                                <span className={cn(
                                    "flex items-center justify-center h-5 w-5 text-xs font-bold rounded-full",
                                    active ? "bg-red-500 text-white" : "bg-red-500 text-white"
                                )}>
                                    {unreadCount}
                                </span>
                            )}
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

            {/* Coming Soon Modal */}
            {showComingSoonModal && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={() => setShowComingSoonModal(false)}
                >
                    <div
                        className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-700 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-xl font-bold text-white mb-3">
                            Clases Virtuales
                        </h3>
                        <p className="text-gray-300 mb-6">
                            Esta funcionalidad estará disponible próximamente.
                        </p>
                        <button
                            onClick={() => setShowComingSoonModal(false)}
                            className="w-full bg-[#1A4D3E] hover:bg-[#143D31] text-white py-2 px-4 rounded-lg font-medium transition-colors"
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
