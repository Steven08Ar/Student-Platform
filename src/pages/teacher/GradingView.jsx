import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getExamById, reviewSubmission } from "@/services/classService";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/services/firebase"; // Need direct access for submission or add getSubmissionById service
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, ArrowLeft, Check, X } from "lucide-react";

// Helper since I didn't add getSubmissionById to service yet, or I can just use getDoc here for speed
const getSubmissionById = async (id) => {
    const snap = await getDoc(doc(db, "exam_submissions", id));
    if (snap.exists()) return { id: snap.id, ...snap.data() };
    return null;
}

const GradingView = () => {
    const { submissionId } = useParams();
    const navigate = useNavigate();

    const [submission, setSubmission] = useState(null);
    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(true);

    // Grading State
    const [manualScores, setManualScores] = useState({}); // { qId: number }
    const [feedbackNotes, setFeedbackNotes] = useState({}); // { qId: string }
    const [totalScore, setTotalScore] = useState(0);

    useEffect(() => {
        loadData();
    }, [submissionId]);

    const loadData = async () => {
        try {
            const sub = await getSubmissionById(submissionId);
            if (!sub) return;
            setSubmission(sub);

            const ex = await getExamById(sub.examId);
            setExam(ex);

            // Initialize grading state
            const scores = {};
            const notes = {}; // Flattened notes: { qId: string }

            ex.questions.forEach(q => {
                // Initialize notes
                if (sub.feedback && sub.feedback[q.id]) {
                    scores[q.id] = sub.feedback[q.id].score;
                    notes[q.id] = sub.feedback[q.id].notes || "";
                } else {
                    // Auto-calc logic for initial view
                    if (q.type === 'multiple_choice') {
                        if (sub.answers[q.id] === q.correctAnswer) {
                            scores[q.id] = parseInt(q.points);
                        } else {
                            scores[q.id] = 0;
                        }
                    } else {
                        scores[q.id] = 0; // Default open to 0 until graded
                    }
                    notes[q.id] = "";
                }
            });
            setManualScores(scores);
            setFeedbackNotes(notes);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    // Recalculate total whenever scores change
    useEffect(() => {
        if (!manualScores) return;
        const total = Object.values(manualScores).reduce((acc, val) => acc + (parseInt(val) || 0), 0);
        setTotalScore(total);
    }, [manualScores]);

    const handleSave = async () => {
        const feedbackMap = {};
        exam.questions.forEach(q => {
            feedbackMap[q.id] = {
                score: manualScores[q.id],
                notes: feedbackNotes[q.id] || ""
            };
        });

        await reviewSubmission(submissionId, totalScore, feedbackMap);
        navigate(-1); // Go back
    }

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="max-w-5xl mx-auto p-8 space-y-8">
            <div className="flex items-center gap-4 border-b pb-6">
                <Button variant="ghost" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4" /></Button>
                <div>
                    <h1 className="text-2xl font-bold">Calificar: {exam.title}</h1>
                    <p className="text-gray-500">Estudiante: {submission.studentName || submission.studentEmail} • Entregado: {new Date(submission.gradedAt).toLocaleDateString()}</p>
                </div>
                <div className="ml-auto flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-sm font-bold text-gray-400 uppercase">Nota Final</p>
                        <p className="text-4xl font-black text-emerald-600">{totalScore}</p>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {exam.questions.map((q, idx) => {
                    const studentAns = submission.answers[q.id];
                    const maxPoints = parseInt(q.points);

                    return (
                        <Card key={q.id} className="overflow-hidden">
                            <CardContent className="p-0">
                                <div className="flex flex-col md:flex-row">
                                    {/* Question & Answer Section */}
                                    <div className="flex-1 p-6 space-y-4">
                                        <h3 className="font-bold text-lg"><span className="text-gray-400 mr-2">{idx + 1}.</span> {q.text || q.question}</h3>

                                        <div className="bg-gray-50 p-4 rounded-lg border">
                                            <p className="text-xs font-bold text-gray-400 uppercase mb-2">Respuesta del Estudiante:</p>
                                            <p className="text-gray-900 font-medium">{studentAns || <span className="italic text-gray-400">Sin respuesta</span>}</p>
                                        </div>

                                        {q.type === 'multiple_choice' && (
                                            <div className="text-sm text-gray-500">
                                                Respuesta Correcta: <span className="font-bold text-emerald-600">{q.correctAnswer}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Grading Section */}
                                    <div className="w-full md:w-80 bg-gray-50 border-l p-6 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label>Puntaje (Max {maxPoints})</Label>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="number"
                                                    className={`w-20 text-right font-bold transition-all duration-200 ${q.type !== 'multiple_choice'
                                                            ? "bg-amber-50 border-amber-500 text-amber-700 focus-visible:ring-amber-500"
                                                            : (manualScores[q.id] || 0) === maxPoints
                                                                ? "bg-emerald-50 border-emerald-500 text-emerald-700 focus-visible:ring-emerald-500"
                                                                : "bg-red-50 border-red-200 text-red-700 focus-visible:ring-red-500"
                                                        }`}
                                                    value={manualScores[q.id] ?? 0}
                                                    onChange={e => setManualScores({ ...manualScores, [q.id]: parseInt(e.target.value) || 0 })}
                                                    max={maxPoints}
                                                />
                                            </div>
                                        </div>

                                        {/* Quick Actions for Open Questions */}
                                        {q.type !== 'multiple_choice' && (
                                            <div className="flex gap-2">
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="outline"
                                                    className="flex-1 border-emerald-200 hover:bg-emerald-50 text-emerald-700"
                                                    onClick={() => {
                                                        console.log(`Click Correcto: qId=${q.id}, max=${maxPoints}`);
                                                        setManualScores((prev) => {
                                                            const next = { ...prev, [q.id]: maxPoints };
                                                            console.log("New Scores:", next);
                                                            return next;
                                                        });
                                                    }}
                                                >
                                                    <Check className="h-4 w-4 mr-1" /> Correcto
                                                </Button>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="outline"
                                                    className="flex-1 border-red-200 hover:bg-red-50 text-red-700"
                                                    onClick={() => {
                                                        console.log(`Click Incorrecto: qId=${q.id}`);
                                                        setManualScores((prev) => ({ ...prev, [q.id]: 0 }));
                                                    }}
                                                >
                                                    <X className="h-4 w-4 mr-1" /> Incorrecto
                                                </Button>
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            <Label>Retroalimentación</Label>
                                            <Textarea
                                                className="bg-white min-h-[80px]"
                                                placeholder="Comentarios para el estudiante..."
                                                value={feedbackNotes[q.id] || ""}
                                                onChange={e => setFeedbackNotes({ ...feedbackNotes, [q.id]: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <div className="sticky bottom-4 flex justify-end">
                <Button size="lg" className="bg-black text-white shadow-xl hover:bg-gray-800" onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" /> Guardar Calificaciones
                </Button>
            </div>
        </div>
    );
}

export default GradingView;
