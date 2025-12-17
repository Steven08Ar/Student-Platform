import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Lock, Mail, Loader2, Briefcase } from "lucide-react";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [role, setRole] = useState("student");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            setError("");
            await register(email, password, name, role);
            navigate("/");
        } catch (err) {
            setError("Failed to create an account.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center bg-[#1e40af] overflow-hidden">
            {/* Background Shapes */}
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute top-[20%] left-[-10%] w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-32 right-[20%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

            {/* Card */}
            <div className="relative z-10 w-full max-w-md p-8 space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold text-white">Register</h1>
                    <p className="text-blue-100">Create your account to get started</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && <div className="p-3 text-sm text-red-200 bg-red-900/50 rounded border border-red-500/50 text-center">{error}</div>}

                    <div className="space-y-4">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-blue-200 group-focus-within:text-white transition-colors" />
                            </div>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Full Name"
                                className="bg-transparent border-2 border-blue-300/30 text-white placeholder:text-blue-200/50 pl-10 h-12 rounded-xl focus-visible:ring-0 focus-visible:border-white transition-all"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-blue-200 group-focus-within:text-white transition-colors" />
                            </div>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Email Address"
                                className="bg-transparent border-2 border-blue-300/30 text-white placeholder:text-blue-200/50 pl-10 h-12 rounded-xl focus-visible:ring-0 focus-visible:border-white transition-all"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-blue-200 group-focus-within:text-white transition-colors" />
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Password"
                                className="bg-transparent border-2 border-blue-300/30 text-white placeholder:text-blue-200/50 pl-10 h-12 rounded-xl focus-visible:ring-0 focus-visible:border-white transition-all"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Briefcase className="h-5 w-5 text-blue-200 group-focus-within:text-white transition-colors" />
                            </div>
                            <select
                                id="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full bg-transparent border-2 border-blue-300/30 text-white pl-10 h-12 rounded-xl focus-visible:ring-0 focus-visible:border-white transition-all appearance-none cursor-pointer [&>option]:text-black"
                            >
                                <option value="student">Student</option>
                                <option value="teacher">Teacher</option>
                            </select>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-12 bg-blue-600/80 hover:bg-blue-600 text-white border border-blue-400/30 rounded-xl text-lg font-medium shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] transition-all"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Create Account"}
                    </Button>

                    <div className="text-center text-sm text-blue-200">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-400 font-semibold hover:text-white transition-colors">
                            Login!
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
