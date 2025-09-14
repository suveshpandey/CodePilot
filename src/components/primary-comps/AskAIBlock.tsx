// "use client";

// import { useAppContext } from "@/context/context";
// import axios from "axios";
// import { useState } from "react";
// import { MessageCircleQuestion, Send, SendHorizonal } from "lucide-react";
// import Loader from "@/components/secondary-comps/Loader";
// import Markdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import rehypeHighlight from "rehype-highlight";
// import { toast } from "sonner";


// type GeminiResponse = {
//     output: string;
// };

// type Message = {
//     role: "user" | "ai";
//     content: string;

// };

// const SYSTEM_PROMPT = `
// You are a coding tutor. Give a brief, simple, accurate explanation.
// If needed, then output code ONLY between the markers in cpp language:
// ***CODE_START***
// \`\`\`<language>
// <code>
// \`\`\`
// ***CODE_END***
// `;


// export default function ChatPage() {
//     const { aiPrompt, setAiPrompt, isAiLoading, setIsAiLoading } = useAppContext();
//     const [messages, setMessages] = useState<Message[]>([]);

//     const handleSubmit = async () => {
//         if (!aiPrompt || !aiPrompt.trim()) {
//             toast.warning("Please enter a message before sending.");
//             return;
//         }

//         const userMessage: Message = { role: "user", content: aiPrompt };

//         setMessages((prev) => [...prev, userMessage]);
//         setIsAiLoading(true);
        
//         try {
//             const finalPrompt = `${SYSTEM_PROMPT}\n\nUser: ${aiPrompt}`;

//             const response = await axios.post<GeminiResponse>("/api/gemini", {
//                 prompt: finalPrompt,
//                 model_name: "gemini-2.5-pro",
//             });
            
//             if (!response || !response.data?.output) {
//                 toast.warning("Unexpected response from AI, try again.");
//                 throw new Error("Invalid response structure");
//             }

//             const aiMessage: Message = { role: "ai", content: response.data.output };
//             setMessages((prev) => [...prev, aiMessage]);
            
//         } catch (error: any) {
//             console.error("AI request error:", error);
            
//             if (error.isAxiosError) {
//                 toast.error(error.response?.data?.message || "API request failed");
//             } else if (error instanceof Error) {
//                 toast.error(error.message);
//             } else {
//                 toast.error("Unknown error occurred");
//             }
            
//             const errorMessage: Message = {
//                 role: "ai",
//                 content: "⚠️ Something went wrong while contacting AI.",
//             };
//             setMessages((prev) => [...prev, errorMessage]);

//         } finally {
//             setIsAiLoading(false);
//             setAiPrompt("");
//         }
//     };

//     return (
        
//         <div className="h-full w-full flex flex-col gap-y-3 justify-between items-center bg-slate-800 text-slate-300 p-3 rounded-md ">
//             {/* Chat Display - flex-1 makes it take remaining space */}
//             <div className=" h-full w-full flex-1 overflow-y-auto p-4 space-y-3">
//                 {messages.length > 0 ? (
//                     messages.map((msg, idx) => (
//                         <div
//                             key={idx}
//                             className={`flex flex-col w-full ${msg.role === "user" ? "items-end" : "items-start"}`}
//                         >
//                             <div
//                                 className={`w-full overflow-x-auto px-4 rounded-xl shadow-sm ${msg.role === "user" ? "max-w-[70%]" : "w-full"} break-words ${
//                                     msg.role === "user"
//                                         ? "bg-gray-700 text-slate-100 rounded-br-none"
//                                         : "bg-slate-700 text-slate-200 rounded-bl-none"
//                                 }`}
//                             >
//                                 <div className="reset-tw w-full overflow-x-auto px-0">
//                                     <Markdown 
//                                         remarkPlugins={[remarkGfm]} 
//                                         rehypePlugins={[rehypeHighlight]}>
                                        
//                                         {msg.content}
//                                     </Markdown>
//                                 </div>
//                             </div>
//                             {msg.role === "ai" && <div className="w-[100%] h-0.5 bg-slate-700 my-5 opacity-50"></div>}   
//                         </div>
//                     ))
//                 ) : (
//                     <div className="h-full w-full flex flex-col justify-center items-center text-slate-400">
//                         <MessageCircleQuestion size={60} />
//                         <p className="text-xl mt-2">Ask your doubt</p>
//                     </div>
//                 )}
//             </div>

//             <div className="md:w-140 w-[90%] flex flex-col gap-y-2">
//                 {isAiLoading && (
//                     <div className="relative w-[90%] mx-auto h-1 my-1 overflow-hidden rounded-full">
//                         <div className="absolute inset-0 w-full h-full animate-rainbowBlur" />
//                     </div>
//                 )}
//                 <div className="md:w-140 w-[90%] mx-auto rounded-full flex items-center  bg-slate-900 shadow-sm border border-slate-600 hover:border-slate-500 px-4 py-2 transition-colors duration-200">
//                     <input
//                         type="text"
//                         value={aiPrompt}
//                         disabled={isAiLoading}
//                         onChange={(e) => setAiPrompt(e.target.value)}
//                         onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
//                         placeholder="Enter your message..."
//                         className="flex-1 bg-transparent text-slate-300 outline-none px-2 disabled:cursor-no-drop"
//                     />
//                     <button
//                         onClick={handleSubmit}
//                         disabled={isAiLoading}
//                         className="flex items-center justify-center gap-1 text-slate-100 hover:text-slate-800 bg-slate-800 hover:bg-slate-300  px-3 py-3 rounded-full font-medium active:scale-95 transition disabled:opacity-50 cursor-pointer disabled:cursor-no-drop"
//                     >
//                         {isAiLoading ? <Loader color={"slate-400"} /> : <SendHorizonal size={18} />}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }


"use client";

import { useAppContext } from "@/context/context";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, Bot, User, Send, Sparkles, SendHorizonal } from "lucide-react";
import Loader from "@/components/secondary-comps/Loader";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { toast } from "sonner";

type GeminiResponse = {
    output: string;
};

type Message = {
    role: "user" | "ai";
    content: string;
    id: string;
};

const SYSTEM_PROMPT = `
You are a coding tutor. Give a brief, simple, accurate explanation.
If needed, then output code ONLY between the markers in cpp language:
***CODE_START***
\`\`\`<language>
<code>
\`\`\`
***CODE_END***
`;

export default function ChatPage() {
    const { aiPrompt, setAiPrompt, isAiLoading, setIsAiLoading } = useAppContext();
    const [messages, setMessages] = useState<Message[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSubmit = async () => {
        if (!aiPrompt || !aiPrompt.trim()) {
            toast.warning("Please enter a message before sending.");
            return;
        }

        const userMessage: Message = { 
            role: "user", 
            content: aiPrompt,
            id: Date.now().toString() + '-user'
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsAiLoading(true);
        setAiPrompt("");
        
        try {
            const finalPrompt = `${SYSTEM_PROMPT}\n\nUser: ${aiPrompt}`;

            const response = await axios.post<GeminiResponse>("/api/gemini", {
                prompt: finalPrompt,
                model_name: "gemini-2.5-pro",
            });
            
            if (!response || !response.data?.output) {
                toast.warning("Unexpected response from AI, try again.");
                throw new Error("Invalid response structure");
            }

            const aiMessage: Message = { 
                role: "ai", 
                content: response.data.output,
                id: Date.now().toString() + '-ai'
            };
            setMessages((prev) => [...prev, aiMessage]);
            
        } catch (error: any) {
            console.error("AI request error:", error);
            
            if (error.isAxiosError) {
                toast.error(error.response?.data?.message || "API request failed");
            } else if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Unknown error occurred");
            }
            
            const errorMessage: Message = {
                role: "ai",
                content: "⚠️ Sorry, I'm having trouble connecting right now. Please try again in a moment.",
                id: Date.now().toString() + '-error'
            };
            setMessages((prev) => [...prev, errorMessage]);

        } finally {
            setIsAiLoading(false);
        }
    };

    return (
        <div className="h-full w-full flex flex-col bg-slate-800 text-slate-200 overflow-hidden shadow-2xl">
            
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-900/30 to-slate-800/30">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col justify-center items-center text-slate-400">
                        <div className="relative mb-4">
                            <MessageCircle size={60} className="opacity-80" />
                        </div>
                        <p className="text-lg font-light">Ask me anything about coding</p>
                        <p className="text-sm mt-1 text-slate-500">I can help with algorithms, code examples, and more</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            {msg.role === "ai" && (
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mt-1">
                                    <Bot size={16} className="text-white" />
                                </div>
                            )}
                            
                            <div
                                className={`max-w-[80%] rounded-2xl px-4 shadow-lg overflow-x-auto ${
                                    msg.role === "user"
                                        ? " bg-gray-700 text-white rounded-br-md"
                                        : "bg-slate-700/80 border border-slate-600/50 rounded-bl-md"
                                }`}
                            >
                                <div className="reset-tw w-full overflow-x-auto px-0">
                                    <Markdown 
                                        remarkPlugins={[remarkGfm]} 
                                        rehypePlugins={[rehypeHighlight]}>
                                        
                                        {msg.content}
                                    </Markdown>
                                </div>
                            </div>
                            
                            {msg.role === "user" && (
                                <div className="flex-shrink-0 w-8  h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center mt-1">
                                    <User size={16} className="text-slate-300" />
                                </div>
                            )}
                        </div>
                    ))
                )}
                
                {/* Loading indicator */}
                {isAiLoading && (
                    <div className="flex gap-3 justify-start">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                            <Bot size={16} className="text-white" />
                        </div>
                        <div className="bg-slate-700/80 border border-slate-600/50 rounded-2xl rounded-bl-md p-4">
                            <div className="flex space-x-1.5">
                                <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* <div ref={messagesEndRef} /> */}
            </div>

            {/* Input Area */}
            <div className="p-4 ">
                <div className="flex w-[90%] xl:w-[70%] mx-auto items-center gap-2 bg-gray-900 backdrop-blur-sm rounded-full border border-slate-700/50 p-2 shadow-inner">
                    <input
                        ref={inputRef}
                        type="text"
                        value={aiPrompt}
                        disabled={isAiLoading}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSubmit()}
                        placeholder="Ask about code, algorithms, or programming concepts..."
                        className="flex-1 bg-transparent text-slate-200 outline-none placeholder-slate-500 px-4 py-2 disabled:opacity-50"
                    />
                    <button
                        onClick={handleSubmit}
                        disabled={isAiLoading || !aiPrompt?.trim()}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-md cursor-pointer"
                    >
                        {isAiLoading ? (
                            <Loader color="white" />
                        ) : (
                            <SendHorizonal size={18} />
                        )}
                    </button>
                </div>
                
            </div>
        </div>
    );
}