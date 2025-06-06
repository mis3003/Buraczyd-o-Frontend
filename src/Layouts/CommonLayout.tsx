import React, { useState } from 'react';
import { AppShell } from '@mantine/core';
import { Header } from '../components/Header/Header';
import { Footer } from '../components/Footer/Footer';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { Playlist as PlaylistComponent } from '../components/Playlist/Playlist';
import { Playlist } from '../types/Playlist';
import { Song, CreateSongRequest } from '../types/Song';

export const CommonLayout = ({ children }: any) => {
    const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
    const [playingPlaylist, setPlayingPlaylist] = useState<Playlist | null>(null);
    const [playlistData, setPlaylistData] = useState<{ [playlistId: number]: Song[] }>({});

    const [currentIndex, setCurrentIndex] = useState(0);
    const API_URL = process.env.REACT_APP_API_BASE_URL!;
    const handleSongSelect = (playlist: Playlist, url: string, index: number) => {
        setPlayingPlaylist(playlist);
        setCurrentIndex(index);
    };

    const handleAddSong = (songRequest: Song) => {
        if (!selectedPlaylist) return;

        const newSong: Song = {
            songId: Date.now(), // tymczasowe ID
            title: songRequest.title,
            songUrl: songRequest.songUrl,
            platform: songRequest.platform,
            playlistId: selectedPlaylist.playlistId,
        };

        setPlaylistData((prev) => ({
            ...prev,
            [selectedPlaylist.playlistId]: [...(prev[selectedPlaylist.playlistId] || []), newSong],
        }));
    };


    const handleDeleteSong = async (songId: number) => {
        try {
            const response = await fetch(`${API_URL}/songs/${songId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Nie udało się usunąć piosenki');
            }

            // Możesz też opcjonalnie wyświetlić toast albo komunikat
            console.log('Piosenka została usunięta');

            if (!selectedPlaylist) return;

            const { playlistId } = selectedPlaylist;

            setPlaylistData((prev) => ({
                ...prev,
                [playlistId]: prev[playlistId].filter((song) => song.songId !== songId),
            }));
        } catch (error) {
            console.error('Błąd podczas usuwania piosenki:', error);
        }
    };


    return (
        <AppShell header={{ height: 60 }} navbar={{ width: 250, breakpoint: 'sm' }}>
            <AppShell.Header>
                <Header />
            </AppShell.Header>

            <AppShell.Navbar>
                <Sidebar
                    onSelect={(playlist) => {
                        setSelectedPlaylist(playlist);

                        // Save songs into playlistData if not already present
                        setPlaylistData((prev) => ({
                            ...prev,
                            [playlist.playlistId]: prev[playlist.playlistId] || playlist.songs, // only set if not already
                        }));
                    }}
                />
            </AppShell.Navbar>

            <AppShell.Main style={{ paddingLeft: 300 }}>
                {selectedPlaylist && (
                    <PlaylistComponent
                        id={selectedPlaylist.playlistId}
                        selected={selectedPlaylist.name}
                        songs={playlistData[selectedPlaylist.playlistId] || []}
                        onAddSong={handleAddSong}
                        onSongSelect={(url, index) => handleSongSelect(selectedPlaylist, url, index)}
                        onDeleteSong={(songId) => handleDeleteSong(songId)}
                    />
                )}
            </AppShell.Main>

            <AppShell.Footer>
                <Footer
                    playlist={(playingPlaylist ? playlistData[playingPlaylist.playlistId] : []) || []}
                    currentIndex={currentIndex}
                    setCurrentIndex={setCurrentIndex}
                />
            </AppShell.Footer>
        </AppShell>
    );
};
