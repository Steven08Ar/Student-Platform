import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getClassById, createModule, getModulesByCourse, addLesson, getLessonsByModule, createAssignment, notifyClassStudents } from "@/services/classService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, Plus, FolderPlus, FileVideo, LayoutList, GraduationCap } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const ClassDetails = () => {
    const { classId } = useParams();
    const { userData } = useAuth();
    const navigate = useNavigate();

    // Data State
    const [classData, setClassData] = useState(null);
    const [modules, setModules] = useState([]);
    const [lessonsByModule, setLessonsByModule] = useState({});
    const [loading, setLoading] = useState(true);

    // UI State
    const [showAddModule, setShowAddModule] = useState(false);
    const [newModuleTitle, setNewModuleTitle] = useState("");

    // Assignment State
    const [showAddAssignment, setShowAddAssignment] = useState(false);
    const [assignmentTitle, setAssignmentTitle] = useState("");
    const [assignmentDesc, setAssignmentDesc] = useState("");
    const [assignmentDate, setAssignmentDate] = useState("");

    // Lesson Creation State
    const [activeModuleId, setActiveModuleId] = useState(null); // Which module we are adding a lesson to
    const [lessonTitle, setLessonTitle] = useState("");
    const [lessonContent, setLessonContent] = useState("");
    const [lessonVideo, setLessonVideo] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadData();
    }, [classId]);

    const loadData = async () => {
        try {
            const cls = await getClassById(classId);
            if (!cls) { navigate("/"); return; }
            setClassData(cls);

            // Load Modules
            const mods = await getModulesByCourse(classId);
            setModules(mods);

            // Load Lessons for each module
            const lessonsMap = {};
            for (const mod of mods) {
                const ls = await getLessonsByModule(mod.id);
                lessonsMap[mod.id] = ls;
            }
            setLessonsByModule(lessonsMap);

        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    const handleAddModule = async (e) => {
        e.preventDefault();
        if (!newModuleTitle.trim()) return;
        setSubmitting(true);
        try {
            const order = modules.length + 1;
            await createModule(classId, newModuleTitle, order);
            setNewModuleTitle("");
            setShowAddModule(false);
            loadData();
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    }

    const handleAddLesson = async (e) => {
        e.preventDefault();
        if (!activeModuleId) return;
        setSubmitting(true);
        try {
            // Determine order
            const currentLessons = lessonsByModule[activeModuleId] || [];
            const order = currentLessons.length + 1;

            await addLesson(classId, activeModuleId, {
                title: lessonTitle,
                content: lessonContent,
                videoUrl: lessonVideo,
                order,
                resources: [] // Placeholder for now
            });

            // Reset form
            setLessonTitle("");
            setLessonContent("");
            setLessonVideo("");
            setActiveModuleId(null);
            loadData();
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) return <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin" /></div>;

    // STUDENT REDIRECT (This view is now strictly for managing content by teachers, students should see the LMS view)
    // We will fix the routing in a later step so students go to /learn/:classId instead, or handle it here.
    // For now, let's keep it teacher-focused.
    if (userData?.role !== "teacher") {
        return (
            <div className="p-8 text-center">
                <h1 className="text-2xl font-bold">Estudiante</h1>
                <p>Por favor ve a tu Dashboard y haz click en "Ir a clase" para ver la nueva experiencia de aprendizaje.</p>
                <Button onClick={() => navigate("/")} className="mt-4">Volver al Inicio</Button>
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 p-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">{classData?.title}</h1>
                    <p className="text-gray-500">Gestor de Contenido del Curso</p>
                </div>
            </div>

            {/* Actions Bar */}
            <div className="flex gap-4">
                <Button onClick={() => setShowAddModule(true)} className="bg-black text-white hover:bg-gray-800">
                    <FolderPlus className="mr-2 h-4 w-4" />
                    Nuevo Módulo
                </Button>
                <Button onClick={() => setShowAddAssignment(true)} variant="outline" className="border-black text-black hover:bg-gray-50">
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Nueva Tarea/Parcial
                </Button>
            </div>

            {/* Create Assignment Modal/Card */}
            {showAddAssignment && (
                <Card className="border-2 border-blue-100 bg-blue-50/50">
                    <CardHeader>
                        <CardTitle className="text-blue-900">Crear Nueva Tarea o Parcial</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            setSubmitting(true);
                            try {
                                await createAssignment(classId, {
                                    title: assignmentTitle,
                                    description: assignmentDesc,
                                    dueDate: assignmentDate
                                });
                                // Notify Students
                                await notifyClassStudents(classId, `Nueva tarea publicada: ${assignmentTitle}`, "Nueva Actividad");

                                setAssignmentTitle("");
                                setAssignmentDesc("");
                                setAssignmentDate("");
                                setShowAddAssignment(false);
                                alert("Tarea creada y notificada exitosamente.");
                            } catch (err) {
                                console.error(err);
                            } finally {
                                setSubmitting(false);
                            }
                        }} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Título</Label>
                                    <Input value={assignmentTitle} onChange={e => setAssignmentTitle(e.target.value)} required placeholder="Ej. Primer Parcial" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Fecha de Entrega</Label>
                                    <Input type="date" value={assignmentDate} onChange={e => setAssignmentDate(e.target.value)} required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Descripción / Instrucciones</Label>
                                <Textarea value={assignmentDesc} onChange={e => setAssignmentDesc(e.target.value)} required placeholder="Instrucciones del examen..." />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="ghost" onClick={() => setShowAddAssignment(false)}>Cancelar</Button>
                                <Button type="submit" disabled={submitting}>Publicar Tarea</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Modules Container */}
            <div className="space-y-6">
                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <LayoutList className="h-5 w-5 text-gray-500" />
                        Estructura del Curso
                    </h2>
                </div>

                {/* Create Module Form */}
                {showAddModule && (
                    <Card className="border-2 border-black/5 animate-in fade-in slide-in-from-top-2">
                        <CardContent className="pt-6">
                            <form onSubmit={handleAddModule} className="flex gap-4 items-end">
                                <div className="space-y-2 flex-1">
                                    <Label>Título del Módulo</Label>
                                    <Input
                                        value={newModuleTitle}
                                        onChange={e => setNewModuleTitle(e.target.value)}
                                        placeholder="Ej. Introducción a la Programación"
                                        autoFocus
                                    />
                                </div>
                                <Button type="button" variant="ghost" onClick={() => setShowAddModule(false)}>Cancelar</Button>
                                <Button type="submit" disabled={submitting}>Crear Módulo</Button>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Module List */}
                {modules.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-xl">
                        <p className="text-gray-400">No hay módulos creados. Comienza creando el primero.</p>
                    </div>
                ) : (
                    modules.map((module, index) => (
                        <div key={module.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="font-bold text-gray-800">Módulo {index + 1}: {module.title}</h3>
                                <Button size="sm" variant="outline" onClick={() => setActiveModuleId(activeModuleId === module.id ? null : module.id)}>
                                    <Plus className="h-3 w-3 mr-1" />
                                    Agregar Lección
                                </Button>
                            </div>

                            {/* Create Lesson Form (inside module) */}
                            {activeModuleId === module.id && (
                                <div className="p-6 bg-blue-50/30 border-b border-gray-100">
                                    <h4 className="font-semibold text-sm mb-4 text-blue-600">Nueva Lección para: {module.title}</h4>
                                    <form onSubmit={handleAddLesson} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Título de la Lección</Label>
                                                <Input value={lessonTitle} onChange={e => setLessonTitle(e.target.value)} required placeholder="Ej. Instalando VS Code" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>URL del Video (Opcional)</Label>
                                                <Input value={lessonVideo} onChange={e => setLessonVideo(e.target.value)} placeholder="https://youtube.com/..." />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Contenido / Descripción</Label>
                                            <Textarea value={lessonContent} onChange={e => setLessonContent(e.target.value)} required placeholder="Contenido teórico de la clase..." className="min-h-[100px]" />
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <Button type="button" variant="ghost" onClick={() => setActiveModuleId(null)}>Cancelar</Button>
                                            <Button type="submit" disabled={submitting}>Guardar Lección</Button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Lesson List */}
                            <div className="divide-y divide-gray-100">
                                {(lessonsByModule[module.id] || []).length === 0 ? (
                                    <div className="p-6 text-sm text-gray-400 italic">Este módulo no tiene lecciones aún.</div>
                                ) : (
                                    (lessonsByModule[module.id] || []).map((lesson, idx) => (
                                        <div key={lesson.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-mono">
                                                    {idx + 1}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{lesson.title}</p>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        {lesson.videoUrl && <span className="flex items-center gap-1"><FileVideo className="h-3 w-3" /> Video</span>}
                                                        <span>• {lesson.title.length * 2} min (est)</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">Editar</Button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default ClassDetails;
