import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getExamById } from "@/services/classService";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/services/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, CheckCircle2, XCircle, MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const getSubmissionById = async (id) => {
    const snap = await getDoc(doc(db, "exam_submissions", id));
    if (snap.exists()) return { id: snap.id, ...snap.data() };
    return null;
}

const StudentExamFeedback = () => {
    const { submissionId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [submission, setSubmission] = useState(null);
    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [submissionId]);

    const loadData = async () => {
        try {
            const sub = await getSubmissionById(submissionId);
            if (!sub) {
                console.error("Submission not found");
                return;
            }
            setSubmission(sub);

            const ex = await getExamById(sub.examId);
            setExam(ex);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-emerald-600" /></div>;

    if (!submission || !exam) return <div className="p-8 text-center">No se encontró la evaluación.</div>;

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 border-b pb-6">
                <Button variant="ghost" className="w-fit" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4 mr-2" /> Volver</Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{exam.title}</h1>
                    <p className="text-gray-500">Entregado el: {new Date(submission.gradedAt).toLocaleDateString()}</p>
                </div>
                <div className="ml-auto flex items-center gap-6 bg-emerald-50 px-6 py-3 rounded-xl border border-emerald-100">
                    <div>
                        <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Calificación</p>
                        <p className="text-4xl font-black text-emerald-600 leading-none">{submission.score}</p>
                    </div>
                </div>
            </div>

            {/* Questions List */}
            <div className="space-y-6">
                {exam.questions.map((q, idx) => {
                    const studentAns = submission.answers[q.id];

                    // Determine score and feedback for this question
                    // Fallback to logic if feedback object is missing (older submissions)
                    let score = 0;
                    let feedbackText = "";
                    let maxPoints = parseInt(q.points) > 0 ? parseInt(q.points) : 10;

                    if (submission.feedback && submission.feedback[q.id]) {
                        score = submission.feedback[q.id].score;
                        feedbackText = submission.feedback[q.id].notes;
                    } else if (q.type === 'multiple_choice' && studentAns === q.correctAnswer) {
                        score = maxPoints;
                    }

                    const isFullScore = score === maxPoints;
                    const isZero = score === 0;

                    return (
                        <Card key={q.id} className={`overflow-hidden border-2 ${isFullScore ? 'border-emerald-100' : isZero ? 'border-red-100' : 'border-amber-100'}`}>
                            <CardContent className="p-0">
                                <div className="flex flex-col md:flex-row">
                                    {/* Question Content */}
                                    <div className="flex-1 p-6 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-lg text-gray-800">
                                                <span className="text-gray-400 mr-2">{idx + 1}.</span>
                                                {q.text || q.question}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ml-4 whitespace-nowrap ${isFullScore ? 'bg-emerald-100 text-emerald-700' :
                                                    isZero ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                {score} / {maxPoints} pts
                                            </span>
                                        </div>

                                        {/* Student Answer */}
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                            <p className="text-xs font-bold text-gray-400 uppercase mb-2">Tu Respuesta:</p>
                                            <p className="text-gray-900 font-medium">{studentAns || <span className="italic text-gray-400">Sin respuesta</span>}</p>
                                        </div>

                                        {/* Correct Answer (Show only if multiple choice or specifically desired) */}
                                        {q.type === 'multiple_choice' && !isFullScore && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600 bg-emerald-50 p-2 rounded border border-emerald-100">
                                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                                <span>Respuesta Correcta: <span className="font-bold text-emerald-700">{q.correctAnswer}</span></span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Feedback Section (if exists) */}
                                    {(feedbackText) && (
                                        <div className="w-full md:w-80 bg-blue-50/50 border-l border-blue-100 p-6 flex flex-col justify-center">
                                            <div className="flex items-start gap-3">
                                                <MessageSquare className="h-5 w-5 text-blue-500 mt-1" />
                                                <div>
                                                    <p className="text-xs font-bold text-blue-800 uppercase mb-1">Comentarios del Profesor</p>
                                                    <p className="text-sm text-blue-900 italic">"{feedbackText}"</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    );
}

export default StudentExamFeedback;
