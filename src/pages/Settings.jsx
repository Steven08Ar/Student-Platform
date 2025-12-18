import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save, RefreshCw } from "lucide-react";

export default function Settings() {
    const { user, userData, updateProfileImage } = useAuth();
    const [saving, setSaving] = useState(false);

    // State to hold the current avatar URL (start with current user's or generate one)
    const [currentAvatarUrl, setCurrentAvatarUrl] = useState(
        userData?.avatarUrl || `https://api.dicebear.com/9.x/avataaars/svg?seed=${user?.uid || 'user'}`
    );

    const handleRandomize = () => {
        const randomSeed = Math.random().toString(36).substring(7);
        const newUrl = `https://api.dicebear.com/9.x/avataaars/svg?seed=${randomSeed}`;
        setCurrentAvatarUrl(newUrl);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateProfileImage(currentAvatarUrl);
        } catch (error) {
            console.error("Failed to save avatar", error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex-1 p-8 overflow-y-auto h-screen pb-20">
            <h1 className="text-3xl font-bold mb-8 text-[#1A4D3E]">Configuración</h1>

            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Perfil de Usuario</CardTitle>
                        <CardDescription>Administra tu apariencia.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-8 py-8">

                        {/* Avatar Preview */}
                        <div className="relative group">
                            <div className="h-48 w-48 rounded-full overflow-hidden border-8 border-white shadow-xl bg-gray-100">
                                <img
                                    src={currentAvatarUrl}
                                    alt="Avatar Preview"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                            <Button
                                variant="outline"
                                onClick={handleRandomize}
                                className="flex-1 h-12 text-lg"
                            >
                                <RefreshCw className="mr-2 h-5 w-5" />
                                Generar Aleatorio
                            </Button>

                            <Button
                                onClick={handleSave}
                                className="flex-1 h-12 text-lg bg-[#1A4D3E] hover:bg-[#153e32]"
                                disabled={saving}
                            >
                                {saving ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                                Guardar Avatar
                            </Button>
                        </div>

                        <div className="w-full pt-6 border-t mt-4">
                            <Label className="text-base text-gray-500 mb-2 block">Información Personal</Label>
                            <div className="grid gap-4">
                                <div>
                                    <Label htmlFor="name" className="mb-1 block">Nombre Completo</Label>
                                    <Input id="name" value={userData?.name || ""} disabled className="bg-gray-50" />
                                </div>
                                <div>
                                    <Label htmlFor="email" className="mb-1 block">Correo Electrónico</Label>
                                    <Input id="email" value={userData?.email || user?.email || ""} disabled className="bg-gray-50" />
                                </div>
                                <p className="text-xs text-muted-foreground text-center mt-2">
                                    Contacta al administrador para modificar tus datos personales.
                                </p>
                            </div>
                        </div>

                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
