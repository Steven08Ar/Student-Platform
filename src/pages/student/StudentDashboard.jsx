import { useEffect, useState } from "react";
import { getAllClasses, getLessonsByClass, getStudentEnrollments, getAssignmentsByClass, getUnreadNotifications, getStudentSubmissions } from "@/services/classService";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, ChevronRight, ChevronLeft, Bell, ClipboardList, GraduationCap } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

const StudentDashboard = () => {
    const { userData } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    // Get view from URL, default to 'home' (Inicio)
    const currentView = searchParams.get("view") || "home";

    // State
    const [classes, setClasses] = useState([]);
    const [enrollments, setEnrollments] = useState({}); // { classId: { progress: 50, ... } }
    const [selectedClass, setSelectedClass] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load Classes & Data
    useEffect(() => {
        loadData();
    }, [userData]);

    const loadData = async () => {
        try {
            const data = await getAllClasses();
            setClasses(data);

            if (userData?.uid) {
                // 1. Enrollments
                const enrollmentData = await getStudentEnrollments(userData.uid);
                const enrollMap = {};
                enrollmentData.forEach(e => enrollMap[e.classId] = e);
                setEnrollments(enrollMap);

                // 2. Notifications
                const notifs = await getUnreadNotifications(userData.uid);
                setNotifications(notifs);

                // 2.5 Submissions
                const subs = await getStudentSubmissions(userData.uid);
                setSubmissions(subs);

                // 3. Assignments (from ALL classes - assuming open enrollment or public tasks)
                let allAssignments = [];
                for (const cls of data) {
                    const classAssignments = await getAssignmentsByClass(cls.id);
                    // Add class metadata (title)
                    const enriched = classAssignments.map(a => ({ ...a, classTitle: cls.title, classId: cls.id }));
                    allAssignments = [...allAssignments, ...enriched];
                }
                // Sort by due date if possible, or created
                allAssignments.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
                setAssignments(allAssignments);
            }

            if (data.length > 0) {
                setSelectedClass(data[0]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    // Load Lessons when selected class changes
    useEffect(() => {
        if (selectedClass) {
            loadLessons(selectedClass.id);
        } else {
            setLessons([]);
        }
    }, [selectedClass]);

    const loadClasses = async () => {
        try {
            const data = await getAllClasses();
            setClasses(data);

            if (userData?.uid) {
                const enrollmentData = await getStudentEnrollments(userData.uid);
                const enrollMap = {};
                enrollmentData.forEach(e => enrollMap[e.classId] = e);
                setEnrollments(enrollMap);
            }

            if (data.length > 0) {
                setSelectedClass(data[0]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const loadLessons = async (classId) => {
        try {
            const data = await getLessonsByClass(classId);
            setLessons(data);
        } catch (error) {
            console.error("Failed to load lessons", error);
        }
    }

    // Helper to get initials or color based on ID
    const getCardColor = (cls, index) => {
        if (cls?.color) return cls.color;

        const colors = ["bg-blue-100", "bg-emerald-100", "bg-purple-100", "bg-orange-100"];
        return colors[index % colors.length];
    }

    if (loading) return <div className="flex h-screen items-center justify-center bg-gray-50"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div>;

    const relatedClasses = classes.filter(c => c.id !== selectedClass?.id);

    // Tab Content Components
    const HomeView = () => (
        <div className="space-y-10 animate-in fade-in duration-300">
            {/* Featured Assignment Section */}
            {selectedClass ? (
                <section>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Curso Activo</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{selectedClass.title}</h2>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-2xl mb-6">
                        {selectedClass.description || "Sin descripción disponible para este curso."}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 mb-8">
                        <Button
                            onClick={() => navigate(`/learn/${selectedClass.id}`)}
                            className="bg-black text-white hover:bg-gray-800 rounded-lg h-9 text-xs px-6 shadow-lg shadow-black/10"
                        >
                            Ir a la Clase
                        </Button>

                        <div className="flex items-center gap-4 ml-2 text-xs font-medium text-gray-600">
                            <span className="flex items-center gap-1">
                                <CheckCircle2 className="h-4 w-4 text-gray-400" />
                                {lessons.length} lecciones disponibles
                            </span>
                        </div>
                    </div>
                </section>
            ) : (
                <section className="py-20 text-center text-gray-400">
                    Selecciona un curso para ver los detalles.
                </section>
            )}

            <hr className="border-gray-100" />

            {/* Related Course Section */}
            <section>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-base font-bold text-gray-900">Mis Cursos</h3>
                    <div className="flex gap-2">
                        <button className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"><ChevronLeft className="h-5 w-5 text-gray-400" /></button>
                        <button className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"><ChevronRight className="h-5 w-5 text-gray-600" /></button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {relatedClasses.length === 0 && (
                        <p className="text-gray-500 text-sm col-span-2">No hay otros cursos disponibles.</p>
                    )}

                    {relatedClasses.map((cls, idx) => (
                        <div
                            key={cls.id}
                            onClick={() => setSelectedClass(cls)}
                            className="group bg-white rounded-none border border-transparent hover:border-gray-200 p-2 hover:shadow-sm transition-all cursor-pointer"
                        >
                            <div className={`${getCardColor(cls, idx)} h-40 w-full rounded-lg mb-4 flex items-center justify-center relative overflow-hidden`}>
                                <div className="text-6xl font-black text-black/5 uppercase select-none">
                                    {cls.title.substring(0, 2)}
                                </div>
                            </div>

                            <h4 className="font-bold text-gray-900 text-sm mb-1 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                                {cls.title}
                            </h4>
                            <p className="text-xs text-gray-500 mb-3">{cls.createdBy}</p>

                            <div className="flex flex-col gap-2 mt-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1 text-[10px] text-gray-500 font-medium">
                                        <span>{enrollments[cls.id]?.progress > 0 ? "Continuar" : "Empezar"}</span>
                                    </div>
                                    {enrollments[cls.id] && <span className="text-[10px] font-bold text-gray-500">{enrollments[cls.id].progress}%</span>}
                                </div>
                                {enrollments[cls.id] && (
                                    <Progress value={enrollments[cls.id].progress} className="h-1" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );

    const TasksView = () => (
        <div className="space-y-6 animate-in fade-in duration-300">
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Tareas y Evaluaciones</h2>
                    <p className="text-gray-500">Tus próximas entregas</p>
                </div>
            </header>

            {assignments.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
                    <div className="mx-auto w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                        <ClipboardList className="h-6 w-6 text-blue-500" />
                    </div>
                    <h3 className="text-gray-900 font-medium mb-1">¡Estás al día!</h3>
                    <p className="text-gray-500 text-sm">No tienes tareas pendientes por ahora.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {assignments.map(assign => {
                        // Check if submitted
                        const isSubmitted = submissions.find(s => s.examId === assign.examId);

                        return (
                            <div key={assign.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase">{assign.classTitle}</span>
                                        <span className="text-xs text-gray-500">Vence: {assign.dueDate}</span>
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-900">{assign.title}</h3>
                                    <p className="text-gray-600 text-sm mt-1">{assign.description}</p>
                                </div>
                                <div className="flex items-center">
                                    {assign.type === 'exam' ? (
                                        isSubmitted ? (
                                            <Button size="sm" variant="secondary" disabled className="bg-emerald-100 text-emerald-800 opacity-100">
                                                <CheckCircle2 className="mr-2 h-4 w-4" /> Presentado
                                            </Button>
                                        ) : (
                                            <Button size="sm" className="bg-black text-white hover:bg-gray-800" onClick={() => navigate(`/exam/${assign.examId}?classId=${assign.classId}`)}>
                                                Presentar Examen
                                            </Button>
                                        )
                                    ) : (
                                        <Button size="sm" variant="outline" onClick={() => navigate(`/learn/${assign.classId}`)}>Ir al Curso</Button>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );

    const GradesView = () => {
        // Enriched submissions with assignment details (like titles) if available
        // Note: submissions usually store minimal info. We might need to look up title from assignments list or fetch exam details.
        // Optimization: Use assignments dict to map examId -> Title
        const getTitle = (sub) => {
            const foundAssign = assignments.find(a => a.examId === sub.examId);
            return foundAssign ? foundAssign.title : "Examen (Sin título)";
        }

        return (
            <div className="space-y-6 animate-in fade-in duration-300">
                <header className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Calificaciones</h2>
                </header>

                {submissions.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
                        <div className="mx-auto w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                            <GraduationCap className="h-6 w-6 text-emerald-500" />
                        </div>
                        <h3 className="text-gray-900 font-medium mb-1">Sin Registros</h3>
                        <p className="text-gray-500 text-sm">Aún no se han publicado calificaciones para tus cursos.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-4 font-bold text-gray-700">Actividad / Examen</th>
                                    <th className="px-6 py-4 font-bold text-gray-700">Fecha</th>
                                    <th className="px-6 py-4 font-bold text-gray-700 text-right">Calificación</th>
                                    <th className="px-6 py-4 font-bold text-gray-700 text-center">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {submissions.map(sub => (
                                    <tr key={sub.id} className="hover:bg-gray-50/50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{getTitle(sub)}</td>
                                        <td className="px-6 py-4 text-gray-500">{new Date(sub.gradedAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-right font-bold text-lg">{sub.score}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                                Completado
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F9FAFB] text-slate-800 font-sans relative">
            {/* Notification Bell positioned absolute top right of the dashboard content area */}
            <div className="absolute top-8 right-8 z-10">
                <button className="relative p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
                    <Bell className="h-5 w-5" />
                    {notifications.length > 0 && (
                        <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                    )}
                </button>
            </div>

            <main
                key={currentView}
                className={cn(
                    "grid gap-8 p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500 mt-6",
                    currentView === 'home' ? "grid-cols-1 lg:grid-cols-[1fr_320px]" : "grid-cols-1"
                )}>
                <div className="min-h-[500px]">
                    {(currentView === "home") && <HomeView />}
                    {currentView === "tasks" && <TasksView />}
                    {currentView === "grades" && <GradesView />}
                </div>

                {/* Right Timeline Sidebar - Only show on Home */}
                {currentView === "home" && (
                    <aside className="">
                        <h3 className="font-bold text-sm mb-6 uppercase tracking-wider text-gray-400">Cronograma del Curso</h3>

                        <div className="relative pl-6 border-l border-gray-200 space-y-8 min-h-[300px]">
                            {lessons.length === 0 ? (
                                <div className="text-sm text-gray-400 italic pl-2">No hay lecciones aún.</div>
                            ) : (
                                lessons.map((lesson, idx) => (
                                    <div key={lesson.id} className="relative group cursor-pointer" onClick={() => navigate(`/learn/${selectedClass.id}`)}>
                                        <div className={cn(
                                            "absolute -left-[37px] w-8 h-8 rounded-full border-2 bg-white flex items-center justify-center text-xs font-medium transition-colors z-10",
                                            "border-gray-200 text-gray-400 group-hover:border-black group-hover:text-black"
                                        )}>
                                            {idx + 1}
                                        </div>

                                        <div>
                                            <h4 className="text-xs font-bold mb-1 text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">{lesson.title}</h4>
                                            <p className="text-[10px] text-gray-400 line-clamp-1">Ver contenido</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </aside>
                )}
            </main>
        </div>
    );
}

export default StudentDashboard;
