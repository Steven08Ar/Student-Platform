import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { getExamById, submitExam } from "@/services/classService";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // Unused
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input"; // For open answers
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

const TakeExam = () => {
    const { examId } = useParams();
    const [searchParams] = useSearchParams();
    const classId = searchParams.get("classId");
    const { userData } = useAuth();
    const navigate = useNavigate();

    const [exam, setExam] = useState(null);
    const [answers, setAnswers] = useState({}); // { questionId: answerValue }
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [totalPoints, setTotalPoints] = useState(0);
    const [loading, setLoading] = useState(true);

    const [viewingReview, setViewingReview] = useState(false);

    useEffect(() => {
        loadExam();
    }, [examId]);

    const loadExam = async () => {
        const data = await getExamById(examId);
        if (data) {
            setExam(data);
            const total = data.questions.reduce((acc, q) => acc + (parseInt(q.points) || 0), 0);
            setTotalPoints(total);
        }
        setLoading(false);
    }

    const handleSubmit = async () => {
        if (!exam || !userData) return;

        // Grading Logic
        let currentScore = 0;
        let requiresManualGrading = false;

        exam.questions.forEach(q => {
            if (q.type === 'multiple_choice') {
                const userAns = answers[q.id];
                if (userAns === q.correctAnswer) {
                    currentScore += parseInt(q.points);
                }
            } else {
                requiresManualGrading = true;
            }
        });

        // For now, save the calculated score. Teacher will update it later (feature pending)
        setScore(currentScore);

        await submitExam(examId, userData.uid, answers, currentScore, classId, userData.displayName || userData.email, userData.email);
        setSubmitted(true);
    }

    if (loading) return <div className="flex justify-center h-screen items-center"><Loader2 className="animate-spin" /></div>;
    if (!exam) return <div>Examen no encontrado</div>;

    if (submitted) {
        if (viewingReview) {
            return (
                <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
                    <header className="border-b border-gray-100 pb-6 flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold">{exam.title}</h1>
                            <p className="text-gray-500 mt-2">Revisión de Resultados</p>
                        </div>
                        <Button onClick={() => setViewingReview(false)} variant="outline">Volver al Resumen</Button>
                    </header>

                    <div className="space-y-8">
                        {exam.questions.map((q, idx) => {
                            const userAns = answers[q.id];
                            const isCorrect = q.type === 'multiple_choice' && userAns === q.correctAnswer;
                            const isPending = q.type === 'open';

                            return (
                                <Card key={q.id} className={`border-2 ${isPending ? 'border-amber-200' : (isCorrect ? 'border-emerald-200 bg-emerald-50/30' : 'border-red-200 bg-red-50/30')}`}>
                                    <CardContent className="pt-6 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-lg"><span className="text-gray-400 mr-2">{idx + 1}.</span> {q.text || q.question}</h3>
                                            <div className="flex items-center gap-2">
                                                {isPending ? (
                                                    <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-full border border-amber-200">Pendiente Calificar</span>
                                                ) : (
                                                    <span className={`text-xs font-bold px-2 py-1 rounded-full border ${isCorrect ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
                                                        {isCorrect ? `+${q.points} Puntos` : '0 Puntos'}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {q.type === 'multiple_choice' ? (
                                            <div className="space-y-2">
                                                {q.options.map((opt, i) => {
                                                    const isSelected = userAns === opt;
                                                    const isTheCorrectOne = opt === q.correctAnswer;

                                                    let styleClass = "border-gray-200 bg-white"; // default
                                                    if (isTheCorrectOne) styleClass = "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500 font-medium text-emerald-900";
                                                    else if (isSelected && !isTheCorrectOne) styleClass = "border-red-500 bg-red-50 text-red-900";

                                                    return (
                                                        <div key={i} className={`flex items-center gap-2 p-3 border rounded-lg ${styleClass}`}>
                                                            <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-current bg-current' : 'border-gray-300'}`}>
                                                                {isSelected && <div className="h-2 w-2 bg-white rounded-full" />}
                                                            </div>
                                                            <span className="flex-1">
                                                                {opt}
                                                                {isTheCorrectOne && <span className="ml-2 text-xs font-bold text-emerald-600">(Correcta)</span>}
                                                                {isSelected && !isTheCorrectOne && <span className="ml-2 text-xs font-bold text-red-600">(Tu respuesta)</span>}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <p className="text-sm font-bold text-gray-500">Tu respuesta:</p>
                                                <div className="p-3 bg-white border rounded-md italic text-gray-700">
                                                    {userAns || "Sin respuesta"}
                                                </div>
                                                <p className="text-xs text-amber-600 mt-2">
                                                    * Esta pregunta requiere revisión manual por parte del profesor.
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            );
        }

        return (
            <div className="max-w-2xl mx-auto p-8 text-center space-y-6">
                <CheckCircle className="h-20 w-20 text-emerald-500 mx-auto" />
                <h1 className="text-3xl font-bold">Examen Enviado</h1>
                {exam.settings?.showGradeImmediate && (
                    <div className="bg-gray-100 p-8 rounded-xl">
                        <p className="text-gray-500 uppercase text-sm font-bold tracking-wider">Calificación Preliminar</p>
                        <p className="text-6xl font-black text-gray-900 mt-2">{score} <span className="text-2xl text-gray-400">/ {totalPoints}</span></p>
                        <p className="text-xs text-amber-600 mt-2 font-medium">Nota: Las preguntas abiertas están pendientes de revisión.</p>
                    </div>
                )}
                <div className="flex gap-4 justify-center">
                    <Button onClick={() => navigate("/")} variant="outline" className="w-full">Volver al Inicio</Button>
                    <Button onClick={() => setViewingReview(true)} className="w-full bg-black text-white hover:bg-gray-800">Ver Corrección</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
            <header className="border-b border-gray-100 pb-6">
                <h1 className="text-3xl font-bold">{exam.title}</h1>
                <p className="text-gray-500 mt-2">{exam.description}</p>
            </header>

            <div className="space-y-8">
                {exam.questions.map((q, idx) => (
                    <Card key={q.id}>
                        <CardContent className="pt-6 space-y-4">
                            <h3 className="font-bold text-lg"><span className="text-gray-400 mr-2">{idx + 1}.</span> {q.text || q.question}</h3>

                            {q.type === 'multiple_choice' ? (
                                <div className="space-y-2">
                                    {q.options.map((opt, i) => (
                                        <div key={i} className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => setAnswers({ ...answers, [q.id]: opt })}>
                                            <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${answers[q.id] === opt ? 'border-black bg-black' : 'border-gray-300'}`}>
                                                {answers[q.id] === opt && <div className="h-2 w-2 bg-white rounded-full" />}
                                            </div>
                                            <span className="flex-1">{opt}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <Textarea
                                    placeholder="Escribe tu respuesta aquí..."
                                    value={answers[q.id] || ""}
                                    onChange={e => setAnswers({ ...answers, [q.id]: e.target.value })}
                                />
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="sticky bottom-4 bg-white/80 backdrop-blur p-4 border-t shadow-lg rounded-xl">
                <Button size="lg" className="w-full bg-black text-white hover:bg-gray-900" onClick={handleSubmit}>
                    Enviar Examen y Ver Nota
                </Button>
            </div>
        </div>
    );
}

export default TakeExam;
