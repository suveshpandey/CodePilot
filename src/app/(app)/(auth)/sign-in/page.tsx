"use client"

import { useState } from "react";
import { Mail, User, Lock, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SigninPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (!email || !password) {
                setError("All fields are required");
                return;
            }

            setError(null);
            setLoading(true);

            const result = await signIn('credentials', {
                redirect: false,
                email,
                password
            })
            if (result?.error) {
                console.log(result.error);
                setError("Login failed, try again");
                return;
            }
            if (result?.ok) {
                console.log("signin done");
                router.push("/code-editor")
            }

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }

        
    };

    const handleGoogleSignIn = async () => {
        try {
            setError(null);
            const result = await signIn("google", { 
                callbackUrl: "/code-editor", // Redirect after successful login
                redirect: true 
            });
            
            if (result?.error) {
                setError(result.error);
            }
        } catch (error: any) {
            setError(error.message || "Failed to sign in with Google");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-300">
            <div className="w-full max-w-md bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700">
                <div className="flex items-center justify-center gap-x-2 mb-2">
                    <img className="size-10" src="/code-pilot-icon.png" alt="" />
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-300 to-violet-400 bg-clip-text text-transparent">
                        CodePilot
                    </h1>
                </div>
                <p className="text-center text-slate-400 mb-6 text-sm">
                    Sign-In to your account
                </p>

                {/* Google Sign In Button */}
                <button
                    onClick={handleGoogleSignIn}
                    className="w-full py-2 mb-6 flex justify-center items-center gap-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-200 font-semibold shadow-md transition cursor-pointer"
                >
                    <img className="w-5 h-5" src="https://www.google.com/favicon.ico" alt="Google" />
                    Sign in with Google
                </button>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-slate-800 text-slate-400">Or continue with email</span>
                    </div>
                </div>

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
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full py-2 px-4 rounded-lg bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-800"
                        />
                    </div>

                    
                    {error && (
                        <div className="mb-4 p-2 text-sm text-red-400 border border-red-500/30 rounded-lg">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 mt-4 flex justify-center items-center gap-2 bg-gradient-to-tr from-violet-800 to-violet-500 hover:to-violet-400 disabled:opacity-70 rounded-lg text-slate-100 font-semibold shadow-md transition cursor-pointer"
                    >
                        {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Signing-In
                        </>
                        ) : (
                        "Sign-In"
                        )}
                    </button>
                </form>

                <p className="text-center mt-6 text-sm text-slate-400">
                    Don't have an account? <span onClick={() => router.push("/sign-up")}  className="text-violet-500 hover:text-violet-400 cursor-pointer">Register</span>
                </p>
            </div>
        </div>
    );
}