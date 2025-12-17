import { db } from "./firebase";
import { collection, addDoc, getDocs, query, where, doc, getDoc, updateDoc, deleteDoc, orderBy, setDoc } from "firebase/firestore";
import { DIAGNOSTIC_EXAM } from "@/data/defaultExams";

// Classes
export const createClass = async (classData, userId) => {
    return await addDoc(collection(db, "classes"), {
        ...classData,
        createdBy: userId,
        createdAt: new Date().toISOString()
    });
};

export const getClassesByTeacher = async (userId) => {
    const q = query(collection(db, "classes"), where("createdBy", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getAllClasses = async () => {
    const q = query(collection(db, "classes"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export const getClassById = async (classId) => {
    const docRef = doc(db, "classes", classId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() };
    return null;
};

export const deleteClass = async (classId) => {
    await deleteDoc(doc(db, "classes", classId));
};

// Modules
export const createModule = async (courseId, title, order) => {
    return await addDoc(collection(db, "modules"), {
        courseId,
        title,
        order,
        createdAt: new Date().toISOString()
    });
};

export const getModulesByCourse = async (courseId) => {
    const q = query(collection(db, "modules"), where("courseId", "==", courseId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => (a.order || 0) - (b.order || 0));
};

// Lessons (Updated for Modules)
export const addLesson = async (classId, moduleId, lessonData) => {
    return await addDoc(collection(db, "lessons"), {
        ...lessonData,
        classId, // Keep for backward compatibility/easy query
        moduleId,
        createdAt: new Date().toISOString()
    });
};

export const getLessonsByModule = async (moduleId) => {
    const q = query(collection(db, "lessons"), where("moduleId", "==", moduleId));
    // Client-side sort by order or createdAt as needed
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => a.order - b.order);
};


export const getLessonsByClass = async (classId) => {
    // Legacy support or flat view
    const q = query(collection(db, "lessons"), where("classId", "==", classId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
};

// Progress & Enrollments
export const updateLessonProgress = async (userId, classId, lessonId, status) => {
    // 1. Update Lesson Progress
    const progressId = `${userId}_${lessonId}`;
    const progressRef = doc(db, "lesson_progress", progressId);

    await setDoc(progressRef, {
        userId,
        classId,
        lessonId,
        status,
        updatedAt: new Date().toISOString(),
        completedAt: status === 'completed' ? new Date().toISOString() : null
    }, { merge: true });

    // 2. Recalculate Course Progress (Aggregate)
    if (status === 'completed') {
        await updateCourseProgress(userId, classId);
    }
};

export const updateCourseProgress = async (userId, classId) => {
    // Get all lessons for the class (flat list is easiest)
    // Note: optimization would be to store totalLessons count on the class object
    const lessons = await getLessonsByClass(classId);
    const totalLessons = lessons.length;
    if (totalLessons === 0) return;

    // Get all completed lessons for this user & class
    // NOTE: Requires composite index on lesson_progress (userId, classId, status)
    // If index missing, client side filter:
    const q = query(collection(db, "lesson_progress"), where("userId", "==", userId));
    const snap = await getDocs(q);

    let completedCount = 0;
    snap.docs.forEach(doc => {
        const data = doc.data();
        if (data.classId === classId && data.status === 'completed') {
            completedCount++;
        }
    });

    const percentage = Math.round((completedCount / totalLessons) * 100);

    // Update Enrollment
    const enrollmentId = `${userId}_${classId}`;
    await setDoc(doc(db, "enrollments", enrollmentId), {
        userId,
        classId,
        progress: percentage,
        lastAccessedAt: new Date().toISOString()
    }, { merge: true });
}

export const getStudentEnrollments = async (userId) => {
    const q = query(collection(db, "enrollments"), where("userId", "==", userId));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Assignments
export const createAssignment = async (classId, assignmentData) => {
    return await addDoc(collection(db, "assignments"), {
        ...assignmentData,
        classId,
        createdAt: new Date().toISOString()
    });
};

export const getAssignmentsByClass = async (classId) => {
    const q = query(collection(db, "assignments"), where("classId", "==", classId));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

// Submissions (Assignments)
import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const submitAssignment = async (assignmentId, studentId, file, studentName) => {
    // 1. Upload File
    const fileRef = ref(storage, `submissions/${assignmentId}/${studentId}_${file.name}`);
    await uploadBytes(fileRef, file);
    const fileUrl = await getDownloadURL(fileRef);

    // 2. Save Submission Record
    // Check if exists first to update or add? For now, add new (or could use setDoc with custom ID)
    // Let's use custom ID to prevent duplicates: assignmentId_studentId
    const subId = `${assignmentId}_${studentId}`;
    await setDoc(doc(db, "assignment_submissions", subId), {
        assignmentId,
        studentId,
        studentName,
        fileUrl,
        fileName: file.name,
        submittedAt: new Date().toISOString(),
        status: 'submitted', // submitted, graded
        grade: null,
        feedback: null
    });

    return fileUrl;
};

export const getStudentAssignmentSubmission = async (assignmentId, studentId) => {
    const docRef = doc(db, "assignment_submissions", `${assignmentId}_${studentId}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() };
    return null;
};

export const getAssignmentSubmissions = async (assignmentId) => {
    const q = query(collection(db, "assignment_submissions"), where("assignmentId", "==", assignmentId));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
};

// Notifications
export const createNotification = async (userId, notificationData) => {
    return await addDoc(collection(db, "notifications"), {
        ...notificationData,
        userId,
        status: 'unread',
        createdAt: new Date().toISOString()
    });
};

export const getUnreadNotifications = async (userId) => {
    const q = query(collection(db, "notifications"), where("userId", "==", userId), where("status", "==", "unread"));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const markNotificationAsRead = async (notificationId) => {
    await updateDoc(doc(db, "notifications", notificationId), { status: 'read' });
};

// Exams
export const getExamsByTeacher = async (userId) => {
    const q = query(collection(db, "exams"), where("teacherId", "==", userId));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const getExamById = async (examId) => {
    const snap = await getDoc(doc(db, "exams", examId));
    if (snap.exists()) return { id: snap.id, ...snap.data() };
    return null;
};

export const createExam = async (examData) => {
    return await addDoc(collection(db, "exams"), {
        ...examData,
        createdAt: new Date().toISOString()
    });
}

export const updateExam = async (examId, examData) => {
    await updateDoc(doc(db, "exams", examId), {
        ...examData,
        updatedAt: new Date().toISOString()
    });
}

export const deleteExam = async (examId) => {
    await deleteDoc(doc(db, "exams", examId));
}

export const submitExam = async (examId, studentId, answers, score, classId, studentName, studentEmail) => {
    return await addDoc(collection(db, "exam_submissions"), {
        examId,
        studentId,
        studentName, // Saved for easy display
        studentEmail,
        classId,
        answers,
        score,
        status: 'submitted', // submitted | reviewed
        gradedAt: new Date().toISOString()
    });
}

export const getStudentSubmissions = async (studentId) => {
    const q = query(collection(db, "exam_submissions"), where("studentId", "==", studentId));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => new Date(b.gradedAt) - new Date(a.gradedAt));
}

export const reviewSubmission = async (submissionId, newScore, feedback) => {
    await updateDoc(doc(db, "exam_submissions", submissionId), {
        score: newScore,
        feedback, // map: { questionId: { score: 10, check: true/false, notes: "..." } }
        status: 'reviewed',
        reviewedAt: new Date().toISOString()
    });
}

export const getSubmissionsByClass = async (classId) => {
    const q = query(collection(db, "exam_submissions"), where("classId", "==", classId));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => new Date(b.gradedAt) - new Date(a.gradedAt));
}

// Helpers for broadcasting
export const notifyClassStudents = async (classId, message, title) => {
    // 1. Get all students enrolled in this class
    // Ideally we queried enrollments by classId, but we need an index for that. 
    // For now, getting all enrollments is costly. Index: enrollments where classId == X
    // Let's assume we create that index or allow the query.
    const q = query(collection(db, "enrollments"), where("classId", "==", classId));
    const snap = await getDocs(q);

    const batch = [];
    snap.docs.forEach(docSnap => {
        const studentId = docSnap.data().userId;
        // Verify this is not the teacher (self-notification) - though enrollments usually only students
        createNotification(studentId, {
            title,
            message,
            link: `/learn/${classId}` // Or directly to assignments view?
        });
    });
}

export const getLessonProgress = async (userId, classId) => {
    // NOTE: Firestore requires an index for this composite query. 
    // simplified: get all progress for user, filter client side if needed, or query by lessonIds if small list.
    // For now, let's just get all progress for a user (efficient enough for prototype)
    const q = query(collection(db, "lesson_progress"), where("userId", "==", userId));
    const snap = await getDocs(q);
    // Return map: { lessonId: status }
    const progressMap = {};
    snap.docs.forEach(d => {
        progressMap[d.data().lessonId] = d.data().status;
    });
    return progressMap;
}

// Comments
export const addComment = async (lessonId, userId, userName, text) => {
    return await addDoc(collection(db, "comments"), {
        lessonId,
        userId,
        userName,
        text,
        createdAt: new Date().toISOString()
    })
}

export const getCommentsByLesson = async (lessonId) => {
    const q = query(collection(db, "comments"), where("lessonId", "==", lessonId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

// Admin / Maintenance
export const deleteAllTeacherData = async (teacherId) => {
    // This is a heavy operation. Firestore does not support native cascade delete.
    // We must manually query and delete.

    // 1. Delete all Classes and related sub-collections (simulated via foreign key queries)
    const classes = await getClassesByTeacher(teacherId);

    for (const cls of classes) {
        // Delete Assignments
        const assignments = await getAssignmentsByClass(cls.id);
        for (const a of assignments) await deleteDoc(doc(db, "assignments", a.id));

        // Delete Modules
        const modules = await getModulesByCourse(cls.id);
        for (const m of modules) {
            // Delete Lessons
            const lessons = await getLessonsByModule(m.id);
            for (const l of lessons) await deleteDoc(doc(db, "lessons", l.id));

            await deleteDoc(doc(db, "modules", m.id));
        }

        // Delete Enrollments (Optional, but cleaner)
        const qEnroll = query(collection(db, "enrollments"), where("classId", "==", cls.id));
        const enrolls = await getDocs(qEnroll);
        for (const e of enrolls.docs) await deleteDoc(doc(db, "enrollments", e.id));

        // Delete Class
        await deleteDoc(doc(db, "classes", cls.id));
    }

    // 2. Delete all Exams
    const exams = await getExamsByTeacher(teacherId);
    for (const e of exams) {
        // Delete Submissions (Optional)
        const qSubs = query(collection(db, "exam_submissions"), where("examId", "==", e.id));
        const subs = await getDocs(qSubs);
        for (const s of subs.docs) await deleteDoc(doc(db, "exam_submissions", s.id));

        await deleteDoc(doc(db, "exams", e.id));
    }

    // 3. Delete Notifications? Maybe too aggressive. Let's keep them or delete only teacher's?
    // User request: "eliminar todos los cursos y evaluaciones".
}

export const seedDiagnosticExam = async (teacherId) => {
    return await createExam({
        ...DIAGNOSTIC_EXAM,
        teacherId
    });
}

// EVENTS (CALENDAR)
export const getEvents = async (userId) => {
    const q = query(collection(db, "events"), where("userId", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const createEvent = async (eventData, userId) => {
    return await addDoc(collection(db, "events"), {
        ...eventData,
        userId,
        createdAt: new Date().toISOString()
    });
};

export const deleteEvent = async (eventId) => {
    await deleteDoc(doc(db, "events", eventId));
};
