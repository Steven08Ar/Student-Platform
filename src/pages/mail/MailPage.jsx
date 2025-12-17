import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { MailService } from "../../services/mailService";
import { MessageList } from "./components/MessageList";
import { ComposeModal } from "./components/ComposeModal";
import { Button } from "@/components/ui/button";
import { Mail, Send, Plus, Inbox } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

export function MailPage() {
    const { user } = useAuth();
    const [view, setView] = useState('inbox'); // 'inbox' | 'sent'
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [isComposeOpen, setIsComposeOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        let unsubscribe;
        setLoading(true);

        // Reset selection when changing views
        setSelectedMessage(null);

        if (view === 'inbox') {
            unsubscribe = MailService.subscribeToInbox(user.uid, (data) => {
                setMessages(data);
                setLoading(false);
            });
        } else {
            unsubscribe = MailService.subscribeToSent(user.uid, (data) => {
                setMessages(data);
                setLoading(false);
            });
        }

        return () => unsubscribe && unsubscribe();
    }, [user, view]);

    const handleSelectMessage = async (message) => {
        setSelectedMessage(message);
        if (view === 'inbox' && !message.read) {
            await MailService.markAsRead(message.id);
        }
    };

    return (
        <div className="flex h-[calc(100vh-8rem)] bg-background rounded-lg border shadow-sm overflow-hidden">
            {/* Folders / Sidebar for Mail */}
            <div className="w-64 border-r bg-muted/30 flex flex-col gap-2 p-3">
                <Button
                    onClick={() => setIsComposeOpen(true)}
                    className="w-full justify-start gap-2 mb-4 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
                    size="lg"
                >
                    <Plus className="h-5 w-5" />
                    <span className="font-semibold">Redactar</span>
                </Button>

                <div className="space-y-1">
                    <Button
                        variant={view === 'inbox' ? "secondary" : "ghost"}
                        className={cn("w-full justify-start", view === 'inbox' && "bg-white shadow-sm")}
                        onClick={() => setView('inbox')}
                    >
                        <Inbox className="mr-2 h-4 w-4" />
                        Bandeja de Entrada
                    </Button>
                    <Button
                        variant={view === 'sent' ? "secondary" : "ghost"}
                        className={cn("w-full justify-start", view === 'sent' && "bg-white shadow-sm")}
                        onClick={() => setView('sent')}
                    >
                        <Send className="mr-2 h-4 w-4" />
                        Enviados
                    </Button>
                </div>
            </div>

            {/* Message List */}
            <div className="w-96 border-r flex flex-col bg-background">
                <div className="p-4 border-b flex justify-between items-center bg-muted/10">
                    <h2 className="font-semibold text-lg">{view === 'inbox' ? 'Bandeja de Entrada' : 'Enviados'}</h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="p-8 text-center text-muted-foreground flex flex-col items-center gap-2">
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                            <span>Cargando...</span>
                        </div>
                    ) : (
                        <MessageList
                            messages={messages}
                            type={view}
                            onSelectMessage={handleSelectMessage}
                            selectedMessageId={selectedMessage?.id}
                            emptyMessage={view === 'inbox' ? "No tienes mensajes nuevos" : "No has enviado mensajes"}
                        />
                    )}
                </div>
            </div>

            {/* Message Detail */}
            <div className="flex-1 flex flex-col bg-background/50">
                {selectedMessage ? (
                    <>
                        <div className="border-b p-6 bg-background">
                            <div className="flex justify-between items-start mb-4">
                                <h1 className="text-2xl font-bold leading-tight">{selectedMessage.subject}</h1>
                                <span className="text-xs text-muted-foreground whitespace-nowrap bg-muted px-2 py-1 rounded">
                                    {selectedMessage.createdAt?.seconds &&
                                        format(new Date(selectedMessage.createdAt.seconds * 1000), "PPP p", { locale: es })
                                    }
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                    {(view === 'inbox' ? selectedMessage.senderName : selectedMessage.receiverName)?.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-sm">
                                        {view === 'inbox' ? selectedMessage.senderName : `Para: ${selectedMessage.receiverName}`}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {view === 'inbox' ? 'remitente@schoolastica.com' : 'destinatario@schoolastica.com'} {/* Mock email if not available */}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 p-8 overflow-y-auto font-sans leading-relaxed text-base">
                            <div className="prose dark:prose-invert max-w-none">
                                <p className="whitespace-pre-wrap">{selectedMessage.content}</p>
                            </div>
                        </div>
                        {view === 'inbox' && (
                            <div className="p-4 border-t bg-muted/10">
                                <Button variant="outline" onClick={() => setIsComposeOpen(true)} className="gap-2">
                                    <Send className="h-4 w-4" /> Responder
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground/50">
                        <div className="h-24 w-24 rounded-full bg-muted/20 flex items-center justify-center mb-6">
                            <Mail className="h-10 w-10" />
                        </div>
                        <p className="text-xl font-medium">Selecciona un mensaje para leerlo</p>
                    </div>
                )}
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
