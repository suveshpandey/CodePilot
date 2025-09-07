"use client";

import axios from "axios";
import { ChevronLeft, Trash2, User, Calendar, Code2, Copy, Check } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { getSession } from "next-auth/react";
import { toast } from "sonner";
import Loader from "@/components/secondary-comps/Loader";

type NoteType = {
    id: string,
    title: string,
    description: string,
    code?: string | null,
    createdAt: Date,
    userId: string,
} 

export default function DisplayBlog() {
    const [note, setNote] = useState<NoteType | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [userId, setUserId] = useState<string>();
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [copied, setCopied] = useState<boolean>(false);

    const router = useRouter();
    const params = useParams<{id: string}>();
    const id = params.id;

    const fetchBlogDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get<{note: NoteType}>(`/api/notes/note/${id}`);
            if (!response) {
                toast.error("Unable to fetch blog details, please refresh the page");
            } else if (response.status === 404) {
                toast.error("Blog not found");
            } 
            setNote(response.data.note);
        } catch (error) {
            console.log("Failed to fetch the blog, error: ", error);
            toast.error("Internal server error, please try again");
        } finally {
            setLoading(false);
        }
    }

    const deleteBlog = async () => {
        if (!confirm("Are you sure you want to delete this note? This action cannot be undone.")) return;
        
        try {
            setIsDeleting(true);
            const response = await axios.delete(`/api/notes/note/${id}`);
            if (response.status === 200) {
                toast.success("Note deleted successfully!");
                router.back();
            }
        } catch (error: any) {
            console.log("Note deletion failed, error: ", error);
            if (error?.response?.status === 403) {
                toast.error("You don't have permission to delete this note");
            } else if (error?.response?.status === 404) {
                toast.error("Note not found");
            } else {
                toast.error("Internal server error");
            }
        } finally {
            setIsDeleting(false);
        }
    }

    const copyToClipboard = () => {
        if (!note?.code) return;
        
        navigator.clipboard.writeText(note.code)
            .then(() => {
                setCopied(true);
                toast.success("Code copied to clipboard!");
                setTimeout(() => setCopied(false), 2000);
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
                toast.error("Failed to copy code");
            });
    };

    const formatDate = (date: Date | undefined) => {
        if (!date) return;
        return new Date(date).toLocaleDateString('en-us', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const fetchSession = async () => {
        const session = await getSession();
        setUserId(session?.user.id);
    };

    useEffect(() => {
        fetchSession();
        fetchBlogDetails();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <Loader color="white" />
                    <p className="mt-4 text-slate-300">Loading your note...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 to-slate-800 text-slate-300">
            {/* Header with Back button */}
            <div className="w-full px-6 py-4 bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/30">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer group"
                    >
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Back to My-Notes
                    </button>
                    
                    {userId === note?.userId && (
                        <button 
                            onClick={deleteBlog}
                            disabled={isDeleting}
                            className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader color="red-300" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 size={18} />
                                    Delete Blog
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>

            {/* Blog Content */}
            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                    {note?.title}
                </h1>

                {/* Author + Date */}
                <div className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                            <Calendar className="text-purple-400" size={18} />
                        </div>
                        <span className="text-slate-300">Saved on</span>
                        <span className="text-purple-300">{formatDate(note?.createdAt)}</span>
                    </div>
                </div>

                {/* Description */}
                <div className="mb-10 p-6 bg-slate-800/20 rounded-xl border border-slate-700/30">
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                        Description
                    </h2>
                    <div className="overflow-x-auto">
                        <pre className="text-lg leading-relaxed text-slate-300">{note?.description}</pre>
                    </div>
                </div>

                {/* Code Block */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                            <Code2 className="text-yellow-400" size={20} />
                            Code Snippet
                        </h2>
                    </div>
                    
                    <div className="relative bg-slate-800/40 rounded-xl shadow-xl overflow-hidden border border-slate-700/50 group">
                        {/* Copy Button */}
                        <button
                            onClick={copyToClipboard}
                            className="absolute top-3 right-3 z-10 p-2 bg-slate-700/80 hover:bg-slate-600/90 rounded-md transition-all duration-200 cursor-pointer"
                            aria-label="Copy code to clipboard"
                        >
                            {copied ? (
                                <Check className="w-4 h-4 text-green-400" />
                            ) : (
                                <Copy className="w-4 h-4 text-slate-300" />
                            )}
                        </button>
                        
                        <SyntaxHighlighter
                            language="cpp"
                            style={oneDark}
                            customStyle={{
                                margin: 0,
                                padding: "24px",
                                fontSize: "0.95rem",
                                background: "transparent",
                                borderRadius: "0.75rem",
                            }}
                            wrapLongLines={true}
                        >
                            {note?.code?.trim() || "// No code provided"}
                        </SyntaxHighlighter>
                    </div>
                </div>
            </div>
        </div>
    );
}