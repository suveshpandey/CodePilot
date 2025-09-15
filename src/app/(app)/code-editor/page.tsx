"use client"

import LeftPanel from "@/components/primary-comps/LeftPanel";
import Loader from "@/components/secondary-comps/Loader";
import Navbar from "@/components/primary-comps/Navbar";
import RightPanel from "@/components/primary-comps/RightPanel";
import { codeSnippets } from "@/constants";
import { useAppContext } from "@/context/context";
import { executeCode } from "@/lib";
import { CloudCheck, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { BiSolidLeftArrow } from "react-icons/bi";
import { FilePlus , X } from "lucide-react";
import { getSession } from "next-auth/react";
import axios from "axios";


import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { toast } from "sonner";

type GeminiResponse = {
    output: string;
};

export default function CodeEditor() {
    const {code, setCode, output, selectedLanguage, setSelectedLanguage, setOutput, setOutputError, isLoading, setIsLoading, setPartialError, userCodeInput} = useAppContext();
    const [isModelOpen, setIsModelOpen] = useState<boolean>(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [addBlogLoading, setAddBlogLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [userId, setUserId] = useState<string>();
    const [aiFixLoading, setAIFixLoading] = useState(false);
    const [aiFixTopic, setAIFixTopic] = useState("");
    const [isAIFixModelOpen, setIsAIFixModelOpen] = useState(false);
    

    const handleRunCode = async () => {

        if (!code) {
            toast.warning("Please write some code before running.");
            return;
        }

        try {
            setIsLoading(true);
            setOutput(null);
            setOutputError(false);
            setPartialError(false);

            //@ts-ignore
            const { run: result } = await executeCode({
                sourceCode: code, 
                language: selectedLanguage,
                userInput: userCodeInput
            });

            if(result.stderr !== "") {
                setOutputError(true);
            }

            setOutput(result.output);

            if(result.signal === "SIGKILL") {
                setOutput("⚠ Execution terminated — Your program took too long or used too much memory (possible infinite loop or recursion).");
                setPartialError(true);
            }            
        } catch (error: any) {
            console.error("Execution error:", error);
            toast.error(
                error?.message || "🚨 Execution service unavailable. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    }  

    const handleAddBlog = async () => {
        console.log("save note called")
        try {
            if (!title || !description) {
                setError("Title and Description are required");
                return;
            }

            setAddBlogLoading(true);
            setError(null);

            const response = await axios.post("/api/notes", {
                title,
                description,
                code: code || null,
                userId: userId,
            });

            if (!response || response.status === 400) {
                setError("Failed to save the note, please try again");
                return;
            } else if (response.status === 201) {
                setSuccess(true);
                setAddBlogLoading(false);
                toast.success("Note saved successfully 🚀");
                // Reset form after a short delay
                setTimeout(() => {
                    setIsModelOpen(false);
                    setSuccess(false);
                    setTitle("");
                    setDescription("");
                    setCode("");
                }, 1500);
            }
        } catch (error) {
            console.log("Saving note failed, error: ", error);
            setError("Internal server error");
            setIsLoading(false);
            setError(null);
        }
    };

    const handleFixCode = async () => {
        const prompt = `
            You are a code fixer.
            The student's code is:

            ${code}
            --------
            The output is:
            ${output}
            --------
            The Code is about:
            ${aiFixTopic}
            --------
            Your task:
            - Identify and fix mistakes in the student's code.
            - Return ONLY the corrected code in the same programming language.
            - Do NOT include explanations, comments, markdown formatting (like \`\`\`), or extra text.
            - Output must be plain code only.
        `;


        try {
            if (!code || code === "") {
                toast.warning("Code not provided");
                return;
            }
            setAIFixLoading(true);
            const response = await axios.post<GeminiResponse>("/api/gemini", {
                prompt: prompt,
                model_name: "gemini-2.5-pro"
            });

            if (!response) {
                throw new Error("Failed to get response from gemini");
                toast.error("Failed to get response from gemini");
            }

            setCode(response.data.output);

        } catch (error: any) {
            if (error.isAxiosError) {
                toast.error(error.response?.data?.message || "API request failed");
            } else if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Unknown error occurred");
            }
        } finally {
            setAIFixLoading(false);
            setIsAIFixModelOpen(false);
        }
    }
    
    const fetchSession = async () => {
        const session = await getSession();
        setUserId(session?.user.id);
    };

    useEffect(() => {
        setSelectedLanguage("cpp");
        setCode(codeSnippets[selectedLanguage]);
        fetchSession();
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                e.preventDefault(); // avoid accidental form submissions
                handleRunCode();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [code, selectedLanguage]);


    return (
        <div className="min-h-screen h-auto w-full bg-gray-900 flex flex-col justify-start items-start gap-y-0">
            <div className="h-16 w-full">
                <Navbar />
            </div>
            
            <div className="h-[calc(100vh-4rem)] w-full max-h-screen flex flex-col gap-y-2 px-10 ">  
                <PanelGroup autoSaveId="example" direction="horizontal">
                    <Panel defaultSize={50} minSize={30}>
                        <LeftPanel />
                    </Panel>
                    
                    <PanelResizeHandle className="w-0.5 my-auto h-15 mx-2 transition-all duration-200 bg-slate-600 hover:bg-slate-400 rounded-full" />
                    
                    <Panel defaultSize={50} minSize={30}>
                        <RightPanel />    
                    </Panel>
                </PanelGroup>

                <div className="w-full bg-slate-900 flex items-center justify-center mb-2 gap-x-2">
                    <button 
                        onClick={() => setIsAIFixModelOpen(true)} 
                        disabled={aiFixLoading}
                        className=" w-26 h-10 border-1 disabled:cursor-no-drop border-yellow-600 hover:bg-yellow-500 shadow-2xs shadow-yellow-500 flex items-center justify-center gap-x-2 rounded-md text-yellow-500 hover:text-white font-semibold text-lg cursor-pointer transition-all duration-200 "
                        >
                        {aiFixLoading ? (
                            <Loader color={"yellow-500"} />
                        ) : (
                            <Sparkles />
                        )}
                        Fix
                    </button>
                    <button 
                        onClick={handleRunCode} 
                        disabled={isLoading}
                        className=" w-26 h-10 border-1 disabled:cursor-no-drop bg-green-600 border-green-600 hover:bg-green-500 shadow-sm shadow-green-800 flex items-center justify-center gap-x-2 rounded-md text-white hover:text-white font-semibold text-lg cursor-pointer transition-all duration-200 "
                        > 
                        {isLoading ? (
                            <Loader color={"white"} />
                        ) : (
                            <BiSolidLeftArrow />
                        )}
                        Run
                    </button>
                    <button 
                        onClick={() => setIsModelOpen(true)} 
                        disabled={isLoading}
                        className=" w-26 h-10 border-1 disabled:cursor-no-drop border-green-600 hover:bg-green-500 shadow-sm shadow-green-800 flex items-center justify-center gap-x-2 rounded-md text-green-500 hover:text-white font-semibold text-lg cursor-pointer transition-all duration-200 "
                    > 
                        <CloudCheck /> Save
                    </button>
                </div>

                {isModelOpen && (
                    <div className="fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm z-50 animate-fadeIn">
                        <div className="bg-gray-800 rounded-2xl shadow-2xl w-[95%] max-w-3xl p-8 relative text-white ">
                            {/* Close Button */}
                            <button
                                onClick={() => setIsModelOpen(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-red-400 transition cursor-pointer">
                                <X className="w-6 h-6" />
                            </button>
                            <div className="flex items-center gap-x-2 mb-6">
                                <FilePlus className="w-6 h-6 text-indigo-400" strokeWidth={3} />
                                <h2 className="text-2xl font-bold">Save New Note</h2>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <p className="text-red-400 mb-4 py-2 px-4 rounded-md text-sm bg-red-500/20">{error}</p>
                            )}

                            {/* Title */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full border border-gray-600 rounded-lg p-3 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Enter note title"
                                />
                            </div>

                            {/* Description */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full border border-gray-600 rounded-lg p-3 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    rows={3}
                                    placeholder="Enter note description"
                                />
                            </div>

                            {/* Code */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-300 mb-1">Code</label>
                                <textarea
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="w-full border border-gray-600 rounded-lg font-mono p-3 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    rows={6}
                                    placeholder="Enter code snippet"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 mt-6">
                                {/* Cancel */}
                                <button
                                    onClick={() => setIsModelOpen(false)}
                                    className="flex-1 bg-gray-600 hover:bg-gray-500 text-white rounded-lg py-3 font-medium transition disabled:opacity-50 cursor-pointer"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>

                                {/* Submit */}
                                <button
                                    onClick={handleAddBlog}
                                    disabled={loading || success}
                                    className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-3 font-medium transition cursor-pointer
                                        ${success
                                            ? "bg-green-600 hover:bg-green-500"
                                            : "bg-indigo-700 hover:bg-indigo-600"}
                                        ${addBlogLoading ? "opacity-70 cursor-not-allowed" : ""}
                                    `}
                                >
                                    {addBlogLoading && <Loader color={"#fff"} />}
                                    {success ? "Note Saved!" : "Save Note"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {isAIFixModelOpen && (
                    <div className="fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm z-50 animate-fadeIn">
                        <div className="bg-gray-800 rounded-2xl shadow-2xl w-[95%] max-w-3xl p-8 relative text-white ">
                            {/* Close Button */}
                            <button
                                onClick={() => setIsAIFixModelOpen(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-red-400 transition cursor-pointer">
                                <X className="w-6 h-6" />
                            </button>
                            <div className="flex items-center gap-x-2 mb-6">
                                <FilePlus className="w-6 h-6 text-indigo-400" strokeWidth={3} />
                                <h2 className="text-2xl font-bold">AI Code Fixer</h2>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <p className="text-red-400 mb-4 py-2 px-4 rounded-md text-sm bg-red-500/20">{error}</p>
                            )}

                            {/* Code */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-300 mb-1">What Does Your Code Do?</label>
                                <textarea
                                    value={aiFixTopic}
                                    onChange={(e) => setAIFixTopic(e.target.value)}
                                    className="h-20 w-full border border-gray-600 rounded-lg font-mono p-3 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    rows={6}
                                    placeholder="Type the purpose of your code here (e.g., factorial program, searching of an element)"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 mt-6">
                                {/* Cancel */}
                                <button
                                    onClick={() => setIsAIFixModelOpen(false)}
                                    className="flex-1 bg-gray-600 hover:bg-gray-500 text-white rounded-lg py-3 font-medium transition disabled:opacity-50 cursor-pointer"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>

                                {/* Submit */}
                                <button
                                    onClick={handleFixCode}
                                    disabled={loading || success}
                                    className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-3 font-medium transition cursor-pointer
                                        border-yellow-600 bg-yellow-600 hover:bg-yellow-500 shadow-sm shadow-yellow-500
                                    `}
                                >
                                    {aiFixLoading ? (
                                        <Loader color={"white"} />
                                    ) : (
                                        <Sparkles />
                                    )}
                                    Fix with AI
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}