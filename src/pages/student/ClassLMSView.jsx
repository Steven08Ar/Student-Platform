import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getClassById, getModulesByCourse, getLessonsByModule, getLessonProgress, updateLessonProgress, getAssignmentsByClass } from "@/services/classService";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, CheckCircle, Circle, PlayCircle, FileText, Lock, ClipboardList } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion } from "framer-motion";

const ClassLMSView = () => {
    const { classId } = useParams();
    const { userData } = useAuth();
    const navigate = useNavigate();

    // Data State
    const [classData, setClassData] = useState(null);
    const [modules, setModules] = useState([]);
    const [lessonsMap, setLessonsMap] = useState({}); // { moduleId: [lessons] }
    const [progressMap, setProgressMap] = useState({}); // { lessonId: status }
    const [classAssignments, setClassAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    // View State
    const [activeLesson, setActiveLesson] = useState(null);
    const [activeAssignment, setActiveAssignment] = useState(null);
    const [activeModuleId, setActiveModuleId] = useState(null);
    const [sidebarMode, setSidebarMode] = useState("content"); // 'content' | 'tasks'

    useEffect(() => {
        loadCourseData();
    }, [classId]);

    const loadCourseData = async () => {
        try {
            const cls = await getClassById(classId);
            if (!cls) { navigate("/"); return; }
            setClassData(cls);

            const mods = await getModulesByCourse(classId);
            setModules(mods);

            const lsMap = {};
            let firstLesson = null;
            let firstModId = null;

            for (const mod of mods) {
                const ls = await getLessonsByModule(mod.id);
                lsMap[mod.id] = ls;
                if (!firstLesson && ls.length > 0) {
                    firstLesson = ls[0];
                    firstModId = mod.id;
                }
            }
            setLessonsMap(lsMap);

            if (userData?.uid) {
                const prog = await getLessonProgress(userData.uid, classId);
                setProgressMap(prog);
            }

            const assigns = await getAssignmentsByClass(classId);
            setClassAssignments(assigns);

            if (firstLesson) {
                setActiveLesson(firstLesson);
                setActiveModuleId(firstModId);
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const handleLessonSelect = (lesson, moduleId) => {
        setActiveLesson(lesson);
        setActiveAssignment(null);
        setActiveModuleId(moduleId);
    }

    const handleAssignmentSelect = (assignment) => {
        setActiveAssignment(assignment);
        setActiveLesson(null);
        setActiveModuleId(null);
        setSidebarMode("tasks");
    }

    const handleMarkComplete = async () => {
        if (!activeLesson || !userData) return;

        const newStatus = "completed";
        const newProgressMap = { ...progressMap, [activeLesson.id]: newStatus };
        setProgressMap(newProgressMap);

        try {
            await updateLessonProgress(userData.uid, classId, activeLesson.id, newStatus);
        } catch (error) {
            console.error("Failed to update progress", error);
        }
    }

    const calculateTotalProgress = () => {
        let total = 0;
        let completed = 0;
        Object.values(lessonsMap).flat().forEach(l => {
            total++;
            if (progressMap[l.id] === 'completed') completed++;
        });
        return total === 0 ? 0 : Math.round((completed / total) * 100);
    }

    if (loading) return <div className="flex h-screen items-center justify-center bg-gray-50"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div>;

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
            {/* Sidebar (Modules & Lessons) */}
            <aside className="w-80 bg-white border-r border-gray-200 flex flex-col h-full shrink-0">
                <div className="p-4 border-b border-gray-100">
                    <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="mb-2 -ml-2 text-gray-500">
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Volver al Dashboard
                    </Button>
                    <h2 className="font-bold text-lg leading-tight mb-2 truncate" title={classData?.title}>
                        {classData?.title}
                    </h2>
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs font-medium text-gray-500">
                            <span>Progreso del Curso</span>
                            <span>{calculateTotalProgress()}%</span>
                        </div>
                        <Progress value={calculateTotalProgress()} className="h-2" />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Toggle Content/Tasks */}
                    <div className="flex gap-1 p-1 bg-gray-100 rounded-lg mb-4">
                        <button
                            onClick={() => setSidebarMode("content")}
                            className={cn("flex-1 text-xs font-bold py-1.5 rounded-md transition-all", sidebarMode === "content" ? "bg-white shadow text-black" : "text-gray-500 hover:text-gray-900")}
                        >
                            Contenido
                        </button>
                        <button
                            onClick={() => setSidebarMode("tasks")}
                            className={cn("flex-1 text-xs font-bold py-1.5 rounded-md transition-all", sidebarMode === "tasks" ? "bg-white shadow text-black" : "text-gray-500 hover:text-gray-900")}
                        >
                            Tareas ({classAssignments.length})
                        </button>
                    </div>

                    {sidebarMode === "content" ? (
                        modules.map((module, idx) => (
                            <div key={module.id} className="space-y-2">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-2">
                                    Módulo {idx + 1}: {module.title}
                                </h3>
                                <div className="space-y-1">
                                    {(lessonsMap[module.id] || []).map((lesson, lIdx) => {
                                        const isCompleted = progressMap[lesson.id] === 'completed';
                                        const isActive = activeLesson?.id === lesson.id;

                                        return (
                                            <button
                                                key={lesson.id}
                                                onClick={() => handleLessonSelect(lesson, module.id)}
                                                className={cn(
                                                    "w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors text-sm",
                                                    isActive ? "bg-black text-white" : "hover:bg-gray-100 text-gray-700",
                                                    isCompleted && !isActive && "text-gray-500"
                                                )}
                                            >
                                                {isCompleted ? (
                                                    <CheckCircle className={cn("h-4 w-4 shrink-0", isActive ? "text-white" : "text-emerald-500")} />
                                                ) : (
                                                    <Circle className={cn("h-4 w-4 shrink-0", isActive ? "text-white/50" : "text-gray-300")} />
                                                )}

                                                <div className="flex-1 line-clamp-2">
                                                    {lesson.title}
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="space-y-3">
                            {classAssignments.length === 0 ? (
                                <p className="text-sm text-gray-400 text-center py-4">No hay tareas asignadas.</p>
                            ) : (
                                classAssignments.map(assign => {
                                    const isActive = activeAssignment?.id === assign.id;
                                    return (
                                        <button
                                            key={assign.id}
                                            onClick={() => assign.type === 'exam' ? navigate(`/exam/${assign.examId}?classId=${classId}`) : handleAssignmentSelect(assign)}
                                            className={cn(
                                                "w-full bg-white border rounded-lg p-3 space-y-2 shadow-sm text-left transition-all",
                                                isActive ? "ring-2 ring-black border-transparent" : "hover:border-gray-300"
                                            )}
                                        >
                                            <div className="flex items-start justify-between">
                                                <h4 className="text-sm font-bold text-gray-900">{assign.title}</h4>
                                                {assign.type === 'exam' && <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-1.5 py-0.5 rounded">Examen</span>}
                                            </div>
                                            <p className="text-xs text-gray-500 line-clamp-2">{assign.description}</p>
                                            <p className="text-[10px] text-gray-400">Vence: {assign.dueDate}</p>

                                            {assign.type === 'exam' ? (
                                                <div className="mt-2 w-full text-center py-1 bg-black text-white text-xs rounded">
                                                    Presentar Examen
                                                </div>
                                            ) : (
                                                <div className={cn("text-[10px] italic text-center border-t pt-1 mt-2", isActive ? "text-blue-600 font-medium" : "text-gray-400")}>
                                                    {isActive ? "Viendo Detalles" : "Ver Tarea"}
                                                </div>
                                            )}
                                        </button>
                                    )
                                })
                            )}
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto flex flex-col">
                {activeLesson ? (
                    <div className="max-w-4xl mx-auto w-full p-8 md:p-12 space-y-8">
                        {/* Video Section */}
                        {activeLesson.videoUrl && (
                            <div className="rounded-xl overflow-hidden shadow-2xl bg-black aspect-video relative">
                                <iframe
                                    className="w-full h-full"
                                    src={activeLesson.videoUrl.replace("watch?v=", "embed/")}
                                    title={activeLesson.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        )}

                        {/* Header */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-4">{activeLesson.title}</h1>
                            <div className="prose prose-slate max-w-none text-gray-700 leading-relaxed font-sans">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        h1: ({ node, ...props }) => (
                                            <motion.h1
                                                initial={{ opacity: 0, y: -20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-4xl font-extrabold mt-10 mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
                                                {...props}
                                            />
                                        ),
                                        h2: ({ node, ...props }) => (
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                className="flex items-center gap-3 mt-10 mb-4 pb-2 border-b border-gray-200"
                                            >
                                                <div className="h-8 w-1 bg-[#1A4D3E] rounded-full"></div>
                                                <h2 className="text-2xl font-bold text-gray-800" {...props} />
                                            </motion.div>
                                        ),
                                        h3: ({ node, ...props }) => (
                                            <h3 className="text-xl font-bold mt-6 mb-3 text-[#1A4D3E]" {...props} />
                                        ),
                                        p: ({ node, ...props }) => (
                                            <motion.p
                                                initial={{ opacity: 0 }}
                                                whileInView={{ opacity: 1 }}
                                                viewport={{ once: true }}
                                                className="text-lg text-gray-700 leading-relaxed mb-4"
                                                {...props}
                                            />
                                        ),
                                        ul: ({ node, ...props }) => <ul className="space-y-2 mt-4 mb-6" {...props} />,
                                        ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mt-4 mb-6 space-y-2" {...props} />,
                                        li: ({ node, ...props }) => (
                                            <motion.li
                                                initial={{ opacity: 0, x: 10 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                className="flex items-start gap-2"
                                            >
                                                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#1A4D3E] shrink-0" />
                                                <span className="text-gray-700">{props.children}</span>
                                            </motion.li>
                                        ),
                                        table: ({ node, ...props }) => (
                                            <div className="overflow-x-auto my-8 rounded-xl border border-gray-200 shadow-sm">
                                                <table className="w-full text-left border-collapse" {...props} />
                                            </div>
                                        ),
                                        thead: ({ node, ...props }) => <thead className="bg-[#E8F5E9]" {...props} />,
                                        th: ({ node, ...props }) => <th className="p-4 font-bold text-[#1A4D3E] border-b border-gray-200" {...props} />,
                                        td: ({ node, ...props }) => <td className="p-4 border-b border-gray-100 text-gray-600" {...props} />,
                                        code: ({ node, inline, className, children, ...props }) => {
                                            const match = /language-(\w+)/.exec(className || '')
                                            return !inline && match ? (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    whileInView={{ opacity: 1, scale: 1 }}
                                                    viewport={{ once: true }}
                                                    className="rounded-xl overflow-hidden my-6 shadow-2xl border border-gray-800"
                                                >
                                                    <div className="bg-[#1e1e1e] px-4 py-2 flex items-center justify-between border-b border-gray-700">
                                                        <div className="flex gap-1.5">
                                                            <div className="w-3 h-3 rounded-full bg-red-500" />
                                                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                                            <div className="w-3 h-3 rounded-full bg-green-500" />
                                                        </div>
                                                        <span className="text-xs text-gray-400 font-mono font-bold uppercase tracking-wider">{match[1]}</span>
                                                    </div>
                                                    <SyntaxHighlighter
                                                        {...props}
                                                        children={String(children).replace(/\n$/, '')}
                                                        style={vscDarkPlus}
                                                        language={match[1]}
                                                        PreTag="div"
                                                        customStyle={{ margin: 0, borderRadius: 0, padding: '1.5rem', fontSize: '14px' }}
                                                    />
                                                </motion.div>
                                            ) : (
                                                <code className="bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded font-mono text-sm font-bold border border-orange-100" {...props}>
                                                    {children}
                                                </code>
                                            )
                                        },
                                        blockquote: ({ node, ...props }) => (
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                className="my-6 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl shadow-sm relative overflow-hidden"
                                            >
                                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                                    <FileText className="h-16 w-16 text-blue-500" />
                                                </div>
                                                <div className="relative z-10 text-blue-900 font-medium italic">
                                                    {props.children}
                                                </div>
                                            </motion.div>
                                        ),
                                    }}
                                >
                                    {activeLesson.content}
                                </ReactMarkdown>
                            </div>
                        </div>

                        {/* Action Footer */}
                        <div className="border-t border-gray-200 pt-8 flex justify-between items-center sticky bottom-0 bg-gray-50/90 backdrop-blur pb-4">
                            {/* Navigation Buttons */}
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        const allLessons = Object.values(lessonsMap).flat();
                                        const idx = allLessons.findIndex(l => l.id === activeLesson.id);
                                        if (idx > 0) handleLessonSelect(allLessons[idx - 1], allLessons[idx - 1].moduleId);
                                    }}
                                    disabled={Object.values(lessonsMap).flat().findIndex(l => l.id === activeLesson.id) === 0}
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" /> Anterior
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        const allLessons = Object.values(lessonsMap).flat();
                                        const idx = allLessons.findIndex(l => l.id === activeLesson.id);
                                        if (idx < allLessons.length - 1) handleLessonSelect(allLessons[idx + 1], allLessons[idx + 1].moduleId);
                                    }}
                                    disabled={Object.values(lessonsMap).flat().findIndex(l => l.id === activeLesson.id) === Object.values(lessonsMap).flat().length - 1}
                                >
                                    Siguiente <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                                </Button>
                            </div>

                            {progressMap[activeLesson.id] === 'completed' ? (
                                <Button disabled variant="outline" className="border-emerald-500 text-emerald-600 bg-emerald-50">
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Completado
                                </Button>
                            ) : (
                                <Button onClick={handleMarkComplete} size="lg" className="px-8">
                                    Marcar como Visto
                                    <CheckCircle className="ml-2 h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                ) : activeAssignment ? (
                    <div className="max-w-3xl mx-auto w-full p-8 md:p-12">
                        <div className="mb-6">
                            <Button variant="ghost" onClick={() => setActiveAssignment(null)} className="pl-0 text-gray-500 mb-4 hover:text-black">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Volver
                            </Button>
                            <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full mb-4">
                                Tarea / Proyecto
                            </span>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">{activeAssignment.title}</h1>
                            <p className="text-gray-500">Vence el: {activeAssignment.dueDate}</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
                            <h3 className="font-bold text-lg mb-4 text-gray-800">Instrucciones</h3>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{activeAssignment.description}</p>
                        </div>

                        <div className="bg-gray-50 rounded-xl border border-dashed border-gray-300 p-8 text-center space-y-4">
                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                <ClipboardList className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Tu Entrega</h3>
                                <p className="text-xs text-gray-500">Sube tu archivo o enlace aquí</p>
                            </div>
                            <Button className="w-full max-w-xs">
                                Subir Archivo
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <PlayCircle className="h-16 w-16 mb-4 opacity-20" />
                        <p>Selecciona una lección para comenzar</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ClassLMSView;
