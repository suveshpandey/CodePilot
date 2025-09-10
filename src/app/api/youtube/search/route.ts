import { YoutubeResponse } from "@/youtubeTypes";
import axios from "axios";
import { NextResponse } from "next/server";
import cache from "@/libs/cache";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "coding tutorial";
    const pageToken = searchParams.get("pageToken") || "";
    const apiKey = process.env.YOUTUBE_API_KEY;

    // Create a unique cache key based on search query and page token
    const cacheKey = `youtube-search-${encodeURIComponent(query)}-${pageToken}`;

    // Check if data is in cache
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
        console.log("Serving from cache:", cacheKey);
        return NextResponse.json(cachedData);
    }

    try {
        const res = await axios.get<YoutubeResponse>(
            "https://www.googleapis.com/youtube/v3/search",
            {
                params: {
                    part: "snippet",
                    type: "video",
                    videoDuration: ["medium", "long"],
                    maxResults: 12,
                    fields: 'items(id,snippet(title,channelTitle)),nextPageToken',
                    q: query,
                    pageToken: pageToken,
                    key: apiKey
                },
            }
        );

        if (!res) {
            return NextResponse.json(
                { message: "Failed to fetch videos" },
                { status: 400 }
            );
        }

        // Store the response in cache
        cache.set(cacheKey, res.data);
        console.log("Cached new data:", cacheKey);

        return NextResponse.json(res.data);
    } catch (error: any) {
        console.error("YouTube API Error:", error);
        
        // Handle 403 quota exceeded error specifically
        if (error.response?.status === 403) {
            console.log("Quota exhausted - serving cached data if available");
            
            // Try to return cached data if available
            const cachedFallback = cache.get(cacheKey);
            if (cachedFallback) {
                console.log("Serving cached fallback due to quota exhaustion:", cacheKey);
                return NextResponse.json(cachedFallback);
            }
            
            // No cached data available
            return NextResponse.json(
                { 
                    error: "API quota exhausted",
                    message: "YouTube API quota has been exceeded. Please try again later."
                },
                { status: 429 } // Use 429 Too Many Requests instead of 403
            );
        }
        
        // For other errors, try to return cached data if available
        const cachedFallback = cache.get(cacheKey);
        if (cachedFallback) {
            console.log("API failed, serving cached fallback:", cacheKey);
            return NextResponse.json(cachedFallback);
        }
        
        // No cached data available for other errors
        return NextResponse.json(
            { 
                error: "Failed to fetch search videos",
                message: error.response?.data?.error?.message || error.message
            },
            { status: error.response?.status || 500 }
        );
    }
}