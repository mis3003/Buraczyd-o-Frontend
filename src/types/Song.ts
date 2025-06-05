export interface Song {
    id?: number;
    name: string;
    url: string;
    source: 'youtube' | 'spotify';
    playlistId?: number; // Make this optional for creation
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateSongRequest {
    name: string;
    url: string;
    source: 'youtube' | 'spotify';
}