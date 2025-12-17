import { Search, Bell, MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";

const TopBar = () => {
    const { userData } = useAuth();

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

                {/* Profile Pill - Matches the sidebar logic */}
                <div className="flex items-center gap-3 bg-white pl-1 pr-4 py-1 rounded-full shadow-sm ml-2 cursor-pointer hover:shadow-md transition-shadow">
                    <div className="h-9 w-9 rounded-full bg-[#1A4D3E]/10 overflow-hidden border border-[#1A4D3E]/20">
                        <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userData?.name || 'User'}`}
                            alt="profile"
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div className="hidden md:block text-left">
                        <p className="text-sm font-bold text-gray-800 leading-none">{userData?.name || "User"}</p>
                    </div>
                    {/* Simple Dropdown Arrow could go here */}
                </div>
            </div>
        </div>
    );
};

export default TopBar;
