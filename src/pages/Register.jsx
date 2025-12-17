import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { User, Lock, Mail, Loader2, Briefcase, Key, Eye, EyeOff } from "lucide-react";
import mountainsPng from "@/assets/mountains.png";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [role, setRole] = useState("student");
    const [gender, setGender] = useState("prefer-not-to-say");
    const [securityKey, setSecurityKey] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showSecurityKey, setShowSecurityKey] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    // Generate static particles
    const particles = Array.from({ length: 20 });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            setError("");

            // Validate security key
            if (securityKey !== "qwerty123") {
                setError("Invalid security key. Please contact your administrator.");
                setLoading(false);
                return;
            }

            await register(email, password, name, role, gender);
            navigate("/");
        } catch (err) {
            setError("Failed to create an account.");
            console.error(err);
        } finally {
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
                    <h2 className="text-3xl font-bold text-[#1A4D3E] text-center mb-2">Create Account</h2>
                    <p className="text-center text-sm text-[#1A4D3E]/70 mb-8">Join our learning platform</p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="p-3 text-xs text-red-600 bg-red-50 rounded-lg text-center font-medium border border-red-100">
                                {error}
                            </div>
                        )}

                        {/* Name Input */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#1A4D3E]">
                                <User size={20} />
                            </div>
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full h-12 pl-12 pr-4 bg-[#E8F5E9] text-[#0F2922] placeholder-[#1A4D3E]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43A047] transition-all shadow-inner border border-transparent focus:border-[#43A047]/30 font-medium"
                            />
                        </div>

                        {/* Email Input */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#1A4D3E]">
                                <Mail size={20} />
                            </div>
                            <input
                                type="email"
                                placeholder="Email Address"
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

                        {/* Security Key Input */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#1A4D3E]">
                                <Key size={20} />
                            </div>
                            <input
                                type={showSecurityKey ? "text" : "password"}
                                placeholder="Security Key"
                                value={securityKey}
                                onChange={(e) => setSecurityKey(e.target.value)}
                                required
                                className="w-full h-12 pl-12 pr-12 bg-[#E8F5E9] text-[#0F2922] placeholder-[#1A4D3E]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43A047] transition-all shadow-inner border border-transparent focus:border-[#43A047]/30 font-medium"
                            />
                            <button
                                type="button"
                                onClick={() => setShowSecurityKey(!showSecurityKey)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#1A4D3E]/70 hover:text-[#1A4D3E] transition-colors"
                            >
                                {showSecurityKey ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        {/* Gender Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#1A4D3E] block">Gender</label>
                            <div className="flex gap-3">
                                <label className="flex-1 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="male"
                                        checked={gender === "male"}
                                        onChange={(e) => setGender(e.target.value)}
                                        className="sr-only"
                                    />
                                    <div className={`h-12 flex items-center justify-center rounded-xl font-medium transition-all ${gender === "male"
                                        ? "bg-[#1A4D3E] text-white shadow-md"
                                        : "bg-[#E8F5E9] text-[#1A4D3E] hover:bg-[#D4E9D7]"
                                        }`}>
                                        Male
                                    </div>
                                </label>
                                <label className="flex-1 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="female"
                                        checked={gender === "female"}
                                        onChange={(e) => setGender(e.target.value)}
                                        className="sr-only"
                                    />
                                    <div className={`h-12 flex items-center justify-center rounded-xl font-medium transition-all ${gender === "female"
                                        ? "bg-[#1A4D3E] text-white shadow-md"
                                        : "bg-[#E8F5E9] text-[#1A4D3E] hover:bg-[#D4E9D7]"
                                        }`}>
                                        Female
                                    </div>
                                </label>
                                <label className="flex-1 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="prefer-not-to-say"
                                        checked={gender === "prefer-not-to-say"}
                                        onChange={(e) => setGender(e.target.value)}
                                        className="sr-only"
                                    />
                                    <div className={`h-12 flex items-center justify-center rounded-xl font-medium text-xs transition-all ${gender === "prefer-not-to-say"
                                        ? "bg-[#1A4D3E] text-white shadow-md"
                                        : "bg-[#E8F5E9] text-[#1A4D3E] hover:bg-[#D4E9D7]"
                                        }`}>
                                        Other
                                    </div>
                                </label>
                            </div>
                        </div>


                        {/* Role Selector */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#1A4D3E]">
                                <Briefcase size={20} />
                            </div>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full h-12 pl-12 pr-4 bg-[#E8F5E9] text-[#0F2922] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43A047] transition-all shadow-inner border border-transparent focus:border-[#43A047]/30 font-medium appearance-none cursor-pointer"
                            >
                                <option value="student">Student</option>
                                <option value="teacher">Teacher</option>
                            </select>
                        </div>


                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 bg-[#1A4D3E] hover:bg-[#143D31] text-white rounded-xl text-lg font-bold tracking-wide shadow-lg shadow-[#1A4D3E]/30 hover:shadow-xl hover:shadow-[#1A4D3E]/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : "Create Account"}
                        </button>
                    </form>

                    <div className="mt-8 text-center pb-2">
                        <Link to="/login" className="text-sm text-[#1A4D3E]/80 hover:text-[#0F2922] font-semibold transition-colors hover:underline">
                            Already have an account? Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
