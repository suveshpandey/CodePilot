"use client";

import axios from "axios";
import { ChevronLeft } from "lucide-react";
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

    const router = useRouter();
    const params = useParams<{id: string}>();
    const id = params.id;

    const fetchBlogDetails = async () => {
        try {
            const response = await axios.get<{blog: BlogType}>(`/api/blogs/${id}`);
            if (!response) {
                toast.error("Unable to fetch blog details, please refresh the page");
            } else if (response.status === 404) {
                toast.error("Blog not found");
            } 
            setBlog(response.data.blog);
            console.log(blog);
        } catch (error) {
            console.log("Failed to fetch the blog, error: ", error);
            toast.error("Internal server error, please try again");
        }
    }

    const deleteBlog = async () => {
        try {
            setLoading(true);
            const response = await axios.delete(`/api/blogs/${id}`);
            if (response.status === 200) {
                toast.success("Blog deleted!");
                setLoading(false);
                router.back();
            }
        } catch (error: any) {
            console.log("Blog post failed, error: ", error);
            setLoading(false);
            if (error?.response?.status === 403) {
                toast.error("You don't have permission to delete this blog");
            } else if (error?.response?.status === 404) {
                toast.error("Blog not found");
            } else {
                toast.error("Internal server error");
            }
        }
    }

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

    return (
        <div className="min-h-screen w-full bg-slate-900 text-slate-300">
            {/* Header with Back button */}
            <div className="h-16 w-full flex items-center px-20 bg-slate-800 border-b border-slate-700">
                <button
                onClick={() => router.back()}
                className="flex items-center text-slate-400 hover:text-slate-200 hover:bg-slate-700 px-4 py-1 rounded-md transition-colors cursor-pointer"
                >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Back
                </button>
            </div>

            {/* Blog Content */}
            <div className="max-w-4xl mx-auto px-6 py-10">
                {/* Title */}
                <h1 className="text-4xl font-extrabold text-white mb-4 leading-tight">
                {blog?.title}
                </h1>

                {/* Author + Date */}
                <p className="text-slate-400 text-sm mb-8">
                Posted by{" "}
                <span className="text-indigo-400 font-medium">{blog?.user.username}</span>{" "}
                on <span className="text-indigo-300">{formatDate(blog?.createdAt)}</span> 
                </p>

                {/* Description */}
                <p className="text-lg leading-relaxed mb-8">{blog?.description}</p>

                {/* Code Block */}
                <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
                    <SyntaxHighlighter
                        language="cpp"
                        style={oneDark}
                        customStyle={{
                        margin: 0,
                        padding: "20px",
                        fontSize: "0.9rem",
                        background: "transparent",
                        }}
                    >
                        {blog?.code?.trim() || ""}
                    </SyntaxHighlighter>
                </div>
            </div>
            {userId === blog?.userId && 
                <button 
                onClick={() => {
                    deleteBlog()
                }}
                className="bg-gray-300 hover:bg-red-300 text-slate-700 font-semibold p-3 rounded-lg flex items-center justify-center gap-x-2 fixed bottom-5 right-5 cursor-pointer transition-colors duration-200">
                    {
                        loading ? <>
                            <Loader color={"slate-700"} />
                            Deleting Blog
                        </> : <>
                            Delete Blog
                        </>
                    }
                </button>
            }
        </div>
    );
}
