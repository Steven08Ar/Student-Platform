import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, User, Lock, Eye, EyeOff } from "lucide-react";
import mountainsPng from "@/assets/mountains.png";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/services/firebase";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Generate static particles
    const particles = Array.from({ length: 20 });

    const { login, logout } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            setError("");

            // 1. Perform Authentication
            const userCredential = await login(email, password);
            const user = userCredential.user;

            // 2. Fetch User Role from Firestore
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                const userRole = userData.role; // 'student' or 'teacher'

                // 3. Verify Role Match
                if (userRole && userRole.toLowerCase() !== role.toLowerCase()) {
                    await logout();
                    setError(`Access denied. You are a ${userRole}, but you are trying to log in as a ${role}.`);
                    setLoading(false);
                    return;
                }

                // 4. Success - Navigate Immediately
                navigate("/");

            } else {
                await logout();
                setError("Account not found. Please contact support.");
                setLoading(false);
            }

        } catch (err) {
            console.error("Login Error:", err);
            setError("Failed to log in. Check your credentials.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <style>{`
                @keyframes float-particle {
                    0% { transform: translateY(0) translateX(0); opacity: 0; }
                    20% { opacity: 0.8; }
                    100% { transform: translateY(-100vh) translateX(50px); opacity: 0; }
                }
                .particle {
                    position: absolute;
                    bottom: -20px;
                    background: rgba(255, 255, 255, 0.4);
                    border-radius: 50%;
                    pointer-events: none;
                    animation: float-particle linear infinite;
                }
            `}</style>

            {/* Blurred Background with Image & Particles */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                    src={mountainsPng}
                    alt="Background"
                    className="w-full h-full object-cover blur-[6px] scale-105"
                />
                <div className="absolute inset-0 bg-[#0F2922]/30" />

                {/* Particles Layer */}
                <div className="absolute inset-0 z-0">
                    {particles.map((_, i) => {
                        const size = Math.random() * 6 + 2;
                        const left = Math.random() * 100;
                        const duration = Math.random() * 10 + 10;
                        const delay = Math.random() * 10;
                        return (
                            <div
                                key={i}
                                className="particle"
                                style={{
                                    width: `${size}px`,
                                    height: `${size}px`,
                                    left: `${left}%`,
                                    animationDuration: `${duration}s`,
                                    animationDelay: `${delay}s`
                                }}
                            />
                        );
                    })}
                </div>
            </div>

            <div className="w-full max-w-[420px] bg-white/90 backdrop-blur-md rounded-3xl overflow-hidden relative z-10 m-4 flex flex-col border border-white/40 shadow-[0_35px_60px_15px_rgba(0,0,0,0.3)] transition-all duration-500">

                {/* Form Section */}
                <div className="p-8 pt-10">
                    <h2 className="text-3xl font-bold text-[#1A4D3E] text-center mb-8">Login</h2>

                    {/* Role Selector */}
                    <div className="flex justify-center mb-8">
                        <div className="bg-[#E8F5E9] p-1 rounded-full flex relative w-full max-w-[280px]">
                            <div
                                className={`absolute inset-y-1 w-[calc(50%-4px)] bg-[#1A4D3E] rounded-full shadow-md transition-all duration-300 ease-out ${role === 'teacher' ? 'translate-x-[calc(100%+4px)]' : 'translate-x-1'}`}
                            ></div>
                            <button
                                type="button"
                                onClick={() => setRole("student")}
                                className={`relative z-10 w-1/2 py-2 text-sm font-medium rounded-full transition-colors duration-300 ${role === 'student' ? 'text-white' : 'text-[#1A4D3E] hover:text-[#0F2922]'}`}
                            >
                                Student
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole("teacher")}
                                className={`relative z-10 w-1/2 py-2 text-sm font-medium rounded-full transition-colors duration-300 ${role === 'teacher' ? 'text-white' : 'text-[#1A4D3E] hover:text-[#0F2922]'}`}
                            >
                                Teacher
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 text-xs text-red-600 bg-red-50 rounded-lg text-center font-medium border border-red-100">
                                {error}
                            </div>
                        )}

                        {/* Email Input */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#1A4D3E]">
                                <User size={20} />
                            </div>
                            <input
                                type="email"
                                placeholder="Username"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full h-12 pl-12 pr-4 bg-[#E8F5E9] text-[#0F2922] placeholder-[#1A4D3E]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43A047] transition-all shadow-inner border border-transparent focus:border-[#43A047]/30 font-medium"
                            />
                        </div>

                        {/* Password Input */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#1A4D3E]">
                                <Lock size={20} />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full h-12 pl-12 pr-12 bg-[#E8F5E9] text-[#0F2922] placeholder-[#1A4D3E]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43A047] transition-all shadow-inner border border-transparent focus:border-[#43A047]/30 font-medium"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#1A4D3E]/70 hover:text-[#1A4D3E] transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        {/* Remember & Forgot */}
                        <div className="flex items-center justify-between text-xs px-1 font-medium">
                            <label className="flex items-center cursor-pointer text-[#1A4D3E]/90 hover:text-[#0F2922]">
                                <div className="relative mr-2">
                                    <input
                                        type="checkbox"
                                        className="sr-only"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    <div className={`w-9 h-5 rounded-full transition-colors duration-300 ${rememberMe ? 'bg-[#1A4D3E]' : 'bg-slate-300'}`}></div>
                                    <div className={`absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${rememberMe ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                </div>
                                remember me
                            </label>
                            <a href="#" className="text-[#2E7D32] hover:text-[#1B5E20] transition-colors hover:underline">
                                forgot password
                            </a>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 bg-[#1A4D3E] hover:bg-[#143D31] text-white rounded-xl text-lg font-bold tracking-wide shadow-lg shadow-[#1A4D3E]/30 hover:shadow-xl hover:shadow-[#1A4D3E]/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : "Login"}
                        </button>
                    </form>

                    <div className="mt-8 text-center pb-2">
                        <button className="text-sm text-[#1A4D3E]/80 hover:text-[#0F2922] font-semibold transition-colors hover:underline">
                            Create Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
