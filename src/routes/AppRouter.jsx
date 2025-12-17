import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import Layout from "@/components/layout/Layout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import TeacherDashboard from "@/pages/teacher/TeacherDashboard";
import StudentDashboard from "@/pages/student/StudentDashboard";
import ClassDetails from "@/pages/ClassDetails";

const Dashboard = () => {
    const { userData } = useAuth();
    if (userData?.role === 'teacher') return <TeacherDashboard />;
    return <StudentDashboard />;
}

const NotFound = () => <div className="flex h-screen items-center justify-center">Page Not Found</div>

import ClassLMSView from "@/pages/student/ClassLMSView";
import ExamBuilder from "@/pages/teacher/ExamBuilder";
import TakeExam from "@/pages/student/TakeExam";
import GradingView from "@/pages/teacher/GradingView";
import { VirtualClassroom } from "@/pages/virtualClassroom/VirtualClassroom";
import { MailPage } from "@/pages/mail/MailPage";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route element={<ProtectedRoute />}>
                        <Route element={<Layout />}>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/class/:classId" element={<ClassDetails />} />
                            <Route path="/teacher/exams/new" element={<ExamBuilder />} />
                            <Route path="/teacher/exams/:examId/edit" element={<ExamBuilder />} />
                            <Route path="/teacher/grading/:submissionId" element={<GradingView />} />
                            <Route path="/mail" element={<MailPage />} />
                        </Route>

                        {/* Full Screen Routes */}
                        <Route path="/learn/:classId" element={<ClassLMSView />} />
                        <Route path="/exam/:examId" element={<TakeExam />} />
                        <Route path="/classroom/:sessionId" element={<VirtualClassroom />} />
                    </Route>


                    <Route path="*" element={<NotFound />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter >
    );
};

export default AppRouter;
