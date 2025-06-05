import { Song } from '../types/Song';

const API_URL = process.env.REACT_APP_API_BASE_URL!;


export async function getSongsByPlaylistId(playlistId: number): Promise<Song[]> {
    const response = await fetch(`${API_URL}/playlist/${playlistId}`, {
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Nie udało się pobrać piosenek');
    }

    return await response.json();
}

export async function createSong(song: Song): Promise<Song> {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(song),
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Nie udało się utworzyć piosenki');
    }

    return await response.json();
}
