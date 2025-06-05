export interface Song {
    songId?: number;
    title: string;
    songUrl: string;
    platform: 'youtube' | 'spotify';
    playlistId?: number; // Make this optional for creation

}

export interface CreateSongRequest {
    title: string;
    songUrl: string;
    platform: 'youtube' | 'spotify';
}