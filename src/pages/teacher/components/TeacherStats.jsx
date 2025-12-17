import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, DollarSign, FileCheck, Users, GraduationCap } from "lucide-react";

/**
 * Stats Widget for Teacher Dashboard
 * Displays Real Data passed via props
 */
const TeacherStats = ({ stats }) => {
    // Default to 0 values if no stats provided
    const {
        pendingGrading = 0,
        activeClasses = 0,
        totalStudents = 0,
        totalExams = 0
    } = stats || {};

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Active Classes Card */}
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col justify-between h-full bg-white relative">
                    <div className="flex items-center gap-2 text-[#2E7D32] font-medium mb-2">
                        <Users className="h-4 w-4" />
                        <span>Active Classes</span>
                    </div>
                    <div>
                        <h3 className="text-4xl font-bold text-[#1A4D3E]">{activeClasses}</h3>
                        <p className="text-xs text-gray-400 mt-1">Managed Courses</p>
                    </div>
                </CardContent>
            </Card>

            {/* Pending Grading Card (Was Fee Due) */}
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col justify-between h-full bg-white relative">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-[#E53935] font-medium">
                            <GraduationCap className="h-4 w-4" />
                            <span>Pending Grading</span>
                        </div>
                        {pendingGrading > 0 && <span className="text-xs text-[#E53935] font-bold animate-pulse">Action Needed</span>}
                    </div>
                    <div>
                        <h3 className="text-4xl font-bold text-[#1A4D3E] tracking-tight">{pendingGrading}</h3>
                        <p className="text-xs text-gray-400 mt-1">Submissions to review</p>
                    </div>
                </CardContent>
            </Card>

            {/* Total Exams Card */}
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col justify-between h-full bg-white relative">
                    <div className="flex items-center gap-2 text-[#66BB6A] font-medium mb-2">
                        <FileCheck className="h-4 w-4" />
                        <span>Total Exams Created</span>
                    </div>
                    <div>
                        <h3 className="text-4xl font-bold text-[#1A4D3E]">{totalExams}</h3>
                        <p className="text-xs text-gray-400 mt-1">Across all classes</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default TeacherStats;
