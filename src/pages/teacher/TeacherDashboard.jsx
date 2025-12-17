import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createClass, getClassesByTeacher, deleteClass, getExamsByTeacher, createAssignment, notifyClassStudents, deleteExam, deleteAllTeacherData, seedDiagnosticExam, getSubmissionsByClass } from "@/services/classService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PlusCircle, Loader2, Trash2, FileQuestion, Send, Edit, Settings, AlertTriangle } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

// Components
import TeacherStats from "./components/TeacherStats";
import TeacherInbox from "./components/TeacherInbox";
import TeacherStudents from "./components/TeacherStudents";
import CalendarView from "./components/CalendarView";

const TeacherDashboard = () => {
    const { user, userData } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const currentView = searchParams.get("view") || "dashboard";

    const [classes, setClasses] = useState([]);
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);

    // Data State
    const [submissions, setSubmissions] = useState([]);
    const [stats, setStats] = useState({ pendingGrading: 0, activeClasses: 0, totalExams: 0 });
    const [chartData, setChartData] = useState([]);

    // Form State
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [color, setColor] = useState("bg-blue-100");
    const [creating, setCreating] = useState(false);

    // Assign Exam State
    const [assigningExamId, setAssigningExamId] = useState(null);
    const [targetClassId, setTargetClassId] = useState("");

    // Settings State
    const [showSettings, setShowSettings] = useState(false);
    const [purgePassword, setPurgePassword] = useState("");
    const [isPurging, setIsPurging] = useState(false);

    useEffect(() => {
        loadData();
    }, [user]);

    const loadData = async () => {
        if (!user) return;
        try {
            const data = await getClassesByTeacher(user.uid);
            setClasses(data);
            const examData = await getExamsByTeacher(user.uid);
            setExams(examData);

            // Fetch Submissions & Calculate Data
            let allSubs = [];
            for (const cls of data) {
                const subs = await getSubmissionsByClass(cls.id);
                // enrich with class title
                const enriched = subs.map(s => ({ ...s, classTitle: cls.title }));
                allSubs = [...allSubs, ...enriched];
            }
            setSubmissions(allSubs);

            // CALCULATE STATS
            const pending = allSubs.filter(s => s.status !== 'reviewed').length;
            setStats({
                pendingGrading: pending,
                activeClasses: data.length,
                totalExams: examData.length
            });

            // CALCULATE CHART DATA (Avg per Class)
            const classScores = {};
            allSubs.forEach(sub => {
                if (sub.status === 'reviewed') {
                    if (!classScores[sub.classTitle]) classScores[sub.classTitle] = { total: 0, count: 0 };
                    classScores[sub.classTitle].total += (parseInt(sub.score) || 0);
                    classScores[sub.classTitle].count += 1;
                }
            });

            const chart = Object.keys(classScores).map(className => ({
                name: className,
                score: Math.round(classScores[className].total / classScores[className].count)
            }));
            setChartData(chart);

        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateClass = async (e) => {
        e.preventDefault();
        setCreating(true);
        try {
            await createClass({ title, description, color }, user.uid);
            setTitle("");
            setDescription("");
            setShowCreateForm(false);
            loadData();
        } catch (error) {
            console.error("Failed to create class", error);
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteClass = async (classId) => {
        if (!window.confirm("Are you sure you want to delete this class? This action cannot be undone.")) return;
        try {
            setLoading(true);
            await deleteClass(classId);
            await loadData();
        } catch (error) {
            console.error("Failed to delete class", error);
        } finally {
            setLoading(false);
        }
    }

    const handleAssignExam = async () => {
        if (!assigningExamId || !targetClassId) return;
        const exam = exams.find(e => e.id === assigningExamId);
        if (!exam) return;

        try {
            await createAssignment(targetClassId, {
                title: exam.title,
                description: "Examen Parcial",
                dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0], // 1 week default
                type: 'exam',
                examId: exam.id
            });
            await notifyClassStudents(targetClassId, `Examen Disponible: ${exam.title}`, "Nuevo Examen");
            alert("Examen asignado exitosamente.");
            setAssigningExamId(null);
            setTargetClassId("");
        } catch (e) {
            console.error(e);
        }
    }

    const handlePurgeData = async () => {
        if (purgePassword !== "qwerty") {
            alert("Contraseña incorrecta");
            return;
        }
        if (!confirm("¡ADVERTENCIA FINAL! ¿Seguro que deseas eliminar TODOS tus datos? Esta acción es irreversible.")) return;

        setIsPurging(true);
        try {
            await deleteAllTeacherData(user.uid);
            await loadData();
            setShowSettings(false);
            setPurgePassword("");
            alert("Todos los datos han sido eliminados correctamente.");
        } catch (error) {
            console.error("Error purging data", error);
            alert("Hubo un error al eliminar los datos.");
        } finally {
            setIsPurging(false);
        }
    }

    if (loading) return <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin text-[#1A4D3E]" /></div>;

    return (
        <div className="space-y-6 relative h-full">
            {/* Settings Modal */}
            {showSettings && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <Card className="w-full max-w-md border-red-500 border-2 shadow-2xl">
                        <CardHeader>
                            <CardTitle className="flex items-center text-red-600 gap-2">
                                <AlertTriangle className="h-6 w-6" /> Zona de Peligro
                            </CardTitle>
                            <CardDescription>
                                Acciones irreversibles destructivas.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Input
                                    type="password"
                                    placeholder="Contraseña (qwerty)..."
                                    value={purgePassword}
                                    onChange={e => setPurgePassword(e.target.value)}
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-2 bg-red-50 p-4 rounded-b-xl border-t border-red-100">
                            <div className="flex w-full gap-2 justify-end">
                                <Button variant="ghost" onClick={() => setShowSettings(false)}>Cancelar</Button>
                                <Button variant="destructive" onClick={handlePurgeData} disabled={!purgePassword || isPurging}>
                                    {isPurging ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
                                    Eliminar Todo
                                </Button>
                            </div>

                            <div className="w-full pt-4 border-t border-red-200 mt-2">
                                <p className="text-xs text-red-400 mb-2 font-bold uppercase tracking-wider">Developer Tools</p>
                                <Button
                                    variant="outline"
                                    className="w-full border-dashed border-red-300 text-red-500 hover:bg-red-100"
                                    onClick={async () => {
                                        if (confirm("Generate 'Python OOP' Course?")) {
                                            const { seedPythonCourse } = await import("@/services/seeder");
                                            setLoading(true);
                                            await seedPythonCourse(user.uid);
                                            await loadData();
                                            setLoading(false);
                                            setShowSettings(false);
                                            alert("Course Generated!");
                                        }
                                    }}
                                >
                                    <FileQuestion className="mr-2 h-4 w-4" /> Seed Python Content
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            )}

            {/* DASHBOARD VIEW (Default) */}
            {(currentView === 'dashboard' || !currentView) && (
                <div className="grid grid-cols-1 xl:grid-cols-[1fr_350px] gap-8 h-full">
                    {/* Main Stats & Charts */}
                    <div>
                        <div className="mb-6 flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold text-[#1A4D3E]">Dashboard Overview</h1>
                                <p className="text-gray-500 text-sm">Welcome back, {userData?.name}</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)}>
                                <Settings className="h-5 w-5 text-gray-400 hover:text-[#1A4D3E]" />
                            </Button>
                        </div>

                        <TeacherStats stats={stats} />

                        <div className="h-[400px]">
                            <TeacherInbox />
                        </div>
                    </div>

                    {/* Side Calendar Widget */}
                    <div className="hidden xl:block h-full">
                        <CalendarView />
                    </div>
                </div>
            )}

            {/* STUDENTS / TEACHERS VIEW */}
            {(currentView === 'students' || currentView === 'teachers') && (
                <TeacherStudents />
            )}

            {/* COURSES VIEW */}
            {currentView === 'courses' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm">
                        <h1 className="text-xl font-bold text-[#1A4D3E]">My Classes</h1>
                        <div className="flex gap-2">
                            <Button className="bg-[#1A4D3E] hover:bg-[#143D31] text-white rounded-full px-6 shadow-lg shadow-[#1A4D3E]/20" onClick={() => setShowCreateForm(!showCreateForm)}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Create Class
                            </Button>
                        </div>
                    </div>

                    {showCreateForm && (
                        <Card className="mb-6 border-[#4CA771]/30 shadow-sm animate-in fade-in slide-in-from-top-2">
                            <CardHeader>
                                <CardTitle className="text-[#1A4D3E]">Create New Class</CardTitle>
                                <CardDescription>Give your class a title, description and a theme color.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleCreateClass} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Class Title</Label>
                                        <Input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Advanced Biology" className="bg-gray-50 border-none focus-visible:ring-[#1A4D3E]" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Description</Label>
                                        <Input value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="Short description..." className="bg-gray-50 border-none focus-visible:ring-[#1A4D3E]" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Theme Color</Label>
                                        <div className="flex gap-3">
                                            {[{ name: "Blue", value: "bg-blue-100" }, { name: "Emerald", value: "bg-emerald-100" }, { name: "Purple", value: "bg-purple-100" }, { name: "Orange", value: "bg-orange-100" }, { name: "Rose", value: "bg-rose-100" }].map((c) => (
                                                <div key={c.value} onClick={() => setColor(c.value)} className={`h-8 w-8 rounded-full cursor-pointer border-2 transition-all ${c.value} ${color === c.value ? 'border-[#1A4D3E] ring-2 ring-[#1A4D3E]/30' : 'border-transparent hover:scale-110'}`} title={c.name} />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button type="button" variant="ghost" onClick={() => setShowCreateForm(false)}>Cancel</Button>
                                        <Button type="submit" disabled={creating} className="bg-[#1A4D3E] hover:bg-[#143D31]">
                                            {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create Class
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    )}

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {classes.length === 0 ? (
                            <div className="col-span-full text-center text-gray-400 py-10">No classes found. Create your first class!</div>
                        ) : (
                            classes.map((cls) => (
                                <Card key={cls.id} className={`border-none shadow-sm hover:shadow-md transition-all ${cls.color || ''}`}>
                                    <CardHeader>
                                        <CardTitle className="text-[#0F2922]">{cls.title}</CardTitle>
                                        <CardDescription className="text-gray-600 line-clamp-2">{cls.description}</CardDescription>
                                    </CardHeader>
                                    <CardFooter className="flex gap-2">
                                        <Button variant="secondary" className="flex-1 bg-white/60 hover:bg-white text-[#1A4D3E] font-medium" asChild>
                                            <Link to={`/class/${cls.id}`}>Manage Class</Link>
                                        </Button>
                                        <Button variant="ghost" size="icon" className="hover:bg-red-100 text-red-500" onClick={() => handleDeleteClass(cls.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* GRADES VIEW */}
            {currentView === 'grades' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                    <Card className="border-none shadow-sm rounded-xl overflow-hidden">
                        <CardHeader className="bg-white border-b border-gray-100">
                            <CardTitle className="text-[#1A4D3E]">Student Submissions</CardTitle>
                            <CardDescription>Review and grade submissions.</CardDescription>
                        </CardHeader>
                        <div className="overflow-x-auto bg-white">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50/50 text-gray-500">
                                    <tr>
                                        <th className="px-6 py-4 font-bold">Student</th>
                                        <th className="px-6 py-4 font-bold">Exam / Class</th>
                                        <th className="px-6 py-4 font-bold">Status</th>
                                        <th className="px-6 py-4 font-bold text-right">Score</th>
                                        <th className="px-6 py-4 font-bold text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {submissions.length === 0 ? (
                                        <tr><td colSpan="5" className="p-8 text-center text-gray-500">No submissions found.</td></tr>
                                    ) : (
                                        submissions.map(sub => (
                                            <tr key={sub.id} className="hover:bg-gray-50/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-[#0F2922]">{sub.studentName || "Student"}</div>
                                                    <div className="text-xs text-gray-400">{sub.studentEmail}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-[#1A4D3E] text-xs font-bold uppercase tracking-wider bg-[#E8F5E9] inline-block px-2 py-1 rounded">{sub.classTitle || "Class"}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {sub.status === 'reviewed' ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E8F5E9] text-[#1B5E20]">Graded</span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-600 animate-pulse">Pending</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right font-bold font-mono">{sub.score}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <Button size="sm" variant="outline" className="rounded-full px-4 border-gray-200 text-[#1A4D3E] hover:bg-[#E8F5E9]" onClick={() => navigate(`/teacher/grading/${sub.id}`)}>
                                                        {sub.status === 'reviewed' ? 'Edit' : 'Grade'}
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            )}

            {/* EXAMS VIEW */}
            {currentView === 'exams' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
                        <h2 className="text-xl font-bold text-[#1A4D3E]">Examinations</h2>
                        <div className="flex gap-2">
                            <Button variant="outline" className="rounded-full border-dashed text-[#1A4D3E] border-[#1A4D3E]/30 hover:bg-[#E8F5E9]" onClick={async () => {
                                if (confirm("Install Diagnostic Exam?")) {
                                    setLoading(true);
                                    await seedDiagnosticExam(user.uid);
                                    await loadData();
                                    setLoading(false);
                                }
                            }}>
                                <FileQuestion className="mr-2 h-4 w-4" /> Import Diagnostic
                            </Button>
                            <Button onClick={() => navigate("/teacher/exams/new")} className="bg-[#1A4D3E] hover:bg-[#143D31] text-white rounded-full shadow-lg shadow-[#1A4D3E]/20">
                                <PlusCircle className="mr-2 h-4 w-4" /> Create Exam
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {exams.map(exam => (
                            <Card key={exam.id} className="bg-white border-none shadow-sm hover:translate-y-[-2px] transition-transform duration-300">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div className="p-2 bg-[#E8F5E9] rounded-lg text-[#1B5E20] mb-2">
                                            <FileQuestion className="h-6 w-6" />
                                        </div>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full" onClick={() => navigate(`/teacher/exams/${exam.id}/edit`)}>
                                            <Edit className="h-4 w-4 text-gray-400" />
                                        </Button>
                                    </div>
                                    <CardTitle className="text-lg text-[#0F2922]">{exam.title}</CardTitle>
                                    <CardDescription className="line-clamp-2">{exam.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">{exam.questions?.length || 0} Questions</div>
                                    {assigningExamId === exam.id ? (
                                        <div className="space-y-2 animate-in fade-in bg-[#F2F6F5] p-3 rounded-lg">
                                            <Label className="text-xs">Select Class:</Label>
                                            <select className="w-full p-2 rounded border text-sm focus:ring-[#1A4D3E]" value={targetClassId} onChange={e => setTargetClassId(e.target.value)}>
                                                <option value="">Choose...</option>
                                                {classes.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                                            </select>
                                            <div className="flex gap-2 justify-end">
                                                <Button size="sm" variant="ghost" onClick={() => setAssigningExamId(null)}>Cancel</Button>
                                                <Button size="sm" onClick={handleAssignExam} disabled={!targetClassId} className="bg-[#1A4D3E] text-white">Assign</Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <Button size="sm" className="w-full bg-[#F2F6F5] text-[#1A4D3E] hover:bg-[#E8F5E9] border-none shadow-none font-medium" onClick={() => setAssigningExamId(exam.id)}>
                                            <Send className="mr-2 h-3 w-3" /> Assign to Class
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherDashboard;
