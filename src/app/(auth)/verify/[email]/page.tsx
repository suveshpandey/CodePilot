// "use client"

// import axios from "axios";
// import { useParams, useRouter } from "next/navigation";
// import { useState } from "react";
// import { User, Loader2 } from "lucide-react";

// export default function VerifyEmail () {
//     const router = useRouter();
//     const params = useParams<{email: string}>();
//     const rawEmail = params.email;
//     const email = decodeURIComponent(rawEmail);

//     const [verifiactionCode, setVerificationCode] = useState("");
//     const [error, setError] = useState<string | null>(null);
//     const [loading, setLoading] = useState(false);

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         try {
//             if (!verifiactionCode) {
//                 setError("Please enter verification code");
//                 return;
//             }

//             setError(null);
//             setLoading(true);

//             const response = await axios.post(`/api/auth/verify-code`, {
//                 email: email,
//                 code: verifiactionCode
//             })
//             if (response.status === 200) {
//                 console.log("user verified successfully")
//                 router.push("/sign-in");
//                 return;
//             } else {
//                 //@ts-ignore
//                 setError(response.message);
//                 return;
//             }
//         } catch (error: any) {
//             console.log("Error occured while registering a new user: ", error);
            
//             if (error.response.data.message) {
//                 setError(error.response.data.message);
//             } else if (error.message) {
//                 setError(error.message);
//             } else {
//                 setError("Something went wrong, please try again");
//             }
//         } finally {
//             setLoading(false);
//         }
//     }

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-300">
//             <div className="w-full max-w-md bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700">
//                 <h1 className="text-3xl font-extrabold mb-2 text-center text-violet-800">
//                     CodePilot
//                 </h1>
//                 <p className="text-center text-slate-400 mb-6 text-sm">
//                     Verify your account
//                 </p>

//                 <form onSubmit={handleSubmit} className="space-y-4">

//                     <div>
//                         <label className="flex items-center gap-1 mb-1 text-sm font-medium">
//                         <User className="w-4 h-4 text-slate-400" /> Verifiaction Code
//                         </label>
//                         <input
//                         type="text"
//                         placeholder="* * * * * *"
//                         value={verifiactionCode}
//                         onChange={(e) => setVerificationCode(e.target.value)}
//                         className="w-full py-2 px-4 text-center rounded-lg bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-800"
//                         />
//                     </div>
                    
//                     {error && (
//                         <div className="mb-4 py-2 px-4 text-sm text-red-400 border border-red-500/30 rounded-lg">
//                             {error}
//                         </div>
//                     )}

//                     <button
//                         type="submit"
//                         disabled={loading}
//                         className="w-full py-2 mt-4 flex justify-center items-center gap-2 bg-violet-800 hover:bg-violet-700 disabled:opacity-70 rounded-lg text-slate-100 font-semibold shadow-md transition"
//                     >
//                         {loading ? (
//                         <>
//                             <Loader2 className="w-5 h-5 animate-spin" />
//                             Verifying...
//                         </>
//                         ) : (
//                         "Verify"
//                         )}
//                     </button>
//                 </form>

//                 <p className="text-center mt-6 text-sm text-slate-400">
//                     Try again <span onClick={() => router.push("/sign-up")}  className="text-violet-600 hover:text-violet-500 cursor-pointer">Login</span>
//                 </p>
//             </div>
//         </div>
//     )
// }


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
                <h1 className="text-3xl font-extrabold mb-2 text-center text-violet-600">
                CodePilot
                </h1>
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
                                        focus:outline-none focus:ring-2 focus:ring-violet-500 
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
                                bg-violet-600 hover:bg-violet-500 disabled:opacity-70 
                                rounded-lg text-slate-100 font-semibold shadow-md transition"
                    >
                        {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Verifying...
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
