import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Plus, Trash2, Mail, User, Loader2 } from "lucide-react";
import { getUsersByRole, createStudentProfile, deleteUser } from "@/services/userService";
import { useSearchParams } from "react-router-dom";

const TeacherStudents = () => {
    const [searchParams] = useSearchParams();
    const view = searchParams.get("view") || "students"; // 'students' or 'teachers'
    const isStudentView = view === "students";

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Create Modal State
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newStudent, setNewStudent] = useState({ name: "", email: "", grade: "" });
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, [view]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const role = isStudentView ? 'student' : 'teacher';
            const data = await getUsersByRole(role);
            setUsers(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateStudent = async (e) => {
        e.preventDefault();
        setCreating(true);
        try {
            await createStudentProfile(newStudent);
            setShowCreateModal(false);
            setNewStudent({ name: "", email: "", grade: "" });
            fetchUsers();
            alert("Student profile created successfully!");
        } catch (error) {
            console.error("Error creating student:", error);
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            await deleteUser(userId);
            fetchUsers();
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 h-full relative">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
                <div>
                    <h1 className="text-xl font-bold text-[#1A4D3E] capitalize">{isStudentView ? "Students Directory" : "Teachers Directory"}</h1>
                    <p className="text-xs text-gray-500">Manage and view all {isStudentView ? "enrolled students" : "faculty members"}.</p>
                </div>
                {isStudentView && (
                    <Button onClick={() => setShowCreateModal(true)} className="bg-[#1A4D3E] hover:bg-[#143D31] text-white rounded-full shadow-lg shadow-[#1A4D3E]/20">
                        <Plus className="mr-2 h-4 w-4" /> Add Student
                    </Button>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder={`Search ${isStudentView ? "students" : "teachers"} by name or email...`}
                            className="pl-9 bg-gray-50 border-none focus-visible:ring-[#1A4D3E]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-[#1A4D3E]" /></div>
                    ) : (
                        <table className="w-full text-sm text-left">
                            <thead className="bg-[#F2F6F5] text-[#1A4D3E] font-bold">
                                <tr>
                                    <th className="px-6 py-4 rounded-tl-xl">Name</th>
                                    <th className="px-6 py-4">Contact</th>
                                    {isStudentView && <th className="px-6 py-4">Grade/Level</th>}
                                    <th className="px-6 py-4">Joined</th>
                                    <th className="px-6 py-4 rounded-tr-xl text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredUsers.length === 0 ? (
                                    <tr><td colSpan="5" className="p-8 text-center text-gray-500">No users found.</td></tr>
                                ) : (
                                    filteredUsers.map(user => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#1A4D3E] font-bold">
                                                        {user.name ? user.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
                                                    </div>
                                                    <span className="font-medium text-gray-900">{user.name || "Unknown"}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="h-3 w-3 text-gray-400" />
                                                    {user.email}
                                                </div>
                                            </td>
                                            {isStudentView && <td className="px-6 py-4 text-gray-600">{user.grade || "N/A"}</td>}
                                            <td className="px-6 py-4 text-gray-400 text-xs">
                                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                                                    onClick={() => handleDeleteUser(user.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* CREATE STUDENT MODAL */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
                    <Card className="w-full max-w-md border-none shadow-2xl">
                        <CardHeader>
                            <CardTitle className="text-[#1A4D3E]">Create Student Profile</CardTitle>
                            <CardDescription>Add a new student to the directory.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleCreateStudent} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Full Name</Label>
                                    <Input
                                        required
                                        placeholder="John Doe"
                                        value={newStudent.name}
                                        onChange={e => setNewStudent({ ...newStudent, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email Address</Label>
                                    <Input
                                        required
                                        type="email"
                                        placeholder="john@school.com"
                                        value={newStudent.email}
                                        onChange={e => setNewStudent({ ...newStudent, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Grade / Level</Label>
                                    <Input
                                        placeholder="10th Grade"
                                        value={newStudent.grade}
                                        onChange={e => setNewStudent({ ...newStudent, grade: e.target.value })}
                                    />
                                </div>
                                <div className="flex justify-end gap-2 mt-4">
                                    <Button type="button" variant="ghost" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                                    <Button type="submit" disabled={creating} className="bg-[#1A4D3E] hover:bg-[#143D31]">
                                        {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create Profile
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default TeacherStudents;
