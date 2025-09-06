"use client"

import BlogCard from "@/components/primary-comps/BlogCard";
import Navbar from "@/components/primary-comps/Navbar";
import { useEffect, useState } from "react";
import { BiAddToQueue } from "react-icons/bi";
import { FilePlus , X } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import Loader from "@/components/secondary-comps/Loader";

type BlogType = {
    id: string,
    title: string,
    description: string,
    code?: string | null,
    createdAt: string,
    user: {
        username: string,
        email: string,
    },
}  

export default function Blogs() {
    const [isModelOpen, setIsModelOpen] = useState<boolean>(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [addBlogLoading, setAddBlogLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [blogs, setBlogs] = useState<BlogType[]>([]);
    const [searchInput, setSearchInput] = useState("");

    
    const filteredBlogs = blogs.filter((blog) =>
    `   ${blog.title} ${blog.description} ${blog.code || ""}`
        .toLowerCase()
        .includes(searchInput.toLowerCase())
    );

    const handleAddBlog = async () => {
        try {
            if (!title || !description) {
                setError("Title and Description are required");
                return;
            }

            setAddBlogLoading(true);
            setError(null);

            const response = await axios.post("/api/blogs", {
                title,
                description,
                code: code || null,
            });

            if (!response || response.status === 400) {
                setError("Failed to post the blog, please try again");
                return;
            } else if (response.status === 201) {
                setSuccess(true);
                setAddBlogLoading(false);
                toast.success("Blog posted successfully 🚀");
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
            console.log("Blog post failed, error: ", error);
            setError("Internal server error");
        }
        finally {
            fetchBlogs();
        }
    };

    const fetchBlogs  = async () => {
        try {
            setLoading(true);
            const response = await axios.get<{blogs: BlogType[]}>("/api/blogs");
            if (!response) {
                toast.error("Failed to fetch blogs, please refresh the page");
                return;
            } else if (response.status === 200) {
                setBlogs(response.data.blogs);
                setLoading(false);
            }
        } catch (error) {
            console.log("Blog fetch failed, error: ", error);
            setError("Internal server error");
        }
    }

    useEffect(() => {
        fetchBlogs();
    }, [])

    if (!isModelOpen && loading) {
        return (
            <div className="h-screen w-full bg-slate-900 text-slate-300 flex flex-col items-center justify-center gap-y-2">
                <Loader color={"slate-300"} />
                <h1>Gathering insightful blogs...</h1>
            </div>
        )
    }

    return (
        <div className="h-screen w-full px-10 bg-gray-900 flex flex-col justify-start gap-y-2">
            {/* Navbar */}
            <div className="h-[8%] w-full fixed top-0 left-0 px-10">
                <Navbar />
            </div>

            {loading && <div className="h-screen w-full bg-slate-900">
                <Loader color={"slate-300"} />
            </div>}
            
            
            <div className="w-full flex justify-end mt-20">
                <div className="relative w-full max-w-md">
                    {/* Search Icon */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" />
                    </svg>

                    {/* Input */}
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Search blogs..."
                        className="w-full h-12 pl-12 pr-5 rounded-full bg-slate-800 text-slate-200 placeholder-slate-500 border border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 outline-none shadow-md transition-all duration-200"
                    />
                </div>
            </div>


            {/* Blogs Grid */}
            {
                blogs.length > 0 ? <div className="h-auto w-full pt-10 pb-10 grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 justify-start items-center gap-y-7 overflow-y-auto">
                    {/* { blogs.length > 0 && ( 
                        blogs.map((blog) => (
                            <BlogCard
                                key={blog.id}
                                id={blog.id}
                                title={blog.title}
                                description={blog.description}
                                code={blog.code || ""}
                                postedBy={blog.user.username}
                                postedOn={new Date(blog.createdAt)}
                                setLoading={setLoading}
                            />
                        )))} */}
                        {filteredBlogs.map((blog) => (
                            <BlogCard
                                key={blog.id}
                                id={blog.id}
                                title={blog.title}
                                description={blog.description}
                                code={blog.code || ""}
                                postedBy={blog.user.username}
                                postedOn={new Date(blog.createdAt)}
                                setLoading={setLoading}
                            />
                        ))}
                </div> : <div className="h-full w-full flex items-center justify-center text-slate-300">No blogs found</div>
            }
        
            {/* Floating Add Button */}
            <button
                onClick={() => setIsModelOpen(true)}
                className="bg-indigo-700 hover:bg-indigo-600 size-15 fixed bottom-10 right-10 rounded-full text-white flex justify-center items-center cursor-pointer shadow-lg transition-transform hover:scale-105">
                <BiAddToQueue className="text-3xl" />
            </button>

            {/* Add Blog Modal */}
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
                            <h2 className="text-2xl font-bold">Post New Blog</h2>
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
                                {success ? "Blog Posted!" : "Post Blog"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
