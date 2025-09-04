'use client';

import { User, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react';

type NavOptions = "dashboard" | "code-editor" | "code-reviewer" | "blogs";

export default function Navbar() {
    const [selectedNav, setSelectedNav] = useState<NavOptions>("code-editor");
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchSession = async () => {
        const session = await getSession();
        setUser(session?.user);
        };
        fetchSession();
    }, []);

    return (
        <nav className=" bg-slate-900 h-16 w-full">
            <div className="h-full mx-auto flex justify-between items-center">
                {/* Left: Logo */}
                <div className="flex items-center gap-x-2">
                    <img className="size-10" src="/code-pilot-icon.png" alt="" />
                    <span className="text-2xl font-bold text-slate-200">CodePilot</span>
                </div>

                {/* Center: Nav Links */}
                <div className="hidden md:flex bg-slate-800 px-10 rounded-full py-2 border-1 border-slate-600 space-x-8">
                    <a
                    onClick={() => {
                        setSelectedNav("dashboard")
                        router.push("/dashboard")
                    }}
                    className={`px-3 py-1 text-sm font-medium hover:text-indigo-400 ${selectedNav === "dashboard" ? "text-indigo-400 border-b border-b-indigo-400" : "text-white"} transition-all duration-200 cursor-pointer`}
                    >
                        Home
                    </a>
                    <a
                    onClick={() => {
                        setSelectedNav("code-editor")
                        router.push("/code-editor")
                    }}
                    className={`px-3 py-1 text-sm font-medium hover:text-indigo-400 ${selectedNav === "code-editor" ? "text-indigo-400 border-b border-b-indigo-400" : "text-white"} transition-all duration-200 cursor-pointer`}
                    >
                        IDE
                    </a>
                    <a
                    onClick={() => {
                        setSelectedNav("code-reviewer")
                        router.push("/code-reviewer")
                    }}
                    className={`px-3 py-1 text-sm font-medium hover:text-indigo-400 ${selectedNav === "code-reviewer" ? "text-indigo-400 border-b border-b-indigo-400" : "text-white"} transition-all duration-200 cursor-pointer`}
                    >
                        Code Reviewer
                    </a>
                    <a
                    onClick={() => {
                        setSelectedNav("blogs")
                        router.push("/blogs")
                    }}
                    className={`px-3 py-1 text-sm font-medium hover:text-indigo-400 ${selectedNav === "blogs" ? "text-indigo-400 border-b border-b-indigo-400" : "text-white"} transition-all duration-200 cursor-pointer`}
                    >
                        Blogs
                    </a>
                </div>

                {/* Right: Theme + Profile */}
                <div className="flex bg-slate-800 px-5 rounded-full py-1 border-1 border-slate-600 items-center space-x-3">
                    <div className="p-2 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer">
                        <Sun className="w-5 h-5" />
                    </div>
                    <div 
                        onClick={() => router.push(`/user-profile/${user.username || user.email}`)}
                        className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 transition-colors cursor-pointer">
                        <User className="w-4 h-4" />
                    </div>
                </div>
            </div>
        </nav>
    );
}
