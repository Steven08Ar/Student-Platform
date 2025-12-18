import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Mail, User, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function MessageList({ messages, type, onSelectMessage, selectedMessageId, emptyMessage, userAvatars }) {
    if (messages.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
                <Mail className="h-12 w-12 mb-4 opacity-20" />
                <p>{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2 p-4">
            {messages.map((message) => {
                const isUnread = !message.read && type === 'inbox';
                const isSelected = selectedMessageId === message.id;

                // Determine which ID to look up (sender for inbox, receiver for sent)
                const targetUserId = type === 'inbox' ? message.senderId : message.receiverId;
                const currentAvatar = userAvatars?.[targetUserId];
                const savedAvatar = type === 'inbox' ? message.senderAvatar : message.receiverAvatar;
                const fallbackSeed = type === 'inbox' ? message.senderName : message.receiverName;

                return (
                    <div
                        key={message.id}
                        onClick={() => onSelectMessage(message)}
                        className={cn(
                            "flex flex-col gap-2 p-4 rounded-lg border cursor-pointer transition-all hover:bg-accent/50",
                            isUnread ? "bg-accent/10 border-blue-200 dark:border-blue-900" : "bg-card",
                            isSelected ? "border-primary ring-1 ring-primary" : "border-border"
                        )}
                    >
                        <div className="flex justify-between items-start gap-2">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="h-8 w-8 rounded-full overflow-hidden border bg-gray-100 shrink-0">
                                    <img
                                        src={currentAvatar || savedAvatar || `https://api.dicebear.com/9.x/avataaars/svg?seed=${fallbackSeed}`}
                                        alt="Avatar"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <span className={cn("text-sm truncate", isUnread ? "font-bold text-foreground" : "text-muted-foreground")}>
                                    {type === 'inbox' ? message.senderName : `Para: ${message.receiverName}`}
                                </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                                <Clock className="h-3 w-3" />
                                {message.createdAt?.seconds ? (
                                    format(new Date(message.createdAt.seconds * 1000), "d MMM, HH:mm", { locale: es })
                                ) : (
                                    "Enviando..."
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {isUnread && <div className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />}
                            <h4 className={cn("text-base truncate", isUnread ? "font-bold" : "font-medium")}>
                                {message.subject}
                            </h4>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {message.content}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}
