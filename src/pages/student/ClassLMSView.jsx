import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getClassById, getModulesByCourse, getLessonsByModule, getLessonProgress, updateLessonProgress, getAssignmentsByClass } from "@/services/classService";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, CheckCircle, Circle, PlayCircle, FileText, Lock, ClipboardList, BookOpen, Copy, Check, Target, Lightbulb, Car, ScrollText, XCircle, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { PageTransition } from "../../components/layout/PageTransition";
import confetti from 'canvas-confetti';

const CodeBlock = ({ language, children, ...props }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="my-8 rounded-xl overflow-hidden border border-gray-200/50 shadow-sm bg-[#121212]">
            {/* MacOS Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a1a] border-b border-gray-800">
                <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-[#fa5e57] hover:bg-[#d64a44] transition-colors" />
                    <div className="w-3 h-3 rounded-full bg-[#febb2e] hover:bg-[#d89e24] transition-colors" />
                    <div className="w-3 h-3 rounded-full bg-[#28c840] hover:bg-[#1fa133] transition-colors" />
                </div>
                <div className="text-[11px] uppercase font-bold text-gray-500 tracking-widest font-mono">
                    {language || 'code'}
                </div>
                <button
                    onClick={handleCopy}
                    className="text-gray-500 hover:text-white transition-colors p-1.5 rounded-md hover:bg-white/5 active:scale-95"
                    title="Copy code"
                >
                    {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </button>
            </div>
            {/* Code Content */}
            <div className="relative">
                <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={language}
                    PreTag="div"
                    {...props}
                    customStyle={{
                        margin: 0,
                        padding: '1.5rem',
                        borderRadius: 0,
                        fontSize: '15px',
                        lineHeight: '1.6',
                        backgroundColor: '#121212'
                    }}
                >
                    {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
            </div>
        </div>
    );
};

// Helper for Titles with Icons
const HeadingRenderer = ({ level, children, className, ...props }) => {
    // Content is usually an array of strings or strictly a string in this context
    const textContent = Array.isArray(children) ? children.join('') : String(children);

    // Map of emojis to Lucide Icons
    const iconMap = {
        '🎯': { icon: Target, color: "text-red-500" },
        '💡': { icon: Lightbulb, color: "text-amber-500" },
        '🚗': { icon: Car, color: "text-blue-500" },
        '📜': { icon: ScrollText, color: "text-amber-700" },
        '✅': { icon: CheckCircle, color: "text-emerald-500" },
        '❌': { icon: XCircle, color: "text-red-500" },
        '⚡': { icon: Zap, color: "text-yellow-500" },
    };

    let IconToRender = null;
    let cleanText = textContent;
    let iconColor = "text-gray-400";

    // Check if text starts with any emoji
    for (const [emoji, { icon, color }] of Object.entries(iconMap)) {
        if (textContent.includes(emoji)) {
            IconToRender = icon;
            cleanText = textContent.replace(emoji, '').trim();
            iconColor = color;
            break;
        }
    }

    const Tag = `h${level}`;

    // Base styles
    const baseStyles = {
        1: "text-3xl font-black text-gray-900 mt-8 mb-4 tracking-tight flex items-center gap-3",
        2: "text-2xl font-bold text-gray-800 mt-8 mb-3 border-b pb-2 border-gray-100 flex items-center gap-2",
        3: "text-lg font-bold text-gray-800 mt-6 mb-2 uppercase tracking-wide flex items-center gap-2"
    };

    return (
        <Tag className={cn(baseStyles[level], className)} {...props}>
            {IconToRender && <IconToRender className={cn("shrink-0", level === 1 ? "h-8 w-8" : "h-6 w-6", iconColor)} />}
            <span>{cleanText}</span>
        </Tag>
    );
};

import { useTranslation } from "react-i18next"; // Added import

const ClassLMSView = () => {
    const { classId } = useParams();
    const { userData } = useAuth();
    const { t } = useTranslation();
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

        // Visual Celebration
        confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.7 },
            colors: ['#1A4D3E', '#4ADE80', '#ffffff'],
            disableForReducedMotion: true
        });

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

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        },
        exit: { opacity: 0, transition: { duration: 0.2 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    if (loading) {
        return (
            <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
                {/* Skeleton Sidebar */}
                <aside className="w-80 bg-white border-r border-gray-200 flex flex-col h-full shrink-0 p-4">
                    <div className="space-y-4 border-b border-gray-100 pb-4 mb-4">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-2 w-full" />
                    </div>
                    <div className="space-y-2">
                        {[1, 2, 3, 4, 5].map(i => (
                            <Skeleton key={i} className="h-10 w-full" />
                        ))}
                    </div>
                </aside>
                {/* Skeleton Main Content */}
                <div className="flex-1 p-8 md:p-12 space-y-8 overflow-y-auto">
                    <Skeleton className="w-full aspect-video rounded-xl bg-gray-200" />
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <PageTransition className="flex h-screen bg-gray-50 overflow-hidden font-sans">
            {/* Sidebar (Modules & Lessons) */}
            <aside className="w-80 bg-white border-r border-gray-200 flex flex-col h-full shrink-0 z-10 shadow-sm">
                <div className="p-4 border-b border-gray-100 bg-white sticky top-0 z-20">
                    <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="mb-2 -ml-2 text-gray-500 hover:text-[#1A4D3E] hover:bg-emerald-50 transition-colors">
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        {t('course.back_dashboard')}
                    </Button>
                    <h2 className="font-bold text-lg leading-tight mb-3 truncate text-gray-800" title={classData?.title}>
                        {classData?.title}
                    </h2>
                    <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            <span>{t('course.progress')}</span>
                            <span className="text-[#1A4D3E]">{calculateTotalProgress()}%</span>
                        </div>
                        <Progress value={calculateTotalProgress()} className="h-2.5 bg-gray-100 [&>div]:bg-[#1A4D3E]" />
                    </div>

                    <div className="flex bg-gray-100 p-1 rounded-xl mt-5">
                        <button
                            className={cn("flex-1 text-xs font-bold py-2 rounded-lg transition-all duration-300", sidebarMode === 'content' ? "bg-white shadow-sm text-[#1A4D3E] scale-[1.02]" : "text-gray-500 hover:text-gray-700")}
                            onClick={() => setSidebarMode('content')}
                        >
                            {t('course.content')}
                        </button>
                        <button
                            className={cn("flex-1 text-xs font-bold py-2 rounded-lg transition-all duration-300", sidebarMode === 'tasks' ? "bg-white shadow-sm text-[#1A4D3E] scale-[1.02]" : "text-gray-500 hover:text-gray-700")}
                            onClick={() => setSidebarMode('tasks')}
                        >
                            {t('course.tasks_with_count', { count: classAssignments.length })}
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {sidebarMode === 'content' ? (
                        <div className="space-y-6">
                            {modules.map((mod, modIndex) => (
                                <motion.div
                                    key={mod.id}
                                    className="space-y-2"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: modIndex * 0.1 }}
                                >
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">{mod.title}</h3>
                                    <div className="space-y-1">
                                        {(lessonsMap[mod.id] || []).map((lesson) => {
                                            const isCompleted = progressMap[lesson.id] === 'completed';
                                            const isActive = activeLesson?.id === lesson.id;

                                            return (
                                                <button
                                                    key={lesson.id}
                                                    onClick={() => handleLessonSelect(lesson, mod.id)}
                                                    className={cn(
                                                        "w-full flex items-start text-left p-3 rounded-xl text-sm transition-all duration-200 group relative overflow-hidden",
                                                        isActive
                                                            ? "bg-[#1A4D3E]/5 text-[#1A4D3E] font-semibold border-l-4 border-[#1A4D3E] shadow-sm"
                                                            : "hover:bg-gray-50 text-gray-600 border-l-4 border-transparent"
                                                    )}
                                                >
                                                    <div className={cn("mt-0.5 mr-3 shrink-0 transition-colors duration-300", isCompleted ? "text-emerald-500" : isActive ? "text-[#1A4D3E]" : "text-gray-300")}>
                                                        {isCompleted ? <CheckCircle className="h-5 w-5 drop-shadow-sm" /> : <Circle className="h-5 w-5" />}
                                                    </div>
                                                    <div className="flex-1 z-10">
                                                        <span className={cn("line-clamp-2 leading-snug", isCompleted && !isActive && "text-gray-400 line-through decoration-gray-300")}>{lesson.title}</span>
                                                        <div className="flex items-center gap-3 mt-1.5 text-[10px] font-medium opacity-80">
                                                            <span className="flex items-center"><PlayCircle className="h-3 w-3 mr-1" /> {lesson.duration || "10 min"}</span>
                                                        </div>
                                                    </div>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {classAssignments.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-10 text-gray-300">
                                    <BookOpen className="h-10 w-10 mb-2 opacity-50" />
                                    <p className="text-sm font-medium">{t('course.no_assignments')}</p>
                                </div>
                            ) : (
                                classAssignments.map(assign => (
                                    <button
                                        key={assign.id}
                                        onClick={() => handleAssignmentSelect(assign)}
                                        className={cn(
                                            "w-full flex items-start text-left p-4 rounded-xl text-sm border transition-all duration-200 shadow-sm",
                                            activeAssignment?.id === assign.id
                                                ? "border-[#1A4D3E] bg-[#1A4D3E]/5 ring-1 ring-[#1A4D3E]/20"
                                                : "border-gray-100 hover:border-[#1A4D3E]/30 bg-white hover:shadow-md hover:-translate-y-0.5"
                                        )}
                                    >
                                        <div className="mr-3 mt-0.5 bg-white p-2 rounded-lg border border-gray-100 shadow-sm text-[#1A4D3E]">
                                            <ClipboardList className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-800">{assign.title}</div>
                                            <div className="text-xs text-emerald-600 font-medium mt-1 bg-emerald-50 inline-block px-2 py-0.5 rounded">{t('course.due_date', { date: assign.dueDate })}</div>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto flex flex-col relative w-full bg-white/50">
                <AnimatePresence mode="wait">
                    {activeLesson ? (
                        <motion.div
                            key={activeLesson.id}
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="max-w-4xl mx-auto w-full p-8 md:p-12 pb-32"
                        >
                            {/* Headers */}
                            <motion.div variants={itemVariants} className="mb-8 border-b border-gray-100 pb-8">
                                <div className="flex items-center text-xs font-bold text-[#1A4D3E] mb-3 uppercase tracking-wider">
                                    <span className="bg-emerald-100/50 text-[#1A4D3E] px-2.5 py-1 rounded-md mr-3 border border-emerald-100/50">{t('course.lesson')}</span>
                                    {modules.find(m => m.id === activeModuleId)?.title}
                                </div>
                                <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 leading-tight tracking-tight">{activeLesson.title}</h1>

                                {/* Video Placeholder */}
                                {activeLesson.videoUrl && (
                                    <motion.div
                                        className="aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl mb-8 relative group cursor-pointer ring-4 ring-gray-100"
                                        whileHover={{ scale: 1.01 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    >
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-20 h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300 shadow-lg">
                                                <PlayCircle className="h-10 w-10 text-white fill-white ml-1" />
                                            </div>
                                        </div>
                                        <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-white/10 font-mono">
                                            {t('course.preview_video')}
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>

                            {/* Markdown Content */}
                            <motion.div variants={itemVariants} className="prose prose-emerald max-w-none">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        // Custom Headings (Smaller & Styled)
                                        // Custom Headings (Smaller & Styled & Icons)
                                        h1: (props) => <HeadingRenderer level={1} {...props} />,
                                        h2: (props) => <HeadingRenderer level={2} {...props} />,
                                        h3: (props) => <HeadingRenderer level={3} {...props} />,

                                        // Custom Code Blocks (MacOS Style)
                                        code({ node, inline, className, children, ...props }) {
                                            const match = /language-(\w+)/.exec(className || '');
                                            return !inline && match ? (
                                                <CodeBlock language={match[1]} children={children} {...props} />
                                            ) : (
                                                <code className="bg-emerald-50 text-[#1A4D3E] px-1.5 py-0.5 rounded-md font-medium text-sm border border-emerald-100" {...props}>
                                                    {children}
                                                </code>
                                            );
                                        },
                                        // Override pre to remove prose background
                                        pre: ({ children }) => <div className="not-prose">{children}</div>,

                                        // Styled Tables
                                        table: ({ children }) => (
                                            <div className="overflow-x-auto my-8 rounded-xl shadow-sm border border-gray-100">
                                                <table className="w-full text-sm text-left border-collapse">{children}</table>
                                            </div>
                                        ),
                                        thead: ({ children }) => <thead className="bg-emerald-50 text-[#1A4D3E] uppercase font-bold text-xs tracking-wider">{children}</thead>,
                                        th: ({ children }) => <th className="px-6 py-4 font-semibold">{children}</th>,
                                        tbody: ({ children }) => <tbody className="divide-y divide-gray-100 bg-white">{children}</tbody>,
                                        tr: ({ children }) => <tr className="hover:bg-gray-50/50 transition-colors">{children}</tr>,
                                        td: ({ children }) => <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{children}</td>,

                                        // Blockquotes
                                        blockquote: ({ node, ...props }) => (
                                            <blockquote className="border-l-4 border-[#1A4D3E] bg-gradient-to-r from-emerald-50/50 to-transparent p-6 rounded-r-xl italic text-gray-700 my-6 not-italic shadow-sm" {...props} />
                                        )
                                    }}
                                >
                                    {activeLesson.content}
                                </ReactMarkdown>
                            </motion.div>

                            {/* Completion Footer */}
                            {/* Completion Footer */}
                            <motion.div variants={itemVariants} className="mt-10 flex justify-end sticky bottom-8 z-10 pointer-events-none px-8 md:px-0">
                                <Button
                                    size="lg"
                                    className={cn(
                                        "rounded-full px-8 h-12 text-base font-bold transition-all duration-300 shadow-2xl hover:shadow-xl pointer-events-auto",
                                        progressMap[activeLesson.id] === 'completed'
                                            ? "bg-white text-emerald-600 border border-emerald-200 hover:bg-emerald-50"
                                            : "bg-[#1A4D3E] hover:bg-[#143D31] text-white hover:scale-105 active:scale-95 ring-4 ring-[#1A4D3E]/10"
                                    )}
                                    onClick={handleMarkComplete}
                                    disabled={progressMap[activeLesson.id] === 'completed'}
                                >
                                    {progressMap[activeLesson.id] === 'completed' ? (
                                        <motion.div
                                            initial={{ scale: 0.5, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="flex items-center"
                                        >
                                            <CheckCircle className="mr-2 h-5 w-5 fill-emerald-100" /> {t('course.completed')}
                                        </motion.div>
                                    ) : (
                                        t('course.mark_complete')
                                    )}
                                </Button>
                            </motion.div>
                        </motion.div>
                    ) : activeAssignment ? (
                        <motion.div
                            key={activeAssignment.id}
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="max-w-3xl mx-auto w-full p-8 md:p-12 h-full flex flex-col justify-center"
                        >
                            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12 text-center space-y-8 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-[#1A4D3E]" />
                                <div className="w-24 h-24 bg-emerald-50 text-[#1A4D3E] rounded-3xl flex items-center justify-center mx-auto shadow-inner mb-6">
                                    <FileText className="h-10 w-10" />
                                </div>
                                <div className="space-y-4">
                                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">{activeAssignment.title}</h2>
                                    <p className="text-gray-500 text-lg leading-relaxed max-w-lg mx-auto">{activeAssignment.description}</p>
                                </div>
                                <div className="bg-gray-50 p-8 rounded-2xl border border-dashed border-gray-200 max-w-md mx-auto">
                                    <Lock className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500 font-medium">{t('course.submission_coming_soon')}</p>
                                    <p className="text-xs text-gray-400 mt-1">{t('course.upload_system_preparing')}</p>
                                </div>
                                <Button variant="outline" size="lg" onClick={() => setSidebarMode('content')} className="rounded-full border-gray-300 text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                                    {t('course.back_to_content')}
                                </Button>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 space-y-4">
                            <BookOpen className="h-16 w-16 opacity-20" />
                            <p className="font-medium text-lg opacity-60">{t('course.select_lesson_prompt')}</p>
                        </div>
                    )}
                </AnimatePresence>
            </main>
        </PageTransition>
    );
};

export default ClassLMSView; /* force-refresh */
