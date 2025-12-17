import { createClass, createModule, addLesson, createAssignment, createExam } from "@/services/classService";
import { pythonCourseData } from "@/data/pythonCourseData";

export const seedPythonCourse = async (userId) => {
    try {
        console.log("Starting Course Seeding...");

        // 1. Create Class
        const classDoc = await createClass({
            title: pythonCourseData.title,
            description: pythonCourseData.description,
            color: pythonCourseData.color
        }, userId);
        const classId = classDoc.id;
        console.log(`Class Created: ${classId}`);

        // 2. Iterate Modules
        for (const moduleData of pythonCourseData.modules) {
            const modDoc = await createModule(classId, moduleData.title, moduleData.order);
            const moduleId = modDoc.id;

            // 3. Lessons
            for (const lesson of moduleData.lessons) {
                await addLesson(classId, moduleId, {
                    title: lesson.title,
                    content: lesson.content,
                    order: lesson.order,
                    videoUrl: "", // Placeholder
                    duration: "45 min"
                });
            }

            // 4. Assignments
            for (const assign of moduleData.assignments) {
                await createAssignment(classId, {
                    title: assign.title,
                    description: assign.description,
                    dueDate: new Date(Date.now() + (assign.dueDateOffset * 86400000)).toISOString().split('T')[0],
                    type: assign.type
                });
            }

            // 5. Quizzes/Exams
            if (moduleData.quiz) {
                await createExam({
                    title: moduleData.quiz.title,
                    description: moduleData.quiz.description,
                    teacherId: userId,
                    questions: moduleData.quiz.questions,
                    classId // Optional linkage
                });
            }
        }

        console.log("Seeding Complete!");
        return true;
    } catch (error) {
        console.error("Seeding Failed:", error);
        return false;
    }
};
