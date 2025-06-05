import { useEffect, useState } from 'react';
import { ScrollArea, Stack, Title, Text, Button } from '@mantine/core';
import {createPlaylist, getUserPlaylists, getUserPlaylistsWithSongs} from '../../services/playlistService';
import { Playlist } from '../../types/Playlist';
import classes from './Sidebar.module.css';

export function Sidebar({
                            onSelect,
                        }: {
    onSelect: (playlist: Playlist) => void;
}) {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const data = await getUserPlaylistsWithSongs();
                setPlaylists(data);
            } catch (error) {
                console.error('Błąd podczas pobierania playlist:', error);
            }
        };
        fetchPlaylists();
    }, []);

    useEffect(() => {
        console.log("Playlists zaktualizowane:", playlists);
    }, [playlists]);

    const handleAddPlaylist = async () => {
        const name = prompt('Podaj nazwę nowej playlisty:');
        if (name) {
            try {
                const newPlaylist = await createPlaylist({ name });
                setPlaylists((prev) => [...prev, newPlaylist]);
            } catch (error) {
                console.error('Błąd podczas tworzenia playlisty:', error);
            }
        }
    };

    const handleSelect = (playlist: Playlist) => {
        console.log(playlist.playlistId);
        console.log(playlist.songs);
        setSelectedId(playlist.playlistId);
        onSelect(playlist);
    };

    return (
        <aside className={classes.sidebar}>
            <Title order={4} className={classes.title}>Biblioteka</Title>
            <Button onClick={handleAddPlaylist} fullWidth size="xs" mb="sm">
                Dodaj playlistę
            </Button>
            <ScrollArea h="80vh">
                <Stack>
                    {playlists.map((playlist) => (
                        <Text
                            key={playlist.playlistId}
                            className={`${classes.item} ${selectedId === playlist.playlistId ? classes.activeItem : ''}`}
                            onClick={() => handleSelect(playlist)}
                        >
                            {playlist.name}
                        </Text>
                    ))}
                </Stack>
            </ScrollArea>
        </aside>
    );
}