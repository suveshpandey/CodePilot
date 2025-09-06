"use client"

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { Loader2 } from "lucide-react";

export default function VerifyEmail() {
    const router = useRouter();
    const params = useParams<{ email: string }>();
    const rawEmail = params.email;
    const email = decodeURIComponent(rawEmail);

    const [otp, setOtp] = useState(Array(6).fill(""));
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    const handleChange = (value: string, index: number) => {
        if (!/^[0-9]?$/.test(value)) return; // only digits allowed

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // move to next input if value entered
        if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const verificationCode = otp.join("");

        if (verificationCode.length < 6) {
        setError("Please enter the 6-digit code");
        return;
        }

        try {
        setError(null);
        setLoading(true);

        const response = await axios.post(`/api/auth/verify-code`, {
            email,
            code: verificationCode,
        });

        if (response.status === 200) {
            router.push("/sign-in");
        } else {
            //@ts-ignore
            setError(response.message || "Invalid code");
        }
        } catch (error: any) {
        if (error.response?.data?.message) {
            setError(error.response.data.message);
        } else {
            setError("Something went wrong, please try again");
        }
        } finally {
        setLoading(false);
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
                Enter the 6-digit code sent to <span className="text-violet-400">{email}</span>
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-between gap-2">
                        {otp.map((digit, index) => (
                            <input
                            key={index}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(e.target.value, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            ref={(el) => {
                                inputRefs.current[index] = el;
                            }}
                            className="w-12 h-12 text-center text-xl font-semibold rounded-lg 
                            bg-slate-900 border border-slate-700 
                            focus:outline-none focus:border-1 focus:border-violet-500 
                            transition-all"
                            />
                        ))}
                    </div>


                    {error && (
                        <div className="py-2 px-4 text-sm text-red-400 border border-red-500/30 bg-red-500/10 rounded-lg">
                        {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 flex justify-center items-center gap-2 
                                bg-gradient-to-tr from-violet-800 to-violet-500 hover:to-violet-400 disabled:opacity-70 
                                rounded-lg text-slate-100 font-semibold shadow-md transition cursor-pointer"
                    >
                        {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Verifying
                        </>
                        ) : (
                        "Verify"
                        )}
                    </button>
                </form>

                <p className="text-center mt-6 text-sm text-slate-400">
                    Didn’t get the code?{" "}
                <span
                    onClick={() => router.push("/sign-up")}
                    className="text-violet-400 hover:text-violet-300 cursor-pointer"
                >
                    Try Again
                </span>
                </p>
            </div>
        </div>
    );
}
