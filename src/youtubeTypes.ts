export interface YoutubeVideo {
    id?: { videoId?: string } | string;
    snippet: {
        title: string;
        thumbnails: {
            medium: {url: string};
        };
        channelTitle: string;
    };
}

export interface YoutubeResponse {
    nextPageToken?: string,
    prevPageToken?: string,
    items: YoutubeVideo[];
}