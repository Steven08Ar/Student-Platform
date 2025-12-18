import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2, Save, RefreshCw, Bell, Lock, Paintbrush, User, Globe, Moon, Sun, Shield } from "lucide-react";

export default function Settings() {
    const { user, userData, updateProfileImage } = useAuth();
    const [saving, setSaving] = useState(false);

    // --- Profile State ---
    const [currentAvatarUrl, setCurrentAvatarUrl] = useState(
        userData?.avatarUrl || `https://api.dicebear.com/9.x/avataaars/svg?seed=${user?.uid || 'user'}`
    );

    // --- Appearance State (Synced with global dark mode if possible, but local for now) ---
    const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));

    // --- Notifications State (Mock) ---
    const [emailNotifs, setEmailNotifs] = useState(true);
    const [pushNotifs, setPushNotifs] = useState(true);
    const [soundEnabled, setSoundEnabled] = useState(true);

    // --- Privacy State (Mock) ---
    const [publicProfile, setPublicProfile] = useState(false);
    const [activityStatus, setActivityStatus] = useState(true);

    // Sync dark mode toggle
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    const handleRandomize = () => {
        const randomSeed = Math.random().toString(36).substring(7);
        const newUrl = `https://api.dicebear.com/9.x/avataaars/svg?seed=${randomSeed}`;
        setCurrentAvatarUrl(newUrl);
    };

    const handleSaveProfile = async () => {
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

            <div className="max-w-4xl mx-auto">
                <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 mb-8 bg-gray-100/50 dark:bg-gray-800/50 p-1">
                        <TabsTrigger value="profile" className="gap-2">
                            <User className="h-4 w-4" /> Perfil
                        </TabsTrigger>
                        <TabsTrigger value="notifications" className="gap-2">
                            <Bell className="h-4 w-4" /> Notificaciones
                        </TabsTrigger>
                        <TabsTrigger value="privacy" className="gap-2">
                            <Shield className="h-4 w-4" /> Privacidad
                        </TabsTrigger>
                        <TabsTrigger value="appearance" className="gap-2">
                            <Paintbrush className="h-4 w-4" /> Apariencia
                        </TabsTrigger>
                    </TabsList>

                    {/* --- TAB: PROFILE --- */}
                    <TabsContent value="profile">
                        <Card>
                            <CardHeader>
                                <CardTitle>Perfil de Usuario</CardTitle>
                                <CardDescription>Administra tu información personal y tu avatar.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                <div className="flex flex-col md:flex-row items-center gap-8">
                                    {/* Avatar Section */}
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="relative group">
                                            <div className="h-40 w-40 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100">
                                                <img
                                                    src={currentAvatarUrl}
                                                    alt="Avatar Preview"
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-2 w-full">
                                            <Button variant="outline" size="sm" onClick={handleRandomize} className="flex-1">
                                                <RefreshCw className="mr-2 h-3 w-3" /> Aleatorio
                                            </Button>
                                            <Button size="sm" onClick={handleSaveProfile} disabled={saving} className="flex-1 bg-[#1A4D3E]">
                                                {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="mr-2 h-3 w-3" />} Guardar
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Info Section */}
                                    <div className="flex-1 w-full space-y-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="name">Nombre Completo</Label>
                                            <Input id="name" value={userData?.name || ""} disabled className="bg-gray-50" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="email">Correo Electrónico</Label>
                                            <Input id="email" value={userData?.email || user?.email || ""} disabled className="bg-gray-50" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Rol</Label>
                                            <div className="px-3 py-2 rounded-md bg-gray-50 border text-sm text-gray-500 capitalize">
                                                {userData?.role || "Estudiante"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* --- TAB: NOTIFICATIONS --- */}
                    <TabsContent value="notifications">
                        <Card>
                            <CardHeader>
                                <CardTitle>Preferencias de Notificación</CardTitle>
                                <CardDescription>Elige cómo quieres que te contactemos.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between space-x-2">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Correos Electrónicos</Label>
                                        <p className="text-sm text-muted-foreground">Recibe correos sobre actualizaciones de tus clases.</p>
                                    </div>
                                    <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
                                </div>
                                <div className="flex items-center justify-between space-x-2">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Notificaciones Push</Label>
                                        <p className="text-sm text-muted-foreground">Recibe alertas en tu navegador.</p>
                                    </div>
                                    <Switch checked={pushNotifs} onCheckedChange={setPushNotifs} />
                                </div>
                                <div className="flex items-center justify-between space-x-2">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Sonidos</Label>
                                        <p className="text-sm text-muted-foreground">Reproducir sonido al recibir mensajes.</p>
                                    </div>
                                    <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* --- TAB: PRIVACY --- */}
                    <TabsContent value="privacy">
                        <Card>
                            <CardHeader>
                                <CardTitle>Privacidad y Seguridad</CardTitle>
                                <CardDescription>Administra la visibilidad de tu cuenta.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between space-x-2">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Perfil Público</Label>
                                        <p className="text-sm text-muted-foreground">Permitir que otros usuarios fuera de tus clases vean tu perfil basic.</p>
                                    </div>
                                    <Switch checked={publicProfile} onCheckedChange={setPublicProfile} />
                                </div>
                                <div className="flex items-center justify-between space-x-2">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Estado de Actividad</Label>
                                        <p className="text-sm text-muted-foreground">Mostrar cuándo estás en línea.</p>
                                    </div>
                                    <Switch checked={activityStatus} onCheckedChange={setActivityStatus} />
                                </div>
                                <div className="pt-4 border-t">
                                    <Label className="mb-4 block">Seguridad</Label>
                                    <Button variant="outline" className="w-full sm:w-auto">
                                        <Lock className="mr-2 h-4 w-4" /> Cambiar Contraseña
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* --- TAB: APPEARANCE --- */}
                    <TabsContent value="appearance">
                        <Card>
                            <CardHeader>
                                <CardTitle>Apariencia</CardTitle>
                                <CardDescription>Personaliza cómo se ve la aplicación.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between space-x-2">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Modo Oscuro</Label>
                                        <p className="text-sm text-muted-foreground">Cambia entre tema claro y oscuro.</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {isDarkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                                        <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between space-x-2">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Idioma</Label>
                                        <p className="text-sm text-muted-foreground">Selecciona el idioma de la interfaz.</p>
                                    </div>
                                    <div className="flex items-center gap-2 border rounded-md p-1 px-3 bg-background">
                                        <Globe className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm font-medium">Español (ES)</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
