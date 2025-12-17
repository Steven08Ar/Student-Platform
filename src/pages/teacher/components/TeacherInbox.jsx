import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Mail, Star, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MOCK_MESSAGES = [
    { id: 1, sender: "Alice Freeman", subject: "Question about biology homework", time: "10:30 AM", unread: true, avatar: "AF" },
    { id: 2, sender: "Principal Skinner", subject: "Staff meeting rescheduled", time: "Yesterday", unread: false, avatar: "PS" },
    { id: 3, sender: "Mark Johnson", subject: "Absence excuse for next week", time: "Yesterday", unread: false, avatar: "MJ" },
    { id: 4, sender: "Sarah Connor", subject: "Project submission delay", time: "Dec 14", unread: true, avatar: "SC" },
];

const TeacherInbox = () => {
    return (
        <Card className="border-none shadow-sm rounded-2xl h-full flex flex-col bg-white overflow-hidden">
            <CardHeader className="border-b border-gray-100 p-4 pb-3">
                <div className="flex justify-between items-center mb-3">
                    <CardTitle className="text-lg font-bold text-[#1A4D3E] flex items-center gap-2">
                        <Mail className="h-5 w-5" /> Inbox
                    </CardTitle>
                    <Button size="sm" className="hidden sm:flex bg-[#1A4D3E] hover:bg-[#143D31] text-white rounded-full px-4 h-8 text-xs">
                        <Plus className="h-3 w-3 mr-1" /> Compose
                    </Button>
                </div>
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
                    <Input
                        placeholder="Search emails..."
                        className="pl-8 h-9 text-xs bg-gray-50 border-none focus-visible:ring-[#1A4D3E]"
                    />
                </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-y-auto">
                <div className="divide-y divide-gray-50">
                    {MOCK_MESSAGES.map((msg) => (
                        <div key={msg.id} className={`p-4 hover:bg-[#F2F6F5] transition-colors cursor-pointer group flex gap-3 items-start ${msg.unread ? 'bg-[#F2F6F5]/50' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${msg.unread ? 'bg-[#1A4D3E]' : 'bg-gray-300'}`}>
                                {msg.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-0.5">
                                    <h4 className={`text-sm truncate pr-2 ${msg.unread ? 'font-bold text-[#0F2922]' : 'text-gray-600'}`}>
                                        {msg.sender}
                                    </h4>
                                    <span className="text-[10px] text-gray-400 whitespace-nowrap">{msg.time}</span>
                                </div>
                                <p className={`text-xs truncate ${msg.unread ? 'text-[#1A4D3E] font-medium' : 'text-gray-400'}`}>
                                    {msg.subject}
                                </p>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <Star className="h-3.5 w-3.5 text-gray-300 hover:text-yellow-400 cursor-pointer" />
                            </div>
                        </div>
                    ))}
                    <div className="p-4 text-center text-xs text-gray-300 hover:text-[#1A4D3E] cursor-pointer transition-colors">
                        View all messages
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default TeacherInbox;
