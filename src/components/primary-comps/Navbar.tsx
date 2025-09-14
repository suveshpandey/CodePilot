// 'use client';

// import { User, Sun, ChevronDown } from 'lucide-react';
// import { useEffect, useState } from 'react';
// import { usePathname, useRouter } from 'next/navigation';
// import { getSession } from 'next-auth/react';

// type NavOptions = "code-editor" | "my-notes" | "blogs" | "videos";

// export default function Navbar() {
//     const [selectedNav, setSelectedNav] = useState<NavOptions>("code-editor");
//     const [user, setUser] = useState<any>(null);
//     const router = useRouter();
//     const pathname = usePathname();

//     const handleSelectNav = (page: NavOptions) => {
//         router.push(`/${page}`);
//     }

//     useEffect(() => {
//         if(pathname.startsWith("/code-editor")) setSelectedNav("code-editor");
//         else if(pathname.startsWith("/my-notes")) setSelectedNav("my-notes");
//         else if(pathname.startsWith("/blogs")) setSelectedNav("blogs");
//         else if(pathname.startsWith("/videos")) setSelectedNav("videos");
//     }, [pathname])

//     useEffect(() => {
//         const fetchSession = async () => {
//         const session = await getSession();
//         setUser(session?.user);
//         };
//         fetchSession();
//     }, []);

//     return (
//         <nav className="h-16 w-full">
//             <div className="h-full mx-auto flex justify-between items-center">
//                 {/* Left: Logo */}
//                 <div className="h-full flex items-center gap-x-2">
//                     <img className="size-10" src="/code-pilot-icon.png" alt="" />
//                     <span className="text-2xl font-bold text-slate-200">CodePilot</span>
//                 </div>

//                 {/* Center: Nav Links */}
//                 <div className="flex bg-slate-800 px-10 rounded-full py-2 border-1 border-slate-600 space-x-8">
//                     <div
//                         onClick={() => handleSelectNav("code-editor")}
//                         className={`px-3 py-1 text-sm font-medium hover:text-indigo-400 ${selectedNav === "code-editor" ? "text-indigo-400 border-b border-b-indigo-400" : "text-white"} transition-all duration-200 cursor-pointer`}
//                     >
//                         IDE
//                     </div>
//                     <div
//                         onClick={() => handleSelectNav("my-notes")}
//                         className={`px-3 py-1 text-sm font-medium hover:text-indigo-400 ${selectedNav === "my-notes" ? "text-indigo-400 border-b border-b-indigo-400" : "text-white"} transition-all duration-200 cursor-pointer`}
//                     >
//                         My Notes
//                     </div>
//                     <div
//                         onClick={() => handleSelectNav("blogs")}
//                         className={`px-3 py-1 text-sm font-medium hover:text-indigo-400 ${selectedNav === "blogs" ? "text-indigo-400 border-b border-b-indigo-400" : "text-white"} transition-all duration-200 cursor-pointer`}
//                     >
//                         Blogs
//                     </div>
//                     <div
//                         onClick={() => handleSelectNav("videos")}
//                         className={`px-3 py-1 text-sm font-medium hover:text-indigo-400 ${selectedNav === "videos" ? "text-indigo-400 border-b border-b-indigo-400" : "text-white"} transition-all duration-200 cursor-pointer`}
//                     >
//                         Videos
//                     </div>
//                 </div>

//                 {/* Right: Theme + Profile */}
//                 <div className="h-full flex items-center space-x-3">
//                     <div className="p-2 rounded-md bg-slate-950 hover:bg-slate-700 text-slate-300 border-1 border-slate-600 transition-colors cursor-pointer">
//                         <Sun className="w-5 h-5" />
//                     </div>
//                     <div className='flex items-center justify-center gap-x-2 text-slate-300 bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-md border-1 border-slate-600 cursor-pointer group'>
//                         <div 
//                             onClick={() => router.push(`/user-profile/${user.username || user.email}`)}
//                             className="p-1 rounded-full bg-indigo-600/80 text-white transition-colors cursor-pointer group">
//                             <User className="w-5 h-5 text-indigo-200" />
//                         </div>
//                         <p className='font-semibold'>{user?.username || "User"}</p>
//                         <ChevronDown className='text-slate-400 size-5 group-hover:translate-y-0.5 transition-all duration-300' />
//                     </div>
                    
//                 </div>
//             </div>
//         </nav>
//     );
// }


"use client";

import { User, Sun, Moon, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getSession } from "next-auth/react";

type NavOptions = "code-editor" | "my-notes" | "blogs" | "videos";

export default function Navbar() {
    const [selectedNav, setSelectedNav] = useState<NavOptions>("code-editor");
    const [user, setUser] = useState<any>(null);
    const [darkMode, setDarkMode] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const handleSelectNav = (page: NavOptions) => {
        router.push(`/${page}`);
    };

    useEffect(() => {
        if (pathname.startsWith("/code-editor")) setSelectedNav("code-editor");
        else if (pathname.startsWith("/my-notes")) setSelectedNav("my-notes");
        else if (pathname.startsWith("/blogs")) setSelectedNav("blogs");
        else if (pathname.startsWith("/videos")) setSelectedNav("videos");
    }, [pathname]);

    useEffect(() => {
        const fetchSession = async () => {
        const session = await getSession();
            setUser(session?.user);
        };
        fetchSession();
    }, []);

    return (
            <nav className="h-16 w-full px-10">
                <div className="h-full mx-auto flex justify-between items-center">
                    {/* Left: Logo */}
                    <div className="flex items-center gap-x-2 cursor-pointer" onClick={() => router.push("/")}>
                    <img className="size-10" src="/code-pilot-icon.png" alt="CodePilot Logo" />
                    <span className="text-2xl font-bold text-slate-200">CodePilot</span>
                    </div>

                    {/* Center: Nav Links */}
                    <div className="hidden md:flex bg-slate-800/70 px-6 rounded-full py-2 border border-slate-600 space-x-4">
                        {[
                            { label: "IDE", value: "code-editor" },
                            { label: "My Notes", value: "my-notes" },
                            { label: "Blogs", value: "blogs" },
                            { label: "Videos", value: "videos" },
                        ].map((nav) => (
                            <div
                            key={nav.value}
                            onClick={() => handleSelectNav(nav.value as NavOptions)}
                            className={`px-4 py-1 text-sm font-medium rounded-full cursor-pointer transition-all duration-200
                                ${
                                selectedNav === nav.value
                                    ? "bg-indigo-500/20 text-indigo-400 border border-indigo-400"
                                    : "text-slate-300 hover:text-indigo-300"
                                }`}
                            >
                            {nav.label}
                            </div>
                        ))}
                    </div>

                    {/* Right: Theme + Profile */}
                    <div className="flex items-center gap-x-3">
                        <button
                            aria-label="Toggle theme"
                            onClick={() => setDarkMode(!darkMode)}
                            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 transition-colors"
                        >
                            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        <div
                            onClick={() => router.push(`/user-profile/${user?.username || user?.email}`)}
                            className="flex items-center gap-x-2 text-slate-200 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-full border border-slate-600 cursor-pointer transition-all group"
                        >
                            <div className="p-1 rounded-full bg-indigo-600/80 text-white">
                                <User className="w-5 h-5 text-indigo-200" />
                            </div>
                            <p className="font-semibold">{user?.username || "User"}</p>
                            <ChevronDown className="text-slate-400 size-4 group-hover:translate-y-0.5 transition-transform duration-200" />
                        </div>
                    </div>
                </div>
            </nav>
    );
}
