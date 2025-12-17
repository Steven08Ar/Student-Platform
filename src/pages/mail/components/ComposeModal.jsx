import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MailService } from "../../../services/mailService";
import { useAuth } from "../../../contexts/AuthContext";
import { Loader2 } from "lucide-react";

export function ComposeModal({ isOpen, onClose, onMessageSent }) {
    const { user, userData } = useAuth();
    const [recipients, setRecipients] = useState([]);
    const [loadingRecipients, setLoadingRecipients] = useState(false);

    // Form state
    const [selectedRecipientId, setSelectedRecipientId] = useState("");
    const [subject, setSubject] = useState("");
    const [content, setContent] = useState("");
    const [sending, setSending] = useState(false);

    useEffect(() => {
        if (isOpen && userData?.role) {
            loadRecipients();
        }
    }, [isOpen, userData]);

    const loadRecipients = async () => {
        setLoadingRecipients(true);
        try {
            const list = await MailService.getRecipients(userData.role);
            setRecipients(list);
        } catch (error) {
            console.error("Failed to load recipients", error);
        } finally {
            setLoadingRecipients(false);
        }
    };

    const handleSend = async () => {
        if (!selectedRecipientId || !subject || !content) return;

        setSending(true);
        try {
            const recipient = recipients.find(r => r.id === selectedRecipientId);
            await MailService.sendMessage(
                user.uid,
                selectedRecipientId,
                subject,
                content,
                userData.name || user.email,
                recipient?.name || recipient?.email || "Unknown"
            );
            onMessageSent?.();
            onClose();
            // Reset form
            setSelectedRecipientId("");
            setSubject("");
            setContent("");
        } catch (error) {
            console.error("Failed to send message", error);
        } finally {
            setSending(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Nuevo Mensaje</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="recipient" className="text-right">
                            Para:
                        </Label>
                        <div className="col-span-3">
                            <Select onValueChange={setSelectedRecipientId} value={selectedRecipientId}>
                                <SelectTrigger>
                                    <SelectValue placeholder={loadingRecipients ? "Cargando..." : "Seleccionar destinatario"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {recipients.map((recipient) => (
                                        <SelectItem key={recipient.id} value={recipient.id}>
                                            {recipient.name} ({recipient.email})
                                        </SelectItem>
                                    ))}
                                    {recipients.length === 0 && !loadingRecipients && (
                                        <div className="p-2 text-sm text-muted-foreground text-center">
                                            No hay destinatarios disponibles
                                        </div>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="subject" className="text-right">
                            Asunto:
                        </Label>
                        <Input
                            id="subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="col-span-3"
                            placeholder="Escribe el asunto..."
                        />
                    </div>

                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="message" className="text-right mt-2">
                            Mensaje:
                        </Label>
                        <Textarea
                            id="message"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="col-span-3 min-h-[200px]"
                            placeholder="Escribe tu mensaje aquí..."
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={sending}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSend} disabled={!selectedRecipientId || !subject || !content || sending}>
                        {sending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Enviar Mensaje
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
