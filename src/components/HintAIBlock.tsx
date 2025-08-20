"use client"
import { useAppContext } from "@/context/context"
import axios from "axios";

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import Loader from "./Loader";
import { Lightbulb, MessageSquareDashed } from "lucide-react"; // icons

type GeminiResponse = {
    output: string;
};

type Message = {
    role: "user" | "ai";
    content: string;
};

// Sub-block of "Error Analysis Section"
export default function ErrorHintsBlock() {
    const { code, isAiLoading, setIsAiLoading, output, userCodeOutput, setUserCodeOutput, aiHints, setAiHints } = useAppContext();

    const handleSubmit = async () => {
        if (output === userCodeOutput) return;

        const prompt = `
        You are a coding tutor.
        The student's code is:

        ${code}
        --------
        The expected output is:
        ${userCodeOutput}
        --------
        The actual output is:
        ${output}
        --------
        Analyze the difference and give ONLY hints (not full code, not explanations).
        Hints must be in an unordered list format.
        Do not return anything except hints.
        `;

        setIsAiLoading(true);

        try {
        const response = await axios.post<GeminiResponse>("/api/gemini", {
            prompt: prompt,
            model_name: "gemini-2.5-pro",
        });

        if (!response) throw new Error("Failed to get response from gemini");

        setAiHints(response.data.output);
        } catch (error: any) {
        const errorMessage: Message = { role: "ai", content: `⚠️ Api error: ${error.message}` };
        return errorMessage;
        } finally {
        setIsAiLoading(false);
        }
    };

    return (
        <div className="w-full h-full p-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-200">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            Error Analysis
            </h3>
        </div>

        {/* Main Content */}
        <div className="flex items-start justify-start flex-1">
            {/* Left Side */}
            <div className="w-[50%] p-4 flex flex-col items-start justify-between">
            <p className="text-slate-400 mb-2 text-md font-medium">
                Expected output:
            </p>
            <div className="h-full w-full gap-y-10 flex flex-col items-center justify-between">
                <textarea
                name="user-outout"
                id="user-output"
                value={userCodeOutput}
                onChange={(e) => setUserCodeOutput(e.target.value)}
                placeholder="elements: 3, 0, -1, 2"
                className="w-[70%] p-3 rounded-md bg-slate-900 text-slate-200 placeholder-slate-500 border border-slate-600 focus:border-slate-400 focus:outline-none transition-colors"
                />
                <button
                onClick={handleSubmit}
                className="bg-slate-300 hover:bg-slate-200 text-slate-900 w-40 h-10 rounded-full font-medium cursor-pointer shadow-sm transition"
                >
                Get Hints
                </button>
            </div>
            </div>

            {/* Divider */}
            <div className="w-0.5 h-full bg-slate-700"></div>

            {/* Right Side */}
            <div className="w-[50%] h-full px-4 flex flex-col items-start justify-start">
            <span className="flex items-center gap-2 bg-green-900/40 border border-green-500/60 px-4 py-1.5 rounded-lg text-green-200 font-medium shadow-sm mb-4">
                <Lightbulb className="w-4 h-4 text-green-400" />
                Hints
            </span>

            {isAiLoading ? (
                <div className="h-full w-full flex items-center justify-center">
                    <Loader color={"slate-600"} />
                </div>
            ) : aiHints && aiHints.trim().length > 0 ? (
                <div className="reset-tw h-full w-full overflow-x-auto px-0 flex flex-col gap-y-4">
                <Markdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                >
                    {aiHints}
                </Markdown>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full w-full text-slate-500 gap-2">
                <MessageSquareDashed className="w-10 h-10 text-slate-500" />
                <p className="text-sm">No hints yet. Click <span className="text-slate-300 font-medium">Get Hints</span> to generate.</p>
                </div>
            )}
            </div>
        </div>
        </div>
    );
}
