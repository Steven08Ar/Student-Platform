import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../services/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { MailService } from "../../services/mailService";
import { MessageList } from "./components/MessageList";
import { ComposeModal } from "./components/ComposeModal";
import { Button } from "@/components/ui/button";
import { Mail, Send, Plus, Inbox, MessageSquare, Search, Bell } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

export function MailPage() {
    const { userData } = useAuth();
    const navigate = useNavigate();
    const [view, setView] = useState('inbox'); // 'inbox' | 'sent'
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [isComposeOpen, setIsComposeOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userAvatars, setUserAvatars] = useState({});

    // Retrieve user data for header pill
    // Assuming 'user' context has name and photoURL or we fetch it.
    // If user object structure is simple, we use it directly.

    useEffect(() => {
        // Subscribe to users collection to get real-time avatar updates
        const unsubscribeUsers = onSnapshot(collection(db, "users"), (snapshot) => {
            const avatars = {};
            snapshot.forEach(doc => {
                const data = doc.data();
                avatars[doc.id] = data.avatarUrl;
            });
            setUserAvatars(avatars);
        });

        return () => unsubscribeUsers();
    }, []);

    useEffect(() => {
        if (!userData) return;

        // ... (existing mail subscription logic)
        let unsubscribe;
        setLoading(true);

        // Reset selection when changing views
        setSelectedMessage(null);

        if (view === 'inbox') {
            unsubscribe = MailService.subscribeToInbox(userData.uid, (data) => {
                setMessages(data);
                setLoading(false);
            });
        } else {
            unsubscribe = MailService.subscribeToSent(userData.uid, (data) => {
                setMessages(data);
                setLoading(false);
            });
        }

        return () => unsubscribe && unsubscribe();
    }, [userData, view]);

    const handleSelectMessage = async (message) => {
        setSelectedMessage(message);
        if (view === 'inbox' && !message.read) {
            await MailService.markAsRead(message.id);
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 overflow-hidden">
            {/* Custom Header Area - Replicating TopBar Options */}
            <header className="flex items-center justify-between p-4 bg-white border-b border-gray-100 h-20 shrink-0">
                {/* Left: Title */}
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold text-gray-800 ml-2">Correos</h1>
                </div>

                {/* Right: TopBar Options (Chat + Profile) */}
                <div className="flex items-center gap-4">
                    {/* Chat Button (Resets to Inbox) */}
                    <button
                        onClick={() => setView('inbox')}
                        className="h-10 w-10 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:text-[#1A4D3E] shadow-sm transition-colors hover:bg-gray-50"
                        title="Bandeja de Entrada"
                    >
                        <MessageSquare className="h-5 w-5" />
                    </button>

                    {/* Profile Pill (Navigates to Settings) */}
                    <div
                        onClick={() => navigate('/settings')}
                        className="flex items-center gap-3 bg-white pl-1 pr-4 py-1 rounded-full shadow-sm cursor-pointer hover:shadow-md transition-shadow select-none border border-gray-100"
                        role="button"
                        tabIndex={0}
                    >
                        <div className="h-9 w-9 rounded-full bg-[#1A4D3E]/10 overflow-hidden border border-[#1A4D3E]/20">
                            <img
                                src={userData?.avatarUrl || `https://api.dicebear.com/9.x/avataaars/svg?seed=${userData?.name || 'User'}`}
                                alt="profile"
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="hidden md:block text-left">
                            <p className="text-sm font-bold text-gray-800 leading-none">{userData?.name || "User"}</p>
                            <p className="text-[10px] text-gray-400 leading-none mt-1">Ver Perfil</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Mail Content Layout */}
            <div className="flex flex-1 overflow-hidden m-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                {/* Folders / Sidebar for Mail */}
                <div className="w-16 md:w-64 border-r bg-gray-50/50 flex flex-col gap-2 p-3 shrink-0 transition-all">
                    <Button
                        onClick={() => setIsComposeOpen(true)}
                        className="w-full justify-center md:justify-start gap-2 mb-4 bg-[#1A4D3E] text-white hover:bg-[#143D31] shadow-lg shadow-emerald-900/10 rounded-xl h-12"
                        size="lg"
                    >
                        <Plus className="h-5 w-5" />
                        <span className="hidden md:inline font-bold">Nuevo</span>
                    </Button>

                    <div className="space-y-1">
                        <Button
                            variant={view === 'inbox' ? "secondary" : "ghost"}
                            className={cn("w-full justify-center md:justify-start h-12 md:h-10 rounded-xl", view === 'inbox' && "bg-white shadow text-[#1A4D3E] font-bold")}
                            onClick={() => setView('inbox')}
                        >
                            <Inbox className="md:mr-2 h-5 w-5" />
                            <span className="hidden md:inline">Entrada</span>
                        </Button>
                        <Button
                            variant={view === 'sent' ? "secondary" : "ghost"}
                            className={cn("w-full justify-center md:justify-start h-12 md:h-10 rounded-xl", view === 'sent' && "bg-white shadow text-[#1A4D3E] font-bold")}
                            onClick={() => setView('sent')}
                        >
                            <Send className="md:mr-2 h-5 w-5" />
                            <span className="hidden md:inline">Enviados</span>
                        </Button>
                    </div>
                </div>

                {/* Message List */}
                <div className="w-80 md:w-96 border-r flex flex-col bg-white shrink-0">
                    <div className="p-4 border-b flex justify-between items-center bg-white h-16 sticky top-0 z-10">
                        <h2 className="font-bold text-lg text-gray-800">{view === 'inbox' ? 'Recibidos' : 'Enviados'}</h2>
                        <span className="text-xs font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded-md">{messages.length}</span>
                    </div>
                    {/* Search Bar - Optional enhancement */}
                    <div className="p-3 border-b bg-gray-50/30">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <input className="w-full pl-9 pr-4 py-2 text-sm bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-[#1A4D3E]/20 outline-none" placeholder="Buscar..." />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="p-8 text-center text-muted-foreground flex flex-col items-center gap-2">
                                <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#1A4D3E] border-t-transparent"></div>
                                <span>Cargando...</span>
                            </div>
                        ) : (
                            <MessageList
                                messages={messages}
                                type={view}
                                onSelectMessage={handleSelectMessage}
                                selectedMessageId={selectedMessage?.id}
                                userAvatars={userAvatars}
                                emptyMessage={view === 'inbox' ? "Todo al día 🎉" : "Bandeja vacía"}
                            />
                        )}
                    </div>
                </div>

                {/* Message Detail */}
                <div className="flex-1 flex flex-col bg-gray-50/30 min-w-0">
                    {selectedMessage ? (
                        <>
                            {/* Detail Header */}
                            <div className="border-b px-8 py-6 bg-white shrink-0">
                                <div className="flex justify-between items-start mb-6">
                                    <h1 className="text-2xl font-extrabold leading-tight text-gray-900">{selectedMessage.subject}</h1>
                                    <span className="text-xs font-bold text-gray-400 whitespace-nowrap bg-gray-100 px-3 py-1.5 rounded-full">
                                        {selectedMessage.createdAt?.seconds &&
                                            format(new Date(selectedMessage.createdAt.seconds * 1000), "PPP p", { locale: es })
                                        }
                                    </span>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-white shadow-md bg-gray-100 shrink-0">
                                        <img
                                            src={(view === 'inbox' ? userAvatars[selectedMessage.senderId] : userAvatars[selectedMessage.receiverId]) || (view === 'inbox' ? selectedMessage.senderAvatar : selectedMessage.receiverAvatar) || `https://api.dicebear.com/9.x/avataaars/svg?seed=${view === 'inbox' ? selectedMessage.senderName : selectedMessage.receiverName}`}
                                            alt="Avatar"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-base text-gray-900">
                                            {view === 'inbox' ? selectedMessage.senderName : `Para: ${selectedMessage.receiverName}`}
                                        </span>
                                        <span className="text-xs font-medium text-gray-500">
                                            {view === 'inbox' ? 'remitente@schoolastica.com' : 'destinatario@schoolastica.com'} {/* Mock */}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Detail Content */}
                            <div className="flex-1 px-8 py-8 overflow-y-auto font-sans leading-relaxed text-base text-gray-800 bg-white">
                                <div className="prose max-w-none">
                                    <p className="whitespace-pre-wrap">{selectedMessage.content}</p>
                                </div>
                            </div>

                            {/* Action Bar */}
                            {view === 'inbox' && (
                                <div className="p-6 border-t bg-white flex gap-4">
                                    <Button onClick={() => setIsComposeOpen(true)} className="bg-black text-white hover:bg-gray-800 rounded-xl px-6 gap-2 h-12 shadow-lg">
                                        <Send className="h-4 w-4" /> Responder
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <div className="h-32 w-32 rounded-3xl bg-gray-100 flex items-center justify-center mb-6 rotate-3 shadow-inner">
                                <MessageSquare className="h-12 w-12 text-gray-300" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Selecciona un mensaje</h3>
                            <p className="text-sm max-w-sx text-center px-8">Elige una conversación de la lista para ver los detalles.</p>
                        </div>
                    )}
                </div>
            </div>

            <ComposeModal
                isOpen={isComposeOpen}
                onClose={() => setIsComposeOpen(false)}
                onMessageSent={() => {
                    if (view === 'sent') {
                        setView('sent');
                    }
                }}
            />
        </div>
    );
}
