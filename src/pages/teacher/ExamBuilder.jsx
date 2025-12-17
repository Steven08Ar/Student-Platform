import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { createExam, updateExam, getExamById } from "@/services/classService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, Trash2, CheckCircle2, Save } from "lucide-react";
import { Switch } from "@/components/ui/switch"; // Need to ensure it exists or use checkbox

const ExamBuilder = () => {
    const { userData } = useAuth();
    const navigate = useNavigate();

    // Exam Metadata
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [showGradeImmediate, setShowGradeImmediate] = useState(true);

    // Questions
    const [questions, setQuestions] = useState([]);

    // Temporary Question State
    const [qText, setQText] = useState("");
    const [qType, setQType] = useState("multiple_choice");
    const [options, setOptions] = useState(["", "", "", ""]);
    const [correctOption, setCorrectOption] = useState(0); // Index of correct option
    const [points, setPoints] = useState(10);

    const handleAddQuestion = () => {
        if (!qText) return;

        const newQ = {
            id: Date.now().toString(),
            text: qText,
            type: qType,
            points: parseInt(points),
            options: qType === 'multiple_choice' ? [...options] : [],
            correctAnswer: qType === 'multiple_choice' ? options[correctOption] : null
        };

        setQuestions([...questions, newQ]);

        // Reset Inputs
        setQText("");
        setOptions(["", "", "", ""]);
        setCorrectOption(0);
    }

    const handleDeleteQuestion = (id) => {
        setQuestions(questions.filter(q => q.id !== id));
    }

    const { examId } = useParams(); // Import useParams
    const [loading, setLoading] = useState(false);

    // ... (rest of state)

    useEffect(() => {
        if (examId) {
            loadExam();
        }
    }, [examId]);

    const loadExam = async () => {
        setLoading(true);
        const data = await getExamById(examId);
        if (data) {
            setTitle(data.title);
            setDescription(data.description);
            setShowGradeImmediate(data.settings?.showGradeImmediate ?? true);
            setQuestions(data.questions || []);
        }
        setLoading(false);
    }

    // ... (rest of methods)

    const handleSaveExam = async () => {
        if (!title || questions.length === 0) return;
        setLoading(true);

        try {
            const examData = {
                teacherId: userData.uid,
                title,
                description,
                settings: { showGradeImmediate },
                questions,
            };

            if (examId) {
                await updateExam(examId, examData); // Need to import updateExam
                alert("Examen actualizado exitosamente");
            } else {
                await createExam(examData); // Need to import createExam
                alert("Examen creado exitosamente");
            }
            navigate("/");
        } catch (error) {
            console.error("Error saving exam:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-8 space-y-8">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate("/")}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-3xl font-bold">Creador de Exámenes</h1>
            </div>

            {/* Exam Details */}
            <Card>
                <CardHeader>
                    <CardTitle>Configuración General</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Título del Examen</Label>
                        <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ej. Parcial de Matemáticas I" />
                    </div>
                    <div className="space-y-2">
                        <Label>Descripción</Label>
                        <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Instrucciones generales..." />
                    </div>
                    <div className="flex items-center gap-2">
                        <Switch
                            id="showGrade"
                            checked={showGradeImmediate}
                            onCheckedChange={setShowGradeImmediate} // Switch uses onCheckedChange usually, let's check my implementation
                        />
                        <Label htmlFor="showGrade">Mostrar calificación al finalizar inmediatamente</Label>
                    </div>
                </CardContent>
            </Card>

            {/* Question List */}
            <div className="space-y-4">
                {questions.map((q, idx) => (
                    <Card key={q.id} className="relative bg-gray-50">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteQuestion(q.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-3">
                                <span className="font-bold text-gray-400">P{idx + 1}</span>
                                <div className="space-y-2">
                                    <p className="font-bold text-lg">{q.text}</p>
                                    <div className="flex gap-2 text-xs text-gray-500 uppercase font-bold tracking-wider">
                                        <span className="bg-white border px-2 py-1 rounded">{q.type === 'multiple_choice' ? 'Opción Múltiple' : 'Pregunta Abierta'}</span>
                                        <span className="bg-white border px-2 py-1 rounded">{q.points} Puntos</span>
                                    </div>

                                    {q.type === 'multiple_choice' && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                            {q.options.map((opt, i) => (
                                                <div key={i} className={`p-2 rounded border text-sm ${opt === q.correctAnswer ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-medium' : 'bg-white border-gray-200'}`}>
                                                    {['A', 'B', 'C', 'D'][i]}. {opt}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Add Question Form */}
            <Card className="border-2 border-dashed border-gray-200">
                <CardHeader>
                    <CardTitle className="text-gray-500 flex items-center gap-2">
                        <Plus className="h-5 w-5" /> Agregar Pregunta
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Pregunta</Label>
                        <Input value={qText} onChange={e => setQText(e.target.value)} placeholder="Escribe la pregunta aquí..." />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Tipo</Label>
                            <select
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={qType}
                                onChange={e => setQType(e.target.value)}
                            >
                                <option value="multiple_choice">Opción Múltiple</option>
                                <option value="open">Abierta (Texto)</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>Puntos</Label>
                            <Input type="number" value={points} onChange={e => setPoints(e.target.value)} />
                        </div>
                    </div>

                    {qType === 'multiple_choice' && (
                        <div className="space-y-4">
                            <Label>Opciones de Respuesta</Label>
                            {options.map((opt, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <span className="font-bold w-6 text-center">{['A', 'B', 'C', 'D'][idx]}</span>
                                    <Input
                                        value={opt}
                                        onChange={e => {
                                            const newOpts = [...options];
                                            newOpts[idx] = e.target.value;
                                            setOptions(newOpts);
                                        }}
                                        placeholder={`Opción ${idx + 1}`}
                                    />
                                    <input
                                        type="radio"
                                        name="correct"
                                        checked={correctOption === idx}
                                        onChange={() => setCorrectOption(idx)}
                                        className="h-4 w-4 accent-emerald-500"
                                    />
                                </div>
                            ))}
                            <p className="text-xs text-gray-500">* Selecciona el radio button de la respuesta correcta.</p>
                        </div>
                    )}

                    <Button onClick={handleAddQuestion} className="w-full bg-gray-900 text-white">Guargar Pregunta en el Examen</Button>
                </CardContent>
            </Card>

            <div className="sticky bottom-4">
                <Button size="lg" onClick={handleSaveExam} className="w-full shadow-xl text-lg h-14 bg-black text-white hover:bg-gray-800">
                    <Save className="mr-2 h-5 w-5" />
                    Finalizar y Crear Examen
                </Button>
            </div>
        </div>
    );
}

export default ExamBuilder;
