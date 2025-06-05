import {CreateSongRequest, Song} from "./Song";

// types/Playlist.ts
export interface Playlist {          // ← Data from API
    id: number;
    name: string;
    songs?: Song[];
    // ... other fields
}

export interface PlaylistProps {     // ← Component props
    id: number;
    selected: string;
    songs: Song[];
    onAddSong: (song: CreateSongRequest) => void;
    onSongSelect: (url: string, index: number) => void;
}
export interface CreatePlaylistRequest {
    name: string;
    description?: string;
}

export interface UpdatePlaylistRequest {
    name?: string;
    description?: string;
}