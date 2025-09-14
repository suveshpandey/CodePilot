"use client";

import axios from "axios";
import { ChevronLeft, Trash2, User, Calendar, Code2, Copy, Check, PenBox, X, FilePen, FilePlus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { getSession } from "next-auth/react";
import { toast } from "sonner";
import Loader from "@/components/secondary-comps/Loader";

type BlogType = {
    id: string,
    title: string,
    description: string,
    code?: string | null,
    createdAt: Date,
    userId: string,
    user: {
        username: string,
        email: string,
    },
} 

export default function DisplayBlog() {
    const [blog, setBlog] = useState<BlogType | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [userId, setUserId] = useState<string>();
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [copied, setCopied] = useState<boolean>(false);
    const [isModelOpen, setIsModelOpen] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [code, setCode] = useState("");
    const [success, setSuccess] = useState(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);


    const router = useRouter();
    const params = useParams<{id: string}>();
    const id = params.id;

    const fetchBlogDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get<{blog: BlogType}>(`/api/blogs/${id}`);
            if (!response) {
                toast.error("Unable to fetch blog details, please refresh the page");
            } else if (response.status === 404) {
                toast.error("Blog not found");
            } 
            setBlog(response.data.blog);
        } catch (error) {
            console.log("Failed to fetch the blog, error: ", error);
            toast.error("Internal server error, please try again");
        } finally {
            setLoading(false);
        }
    }

    const deleteBlog = async () => {
        try {
            setIsDeleting(true);
            const response = await axios.delete(`/api/blogs/${id}`);
            if (response.status === 200) {
                toast.success("Blog deleted successfully!");
                router.back();
            }
        } catch (error: any) {
            console.log("Blog post failed, error: ", error);
            if (error?.response?.status === 403) {
                toast.error("You don't have permission to delete this blog");
            } else if (error?.response?.status === 404) {
                toast.error("Blog not found");
            } else {
                toast.error("Internal server error");
            }
        } finally {
            setIsDeleting(false);
        }
    }

    const copyToClipboard = () => {
        if (!blog?.code) return;
        
        navigator.clipboard.writeText(blog.code)
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

    const handleEditBlog = async () => {
        try {
            if (!title || !description) {
                setError("Title and Description are required");
                return;
            }

            setIsEditing(true);
            setError(null);

            const response = await axios.put(`/api/blogs/${id}`, {
                title,
                description,
                code: code || null,
                userId: userId,
            });

            if (!response || response.status === 400) {
                setError("Failed to edit the note, please try again");
                return;
            } else if (response.status === 200) {
                setSuccess(true);
                setIsEditing(false);
                toast.success("Note updated successfully 🚀");
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
            console.log("Updating note failed, error: ", error);
            setError("Internal server error");
            setError(null);
        } finally {
            fetchBlogDetails();
        }
    };

    useEffect(() => {
        setTitle(blog?.title || "")
        setDescription(blog?.description || "")
        setCode(blog?.code || "")
    }, [blog, isModelOpen])

    useEffect(() => {
        fetchSession();
        fetchBlogDetails();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen w-full bg-slate-900 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <Loader color="white" />
                    <p className="mt-4 text-slate-300">Loading blog post...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-slate-900 text-slate-300">
            {/* Header with Back button */}
            <div className="w-full px-6 py-4 bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/30">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer group"
                    >
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Back to Blogs
                    </button>
                    
                    {userId === blog?.userId && (
                        <div className="flex gap-x-2">
                            <button 
                                onClick={() => setIsModelOpen(true)}
                                disabled={isDeleting}
                                className="flex items-center gap-2 bg-gray-500/50 hover:bg-gray-500/60 text-gray-300 hover:text-gray-200 px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isDeleting ? (
                                    <>
                                        <Loader color="red-300" />
                                        Editing...
                                    </>
                                ) : (
                                    <>
                                        <PenBox size={18} />
                                        Edit Blog
                                    </>
                                )}
                            </button>
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
                        </div>
                    )}
                </div>
            </div>

            {/* Blog Content */}
            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                    {blog?.title}
                </h1>

                {/* Author + Date */}
                <div className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <User className="text-blue-400" size={18} />
                        </div>
                        <span className="text-slate-300">Posted by</span>
                        <span className="text-blue-400 font-medium">{blog?.user.username}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                            <Calendar className="text-purple-400" size={18} />
                        </div>
                        <span className="text-slate-300">on</span>
                        <span className="text-purple-300">{formatDate(blog?.createdAt)}</span>
                    </div>
                </div>

                {/* Description */}
                <div className="mb-10 p-6 bg-slate-800/20 rounded-xl border border-slate-700/30">
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                        Description
                    </h2>
                    <div className="overflow-x-auto">
                        <pre className="text-lg leading-relaxed text-slate-300">{blog?.description}</pre>
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
                                backgroundColor: "transparent",
                                margin: 0,
                                padding: "24px",
                                fontSize: "0.95rem",
                                background: "transparent",
                                borderRadius: "0.75rem",
                            }}
                            wrapLongLines={true}
                        >
                            {blog?.code?.trim() || "// No code provided"}
                        </SyntaxHighlighter>
                    </div>
                </div>
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
                            <h2 className="text-2xl font-bold">Save New Blog</h2>
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
                                placeholder="Enter blog title"
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
                                placeholder="Enter blog description"
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
                                onClick={handleEditBlog}
                                disabled={loading || success}
                                className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-3 font-medium transition cursor-pointer
                                    ${success
                                        ? "bg-green-600 hover:bg-green-500"
                                        : "bg-indigo-700 hover:bg-indigo-600"}
                                    ${isEditing ? "opacity-70 cursor-not-allowed" : ""}
                                `}
                            >
                                {isEditing && <Loader color={"#fff"} />}
                                {success ? "Blog Updated!" : "Update Blog"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}