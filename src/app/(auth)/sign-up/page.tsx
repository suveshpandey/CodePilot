"use client"

import { useState } from "react";
import { Mail, User, Lock, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (!email || !password || !username) {
                setError("All fields are required");
                return;
            }

            setError(null);
            setLoading(true);

            const response = await axios.post("/api/auth/sign-up", {
                email: email,
                password: password,
                username: username
            })

            if (response.status === 201) {
                console.log("user registered successfully, please verify your email")
                router.push(`/verify/${email}`);
                return;
            } else {
                //@ts-ignore
                setError(response.message);
                return;
            }
        } catch (error: any) {
            console.log("Error occured while registering a new user: ", error);
            
            if (error.response.data.message) {
                setError(error.response.data.message);
            } else if (error.message) {
                setError(error.message);
            } else {
                setError("Something went wrong, please try again");
            }
        } finally {
            setLoading(false);
            setEmail("");
            setPassword("");
            setUsername("");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-300">
            <div className="w-full max-w-md bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700">
                <h1 className="text-3xl font-extrabold mb-2 text-center text-violet-800">
                    CodePilot
                </h1>
                <p className="text-center text-slate-400 mb-6 text-sm">
                    Create your account to get started
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="flex items-center gap-1 mb-1 text-sm font-medium">
                        <Mail className="w-4 h-4 text-slate-400" /> Email
                        </label>
                        <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full py-2 px-4 rounded-lg bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-800"
                        />
                    </div>
                    
                    <div>
                        <label className="flex items-center gap-1 mb-1 text-sm font-medium">
                        <Lock className="w-4 h-4 text-slate-400" /> Password
                        </label>
                        <input
                        type="password"
                        placeholder="Enter a strong password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full py-2 px-4 rounded-lg bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-800"
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-1 mb-1 text-sm font-medium">
                        <User className="w-4 h-4 text-slate-400" /> Username
                        </label>
                        <input
                        type="text"
                        placeholder="Choose a username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full py-2 px-4 rounded-lg bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-800"
                        />
                    </div>
                    
                    {error && (
                        <div className="mb-4 py-2 px-4 text-sm text-red-400 border border-red-500/30 rounded-lg">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 mt-4 flex justify-center items-center gap-2 bg-violet-800 hover:bg-violet-700 disabled:opacity-70 rounded-lg text-slate-100 font-semibold shadow-md transition"
                    >
                        {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Registering...
                        </>
                        ) : (
                        "Register"
                        )}
                    </button>
                </form>

                <p className="text-center mt-6 text-sm text-slate-400">
                    Already have an account? <span onClick={() => router.push("/sign-in")}  className="text-violet-600 hover:text-violet-500 cursor-pointer">Login</span>
                </p>
            </div>
        </div>
    );
    }
