"use client";

import Navbar from "@/components/primary-comps/Navbar";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import Loader from "@/components/secondary-comps/Loader";
import { YoutubeResponse, YoutubeVideo } from "@/youtubeTypes";
import { Search } from "lucide-react";

export default function VideosPage() {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [nextPageToken, setNextPageToken] = useState<string | null>(null);
    const [videos, setVideos] = useState<YoutubeVideo[]>([]);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [initialLoadComplete, setInitialLoadComplete] = useState<boolean>(false);
    const [currentEndpoint, setCurrentEndpoint] = useState<string>("/api/youtube/coding");

    const observerTarget = useRef<HTMLDivElement>(null);

    const fetchVideos = async (endPoint: string, loadMore: boolean = false) => {
        try {
            if (loadMore) {
                setLoadingMore(true);
            } else {
                setLoading(true);
                setInitialLoadComplete(false);
            }

            //Add pageToken to endpoint if it exists
            let apiUrl = endPoint;
            const separator = apiUrl.includes('?') ? '&' : '?';
            if (loadMore && nextPageToken) {
                apiUrl += `${separator}pageToken=${nextPageToken}`;
            }

            const res = await axios.get<YoutubeResponse>(apiUrl);

            if (loadMore) {
                setVideos((prev) => [...prev, ...res.data.items]);
            } else {
                setVideos(res.data.items);
            }
        
            setNextPageToken(res.data.nextPageToken || null);
            setHasMore(!!res.data.nextPageToken);
        } catch (error) {
            console.error("Error fetching videos: ", error);
            setHasMore(false);
        } finally {
            setLoading(false);
            setLoadingMore(false);
            if (!loadMore) {
                setInitialLoadComplete(true);
            }
        }
    };

    const handleSearch = () => {
        if (searchQuery.trim() === "") {
            setCurrentEndpoint("/api/youtube/coding");
            setVideos([]);
            fetchVideos(currentEndpoint, false);
        } else {
            const searchEndpoint = `/api/youtube/search?q=${encodeURIComponent(searchQuery)}`;
            setVideos([]);
            fetchVideos(searchEndpoint, false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if(e.key === 'Enter') {
            handleSearch();
        }
    };

    // Infinite scroll observer callback
    const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !loading && !loadingMore) {
            if (searchQuery === "") {
                fetchVideos("/api/youtube/coding", true);
            } else {
                fetchVideos(`/api/youtube/search?q=${searchQuery}`, true);
            }
        }
    }, [hasMore, loading, loadingMore, nextPageToken]);

    // Setup intersection observer
    useEffect(() => {
        const observer = new IntersectionObserver(handleObserver, {
            root: null,
            rootMargin: "20px",
            threshold: 0.1
        });

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        }
    }, [handleObserver])

    // Initial fetch
    useEffect(() => {
        fetchVideos("/api/youtube/coding", false);
    }, []);

    return (
        <div className="h-screen w-full bg-gray-900 text-slate-300 flex flex-col">
            {/* Fixed Header */}
            <div className="fixed top-0 left-0 w-full z-50">
                {/* Navbar */}
                <div className="h-16 flex items-center">
                    <Navbar />
                </div>

                {/* Search bar */}
                <div className="px-10 py-3 bg-gray-900 flex items-end justify-end">
                    <div className="h-12 relative w-full max-w-md flex border border-slate-600 rounded-full overflow-hidden hover:ring-1 hover:ring-indigo-700 shadow-md transition-all duration-200 ">
                        <input
                        type="text"
                        value={searchQuery}
                        onKeyDown={handleKeyPress}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search videos..."
                        className="w-full h-full px-6 bg-slate-800 text-slate-200 placeholder-slate-500  outline-none "
                        />
                        <button 
                            onClick={() => {
                                handleSearch();
                            }}
                            className="h-full bg-slate-700 px-6 cursor-pointer hover:bg-slate-600">
                            <Search />
                        </button>
                    </div>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto mt-40 px-10 pb-10">
                {loading && (
                <div className="w-full flex justify-center items-center">
                    <Loader color={"slate-300"} />
                </div>
                )}

                {/* Video Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map((video, i) => {
                        const videoId =
                        typeof video.id === "string"
                            ? video.id
                            : video.id?.videoId || (video as any).id;

                        return (
                        <div
                            key={i}
                            className="bg-slate-800 rounded-xl hover:shadow-md shadow-slate-950 hover:scale-102 transition-all duration-300 ease-in-out overflow-hidden flex flex-col "
                        >
                            {/* Responsive 16:9 video */}
                            <div className="relative w-full pt-[56.25%]">
                                <iframe
                                    className="absolute top-0 left-0 w-full h-full"
                                    src={`https://www.youtube.com/embed/${videoId}`}
                                    title={video.snippet.title}
                                    allowFullScreen
                                ></iframe>
                            </div>

                            <div className="p-3">
                                <h2 className="text-sm font-medium text-slate-200 line-clamp-2">
                                    {video.snippet.title}
                                </h2>
                                <p className="text-xs text-slate-400 mt-1">
                                    {video.snippet.channelTitle}
                                </p>
                            </div>
                        </div>
                        );
                    })}
                </div>
                {initialLoadComplete && (
                    <div
                        ref={observerTarget}
                        className="h-20 flex items-center justify-center"
                    >
                        {loadingMore && (
                            <div className="py-4">
                                <Loader color={"slate-300"} />
                            </div>
                        )}
                        {!hasMore && videos.length > 0 && (
                            <div className="py-4 text-slate-300 text-sm">
                                No more videos to load
                            </div>
                        )}
                    </div>
                )}
                
            </div>
        </div>
    );
}
