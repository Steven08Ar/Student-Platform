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
    // Get view from URL, default to 'home' (Dashboard)
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
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header */}
            <section>
                <h2 className="text-xl font-bold text-[#1A4D3E] mb-2">Mis Cursos</h2>
                <p className="text-gray-600 text-sm">
                    {classes.length === 0 ? "No estás inscrito en ningún curso aún." : `Tienes ${classes.length} curso${classes.length !== 1 ? 's' : ''} disponible${classes.length !== 1 ? 's' : ''}`}
                </p>
            </section>

            {/* Classes Grid */}
            {classes.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
                    <div className="mx-auto w-16 h-16 bg-[#E8F5E9] rounded-full flex items-center justify-center mb-4">
                        <GraduationCap className="h-8 w-8 text-[#1A4D3E]" />
                    </div>
                    <h3 className="text-gray-900 font-bold text-lg mb-2">No hay cursos disponibles</h3>
                    <p className="text-gray-500 text-sm">Contacta a tu profesor para inscribirte en un curso.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classes.map((cls, idx) => {
                        const enrollment = enrollments[cls.id];
                        const progress = enrollment?.progress || 0;

                        return (
                            <div
                                key={cls.id}
                                onClick={() => navigate(`/learn/${cls.id}`)}
                                className="group bg-white rounded-xl border-2 border-gray-100 hover:border-[#1A4D3E] p-6 hover:shadow-xl transition-all cursor-pointer"
                            >
                                {/* Class Icon/Banner */}
                                <div className={`${getCardColor(cls, idx)} h-32 w-full rounded-lg mb-4 flex items-center justify-center relative overflow-hidden`}>
                                    <div className="text-5xl font-black text-white/20 uppercase select-none">
                                        {cls.title.substring(0, 2)}
                                    </div>
                                </div>

                                {/* Class Info */}
                                <h3 className="font-bold text-gray-900 text-lg mb-2 leading-tight group-hover:text-[#1A4D3E] transition-colors line-clamp-2">
                                    {cls.title}
                                </h3>
                                <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                                    {cls.description || "Sin descripción disponible"}
                                </p>

                                {/* Progress Section */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-600 font-medium">
                                            {progress > 0 ? "Progreso" : "Sin iniciar"}
                                        </span>
                                        <span className="text-xs font-bold text-[#1A4D3E]">{progress}%</span>
                                    </div>
                                    <Progress value={progress} className="h-2 bg-gray-100">
                                        <div
                                            className="h-full bg-gradient-to-r from-[#1A4D3E] to-[#43A047] rounded-full transition-all"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </Progress>
                                </div>

                                {/* Action Button */}
                                <Button
                                    className="w-full bg-[#1A4D3E] hover:bg-[#143D31] text-white rounded-lg h-10 text-sm font-medium shadow-md hover:shadow-lg transition-all"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/learn/${cls.id}`);
                                    }}
                                >
                                    {progress > 0 ? "Continuar Aprendiendo" : "Comenzar Curso"}
                                </Button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );

    const TasksView = () => {
        const [calendarView, setCalendarView] = useState('weekly'); // 'daily', 'weekly', 'monthly'

        // Get current week dates
        const today = new Date();
        const currentDay = today.getDay(); // 0 = Sunday
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - currentDay); // Start from Sunday

        const weekDays = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            return date;
        });

        // Group assignments by date
        const assignmentsByDate = {};
        assignments.forEach(assign => {
            if (assign.dueDate) {
                const dueDate = new Date(assign.dueDate);
                const dateKey = dueDate.toISOString().split('T')[0];
                if (!assignmentsByDate[dateKey]) {
                    assignmentsByDate[dateKey] = [];
                }
                assignmentsByDate[dateKey].push(assign);
            }
        });

        const dayNames = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
        const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

        return (
            <div className="space-y-6 animate-in fade-in duration-300">
                <header className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-[#1A4D3E]">Calendario de Tareas</h2>
                        <p className="text-gray-600 text-sm">
                            {monthNames[today.getMonth()]} {today.getFullYear()}
                        </p>
                    </div>
                </header>

                {/* View Switcher */}
                <div className="flex gap-2 bg-gray-100 p-1 rounded-lg w-fit">
                    <button
                        onClick={() => setCalendarView('daily')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${calendarView === 'daily'
                            ? 'bg-[#1A4D3E] text-white shadow-md'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Diario
                    </button>
                    <button
                        onClick={() => setCalendarView('weekly')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${calendarView === 'weekly'
                            ? 'bg-[#1A4D3E] text-white shadow-md'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Semanal
                    </button>
                    <button
                        onClick={() => setCalendarView('monthly')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${calendarView === 'monthly'
                            ? 'bg-[#1A4D3E] text-white shadow-md'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Mensual
                    </button>
                </div>

                {/* Daily View */}
                {calendarView === 'daily' && (
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="bg-[#E8F5E9] p-4 border-b border-gray-200">
                            <div className="text-sm font-medium text-gray-600">
                                {dayNames[today.getDay()]}
                            </div>
                            <div className="text-2xl font-bold text-[#1A4D3E]">
                                {today.getDate()} de {monthNames[today.getMonth()]}
                            </div>
                        </div>
                        <div className="p-6 space-y-3 min-h-[400px]">
                            {(assignmentsByDate[today.toISOString().split('T')[0]] || []).map(assign => {
                                const isSubmitted = submissions.find(s => s.examId === assign.examId);
                                return (
                                    <div
                                        key={assign.id}
                                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg ${assign.type === 'exam'
                                            ? isSubmitted
                                                ? 'bg-emerald-50 border-emerald-200'
                                                : 'bg-[#E8F5E9] border-[#1A4D3E] hover:border-[#143D31]'
                                            : 'bg-blue-50 border-blue-200'
                                            }`}
                                        onClick={() => {
                                            if (assign.type === 'exam' && !isSubmitted) {
                                                navigate(`/exam/${assign.examId}?classId=${assign.classId}`);
                                            } else {
                                                navigate(`/learn/${assign.classId}`);
                                            }
                                        }}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="font-bold text-gray-900 mb-1">{assign.title}</div>
                                                <div className="text-sm text-gray-600 mb-2">{assign.classTitle}</div>
                                                <div className="text-xs text-gray-500">{assign.description}</div>
                                            </div>
                                            {isSubmitted && (
                                                <div className="flex items-center gap-1 text-emerald-700">
                                                    <CheckCircle2 className="h-5 w-5" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            {!(assignmentsByDate[today.toISOString().split('T')[0]] || []).length && (
                                <div className="text-center py-12 text-gray-400">
                                    No hay tareas para hoy
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Monthly View */}
                {calendarView === 'monthly' && (
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
                            {dayNames.map((day, idx) => (
                                <div key={idx} className="p-3 text-center text-xs font-bold text-gray-600 border-r border-gray-100 last:border-r-0">
                                    {day}
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7">
                            {(() => {
                                const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                                const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
                                const monthDays = Array.from({ length: daysInMonth }, (_, i) => {
                                    return new Date(today.getFullYear(), today.getMonth(), i + 1);
                                });

                                return monthDays.map((date, idx) => {
                                    const dateKey = date.toISOString().split('T')[0];
                                    const dayAssignments = assignmentsByDate[dateKey] || [];
                                    const isToday = date.toDateString() === today.toDateString();

                                    return (
                                        <div
                                            key={idx}
                                            className={`min-h-[100px] border-r border-b border-gray-100 p-2 ${isToday ? 'bg-[#F9FDF9]' : ''
                                                }`}
                                        >
                                            <div className={`text-sm font-bold mb-1 ${isToday ? 'text-[#1A4D3E]' : 'text-gray-700'
                                                }`}>
                                                {date.getDate()}
                                            </div>
                                            <div className="space-y-1">
                                                {dayAssignments.slice(0, 2).map(assign => {
                                                    const isSubmitted = submissions.find(s => s.examId === assign.examId);
                                                    return (
                                                        <div
                                                            key={assign.id}
                                                            className={`text-[10px] p-1 rounded cursor-pointer ${isSubmitted ? 'bg-emerald-100' : 'bg-[#E8F5E9]'
                                                                }`}
                                                            onClick={() => {
                                                                if (assign.type === 'exam' && !isSubmitted) {
                                                                    navigate(`/exam/${assign.examId}?classId=${assign.classId}`);
                                                                } else {
                                                                    navigate(`/learn/${assign.classId}`);
                                                                }
                                                            }}
                                                        >
                                                            <div className="font-medium truncate">{assign.title}</div>
                                                        </div>
                                                    );
                                                })}
                                                {dayAssignments.length > 2 && (
                                                    <div className="text-[10px] text-gray-500">+{dayAssignments.length - 2} más</div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                });
                            })()}
                        </div>
                    </div>
                )}

                {/* Calendar Grid - Weekly View */}
                {calendarView === 'weekly' && (
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        {/* Week Header */}
                        <div className="grid grid-cols-7 border-b border-gray-200">
                            {weekDays.map((date, idx) => {
                                const isToday = date.toDateString() === today.toDateString();
                                return (
                                    <div
                                        key={idx}
                                        className={`p-4 text-center border-r border-gray-100 last:border-r-0 ${isToday ? 'bg-[#E8F5E9]' : 'bg-gray-50'
                                            }`}
                                    >
                                        <div className="text-xs font-medium text-gray-500 mb-1">
                                            {dayNames[idx]}
                                        </div>
                                        <div className={`text-lg font-bold ${isToday ? 'text-[#1A4D3E]' : 'text-gray-700'
                                            }`}>
                                            {date.getDate()}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Calendar Body */}
                        <div className="grid grid-cols-7 min-h-[400px]">
                            {weekDays.map((date, idx) => {
                                const dateKey = date.toISOString().split('T')[0];
                                const dayAssignments = assignmentsByDate[dateKey] || [];
                                const isToday = date.toDateString() === today.toDateString();

                                return (
                                    <div
                                        key={idx}
                                        className={`border-r border-gray-100 last:border-r-0 p-3 ${isToday ? 'bg-[#F9FDF9]' : ''
                                            }`}
                                    >
                                        <div className="space-y-2">
                                            {dayAssignments.map(assign => {
                                                const isSubmitted = submissions.find(s => s.examId === assign.examId);

                                                return (
                                                    <div
                                                        key={assign.id}
                                                        className={`p-2 rounded-lg text-xs cursor-pointer transition-all hover:shadow-md ${assign.type === 'exam'
                                                            ? isSubmitted
                                                                ? 'bg-emerald-100 border border-emerald-200'
                                                                : 'bg-[#E8F5E9] border border-[#1A4D3E]/20 hover:border-[#1A4D3E]'
                                                            : 'bg-blue-50 border border-blue-200'
                                                            }`}
                                                        onClick={() => {
                                                            if (assign.type === 'exam' && !isSubmitted) {
                                                                navigate(`/exam/${assign.examId}?classId=${assign.classId}`);
                                                            } else {
                                                                navigate(`/learn/${assign.classId}`);
                                                            }
                                                        }}
                                                    >
                                                        <div className="font-bold text-gray-900 line-clamp-2 mb-1">
                                                            {assign.title}
                                                        </div>
                                                        <div className="text-[10px] text-gray-600 mb-1">
                                                            {assign.classTitle}
                                                        </div>
                                                        {isSubmitted && (
                                                            <div className="flex items-center gap-1 text-emerald-700">
                                                                <CheckCircle2 className="h-3 w-3" />
                                                                <span className="text-[10px] font-medium">Completado</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Enhanced Quick Access Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Pending Tasks */}
                    <div className="bg-gradient-to-br from-[#1A4D3E] to-[#143D31] p-6 rounded-xl text-white shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold opacity-90">Tareas Pendientes</h3>
                            <ClipboardList className="h-5 w-5 opacity-75" />
                        </div>
                        <div className="text-3xl font-bold mb-4">
                            {assignments.filter(a => !submissions.find(s => s.examId === a.examId)).length}
                        </div>
                        {assignments.filter(a => !submissions.find(s => s.examId === a.examId)).slice(0, 2).map(assign => (
                            <div
                                key={assign.id}
                                className="bg-white/10 backdrop-blur-sm p-2 rounded-lg mb-2 cursor-pointer hover:bg-white/20 transition-all"
                                onClick={() => navigate(`/learn/${assign.classId}`)}
                            >
                                <div className="text-xs font-medium truncate">{assign.title}</div>
                                <div className="text-[10px] opacity-75">{assign.classTitle}</div>
                            </div>
                        ))}
                    </div>

                    {/* Upcoming Exams */}
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold opacity-90">Exámenes Próximos</h3>
                            <GraduationCap className="h-5 w-5 opacity-75" />
                        </div>
                        <div className="text-3xl font-bold mb-4">
                            {assignments.filter(a => a.type === 'exam' && !submissions.find(s => s.examId === a.examId)).length}
                        </div>
                        {assignments.filter(a => a.type === 'exam' && !submissions.find(s => s.examId === a.examId)).slice(0, 2).map(exam => (
                            <div
                                key={exam.id}
                                className="bg-white/10 backdrop-blur-sm p-2 rounded-lg mb-2 cursor-pointer hover:bg-white/20 transition-all"
                                onClick={() => navigate(`/exam/${exam.examId}?classId=${exam.classId}`)}
                            >
                                <div className="text-xs font-medium truncate">{exam.title}</div>
                                <div className="text-[10px] opacity-75">Vence: {exam.dueDate}</div>
                            </div>
                        ))}
                    </div>

                    {/* Completed */}
                    <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-xl text-white shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold opacity-90">Completadas</h3>
                            <CheckCircle2 className="h-5 w-5 opacity-75" />
                        </div>
                        <div className="text-3xl font-bold mb-4">{submissions.length}</div>
                        <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
                            <div className="text-xs opacity-90 mb-1">Tasa de Completitud</div>
                            <div className="text-lg font-bold">
                                {assignments.length > 0 ? Math.round((submissions.length / assignments.length) * 100) : 0}%
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

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
            <main
                key={currentView}
                className="grid gap-8 p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500 grid-cols-1">
                <div className="min-h-[500px]">
                    {(currentView === "home") && <HomeView />}
                    {currentView === "tasks" && <TasksView />}
                    {currentView === "grades" && <GradesView />}
                </div>
            </main>
        </div>
    );
}

export default StudentDashboard;
