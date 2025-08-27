'use client';

import { Code2, User, Sun } from 'lucide-react';
import { useState } from 'react';

type NavOptions = "home" | "code-editor" | "code-reviewer" | "blogs";

export default function Navbar() {
    const [selectedNav, setSelectedNav] = useState<NavOptions>("code-editor");

    return (
        <nav className=" bg-slate-900 w-full">
            <div className="mx-auto">
                <div className="flex justify-between items-center h-16">
                {/* Left: Logo */}
                <div className="flex items-center flex-shrink-0">
                    <Code2 className="h-8 w-8 text-indigo-500" />
                    <span className="ml-2 text-xl font-bold text-white">CodePilot</span>
                </div>

                {/* Center: Nav Links */}
                <div className="hidden md:flex space-x-8">
                    <a
                    href="#"
                    onClick={() => setSelectedNav("home")}
                    className={`px-3 py-2 text-sm font-medium text-white hover:text-indigo-400 ${selectedNav === "home" && "border-b border-b-indigo-400"} transition-all duration-200`}
                    >
                        Home
                    </a>
                    <a
                    href="#"
                    onClick={() => setSelectedNav("code-editor")}
                    className={`px-3 py-2 text-sm font-medium text-white hover:text-indigo-400 ${selectedNav === "code-editor" && "border-b border-b-indigo-400"} transition-all duration-200`}
                    >
                        IDE
                    </a>
                    <a
                    href="#"
                    onClick={() => setSelectedNav("code-reviewer")}
                    className={`px-3 py-2 text-sm font-medium text-white hover:text-indigo-400 ${selectedNav === "code-reviewer" && "border-b border-b-indigo-400"} transition-all duration-200`}
                    >
                        Code Reviewer
                    </a>
                    <a
                    href="#"
                    onClick={() => setSelectedNav("blogs")}
                    className={`px-3 py-2 text-sm font-medium text-white hover:text-indigo-400 ${selectedNav === "blogs" && "border-b border-b-indigo-400"} transition-all duration-200`}
                    >
                        Blogs
                    </a>
                </div>

                {/* Right: Theme + Profile */}
                <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer">
                        <Sun className="w-5 h-5" />
                    </div>
                    <div className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 transition-colors cursor-pointer">
                        <User className="w-5 h-5" />
                    </div>
                </div>
                </div>
            </div>
        </nav>
    );
}
