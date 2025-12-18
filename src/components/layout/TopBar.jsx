import { useState, useEffect } from "react";
import { Search, Bell, MessageSquare, Moon, Sun, Globe, User, Settings as SettingsIcon, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";

const TopBar = () => {
    const { userData, logout } = useAuth();
    const navigate = useNavigate();

    // Dark mode state
    const [isDarkMode, setIsDarkMode] = useState(false);
    // Language state
    const [language, setLanguage] = useState("ES");

    // Toggle dark mode class
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    return (
        <div className="h-20 w-full bg-transparent px-8 flex items-center justify-between z-10">
            {/* Search Bar - Styled to blend with background or stand out lightly */}
            <div className="relative w-96">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                    placeholder="Search.."
                    className="pl-12 rounded-full bg-white border-transparent shadow-sm text-sm h-12 focus-visible:ring-1 focus-visible:ring-[#1A4D3E]"
                />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
                <button className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-[#1A4D3E] shadow-sm transition-colors relative group">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-[#E53935] rounded-full border border-white"></span>
                </button>
                <button className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-[#1A4D3E] shadow-sm transition-colors">
                    <MessageSquare className="h-5 w-5" />
                </button>

                {/* Profile Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="flex items-center gap-3 bg-white pl-1 pr-4 py-1 rounded-full shadow-sm ml-2 cursor-pointer hover:shadow-md transition-shadow select-none">
                            <div className="h-9 w-9 rounded-full bg-[#1A4D3E]/10 overflow-hidden border border-[#1A4D3E]/20">
                                <img
                                    src={userData?.avatarUrl || `https://api.dicebear.com/9.x/avataaars/svg?seed=${userData?.name || 'User'}`}
                                    alt="profile"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-bold text-gray-800 leading-none">{userData?.name || "User"}</p>
                            </div>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                        <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem onClick={() => navigate('/settings')}>
                            <User className="mr-2 h-4 w-4" />
                            <span>Perfil</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/settings')}>
                            <SettingsIcon className="mr-2 h-4 w-4" />
                            <span>Configuración</span>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem onClick={(e) => e.preventDefault()}>
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center">
                                    {isDarkMode ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}
                                    <span>Modo Nocturno</span>
                                </div>
                                <Switch
                                    checked={isDarkMode}
                                    onCheckedChange={setIsDarkMode}
                                />
                            </div>
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={(e) => {
                            e.preventDefault();
                            setLanguage(prev => prev === "ES" ? "EN" : "ES");
                        }}>
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center">
                                    <Globe className="mr-2 h-4 w-4" />
                                    <span>Idioma</span>
                                </div>
                                <span className="text-xs font-bold bg-muted px-2 py-0.5 rounded text-muted-foreground">
                                    {language}
                                </span>
                            </div>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Cerrar Sesión</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};

export default TopBar;
